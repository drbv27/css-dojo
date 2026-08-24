# Archive report — `automated-gates`

Archived 2026-08-24. The change itself shipped on 2026-08-04; this closes its SDD
cycle three weeks late, which is the reason most of this report is about
correcting a record that had drifted from reality.

## What the change delivered

The five verification gates that now protect the repo, plus the CI that runs
them. Two stacked slices:

- **Slice 1** — PR #1 `chore(lint): repair the ESLint gate and fix 11 blocking
  errors`, merged 2026-08-04T14:54:50Z. `next lint` had been removed in Next.js
  16.2.1 and no ESLint config existed, so the lint gate was simply broken. Slice
  1 added `eslint.config.mjs` (flat config), downgraded
  `@typescript-eslint/no-explicit-any` to `warn`, and fixed the 11 real errors —
  8 `react-hooks/set-state-in-effect`, 2 `preserve-manual-memoization`, 1
  `prefer-const` — taking the repo from 46 lint errors to 0.
- **Slice 2** — PR #2 `test(ci): add Vitest and Playwright tiers plus GitHub
  Actions enforcement`, merged 2026-08-04T14:55:21Z. Vitest + jsdom, the first
  unit suite (`src/lib/xp.test.ts`), a Playwright smoke test, the
  `.github/workflows/ci.yml` workflow, and the deletion of dead `calculateXP`.

## Specs promoted

Two delta specs became main specs, markers resolved and headers rewritten:

| Delta | Main spec |
|---|---|
| `changes/automated-gates/specs/automated-verification-gates/spec.md` | `openspec/specs/automated-verification-gates/spec.md` |
| `changes/automated-gates/specs/xp-progression/spec.md` | `openspec/specs/xp-progression/spec.md` |

Both were promoted the way `css-track-expansion` established: `# Spec: <capability>`
header, `Capability:` line, an `Established by change` paragraph, and no `Delta
for` / `## ADDED Requirements` / `Phase: spec` residue. Verified: zero delta
markers remain anywhere under `openspec/specs/`.

