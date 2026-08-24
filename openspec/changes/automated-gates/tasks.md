# Tasks: Automated Verification Gates

Phase: `sdd-tasks` · Store: hybrid (Engram `sdd/automated-gates/tasks`) · Depends on `proposal.md`, `specs/*/spec.md`, `design.md`, `state.yaml`.

Delivery: **two stacked PRs to `main`** (chain strategy: Stacked PRs to Main, per `chained-pr`). Slice 1 must be mergeable and green on its own before slice 2 branches off it. Traceability tags: `Rn`/`Xn` = spec requirement, `Dn` = design decision.

## Chain Overview

```text
main
 └── PR 1/2 "gate on, errors cleared"        📍 (Phase 1)
      └── PR 2/2 "test tiers"                (Phase 2, retargets to main after PR 1 merges)
```

| Field | PR 1/2 | PR 2/2 |
|---|---|---|
| Base | `main` | `slice-1` branch, then retarget to `main` after merge |
| Depends on | None | PR 1/2 merged (shares `package.json` scripts block) |
| Ends with | `npm run lint` exits 0, `npm run typecheck` exits 0, `npm run build` exits 0 | `vitest run` and `npm run test:e2e` exit 0, CI workflow enforces all four on every push/PR |
| Follow-up | PR 2/2 | `loader-moderno-dojo` rebase (Phase 3) |

---

## Phase 1 — Slice 1: Gate On, Errors Cleared

