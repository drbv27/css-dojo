# Exploration: automated-gates

Phase: `sdd-explore` · Artifact store: hybrid (Engram mirror: `sdd/automated-gates/explore`)

Dev Dojo has no working lint gate and no test suite. This document maps what a minimal, honest verification layer requires, classifies the 15 scenarios in `loader-moderno-dojo`'s spec against it, and surfaces a sequencing question the proposal phase must resolve.

> **Orchestrator corrections.** The `sdd-explore` agent ran without Bash or Write tools, so it could execute nothing and write nothing. Three of its claims were checked by execution afterwards, and **two were wrong**. Corrections are marked inline and summarized here:
> 1. `eslint-config-next` **IS installed.** The agent reported it "declared but NOT installed"; `node_modules/eslint-config-next` exists, as does `node_modules/eslint`. There is NO `npm install` prerequisite.
> 2. `npm run build` **WORKS** — verified, exit 0, no env vars required. The agent could only infer this.
> 3. `npx tsc --noEmit` **WORKS and currently passes clean** — verified, exit 0.

## Current state — all rows verified by execution or direct file read

| Gate | Status | Evidence |
| --- | --- | --- |
| `npm run build` | **WORKS** | Executed: exit 0, full route manifest printed, no `MONGODB_URI` needed. This is the project's one currently-working gate. |
| `npx tsc --noEmit` | **WORKS, passes clean** | Executed: exit 0. `tsconfig.json` already has `strict: true` and `noEmit: true`. Only a `package.json` script is missing. |
| `npm run lint` | **BROKEN** | Executed: `next lint` → `Invalid project directory provided, no such directory: <repo>/lint`. The `lint` subcommand was removed in Next.js 16; installed Next is 16.2.1. |
| ESLint config | **Missing** | No `eslint.config.*` and no `.eslintrc*` anywhere in the repo. |
| `eslint-config-next` | **INSTALLED** (agent claim corrected) | `node_modules/eslint-config-next` present. Its `package.json` `exports` confirms flat-config subpaths `./core-web-vitals`, `./typescript`, and `./parser`. |
| `eslint` | **INSTALLED** | `node_modules/eslint` present (`^9.39.4`). |
| Test runner | **None** | No vitest/jest/playwright/testing-library anywhere in `package-lock.json`. Fully greenfield. |

**The practical upshot:** the project is closer to having gates than it looked. A typecheck gate is one line in `package.json` away and passes today. The lint gate needs one new config file plus a one-line script change — no installs.

## 1. Repairing lint

Sourced from official Next.js documentation (fetched live; doc version `16.2.12`, matching installed `next@16.2.1`):

