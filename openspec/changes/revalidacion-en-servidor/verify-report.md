# Verify report: revalidacion-en-servidor

Verdict: **pass**, verified on 2026-08-29 **against the merged tree** (`main` at
`3ef0978`, in sync with `origin/main`), not against a branch.

This change shipped before its spec was written. Verification therefore ran
backwards from the usual direction: the spec was derived from the merged
implementation, and this report is the check that every requirement it states is
actually enforced by something that fails when the behaviour is removed.

## Evidence

| | |
|---|---|
| Test suite | **332 passing, 32 files** (was 327 in 31 before this phase) |
| `tsc --noEmit` | clean |
| Server-graded exercises | **804 of 808**, measured |
| Client-graded, enumerated | 4 `js-behavior` |
| Positive controls run in this phase | 5, **all 5 red** |

## Requirement → guard

| Requirement | Enforced by |
|---|---|
| The Server Decides Completion | `route.test.ts`: forged 100 with an empty answer; forged 100 with a wrong answer; correct answer with a claimed 0 |
| One Grader, Extracted Rather Than Reimplemented | Structural: `ExerciseRenderer.tsx` (client) and `api/progress/route.ts` (server) both import `calificar` from `@/lib/calificar`; `parserHtmlServidor` is passed as a parameter, never assigned onto a global |
| A Grader That Could Not Grade Grants Nothing | `calificar.test.ts` (4 cases: unknown type, `visual`, no expectation, unreadable placement) + `route.test.ts`: an unexpected shape is a qualified rejection, not a 500 |
| An Exercise The Curriculum Does Not Declare Cannot Be Completed | `route.test.ts`: an undeclared exercise is rejected and writes nothing |
| Grading Dispatches On The Exercise, Not On Its Declared Validation Alone | `route.test.ts`: drag-drop wrong / empty / correct + `calificador-curriculum.test.ts` negative half over all 93 |
| The Exercises The Server Cannot Grade Are Enumerated, Not Implied | `calificador-curriculum.test.ts`: the only four are the enumerated `js-behavior`; no exercise falls into "no expectation declared" |
| The Server Grader Must Not Be Stricter Than The Student's Answer | `calificador-curriculum.test.ts`: covers 808; positive half (correct answer scores 100); negative half (wrong answer does not) |
| Disagreement Between Client And Server Is Recorded | `route.test.ts`: a forged submission is recorded with both scores; agreement records nothing; a failed recording does not cost the student their progress |
| Completion Already Earned Is Never Revoked | `route.test.ts`: a later failed attempt does not undo a completion; XP is granted once |

## Two requirements had NO guard, and now do

Mapping the spec onto the tests is what surfaced them. Both were stated in the
proposal and implemented in the code, and neither had anything that would go red
if it were removed.

**1. A failed recording must not cost the student their progress.**
`route.ts` writes the disagreement after persisting and swallows its error on
purpose. Nothing tested that. Added to `route.test.ts`, with the
`GradeMismatch` mock able to throw on demand.

Why it matters beyond tidiness: if the write moved ahead of the persist, or the
error propagated, a downed diagnostic collection would cost a student an
exercise they genuinely solved — and only those students whose client disagrees,
which is precisely the population one is trying to learn something about.

**2. A validation type nobody implemented must grant nothing.**
`calificador-curriculum.test.ts` runs the grader over the 808 exercises that
exist, and by construction cannot reach the branch for an exercise that does
not exist yet. That branch is what the whole change rests on: without it, a
validation type added later falls back to trusting the client. New file
`src/lib/calificar.test.ts` covers it, plus `visual` failing closed, a missing
expectation, and an unreadable drag-drop placement.

## Positive controls (all five red)

| Break | Guard that went red |
|---|---|
| The disagreement write stops swallowing its error | "un fallo escribiendo la discrepancia NO le cuesta el progreso al alumno" |
| `default:` returns `{correct: true, score: 100}` | "un tipo de validacion que nadie implemento NO otorga nada" |
| `visual` returns `{correct: true, score: 80}` (its old behaviour) | "`visual` falla cerrado" |
| `regex` with no expectation returns a pass | "un ejercicio sin expectativa declarada no es pasable" |
| An unreadable placement returns a plain 0 instead of "unreadable" | "un drag-drop con una respuesta que no es una colocacion es ilegible" |

`calificar.ts` and `route.ts` were restored after each control and are
byte-identical to `main` — checked with `git diff --stat`, empty.

## What was NOT done, and why

- **Historical `Progress` was not re-graded.** 5 349 completed documents written
  under the old rule stay as they are, by the instructor's decision. A bug in a
  re-grader would delete legitimate student work.
- **The four `js-behavior` exercises stay client-graded**, enumerated in
  `esSoloCliente` and asserted by a guard. The `js` track declares no `nivel`,
  so it certifies nothing today. **If that track is ever classified, this
  becomes a blocker for the classification change.**
- **The curriculum was not taken out of the client bundle.** Out of scope and
  stated as such in the spec, not left implied.
