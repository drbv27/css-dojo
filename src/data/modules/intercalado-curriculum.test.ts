import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";
import { intercalarModulo } from "@/lib/intercalado";

/**
 * Guards the `afterLesson` anchors across the REAL curriculum.
 *
 * `intercalado.test.ts` proves the rule over fixtures. This file proves the
 * data obeys it, which is a different failure: a dangling anchor renders a
 * page that looks completely normal while quietly moving an exercise out of
 * the lesson it was written for. Nothing throws, nothing looks broken, and the
 * only symptom is a student who never meets that challenge where it was meant
 * to appear.
 *
 * The runtime already fails safe — a dangling anchor degrades to un-anchored
 * rather than vanishing. This test is what makes someone fix the typo instead
 * of living with the degraded behaviour forever.
 */

describe("anclas de retos intercalados en el curriculum real", () => {
  it("NINGUN ejercicio ancla a una leccion que no existe en su modulo", () => {
    const colgadas: string[] = [];

    for (const mod of ALL_MODULES) {
      const idsDeLeccion = new Set(mod.lessons.map((l) => l.id));
      for (const ej of mod.exercises) {
        if (ej.afterLesson !== undefined && !idsDeLeccion.has(ej.afterLesson)) {
          colgadas.push(`${mod.slug}/${ej.id} -> ${ej.afterLesson}`);
        }
      }
    }

    // Enumerated, not counted: a failure has to name the exercise and the id it
    // points at, or the next person re-derives it by hand.
    expect(colgadas).toEqual([]);
  });

  it("ningun ejercicio se pierde al intercalar, en ningun modulo", () => {
    // The invariant that makes the whole feature safe to ship: whatever the
    // anchors say, every exercise still appears somewhere.
    const perdidos: string[] = [];

    for (const mod of ALL_MODULES) {
      const { bloques, sinAnclar } = intercalarModulo(mod.lessons, mod.exercises);
      const vistos = new Set(
        [...bloques.flatMap((b) => b.retos), ...sinAnclar].map((e) => e.id),
      );
      for (const ej of mod.exercises) {
        if (!vistos.has(ej.id)) perdidos.push(`${mod.slug}/${ej.id}`);
      }
    }

    expect(perdidos).toEqual([]);
  });

  /**
   * The rollout ledger. `box-model` is the pilot: the first module to carry the
   * pattern, chosen because it is one of the two the instructor named as most
   * important in the track — if interleaving does not improve THAT module, it
   * improves none.
   *
   * When the pattern rolls out to the rest, this test fails and forces whoever
   * does it to say so here rather than let the rollout drift unrecorded.
   */
  it("los modulos con retos intercalados son exactamente los esperados", () => {
    const INTERCALADOS = ["box-model"];

    const conAnclas = ALL_MODULES.filter((m) =>
      m.exercises.some((e) => e.afterLesson !== undefined),
    ).map((m) => m.slug);

    expect(conAnclas.sort()).toEqual([...INTERCALADOS].sort());
  });

  it("box-model tiene TODOS sus ejercicios anclados, y ninguna leccion vacia", () => {
    // A half-anchored module is the worst of both worlds: some challenges show
    // up next to their lesson and the rest appear only in the exercise tab,
    // with nothing telling the student why.
    const mod = ALL_MODULES.find((m) => m.slug === "box-model")!;
    const { bloques, sinAnclar } = intercalarModulo(mod.lessons, mod.exercises);

    expect(sinAnclar).toEqual([]);
    expect(bloques.map((b) => [b.leccion.id, b.retos.length])).toEqual([
      ["11-leccion-01", 2],
      ["11-leccion-02", 3],
      ["11-leccion-03", 2],
      ["11-leccion-04", 1],
    ]);
  });
});
