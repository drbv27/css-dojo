import { describe, it, expect } from "vitest";
import { compararReglas, parseCssRules } from "@/lib/cssRules";
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

  it("un ejercicio CSS con targetCSS real no debe seguir usando 'includes'", () => {
    // `includes` sigue siendo legitimo para los ejercicios de Bootstrap/Tailwind,
    // que se corrigen por las CLASES escritas en HTML y tienen targetCSS vacio.
    const rezagados = ejerciciosCss.filter(
      (e) =>
        e.ex.validation.type === "includes" &&
        !!e.ex.targetCSS &&
        e.ex.targetCSS.trim() !== ""
    );
    expect(rezagados.map((r) => `${r.mod}/${r.id}`)).toEqual([]);
  });

  it("ningun ejercicio usa la validacion 'visual', que no valida nada", () => {
    const conVisual = ALL_MODULES.flatMap((m) =>
      m.exercises.filter((e) => e.validation.type === "visual").map((e) => `${m.slug}/${e.id}`)
    );
    expect(conVisual).toEqual([]);
  });
});
