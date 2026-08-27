import { describe, it, expect } from "vitest";
import { intercalarModulo, tieneRetosIntercalados } from "./intercalado";
import type { Exercise, Lesson } from "@/types";

/**
 * The interleaving rule, tested over fixtures.
 *
 * The case that matters most is the one nobody would notice in a browser: an
 * `afterLesson` naming a lesson that does not exist. If that exercise were
 * dropped, the page would still render, still look right, and a student would
 * simply never be shown it. So it degrades to un-anchored here, and a
 * curriculum guard fails the build separately.
 */

const leccion = (id: string, order: number): Lesson => ({
  id,
  title: `Leccion ${order}`,
  content: "",
  order,
});

const ejercicio = (id: string, order: number, afterLesson?: string): Exercise => ({
  id,
  type: "quiz",
  difficulty: 1,
  xpReward: 10,
  order,
  prompt: `Ejercicio ${order}`,
  validation: { type: "exact", answer: "x" },
  ...(afterLesson === undefined ? {} : { afterLesson }),
});

const LECCIONES = [leccion("l1", 1), leccion("l2", 2), leccion("l3", 3)];

describe("intercalado: un modulo sin anclar se comporta EXACTAMENTE como hoy", () => {
  const ejercicios = [ejercicio("e1", 1), ejercicio("e2", 2), ejercicio("e3", 3)];

  it("ninguna leccion recibe retos", () => {
    const r = intercalarModulo(LECCIONES, ejercicios);
    expect(r.bloques.map((b) => b.retos)).toEqual([[], [], []]);
  });

  it("todos los ejercicios quedan sin anclar, en orden", () => {
    const r = intercalarModulo(LECCIONES, ejercicios);
    expect(r.sinAnclar.map((e) => e.id)).toEqual(["e1", "e2", "e3"]);
  });

  it("el modulo se reporta como NO intercalado", () => {
    // This is what the renderer reads to decide whether to change anything at
    // all. Retrocompatibility is not a claim in a comment: it is this boolean.
    expect(tieneRetosIntercalados(LECCIONES, ejercicios)).toBe(false);
  });
});

describe("intercalado: con anclas", () => {
  const ejercicios = [
    ejercicio("e1", 1, "l1"),
    ejercicio("e2", 2, "l1"),
    ejercicio("e3", 3, "l2"),
    ejercicio("e4", 4),
  ];

  it("cada leccion recibe SUS retos, y ninguno mas", () => {
    const r = intercalarModulo(LECCIONES, ejercicios);
    expect(r.bloques.map((b) => [b.leccion.id, b.retos.map((e) => e.id)])).toEqual([
      ["l1", ["e1", "e2"]],
      ["l2", ["e3"]],
      ["l3", []],
    ]);
  });

  it("una leccion sin retos sigue apareciendo, vacia", () => {
    // Dropping it would silently remove a lesson from the page.
    const r = intercalarModulo(LECCIONES, ejercicios);
    expect(r.bloques.map((b) => b.leccion.id)).toEqual(["l1", "l2", "l3"]);
  });

  it("el ejercicio sin ancla queda suelto, no se pierde", () => {
    const r = intercalarModulo(LECCIONES, ejercicios);
    expect(r.sinAnclar.map((e) => e.id)).toEqual(["e4"]);
  });

  it("NINGUN ejercicio se pierde: bloques mas sueltos da el total", () => {
    // The invariant that makes every other test safe. Without it, a rule that
    // quietly dropped one exercise could pass all the assertions above.
    const r = intercalarModulo(LECCIONES, ejercicios);
    const vistos = [...r.bloques.flatMap((b) => b.retos), ...r.sinAnclar].map((e) => e.id);
    expect(vistos.sort()).toEqual(["e1", "e2", "e3", "e4"]);
  });

  it("el modulo se reporta como intercalado", () => {
    expect(tieneRetosIntercalados(LECCIONES, ejercicios)).toBe(true);
  });
});

describe("intercalado: orden", () => {
  it("las lecciones salen por su campo order, no por el orden del array", () => {
    const desordenadas = [leccion("l3", 3), leccion("l1", 1), leccion("l2", 2)];
    const r = intercalarModulo(desordenadas, []);
    expect(r.bloques.map((b) => b.leccion.id)).toEqual(["l1", "l2", "l3"]);
  });

  it("los retos de una leccion salen por su campo order", () => {
    const desordenados = [
      ejercicio("tarde", 9, "l1"),
      ejercicio("temprano", 2, "l1"),
      ejercicio("medio", 5, "l1"),
    ];
    const r = intercalarModulo(LECCIONES, desordenados);
    expect(r.bloques[0].retos.map((e) => e.id)).toEqual(["temprano", "medio", "tarde"]);
  });

  it("los sueltos tambien salen por order", () => {
    const r = intercalarModulo(LECCIONES, [ejercicio("b", 7), ejercicio("a", 3)]);
    expect(r.sinAnclar.map((e) => e.id)).toEqual(["a", "b"]);
  });
});

describe("intercalado: el ancla colgada, que es el caso que nadie veria", () => {
  it("un ancla a una leccion inexistente NO hace desaparecer el ejercicio", () => {
    // A page rendered without it looks completely normal. The student just
    // never sees that exercise. Falling back to un-anchored keeps it visible.
    const r = intercalarModulo(LECCIONES, [ejercicio("huerfano", 1, "l-que-no-existe")]);

    expect(r.sinAnclar.map((e) => e.id)).toEqual(["huerfano"]);
    expect(r.bloques.every((b) => b.retos.length === 0)).toBe(true);
  });

  it("un ancla a una leccion de OTRO modulo tampoco lo ancla", () => {
    // Ids are only unique within a module, so a copy-pasted exercise can carry
    // a perfectly valid-looking id that belongs somewhere else.
    const r = intercalarModulo(LECCIONES, [ejercicio("copiado", 1, "11-leccion-02")]);
    expect(r.sinAnclar.map((e) => e.id)).toEqual(["copiado"]);
  });

  it("un modulo SIN lecciones deja todo suelto en vez de romperse", () => {
    const r = intercalarModulo([], [ejercicio("e1", 1, "l1"), ejercicio("e2", 2)]);
    expect(r.bloques).toEqual([]);
    expect(r.sinAnclar.map((e) => e.id)).toEqual(["e1", "e2"]);
  });

  it("un modulo sin ejercicios devuelve sus lecciones vacias", () => {
    const r = intercalarModulo(LECCIONES, []);
    expect(r.bloques.map((b) => b.retos)).toEqual([[], [], []]);
    expect(r.sinAnclar).toEqual([]);
  });
});
