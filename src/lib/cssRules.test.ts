import { describe, it, expect } from "vitest";
import { parseCssRules, compararReglas } from "./cssRules";

describe("parseCssRules", () => {
  it("parses a rule into selector and declarations", () => {
    const r = parseCssRules("h1 { color: red; font-size: 20px; }");
    expect([...r.keys()]).toEqual(["h1"]);
    expect([...r.get("h1")!]).toEqual(["color: red", "font-size: 20px"]);
  });

  it("returns an empty map for prose, which is what makes prose ungradeable", () => {
    expect(parseCssRules("display flex justify-content center").size).toBe(0);
    expect(parseCssRules("no tengo idea de css p color blue").size).toBe(0);
    expect(parseCssRules("").size).toBe(0);
  });

  it("ignores comments so answers cannot be smuggled inside them", () => {
    expect(parseCssRules("/* h1 { color: red } */").size).toBe(0);
  });

  it("normalizes case and whitespace on both selector and declaration", () => {
    const a = parseCssRules("H1{COLOR:RED}");
    const b = parseCssRules("h1 {\n  color : red ;\n}");
    expect([...a.get("h1")!]).toEqual([...b.get("h1")!]);
  });

  it("preserves internal value spacing for multi-part values", () => {
    const r = parseCssRules("div { padding: 10px   20px; }");
    expect([...r.get("div")!]).toEqual(["padding: 10px 20px"]);
  });

  it("expands a selector list so each selector carries the declarations", () => {
    const r = parseCssRules("h1, h2 { color: red; }");
    expect([...r.keys()].sort()).toEqual(["h1", "h2"]);
    expect([...r.get("h2")!]).toEqual(["color: red"]);
  });

  it("keys declarations inside an at-rule by their condition", () => {
    const r = parseCssRules("@media (max-width: 600px) { .caja { display: none; } }");
    const clave = [...r.keys()][0];
    expect(clave).toContain("@media");
    expect(clave).toContain(".caja");
    expect([...r.get(clave)!]).toEqual(["display: none"]);
  });

  it("does not confuse a declaration inside a media query with one outside it", () => {
    const r = parseCssRules(
      ".caja { display: flex; } @media (max-width: 600px) { .caja { display: none; } }"
    );
    expect([...r.get(".caja")!]).toEqual(["display: flex"]);
    expect(r.size).toBe(2);
  });

  it("survives unbalanced braces without throwing", () => {
    expect(() => parseCssRules("h1 { color: red")).not.toThrow();
    expect(() => parseCssRules("}}} h1 { color: red }")).not.toThrow();
  });

  it("merges declarations when a selector appears twice", () => {
    const r = parseCssRules("p { color: red; } p { margin: 0; }");
    expect([...r.get("p")!].sort()).toEqual(["color: red", "margin: 0"]);
  });
});

