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

  const cohort = await cohorteDe(sesion.id);
  return { enabledSlugs: await slugsHabilitadosParaCohorte(cohort), cohort };
}

/**
 * La cohorte de un alumno, con el mismo default que usa la visibilidad: sin
 * cohorte declarada cae en la 1, en vez de quedarse sin nada.
 */
export async function cohorteDe(userId: string): Promise<number> {
  const user = await User.findById(userId).select("cohort").lean();
  return user?.cohort ?? 1;
}

/**
 * La regla de visibilidad POST-MIGRACION, aislada de la sesion.
 *
 * La extrajo el feature de certificados, que necesita "que ve la cohorte N" y
 * no "que ve este usuario": `slugsVisiblesPara` le devuelve TODOS los modulos a
 * un profesor, y un certificado calculado con esa lista exigiria modulos que la
 * cohorte nunca vio. Es la misma regla, no una copia -- la rama migrada de
 * `slugsVisiblesPara` llama aca.
 *
 * OJO con el pre-migracion: esta funcion implementa solo el modelo por
 * cohortes. Antes de migrar no hay documentos con `cohort`, asi que devuelve
 * vacio, y un conjunto de obligatorios vacio NO otorga certificado. Falla del
 * lado seguro a proposito.
 *
 * Devuelve en orden de curriculum, no en orden de los ajustes.
 */
export async function slugsHabilitadosParaCohorte(cohort: number): Promise<string[]> {
  const settings = await ModuleSettings.find({ cohort, enabled: true }).lean();
  const enabledSet = new Set(settings.map((s) => s.slug));
  return ALL_MODULES.filter((m) => enabledSet.has(m.slug)).map((m) => m.slug);
}
