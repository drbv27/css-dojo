# Tasks — mini-retos-integradores

The machinery is small. **Nineteen genuinely integrating challenges are not**,
and they are pedagogical judgment rather than code — so the slicing puts every
mechanism in the first slice and the content in batches behind it.

## Review Workload Forecast

| | |
|---|---|
| Estimated changed lines | **~1 400** total |
| Slice A (machinery + 1 pilot) | ~600 |
| Slices B/C/D (18 challenges) | ~270 each |
| 800-line budget risk | **High for the whole, low per slice** |
| Chained PRs | **Yes** — strategy already cached: stacked-to-main |

---

## Slice A — the machinery, proven on one module

Ends with `box-model` carrying a real integrating challenge and every guard in
place. The other 18 required modules are untouched and unaffected.

- [x] A.1 `retoPasos?: { instruccion: string; esperado: string }[]` on `Exercise`. **Optional**, and its absence means "an ordinary exercise" — never "a challenge with zero steps".
- [x] A.2 `cssEsperadoDe(ejercicio)` joins the steps.
  - **Turned into THE single accessor**, not just a challenge helper: it returns the derived CSS for a challenge and `targetCSS` for anything else. Five existing `css-rules` guards were reading `e.ex.targetCSS!` directly and broke on the pilot; routing them through the accessor means no future guard has to know challenges exist. A challenge MUST NOT hand-write `targetCSS`: two sources of truth for the same fact drift, and the drift shows the student a preview of one thing while grading another.
- [x] A.3 `calificar` grades a challenge step by step with `compararReglas`, returning per-step verdicts.
- [x] A.4 **100 or 0, never a fraction.** Instructor decision 2026-08-28. Three of four steps is 75, which clears the route's `score >= 70` and completes a challenge with a whole step skipped — on the exercise whose point is doing the parts together, and which counts toward the certificate.
  - **This narrow rule MUST NOT be generalised to the other 788 exercises here.** 56 of the 77 `css-rules` exercises already complete with a declaration missing; changing that is its own change and its own product decision.
- [x] A.5 `RetoIntegrador` component: numbered steps beside the editor, each showing pending / satisfied / outstanding. Follows the `JsBehaviorExercise` precedent — `ExerciseRenderer` branches, `LiveEditorExercise` is not touched.
- [x] A.6 The reference solution renders only when this student's `Progress` for the challenge reads `completed: true`. A lock in the interface, not a boundary — the spec says so and so must the code comment.
- [x] A.7 Curriculum guards:
  - at most one challenge per module, naming both exercises when violated;
  - a challenge has **at least two steps** — one step is an ordinary exercise wearing a badge;
  - a challenge's `referenceSolution` scores **100** against its own steps;
  - **and a deliberately wrong answer does not.** Without this half the guard is vacuous, exactly as it was for the 93 drag-drops.
- [x] A.8 Write the `box-model` challenge: integrates `box-sizing`, `padding`, `border` and the visible-width calculation in one task.
- [x] A.9 **Positive control:** give the pilot three of its four steps and confirm it scores **0**, not 75. If it scores 75, A.4 did not land.
- [x] A.10 **Positive control:** render the challenge for a student with no `Progress` and confirm the reference solution is absent from the output; then with `completed: true` and confirm it appears.
- [x] A.11 **Positive control:** break `cssEsperadoDe` so the preview and the grading disagree, and confirm a guard turns red. A derived target that nothing checks is a hand-written target with extra steps.

## Slices B, C, D — the remaining 18 challenges

Six modules each, in curriculum order. Each slice is content plus the guard
count, no mechanism.

- [ ] B `que-es-css` · `selectores` · `propiedades-basicas` · `unidades-css` · `dimensiones` · `tipografias`
- [ ] C `selectores-descendientes` · `pseudo-clases` · `pseudo-elementos` · `especificidad` · `float-display` · `posicionamiento`
- [ ] D `flexbox` · `css-grid` · `variables-css` · `media-queries` · `tailwind-css` · `proyecto-cv-css`

Each slice MUST update the enumerated list of modules carrying a challenge, so
a batch cannot land unrecorded.

## Explicitly out of scope

The 11 optional CSS modules · the other five tracks · **changing the `score >= 70`
completion rule for the other 788 exercises** · taking the curriculum out of the
client bundle · anything that edits an existing exercise.