- `next lint` and the `eslint` key in `next.config` were removed in v16.0.0. `next build` no longer lints.
- `@next/eslint-plugin-next` now defaults to flat config. `eslint-config-next` ships flat-config subpath exports — **confirmed present in the installed package**.
- An official codemod exists: `npx @next/codemod@canary next-lint-to-eslint-cli .`
- The documented manual config:

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
```

- Script change: `"lint": "eslint ."` replacing `"next lint"`.

### The lint backlog — MEASURED, not estimated

The orchestrator wrote the flat config above to the repo root temporarily, ran `npx eslint . -f json`, captured the output, and deleted the config. The repo was left unchanged. Results:

| Metric | Value |
| --- | --- |
| Files linted | 243 |
| Files with problems | 41 |
| **Errors** | **46** |
| Warnings | 21 |
| Auto-fixable | 3 |

By rule:

| Count | Severity | Rule |
| --- | --- | --- |
| 35 | error | `@typescript-eslint/no-explicit-any` |
| 11 | warn | `@typescript-eslint/no-unused-vars` |
| 8 | error | `react-hooks/set-state-in-effect` |
| 4 | warn | `react-hooks/exhaustive-deps` |
| 4 | warn | `@next/next/no-img-element` |
| 2 | error | `react-hooks/preserve-manual-memoization` |
| 2 | warn | unused `eslint-disable` directive (`src/lib/db.ts`, `src/lib/mongodb-client.ts`) |
| 1 | error | `prefer-const` |

**This backlog is manageable.** 67 problems across 41 of 243 files, and 35 of the 46 errors are a single rule. The sizing uncertainty that dominated this exploration is now resolved: the gate itself is small; the question is purely how much of the backlog the change adopts.

Note that `@typescript-eslint/no-explicit-any` at 35 occurrences is the whole story of the error count. Fixing those properly means giving 35 real types to code that currently opts out — genuine work, easily larger than the gate itself, and unrelated to establishing gates.

`react-hooks/set-state-in-effect` (8 errors) is the one group that is not stylistic. It flags cascading-render risk. Locations: `(app)/leaderboard/page.tsx:102`, `(auth)/nueva-contrasena/page.tsx:29`, `components/games/GameEngine.tsx:56,93,107`, `components/landing/Landing3D.tsx:32`, `components/layout/MobileMenu.tsx:76`, `components/layout/MobileNav.tsx:73`.

### Collision with `loader-moderno-dojo` — concrete and worth deciding deliberately

`src/components/landing/Landing3D.tsx` is one of the three files `loader-moderno-dojo` modifies, and it **already carries a lint error**:

- `Landing3D.tsx:32` — `react-hooks/set-state-in-effect` (error). This is the `setModo` call inside the `debeUsar3D()` effect, i.e. the `"cargando"` → `"3d"`/`"estatica"` state machine at lines 27-35.

Also in the landing directory, though not modified by the loader change:

- `Personaje.tsx:49` — `react-hooks/preserve-manual-memoization` (error)
- `Personaje.tsx:57` — `react-hooks/exhaustive-deps` (warn), missing dependency `color`

The rest of `src/components/landing/` is lint-clean, including `Loader.tsx` itself.

This matters for sequencing. Once the gate is live, `loader-moderno-dojo` touches a file with a pre-existing error — and its design *adds* state to that exact component (`escenaFallo` plus the error boundary). Either this change fixes `Landing3D.tsx:32` first, or the loader change inherits it. The proposal must choose; do not let it be discovered during apply.

## 2. Test runner — Vitest

Sourced from the official Next.js Vitest guide (fetched live, `nextjs.org/docs/app/guides/testing/vitest`, doc version `16.2.12`):

- Dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`.
- `vitest.config.mts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: { environment: 'jsdom' },
})
```

- Scripts: `"test": "vitest"` for watch, `"test:run": "vitest run"` for CI.
- **Officially documented limitation, quoted:** *"Since async Server Components are new to the React ecosystem, Vitest currently does not support them. While you can still run unit tests for synchronous Server and Client Components, we recommend using E2E tests for async components."* This does not block the loader work — `Loader.tsx` is `'use client'` and synchronous.
- `@testing-library/react` v16.3.2 is current; React 19 support landed in v16.1.0. Pin the v16 line, not v13-15.

Jest was considered and is the weaker fit: its transform pipeline for Next 16 plus ESM is materially more configuration than Vitest's native Vite/ESM support, and the official Next.js docs favor Vitest for App Router projects. That is a documented preference, not a hard requirement.

## 3. Why the loader is unusually testable

Confirmed at `node_modules/@react-three/drei/core/Progress.d.ts:10`: `useProgress` is `UseBoundStore<StoreApi<Data>>` with `Data = { errors: string[], active: boolean, progress: number, item: string, loaded: number, total: number }`.

`Loader.tsx` imports only `useProgress` — it never touches `Canvas` or WebGL. So its entire timer, ARIA, and error-state logic is drivable in jsdom via `useProgress.setState({...})`. Critically, `errors` lives in the same store, so **the error-state UI is unit-testable too** — provided the test injects the error signal rather than trying to prove a real 404 generates one.

