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

  it("ningun modulo se aprueba sin producir nada", () => {
    // Ni live-editor, ni visual-match, ni code-completion: solo quiz y
    // arrastrar. Eran 13 y ya no queda ninguno, asi que esto pasa de medir a
    // prohibir. Si vuelve a aparecer uno, es un modulo nuevo que se aprueba
    // eligiendo opciones.
    const soloReconocer = ALL_MODULES.filter((m) => {
      const tipos = tiposDe(m);
      return !PRODUCIR.some((t) => tipos.has(t));
    }).map((m) => `${m.dojo}/${m.slug}`);

    expect(soloReconocer).toEqual([]);
  });

  it("los modulos de preprocesadores muestran el CSS compilado", () => {
    // El punto pedagogico del track: Sass no agrega nada al navegador, todo se
    // aplana al compilar. Si no hay un ejercicio donde el alumno escriba ese
    // CSS, el preprocesador queda como magia.
    // Fijado por SLUG y no por categoria: los dos modulos de Sass viven en
    // `css-herramientas`, que tambien tiene Bootstrap y Tailwind. Filtrar por esa
    // categoria pasaria el test cambiando en silencio lo que el test significa:
    // un framework no es un preprocesador y no compila nada.
    const SASS = ["sass-fundamentos", "sass-avanzado"];
    const preprocesadores = ALL_MODULES.filter((m) => SASS.includes(m.slug));
    expect(preprocesadores.map((m) => m.slug).sort()).toEqual([...SASS].sort());

    const sinCompilado = preprocesadores
      .filter((m) => {
        const tipos = tiposDe(m);
        return !ESCRIBIR.some((t) => tipos.has(t));
      })
      .map((m) => m.slug);

    expect(sinCompilado).toEqual([]);
  });
});