describe("selectores de atributo: comillas equivalentes", () => {
  /**
   * Medido antes del arreglo: un alumno que respondia `[href^='https']` contra un
   * target `[href^="https"]` puntuaba 0%, y `[href^=https]` tambien. Las dos
   * formas son CSS valido. Afectaba tres ejercicios, todos de attribute-selectors.
   */
  it("las tres formas de escribir el mismo valor son UNA sola clave", () => {
    const dobles = parseCssRules('a[href^="https"] { color: teal; }');
    const simples = parseCssRules("a[href^='https'] { color: teal; }");
    const desnudo = parseCssRules("a[href^=https] { color: teal; }");
    expect([...simples.keys()]).toEqual([...dobles.keys()]);
    expect([...desnudo.keys()]).toEqual([...dobles.keys()]);
  });

  it("puntua 100 cuando el alumno cambia el estilo de comilla", () => {
    const target = 'a[href^="https"] { color: teal; }';
    expect(compararReglas(target, "a[href^='https'] { color: teal; }").score).toBe(100);
    expect(compararReglas(target, "a[href^=https] { color: teal; }").score).toBe(100);
  });

  it("los espacios dentro del corchete no crean otra clave", () => {
    const target = 'a[href^="https"] { color: teal; }';
    expect(compararReglas(target, 'a[ href ^= "https" ] { color: teal; }').score).toBe(100);
  });

  /**
   * Esta es la mitad que NO se relaja, y es a proposito. `mailto:` sin comillas no
   * es un identificador CSS valido -- los dos puntos no van ahi -- asi que el
   * navegador no lo matchea. Aprobarlo le ensenaria al alumno que funciona.
   */
  it("un valor sin comillas que NO es identificador valido sigue fallando", () => {
    const target = 'a[href^="mailto:"] { color: teal; }';
    expect(compararReglas(target, "a[href^=mailto:] { color: teal; }").score).toBe(0);
    const pdf = 'a[href$=".pdf"] { color: teal; }';
    expect(compararReglas(pdf, "a[href$=.pdf] { color: teal; }").score).toBe(0);
  });

  it("la bandera de insensibilidad sigue distinguiendo, porque cambia el significado", () => {
    const conBandera = 'a[href^="https" i] { color: teal; }';
    const sinBandera = 'a[href^="https"] { color: teal; }';
    expect(compararReglas(sinBandera, conBandera).score).toBe(0);
    // Y entre si, las dos comillas con bandera siguen siendo la misma clave.
    expect(compararReglas(conBandera, "a[href^='https' i] { color: teal; }").score).toBe(100);
  });

  it("un atributo sin valor no se toca", () => {
    const r = parseCssRules("input[required] { border-color: red; }");
    expect([...r.keys()]).toEqual(["input[required]"]);
    expect(compararReglas("input[required] { border-color: red; }", "input[ required ] { border-color: red; }").score).toBe(100);
  });

  it("los cinco operadores sobreviven la normalizacion", () => {
    for (const op of ["=", "^=", "$=", "*=", "|="]) {
      const target = `a[data-x${op}"v"] { color: teal; }`;
      expect(compararReglas(target, `a[data-x${op}'v'] { color: teal; }`).score).toBe(100);
    }
    // Y no se confunden entre si.
    expect(compararReglas('a[data-x^="v"] { color: teal; }', 'a[data-x$="v"] { color: teal; }').score).toBe(0);
  });
});

describe("compararReglas", () => {
  const esperado = "h1 { color: red; }\np { color: blue; }";

  it("accepts a correct answer regardless of formatting", () => {
    expect(compararReglas(esperado, "h1{color:red}p{color:blue}").correct).toBe(true);
    expect(
      compararReglas(esperado, "p {\n color:   BLUE;\n}\nh1 { color: red; }").correct
    ).toBe(true);
  });

  it("REJECTS the prose exploit that passed the old includes validator", () => {
    // These three scored 100% before: the old validator searched the raw text
    // for the loose tokens ["p", "color", "blue", ...].
    for (const trampa of [
      "h1 color red p color blue",
      "no tengo idea de css h1 color red p color blue",
      "/* h1 color red p color blue */",
    ]) {
      const r = compararReglas(esperado, trampa);
      expect(r.correct).toBe(false);
      expect(r.score).toBe(0);
    }
  });

  it("REJECTS declarations placed under the wrong selector", () => {
    // Swapped bodies. The old token-based validator could not see this at all.
    const r = compararReglas(esperado, "h1 { color: blue; } p { color: red; }");
    expect(r.correct).toBe(false);
  });

  it("gives partial credit for partial work", () => {
    const r = compararReglas(esperado, "h1 { color: red; }");
    expect(r.score).toBe(50);
    expect(r.correct).toBe(false);
    expect(r.faltantes).toEqual(["p { color: blue }"]);
  });

  it("ignores extra declarations the student adds beyond what was asked", () => {
    const r = compararReglas(esperado, "h1 { color: red; margin: 0 } p { color: blue }");
    expect(r.correct).toBe(true);
  });

  it("scores 0 when nothing was submitted", () => {
    expect(compararReglas(esperado, "").score).toBe(0);
  });

  it("returns 0 rather than a free pass when the expected CSS is unparseable", () => {
    expect(compararReglas("not css at all", "h1 { color: red }").correct).toBe(false);
  });
});