`Landing3D.tsx`'s `debeUsar3D()` gates the `"3d"` branch on a real `canvas.getContext('webgl'|'webgl2')`, which returns `null` in jsdom. Testing at the `Landing3D` level therefore needs `HTMLCanvasElement.prototype.getContext` stubbed and the `./Escena` module mocked. Both are standard jsdom techniques, and only two scenarios need them.

## 4. Scenario classification — independently derived

Against `openspec/changes/loader-moderno-dojo/specs/landing-loader/spec.md`: 8 requirements, 15 scenarios.

| # | Scenario | Classification | Notes |
| --- | --- | --- | --- |
| 1.1 | Ring tracks real asset progress | jsdom unit | Drive the store directly |
| 1.2 | No new tokens introduced | jsdom unit (static scan) | Class-list or source check; automatable, not behavioral |
| 2.1 | Milestones, not every percent | jsdom unit | Incremental `setState`, assert live region updates only at 0/25/50/75/100 |
| 2.2 | Ring carries no accessible name | jsdom unit | Query for `aria-hidden`, absence of accessible name |
| 3.1 | Hint appears after 8s stall | jsdom unit | `vi.useFakeTimers()`, advance 8000ms |
| 3.2 | Hint clears on resume | jsdom unit | Same harness |
| 4.1 | 20s stall triggers escape | jsdom unit | Advance 20000ms |
| 4.2 | 404 asset triggers escape early | **E2E only** | Needs a real 404 and a real WebGL `Canvas` mount to prove drei's real error propagation. jsdom cannot mount `Canvas`. A unit test can prove the Loader *reacts* to an injected error, not that a renamed file *produces* one. |
| 4.3 | Escape reaches the static landing | jsdom unit + mocks | Needs `getContext` stub and `./Escena` mock |
| 5.1 | Completion holds then dissolves | jsdom unit, with caveat | Unmount is DOM-provable; framer-motion timing in jsdom is a known friction point — confirm empirically during apply |
| 6.1 | Reduced motion at mount | jsdom unit | Mock `matchMedia` |
| 6.2 | Reduced motion flips mid-load | jsdom unit | Mock a `MediaQueryList` with a dispatchable `change` listener |
| 7.1 | Dead field is gone | jsdom unit (static scan) | Source scan for zero occurrences |
| 8.1 | Out-of-scope files untouched | **Not a runtime test** | Inherently a `git diff` check. Belongs in CI or PR review, not the suite. |
| 8.2 | `/landing-preview` inherits | jsdom unit + mocks | Same two mocks as 4.3 |

**Tally: 13 jsdom-testable** (10 plain, 2 needing mocks, 1 with a timing caveat), **1 E2E-only**, **1 not a runtime test at all**. This refines the orchestrator's preliminary estimate of ~10 upward. Pixel-level visual correctness remains outside any of these tiers and stays manual regardless.

## 5. E2E tier — cost versus what it buys

Playwright is not installed. Real costs: browser binaries (~300MB+), added CI runtime, a second runner and fixture model to maintain. Real benefit for this spec: formally covers exactly **one** of 15 scenarios (4.2), plus a future home for visual regression that no current scenario requires.

`@react-three/test-renderer` is a middle ground — it mocks the WebGL context to test the R3F scene graph without a browser — but it is explicitly experimental and still would not prove a real network 404 propagates correctly.

Tradeoff, not a recommendation: adding a second runner now buys ~7% of the spec's formal scenarios. Deferring means scenario 4.2 stays on the manual QA checklist until more consumers justify the infrastructure.

## 6. Cheap first coverage in existing code

| Candidate | Path | Assessment |
| --- | --- | --- |
| `getRank`, `getNextRank`, `getXPProgress`, `calculateXP` | `src/lib/xp.ts` | Best first target. Pure functions, zero I/O, zero React. Real edge cases: `xp = 0`, exact rank boundary, above max rank (no "next"), score clamping in `calculateXP`. |
| `RANKS`, `XP_REWARDS` | `src/lib/constants.ts` | Static data behind the above. Exercise indirectly through `xp.ts`, not its own suite. |
| Exercise validation (`exact`/`regex`/`includes`/`includes-ordered`/`visual`) | `src/components/exercises/ExerciseRenderer.tsx:33-98` | Pure grading logic — **but it is an inline `useCallback` closure, not an exported function.** Testing it in isolation requires extracting it first (e.g. to `src/lib/validateExercise.ts`). Not a free win: either extract-then-test, or test-through-render by mounting `ExerciseRenderer` and asserting `onComplete`. The proposal must pick one. |

