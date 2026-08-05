import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";

/**
 * Lessons and exercises are rendered by sorting on `order`:
 *   [...mod.lessons].sort((a, b) => a.order - b.order)
 *
 * Two items sharing an order makes the result depend on their position in the
 * array instead, silently -- nothing errors, the sequence is just not the one
 * anybody declared. A gap means the numbering no longer matches the position a
 * reader counts, which matters because lesson and exercise numbers are what
 * students and teachers refer to.
 *
 * Every module already satisfied both when this was written, across all six
 * tracks. It is a guard against drift, not a cleanup.
 */
describe("numeracion de lecciones y ejercicios", () => {
  const casos = ALL_MODULES.flatMap((m) => [
    { slug: m.slug, tipo: "lecciones", orders: m.lessons.map((l) => l.order) },
    { slug: m.slug, tipo: "ejercicios", orders: m.exercises.map((e) => e.order) },
  ]);

  it("ningun modulo repite un numero de orden", () => {
    const duplicados = casos
      .filter((c) => new Set(c.orders).size !== c.orders.length)
      .map((c) => `${c.slug} ${c.tipo}: ${c.orders.join(",")}`);

    expect(duplicados).toEqual([]);
  });

  it("los numeros de orden van de 1 a n sin huecos", () => {
    const irregulares = casos
      .filter((c) => {
        const ordenados = [...c.orders].sort((a, b) => a - b);
        const esperado = Array.from({ length: c.orders.length }, (_, i) => i + 1);
        return ordenados.join() !== esperado.join();
      })
      .map((c) => `${c.slug} ${c.tipo}: ${[...c.orders].sort((a, b) => a - b).join(",")}`);

    expect(irregulares).toEqual([]);
  });
});