Est. authored lines: **175-197** (design `D7`, supersedes proposal's 95-145 estimate; driver is `GameEngine.tsx`).

### 1.1 Foundation (sequential, before any fix — fixes must be verifiable against a working gate)

- [x] **1.1.1** Create `eslint.config.mjs` (flat config): `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + one un-scoped `{ rules: { '@typescript-eslint/no-explicit-any': 'warn' } }` override + `globalIgnores([...])` matching the measured file set exactly (add nothing new to it). — *Traces: R2, R3, D1*
- [x] **1.1.2** Update `package.json`: `lint` → `eslint .`, add `typecheck` → `tsc --noEmit`. — *Traces: R1, D2*
- [x] **1.1.3** Update `openspec/config.yaml` (slice-1 portion only): `testing.linter`, `testing.type_checker`, drop the "do NOT rely on `npm run lint`" guideline in `rules.apply.guidelines`. — *Traces: D7 table*
- [x] **1.1.4** Gate check: run `npx eslint .` and confirm the error count matches the measured baseline (46 errors, 21 warnings) before any fix lands — proves the config change alone introduced no new errors/warnings. **Result**: with the flat config + `no-explicit-any` override in place (both from the same commit), the run showed 11 errors / 56 warnings (46 − 35 downgraded = 11; 21 + 35 = 56) — exactly the expected arithmetic, confirming no new errors/warnings beyond the measured baseline.

### 1.2 Commit 1 — `chore(lint)`: trivial, zero-runtime-change cleanup (parallel-safe, independent files)

- [x] **1.2.1** `src/components/editor/CodeBlock.tsx:100` — delete the dead `let result = escapeHtml(code);` line (Group G). Do not convert to `const`. — *Traces: R3, D "Group G"*
- [x] **1.2.2** `src/lib/db.ts` and `src/lib/mongodb-client.ts` — remove the unused `eslint-disable` comment in each (comment-only, zero runtime effect).
- [ ] **1.2.3** Manual QA — Group G: open any module lesson under `/modulos` rendering CSS/HTML/JS code blocks; confirm syntax highlighting (selectors, properties, values, numbers-with-units, comments, tags/attributes) is unchanged. **NOT PERFORMED** — apply had no browser. See handoff in apply-progress / final report.
      - **At archive (2026-08-24): still open, carried as a follow-up.** Listed in `state.yaml` `phases.apply.qa.not_covered`. CodeBlock highlighting was never exercised.

### 1.3 Commit 2 — `fix(hooks)`: 5 low-risk components + 2 memoization fixes (independent files — safe to parallelize across sub-tasks 1.3.1-1.3.5)

- [x] **1.3.1** Group A — `src/components/layout/MobileMenu.tsx:76` and `src/components/layout/MobileNav.tsx:73`: split each into an outer component keyed by `usePathname()` (`key={pathname}`) wrapping an inner component that owns `useState(false)` + the body-overflow effect; delete the route-change-close effect. — *Traces: R6 (drawers scenario), D "Group A"*
- [x] **1.3.2** `src/components/layout/MobileNav.tsx:69` — fix `const rank = getRank(0)` → `getRank(user?.xp ?? 0)`, matching `MobileMenu.tsx:72`'s existing correct pattern. `user` is already in scope; consumed at line 179. — *Traces: X1, `mobilenav_getrank` decision in state.yaml*
- [x] **1.3.3** Group D (security-adjacent) — `src/app/(auth)/nueva-contrasena/page.tsx:29`: delete the auto-submit effect; add `verificarOtp(code: string)` called from `handleOtpChange` (6-char completion) and `handleOtpPaste` (6-digit paste), preserving the identical fetch/success/failure branches and `finally { setVerifying(false) }`. Behavior change (approved): a network failure no longer auto-retries — user must edit a digit to retry. — *Traces: R6, R7, D "Group D"*
- [x] **1.3.4** Group E — `src/app/(app)/leaderboard/page.tsx:102`: replace `entries` + `loading` with one `datos: { filtro, entries } | null`; derive `loading` from `datos?.filtro !== activeFilter`; add a `cancelado` cleanup flag in the fetch effect. — *Traces: R6 (leaderboard scenario), D "Group E"*
- [x] **1.3.5** Group F — fix both `preserve-manual-memoization` errors:
  - `src/app/(app)/modulos/[slug]/ejercicio/[exerciseId]/page.tsx:49`: hoist `tipo`/`dificultad` primitives above the `useCallback`, add both to its dep array.
  - `src/components/landing/Personaje.tsx:49`: seed `emissive` from a module constant `COLOR_INICIAL = SECCIONES[0]?.color ?? "#94E2D5"` instead of closing over reactive `color`; keep `[]` deps genuinely correct.
  - *Traces: R3 (0-errors baseline), D "Group F"*
- [ ] **1.3.6** Manual QA — Group A: on a ≤1024px viewport, verify drawer closes on nav-item tap, browser back/forward, and backdrop tap for both `MobileMenu` and `MobileNav`; confirm `document.body.style.overflow` clears; confirm the "Profesor" section still lists all three teacher links (teacher role). **NOT PERFORMED** — apply had no browser. See handoff.
      - **At archive (2026-08-24): still open, carried as a follow-up.** The mobile drawer close-on-navigation paths were never exercised.
- [ ] **1.3.7** Manual QA — Group D: **full password-reset flow end to end** (mandatory before slice 1 merges) — `/recuperar` → OTP page renders with box 1 focused → wrong code shows inline error and clears input → **Offline**: type 6 digits → exactly one failed request, "Error de conexion", watch 10s for **no request storm** → back online, edit a digit → one new request → correct code → new-password form → mismatched/short passwords rejected without a request → valid save → redirect to `/login` → log in with new password (succeeds) and old password (rejected). *(Requires `MONGODB_URI` + either `RESEND_API_KEY` or a temporary `console.log(otp)` after `forgot-password/route.ts:24`, reverted via `git checkout` before commit — never commit OTP logging.)* — *Traces: R7* **NOT PERFORMED — HARD GATE, blocking merge.** See handoff.
      - **At archive (2026-08-24): PARTIAL, carried as a follow-up.** The defect this task existed to catch WAS verified, with a positive control: `window.fetch` stubbed to reject `/api/auth/verify-otp`, six digits typed as real keystrokes gave exactly 1 request in 10 seconds and editing one digit gave exactly 1 more. Restoring `main`'s version and repeating the IDENTICAL procedure WEDGED the page — the unbounded loop observed live. NOT exercised: the save-and-log-in-again tail (valid save, redirect to `/login`, new password accepted and old rejected).
- [ ] **1.3.8** Manual QA — Group E: `/leaderboard` — skeleton on initial load and every filter switch, correct rows per filter, ranks modal shows all ten belts, **Offline** switch → empty state (no stale rows, no infinite skeleton), rapid successive filter clicks → rows settle on the **last** clicked filter. **NOT PERFORMED** — apply had no browser. See handoff.
      - **At archive (2026-08-24): still open, carried as a follow-up.** The leaderboard offline empty state is named explicitly in `not_covered`.
- [ ] **1.3.9** Manual QA — Group F: landing `/` on desktop WebGL — ninja renders with the same teal emissive glow, re-tints per section while scrolling, idle/per-section animation clips still play. Exercise page — complete one exercise (XP toast, sidebar XP updates, achievement toast if unlocked), then "Siguiente ejercicio" and complete a second exercise **without reloading** — confirm the POST body reflects the new exercise's `type`/`difficulty` (Network tab). **NOT PERFORMED** — apply had no browser. See handoff.
      - **At archive (2026-08-24): PARTIAL, carried as a follow-up.** The landing render-mode half PASSED — `/landing-preview` rendered the 3D canvas at 1225x1260 with zero hydration-mismatch warnings and zero React errors. NOT exercised: the exercise-page half (two exercises completed in one session without reloading, POST body reflecting the second exercise's type/difficulty) and the reduced-motion branch, which the tool set could not emulate.
- [x] **1.3.10** **PR body task**: document the `nueva-contrasena` retry-loop behavior change explicitly in the PR description. — *Traces: R7* **DONE.** PR #1 (`chore(lint): repair the ESLint gate and fix 11 blocking errors`, merged 2026-08-04T14:54:50Z) carries it in a 6814-byte body covering the unbounded loop, the one-attempt-per-user-action behaviour, and the digit-edit retry. Verified 2026-08-24 with `gh pr view 1`.

### 1.4 Commit 3 — `refactor(games)`: `GameEngine.tsx` alone, isolated and separately revertable (highest risk — sequential, do not parallelize with 1.3)

- [x] **1.4.1** Group B (`:56`) — replace the `localStorage` mount effect with lazy `useState` initializers (`completedLevels`, `currentLevel`, `css`) plus a `useSyncExternalStore`-based `hidratado` hydration gate (`if (!hidratado) return null;` replaces `if (!initialized) return null`); delete the `initialized` state. — *Traces: R6 (CSS game scenario), D "Group B"*
- [x] **1.4.2** Group C (`:93`) — derive `solved` via `useMemo(() => !!level && validateCSS(css, level), [css, level, validateCSS])`; delete the `solved` state and its `setSolved` calls in `goToLevel`/`resetLevel`; keep the 1800ms success-overlay timer as an effect that only arms/clears a `setTimeout`, and clear it on unmount (fixes today's leaked-timer-on-level-change bug).
- [x] **1.4.3** Group C (`:107`) — replace the inline `onChange` + persistence effect with a `manejarCss(texto)` handler: calls `setCss(texto)`, and when `!solved && validateCSS(texto, level)` calls one `registrarNivelCompletado(level)` that writes `completedLevels`, `localStorage`, and both `/api/progress` POSTs; delete effect 3 and `successSavedRef`; single-fire is guaranteed by the event path plus a `completedLevels.has(level.id)` guard. **Note**: implemented as a plain closure-scoped helper (reading `completedLevels` from the render closure), not a functional `setCompletedLevels` updater — a functional updater would run its fetch/localStorage side effects inside React's update pass, which Strict Mode intentionally double-invokes.
- [x] **1.4.4** **Confirmation task (documentation only — do NOT re-investigate)**: record in the commit message or PR body that the pre-solved-on-mount risk (a level whose `initialCSS` already satisfies its `validateFn`) was checked across all 50 levels in `flexbox-levels.ts`/`grid-levels.ts` and none starts pre-solved — using a whitespace-normalized substring-containment check, not a replication of `GameEngine`'s real validator (strong evidence, not formal proof). — *Traces: state.yaml `orchestrator_verified` — residual risk closed*. **Recorded in commit 3's message** (`refactor(games)`).
- [ ] **1.4.5** **Manual QA — GameEngine, the 9-step script (mandatory, both `/juegos/flexbox` and `/juegos/grid`)**: **NOT PERFORMED** — apply had no browser. Hard gate before merge; see handoff.
      - **At archive (2026-08-24): PARTIAL, carried as a follow-up.** The record's stated reason was wrong — apply DID have a browser, and browser-automated QA ran in an isolated environment (throwaway `mongo:7` on port 27019, `MONGODB_URI` process-env override verified to win, everything torn down), in dev mode so Strict Mode double-invokes effects. But "apply had no browser" being false does NOT make the nine-step script done, and marking it done would be a claim the QA record cannot support. Measured against `state.yaml` `phases.apply.qa.gameengine`, which holds `single_post`, `no_stale_closure`, `resume_after_reload`, `non_empty_initialcss`, `idempotence` and `final_db_state`:
        - **Covered, four of the nine** — step 1 in part (the run started on a fresh isolated profile and `single_post` records the progress bar moving TO 4% with `user xp 0 -> 10`, so it did load at level 1 with 0% progress; the step's "empty editor" clause is not stated anywhere in the record), step 3 (exactly one `POST /api/progress` per level, correct body), step 7 in part (reload resumes consistently with the stepper), step 8 in part (re-entering a solved level fires ZERO extra POSTs).
        - **NOT covered** — step 2, the success overlay at **~1.8s and not instantly**, which is precisely the 1800ms timer task 1.4.2 rewrote and which nothing in the record measures; step 4, progress bar and stepper updating immediately rather than after the POST resolves; step 5, "Ver solucion"; step 6, "Siguiente nivel" advancing and re-enabling input; step 9, the final-level bonus POST with `exerciseId: <slug>-bonus`.
        - **Extra, outside the script** — grid level 11 with non-empty `initialCSS` pre-filled and NOT pre-marked solved. The nine-step script never asked for this; it is evidence the QA added on its own, so it is listed here and NOT counted toward the nine.
        - So four of the nine steps have evidence and five do not: 4 + 5 = 9, every step accounted for. An earlier draft of this note counted the grid-level-11 case as the fourth covered step and silently dropped step 1 — the total came out right from the wrong composition, which is the same failure mode as marking this task done because its stated reason was false. The five uncovered steps are recorded against the `Manual Behavior Preservation for Hooks Refactors` requirement in `openspec/specs/automated-verification-gates/spec.md`.
  1. Fresh profile (`localStorage.clear()`): loads at level 1, empty editor, 0% progress.
  2. Typing the solution animates the board, disables input, shows the solution line, and shows the success overlay **~1.8s later** (not instantly).
  3. Network tab: exactly **one** `POST /api/progress` per level (`score: 100`, `difficulty: 1`); sidebar XP increases after `refreshUser`.
  4. Progress bar and stepper checkmark update **immediately** on completion, not after the POST resolves.
  5. "Ver solucion" hides the overlay, leaves the level solved.
  6. "Siguiente nivel" advances and re-enables input.
  7. Reload resumes at the first uncompleted level with that level's `initialCSS`; `localStorage[<slug>-completed]` matches the stepper.
  8. "Reiniciar" restores `initialCSS`, clears solved state, level can be re-solved without a duplicate POST.
  9. Complete the final level → bonus `POST /api/progress` (`exerciseId: <slug>-bonus`) fires exactly **once**; solving a level and navigating away mid-1.8s-window produces no console warning and no overlay on the next page.
  — *Traces: R6 (CSS game scenario)*

### 1.5 Slice 1 gate verification (run after all of 1.2-1.4 land, before opening the PR)

- [x] **1.5.1** `npx tsc --noEmit` exits `0`. — *Traces: R1 (typecheck scenario)* **Confirmed: exit 0, no output.**
- [x] **1.5.2** `npx eslint .` exits `0` with **0 errors** (warnings may be present, ~21 pre-existing + newly-downgraded `any` occurrences are expected and non-blocking). — *Traces: R1 (lint scenario), R3* **Confirmed: exit 0, 51 problems (0 errors, 51 warnings).**
- [x] **1.5.3** `npx eslint src/components/landing/Landing3D.tsx` reports `0` errors (loader-moderno-dojo handoff check — Landing3D fix ships in 1.4.1/Group B). — *Traces: R4* **Confirmed: 0 errors, 0 warnings.** (An earlier run reported 1 warning for an unused `setOmitirEscena`; the orchestrator then removed that speculative state, so the file is now fully clean.)
- [x] **1.5.4** `npm run build` exits `0`. **Confirmed: exit 0, full route manifest printed.**
- [ ] **1.5.5** All manual QA tasks in 1.2.3, 1.3.6-1.3.9, 1.4.5 completed and confirmed passing; 1.3.10's PR-body documentation is present in the draft PR description. **NOT DONE — this apply had no browser and no PR was opened.** See the manual-QA handoff in the apply-progress artifact / final report. **This is a hard gate: slice 1 must not merge until 1.5.5 is satisfied by a human.**
      - **At archive (2026-08-24): still open by construction.** 1.4.5 and 1.3.10 are now DONE; this task stays open because 1.2.3, 1.3.6, 1.3.8 and the tails of 1.3.7 and 1.3.9 were never exercised. Its "hard gate before merge" wording is historical: slice 1 merged as PR #1 on 2026-08-04 and has been in production since, with 72 green CI runs over it. The gap is recorded against the `Manual Behavior Preservation` requirement in `openspec/specs/automated-verification-gates/spec.md` rather than dropped.

### 1.6 Review Workload Forecast — Slice 1

| Field | Value |
|---|---|
| Estimated changed lines | 175-197 (design `D7`; driver: `GameEngine.tsx`, 3 of 11 fixes) |
| Chained PRs recommended | Yes (stacked-to-main, already cached as `chain_strategy`) |
| 400-line budget risk | Low |
| Decision needed before apply | No |

Note: `GameEngine.tsx`'s true size was the proposal's largest uncertainty (originally 60-110 lines against a 95-145 total estimate); design's revised 175-197 already absorbs it. If actual implementation still exceeds 197 lines, re-forecast before opening the PR — do not silently proceed past 400.

**Actual (measured via `git diff --stat` across the 3 commits): 199 insertions + 110 deletions = 309 changed lines**, above the 175-197 forecast but still comfortably under the 400-line budget (Low risk holds; no decision needed). Driver was `GameEngine.tsx` (72+49=121 lines) as predicted, plus larger-than-forecast diffs in `nueva-contrasena/page.tsx` (61 lines, the effect-to-handler rewrite) and `leaderboard/page.tsx` (25 lines, the `datos` state consolidation).

### 1.7 Apply Summary (this session)

Three commits landed on `feat/automated-gates-slice-1` (base `fa9e07d`):

| Commit | Subject | Lines (+/-) |
|---|---|---|
| `862ae42` | `chore(lint): repair the ESLint gate with a flat config` | +16/-5 |
| `40f300a` | `fix(hooks): stop writing setState synchronously inside effects` | +111/-56 |
| `0a330d0` | `refactor(games): derive GameEngine state instead of writing it from effects` | +72/-49 |

All of 1.5.1-1.5.4 (automated gates) pass. 1.5.5 (manual QA) is the sole remaining blocker before this slice can merge — see the manual-QA handoff in the apply-progress artifact.

---

## Phase 2 — Slice 2: Test Tiers

Branches off the slice-1 branch (shares `package.json`'s scripts block); retargets to `main` once PR 1/2 merges. Est. authored lines: **190-220** minus the dropped `calculateXP` test work (state.yaml `calculate_xp: delete`).

### 2.1 Test infrastructure (sequential — config before suites)

- [x] **2.1.1** Add devDependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react` (must resolve to v16.x for React 19), `@testing-library/dom`, `vite-tsconfig-paths`, `@playwright/test`. — *Traces: D "Interfaces/Contracts"* **Resolved: vitest 4.1.10, @vitejs/plugin-react 6.0.5, jsdom 30.0.1, @testing-library/react 16.3.2 (v16 line confirmed), @testing-library/dom 10.4.1, vite-tsconfig-paths 6.1.1, @playwright/test 1.62.1.**
- [x] **2.1.2** Create `vitest.config.mts`: `environment: 'jsdom'`, `plugins: [tsconfigPaths(), react()]`, **`include` narrowed to `src/**/*.test.{ts,tsx}`** so Vitest's default glob does not also collect `e2e/landing.spec.ts` and run Playwright specs under jsdom (verified real collision — D3). No setup file needed for this suite (four pure functions, no DOM matchers). — *Traces: R1 (unit test gate), D3*
- [x] **2.1.3** Update `package.json`: add `test` → `vitest`, `test:run` → `vitest run`. — *Traces: R1, D "Interfaces/Contracts"* **Also added `test:e2e` → `playwright test` here (2.5.2) to keep the scripts block as one edit.**
- [x] **2.1.4** Fallback check: attempt `npm install` for 2.1.1's deps; if resolution fails for any package (unverified in this environment per design's Open Questions), stop and record the exact failing package/version constraint before proceeding — do not silently downgrade or substitute. **All 7 packages resolved cleanly, no failures.**

