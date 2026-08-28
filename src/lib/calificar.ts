import { compararReglas } from "@/lib/cssRules";
import { compararEstructura } from "@/lib/htmlStructure";
import type { Exercise } from "@/types";

/**
 * THE grading rule. One copy, used by the exercise UI and by the API.
 *
 * It lived in `ExerciseRenderer.tsx` — a `"use client"` component — so the
 * server had no way to reach it and `POST /api/progress` believed whatever
 * score the browser sent. Extracting it is what lets the server decide.
 *
 * Extracting, not reimplementing, and the difference is the whole point: a
 * second implementation that is stricter about whitespace, quoting or
 * declaration order silently rejects students who genuinely solved the
 * exercise, and it reads to them as their own mistake. 674 of the 789 exercises
 * grade by `exact`, where any asymmetric normalisation is a false rejection.
 */

/**
 * A union rather than `{correct, score, calificable}`, so that "I could not
 * grade this, and here is a score" is NOT REPRESENTABLE. A caller cannot
 * accidentally treat an ungradeable submission as a passing one.
 *
 * Same reason `JsRunOutcome` in `@/types` and `Certificabilidad` in
 * `@/lib/certificados` are unions.
 */
export type Calificacion =
  | { calificable: true; correct: boolean; score: number }
  /** Runs the student's JavaScript in a Worker; there is no server equivalent. */
  | { calificable: false; motivo: "solo-cliente"; tipo: string }
  /** The answer arrived in a shape this exercise cannot be graded against. */
  | { calificable: false; motivo: "respuesta-ilegible" }
  /** The exercise declares no expectation, or a validation nobody implements. */
  | { calificable: false; motivo: "sin-expectativa"; tipo: string };

/**
 * Parses HTML. Optional so the browser can use its own `DOMParser` and a route
 * handler can pass jsdom's.
 *
 * Passed in rather than assigned onto `globalThis`: an assignment works, and it
 * makes a server module's behaviour depend on something that happened in
 * another file — which breaks the day someone imports this from a second route
 * and forgets the incantation.
 */
export type ParserHtml = (html: string) => Document | null;

const noCalificable = (score: number): Calificacion => ({
  calificable: true,
  correct: false,
  score,
});

/**
 * Grades a submission.
 *
 * DISPATCHES ON THE EXERCISE, NOT ON `validation.type` ALONE, and that is not a
 * stylistic choice. Every `drag-drop` exercise declares
 * `validation: {type: "exact", answer: {"drag-1": "zone-content", ...}}` while
 * its real rule is "each item in its own `correctZone`". Running the `exact`
 * branch on one compares `String(objeto)` to `String(objeto)` — that is
 * `"[object Object]"` against itself — so it passes for ANY placement,
 * including an empty one. Measured and reproduced 2026-08-28 against a copy of
 * the exact branch: a fully wrong placement scores 100, and so does `{}`.
 *
 * Ninety-three exercises would become free, and a guard that only checks "the
 * correct answer scores 100" would stay green the whole time.
 */
