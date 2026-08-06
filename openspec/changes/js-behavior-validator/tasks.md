# Tasks: js-behavior-validator

Phase: `tasks` · Depends on `design.md` · Delivery: three sequential PRs to `main`

Merge order is also revert order: slice 1 is inert until slice 2 consumes it,
slice 3 is inert without slice 2.

Gates for every slice: `npm run typecheck`, `npm run lint` (0 errors, 49 warnings
is the current baseline), `npm run build`, `npm run test:run`, `npm run test:e2e`.

---

## Phase 1 — Engine (PR 1/3, ~260 lines)

No component touched, no content touched. Independently mergeable.

- [x] 1.1 Add `js-behavior` to `ValidationType` in `src/types/index.ts`, plus
      `JsBehaviorCase`, `JsCaseOutcome`, `JsRunOutcome` and a `referenceSolution`
      field on the exercise type. Keep the run-level union so a syntax error
      cannot carry per-case results.
- [x] 1.2 `src/lib/jsBehavior.ts`: `validarCasos(cases)` — rejects an empty list, a
      `call` that is not a single expression, a missing `expect`, and a
      non-serializable `expect`. Returns the offending index and reason, not a
      boolean.
- [x] 1.3 `construirHarness(cases, nonce)` — returns the script source. Wraps the
      submission so a syntax error is caught and reported as run-level, evaluates
      each `call` in order, serializes each observed value, and posts one
      nonce-tagged message.
- [x] 1.4 `interpretarMensaje(raw, nonce)` — returns a `JsRunOutcome` for a
      matching nonce, `null` for a mismatch or a malformed payload. Must not throw
      on hostile input.
- [x] 1.5 `sonIguales(a, b)` — deep structural equality, no type coercion, handles
      nested arrays and objects, treats `"3"` and `3` as different.
- [x] 1.6 `puntuar(outcomes)` — `{ score, correct, fallidos }` with
      `Math.round(passed / total * 100)`, matching how `cssRules.ts` awards
      partial credit.
- [x] 1.7 `src/lib/jsBehavior.test.ts` covering every branch above, including the
      unserializable path and the mismatched nonce. Write the malformed-input
      cases first; they are the ones that matter.
- [x] 1.8 Run all five gates.

**Done when:** the engine is fully unit-tested with no consumer, and reverting the
PR removes it cleanly.

---

## Phase 2 — Integration (PR 2/3, ~300 lines)

> Task 2.8 was pulled FORWARD, before the UI, because it carried the design's
> load-bearing assumption. It refuted part of it: the executor is now a Web
> Worker, not the preview iframe. Tasks 2.3 and 2.4 were rewritten accordingly.
>
> Split in two after 2.4. Tasks 2.1-2.4 are the plumbing and are inert: nothing
> imports the hook, and the golden guard proves the preview document is
> unchanged. Tasks 2.5-2.8 are the UI and the end-to-end proof, which need the
> exercise components and a browser.

- [x] 2.1 **First, write the regression guard.** A test asserting the
      `LivePreview` srcdoc is byte-identical to today's output when no cases are
      present. This runs before any change to the component, so it fails for the
      right reason if the conditional injection is wrong.
- [x] 2.2 `LivePreview.tsx`: accept optional `harness` and append it inside the
      existing `<script>` block only when provided. Do not restructure the srcdoc
      template; the guard in 2.1 exists to prove it did not change.
- [x] 2.3 `src/hooks/useJsBehavior.ts`: generate the nonce, attach the `message`
      listener, arm the deadline, clear both on unmount, return
      `{ estado, resultado, ejecutar }`.
- [x] 2.4 Timeout path: on expiry report `timeout` and bump the `LivePreview`
      `key` to discard the frame. Verify a second submission afterwards is
      gradeable — the exercise must not need a page reload.
- [ ] 2.5 A JS mode for `LiveEditorExercise`: today it branches CSS vs HTML on
      `targetCSS` and `cssPrefix`. Add the third mode explicitly rather than by
      another negation, and show per-case results with the case `label` when
      present.
- [ ] 2.6 Wire `js-behavior` into `ExerciseRenderer` and confirm score flows
      through the existing progress and XP path with no new branch.
- [ ] 2.7 E2E spec: correct submission scores 100; syntax error surfaces the
      engine message; `while (true)` times out and the exercise stays usable.
- [x] 2.8 E2E assertion that a message actually crosses the sandbox boundary from
      `allow-scripts` without `allow-same-origin`. The design rests on this, so it
      gets its own test rather than a comment.
- [ ] 2.9 Run all five gates.

**Done when:** an exercise authored by hand in a scratch file grades end to end,
and the 28 existing `js:` previews are proven unchanged.

---

## Phase 3 — Content and guard (PR 3/3, ~200 lines)

- [x] 3.1 **First, write the data guard.** In a new
      `src/data/modules/validacion-js.test.ts`: every `js-behavior` exercise has a
      `referenceSolution`; every case is well-formed per `validarCasos`; and every
      reference solution scores 100 against its own cases. The last assertion must
      evaluate the solution against the cases — never compare the cases to
      themselves, which is the tautology that let a malformed `targetCSS` through.
- [x] 3.2 Prove the guard non-vacuous before writing content: author one exercise
      with a deliberately wrong case and confirm the guard names it. **Commit
      before probing** — undoing a probe with `git checkout --` has cost
      uncommitted work twice in this project.
- [x] 3.3 Add `js-behavior` exercises to the `js` track. Each carries its
      `referenceSolution`. Target the misconception, not syntax recall, matching
      the exercises added in PRs #21–#23.
- [x] 3.4 Lower the `sinEscribir` threshold in `tipos-ejercicio.test.ts` from 63
      by the number of modules that gained a writing exercise. Never raise it.
- [x] 3.5 Confirm the new exercises pass every existing data guard —
      `acentuacion`, `signos-interrogacion`, `orden-lecciones`, `tipos-ejercicio`.
      They run automatically; the point is to read the failures rather than
      assume there are none.
- [x] 3.6 Run all five gates.
- [ ] 3.7 Update `ESTADO.md`: what shipped, the accepted constraints, and that
      server-side execution is now the single follow-up that closes both the
      inspectability limit and the standing client-side-grading debt item.

**Done when:** at least one `js` module has a write-from-scratch exercise, every
reference solution is proven to score 100, and the threshold reflects it.

---

## Not in any phase

Server-side execution, React component exercises, TypeScript type-level
exercises, and converting existing `code-completion` or `quiz` exercises. All
recorded as follow-ups in `proposal.md`.
