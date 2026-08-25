import { ALL_MODULES } from "@/data/modules";
import Progress from "@/lib/models/Progress";
import { cohorteDe, slugsHabilitadosParaCohorte } from "@/lib/moduleVisibility";
import type { DojoType, ModuleData } from "@/types";

/**
 * The certificate rules for a track.
 *
 * The one thing to keep in mind while reading this file: `nivel` is optional on
 * `ModuleData`, and its absence means "not classified" — NEVER "obligatorio".
 * Everything below is what makes that default safe instead of dangerous.
 */

/** The subset of a module this file needs. Keeps fixtures honest and small. */
export type ModuloClasificable = Pick<ModuleData, "dojo" | "slug" | "nivel">;

/**
 * Whether a track can issue certificates at all.
 *
 * A union rather than `{ certificable: boolean; sinClasificar: number }`, so
 * that "certifiable, and also 7 modules are unclassified" is not representable.
 * Same reason `JsRunOutcome` in `@/types` is a union.
 */
export type Certificabilidad =
  | { certificable: true; obligatorios: string[] }
  | { certificable: false; motivo: "sin-clasificar"; sinClasificar: string[] }
  | { certificable: false; motivo: "track-vacio" };

/**
 * THE SAFETY GATE. A track certifies only when EVERY one of its modules
 * declares a `nivel`.
 *
 * Why the whole track and not just the required ones: a module with no level is
 * a module nobody decided about. Reading it as "not required" would quietly
 * shrink the minimum path; reading it as "required" would quietly grow it. The
 * only honest answer is to refuse to certify the track until someone decides,
 * and to say how many decisions are missing.
 *
 * Measured 2026-08-25: only `css` (30 modules) is fully classified. `js` 29,
 * `react` 20, `html` 17, `react-eco` 5 and `nextjs` 5 — 76 modules — are not,
 * so those five tracks refuse to certify. That is the designed state, not a
 * pending task.
 *
 * The empty track is its own case on purpose: "every module declares a level"
 * is VACUOUSLY TRUE over zero modules, which would make a track with no content
 * certifiable, and then trivially completable. A `DojoType` that ships before
 * its modules do would hand out certificates for nothing.
 */
export function certificabilidadDe(
  modulos: readonly ModuloClasificable[],
  dojo: DojoType,
): Certificabilidad {
  const delTrack = modulos.filter((m) => m.dojo === dojo);

  if (delTrack.length === 0) {
    return { certificable: false, motivo: "track-vacio" };
  }

  const sinClasificar = delTrack
    .filter((m) => m.nivel === undefined)
    .map((m) => m.slug);

  if (sinClasificar.length > 0) {
    return { certificable: false, motivo: "sin-clasificar", sinClasificar };
  }

  return {
    certificable: true,
    obligatorios: delTrack
      .filter((m) => m.nivel === "obligatorio")
      .map((m) => m.slug),
  };
}

/** `certificabilidadDe` bound to the real curriculum. */
export function esCertificable(dojo: DojoType): Certificabilidad {
  return certificabilidadDe(ALL_MODULES, dojo);
}

// ==================== Elegibilidad ====================

/** A module as eligibility needs to read it: its level and its exercise ids. */
export type ModuloExigible = ModuloClasificable & {
  exercises: readonly { id: string }[];
};

/**
 * Why a student is or is not eligible.
 *
 * The eligible branch carries `modulos` and `ejerciciosPorModulo` because those
 * two ARE the snapshot a certificate freezes. Computing them here rather than
 * again at award time removes the window where the award writes a different
 * requirement than the one it just checked.
 */
export type Elegibilidad =
  | {
      elegible: true;
      cohort: number;
      modulos: string[];
      ejerciciosPorModulo: Record<string, number>;
    }
  | { elegible: false; motivo: "track-no-certificable"; detalle: Certificabilidad }
  | { elegible: false; motivo: "sin-obligatorios-habilitados"; cohort: number }
  | { elegible: false; motivo: "sin-ejercicios-exigidos"; cohort: number; modulos: string[] }
  | {
      elegible: false;
      motivo: "faltan-ejercicios";
      cohort: number;
      modulos: string[];
      /** Exercise ids still missing, per module. Only modules with gaps appear. */
      faltantes: Record<string, string[]>;
    };

/**
 * The required modules of a track FOR ONE COHORT: the `"obligatorio"` modules
 * of the track that are enabled for that cohort, in curriculum order.
 *
 * The cohort scope is the whole point, and it came out of a measurement: with a
 * global rule, 0 of 35 students qualify, and the best nine reach 17 of 19. The
 * two they miss are `tailwind-css` and `proyecto-cv-css` — one because their
 * course ended first, the other because it had no `ModuleSettings` document at
 * all and was therefore invisible.
 *
 * A student cannot complete what was never shown them. A rule that certifies
 * nobody is broken, not strict.
 */
