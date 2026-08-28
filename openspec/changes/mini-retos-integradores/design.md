# Design — mini-retos-integradores

## Where the steps live: in ONE place, not two

A challenge declares its steps and nothing else:

```ts
retoPasos: [
  { instruccion: "Dale a `p.solid` un borde de estilo solid",
    esperado: "p.solid { border-style: solid; }" },
  { instruccion: "Dale a `p.thick` el atajo 3px solid red",
    esperado: "p.thick { border: 3px solid red; }" },
  ...
]
```

`targetCSS` is **not** written by hand on a challenge. It is derived by joining
the steps' `esperado`.

Declaring both would be two sources of truth for the same fact, and they drift:
someone edits a step, the preview keeps showing the old target, and the exercise
grades against something the student was never shown. The whole reason
`css-rules` grades against `targetCSS` instead of a separate `answer` was to
avoid exactly this — the comment in `cssRules.ts` says so.

## Grading: reuse `compararReglas`, once per step

`compararReglas(esperado, enviado)` already returns
`{correct, score, faltantes}` with the missing declarations. Per-step feedback
is that function called once per step, not a new engine.

The per-step verdict is `correct`. The overall score is the fraction of steps
satisfied.

## THE HARD DECISION, and it is a product question

The route completes an exercise at `score >= 70`. For a four-step challenge,
three steps out of four is 75 — **completed, with a whole step skipped.** On an
exercise whose entire point is doing the parts together, and which counts toward
the certificate.

### This is not new, and it is worse than anyone thinks

Measured 2026-08-28 over the 77 `css-rules` exercises in the curriculum:

| expected declarations | exercises | score with one missing |
|---|---|---|
| 2 | 12 | 50 |
| 3 | 7 | 67 |
| 4 | 12 | **75 — completes** |
| 6 | 12 | **83 — completes** |
| 9 | 6 | **89 — completes** |
| 17 | 2 | **94 — completes** |

**56 of 77 already complete with a declaration missing.** The one with 17
declarations completes with five missing.

So "partial credit completes" is the platform's existing rule, applied to
everything, and nobody chose it — it fell out of a fixed 70 threshold meeting a
proportional score.

### Recommendation

**A challenge requires all of its steps: `correct` only at 100.**

Not because the existing rule is wrong everywhere — an eight-declaration drill
where a student misses one has arguably learned it — but because *integrating*
is the property being tested here. Three quarters of an integration is not an
integration, and this is the exercise the certificate leans on.

Implementing it needs the route to complete on `correct` rather than
`score >= 70`, which changes behaviour for the other 788 exercises too. **That
is out of scope here and must not be smuggled in.**

The narrow version that fits this change: `calificar` returns **score 100 or
score 0** for a challenge, never a fraction. The per-step detail still reaches
the student through the feedback, so nothing is lost in the interface — only the
score stops lying about a partial integration.

**Left for the instructor:** whether the 70-threshold rule should change for the
other 788. It is a real product question with 56 exercises behind it, and it
belongs in its own change.

## The component: wrap, do not replace

`LiveEditorExercise` is 150 lines and already picks CSS vs HTML mode by
negation, with a comment warning that a third negation would make all three
fragile. `JsBehaviorExercise` exists for precisely that reason.

So the challenge gets its own component, `RetoIntegrador`, following the
precedent: `ExerciseRenderer` branches on the challenge mark the same way it
already branches on `js-behavior`. The 86 existing `live-editor` exercises are
not touched.

`RetoIntegrador` renders the numbered steps beside the editor with a per-step
state — pending, satisfied, outstanding — and the reference solution behind the
completion lock.

## The lock, and what it is honestly worth

The reference solution is not rendered until the student's `Progress` for the
challenge reads `completed: true`.

**It is a lock in the interface, not a boundary**, and the spec now says so. The
exercise page is `"use client"` and imports `ALL_MODULES`, so the answers of all
789 exercises are already in the browser bundle. Making it a boundary means
taking the curriculum out of the client, which is its own change and whose case
is now weak: what mattered — claiming a completion you did not earn — was closed
by `revalidacion-en-servidor`.

## What this inherits from today's work

- `calificar` is one module used by both sides, so the challenge grades the same
  in the browser and on the server, with no second implementation to drift.
- The server decides completion, so the lock cannot be lifted by forging a
  submission.
- The `referenceSolution` guard extends naturally: a challenge's reference
  solution must score 100 against its own steps, and a wrong answer must not.
