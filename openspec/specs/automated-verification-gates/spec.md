# Spec: automated-verification-gates

Capability: `automated-verification-gates`

Governs the scriptable, exit-code-based verification commands that protect Dev
Dojo -- lint, typecheck, unit test, E2E test -- plus the CI enforcement that runs
them. This capability is project-wide infrastructure and is **track-agnostic**:
it does not belong to css/html/js/react specifically, though it protects all
four.

Established by change `automated-gates`, archived 2026-08-24, which repaired the
ESLint gate after `next lint` was removed in Next.js 16.2.1, cleared the repo's
error backlog, and added the Vitest, Playwright, and GitHub Actions tiers. That
change shipped in two stacked slices, merged as PR #1 and PR #2 on 2026-08-04.

Where a requirement below cites a one-time count from that change, the count is
labelled as history and the enduring constraint is stated separately. The
constraints themselves are not historical: they bind every future change.

## Requirements

### Requirement: Verification Gate Commands

The system MUST expose four `npm run` commands -- `lint`, `typecheck`,
`test:run`, `test:e2e` -- each of which MUST exit `0` when its check passes and
MUST exit non-zero when it detects a blocking problem.

#### Scenario: Lint gate blocks on errors only

- GIVEN `eslint.config.mjs` (flat config, `eslint-config-next/core-web-vitals` + `/typescript`)
- WHEN `npm run lint` runs
- THEN it exits `0` if zero ESLint errors exist, regardless of warning count
- AND it exits non-zero if any ESLint error exists

#### Scenario: Typecheck gate runs standalone

- GIVEN `tsconfig.json` has `strict: true`
- WHEN `npm run typecheck` runs (`tsc --noEmit`)
- THEN it exits `0` on zero type errors, independent of `next build`

#### Scenario: Unit test gate runs jsdom suites

- GIVEN Vitest + jsdom + `@testing-library/react` are configured
- WHEN `npm run test:run` runs
- THEN it exits `0` when every test passes and non-zero when any test fails

#### Scenario: E2E gate runs a real browser

- GIVEN Playwright is configured with at least one spec
- WHEN `npm run test:e2e` runs
- THEN it exits `0` when the green landing smoke test passes

### Requirement: `no-explicit-any` Is a Non-Blocking Warning

`@typescript-eslint/no-explicit-any` MUST be configured at `warn` severity, not
`error`, so its pre-existing occurrences do not block the lint gate. It is the
only rule `eslint.config.mjs` downgrades; nothing else in the config relaxes a
rule, and no `eslint-disable` comment substitutes for a real fix.

#### Scenario: Any-typed code does not fail the gate

- GIVEN a file containing `any` usage
- WHEN `npm run lint` runs
- THEN the occurrence is reported as a warning
- AND the command's exit code is unaffected by it

History: 35 occurrences at the time of the change. Re-measured 2026-08-24, still
exactly 35. This count is a snapshot, not an invariant -- do not gate on it.

### Requirement: Repo-Wide Zero-Error Lint Baseline

`npm run lint` MUST report **0 errors** across the repository. A change that
introduces an ESLint error has not passed the gate, whether or not CI is
consulted. Warnings are permitted and are not ratcheted.

#### Scenario: The error backlog stays cleared

- GIVEN a working tree at any commit on `main`
- WHEN `npm run lint` runs
- THEN it reports 0 errors and exits `0`

History: the change measured a baseline of 46 errors and reached 0 by downgrading
35 `no-explicit-any` occurrences and fixing 11 real defects -- 8
`react-hooks/set-state-in-effect`, 2 `react-hooks/preserve-manual-memoization`,
and 1 `prefer-const`. Those 11 were genuinely fixed, not silenced: neither
react-hooks rule is relaxed in `eslint.config.mjs` and no `eslint-disable`
comment was added. Re-measured 2026-08-24: 0 errors, 49 warnings -- 35
`no-explicit-any`, 9 `no-unused-vars`, 4 `no-img-element`, 1 `exhaustive-deps`.

### Requirement: Lint-Clean Handoff for `Landing3D.tsx`

`src/components/landing/Landing3D.tsx` MUST report zero ESLint errors, satisfying
the blocking dependency `loader-moderno-dojo` declared on this file. That change
is still in flight, so this requirement is live, not historical.

#### Scenario: Loader handoff file is error-free

- GIVEN `Landing3D.tsx` no longer triggers `react-hooks/set-state-in-effect`
- WHEN `npx eslint src/components/landing/Landing3D.tsx` runs
- THEN it reports 0 errors (warnings elsewhere in `src/components/landing/` MAY remain)

### Requirement: CI Enforcement on Push and Pull Request

A GitHub Actions workflow MUST run `typecheck`, `lint`, `build`, and `test:run`
on every push and pull request, and MUST fail the workflow run if any of them
fails.

#### Scenario: A regression fails CI

- GIVEN a pull request introduces a lint error or a failing unit test
- WHEN the workflow runs
- THEN the workflow run reports failure and the failing step is identifiable

#### Scenario: A clean change passes CI

- GIVEN a pull request touches only passing code
- WHEN the workflow runs
- THEN every step succeeds and the workflow run reports success

