import { describe, it, expect } from "vitest";
import { compararReglas, parseCssRules } from "@/lib/cssRules";
import { cssEsperadoDe, esRetoIntegrador } from "@/lib/calificar";
import { compararEstructura } from "@/lib/htmlStructure";
import { ALL_MODULES } from "@/data/modules";

/**
 * Guards the curriculum DATA, not the components.
 *
 * Every CSS exercise used to be graded with `includes`, a substring search over
 * the submission against loose tokens like ["display", "flex", "center"]. All 44
 * could be passed by typing those words as prose, and none could tell which
 * selector a declaration belonged to. These tests exist so that cannot come back
 * by authoring a new exercise the old way.
 */

/**
 * Reference solutions for the CSS-track exercises graded as HTML structure.
 * These are exercises where the MARKUP is what is being learned: the framework
 * class exercises (Bootstrap/Tailwind, whose targetCSS is empty) and the step of
 * the capstone project where the student adds classes to their own CV.
 *
 * Every one of them needs a reference, because these selectors are hand-authored
 * and an over-strict one silently makes the exercise unpassable -- which is what
 * happened to all three framework exercises during an earlier migration pass.
 */
const REFERENCIAS_HTML_EN_CSS: Record<string, string> = {
  // Proyecto integrador: el paso donde el alumno agrega clases al CV que escribio.
  "25-ej-01": `<header class="encabezado">
  <h1 class="nombre">Ana Martinez</h1>
  <p class="titulo-profesional">Desarrolladora Frontend</p>
  <nav class="contacto">
    <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>
    <a href="tel:+541100000000">+54 11 0000 0000</a>
  </nav>
</header>`,
  "23-ej-05": `<div class="container">
  <div class="row g-3">
    <div class="col-md-4"><div class="p-3 bg-primary bg-opacity-25 rounded text-center">Columna 1</div></div>
    <div class="col-md-4"><div class="p-3 bg-primary bg-opacity-25 rounded text-center">Columna 2</div></div>
    <div class="col-md-4"><div class="p-3 bg-primary bg-opacity-25 rounded text-center">Columna 3</div></div>
  </div>
</div>`,
  "23-ej-07": `<div class="card shadow">
  <div class="card-body">
    <h5 class="card-title">Mi Tarjeta</h5>
    <p class="card-text">Esta es una tarjeta de Bootstrap 5.</p>
    <span class="badge bg-success">Activo</span>
    <button class="btn btn-primary">Ver mas</button>
  </div>
</div>`,
  "24-ej-06": `<div class="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-2">Mi Tarjeta</h2>
    <p class="text-gray-600 text-sm">Una tarjeta hecha con utilidades de Tailwind.</p>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Ver mas</button>
  </div>
</div>`,
};

const ejerciciosCss = ALL_MODULES.filter((m) => m.dojo === "css").flatMap((m) =>
  m.exercises.map((e) => ({ mod: m.slug, id: e.id, ex: e }))
);

const conCssRules = ejerciciosCss.filter((e) => e.ex.validation.type === "css-rules");

