import ModuleSettings from "@/lib/models/ModuleSettings";
import User from "@/lib/models/User";
import { readCohortConfig } from "@/lib/models/CohortConfig";
import { ALL_MODULES } from "@/data/modules";

// Regla unica de visibilidad de modulos. Vivia inline en
// `GET /api/modules/enabled`; se extrajo cuando una segunda ruta
// (`POST /api/module-views`) necesito la MISMA regla, porque dos copias de una
// regla de visibilidad es como se desincronizan. Ahora tambien es testeable,
// que antes no lo era.
//
//  - Profesor: ve todos.
//  - Antes de migrar (sin CohortConfig): LEGACY global, visible salvo doc
//    enabled=false, para no romper nada durante el deploy.
//  - Despues de migrar: visible solo si existe ajuste enabled=true en su
//    cohorte. El default es BLOQUEADO, o sea que una cohorte nueva arranca
//    cerrada y un modulo recien agregado NO aparece hasta que alguien lo
//    habilite. No es un bug: es la razon por la que un modulo nuevo puede
//    medir cero visitas sin que nadie lo haya salteado.
export interface SesionVisibilidad {
  id: string;
  role: string;
}

export async function slugsVisiblesPara(
  sesion: SesionVisibilidad,
): Promise<{ enabledSlugs: string[]; cohort?: number }> {
  if (sesion.role === "teacher") {
    return { enabledSlugs: ALL_MODULES.map((m) => m.slug) };
  }

  const { migrated } = await readCohortConfig();

  if (!migrated) {
    const legacy = await ModuleSettings.find({}).lean();
    const map = new Map<string, boolean>(legacy.map((s) => [s.slug, s.enabled]));
    return {
      enabledSlugs: ALL_MODULES.filter((m) => {
        const v = map.get(m.slug);
        return v === undefined || v === true;
      }).map((m) => m.slug),
    };
  }

  const user = await User.findById(sesion.id).select("cohort").lean();
  const cohort = user?.cohort ?? 1;
  const settings = await ModuleSettings.find({ cohort, enabled: true }).lean();
  const enabledSet = new Set(settings.map((s) => s.slug));
  return {
    enabledSlugs: ALL_MODULES.filter((m) => enabledSet.has(m.slug)).map((m) => m.slug),
    cohort,
  };
}
