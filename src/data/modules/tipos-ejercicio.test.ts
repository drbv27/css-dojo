import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";
import type { ExerciseType } from "@/types";

/**
 * Este test MIDE, no prohibe. La plantilla uniforme del curriculum es deuda
 * conocida: hay modulos que solo piden RECONOCER (quiz, arrastrar) y ninguno que
 * pida PRODUCIR. Un alumno puede aprobarlos sin escribir una linea.
 *
 * Los dos umbrales bajan cuando se agregan ejercicios de escribir, y nunca
 * suben. Si suben, alguien creo un modulo nuevo sin nada que escribir.
 *
 * Sass (21-22) era el caso mas claro y ya se cerro: ensena un preprocesador, y
 * el alumno no veia nunca el CSS que sale compilado. Ahora cada uno tiene dos
 * `live-editor` y un `visual-match` donde hay que escribir ese CSS a mano, que
 * ademas obliga a predecirlo en lugar de mirarlo aparecer.
 */

/** Pide escribir codigo desde cero, con vista previa del resultado. */
const ESCRIBIR: ExerciseType[] = ["live-editor", "visual-match"];

/** Pide producir algo, aunque sea completar un hueco. */
const PRODUCIR: ExerciseType[] = ["live-editor", "visual-match", "code-completion"];

function tiposDe(m: (typeof ALL_MODULES)[number]): Set<string> {
  return new Set(m.exercises.map((e) => e.type));
}

describe("tipos de ejercicio por modulo", () => {
  it("mide los modulos donde no hay nada que escribir", () => {
    const sinEscribir = ALL_MODULES.filter((m) => {
      const tipos = tiposDe(m);
      return !ESCRIBIR.some((t) => tipos.has(t));
    }).map((m) => `${m.dojo}/${m.slug}`);

    // Baja este numero cuando agregues live-editor o visual-match, y nunca lo
    // subas. Los dos modulos de Sass salieron de esta lista.
    expect(sinEscribir.length).toBeLessThanOrEqual(63);
  });

  it("mide los modulos que son solo de reconocimiento", () => {
    // Ni live-editor, ni visual-match, ni code-completion: solo quiz y
    // arrastrar. Se aprueban eligiendo opciones, sin producir nada.
    const soloReconocer = ALL_MODULES.filter((m) => {
      const tipos = tiposDe(m);
      return !PRODUCIR.some((t) => tipos.has(t));
    }).map((m) => `${m.dojo}/${m.slug}`);

    // Bajó de 13 a 10 al agregar code-completion a js-patrones, ts-03-generics
    // y ts-04-typescript-react. Los 10 que quedan son react-eco y nextjs.
    expect(soloReconocer.length).toBeLessThanOrEqual(10);
  });

  it("los modulos de preprocesadores muestran el CSS compilado", () => {
    // El punto pedagogico del track: Sass no agrega nada al navegador, todo se
    // aplana al compilar. Si no hay un ejercicio donde el alumno escriba ese
    // CSS, el preprocesador queda como magia.
    const preprocesadores = ALL_MODULES.filter((m) => m.category === "preprocessors");
    expect(preprocesadores.length).toBeGreaterThan(0);

    const sinCompilado = preprocesadores
      .filter((m) => {
        const tipos = tiposDe(m);
        return !ESCRIBIR.some((t) => tipos.has(t));
      })
      .map((m) => m.slug);

    expect(sinCompilado).toEqual([]);
  });
});