describe("curriculum CSS: integridad de la validacion", () => {
  it("hay ejercicios usando css-rules", () => {
    expect(conCssRules.length).toBeGreaterThan(30);
  });

  it("todo ejercicio css-rules tiene un targetCSS que parsea", () => {
    const malos = conCssRules.filter(
      (e) => !cssEsperadoDe(e.ex) || parseCssRules(cssEsperadoDe(e.ex)).size === 0
    );
    expect(malos.map((m) => `${m.mod}/${m.id}`)).toEqual([]);
  });

  /**
   * The self-comparison below cannot catch a MALFORMED target, because a target
   * always scores 100% against itself. A single missing semicolon makes the
   * parser swallow the next property into the previous value -- `width: 80px`
   * followed by `aspect-ratio: 1 / 1` becomes one declaration reading
   * "width: 80px aspect-ratio: 1 / 1". The exercise then demands something no
   * valid CSS can produce: a student writing the correct answer scores 33% and
   * fails, and it looks like their mistake.
   *
   * A well-formed declaration has exactly one colon. Two or more means a
   * property name ended up inside a value. Quoted strings and url() are
   * stripped first, since those may legitimately contain a colon.
   */
  it("ningun targetCSS tiene una declaracion con un nombre de propiedad tragado", () => {
    const sospechosas: string[] = [];
    for (const e of conCssRules) {
      for (const [selector, decls] of parseCssRules(cssEsperadoDe(e.ex))) {
        for (const decl of decls) {
          const limpia = decl.replace(/"[^"]*"|'[^']*'|url\([^)]*\)/g, "");
          if ((limpia.match(/:/g)?.length ?? 0) > 1) {
            sospechosas.push(`${e.mod}/${e.id} -> ${selector} { ${decl} }`);
          }
        }
      }
    }
    expect(sospechosas).toEqual([]);
  });

  it("la respuesta correcta de cada ejercicio puntua 100%", () => {
    const malos = conCssRules.filter(
      (e) => !compararReglas(cssEsperadoDe(e.ex), cssEsperadoDe(e.ex)).correct
    );
    expect(malos.map((m) => `${m.mod}/${m.id}`)).toEqual([]);
  });

  it("ningun ejercicio css-rules se aprueba escribiendo la respuesta como prosa", () => {
    const rotos: string[] = [];
    for (const e of conCssRules) {
      const target = cssEsperadoDe(e.ex);
      const palabras = target.replace(/[{};:]/g, " ").replace(/\s+/g, " ").trim();
      const trampas = [palabras, `/* ${target} */`, `no se css ${palabras}`];
      if (trampas.some((t) => compararReglas(target, t).correct)) {
        rotos.push(`${e.mod}/${e.id}`);
      }
    }
    expect(rotos).toEqual([]);
  });

  it("intercambiar los cuerpos de dos reglas no aprueba", () => {
    const rotos = conCssRules.filter((e) => {
      const reglas = [...cssEsperadoDe(e.ex).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
        (m) => [m[1].trim(), m[2]] as [string, string]
      );
      if (reglas.length < 2) return false;
      const swap: Array<[string, string]> = [...reglas];
      swap[0] = [reglas[0][0], reglas[1][1]];
      swap[1] = [reglas[1][0], reglas[0][1]];
      const css = swap.map(([s, b]) => `${s} {${b}}`).join("\n");
      return compararReglas(e.ex.targetCSS!, css).correct;
    });
    expect(rotos.map((r) => `${r.mod}/${r.id}`)).toEqual([]);
  });

  it("ningun ejercicio CSS sigue usando 'includes'", () => {
    // Los tres de Bootstrap/Tailwind eran la ultima excepcion: se corrigen por
    // las CLASES escritas en HTML y tienen targetCSS vacio, asi que ahora usan
    // html-structure con selectores de clase. El token 'row' de `includes`
    // matcheaba dentro de 'arrow' y 'browser'.
    const rezagados = ejerciciosCss.filter((e) => e.ex.validation.type === "includes");
    expect(rezagados.map((r) => `${r.mod}/${r.id}`)).toEqual([]);
  });

  it("todo ejercicio html-structure del track CSS tiene una referencia en este archivo", () => {
    // Un ejercicio del track CSS se valida por estructura HTML cuando lo que se
    // aprende es el MARKUP: las clases de Bootstrap/Tailwind, o agregar clases al
    // CV en el proyecto integrador. La referencia es obligatoria porque estos
    // selectores son escritos a mano.
    const sinReferencia = ejerciciosCss
      .filter((e) => e.ex.validation.type === "html-structure")
      // Un RETO INTEGRADOR ya lleva su referencia en `referenceSolution`, y que
      // saque 100 contra sus propios pasos lo asegura
      // `retos-curriculum.test.ts`. Repetirla aca serian dos fuentes de verdad
      // del mismo hecho, que es justo lo que el diseño de los retos evita.
      .filter((e) => !esRetoIntegrador(e.ex))
      .filter((e) => !REFERENCIAS_HTML_EN_CSS[e.id]);
    expect(sinReferencia.map((e) => `${e.mod}/${e.id}`)).toEqual([]);
  });

  it("LA REFERENCIA DE CADA EJERCICIO html-structure PUNTUA 100%", () => {
    // Sin esto un selector demasiado estricto dejaria el ejercicio imposible --
    // exactamente el bug que los tres de framework sufrieron una vez.
    const fallan = Object.entries(REFERENCIAS_HTML_EN_CSS)
      .map(([id, ref]) => {
        const ej = ejerciciosCss.find((e) => e.id === id);
        if (!ej) return `${id} (no existe)`;
        const r = compararEstructura(ej.ex.validation.answer, ref);
        return r.correct ? null : `${id} score=${r.score} faltan=${JSON.stringify(r.faltantes)}`;
      })
      .filter(Boolean);
    expect(fallan).toEqual([]);
  });

  it("las clases correctas pero mal anidadas no aprueban", () => {
    const ej = ejerciciosCss.find((e) => e.id === "23-ej-05")!;
    const malAnidado =
      '<div class="container"><div class="row g-3"></div></div>' +
      '<div class="col-md-4"><div class="p-3 bg-primary bg-opacity-25 rounded text-center">C1</div></div>';
    expect(compararEstructura(ej.ex.validation.answer, malAnidado).correct).toBe(false);
  });

  it("ningun ejercicio usa la validacion 'visual', que no valida nada", () => {
    const conVisual = ALL_MODULES.flatMap((m) =>
      m.exercises.filter((e) => e.validation.type === "visual").map((e) => `${m.slug}/${e.id}`)
    );
    expect(conVisual).toEqual([]);
  });
});
