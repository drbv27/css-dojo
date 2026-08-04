# Proposal: Modern, accessible landing loader ("ensō gate")

Phase: `sdd-propose` · Store: hybrid (Engram `sdd/loader-moderno-dojo/proposal`) · Approach: exploration option 2.

## Intent

`src/components/landing/Loader.tsx` (21 lines) is the only feedback during ~9 `.glb` downloads issued by `Personaje.tsx:30-35`. Today three users are failed:

| User | What happens now |
| --- | --- |
| Sighted visitor | Real `progress` is rendered next to an *indeterminate* `animate-spin` ring; the overlay vanishes by hard `if (!active) return null` — a visual snap. |
| Screen-reader visitor | Nothing is announced. Zero `role="status"` / `aria-live` / `aria-busy` exist in `src/` outside curriculum content. The wait is silent and unexplained. |
| Visitor whose asset hangs or 404s | Only `{ active, progress }` are read; drei's `errors` are ignored. The overlay persists forever with no message and no exit. |

## Scope

### In scope
- Rewrite `Loader.tsx`: determinate progress, accessible status region, error/timeout path, animated exit.
- Delete dead `loaded` / `setLoaded` from `useLanding.ts`.
- Minimal `Landing3D.tsx` hook-up so the loader can hand a failed visitor to the static landing.

### Out of scope (explicit)
- `src/components/ui/LoadingSpinner.tsx` and `src/components/auth/ApprovalGate.tsx` — the two loading systems stay separate; no unification.
- Route-level `loading.tsx` (wrong bottleneck: the wait is client-side WebGL).
- `LandingClient.tsx`'s `next/dynamic` chunk fallback; `LandingEstatica.tsx`'s unconditional `animate-pulse` (pre-existing motion defect → follow-up).

## Capabilities

### New capabilities
- `landing-loader`: progress, accessibility, degradation and exit behavior of the public landing's 3D asset-loading overlay.

### Modified capabilities
None — `openspec/specs/` is empty.

## Approach