### 2.2 `src/lib/xp.ts` unit suite (sequential after 2.1; depends on 2.3's deletion happening in the same PR)

- [x] **2.2.1** Create `src/lib/xp.test.ts` with 3 `describe` blocks (`getRank`, `getNextRank`, `getXPProgress`); boundary rows as `it.each`; expected values written as **literals** (never re-derived from `RANKS`). — *Traces: X1, X2, X3, D4*
- [x] **2.2.2** `getRank` cases: `0` → Cinturon Blanco, `149` → Blanco, `150` → Amarillo (exact boundary), `11000` → Gran Maestro, `999_999` → Gran Maestro, `-1` → Blanco (documents `RANKS[0]` seed, no throw). — *Traces: X1*
- [x] **2.2.3** `getNextRank` cases: `0` → Amarillo, `149` → Amarillo, `150` → Naranja, `10_999` → Gran Maestro, `11_000` → `null`, `50_000` → `null`. — *Traces: X2*
- [x] **2.2.4** `getXPProgress` cases: `0` → `{0,150,0}`, `75` → `{75,150,50}`, `149` → `{149,150,99}` (rounding down), `150` → `{0,250,0}` (boundary reset), `11_000` → `{0,0,100}`, `12_000` → `{1000,0,100}` (records, does not fix, that the top-rank branch returns `current > needed`). — *Traces: X3*
- [x] **2.2.5** **Do NOT** write tests for `calculateXP` — it is deleted in 2.3, not fixed. — *Traces: state.yaml `calculate_xp: delete`* **Confirmed no test written.**

