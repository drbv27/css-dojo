import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";
import CohortConfig from "@/lib/models/CohortConfig";
import User from "@/lib/models/User";
import { ALL_MODULES } from "@/data/modules";

// Migracion one-shot al modelo por cohortes:
// - Alumnos existentes -> cohorte 1.
// - Snapshot de la visibilidad ACTUAL como ajustes explicitos de la cohorte 1
//   (asi la cohorte 1 mantiene exactamente lo que ve hoy bajo la nueva semantica
//    "activo solo si existe doc enabled=true").
// - Crea CohortConfig { activeCohort: 1, cohortCount: 2 } para que la cohorte 2
//   exista (arranca vacia = bloqueada) y se pueda pre-configurar.
// GET = preview (no escribe). POST = aplicar (idempotente: no re-corre si ya migro).

async function computePlan() {
  // Estado legacy: docs sin campo cohort (modelo global anterior).
  const legacy = await ModuleSettings.find({ cohort: { $exists: false } }).lean();
  const legacyMap = new Map<string, boolean>(legacy.map((d) => [d.slug, d.enabled]));

  // Bajo la semantica anterior: visible si no hay doc o enabled=true.
  const effective = (slug: string) => (legacyMap.has(slug) ? legacyMap.get(slug)! : true);

  const visibleSlugs = ALL_MODULES.filter((m) => effective(m.slug)).map((m) => m.slug);
  const usersMissing = await User.countDocuments({ cohort: { $exists: false } });
  const alreadyMigrated = Boolean(await CohortConfig.findOne({ key: "config" }));

  return {
    alreadyMigrated,
    usersToMigrate: usersMissing,
    totalModules: ALL_MODULES.length,
    cohort1Visible: visibleSlugs.length,
    cohort1Hidden: ALL_MODULES.length - visibleSlugs.length,
    visibleSlugs,
  };
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  await dbConnect();
  const plan = await computePlan();
  return NextResponse.json({ mode: "preview", ...plan });
}

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  await dbConnect();

  const plan = await computePlan();
  if (plan.alreadyMigrated) {
    return NextResponse.json({ ok: true, skipped: "ya migrado", ...plan });
  }

  // 1) Borrar el indice unico VIEJO sobre slug ANTES de escribir. Si no, insertar
  //    docs de cohorte-1 con slugs que ya existen en docs legacy choca con slug_1
  //    (duplicate key) y la migracion falla.
  try {
    await ModuleSettings.collection.dropIndex("slug_1");
  } catch {
    // el indice viejo ya no existe: ok
  }

  // 2) Snapshot de la cohorte 1 = visibilidad efectiva actual (docs explicitos).
  const ops = ALL_MODULES.map((m) => ({
    updateOne: {
      filter: { cohort: 1, slug: m.slug },
      update: { cohort: 1, slug: m.slug, enabled: plan.visibleSlugs.includes(m.slug) },
      upsert: true,
    },
  }));
  await ModuleSettings.bulkWrite(ops);

  // 3) Eliminar SOLO los docs legacy de MODULOS DE CURSO (sin cohort).
  //    OJO: los juegos (slug "game-*") viven en esta misma coleccion y son
  //    globales -> NO se tocan.
  const courseSlugs = ALL_MODULES.map((m) => m.slug);
  await ModuleSettings.deleteMany({ cohort: { $exists: false }, slug: { $in: courseSlugs } });

  // 4) Asegurar el indice compuesto.
  await ModuleSettings.syncIndexes();

  // 5) Alumnos existentes -> cohorte 1.
  await User.updateMany({ cohort: { $exists: false } }, { $set: { cohort: 1 } });

  // 6) Config: cohorte activa 1 (los nuevos siguen en 1 hasta que actives la 2),
  //    y cohortCount 2 para poder pre-configurar la cohorte 2 desde ya.
  await CohortConfig.create({ key: "config", activeCohort: 1, cohortCount: 2 });

  return NextResponse.json({ ok: true, applied: true, ...plan });
}
