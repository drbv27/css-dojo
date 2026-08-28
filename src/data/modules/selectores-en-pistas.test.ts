import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";

/**
 * Un selector citado en el enunciado, la pista o la explicacion NO puede estar
 * escrito con tilde cuando el ejercicio lo define SIN tilde.
 *
 * ## Por que esto importa mas de lo que parece
 *
 * Encontrado el 2026-08-28 auditando el progreso de produccion. El unico
 * `Progress` de 5.447 que fallaba la recorreccion sin explicacion inocente era
 * `especificidad/09-ej-08`, y al abrirlo el ejercicio tenia esto:
 *
 *     el HTML define    id="seccion"
 *     targetCSS exige   #seccion .articulo .texto
 *     la PISTA dice     "usa el ID #seccion"      <- decia #sección
 *     la EXPLICACION    "'#seccion .articulo ...'" <- decia #sección
 *
 * Un alumno que siga la pista al pie de la letra escribe un selector que NO
 * MATCHEA NADA: ni el CSS aplica, ni el corrector lo acepta, y el error se lee
 * como suyo. Habia 10 ocurrencias asi en 5 modulos, los cinco obligatorios.
 *
 * ## Por que la regla es esta y no una mas amplia
 *
 * "Todo selector citado en prosa debe existir en el ejercicio" suena mejor y
 * encuentra 35 casos -- pero la mayoria son legitimos: `.scss` y `.sass` son
 * extensiones de archivo, `.length` es una propiedad de JavaScript, `.mi-clase`
 * y `#id` son prosa generica explicando que ES un selector.
 *
 * Un guard que rechaza prosa correcta empuja a escribir peor. Esta regla exige
 * que el gemelo SIN tilde exista en el ejercicio, asi que solo dispara cuando
 * el ejercicio tiene esa cosa y la prosa la nombra mal. Cero falsos positivos.
 */

const SELECTOR_ACENTUADO = /(?<![\w-])([#.])([A-Za-z0-9_-]*[áéíóúñÁÉÍÓÚÑ][A-Za-z0-9_-]*)/g;

const sinTildes = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "");

describe("selectores citados en la prosa de un ejercicio", () => {
  it("ninguno esta acentuado cuando el ejercicio lo define sin acento", () => {
    const mentiras: string[] = [];

    for (const m of ALL_MODULES) {
      for (const e of m.exercises) {
        const definido = [
          e.codeTemplate?.html,
          e.codeTemplate?.cssPrefix,
          e.codeTemplate?.cssSuffix,
          e.targetCSS,
          e.referenceSolution,
        ]
          .filter(Boolean)
          .join("\n");
        if (!definido.trim()) continue;

        const prosa = `${e.prompt} ${e.hint ?? ""} ${e.explanation ?? ""}`;
        for (const [, signo, nombre] of prosa.matchAll(SELECTOR_ACENTUADO)) {
          const plano = sinTildes(nombre);
          // Solo dispara si el ejercicio TIENE esa cosa, escrita sin tilde.
          if (definido.includes(plano) && !definido.includes(nombre)) {
            mentiras.push(
              `${m.slug}/${e.id}: la prosa dice ${signo}${nombre} y el ejercicio define ${signo}${plano}`,
            );
          }
        }
      }
    }

    // Enumerado, no contado: una falla tiene que nombrar el ejercicio y los dos
    // selectores, o el proximo los busca a mano.
    expect(mentiras).toEqual([]);
  });
});
