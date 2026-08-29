import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every color class the app uses must be a token that actually exists.
 *
 * ## Why this guard exists
 *
 * Tailwind v4 generates a utility only for a `--color-*` declared in `@theme`.
 * A class naming a token that was never declared is NOT an error: it compiles,
 * it renders, and it does NOTHING. The element simply has no background.
 *
 * That is invisible over a page whose background is already dark -- until
 * something needs to be opaque. `bg-editor-panel` was invented for the teacher
 * certificate view and used five times; nobody noticed until a modal appeared
 * transparent and the table behind it showed through its text.
 *
 * This is the third time an orphan class has shipped in this project. The other
 * two were `.terminal` in the class presentations. A missing declaration should
 * fail the build, not wait for someone to look at the right screen.
 */

const RAIZ = "src";
const CLASES =
  /\b(?:bg|text|border|from|to|via|ring|fill|stroke|shadow|outline|decoration|accent|caret|divide|placeholder)-((?:editor|neon|css|ts)-[a-z]+)/g;

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivos(p);
    return /\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n) ? [p] : [];
  });
}

const DECLARADOS = new Set(
  [...readFileSync("src/app/globals.css", "utf8").matchAll(/--color-([a-z-]+)\s*:/g)].map(
    (m) => m[1],
  ),
);

const FUENTES = archivos(RAIZ);
const usos = new Map<string, string[]>();
for (const f of FUENTES) {
  const texto = readFileSync(f, "utf8");
  for (const m of texto.matchAll(CLASES)) {
    usos.set(m[1], [...new Set([...(usos.get(m[1]) ?? []), f])]);
  }
}

describe("los tokens de color que usa la app existen", () => {
  it("el guard mira algo: hay fuentes, tokens declarados y tokens usados", () => {
    // Sin esto, un regex roto o una raiz equivocada dejan el guard en verde
    // sobre el conjunto vacio -- que es exactamente el bug que viene a cazar.
    expect(FUENTES.length).toBeGreaterThan(50);
    expect(DECLARADOS.size).toBeGreaterThan(10);
    expect(usos.size).toBeGreaterThan(10);
  });

  it("ninguna clase nombra un token que no esta declarado en globals.css", () => {
    const huerfanos = [...usos.entries()]
      .filter(([token]) => !DECLARADOS.has(token))
      .map(([token, archivos]) => `${token} -- usado en ${archivos.join(", ")}`);

    expect(huerfanos).toEqual([]);
  });
});