export function modulosExigidosDe(
  modulos: readonly ModuloClasificable[],
  dojo: DojoType,
  habilitados: readonly string[],
): string[] {
  const habilitadosSet = new Set(habilitados);
  return modulos
    .filter(
      (m) =>
        m.dojo === dojo && m.nivel === "obligatorio" && habilitadosSet.has(m.slug),
    )
    .map((m) => m.slug);
}

/**
 * Eligibility, pure. Takes everything it needs so the scenarios that decide
 * this feature can be written as data instead of as database fixtures.
 *
 * `completados` maps a module slug to the exercise ids that student has
 * completed. It is a SET COVER check, not a count: comparing
 * `completados.size >= exercises.length` would let a stale progress row for a
 * renamed exercise pay for a real one that was never done.
 */
export function elegibilidadDe(
  modulos: readonly ModuloExigible[],
  dojo: DojoType,
  cohort: number,
  habilitados: readonly string[],
  completados: ReadonlyMap<string, ReadonlySet<string>>,
): Elegibilidad {
  const cert = certificabilidadDe(modulos, dojo);
  if (!cert.certificable) {
    return { elegible: false, motivo: "track-no-certificable", detalle: cert };
  }

  const exigidos = modulosExigidosDe(modulos, dojo, habilitados);

  // NOT trivially eligible over an empty set. A cohort with nothing required
  // enabled has not finished the track; it has not started it.
  if (exigidos.length === 0) {
    return { elegible: false, motivo: "sin-obligatorios-habilitados", cohort };
  }

  const porSlug = new Map(modulos.map((m) => [m.slug, m]));
  const faltantes: Record<string, string[]> = {};
  const ejerciciosPorModulo: Record<string, number> = {};

  for (const slug of exigidos) {
    const ejercicios = porSlug.get(slug)!.exercises;
    ejerciciosPorModulo[slug] = ejercicios.length;
    const hechos = completados.get(slug) ?? new Set<string>();
    const faltan = ejercicios.filter((e) => !hechos.has(e.id)).map((e) => e.id);
    if (faltan.length > 0) faltantes[slug] = faltan;
  }

  // The same vacuity trap as `track-vacio`, one level down: if every demanded
  // module happens to carry zero exercises, "completed every exercise" is true
  // for a student who has done nothing at all.
  const totalExigido = Object.values(ejerciciosPorModulo).reduce((a, b) => a + b, 0);
  if (totalExigido === 0) {
    return { elegible: false, motivo: "sin-ejercicios-exigidos", cohort, modulos: exigidos };
  }

  if (Object.keys(faltantes).length > 0) {
    return {
      elegible: false,
      motivo: "faltan-ejercicios",
      cohort,
      modulos: exigidos,
      faltantes,
    };
  }

  return { elegible: true, cohort, modulos: exigidos, ejerciciosPorModulo };
}

/**
 * `elegibilidadDe` bound to the database and the real curriculum.
 *
 * Reads, in order: the student's cohort, what that cohort has enabled, and the
 * student's completed exercises for the demanded modules only.
 *
 * The visibility half comes from `@/lib/moduleVisibility` on purpose. It is the
 * same rule the app uses to decide what a student can even open, and two copies
 * of a visibility rule is exactly how they drift apart.
 */
export async function esElegible(
  userId: string,
  dojo: DojoType,
): Promise<Elegibilidad> {
  const cert = esCertificable(dojo);
  if (!cert.certificable) {
    // Short-circuits BEFORE any database work: an unclassified track can never
    // award, so reading a student's progress for it would be wasted anyway.
    return { elegible: false, motivo: "track-no-certificable", detalle: cert };
  }

  const cohort = await cohorteDe(userId);
  const habilitados = await slugsHabilitadosParaCohorte(cohort);
  const exigidos = modulosExigidosDe(ALL_MODULES, dojo, habilitados);

  const docs = await Progress.find({
    userId,
    moduleId: { $in: exigidos },
    completed: true,
  })
    .select("moduleId exerciseId")
    .lean();

  const completados = new Map<string, Set<string>>();
  for (const d of docs) {
    const set = completados.get(d.moduleId) ?? new Set<string>();
    set.add(d.exerciseId);
    completados.set(d.moduleId, set);
  }

  return elegibilidadDe(ALL_MODULES, dojo, cohort, habilitados, completados);
}
