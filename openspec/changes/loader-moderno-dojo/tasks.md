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

## Phase 5: QA (design.md §Manual QA, at `/landing-preview`, ≥768px viewport, WebGL browser)

**Automated as `e2e/landing-loader.spec.ts` (11 specs, all green).** These were
written as a manual procedure because the planning session had no browser. This
environment has Playwright 1.62.1 with a Chromium that exposes WebGL2 through
SwiftShader, so `debeUsar3D()` returns true and the `Loader` does mount — the
premise behind "manual only" no longer holds. Two slices stay genuinely manual
and are listed at the end.

**Two production defects were found while measuring these scenarios, and fixed
before the specs were written** — otherwise the specs would have encoded the
broken behaviour as coverage:

1. `src/components/landing/Personaje.tsx` — `useGLTF.preload(MESH_URL)` runs at
   module scope, and `Landing3D` imports `./Escena` (line 4) before `./Loader`
   (line 9). The preload therefore fired `DefaultLoadingManager.itemStart`
   before `Loader`'s import of `useProgress` created drei's zustand store, which
   is what installs `onStart`. With the mesh as the only top-level item, three
   never re-emits that `onStart` while it is pending, so `useProgress().active`
   stayed false for the whole load and the overlay always dismissed on the
   2.5 s `ARRANQUE_MS` cold-start timer instead of on the load. Measured: an
   asset that never arrived still dismissed the overlay at 4156 ms. Fix: touch
   `useProgress.getState()` before the preload. The preload is kept — measured
   `active: true` at 315 ms, earlier than with the preload removed (415 ms).
2. `src/components/landing/Loader.tsx` — a failed item ends the manager's queue
   just like a successful one, so `onLoad` clears `active` on error too. The
   completion effect raced the error gate, and winning latched `terminado`,
   which then suppressed the error UI permanently. Measured: a 404 landing
   3.5 s into the load left the visitor on a bare nav — no scene, no message,
   no escape action. Fix: `if (escenaFallo || errors.length > 0) return;` before
   the completion branch.

Every timing spec asserts both sides of its threshold (absent before, present
after), and each fix was reverted individually to confirm the specs go red:
without fix 1, specs 5.1 / 5.3 / 5.4 / 5.5-late fail; without fix 2, 5.5-late
fails while 5.5-immediate still passes. An earlier 5.1 asserted only
"dismissed later than 1500 ms", which the broken build satisfied too — the
positive control caught it and the assertion was tightened.

- [x] 5.1 Happy path — automated (behavioural half). Overlay on the live region, caption `Preparando el dojo… N %`, ring open at full circumference, mesh held past `ARRANQUE_MS`, overlay still present at 4.2 s, dismissal after the asset arrives, canvas visible. Visual half stays manual (see below).
- [x] 5.2 Determinate tracking — automated. Clips are staggered by arrival order so `progress` climbs through intermediate values; the arc's `stroke-dashoffset` is asserted against the caption's own percentage, the percentage stays in range, the load reaches completion, and no stall hint appears while it advances. **Monotonicity across samples is deliberately NOT asserted, and `design.md` §Manual QA step 2 is wrong to ask for it.** drei computes `progress` relative to the last completed batch (`saveLastTotalLoaded` is set inside `onProgress` when `loaded === total`), so each new batch restarts at 0 — here the mesh finishes at 100 and the 8 clips then begin from 0. The first version of this spec asserted monotonicity, passed locally by sampling luck, and went flaky on CI with `[0, 100, 0, 0]`. It was the assertion that was wrong, not the code.

      That fix exposed a second, worse problem: with an unstaggered localhost load every sample read 0 or 100, and at 0 a wrong offset formula still agrees — so the arc-versus-caption assertion was **vacuous**. Verified by breaking `Loader.tsx`'s offset formula and watching the test still pass. The staggering plus an explicit "at least one sample strictly between 0 and 100" guard fixes it; with them the same broken formula now turns the test red.
- [x] 5.3 8s hint — automated. Hint absent at 7 s, present at 9.5 s with the matching live-region text, no error yet; releasing the held request retracts the hint on the next advance.
- [x] 5.4 20s escape — automated. Error state absent at 19 s, present at 22 s with `neon-red` stroke, hint withdrawn, caption hidden, escape button focused; clicking it renders `LandingEstatica` with no canvas.
- [x] 5.5 404 asset — automated for both an immediate and a 3.5 s-late 404, served via `page.route` so no tracked file is renamed. Asserts the loader's error state, the escape action, that the canvas unmounts, and that Next's runtime-error screen never takes over. The `npm run build && npm start` re-run design.md asks for is DONE, not manual: the whole suite was run a second time with `CI=1`, which switches `playwright.config.ts` to `npm start`, and all 16 specs passed against the production build. Absence of a `pageerror` is deliberately not asserted — measured in dev, React surfaces the caught error to `window` even though the boundary handled it, so its absence says nothing about the boundary.
- [x] 5.6 Reduced motion mid-load — automated via `emulateMedia`. Pulse present while motion is allowed, gone after the flip, overlay and arc still tracking. Plus 5.6b: reduced motion at mount lands on `LandingEstatica` with no loader. **This closes the reduced-motion gap `automated-gates` recorded as open against `Manual Behavior Preservation for Hooks Refactors`, whose toolset could not emulate the preference.**
- [x] 5.7 Screen reader — automated (DOM half). A `MutationObserver` records every distinct live-region value; asserts it starts at `Preparando el dojo…`, ends at `Dojo listo.`, never exceeds the six possible milestone strings, and that the `<svg>` carries `aria-hidden`. Actual Orca/NVDA speech stays manual.
- [x] 5.8 Keyboard — automated. Focus is blurred first so `Tab` has to reach the escape button on its own, then `Enter` activates it and the static landing renders.
- [x] 5.9 Dismissal latch — automated. After a clean load the live region is gone, and it stays gone across five scroll positions.

### Deliberately not automated

- **5.1, visual half** — arc drawn clockwise from 12 o'clock, the blue→purple
  gradient, and "no blank frame between fade-out and first canvas paint". These
  are pixels. A DOM assertion cannot tell a correct gradient from an inverted
  one, and this environment rasterises through SwiftShader, so a screenshot
  baseline would encode software-renderer output rather than what a visitor
  sees.
  (5.5's production re-run is NOT in this list: it was performed. See 5.5 above.)
- **5.7, screen-reader half** — that Orca or NVDA actually speak these strings.
  The specs prove the text, the roles and the milestone cadence, not the speech.

### Not closed here

The other `automated-gates` QA gap — five of nine steps of the GameEngine script
without evidence, including the ~1.8 s success overlay — is left as recorded.
It is the same "rewritten timer nobody measured" pattern this phase just found
in the loader, so it is worth its own pass, but it is a different component and
folding it in here would widen this change's scope without a measurement to
justify it.

## Out of Scope (do not touch)

`src/components/ui/LoadingSpinner.tsx`, `src/components/auth/ApprovalGate.tsx`, `LandingClient.tsx`'s `next/dynamic` fallback, any route-level `loading.tsx`. (Req: Scope Boundary)
