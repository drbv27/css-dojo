import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";

/**
 * Un selector que el enunciado nombra tiene que EXISTIR en el ejercicio.
 *
 * ## El defecto que lo origino
 *
 * `tipografias/04-ej-10` decia "A la clase 'título'" y el HTML traia
 * `class="titulo"`, sin tilde. El alumno escribio `.título` -- exactamente lo
 * que le pedian -- y saco 67/100: sus dos declaraciones no matchearon ninguna
 * regla, y 4 de 6 es 67. El ejercicio era IMPASABLE siguiendo su propio
 * enunciado, y el alumno no tenia forma de saberlo: el corrector solo dice
 * "incorrecto".
 *
 * Habia tres, los tres en modulos obligatorios: `selectores/02-ej-07` con el id
 * `título`, este, y `pseudo-clases/07-ej-10` con la clase `opción`. Ninguno se
 * podia completar haciendo lo que el texto pedia.
 *
 * ## Por que el guard de acentuacion no lo veia
 *
 * `acentuacion.test.ts` busca tildes QUE FALTAN en la prosa, y ademas exime a
 * proposito todo token pegado a `.` o `#` porque es codigo. Este defecto es el
 * inverso: una tilde DE MAS, dentro de comillas simples, en un nombre que tiene
 * que coincidir con el HTML letra por letra. Ningun guard miraba esa relacion.
 *
 * ## La convencion que este guard fija
 *
 * Un selector se nombra COMO SELECTOR -- `.titulo`, `#titulo` -- y no como
 * palabra entre comillas. Se lee como codigo, no como espaniol, asi que nadie
 * lo vuelve a acentuar al corregir la prosa; y de paso la mascara de
 * `acentuacion.test.ts` ya lo exime, de modo que los dos guards no pelean.
 */

/** Un `#abc123` es un color, no un id. */
const ES_HEX = /^[0-9a-fA-F]{3,8}$/;

/** Los `.foo` y `#foo` que el enunciado nombra. */
function selectoresNombrados(prompt: string): string[] {
  return [...prompt.matchAll(/(?<![\w-])([.#])([A-Za-zÀ-ÿ_][\wÀ-ſ-]*)/g)]
    .filter(([, marca, nombre]) => !(marca === "#" && ES_HEX.test(nombre)))
    // `.alerta-#{$tipo}` en Sass: el nombre real lo arma la interpolacion, y lo
    // que queda antes del `#{` no es un selector que deba existir.
    .filter(([, , nombre]) => !nombre.endsWith("-"))
    .map(([, marca, nombre]) => marca + nombre);
}

/** Los que el ejercicio realmente ofrece: HTML del template, target y pasos. */
function selectoresDisponibles(e: {
  codeTemplate?: { html?: string };
  targetCSS?: string;
  retoPasos?: { esperado: string }[];
}): Set<string> {
  const disponibles = new Set<string>();
  const html = e.codeTemplate?.html ?? "";
  for (const m of html.matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) disponibles.add("." + c);
  }
  for (const m of html.matchAll(/id="([^"]+)"/g)) disponibles.add("#" + m[1]);

  // Un ejercicio puede pedir que el alumno CREE el marcado. En ese caso el
  // selector no esta en el template pero si en lo que se espera de vuelta.
  const esperado = [e.targetCSS ?? "", ...(e.retoPasos ?? []).map((p) => p.esperado)].join("\n");
  for (const m of esperado.matchAll(/(?<![\w-])([.#])([A-Za-z_][\w-]*)/g)) {
    if (m[1] === "#" && ES_HEX.test(m[2])) continue;
    disponibles.add(m[1] + m[2]);
  }
  return disponibles;
}

const CON_PROMPT = ALL_MODULES.flatMap((m) =>
  m.exercises.filter((e) => (e.prompt ?? "").length > 0).map((e) => ({ modulo: m.slug, e })),
);

describe("los selectores que nombra un enunciado existen en su ejercicio", () => {
  it("el guard mira algo: hay ejercicios con prompt y prompts que nombran selectores", () => {
    // Sin esto, un regex roto deja el guard verde sobre el conjunto vacio --
    // que es la forma de bug que este archivo viene a cazar.
    expect(CON_PROMPT.length).toBeGreaterThan(700);
    const conSelector = CON_PROMPT.filter(({ e }) => selectoresNombrados(e.prompt).length > 0);
    expect(conSelector.length).toBeGreaterThan(20);
  });

  it("ningun enunciado nombra un selector que el ejercicio no tiene", () => {
    const rotos: string[] = [];

    for (const { modulo, e } of CON_PROMPT) {
      const disponibles = selectoresDisponibles(e);
      // Un ejercicio sin marcado propio no puede contradecirse a si mismo.
      if (disponibles.size === 0) continue;

      for (const sel of selectoresNombrados(e.prompt)) {
        if (!disponibles.has(sel)) {
          rotos.push(
            `${modulo}/${e.id}: el enunciado nombra ${sel}, que no existe. Hay: ${[...disponibles].join(", ")}`,
          );
        }
      }
    }

    expect(rotos).toEqual([]);
  });

  it("un nombre entre comillas no lleva una tilde que la clase no tiene", () => {
    // LA FORMA EXACTA DEL DEFECTO. Entre comillas, `'título'` se lee como
    // espaniol y alguien le pone la tilde; la clase es `titulo` y el alumno que
    // copia el enunciado escribe un selector que no matchea nada.
    //
    // Esto NO exige que todo nombre entre comillas se vuelva selector: cuando
    // coincide letra por letra con la clase, el alumno lo copia y funciona. Lo
    // que se rechaza es la version acentuada de una clase que no lo esta.
    const desacentuados: string[] = [];

    for (const { modulo, e } of CON_PROMPT) {
      const clases = new Set<string>();
      const html = e.codeTemplate?.html ?? "";
      for (const m of html.matchAll(/class="([^"]+)"/g)) {
        for (const c of m[1].split(/\s+/)) if (c) clases.add(c);
      }
      for (const m of html.matchAll(/id="([^"]+)"/g)) clases.add(m[1]);
      if (clases.size === 0) continue;

      for (const m of e.prompt.matchAll(/'([A-Za-zÀ-ÿ_][\wÀ-ſ-]*)'/g)) {
        const citado = m[1];
        if (clases.has(citado)) continue; // coincide: el alumno lo copia y anda
        const plano = citado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (clases.has(plano)) {
          desacentuados.push(
            `${modulo}/${e.id}: el enunciado dice '${citado}' y la clase es ${plano}. Escribilo como selector: .${plano}`,
          );
        }
      }
    }

    expect(desacentuados).toEqual([]);
  });
});
