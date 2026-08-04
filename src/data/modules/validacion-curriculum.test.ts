import { describe, it, expect } from "vitest";
import { compararReglas, parseCssRules } from "@/lib/cssRules";
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
 * Reference solutions for the three framework exercises. They are graded by
 * class selector rather than by parsing CSS, because the student writes HTML
 * with Bootstrap/Tailwind classes and their targetCSS is empty. These exist so
 * an over-strict selector cannot silently make one unpassable -- which is what
 * happened to all three during an earlier pass of the css-rules migration.
 */
const REFERENCIAS_FRAMEWORK: Record<string, string> = {
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
      (e) => !e.ex.targetCSS || parseCssRules(e.ex.targetCSS).size === 0
    );
    expect(malos.map((m) => `${m.mod}/${m.id}`)).toEqual([]);
  });

  it("la respuesta correcta de cada ejercicio puntua 100%", () => {
    const malos = conCssRules.filter(
      (e) => !compararReglas(e.ex.targetCSS!, e.ex.targetCSS!).correct
    );
    expect(malos.map((m) => `${m.mod}/${m.id}`)).toEqual([]);
  });

  it("ningun ejercicio css-rules se aprueba escribiendo la respuesta como prosa", () => {
    const rotos: string[] = [];
    for (const e of conCssRules) {
      const target = e.ex.targetCSS!;
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
      const reglas = [...e.ex.targetCSS!.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
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

  it("los ejercicios de framework se validan por estructura de clases", () => {
    const frameworks = ejerciciosCss.filter((e) => e.ex.validation.type === "html-structure");
    expect(frameworks.map((f) => f.id).sort()).toEqual(["23-ej-05", "23-ej-07", "24-ej-06"]);
  });

  it("LA REFERENCIA DE CADA EJERCICIO DE FRAMEWORK PUNTUA 100%", () => {
    // Sin esto un selector de clase demasiado estricto dejaria el ejercicio
    // imposible -- exactamente el bug que estos tres sufrieron una vez.
    const fallan = Object.entries(REFERENCIAS_FRAMEWORK)
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
