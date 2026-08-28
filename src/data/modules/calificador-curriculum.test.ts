import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";
import { calificar, esSoloCliente, cssEsperadoDe, esRetoIntegrador } from "@/lib/calificar";
import type { Exercise } from "@/types";

/**
 * Runs the ONE grader over the WHOLE curriculum, in both directions.
 *
 * ## Why the negative half exists, and why it is not symmetry
 *
 * A guard that only asserts "each exercise's own correct answer scores 100" is
 * VACUOUS for the 93 `drag-drop` exercises. They declare
 * `validation: {type: "exact", answer: {"drag-1": "zone-content", ...}}`, and
 * the `exact` branch compares `String(answer)` to `String(submission)` — that
 * is `"[object Object]"` against `"[object Object]"`. It passes for any
 * placement, including an empty one, so the correct answer scores 100 and the
 * guard stays green while every drag-drop is awarded to everybody.
 *
 * Measured and reproduced 2026-08-28. The negative half is what catches it.
 */

const TODOS = ALL_MODULES.flatMap((m) =>
  m.exercises.map((e) => ({ modulo: m.slug, ejercicio: e })),
);

/** The submission that SHOULD score 100 for this exercise. */
function respuestaCorrecta(e: Exercise): unknown {
  // Un reto no declara `targetCSS`: su CSS esperado se deriva de sus pasos.
  if (esRetoIntegrador(e)) {
    // Un reto de estructura no produce CSS: su respuesta correcta es el HTML
    // de su `referenceSolution`.
    return e.validation.type === "html-structure" ? e.referenceSolution : cssEsperadoDe(e);
  }
  if (e.type === "drag-drop") {
    return Object.fromEntries((e.dragItems ?? []).map((i) => [i.id, i.correctZone]));
  }
  const v = e.validation;
  if (v.type === "css-rules") {
    return v.answer
      ? (Array.isArray(v.answer) ? v.answer : [v.answer]).join("\n")
      : (e.targetCSS ?? "");
  }
  if (v.type === "html-structure" || v.type === "includes" || v.type === "includes-ordered") {
    // The expectations are fragments/selectors, not a document. These carry a
    // `referenceSolution` when one is needed; without it there is nothing
    // honest to submit, so they are exercised by the negative half only.
    return e.referenceSolution;
  }
  if (v.type === "regex") return e.referenceSolution;
  return v.answer;
}

/** A submission that MUST NOT score 100. */
function respuestaEquivocada(e: Exercise): unknown {
  if (e.type === "drag-drop") {
    const items = e.dragItems ?? [];
    const zonas = (e.dropZones ?? []).map((z) => z.id);
    // Every item shoved into a zone that is not its own.
    return Object.fromEntries(
      items.map((i) => [i.id, zonas.find((z) => z !== i.correctZone) ?? "zona-inexistente"]),
    );
  }
  return "esto-no-es-la-respuesta-de-ningun-ejercicio";
}

describe("el calificador, sobre el curriculum real", () => {
  it("cubre los 808 ejercicios que hay hoy", () => {
    // Pins the denominator. Every count below is meaningless without it.
    expect(TODOS.length).toBe(808);
  });

  it("POSITIVO: la respuesta correcta de cada ejercicio saca 100", () => {
    const fallan: string[] = [];

    for (const { modulo, ejercicio } of TODOS) {
      if (esSoloCliente(ejercicio)) continue;
      const correcta = respuestaCorrecta(ejercicio);
      if (correcta === undefined) continue; // sin respuesta registrada; ver el negativo
      const r = calificar(ejercicio, correcta);
      if (!r.calificable || r.score !== 100) {
        fallan.push(
          `${modulo}/${ejercicio.id} (${ejercicio.type}/${ejercicio.validation.type}) -> ` +
            (r.calificable ? `score ${r.score}` : `no calificable: ${r.motivo}`),
        );
      }
    }

    // Enumerated, not counted: a failure names the exercise, its validation and
    // the score it got, or the next person re-derives all three by hand.
    expect(fallan).toEqual([]);
  });

  /**
   * THE HALF THAT CATCHES THE DRAG-DROP TRAP. Without it the positive test
   * above passes while 93 exercises are free.
   */
  it("NEGATIVO: una respuesta deliberadamente equivocada NO saca 100", () => {
    const regalados: string[] = [];

    for (const { modulo, ejercicio } of TODOS) {
      if (esSoloCliente(ejercicio)) continue;
      const r = calificar(ejercicio, respuestaEquivocada(ejercicio));
      if (r.calificable && r.score === 100) {
        regalados.push(
          `${modulo}/${ejercicio.id} (${ejercicio.type}/${ejercicio.validation.type})`,
        );
      }
    }

    expect(regalados).toEqual([]);
  });

  it("NEGATIVO: un drag-drop con la colocacion VACIA no saca 100", () => {
    // The most explicit form of the trap: submitting nothing at all.
    const regalados: string[] = [];
    for (const { modulo, ejercicio } of TODOS) {
      if (ejercicio.type !== "drag-drop") continue;
      const r = calificar(ejercicio, {});
      if (r.calificable && r.score === 100) regalados.push(`${modulo}/${ejercicio.id}`);
    }
    expect(regalados).toEqual([]);
  });

  it("los unicos que el servidor no puede corregir son los 4 de js-behavior, enumerados", () => {
    // A validation type must never fall through to client-trust by omission.
    const soloCliente = TODOS.filter(({ ejercicio }) => esSoloCliente(ejercicio)).map(
      ({ modulo, ejercicio }) => `${modulo}/${ejercicio.id}`,
    );

    expect(soloCliente.sort()).toEqual([
      "js-arrays/js08-ej-07",
      "js-funciones/js07-ej-17",
      "js-funciones/js07-ej-18",
      "js-metodos-arrays/js09-ej-08",
    ]);
  });

  it("ningun ejercicio cae en 'sin-expectativa': eso seria un ejercicio impasable", () => {
    const rotos: string[] = [];
    for (const { modulo, ejercicio } of TODOS) {
      if (esSoloCliente(ejercicio)) continue;
      const r = calificar(ejercicio, respuestaEquivocada(ejercicio));
      if (!r.calificable && r.motivo === "sin-expectativa") {
        rotos.push(`${modulo}/${ejercicio.id} (${ejercicio.validation.type})`);
      }
    }
    expect(rotos).toEqual([]);
  });
});