**Visual direction: the ensō gate.** `Loader.tsx:5` already names the ensō, but the ring spins indeterminately while real progress exists. An ensō is drawn in *one* stroke, so bind it to the data: an SVG ring whose `stroke-dashoffset` maps `progress` 0→100, stroked `neon-blue → neon-purple` over an `editor-border` track on `bg-editor-bg`, `editor-muted` mono caption. Completing the circle *is* the metaphor. On completion the ring holds one beat, then the overlay dissolves via framer-motion `AnimatePresence` (already the landing's motion library). Existing tokens only.

**Accessibility.** `role="status"` + `aria-live="polite"` + `aria-busy`, announcing coarse milestones (0/25/50/75/100 and state changes), never every percent. Ring `aria-hidden`; the caption carries the meaning.

**Degradation.**

| Threshold | Behavior |
| --- | --- |
| 8 s with no `progress` advance | Non-blocking hint under the caption (`editor-muted`). |
| 20 s stalled, or `errors.length > 0` | Error state (`neon-red` ring) + explicit "Continuar sin la escena" action that switches `Landing3D` to `modo === "estatica"`. |

Never a dead end: the static landing is already the sanctioned degraded experience. The installed `useProgress` `errors` signature is **unverified** — design must confirm it against `node_modules`; the stall timer works regardless.

**Dead field: delete, do not wire.** Nothing reads `loaded`. The lifecycle belongs to drei's loading manager and the error path needs one callback upward (a prop), not global state. A second "ready" source of truth invites desync for no consumer.

**Reduced motion: no new loading state.** `LandingEstatica.tsx` loads no async assets, so a loader there would be theatre. The loader still honours `prefers-reduced-motion` defensively (static arc, no pulse) since the query can flip after mount.

**`/landing-preview` inherits automatically** — it imports `Landing3D` directly and the loader lives in its `modo === "3d"` branch. The `next/dynamic` fallback is untouched, so no divergence appears.

## Affected areas

| Area | Impact | Description |
| --- | --- | --- |
| `src/components/landing/Loader.tsx` | Modified | Full rewrite (~110 lines). |
| `src/components/landing/useLanding.ts` | Modified | Remove `loaded`, `setLoaded` (4 lines). |
| `src/components/landing/Landing3D.tsx` | Modified | Pass a fallback callback to `Loader` (~8 lines). |

**Estimated ~120-170 changed lines against the 400-line review budget → budget risk Low.** Single PR, no chaining.

> **REVISED BY `sdd-design` → ~225 changed lines.** Still Low risk against the 400-line budget, still a single PR, but this proposal's original number is superseded. The increase is one verified, unavoidable addition: `@react-three/fiber`'s `Canvas` re-throws any error from its subtree into the outer React tree (`node_modules/@react-three/fiber/dist/react-three-fiber.esm.js:60` — `if (error) throw error;`, commented "Throw exception outwards if anything within canvas throws", fed by the internal boundary at lines 103-112). A 404 `.glb` therefore crashes past `Landing3D` to Next's route error boundary and the loader's error state never paints. Without an error boundary in `Landing3D`, the success criterion "a renamed/404 `.glb` produces a visible error state, not an eternal overlay" below is **unreachable**. Design adds a ~18-line inline boundary inside `Landing3D.tsx`, keeping the diff at 3 files. Orchestrator-verified against `node_modules`.
>
> Also verified while resolving this: the installed `@react-three/drei@10.7.7` DOES expose `errors: string[]` from `useProgress` (`node_modules/@react-three/drei/core/Progress.d.ts:3`), so the earlier "unverified signature" risk is closed. The array is append-only and never reset (`core/Progress.js:21-23`), which the design accounts for.

## Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| `useProgress().errors` signature differs in the installed drei | Med | Design phase verifies; stall timer works without it. |
| No test suite (`strict_tdd: false`) — error/timeout path is manual-QA only | High | Scripted manual checklist (throttled network, renamed `.glb`); `npm run lint` + `npm run build`. |
| Timeout thresholds annoy slow-connection users | Low | 8 s hint is non-blocking; 20 s escape is opt-in, never automatic. |
| `AnimatePresence` exit races the canvas reveal | Low | Loader unmount stays independent of `Escena`; verify visually at `/landing-preview`. |

## Rollback plan

One revert of one commit touching three files under `src/components/landing/`. No DB migration, no persisted state, no env var, no config, no API contract, no dependency added (framer-motion is already a dependency). `git revert <sha>` restores the current 21-line loader with zero cleanup.

**Security-sensitive callout (per `rules.proposal`): not applicable.** This change touches no part of `src/lib/auth.ts`, `ApprovalGate`, any MongoDB model, or XP/gamification logic. Stated explicitly rather than omitted.

## Dependencies

None new. `@react-three/drei` and `framer-motion` are already installed.

## Success criteria

- [ ] The ring is determinate and tracks `useProgress().progress`.
- [ ] A screen reader announces loading start, coarse progress, completion, and failure.
- [ ] The overlay never persists past 20 s without offering an escape to the static landing.
- [ ] A renamed/404 `.glb` produces a visible error state, not an eternal overlay.
- [ ] Exit is animated, not a hard unmount.
- [ ] Only files under `src/components/landing/` changed; `LoadingSpinner.tsx` and `ApprovalGate.tsx` untouched.
- [ ] `npm run lint` and `npm run build` pass.

## Proposal question round

Interactive mode requires a question round, but this executor cannot prompt directly. The settled decisions (visual-plus-accessibility, landing-only, proposal-decides visual, clean tree) were **not** relitigated. These four assumptions were decided here and are cheap to correct before `sdd-spec`:

1. **Thresholds** — 8 s hint / 20 s escape. Too eager for your audience's connections?
2. **Escape action** — the failure exit is "continue to the static landing". Alternative: a retry button. Retry is more work and re-enters the same failure.
3. **Dead field** — deleting `loaded`/`setLoaded`. If a future post-load camera/entrance sequence is already planned, wiring it instead may be worth it.
4. **Escape copy** — "Continuar sin la escena" (Spanish, matching the product's UI language).
