#!/usr/bin/env node
/**
 * Siembra una BD de PREVIEW aislada (cssdojo_preview) en el mismo cluster,
 * para revisar la feature de cohortes SIN tocar produccion.
 * Lee MONGODB_URI de .env.local y le cambia el nombre de la BD a cssdojo_preview.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadUri() {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (t.startsWith("MONGODB_URI=")) {
      let v = t.slice("MONGODB_URI=".length).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      return v;
    }
  }
  throw new Error("No MONGODB_URI en .env.local");
}

// Cambia el nombre de la BD en la URI (…/cssdojo?… -> …/cssdojo_preview?…)
function toPreview(uri) {
  return uri.replace(/\/([^/?]+)(\?|$)/, "/cssdojo_preview$2");
}

async function main() {
  const previewUri = toPreview(loadUri());
  console.log("Preview URI:", previewUri.replace(/\/\/[^@]+@/, "//****:****@"));
  await mongoose.connect(previewUri, { bufferCommands: false });
  const db = mongoose.connection;

  // Limpiar colecciones de preview (idempotente)
  for (const c of ["users", "modulesettings", "cohortconfigs"]) {
    await db.collection(c).deleteMany({}).catch(() => {});
    await db.collection(c).dropIndexes().catch(() => {});
  }

  const hash = await bcrypt.hash("preview123", 12);

  // Profesor (para entrar al panel) — sin campo cohort (simula usuario existente)
  await db.collection("users").insertOne({
    name: "Profe Preview",
    email: "profe@preview.test",
    password: hash,
    role: "teacher",
    approved: true,
    xp: 0,
    level: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Alumnos existentes (sin cohort -> deberian migrar a cohorte 1)
  const students = ["Ana", "Beto", "Caro", "Dani", "Emi"].map((n, i) => ({
    name: `${n} Alumno`,
    email: `${n.toLowerCase()}@preview.test`,
    password: hash,
    role: "student",
    approved: true,
    xp: (i + 1) * 120,
    level: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await db.collection("users").insertMany(students);

  // Un par de ajustes legacy globales (para ver el snapshot): desactivo 2 modulos.
  await db.collection("modulesettings").insertMany([
    { slug: "css-grid", enabled: false },
    { slug: "media-queries", enabled: false },
  ]);
  // Reproduce el estado de PROD: indice unico viejo sobre slug.
  await db.collection("modulesettings").createIndex({ slug: 1 }, { unique: true });

  console.log("\n✓ Preview sembrado:");
  console.log("  Profesor: profe@preview.test  /  preview123");
  console.log("  5 alumnos (ana/beto/caro/dani/emi @preview.test / preview123), sin cohorte -> migran a 1");
  console.log("  2 modulos desactivados globalmente (css-grid, media-queries) para ver el snapshot");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
