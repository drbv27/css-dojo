#!/usr/bin/env node
// Diagnostico DETALLADO (solo lectura) del estado de cohortes en produccion.
import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function loadUri() {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (t.startsWith("MONGODB_URI=")) {
      let v = t.slice(12).trim().replace(/^["']|["']$/g, "");
      return v;
    }
  }
  throw new Error("No MONGODB_URI");
}

const uri = loadUri();
console.log("BD:", uri.replace(/\/\/[^@]+@/, "//****:****@"), "\n");
await mongoose.connect(uri, { bufferCommands: false });
const db = mongoose.connection;

// 1) Config de cohortes
const cfg = await db.collection("cohortconfigs").findOne({ key: "config" });
console.log("== CohortConfig ==");
console.log(cfg ? { activeCohort: cfg.activeCohort, cohortCount: cfg.cohortCount } : "NO EXISTE");

// 2) Alumnos por cohorte
console.log("\n== Alumnos (role student) por cohorte ==");
const byCohort = await db.collection("users").aggregate([
  { $match: { role: "student" } },
  { $group: { _id: "$cohort", n: { $sum: 1 } } },
  { $sort: { _id: 1 } },
]).toArray();
byCohort.forEach((c) => console.log(`  cohorte ${c._id === undefined || c._id === null ? "(sin campo)" : c._id}: ${c.n} alumnos`));

// 3) Ultimos 8 alumnos registrados (para ver la cohorte de los nuevos)
console.log("\n== Ultimos 8 alumnos registrados (email | cohort | createdAt) ==");
const recientes = await db.collection("users").find({ role: "student" })
  .project({ email: 1, cohort: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(8).toArray();
recientes.forEach((u) => console.log(`  ${u.email} | cohorte=${u.cohort} | ${u.createdAt?.toISOString?.() ?? u.createdAt}`));

// 4) ModuleSettings por cohorte: cuantos enabled=true/false, y HTML en detalle
console.log("\n== ModuleSettings por cohorte ==");
const cohortsPresentes = [...new Set((await db.collection("modulesettings").distinct("cohort")))];
for (const c of cohortsPresentes.sort()) {
  const enabled = await db.collection("modulesettings").countDocuments({ cohort: c, enabled: true });
  const disabled = await db.collection("modulesettings").countDocuments({ cohort: c, enabled: false });
  console.log(`  cohorte ${c}: ${enabled} activos, ${disabled} inactivos`);
  const htmlDocs = await db.collection("modulesettings")
    .find({ cohort: c, slug: /^html-/ }).project({ slug: 1, enabled: 1 }).sort({ slug: 1 }).toArray();
  const htmlOn = htmlDocs.filter((d) => d.enabled).map((d) => d.slug);
  const htmlOff = htmlDocs.filter((d) => !d.enabled).map((d) => d.slug);
  console.log(`     HTML activos (${htmlOn.length}): ${htmlOn.join(", ") || "—"}`);
  console.log(`     HTML inactivos (${htmlOff.length}): ${htmlOff.join(", ") || "—"}`);
}

// 5) Juegos (deben seguir sin cohort)
const games = await db.collection("modulesettings").countDocuments({ slug: /^game-/ });
console.log(`\n== Juegos (game-*): ${games} docs ==`);

await mongoose.disconnect();
