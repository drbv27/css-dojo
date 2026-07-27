#!/usr/bin/env node
// Diagnostico SOLO LECTURA del estado de la migracion de cohortes en produccion.
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
      let v = t.slice("MONGODB_URI=".length).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      return v;
    }
  }
  throw new Error("No MONGODB_URI");
}

const uri = loadUri();
console.log("BD:", uri.replace(/\/\/[^@]+@/, "//****:****@"));
await mongoose.connect(uri, { bufferCommands: false });
const db = mongoose.connection;

const cfg = await db.collection("cohortconfigs").findOne({ key: "config" });
console.log("\nCohortConfig:", cfg ? { activeCohort: cfg.activeCohort, cohortCount: cfg.cohortCount } : "NO EXISTE (=> no migrado)");

const ms = db.collection("modulesettings");
const total = await ms.countDocuments({});
const withCohort = await ms.countDocuments({ cohort: { $exists: true } });
const noCohort = await ms.countDocuments({ cohort: { $exists: false } });
const games = await ms.countDocuments({ slug: /^game-/ });
console.log("\nmodulesettings:");
console.log("  total:", total, "| con cohort:", withCohort, "| sin cohort:", noCohort, "| juegos (game-*):", games);
const byCohort = await ms.aggregate([{ $group: { _id: "$cohort", n: { $sum: 1 } } }]).toArray();
console.log("  por cohort:", byCohort.map((c) => `${c._id}=${c.n}`).join("  "));

const idx = await ms.indexes();
console.log("  indices:", idx.map((i) => i.name + (i.unique ? "(unique)" : "")).join(", "));

const users = db.collection("users");
const uTotal = await users.countDocuments({ role: "student" });
const uNoCohort = await users.countDocuments({ role: "student", cohort: { $exists: false } });
console.log("\nalumnos:", uTotal, "| sin cohort:", uNoCohort);

await mongoose.disconnect();