Verified by execution, not by reading: `.github/workflows/ci.yml` has 72 recorded
runs. The oldest is run 30919993306, a `pull_request` run on branch
`feat/automated-gates-slice-2`, followed by run 30921450451 on the merge of PR #2
-- both `success`. The most recent at archive time, run 32678862160, executed
`npm ci`, `typecheck`, `lint`, `test:run`, `test:e2e`, and `build`, all green.
The workflow now runs five checks, one more than this requirement demands.

### Requirement: Manual Behavior Preservation for Hooks Refactors

A fix applied to satisfy `react-hooks/set-state-in-effect` or
`react-hooks/preserve-manual-memoization` MUST preserve pre-existing observable
runtime behavior. When the touched component has no automated coverage, the fix
MUST be exercised through its real user-visible flow before the change is
considered done. A green lint run is evidence about the rule, not about the
behavior.

#### Scenario: Leaderboard filter still refreshes rankings

- GIVEN a student switches the leaderboard's dojo filter (general/css/html/js/react)
- WHEN the filtered list loads
- THEN the ranking list updates to match the selected filter, same as before the fix

#### Scenario: CSS game level still solves and awards XP

- GIVEN a student types CSS matching a game level's solution
- WHEN validation detects the match
- THEN the level is marked solved, the success overlay appears after its delay, progress persists in `localStorage`, and XP posts to `/api/progress`

#### Scenario: Landing page still picks the correct render mode

- GIVEN a visitor loads the landing page on desktop, mobile, or with reduced motion enabled
- WHEN `Landing3D` mounts
- THEN it renders the 3D scene or the static fallback exactly as it did before the fix

#### Scenario: Mobile drawers still auto-close on navigation

- GIVEN a visitor opens the mobile menu or mobile nav drawer and taps a link
- WHEN the route changes
- THEN the drawer closes automatically, same as before the fix

#### Scenario: Exercise completion still records progress

- GIVEN a student completes an exercise on `/modulos/[slug]/ejercicio/[exerciseId]`
- WHEN the completion handler runs
- THEN progress posts to `/api/progress` and next/previous exercise navigation is unaffected

Coverage at archive time is partial and is recorded honestly rather than claimed.
Browser-automated QA in an isolated environment confirmed the CSS game scenario
(single POST per solve, no stale closure across three levels in one session,
idempotent re-entry, correct behavior on a level with non-empty `initialCSS`),
the landing render-mode scenario (3D canvas rendered, zero hydration-mismatch
warnings), and rank display driven by `getRank`. Not exercised: the leaderboard
filter and its offline empty state, the mobile drawer close-on-navigation paths,
exercise-page completion, and the reduced-motion branch of the landing scenario.
Those four remain open follow-ups against this requirement.

The CSS game scenario is confirmed on its progress-and-XP half only, and the
distinction matters because the same refactor touched both. The success overlay's
timing -- it must appear after its ~1.8s delay, not instantly -- was never
measured, and neither were the stepper updating ahead of the POST resolving, the
"Ver solucion" and "Siguiente nivel" controls, or the final-level bonus POST.
Those five are the uncovered steps of the change's own nine-step GameEngine
script and are open follow-ups against this requirement too. A rewritten timer
whose timing nobody measured is unproved behavior, however green the lint run.

### Requirement: Password-Reset Flow End-to-End Verification

Because `src/app/(auth)/nueva-contrasena/page.tsx` sits on the password-reset
flow, a change touching it MUST exercise the full reset flow end to end -- OTP
entry through auto-submit, error handling, and final password save.

#### Scenario: Full reset flow succeeds after the fix

- GIVEN a user requests a password reset and receives a 6-digit OTP
- WHEN all 6 digits are entered
- THEN verification auto-submits, a wrong code shows an inline error and clears the input, and a correct code unlocks the new-password form through to save

#### Scenario: A failed verification retries once per user action

- GIVEN verification of a complete 6-digit code fails
- WHEN the user waits without touching the input
- THEN exactly one request was made and no further request follows
- AND editing one digit produces exactly one more request

The retry scenario was verified with a positive control, which is why it is
stated as its own scenario rather than folded into the flow above. Treatment:
`window.fetch` stubbed to reject `/api/auth/verify-otp`, six digits typed as real
keystrokes -- exactly 1 request in 10 seconds, connection error shown, digits
retained; editing one digit produced exactly 1 more. Control: `main`'s version of
the file restored and the identical procedure repeated -- the page wedged, the
input stopped accepting the sixth digit, and a follow-up evaluation hung for 120s
and had to be killed. That is the unbounded loop, observed live. Root cause:
`verifying` sat in the effect's dependency array, so
`.finally(() => setVerifying(false))` re-triggered the effect while the code
stayed full. A first control attempt used synthetic dispatched events instead of
real keystrokes and wrongly showed 1 request; that flaw was caught and the
control redone with the same input method as the treatment. The full save-and-
log-in-again path of the first scenario was NOT exercised and remains open.

## Non-Goals

- Typing the 35 `no-explicit-any` occurrences.
- Extracting or testing `ExerciseRenderer`'s inline validation logic.
- MongoDB models, API routes, and `src/lib/auth.ts` / `ApprovalGate` (untouched).
- A `--max-warnings` ratchet. Warnings are reported, never gated.
