# Delta for Automated Verification Gates

## Purpose

Establishes scriptable, exit-code-based verification commands (lint, typecheck, unit test, E2E test) plus minimal CI enforcement for Dev Dojo. This capability is project-wide infrastructure and is **track-agnostic** — it does not belong to css/html/js/react specifically, though it protects all four.

## ADDED Requirements

### Requirement: Verification Gate Commands

The system MUST expose four `npm run` commands — `lint`, `typecheck`, `test:run`, `test:e2e` — each of which MUST exit `0` when its check passes and MUST exit non-zero when it detects a blocking problem.

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

`@typescript-eslint/no-explicit-any` MUST be configured at `warn` severity, not `error`, so its 35 pre-existing occurrences do not block the lint gate.

#### Scenario: Any-typed code does not fail the gate

- GIVEN a file containing `any` usage
- WHEN `npm run lint` runs
- THEN the occurrence is reported as a warning
- AND the command's exit code is unaffected by it

### Requirement: Repo-Wide Zero-Error Lint Baseline

After the 8 `react-hooks/set-state-in-effect`, 2 `react-hooks/preserve-manual-memoization`, and 1 `prefer-const` fixes, `npm run lint` MUST report **0 errors** across the repository.

#### Scenario: Full error backlog is cleared

- GIVEN the measured baseline of 46 lint errors
- WHEN all 11 targeted fixes are applied and `no-explicit-any` is downgraded
- THEN `npm run lint` reports 0 errors (46 − 35 downgraded − 11 fixed = 0)

### Requirement: Lint-Clean Handoff for `Landing3D.tsx`

`src/components/landing/Landing3D.tsx` MUST report zero ESLint errors before `loader-moderno-dojo` modifies it, satisfying that change's blocking dependency.

#### Scenario: Loader handoff file is error-free

- GIVEN `Landing3D.tsx:32` no longer triggers `react-hooks/set-state-in-effect`
- WHEN `npx eslint src/components/landing/Landing3D.tsx` runs
- THEN it reports 0 errors (warnings elsewhere in `src/components/landing/` MAY remain)

### Requirement: CI Enforcement on Push and Pull Request

A GitHub Actions workflow MUST run `typecheck`, `lint`, `build`, and `test:run` on every push and pull request, and MUST fail the workflow run if any of the four fails.

#### Scenario: A regression fails CI

- GIVEN a pull request introduces a lint error or a failing unit test
- WHEN the workflow runs
- THEN the workflow run reports failure and the failing step is identifiable

#### Scenario: A clean change passes CI

- GIVEN a pull request touches only passing code
- WHEN the workflow runs
- THEN all four steps succeed and the workflow run reports success

### Requirement: Manual Behavior Preservation for Hooks Refactors

Each of the 8 `react-hooks/set-state-in-effect` fixes and 2 `preserve-manual-memoization` fixes MUST preserve pre-existing observable runtime behavior. Because none of the 6 touched components has automated coverage, each fix MUST be manually exercised through its real user-visible flow before slice 1 is considered done.

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

### Requirement: Password-Reset Flow End-to-End Verification

Because `src/app/(auth)/nueva-contrasena/page.tsx:29` sits on the password-reset flow, the full reset flow MUST be manually exercised end to end — OTP entry through auto-submit, error handling, and final password save — before slice 1 merges.

#### Scenario: Full reset flow succeeds after the fix

- GIVEN a user requests a password reset and receives a 6-digit OTP
- WHEN all 6 digits are entered
- THEN verification auto-submits, a wrong code shows an inline error and clears the input, and a correct code unlocks the new-password form through to save

## Non-Goals

- Typing the 35 `no-explicit-any` occurrences.
- Extracting or testing `ExerciseRenderer`'s inline validation logic.
- The 13 `landing-loader` jsdom tests and the scenario 4.2 E2E spec (written RED-first in `loader-moderno-dojo`'s own apply).
- MongoDB models, API routes, and `src/lib/auth.ts` / `ApprovalGate` (untouched).
- A `--max-warnings` ratchet (recorded as a follow-up, not a gate).
