import { ALL_MODULES } from "@/data/modules";
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
