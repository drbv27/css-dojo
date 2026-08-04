# Tasks: Modern, accessible landing loader ("ensō gate")

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~225 (design-revised; supersedes proposal's ~120-170) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending (not needed at Low risk) |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Delete dead `loaded`/`setLoaded` from `useLanding.ts` | PR 1 | `npm run lint` | N/A — zero callers confirmed via repo-wide search; no runtime behavior change | Revert the `useLanding.ts` hunk only |
| 2 | Inline `LimiteEscena` error boundary + `escenaFallo` state in `Landing3D.tsx` | PR 1 | `npm run lint` | Manual QA step 5 (renamed `.glb`, dev and `next start`) | Revert `LimiteEscena` class + `escenaFallo` wiring in `Landing3D.tsx` |
| 3 | Full `Loader.tsx` rewrite as state machine | PR 1 | `npm run lint` + `npm run build` | Manual QA steps 1-4, 6-9 | Revert `Loader.tsx` to its 21-line pre-change version |

## Phase 1: Foundation — Dead State Removal

- [x] 1.1 In `useLanding.ts`, delete the `loaded` field, `setLoaded` setter, and their init/assignment lines. (Req: Removal of Dead Loading State)
- [x] 1.2 Confirm zero remaining `loaded`/`setLoaded` references anywhere in `src/`. (Scenario: Dead field is gone)

## Phase 2: Error Boundary Wiring (Landing3D.tsx)

Must land before/alongside Phase 3's error-state work — the error path is unverifiable without it.

- [x] 2.1 Add inline `LimiteEscena` class component (~18 lines, `componentDidCatch` only) at the bottom of `Landing3D.tsx`. (Design Decision 2)
- [x] 2.2 Add `escenaFallo` state; wrap `<Escena />` in `<LimiteEscena onError={() => setEscenaFallo(true)}>`. (Design Decision 2, Data Flow)
- [x] 2.3 Add `onOmitirEscena={() => setModo("estatica")}` and pass it plus `escenaFallo` into `<Loader />`. (Design Decision 1) — implemented as `escapeManual` state folded into the `modo` derivation (no `setModo` setter exists post-`automated-gates` rewrite; see Deviations).

## Phase 3: Loader State Machine (Loader.tsx full rewrite)

- [x] 3.1 Define `FaseLoader` type, `LoaderProps` interface, and constants `HOLD_MS/SALIDA_MS/HINT_MS/ESCAPE_MS/ARRANQUE_MS`. (Interfaces/Contracts)
- [x] 3.2 Init `fase/lento/visible/reducido` with literal values only (no `window`/store reads in render) plus `terminado`/`huboActividad` refs, for SSR/CSR parity. (Design Decision 6)
- [x] 3.3 Implement the stall/escape effect keyed on `[progress, fase]`: 8s → `lento=true`, 20s → `fase="error"`, both re-armed on real advance. (Design Decision 3; Req: Stalled-Load Hint, Failure Escape)
- [x] 3.4 Implement the cold-start guard: mount effect seeds `huboActividad`, `ARRANQUE_MS` timer resolves `fase="completo"` if no activity was ever observed. (Design Decision 3)
- [x] 3.5 Gate the error state on `escenaFallo || (errors.length > 0 && fase === "cargando")`, guarded by the `terminado` latch so a stale global `errors` array cannot resurrect a dismissed overlay. (Req: Failure Escape; Open Question mitigation)
- [x] 3.6 Implement the reduced-motion `matchMedia` subscription with a `change` listener (not sampled once). (Design Decision 7; Req: Reduced-Motion Compliance)
- [x] 3.7 Derive coarse milestone `hito` (0/25/50/75/100) and `anuncio` via `useMemo`, keyed on `(fase, hito, lento)`. (Design Decision 4; Req: Accessible Status Announcements)
- [x] 3.8 Build the SVG ensō ring: `viewBox="0 0 96 96"`, `r=42`, gradient `neon-blue→neon-purple`, `stroke-dashoffset` bound to `progress`, `aria-hidden="true"`; switch to `neon-red` (last offset held) on `fase==="error"`. (Req: Determinate Progress Ring)
- [x] 3.9 Build the DOM split: `aria-hidden` SVG, `sr-only role="status" aria-live="polite" aria-busy={...}` region with only `anuncio`, and a separate `aria-hidden` visible caption with the fine percentage. (Design Decision 4; Req: Accessible Status Announcements)
- [x] 3.10 Render the non-blocking `editor-muted` stall hint beneath the caption when `lento`, clearing automatically on resume. (Req: Stalled-Load Hint at 8 Seconds)
- [x] 3.11 Render the error-state UI: failure copy, "Continuar sin la escena" button (reuse `NavLanding.tsx:35` button class verbatim), calling `onOmitirEscena`; move focus to it via `ref` on transition into `fase==="error"`. (Req: Failure Escape at 20 Seconds or on Load Error)
- [x] 3.12 Wrap the return in `AnimatePresence`/`motion.div` keyed on `visible`; on completion hold `HOLD_MS`, then `setVisible(false)`, `SALIDA_MS` fade, `pointer-events-none` during exit, `terminado` latch prevents re-show. Never early-return `null`. (Req: Animated Exit on Completion; Design Decision 5)

## Phase 4: Automated Gates

- [x] 4.1 **UNBLOCKED as of 2026-08-04.** `npm run lint` was broken when this plan was written (`next lint` was removed in Next.js 16), and the `automated-gates` change repaired it. Run `npm run lint`; it MUST exit 0 with **0 errors**. Baseline on merged `main` is 50 warnings — do not increase it. Also run `npm run typecheck` (exit 0). — Verified: lint 0 errors/50 warnings, typecheck exit 0. Four `react-hooks/set-state-in-effect` errors surfaced during implementation and were fixed by deferring the flagged `setState` calls one tick via `setTimeout(fn, 0)` inside the effect body (nested-callback pattern the rule does not flag).
- [x] 4.2 Run `npm run build`; confirm no type errors and no hydration-mismatch warnings for `/landing-preview`. — Verified: `npm run build` exit 0, `/landing-preview` prerendered statically (○), no hydration warnings in build output.
- [x] 4.3 **NEW — a unit test tier now exists.** Run `npm run test:run`; the existing 18 tests MUST still pass, plus the loader's own tests written RED-first (see 4.4). Run `npm run test:e2e`; the landing smoke test MUST still pass. — Verified: `npm run test:run` → 35/35 passing (18 pre-existing `xp.test.ts` + 17 new). `npm run test:e2e` → 1/1 passing.
- [x] 4.4 **RED-first tests for this change.** Per the settled decision, the jsdom-testable `landing-loader` scenarios are written test-first HERE, not in `automated-gates`. Vitest + jsdom + `@testing-library/react` are installed and configured (`vitest.config.mts`). Drive the loader through drei's `useProgress` zustand store with `useProgress.setState({ ... })` — no WebGL needed, and `errors` lives in the same store so the error state is reachable too. Of the 15 spec scenarios: 13 are jsdom-testable (10 plain, 2 needing a `HTMLCanvasElement.prototype.getContext` stub plus an `./Escena` module mock, 1 with a framer-motion timing caveat), 1 is E2E-only (a real `.glb` 404 through a real `Canvas`), and 1 is a `git diff` check rather than a runtime test. — Done: `src/components/landing/Loader.test.tsx` (13 tests, confirmed RED against the pre-change 21-line `Loader.tsx`, now GREEN), `src/components/landing/Landing3D.test.tsx` (2 tests covering the canvas-stub+`./Escena`-mock scenarios: "`/landing-preview` inherits automatically" and "Escape reaches the static landing"), `src/components/landing/useLanding.test.ts` (2 tests for the dead-field removal). The "404 through a real `Canvas`" scenario stays E2E-only (not added here — see Deviations/Risks); the "Out-of-scope files untouched" scenario was verified via `git diff --stat` against `LoadingSpinner.tsx`/`ApprovalGate.tsx` (zero changes), not a runtime test, per its own classification.

## Phase 5: Manual QA Procedure (design.md §Manual QA, run at `/landing-preview`, ≥768px viewport, WebGL browser)

**NOT performed by this apply — no browser available in this environment.** Handoff to a human or a browser-automation pass. Step 5.5 specifically MUST be re-run under `npm run build && npm start` (not `npm run dev`), because the dev-mode error overlay masks error-boundary behavior.

- [ ] 5.1 Happy path: `npm run dev`, load page — overlay on `bg-editor-bg`, clockwise arc, caption `Preparando el dojo… N %`, ring closes, ~600ms hold, fade, canvas visible with no blank frame.
- [ ] 5.2 Determinate tracking: Network throttle 400 kb/s — arc matches caption monotonically; no stall hint while advancing.
- [ ] 5.3 8s hint: throttle 20 kb/s — hint appears ~8s after freeze, no button; restore throttling — hint clears on next advance.
- [ ] 5.4 20s escape (stall, no error): throttle 1 kb/s, wait ~20s — ring turns `neon-red`, escape button focused; click it — `LandingEstatica` renders, overlay gone, console clean.
- [ ] 5.5 404 asset: rename `public/models/ninja/ninja.glb`, hard-reload — boundary catches the throw, `neon-red` error state with escape action, not Next's error page, not an eternal overlay. **Re-run this exact step under `npm run build && npm start`** — the dev-mode error overlay masks boundary behavior. Restore the file after.
- [ ] 5.6 Reduced motion mid-load: toggle DevTools emulate `prefers-reduced-motion: reduce` while overlay is on screen — pulse stops, arc still tracks, exit fade collapses. Separately confirm reduced-motion-at-mount lands directly on `LandingEstatica` with no loader.
- [ ] 5.7 Screen reader (Orca/NVDA): announcements at start, ~25/50/75/100, completion, failure — never every percent; `<svg>` not announced.
- [ ] 5.8 Keyboard: in the error state, Tab reaches the escape button with a visible focus ring; Enter activates it.
- [ ] 5.9 Dismissal latch: after a successful load, scroll the whole landing — overlay never reappears.

## Out of Scope (do not touch)

`src/components/ui/LoadingSpinner.tsx`, `src/components/auth/ApprovalGate.tsx`, `LandingClient.tsx`'s `next/dynamic` fallback, any route-level `loading.tsx`. (Req: Scope Boundary)
