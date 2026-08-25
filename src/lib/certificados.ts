import { randomBytes } from "node:crypto";
import { ALL_MODULES } from "@/data/modules";
import Certificate from "@/lib/models/Certificate";
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
  | { elegible: false; motivo: "sin-obligatorios"; cohort: number }
  | { elegible: false; motivo: "sin-ejercicios-exigidos"; cohort: number; modulos: string[] }
  | {
      elegible: false;
      motivo: "faltan-ejercicios";
      cohort: number;
      modulos: string[];
      /** Exercise ids still missing, per module. Only modules with gaps appear. */
      faltantes: Record<string, string[]>;
      /**
       * Of the modules with gaps, the ones this cohort HAS NOT BEEN GIVEN yet.
       *
       * Informational, never a gate. It separates "this student is behind" from
       * "the course has not got there", which is the difference between chasing
       * a student and waiting for the calendar. The teacher view needs it; the
       * certificate must not.
       */
      aunNoHabilitados: string[];
    };

/**
 * The required modules of a track: EVERY `"obligatorio"` module of it, in
 * curriculum order. Not intersected with anything.
 *
 * ## This used to be scoped to the cohort's enabled set, and that was wrong
 *
 * The scoped version was justified by a measurement — "0 of 35 students
 * qualify under a global rule; the best nine reach 17 of 19, missing only
 * `tailwind-css` and `proyecto-cv-css`". The measurement was real. It was taken
 * over the WRONG POPULATION.
 *
 * Those nine are necessarily cohort 1: no cohort-2 student can reach 17 of 19,
 * because eight of the nineteen have never been enabled for them (measured
 * 2026-08-25, all of them sit at 0 in all eight). And cohort 1 is explicitly out
 * of scope — it was an experiment and its course ENDED with those two modules
 * never opened.
 *
 * So the scoped rule solved a problem belonging to a cohort nobody is
 * certifying, and created a much worse one for the cohort that matters: it
 * certified people MID-COURSE. Under it, the strongest student of cohort 2
 * qualified for a CSS completion certificate having never seen `flexbox`,
 * `css-grid` or `media-queries`. That is not a certificate, it is a progress
 * report with a seal on it.
 *
 * "A student cannot complete what was never shown them" is true, and the honest
 * consequence is that they are NOT YET FINISHED — not that the requirement
 * shrinks to whatever is open this week. Cohort 1 ending without two modules
 * means cohort 1 does not certify. That is the correct answer for a cohort that
 * did not finish the course.
 *
 * The enabled set is still read, but only to REPORT why a module is missing.
 * See `aunNoHabilitados`.
 */
export function modulosObligatoriosDe(
  modulos: readonly ModuloClasificable[],
  dojo: DojoType,
): string[] {
  return modulos
    .filter((m) => m.dojo === dojo && m.nivel === "obligatorio")
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

  const exigidos = modulosObligatoriosDe(modulos, dojo);

  // NOT trivially eligible over an empty set. A track whose every module is
  // optional has no minimum path, so there is nothing to certify completing.
  if (exigidos.length === 0) {
    return { elegible: false, motivo: "sin-obligatorios", cohort };
  }

  const habilitadosSet = new Set(habilitados);

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
      // Reported, never subtracted from the requirement.
      aunNoHabilitados: Object.keys(faltantes).filter((s) => !habilitadosSet.has(s)),
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
  // Read for REPORTING only. Eligibility demands every required module of the
  // track; what the cohort has open explains a gap, it never excuses one.
  const habilitados = await slugsHabilitadosParaCohorte(cohort);
  const exigidos = modulosObligatoriosDe(ALL_MODULES, dojo);

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

// ==================== Otorgamiento y lectura ====================

/** What a certificate says, read from its own record. */
export interface CertificadoLeido {
  dojo: DojoType;
  cohort: number;
  modulos: string[];
  ejerciciosPorModulo: Record<string, number>;
  otorgadoEn: Date;
  codigo: string;
}

export type Otorgamiento =
  | { otorgado: true; nuevo: boolean; certificado: CertificadoLeido }
  | { otorgado: false; motivo: "no-elegible"; detalle: Elegibilidad };

/**
 * Mongoose gives back a `Map` from a hydrated document and a plain object from
 * `.lean()`. Normalising here keeps that difference out of every caller.
 */
function aConteo(v: unknown): Record<string, number> {
  if (v instanceof Map) return Object.fromEntries(v) as Record<string, number>;
  return { ...(v as Record<string, number>) };
}

function aLeido(doc: {
  dojo: string;
  cohort: number;
  modulos: string[];
  ejerciciosPorModulo: unknown;
  otorgadoEn: Date;
  codigo: string;
}): CertificadoLeido {
  return {
    dojo: doc.dojo as DojoType,
    cohort: doc.cohort,
    modulos: [...doc.modulos],
    ejerciciosPorModulo: aConteo(doc.ejerciciosPorModulo),
    otorgadoEn: doc.otorgadoEn,
    codigo: doc.codigo,
  };
}

/**
 * Reads an AWARDED certificate from its own record.
 *
 * THE WHOLE POINT OF THIS FUNCTION IS WHAT IT DOES NOT DO: it never consults
 * `ALL_MODULES`, never consults `Progress`, and never calls `esElegible`. A
 * certificate is a claim about a past state, and re-deriving it from today's
 * curriculum would silently rewrite what a student was told they earned.
 */
export async function leerCertificado(
  userId: string,
  dojo: DojoType,
): Promise<CertificadoLeido | null> {
  const doc = await Certificate.findOne({ userId, dojo }).lean();
  return doc ? aLeido(doc) : null;
}

/**
 * A stable, human-quotable identifier. Ambiguous characters are left out so a
 * code read off a screen and typed back in does not turn `0` into `O`.
 */
export function generarCodigo(dojo: DojoType, cohort: number): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  const cuerpo = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
  return `${dojo.toUpperCase()}-C${cohort}-${cuerpo}`;
}

/**
 * Awards the certificate of a track, FREEZING what it demanded.
 *
 * Two things this deliberately does not do:
 *
 * 1. It does not recompute the snapshot. The module list and the per-module
 *    exercise counts come from the very eligibility check that just passed, so
 *    there is no window in which the award records a different requirement
 *    than the one it verified.
 *
 * 2. **It does not update an existing certificate.** `design.md` said a second
 *    award "is an update of the record"; that contradicts the snapshot rule it
 *    states three paragraphs earlier — an update is exactly how a frozen
 *    document silently changes. The existing record is returned untouched, with
 *    `nuevo: false`. The spec scenario ("no duplicate document MUST be
 *    created") is satisfied either way; only this reading also satisfies
 *    "reclassifying a module later leaves the certificate unchanged".
 */
export async function otorgar(
  userId: string,
  dojo: DojoType,
): Promise<Otorgamiento> {
  const yaTiene = await leerCertificado(userId, dojo);
  if (yaTiene) {
    return { otorgado: true, nuevo: false, certificado: yaTiene };
  }

  const elegibilidad = await esElegible(userId, dojo);
  if (!elegibilidad.elegible) {
    return { otorgado: false, motivo: "no-elegible", detalle: elegibilidad };
  }

  const certificado: CertificadoLeido = {
    dojo,
    cohort: elegibilidad.cohort,
    modulos: elegibilidad.modulos,
    ejerciciosPorModulo: elegibilidad.ejerciciosPorModulo,
    otorgadoEn: new Date(),
    codigo: generarCodigo(dojo, elegibilidad.cohort),
  };

  await Certificate.create({ userId, ...certificado });
  return { otorgado: true, nuevo: true, certificado };
}