### 2.3 Delete `calculateXP` (sequential — do this alongside 2.2, before 2.4)

- [x] **2.3.1** Delete `calculateXP` from `src/lib/xp.ts`. Verified zero callers anywhere in `src/` (the real XP path is `src/app/api/progress/route.ts` using `exercise?.xpReward ?? 10`, which never calls it). Do not fix the score=1 bug — it is latent and never fires. — *Traces: state.yaml `calculate_xp: delete`, orchestrator-verified fact* **Re-confirmed via `rg calculateXP src/`: only the declaration matched before deletion, zero call sites.**

### 2.4 MANDATORY spec-drift correction (sequential — depends on 2.3; must land in the same PR as the deletion, not deferred)

- [x] **2.4.1** Edit `openspec/changes/automated-gates/specs/xp-progression/spec.md`: replace the `### Requirement: XP Award Calculation and Clamping (calculateXP)` requirement block (and its 5 scenarios) with a `REMOVED Requirements` section per `openspec-convention.md`, e.g.:

  ```markdown
  ## REMOVED Requirements

  ### Requirement: XP Award Calculation and Clamping (`calculateXP`)
  (Reason: `calculateXP` has zero callers in `src/` — the live XP-award path is
  `src/app/api/progress/route.ts` using `exercise?.xpReward ?? 10`. Its
  `score > 1 ? score / 100 : score` boundary bug at `score = 1` is real but
  latent and never fires. Deleted in `automated-gates` slice 2 rather than
  fixed, to avoid testing/preserving dead, ambiguous logic.)
  (Migration: No consumers exist; no call sites require updating.)
  ```

  This task exists so `sdd-verify` does not fail on artifact inconsistency (a spec requirement describing deleted code). — *Traces: MANDATORY task per orchestrator instructions; state.yaml `spec_drift_to_resolve`*