export function calificar(
  ejercicio: Exercise,
  respuesta: unknown,
  parseHtml?: ParserHtml,
): Calificacion {
  // FIRST, and before any look at `validation`. See the note above.
  if (ejercicio.type === "drag-drop") {
    return calificarDragDrop(ejercicio, respuesta);
  }

  const v = ejercicio.validation;

  switch (v.type) {
    case "exact": {
      // Both the answer and the submission may be arrays or scalars.
      const esperados = Array.isArray(v.answer) ? v.answer : [v.answer];
      const dados = Array.isArray(respuesta) ? respuesta : [respuesta];
      const correct =
        esperados.length === dados.length &&
        esperados.every(
          (esp: unknown, i: number) =>
            String(esp).trim().toLowerCase() ===
            String(dados[i]).trim().toLowerCase(),
        );
      return { calificable: true, correct, score: correct ? 100 : 0 };
    }

    case "regex": {
      if (v.answer === undefined) return { calificable: false, motivo: "sin-expectativa", tipo: v.type };
      const regex = new RegExp(String(v.answer), "i");
      const texto = Array.isArray(respuesta) ? respuesta.join(" ") : String(respuesta);
      const correct = regex.test(texto);
      return { calificable: true, correct, score: correct ? 100 : 0 };
    }

    case "includes": {
      // Kept because the type still exists, though no CSS or HTML exercise may
      // use it: `validacion-curriculum.test.ts` forbids its return after 61
      // exercises were found passable by typing the answer as prose.
      const esperados = (Array.isArray(v.answer) ? v.answer : [v.answer]).map(String);
      if (esperados.length === 0) return { calificable: false, motivo: "sin-expectativa", tipo: v.type };
      const texto = String(respuesta).toLowerCase();
      const hallados = esperados.filter((e) => texto.includes(e.toLowerCase()));
      const score = Math.round((hallados.length / esperados.length) * 100);
      return { calificable: true, correct: score === 100, score };
    }

    case "includes-ordered": {
      // Like `includes` but the fragments must appear IN ORDER, which forces
      // correct structure/nesting and cuts false positives.
      const esperados = (Array.isArray(v.answer) ? v.answer : [v.answer]).map(String);
      if (esperados.length === 0) return { calificable: false, motivo: "sin-expectativa", tipo: v.type };
      const texto = String(respuesta).toLowerCase();
      let pos = 0;
      let hallados = 0;
      for (const e of esperados) {
        const frag = e.toLowerCase();
        const idx = texto.indexOf(frag, pos);
        if (idx === -1) break; // missing or out of order -> stop
        hallados++;
        pos = idx + frag.length;
      }
      const score = Math.round((hallados / esperados.length) * 100);
      return { calificable: true, correct: score === 100, score };
    }

    case "css-rules": {
      // Grades against the exercise's own `targetCSS` by default, so the
      // correct answer lives in one place and cannot drift from what the
      // preview shows. `answer` is only an override.
      const esperado = v.answer
        ? (Array.isArray(v.answer) ? v.answer : [v.answer]).join("\n")
        : (ejercicio.targetCSS ?? "");
      if (!esperado.trim()) return { calificable: false, motivo: "sin-expectativa", tipo: v.type };
      const { correct, score } = compararReglas(esperado, String(respuesta));
      return { calificable: true, correct, score };
    }

    case "html-structure": {
      const expectativas = (Array.isArray(v.answer) ? v.answer : [v.answer])
        .filter((e) => e !== undefined && e !== null)
        .map(String);
      if (expectativas.length === 0) return { calificable: false, motivo: "sin-expectativa", tipo: v.type };
      const { correct, score } = compararEstructura(
        expectativas,
        String(respuesta),
        parseHtml,
      );
      return { calificable: true, correct, score };
    }

    case "js-behavior":
      // Runs in a Web Worker and is scored asynchronously by the client. There
      // is no server equivalent without putting a code-execution sandbox in the
      // backend, and the `js` track declares no `nivel`, so it certifies
      // nothing today. Enumerated on purpose rather than left to fall through.
      return { calificable: false, motivo: "solo-cliente", tipo: v.type };

    case "visual":
      // Fails closed on purpose. This branch once returned `{correct: true,
      // score: 80}` with a comment claiming real validation happened on the
      // server — it did not, so everything reaching it was awarded credit for
      // anything at all. A validator that cannot validate must not grant credit.
      return noCalificable(0);

    default:
      // A validation type added later lands here and grants NOTHING, instead of
      // quietly falling back to trusting whatever the client claimed.
      return { calificable: false, motivo: "sin-expectativa", tipo: String(v.type) };
  }
}

/**
 * `drag-drop`, graded by its zones — the rule the UI has always used, which is
 * NOT what its `validation` field declares. See the note on `calificar`.
 */
function calificarDragDrop(ejercicio: Exercise, respuesta: unknown): Calificacion {
  const items = ejercicio.dragItems ?? [];
  if (items.length === 0) {
    return { calificable: false, motivo: "sin-expectativa", tipo: "drag-drop" };
  }
  if (respuesta === null || typeof respuesta !== "object" || Array.isArray(respuesta)) {
    // A placement is a `{itemId: zoneId}` object. Anything else cannot be read
    // as one, and must not be silently scored.
    return { calificable: false, motivo: "respuesta-ilegible" };
  }

  const colocaciones = respuesta as Record<string, unknown>;
  let aciertos = 0;
  for (const item of items) {
    if (colocaciones[item.id] === item.correctZone) aciertos++;
  }
  const score = Math.round((aciertos / items.length) * 100);
  return { calificable: true, correct: score === 100, score };
}

/**
 * The exercises this grader cannot grade, listed rather than implied.
 *
 * A validation type must never fall through to client-trust by omission, so
 * this list is asserted by a curriculum guard: adding an ungradeable exercise
 * fails the build until someone puts it here deliberately.
 */
export function esSoloCliente(ejercicio: Exercise): boolean {
  return ejercicio.validation.type === "js-behavior";
}
