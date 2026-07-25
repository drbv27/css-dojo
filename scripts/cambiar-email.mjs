#!/usr/bin/env node
/**
 * Cambia el correo de un usuario SIN perder nada:
 * conserva _id (progreso, playgrounds, XP, nivel, rachas, badges) y el hash de la contraseña.
 * Solo modifica el campo `email`.
 *
 * Uso:
 *   node scripts/cambiar-email.mjs <correoViejo> <correoNuevo>            # dry-run (no escribe)
 *   node scripts/cambiar-email.mjs <correoViejo> <correoNuevo> --apply    # aplica el cambio
 *
 * Lee MONGODB_URI de .env.local. Asegúrate de que apunte a la BD correcta (producción).
 */
import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- Cargar .env.local sin dependencias externas ---
function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.local opcional si MONGODB_URI ya viene del entorno
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function main() {
  loadEnv();

  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const positional = args.filter((a) => !a.startsWith("--"));
  const [oldRaw, newRaw] = positional;

  if (!oldRaw || !newRaw) {
    console.error(
      "Uso: node scripts/cambiar-email.mjs <correoViejo> <correoNuevo> [--apply]"
    );
    process.exit(1);
  }

  const oldEmail = oldRaw.trim().toLowerCase();
  const newEmail = newRaw.trim().toLowerCase();

  if (!EMAIL_RE.test(newEmail)) {
    console.error(`✗ El correo nuevo no tiene formato válido: ${newEmail}`);
    process.exit(1);
  }
  if (oldEmail === newEmail) {
    console.error("✗ El correo viejo y el nuevo son iguales, nada que hacer.");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ Falta MONGODB_URI (en .env.local o el entorno).");
    process.exit(1);
  }

  const modo = apply ? "APLICAR (escribe)" : "DRY-RUN (no escribe)";
  console.log(`\n=== Cambio de correo — modo: ${modo} ===`);
  console.log(`Cluster: ${uri.replace(/\/\/[^@]+@/, "//****:****@")}\n`);

  await mongoose.connect(uri, { bufferCommands: false });
  const users = mongoose.connection.collection("users");

  // 1) El usuario viejo debe existir
  const user = await users.findOne({ email: oldEmail });
  if (!user) {
    console.error(`✗ No existe ningún usuario con el correo: ${oldEmail}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 2) El correo nuevo no debe estar tomado por OTRO usuario
  const clash = await users.findOne({ email: newEmail });
  if (clash && String(clash._id) !== String(user._id)) {
    console.error(
      `✗ El correo nuevo ya está en uso por otro usuario (id ${clash._id}). Abortando.`
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  // 3) Datos ligados al usuario (para verificar que NO se tocan)
  const progressCount = await mongoose.connection
    .collection("progresses")
    .countDocuments({ userId: user._id })
    .catch(() => "?");
  const playgroundCount = await mongoose.connection
    .collection("playgrounds")
    .countDocuments({ userId: user._id })
    .catch(() => "?");

  console.log("Usuario encontrado:");
  console.log(`  _id:        ${user._id}   (NO cambia → todo queda enlazado)`);
  console.log(`  nombre:     ${user.name}`);
  console.log(`  rol:        ${user.role}`);
  console.log(`  correo:     ${user.email}   →   ${newEmail}`);
  console.log(`  password:   (hash intacto, no se toca)`);
  console.log(`  xp/nivel:   ${user.xp} XP / nivel ${user.level}`);
  console.log(`  badges:     ${(user.badges || []).length}`);
  console.log(`  progreso:   ${progressCount} registros`);
  console.log(`  playgrounds:${playgroundCount} registros\n`);

  if (!apply) {
    console.log("DRY-RUN: no se escribió nada. Vuelve a correr con --apply para aplicar.\n");
    await mongoose.disconnect();
    return;
  }

  const res = await users.updateOne(
    { _id: user._id },
    { $set: { email: newEmail } }
  );
  console.log(
    `✓ Aplicado. matched=${res.matchedCount} modified=${res.modifiedCount}`
  );
  console.log(`  El alumno ahora entra con: ${newEmail} + su misma contraseña.\n`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
