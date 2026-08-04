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
