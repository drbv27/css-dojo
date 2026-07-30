#!/usr/bin/env node
// ARREGLO de produccion (cohortes):
//  1) Cohorte 1 -> restaurar TODOS sus modulos a activo (deshacer desactivaciones por error).
//  2) Cohorte 2 -> activar HTML 1-4 (donde iba Diego); el resto queda bloqueado.
// NO toca los juegos (docs sin cohort). Solo lectura->escritura sobre cohorte 1 y 2.
import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function loadUri() {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (t.startsWith("MONGODB_URI=")) return t.slice(12).trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("No MONGODB_URI");
}

const HTML_1_4 = [
  "html-01-que-es-html",
  "html-02-estructura-basica",
  "html-03-texto-y-encabezados",
  "html-04-enlaces",
];

const uri = loadUri();
console.log("BD:", uri.replace(/\/\/[^@]+@/, "//****:****@"), "\n");
await mongoose.connect(uri, { bufferCommands: false });
const ms = mongoose.connection.collection("modulesettings");

// 1) Cohorte 1 -> todo activo
const r1 = await ms.updateMany({ cohort: 1 }, { $set: { enabled: true } });
console.log(`Cohorte 1: reactivados (matched ${r1.matchedCount}, modified ${r1.modifiedCount}) -> todo activo`);

// 2) Cohorte 2 -> HTML 1-4 activos (upsert)
for (const slug of HTML_1_4) {
  await ms.updateOne(
    { cohort: 2, slug },
    { $set: { cohort: 2, slug, enabled: true } },
    { upsert: true }
  );
}
console.log(`Cohorte 2: activados ${HTML_1_4.length} temas de HTML -> ${HTML_1_4.join(", ")}`);

// Verificacion
console.log("\n== Verificacion ==");
for (const c of [1, 2]) {
  const on = await ms.countDocuments({ cohort: c, enabled: true });
  const off = await ms.countDocuments({ cohort: c, enabled: false });
  console.log(`  cohorte ${c}: ${on} activos, ${off} inactivos`);
}
const c2 = await ms.find({ cohort: 2, enabled: true }).project({ slug: 1 }).toArray();
console.log(`  cohorte 2 activos: ${c2.map((d) => d.slug).join(", ")}`);

await mongoose.disconnect();
