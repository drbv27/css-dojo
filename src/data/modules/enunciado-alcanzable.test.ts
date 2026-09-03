import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";

/**
 * LO REPORTO UN ALUMNO, y era la tercera vez que el corrector castigaba a
 * alguien que habia hecho bien el ejercicio.
 *
 * En `float-display/13-ej-05` el enunciado pedia seis declaraciones y el
 * `targetCSS` exigia ocho: el contenedor llevaba ademas `padding: 15px` y
 * `background-color: #f9f9f9`, que **no se nombraban en ninguna parte**. El
 * alumno escribio exactamente lo que le pidieron y saco 75. Y desde que
 * completar exige 100, ese ejercicio era imposible de aprobar siguiendo su
 * propia consigna -- en un modulo OBLIGATORIO, o sea que bloqueaba el
 * certificado para todo el mundo.
 *
 * Barriendo el track aparecieron SIETE mas con la misma forma.
 *
 * QUE SE GUARDA, Y QUE NO. Decidir si un enunciado "comunica" una declaracion
 * es un juicio: los enunciados dan los valores en castellano -"color verde
 * (green)"-, describen una pila de fuentes en prosa, o piden "2 columnas" para
 * un `repeat(2, 1fr)`. Un guard que exija la declaracion literal en el texto
 * marcaria decenas de ejercicios correctos, y ya sabemos lo que pasa cuando un
 * guard rechaza trabajo bien hecho: empuja a escribir peor para callarlo.
 *
 * Asi que se guarda solo el caso INEQUIVOCO, que es el que aparecio las ocho
 * veces: **un selector entero del `targetCSS` cuyas declaraciones son TODAS
 * invisibles para el alumno**. Eso no es una diferencia de redaccion: es una
 * regla que el enunciado nunca menciono, casi siempre decorado de un elemento
 * acompanante. No hay forma de adivinar un `#8e44ad` leyendo "crea una grilla".
 *
 * DONDE PUEDE MIRAR EL ALUMNO: el enunciado, el `cssPrefix`/`cssSuffix` -que
 * arrancan escritos en su editor- y el HTML de la plantilla. Si el valor no
 * esta en ninguno de los tres, no lo puede escribir.
 *
 * Los `visual-match` NO se arreglan sacando la regla del `targetCSS`, porque
 * ahi el objetivo se RENDERIZA con el, y sacarla cambiaria el diseno que el
 * alumno tiene que reproducir. En esos, el decorado se copia al `cssPrefix`:
 * el objetivo se sigue viendo igual y la regla deja de ser adivinanza.
 */

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

interface Fantasma {
  ejercicio: string;
  selector: string;
  declaraciones: number;
}

function reglasFantasma(): Fantasma[] {
  const out: Fantasma[] = [];

  for (const mod of ALL_MODULES) {
    for (const ex of mod.exercises) {
      if (ex.validation?.type !== "css-rules" || !ex.targetCSS) continue;

      const visible = norm(
        (ex.prompt ?? "") +
          (ex.codeTemplate?.cssPrefix ?? "") +
          (ex.codeTemplate?.cssSuffix ?? "") +
          (ex.codeTemplate?.html ?? ""),
      );

      const porSelector = new Map<string, { total: number; ocultas: number }>();
      let selector = "";

      for (const linea of ex.targetCSS.split("\n")) {
        // Linea de SELECTOR, no de declaracion. Sin esto, `a:hover {` se lee
        // como la propiedad `a` con valor `hover{`, y el guard marca en falso
        // todo ejercicio con una pseudo-clase. Paso de verdad al escribirlo.
        if (/\{\s*$/.test(linea)) {
          selector = linea.replace(/\{.*$/, "").trim();
          continue;
        }

        const decl = linea.match(/^\s*([a-z-]+)\s*:\s*([^;]+);\s*$/);
        if (!decl) continue;

        if (!porSelector.has(selector)) porSelector.set(selector, { total: 0, ocultas: 0 });
        const acc = porSelector.get(selector)!;
        acc.total++;

        // Se prueba el valor tal cual Y con los `var(...)` desenvueltos: un
        // enunciado que define `--color-fondo` y pide "usa estas variables"
        // SI le dice al alumno que escriba `var(--color-fondo)`, aunque no lo
        // escriba con esa sintaxis.
        const valor = norm(decl[2]);
        const sinVar = valor.replace(/var\(([^)]*)\)/g, "$1");
        if (!visible.includes(valor) && !visible.includes(sinVar)) acc.ocultas++;
      }

      for (const [sel, acc] of porSelector) {
        // Dos o mas: una sola declaracion suelta suele ser un valor que el
        // enunciado describe con palabras, y marcarla seria ruido.
        if (acc.total >= 2 && acc.ocultas === acc.total) {
          out.push({ ejercicio: `${mod.slug}/${ex.id}`, selector: sel, declaraciones: acc.total });
        }
      }
    }
  }

  return out;
}

describe("el enunciado alcanza para sacar 100", () => {
  it("ningun targetCSS exige una regla ENTERA que el alumno no puede ver", () => {
    // Enumerado y no contado: el fallo tiene que nombrar el ejercicio y el
    // selector, o el proximo que lo lea vuelve a barrer el track a mano.
    expect(reglasFantasma()).toEqual([]);
  });
});