### 2.5 Playwright infra + smoke test

- [x] **2.5.1** Create `playwright.config.ts`: `testDir: './e2e'`, `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]` (chromium only), `retries: process.env.CI ? 1 : 0`, `webServer: { command: process.env.CI ? 'npm start' : 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI }`. — *Traces: R1 (e2e gate scenario), D5* **Also added `use: { baseURL: "http://localhost:3000" }` — the design snippet omitted it, but relative `page.goto()` calls need it (discovered via a failing first run: "Cannot navigate to invalid URL").**
- [x] **2.5.2** Update `package.json`: add `test:e2e` → `playwright test`. — *Traces: D "Interfaces/Contracts"*
- [x] **2.5.3** Create `e2e/landing.spec.ts` — one smoke test asserting: `/` returns 200, no `pageerror` fires, `NavLanding`'s brand text and the `/login` link are visible (proves hydration ran and `Landing3D`'s mode resolved past `"cargando"`, deliberately WebGL-agnostic). This test does **not** cover `landing-loader` scenario 4.2 (its error state does not exist yet) — do not write a task or test claiming otherwise. — *Traces: R1, D5* **Deviation, per explicit orchestrator instruction: targets `/landing-preview` instead of `/`. Same `Landing3D`/`NavLanding` render path, `hasSession` hardcoded `false`, zero cookie/DB reads — a stricter match for "no write path, no DB dependency" than `/` itself.**
- [x] **2.5.4** **Unverified-dependency check**: attempted `npx playwright install --with-deps chromium` — **failed**: sandbox has no interactive `sudo` (`sudo: a terminal is required to read the password`), so the system-deps step cannot run. Fallback `npx playwright install chromium` (browser binary only, no system deps) **succeeded**. The test run then **passed** and rendered the real `"3d"` mode (not the WebGL-less `"estatica"` fallback), proving this sandbox's existing system libraries are sufficient without `--with-deps`. — *Traces: design Open Questions*
- [x] **2.5.5** Update `.gitignore`: add `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/` (`/coverage` already present).

