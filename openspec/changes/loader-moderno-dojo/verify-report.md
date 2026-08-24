# Verify report — loader-moderno-dojo

Date: 2026-08-24
Branch: `fix/loader-espera-carga-real`, branched from `main@5ea1891`
RDD: OFF (`receipt-driven development: off (decided by default)`; `global` and
`clone-local` both `unset`). Delivery follows ordinary repository policy —
hooks, tests, CI. No receipt, no consent relay, no reviewer.

## Automated gates

Every gate was run, not inferred. `npm run lint` and the unit suite are run
explicitly because `state.yaml`'s `forward_to_apply` note claimed neither
existed — that note was written before `automated-gates` shipped and is
obsolete.

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | PASS |
| Lint | `npm run lint` (`eslint .`) | PASS — 0 errors, 49 warnings, none in this change's files |
| Unit | `npm run test:run` | PASS — 203 tests in 18 files |
| Build | `npm run build` | PASS |
| E2E (dev server) | `npx playwright test` | PASS — 16 specs |
| E2E (production server) | `CI=1 npx playwright test` | PASS — 16 specs against `npm start` |

The production E2E run is not redundant: `design.md` §Manual QA step 5 requires
task 5.5 to be re-run under `npm run build && npm start`, because the dev-mode
error overlay changes error-boundary reporting. `CI=1` switches
`playwright.config.ts` to `npm start`, so that requirement is satisfied by
execution rather than carried forward as manual residue.

## Requirements coverage

All ten requirements in `specs/landing-loader/spec.md` are implemented, and each
is now covered by an executing test rather than by a procedure someone might
run. Phase 5's nine QA tasks map to 11 E2E specs in `e2e/landing-loader.spec.ts`
(5.5 and 5.6 each have two). The split is **6 fully automated + 3 partially
automated**, not "9 of 9":

- Fully automated (6): 5.2, 5.3, 5.4, 5.6, 5.8, 5.9.
- Partially automated (3), with the manual remainder and its reason written into
  `tasks.md`: 5.1 (visual fidelity of the ring), 5.7 (actual Orca/NVDA speech),
  and 5.5 — whose only manual item, the production re-run, was then performed
  and is closed.

## Two production defects found during verification, and fixed

Verification did not merely confirm the implementation; it falsified it. Both
defects are recorded in `tasks.md` Phase 5 and in the promoted spec.

1. **The overlay dismissed on a timer, not on the load.** `useProgress().active`
   never became true, so the `ARRANQUE_MS` (2500 ms) cold-start guard always
   resolved the overlay. Measured: an asset that never arrived still dismissed
   the overlay at 4156 ms. Root cause is a module-ordering race —
   `Landing3D.tsx` imports `./Escena` (line 4) before `./Loader` (line 9), so
   the module-scope `useGLTF.preload(MESH_URL)` in `Personaje.tsx` fired
   `DefaultLoadingManager.itemStart` before `Loader.tsx`'s import of
   `useProgress` created drei's zustand store, which is what installs `onStart`.
   With the mesh as the only top-level item, three never re-emits that `onStart`
   while the request is pending. Fix: touch `useProgress.getState()` before the
   preload. The preload is kept — measured `active: true` at 315 ms, earlier
   than with the preload removed (415 ms).

   Consequence while it was live: tasks 5.3 and 5.4 were not merely untested,
   they were unreachable. The overlay left the screen 5.5 s before the 8 s hint
   could appear.

2. **A late load error was swallowed.** A failed item ends the manager's queue
   exactly as a successful one does, so `onLoad` clears `active` on error too.
   The completion effect raced the error gate and, when it won, latched
   `terminado`, which then suppressed the error UI permanently. Measured: a 404
   landing 3.5 s into the load left the visitor on a bare nav — no scene, no
   message, no escape action. Fix: `if (escenaFallo || errors.length > 0)
   return;` before the completion branch.

A first hypothesis for defect 1 — that drei's `/* @__PURE__ */ create(...)` was
lazily instantiated — was **wrong**, and was discarded by reading
`node_modules/@react-three/drei/core/Progress.js` and
`node_modules/three/src/loaders/FileLoader.js` rather than by reasoning further.

## Positive control

Each fix was reverted **individually** and the suite re-run, because a test that
passes with the fix undone proves nothing:

- Without the `Personaje.tsx` fix: 5.1, 5.3, 5.4 and 5.5-late fail.
- Without the `Loader.tsx` guard: 5.5-late fails and 5.5-immediate still
  passes — which is correct, that path never needed the guard.

That control caught a defective test of this change's own making. 5.1 originally
asserted only "dismissed later than 1500 ms", which the broken build satisfied
too, since it dismissed at roughly 3.5 s. It was tightened to: mesh held back
5000 ms (past `ARRANQUE_MS`), overlay **still present at 4200 ms**, dismissal
after 5000 ms. It now fails red against the reverted fix.

## Deviation from tasks.md, accepted

Task 2.3 specifies `onOmitirEscena={() => setModo("estatica")}`; the code derives
the mode instead, via `setEscapeManual(true)` feeding
`escapeManual || capaz3D === false ? "estatica" : ...`. Same semantics, and
deliberately so: writing state from an effect would reintroduce the
`react-hooks/set-state-in-effect` error that `automated-gates` removed from this
exact file. Not a drift, and not corrected.

## Obsolete records corrected while verifying

- `state.yaml`'s `forward_to_apply` note claimed no test suite exists and that
  `npm run lint` is broken because it runs `next lint`. Re-measured: `lint` is
  `eslint .` and exits 0, and 203 unit tests run in 18 files.
- `specs/landing-loader/spec.md` claimed `openspec/specs/` is empty. It holds
  four capabilities.
- The handoff prompt for this change stated 7 textual occurrences of `loaded` in
  `src/`. Re-measured: 9, across 7 files. None is the field, so the requirement
  still holds — but the number did not.

## Verdict

**PASS.** Six gates green, ten requirements covered by executing tests, both
defects found here fixed and guarded, positive controls confirmed for each fix
independently. Two slices remain deliberately manual (ring pixel fidelity,
real screen-reader speech), each with its reason recorded next to the task.
