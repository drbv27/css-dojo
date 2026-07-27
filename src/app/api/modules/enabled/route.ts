import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";
import User from "@/lib/models/User";
import { readCohortConfig } from "@/lib/models/CohortConfig";
import { ALL_MODULES } from "@/data/modules";

// Devuelve los slugs de modulos VISIBLES para el alumno segun su cohorte.
// - Profesor: ve todos.
// - Antes de migrar (sin CohortConfig): comportamiento LEGACY global
//   (visible salvo doc enabled=false) para no romper nada durante el deploy.
// - Despues de migrar: visible solo si existe ajuste enabled=true en su cohorte
//   (por defecto bloqueado -> las cohortes nuevas arrancan cerradas).
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ enabledSlugs: [] });
  }

  await dbConnect();

  if (session.role === "teacher") {
    return NextResponse.json({ enabledSlugs: ALL_MODULES.map((m) => m.slug) });
  }

  const { migrated } = await readCohortConfig();

  // Fallback legacy: mientras no se migre, todo visible salvo lo desactivado.
  if (!migrated) {
    const legacy = await ModuleSettings.find({}).lean();
    const map = new Map<string, boolean>(legacy.map((s) => [s.slug, s.enabled]));
    const enabledSlugs = ALL_MODULES.filter((m) => {
      const v = map.get(m.slug);
      return v === undefined || v === true;
    }).map((m) => m.slug);
    return NextResponse.json({ enabledSlugs });
  }

  // Modelo por cohorte: visible solo si hay doc enabled=true.
  const user = await User.findById(session.id).select("cohort").lean();
  const cohort = user?.cohort ?? 1;
  const settings = await ModuleSettings.find({ cohort, enabled: true }).lean();
  const enabledSet = new Set(settings.map((s) => s.slug));
  const enabledSlugs = ALL_MODULES.filter((m) => enabledSet.has(m.slug)).map((m) => m.slug);

  return NextResponse.json({ enabledSlugs, cohort });
}
