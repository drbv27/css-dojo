import { describe, it, expect } from "vitest";
import { compararEstructura, parsearHtml } from "./htmlStructure";

describe("compararEstructura", () => {
  it("verifies nesting, which the old includes validator could not", () => {
    const esperado = ["table > tbody > tr > td"];
    expect(compararEstructura(esperado, "<table><tbody><tr><td>x</td></tr></tbody></table>").correct).toBe(true);
    // Every tag fragment is present but the cell is outside the table.
    expect(compararEstructura(esperado, "<td>x</td><table><tbody><tr></tr></tbody></table>").correct).toBe(false);
  });

  it("rejects prose", () => {
    const r = compararEstructura(["figure > img[alt]", "figure > figcaption"], "figure img alt figcaption");
    expect(r.correct).toBe(false);
    expect(r.score).toBe(0);
  });

  it("rejects an empty submission instead of passing it", () => {
    expect(compararEstructura(["h1"], "").score).toBe(0);
    expect(compararEstructura(["h1"], "   ").score).toBe(0);
  });

  it("compares attribute VALUES rather than searching for the text", () => {
    expect(compararEstructura(['meter[value="8"]'], '<meter value="8" min="0" max="10">8</meter>').correct).toBe(true);
    // The digit 8 appears, but not as the value attribute. The old validator's
    // token "8" matched this.
    expect(compararEstructura(['meter[value="8"]'], "<p>tengo 8 anios</p>").correct).toBe(false);
    expect(compararEstructura(['html[lang="es"]'], "<html lang=\"en\"><body>test</body></html>").correct).toBe(false);
  });

  it("supports a minimum count with >>", () => {
    expect(compararEstructura(["ul > li >> 3"], "<ul><li>a</li><li>b</li><li>c</li></ul>").correct).toBe(true);
    expect(compararEstructura(["ul > li >> 3"], "<ul><li>a</li><li>b</li></ul>").correct).toBe(false);
  });

  it("supports a text assertion with ::", () => {
    expect(compararEstructura(["h2 :: Perfil"], "<h2>Perfil</h2>").correct).toBe(true);
    expect(compararEstructura(["h2 :: Perfil"], "<h2>Experiencia</h2>").correct).toBe(false);
    // Case-insensitive, and matches a substring.
    expect(compararEstructura(["h2 :: perfil"], "<h2>Mi Perfil profesional</h2>").correct).toBe(true);
  });

  it("checks the doctype with !doctype", () => {
    expect(compararEstructura(["!doctype"], "<!DOCTYPE html><html><body><p>x</p></body></html>").correct).toBe(true);
    expect(compararEstructura(["!doctype"], "<html><body><p>x</p></body></html>").correct).toBe(false);
  });

  it("gives partial credit and names what is missing", () => {
    const r = compararEstructura(["h1", "h2", "hr"], "<h1>a</h1><h2>b</h2>");
    expect(r.score).toBe(67);
    expect(r.correct).toBe(false);
    expect(r.faltantes).toEqual(["hr"]);
  });

  it("treats an invalid selector as unmet rather than throwing", () => {
    expect(() => compararEstructura(["> > >"], "<h1>a</h1>")).not.toThrow();
    expect(compararEstructura(["> > >"], "<h1>a</h1>").correct).toBe(false);
  });

  it("returns 0 when there are no valid expectations", () => {
    expect(compararEstructura([], "<h1>a</h1>").score).toBe(0);
    expect(compararEstructura(["  "], "<h1>a</h1>").score).toBe(0);
  });

  it("counts head-only content as real, since bare <title> lands in head", () => {
    // DOMParser synthesizes html/head/body, so their presence proves nothing --
    // but a <title> the student wrote does end up in head and must count.
    expect(compararEstructura(["head > title"], "<title>Mi Web</title>").correct).toBe(true);
  });
});

describe("parsearHtml", () => {
  it("parses markup into a document", () => {
    const doc = parsearHtml("<h1>hola</h1>");
    expect(doc?.querySelector("h1")?.textContent).toBe("hola");
  });

  it("does not throw on malformed markup", () => {
    expect(() => parsearHtml("<div><p>sin cerrar")).not.toThrow();
  });
});
