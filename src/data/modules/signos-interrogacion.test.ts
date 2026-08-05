import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";

/**
 * En castellano las preguntas se abren. El curriculum tenia 482 preguntas
 * cerradas con `?` y ni un solo `¿` en 101 modulos de los seis tracks.
 *
 * Este test cuenta sobre la PROSA unicamente. Enmascarar el codigo no es un
 * detalle: en los tracks de JS y React el `?` es un operador -- ternario,
 * `?.`, `??` -- y contarlo como pregunta pide abrir algo que no es una
 * pregunta. Por eso se descartan los bloques ``` y el codigo en linea (que en
 * el fuente vienen con backticks ESCAPADOS dentro del template literal), lo que
 * va entre llaves, y cualquier `?` que no cierre una oracion.
 */

/** Reemplaza el codigo por espacios, conservando las posiciones. */
function sinCodigo(texto: string): string {
  let out = texto;
  const tapar = (re: RegExp) => {
    out = out.replace(re, (m) => " ".repeat(m.length));
  };
  tapar(/```[\s\S]*?```/g);
  tapar(/`[^`\n]*`/g);
  // Llaves: en la prosa delimitan codigo (objetos, bloques CSS, JSX).
  tapar(/\{[^{}\n]*\}/g);
  return out;
}

/** Un `?` cierra pregunta si le sigue espacio, fin de texto o un cierre. */
function cierresDePregunta(prosa: string): number {
  let n = 0;
  for (let i = 0; i < prosa.length; i++) {
    if (prosa[i] !== "?") continue;
    if (prosa[i - 1] === "?") continue;
    const sig = prosa[i + 1];
    if (sig === undefined || " \n\t\"')<»".includes(sig)) n++;
  }
  return n;
}

function prosaDe(m: (typeof ALL_MODULES)[number]): string {
  const partes: string[] = [m.title, m.description];
  for (const l of m.lessons) partes.push(l.title, sinCodigo(l.content));
  for (const e of m.exercises) {
    partes.push(e.prompt, e.hint ?? "", e.explanation ?? "");
    for (const o of e.options ?? []) partes.push(sinCodigo(o.text));
    for (const z of e.dropZones ?? []) partes.push(z.label);
  }
  return partes.map(sinCodigo).join("\n");
}

describe("signos de interrogacion en el contenido", () => {
  it("toda pregunta se abre: hay un ¿ por cada ? que cierra oracion", () => {
    const desbalanceados: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      const cierres = cierresDePregunta(prosa);
      const aperturas = (prosa.match(/¿/g) ?? []).length;
      if (cierres !== aperturas) {
        desbalanceados.push(`${m.dojo}/${m.slug}: ${aperturas} "¿" para ${cierres} "?"`);
      }
    }

    expect(desbalanceados).toEqual([]);
  });

  it("ningun ¿ queda pegado a una palabra o a codigo", () => {
    // El signo abre: solo puede ir al principio o despues de un espacio o un
    // delimitador de apertura. Pegado a otra cosa significa que se inserto en
    // el lugar equivocado -- dentro de un selector, por ejemplo.
    const malUbicados: string[] = [];

    for (const m of ALL_MODULES) {
      const prosa = prosaDe(m);
      for (let i = 0; i < prosa.length; i++) {
        if (prosa[i] !== "¿") continue;
        const prev = prosa[i - 1];
        if (prev !== undefined && !" \n\t(\"'>*|-".includes(prev)) {
          malUbicados.push(`${m.dojo}/${m.slug}: ...${prosa.slice(Math.max(0, i - 24), i + 12)}`);
        }
      }
    }

    expect(malUbicados).toEqual([]);
  });
});