### 2.6 GitHub Actions enforcement (sequential — depends on 2.1-2.5 producing working scripts)

- [x] **2.6.1** Create `.github/workflows/ci.yml`: one job, `ubuntu-latest`, `permissions: contents: read`, triggers `push: [main]` + `pull_request`, `concurrency`/`cancel-in-progress`. Steps in order: checkout → `setup-node@22` (npm cache) → `npm ci` → `npm run typecheck` → `npm run lint` → `npm run build` → `npm run test:run` → `npx playwright install --with-deps chromium` → `npm run test:e2e`. — *Traces: R5, D6*
- [x] **2.6.2** Update `openspec/config.yaml` (slice-2 portion): `testing.test_runner`, `testing.unit`, `testing.e2e`, `apply.test_command`, `verify.test_command` — reflect the new gate reality. — *Traces: D "Group D7 table"*

### 2.7 Slice 2 gate verification

- [x] **2.7.1** `npx vitest run` exits `0` with the full `xp.ts` suite passing. — *Traces: R1 (unit test gate scenario)* **Confirmed: exit 0, 18/18 tests passed.**
- [x] **2.7.2** `npx playwright test` exits `0` with the landing smoke test passing (contingent on 2.5.4 succeeding). — *Traces: R1 (e2e gate scenario)* **Confirmed: exit 0, 1/1 passed, rendered real "3d" mode.**
- [x] **2.7.3** `npx tsc --noEmit` still exits `0` — confirms `src/lib/xp.test.ts` and `e2e/landing.spec.ts` compile under `strict` (both match `tsconfig.json`'s `**/*.ts` include). — *Traces: D3* **Confirmed: exit 0, no output.**
- [x] **2.7.4** `npm run build` and `npx eslint .` (0 errors) still pass — confirms slice 2 introduced no regression to slice 1's gates. **Confirmed: build exit 0, full route manifest; lint exit 0, 50 problems (0 errors, 50 warnings) — unchanged from slice 1's baseline.**
- [x] **2.7.5** Open a PR against `main` (push CI trigger) and confirm the workflow run reports success on all four steps end to end (proves R5's "clean change passes CI" scenario, not just local runs). **DONE.** Measured 2026-08-24: `ci.yml` has 72 recorded runs. The oldest is run 30919993306, a `pull_request` run on `feat/automated-gates-slice-2` at 2026-08-04T14:38:26Z, followed by run 30921450451 on the merge of PR #2 — both `success`. The most recent run at archive time (32678862160) executed `npm ci`, `typecheck`, `lint`, `test:run`, `test:e2e` and `build`, all green — five checks, one more than this task demands.

### 2.8 Review Workload Forecast — Slice 2

| Field | Value |
|---|---|
| Estimated changed lines | 190-220 (design revised estimate, already minus the dropped `calculateXP` test work) |
| Chained PRs recommended | Yes (this PR retargets to `main` after PR 1/2 merges) |
| 400-line budget risk | Low |
| Decision needed before apply | No |

Note: this line count already includes the GitHub Actions workflow (~30 lines YAML, `enforcement_detail` in state.yaml). Aggregate across both slices is ~365-417 by the state.yaml's own `slice_size_note` — exactly why the split is load-bearing, not optional: each slice stays comfortably under 400 on its own, while the un-split total would risk breaching it.

### 2.9 Apply Summary (this session)

Four commits landed on `feat/automated-gates-slice-2` (stacked on `feat/automated-gates-slice-1`@`3bd4cec`):

| Commit | Subject | Authored lines (+/-, excl. `package-lock.json`) |
|---|---|---|
| `e794de7` | `test(vitest): add unit test infrastructure` | package.json/vitest.config.mts only |
| `f1897c5` | `test(xp): add unit suite for xp.ts and remove dead calculateXP` | +47/-8 |
| `9d8b04a` | `test(e2e): add Playwright config and landing smoke test` | +110/-1 |
| `193baad` | `ci: add GitHub Actions workflow for typecheck, lint, build, and tests` | +38 |

**Actual (measured via `git diff --stat`, excluding the generated `package-lock.json` per the work-unit-commits skill's "exclude generated goldens from the authored count" rule): 153 insertions + 10 deletions = 163 authored lines**, well under the 190-220 forecast and comfortably under the 400-line budget.

All of 2.7.1-2.7.4 pass: `npx tsc --noEmit` exit 0; `npm run lint` exit 0, 50 problems (0 errors, 50 warnings, unchanged from slice 1's baseline); `npm run build` exit 0; `npx vitest run` exit 0 with 18/18 tests passing; `npx playwright test` exit 0 with 1/1 passing in real `"3d"` mode. 2.7.5 (open a PR and observe the Actions run) is deferred — no PR was opened in this apply, per explicit instruction.

**Deviations from the design/tasks text, recorded honestly**:
- `playwright.config.ts` adds `use: { baseURL: "http://localhost:3000" }`, which the design's snippet omitted but which relative `page.goto()` calls require (discovered via a failing first run).
- `e2e/landing.spec.ts` targets `/landing-preview`, not `/`, per an explicit orchestrator instruction to avoid any DB/session-cookie dependency in the smoke test — `/landing-preview` renders the identical `Landing3D`/`NavLanding` path with `hasSession` hardcoded `false`.
- `npx playwright install --with-deps chromium` failed locally (no interactive `sudo` in this sandbox); the fallback `npx playwright install chromium` (browser binary only) succeeded and the real test run passed in `"3d"` mode, proving this sandbox's system libraries were already sufficient. CI's `ubuntu-latest` runner has root, so `--with-deps` in `.github/workflows/ci.yml` is unaffected by this local limitation.

---

## Phase 3 — Downstream Handoff (can run any time after Phase 1 merges; no code change, documentation/coordination only)

- [x] **3.1** Record for `loader-moderno-dojo` (on hold at apply): its `design.md` cites `Landing3D.tsx` "lines 27-35" and `onOmitirEscena={() => setModo("estatica")}`. Two things changed and that change MUST account for both. **(a) There is NO escape-hatch state to reuse.** An earlier draft of this slice added a speculative `const [omitirEscena, setOmitirEscena] = useState(false)`, and an earlier version of this very task told the loader to wire `setOmitirEscena(true)`. **That state was REMOVED by the orchestrator before slice 1 was finalized** — it was an unreachable branch and the only new lint warning in the change meant to establish a clean gate. Verified: zero occurrences of `omitirEscena` in `src/`. `loader-moderno-dojo` must ADD its own state and fold it into the `modo` derivation, which is now a plain ternary over `capaz3D`. **(b) Line citations shifted** because of the `useSyncExternalStore` rewrite (task 1.4.1 / Group B). **`loader-moderno-dojo`'s apply MUST rebase onto merged slice 1 and re-read the file before continuing** — blocking dependency, not a suggestion. — *Traces: state.yaml `downstream_coupling`, `relates_to: loader-moderno-dojo (blocks)`*

---

## Traceability Summary

| Spec requirement | Tasks |
|---|---|
| R1 — Verification Gate Commands | 1.1.2, 1.5.1-1.5.4, 2.1.3, 2.5.2, 2.6.1, 2.7.1-2.7.5 |
| R2 — `no-explicit-any` non-blocking | 1.1.1 |
| R3 — Repo-wide zero-error baseline | 1.1.1, 1.2.1, 1.3.1-1.3.5, 1.4.1-1.4.3, 1.5.2 |
| R4 — Lint-clean handoff for `Landing3D.tsx` | 1.4.1, 1.5.3 |
| R5 — CI enforcement | 2.6.1, 2.7.5 |
| R6 — Manual behavior preservation | 1.3.6-1.3.9, 1.4.5 |
| R7 — Password-reset E2E verification | 1.3.3, 1.3.7, 1.3.10 |
| X1 — `getRank` | 2.2.2 |
| X2 — `getNextRank` | 2.2.3 |
| X3 — `getXPProgress` | 2.2.4 |
| X4 — `calculateXP` (REMOVED) | 2.3.1, 2.4.1 |
| D1-D7 | Distributed across Phase 1/2 tasks as annotated |

## Explicit Non-Tasks (do not create work items for these)

- Typing the 35 `no-explicit-any` occurrences.
- Testing or fixing `calculateXP` — it is deleted (2.3.1), not fixed.
- Writing the 13 `landing-loader` jsdom tests or the scenario 4.2 E2E spec — both belong to `loader-moderno-dojo`'s own apply.
- A `--max-warnings` ratchet — recorded as a follow-up only.
- Re-investigating the GameEngine pre-solved-level risk — already closed by the orchestrator (1.4.4 only records the finding).

---

## Status at archive — 2026-08-24

44 of 51 tasks done. The seven that stay open are all manual QA, and none of
them blocks anything any more: slice 1 shipped as PR #1 and slice 2 as PR #2,
both merged 2026-08-04, with 72 green CI runs and 203 passing tests over that
code since. Each open task carries an inline note saying exactly what was and
was not exercised.

Two tasks were marked done at archive time against measured evidence, not
against the record — the record was stale by three weeks and said both were
undone:

- **2.7.5** — the record said the CI workflow had NEVER executed. It has run 72
  times, starting with a `pull_request` run on `feat/automated-gates-slice-2`.
- **1.3.10** — the record said no PR existed to carry the body. PR #1 carries it.

A third, **1.4.5**, was marked done and then reverted before this archive
landed. The record's reason for it was false — apply DID have a browser — but
that only invalidates the reason, not the nine-step script: the QA record covers
four of its nine steps — step 3 in full, and steps 1, 7 and 8 in part — and
leaves the other five with no evidence at all. Marking it done would have been a claim
passing for the wrong reason, so it stays open with every one of the nine steps
accounted for.

The genuinely unexercised surfaces — the four UI surfaces plus the five
uncovered steps of 1.4.5 — are recorded as coverage gaps against the `Manual
Behavior Preservation for Hooks Refactors` requirement in
`openspec/specs/automated-verification-gates/spec.md`, where a future change
touching those components will meet them, rather than being dropped here.
