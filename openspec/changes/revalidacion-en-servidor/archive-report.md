# Archive report: revalidacion-en-servidor

Archived **2026-08-29**, in place. The folder does not move: relocating it
breaks the bounded review, because the diff does not detect the rename.

## What shipped

`POST /api/progress` grades the submitted answer on the server before writing
`Progress`, instead of believing the score the browser sent. Merged into `main`
on 2026-08-28 across PRs #39, #40 and #41.

- `src/lib/calificar.ts` — THE grading rule, extracted from a `"use client"`
  component so the server can reach it. One copy, called by the exercise UI and
  by the route.
- `src/lib/parserHtmlServidor.ts` — jsdom, passed in as a parameter rather than
  installed onto a global.
- `src/lib/models/GradeMismatch.ts` — client/server disagreements, in their own
  append-only collection.
- `jsdom` promoted from devDependency to dependency.

## Measured at archive time

| | |
|---|---|
| Exercises graded by the server | **804 of 808** |
| Client-graded, enumerated | 4 `js-behavior` — `js-funciones/js07-ej-17`, `js-funciones/js07-ej-18`, `js-arrays/js08-ej-07`, `js-metodos-arrays/js09-ej-08` |
| Test suite | 332 passing, 32 files |
| `tsc --noEmit` | clean |

The proposal predicted "785 of 789". Both numbers moved for the same innocent
reason: `mini-retos-integradores` added 19 exercises after the proposal was
written. The ratio held — the four client-graded ones are the same four.

The proposal also named the modules of those four as `js-07-funciones`,
`js-08-arrays`, `js-09-metodos-arrays`. The real slugs are `js-funciones`,
`js-arrays`, `js-metodos-arrays`; the promoted spec carries the real ones.

## Spec promoted

`openspec/changes/revalidacion-en-servidor/specs/server-grading/spec.md` ->
`openspec/specs/server-grading/spec.md`, as a new capability `server-grading`.
Nine requirements, nineteen scenarios. No existing spec was modified and no
delta was destructive.

The archive gate warns when a change touches auth, MongoDB models or XP logic.
This one touches all three: it changes what `Progress.completed` means, adds the
`GradeMismatch` model, and moves the XP award behind server-computed
completion. Reviewed rather than waived — the requirement "Completion Already
Earned Is Never Revoked" exists specifically to bound that blast radius, and it
carries two guards.

## The record was three phases behind the code

`spec`, `design`, `tasks`, `apply` and `verify` all read `pending` while the
implementation had been merged for a day, and `next_recommended` said `spec`.
The session that shipped it wrote the code and never came back to the registry.

Closing it did NOT mean re-planning. The spec was written **against the code
that already runs**, deriving each requirement from the merged implementation
and its guards, and `design` and `tasks` are recorded as absorbed by the apply
that already happened rather than invented after the fact. Writing a design
document for a decision that has already shipped would be fiction with a
timestamp.

This is the fourth time an obsolete registry has cost this project real time.
The rule it earns: **a change is not shipped when the code merges — it is
shipped when the record says what the code does.** A `state.yaml` that disagrees
with `main` is worse than no record, because the next session trusts it.

## Two requirements had no guard, and now do

Mapping the spec onto the test suite is what surfaced them. Both were stated in
the proposal, both were implemented, and neither had anything that would go red
if the behaviour were removed:

1. **A failed disagreement-write must not cost the student their progress.**
2. **A validation type nobody implemented must grant nothing** — the branch the
   curriculum guard cannot reach by construction, and the one the whole change
   rests on.

Five positive controls were run and all five went red. `calificar.ts` and
`route.ts` are byte-identical to `main`. Detail in `verify-report.md`.

## Left open on purpose

- **The four `js-behavior` exercises stay client-graded.** No server equivalent
  without a code-execution sandbox in the backend. The `js` track declares no
  `nivel`, so it certifies nothing today. **If that track is ever classified,
  this becomes a blocker for the classification change**, and it belongs there.
- **Historical progress was not re-graded.** 5 349 completed documents stay.
- **The curriculum still ships to the browser.** Out of scope, and the case is
  weak now: what mattered — claiming a completion you did not earn — is closed.
- **`Progress.xpEarned` stores `maxXP` even on failed attempts**
  (`src/app/api/progress/route.ts`). Pre-existing, noted, not this change's.
