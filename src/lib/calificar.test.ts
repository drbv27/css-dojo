import { describe, it, expect } from "vitest";
import { calificar } from "@/lib/calificar";
import type { Exercise } from "@/types";

/**
 * The branches of the grader that the curriculum cannot reach.
 *
 * `calificador-curriculum.test.ts` runs the grader over all 808 exercises that
 * exist. By construction it cannot cover what happens to an exercise that does
 * NOT exist yet -- and that is the branch the whole change rests on: a
 * validation type added later must grant nothing, instead of quietly falling
 * back to trusting whatever the client claimed.
 *
 * A guard that only exercises the shipped curriculum would stay green while
 * that fallback was reintroduced.
 */

const ejercicio = (validation: unknown): Exercise =>
  ({
    id: "ej-x",
    type: "quiz",
    xpReward: 10,
    validation,
  }) as unknown as Exercise;

describe("calificar: lo que el curriculum de hoy no puede alcanzar", () => {
  it("un tipo de validacion que nadie implemento NO otorga nada", () => {
    const r = calificar(ejercicio({ type: "telepatia", answer: "lo que sea" }), "lo que sea");

    expect(r.calificable).toBe(false);
    if (!r.calificable) expect(r.motivo).toBe("sin-expectativa");
  });

  it("`visual` falla cerrado: no otorga credito, saque lo que saque", () => {
    // Esta rama devolvia `{correct: true, score: 80}` con un comentario que
    // afirmaba que la validacion real pasaba en el servidor. No pasaba.
    const r = calificar(ejercicio({ type: "visual" }), "cualquier cosa");

    expect(r.calificable && r.correct).toBe(false);
    if (r.calificable) expect(r.score).toBeLessThan(70);
  });

  it("un ejercicio sin expectativa declarada no es pasable, y lo dice", () => {
    const r = calificar(ejercicio({ type: "regex" }), "cualquier cosa");

    expect(r.calificable).toBe(false);
    if (!r.calificable) expect(r.motivo).toBe("sin-expectativa");
  });

  it("un drag-drop con una respuesta que no es una colocacion es ilegible, no un cero", () => {
    // La diferencia importa: un cero dice "lo hiciste mal", e ilegible dice
    // "no pude corregir esto". Solo el segundo se registra con su motivo.
    const drag = {
      id: "ej-d",
      type: "drag-drop",
      xpReward: 10,
      dragItems: [{ id: "d1", content: "", correctZone: "z1" }],
      dropZones: [{ id: "z1", label: "" }],
      validation: { type: "exact", answer: { d1: "z1" } },
    } as unknown as Exercise;

    const r = calificar(drag, "una cadena, no una colocacion");

    expect(r.calificable).toBe(false);
    if (!r.calificable) expect(r.motivo).toBe("respuesta-ilegible");
  });
});