MongoDB models and API routes are explicitly out of scope for this change.

## 7. Open sequencing question — proposal must decide

If this change writes the 13 jsdom-testable loader tests now, they FAIL on merge because `Loader.tsx` has not been rewritten. Merging a red suite is bad practice. Options, no winner picked:

- **(a) Infra plus smoke tests only.** Ships lint, typecheck, Vitest infra, and tests for existing pure logic (`xp.ts`). `loader-moderno-dojo`'s own apply writes its tests RED-first against the already-written spec. Lowest drift risk; defers proof that the harness handles the loader's trickier mocks.
- **(b) Ship the 13 loader tests marked `.skip`/`.todo`.** The loader change unskips them one at a time. Proves the mocks work today; risks drift if the component shape shifts, and adds real bulk — realistically 200-350 lines on top of infra, which pushes this change toward or past the 400-line budget.
- **(c) Infra plus one reference test as a template.** One scenario written against a deliberately small stub, proving the hardest mocking approach (Canvas stub, fake timers, `matchMedia`) without committing to all 13 or touching production code. Middle ground: more proof than (a), less drift than (b).

## 8. Approach comparison

| Option | Scope | Est. lines | Risk | What it buys |
| --- | --- | --- | --- | --- |
| Typecheck script only | `package.json` one line | ~1-3 | Very low | A working gate immediately; `tsc --noEmit` already passes clean |
| Lint plus typecheck | Above plus `eslint.config.mjs`, script change | ~25-35 | Low, but see the lint-backlog unknown | Revives the dead gate. No installs needed. |
| Plus Vitest infra and `xp.ts` tests | Above plus `vitest.config.mts`, setup file, deps, `xp.test.ts` | ~150-220 | Low-medium | A real, proven harness on code fully decoupled from the loader rewrite |
| Plus extracted validation tests | Above plus extracting `ExerciseRenderer`'s validator plus tests | +60-100 | Medium — touches a live component | A second, branchier proof point |
| Plus Playwright E2E now | Above plus Playwright config and one spec | +80-150 lines, heavy CI and binary cost | Medium-high | Covers scenario 4.2 and future visual regression; no other current consumer |

## 9. Size and seam

Lint plus typecheck plus Vitest infra plus `xp.ts` tests lands around **150-220 lines**, comfortably under the 400-line budget — assuming the lint backlog turns out small.

Natural seam: keep `automated-gates` at infra plus first-party smoke tests. Whichever of (a)/(b)/(c) is chosen for the loader tests belongs either inside `loader-moderno-dojo`'s apply (for (a) or (c)) or as a deliberately separated second slice (for (b)).

## Risks and unknowns

- ~~Lint backlog size is unknown~~ **RESOLVED — measured.** 46 errors, 21 warnings, 41 of 243 files. See "The lint backlog" above. 35 of the 46 errors are `@typescript-eslint/no-explicit-any`.
- **`Landing3D.tsx:32` collision.** The file `loader-moderno-dojo` modifies already fails `react-hooks/set-state-in-effect`, and that change adds more state to the same component. Must be assigned to one change or the other before apply.
- framer-motion `AnimatePresence` timing in jsdom (scenario 5.1) is a known community friction point. Flagged for empirical confirmation during apply, not a blocker.
- Extracting `ExerciseRenderer`'s validation logic touches a live, working component — a deliberate refactor decision, not a drive-by.
- The `sdd-explore` agent had no Bash or Write tool, so nothing it reported was execution-verified. Three claims were re-checked afterwards and two were wrong. Treat any remaining unverified claim in the Engram mirror with corresponding skepticism.