Promotion was not a copy. Several requirements were written as one-time
arithmetic about the change ("GIVEN the measured baseline of 46 lint errors …
46 − 35 − 11 = 0") or as gates on a slice that has long since merged ("before
slice 1 merges"). Frozen into a main spec, those read as invariants and would go
stale the first time anyone touched the repo. Each was split: the enduring
constraint states the rule, and a labelled `History:` note keeps the arithmetic.

Every concrete number promoted was re-measured, not copied:

| Claim | Source | Measured 2026-08-24 |
|---|---|---|
| 4 gate commands exist | `package.json` | `lint`, `typecheck`, `test:run`, `test:e2e` all present |
| 0 lint errors | `npx eslint .` | **0 errors**, 49 warnings |
| 35 `no-explicit-any` | `eslint -f json` | **exactly 35** — unchanged |
| `Landing3D.tsx` error-free | `npx eslint <file>` | **0 errors** — the `loader-moderno-dojo` handoff still holds |
| typecheck clean | `npx tsc --noEmit` | exit 0 |
| tests pass | `npx vitest run` | 203 passed in 18 files; `xp.test.ts` 18/18 |
| `calculateXP` deleted | `git grep` | 0 occurrences in `src/` |
| `RANKS` boundaries | `src/lib/constants.ts` | Blanco 0, Amarillo 150, Naranja 400, Gran Maestro 11000 — every spec number matches |

The `xp-progression` spec's concrete scenarios were also verified **by execution**,
not by reading: a throwaway suite asserted `getRank(-1)`, `getRank(50000)`,
`getNextRank(11000)`, `getXPProgress(0)`, `getXPProgress(150)` and
`getXPProgress(50000)` against the live module. 6/6 passed, then it was deleted.
One scenario in the promoted spec — negative XP resolving to the first rank — is
NEW, not in the delta. It is there because `getRank` initialises
`currentRank = RANKS[0]` before its scan, so the behaviour is real and worth
stating; it was verified before being written down, not after.

## The record was wrong, in four places

This is the substantive part of the archive. `state.yaml` said the change was not
finished. Measured, it was.

1. **A YAML indentation defect had detached half the phases.**
   `followup_decisions:` sat at column 0, which closes the `phases:` mapping — so
   `tasks`, `apply`, `verify` and `archive` all silently became children of
   `followup_decisions`. Any tool reading `phases.archive` got nothing. That is
   why `phases.verify.status: pending` and a top-level `verify: status: done`
   could coexist for three weeks without anyone tripping over the contradiction.
   Fixed by moving the `followup_decisions` scalars below the phases they had
   swallowed; `phases` now parses with all eight. The duplicate top-level block
   was renamed `verify_detail`.

2. **"The CI workflow has NEVER actually executed."** False. `ci.yml` has 72
   recorded runs. The *oldest* is run 30919993306 — a `pull_request` run on
   branch `feat/automated-gates-slice-2` — followed by run 30921450451 on the
   merge of PR #2, both `success`. That is exactly what task 2.7.5 asked someone
   to go and do.

3. **"No push, no PR opened."** Both PRs merged within 31 seconds of each other
   on 2026-08-04. Only 1 of the 7 recorded commit SHAs is reachable from
   `origin/main`; the other 6 were rewritten, which the file's own
   `history_rewritten` note documents. The content landed — the SHAs went stale.

4. **"RUNTIME LEDGER STILL BLOCKED."** Resolved the same day. `apply_slice_2`
   records the user authorising the reset after slice 1 QA passed, a new attempt
   acquiring with state `proceed`, and slice 2 completing.

A fifth stale reason turned out to be a trap, and it is worth stating because it
nearly produced a false claim in this very archive. Task 1.4.5 said its QA was
"NOT PERFORMED — apply had no browser". That reason is false: apply had a browser
and ran the QA. But the task asks for a nine-step script, and the QA record
covers four of its nine steps — step 3 in full, steps 1, 7 and 8 in part — and
leaves the other five with none. A false REASON does not make a task done. 1.4.5
was briefly marked done here on the strength of the reason being false, then
reverted before this archive landed — a claim that would have passed for the
wrong reason. It stays open, with all nine steps accounted for in `tasks.md`.

That revert then produced a second, subtler version of the same mistake, and it
is recorded because it is the more instructive one. The first draft of the
coverage note counted a case the script never asked for — grid level 11 with a
non-empty `initialCSS` — as the fourth covered step, and silently dropped step 1.
The total still read "four of nine". A correct number reached through the wrong
composition is not a correct claim, and it survived one round of my own reading
before the review caught it.

All four corrections above are preserved rather than deleted: the original lists are renamed
`not_done_as_of_apply` — they were true when written — and a new
`archive_corrections` block records what is true now, with the command and run
IDs behind each measurement.

## What is genuinely still open

Seven of 51 tasks, all manual QA, all carried as follow-ups:

- **Never exercised** — CodeBlock syntax highlighting (1.2.3), mobile drawer
  close-on-navigation (1.3.6), leaderboard offline empty state (1.3.8).
- **Partial** — the password-reset flow (1.3.7): the unbounded-retry defect was
  verified with a positive control, but the save-and-log-in-again tail was not.
  Landing and exercise pages (1.3.9): the landing render-mode half passed, the
  exercise-page half and the reduced-motion branch did not. The GameEngine
  nine-step script (1.4.5): four steps have evidence, five do not — see below.
- **Open by construction** — 1.5.5, which just aggregates the above.

These are recorded against the `Manual Behavior Preservation for Hooks Refactors`
requirement in the promoted spec, so the next change touching those components
inherits them, instead of the gap disappearing with this folder.

Two smaller findings from `apply_slice_2` were also never acted on and are worth
one line each: `ci.yml` pins `actions/checkout@v5` and `actions/setup-node@v5`,
both two majors behind, and pins `node-version: 22` while local development runs
v24 with no `engines` field in `package.json`. A gate validating a different Node
major than the developer uses is not a faithful gate. Neither is urgent against
72 green runs.

### Why this archived instead of staying open

Three of those tasks describe themselves as hard gates that block slice 1 from
merging. Slice 1 merged three weeks ago and has been in production since, under
72 green CI runs and 203 passing tests. Holding the SDD cycle open for QA of four
UI surfaces that nobody was going to run would not protect anything — it would
just keep a change whose code shipped looking unfinished, and keep a broken
`state.yaml` in the tree. Naming the gap inside the requirement that will outlive
this folder does more than leaving the folder open.

## Folder not relocated

`openspec/changes/automated-gates/` stays where it is, same as the
`css-track-expansion` closure. The bounded-review diff engine does not detect
renames, so moving the folder converts a small docs candidate into an enormous
one — six moved files produced 4689 changed lines and a 282 KB reviewer prompt
last time, which could not be relayed faithfully.

## Not touched

`js-behavior-validator` and `loader-moderno-dojo` are both in flight with
`next_recommended: apply`. Neither was read for state and neither was modified.
`loader-moderno-dojo` depends on this change's `Landing3D.tsx` handoff, which was
re-measured above and still holds.
