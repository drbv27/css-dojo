# Archive report — loader-moderno-dojo

Date: 2026-08-24
Branch: `fix/loader-espera-carga-real`, branched from `main@5ea1891`
Folder relocated: **no** — this repository keeps archived change folders in
place (`automated-gates` and `css-track-expansion` both did), which also avoids
the rename-blindness that moving a folder introduces into a bounded diff.

## Promoted spec

`specs/landing-loader/spec.md` (131 lines, delta) →
`openspec/specs/landing-loader/spec.md` (266 lines, main).

`openspec/specs/` now holds five capabilities: `automated-verification-gates`,
`css-track-content`, `css-track-sections`, `xp-progression`, and
`landing-loader`.

Format matches the convention established by the two prior closes: `# Spec:
<capability>` heading, a `Capability:` line, an "Established by change"
paragraph, and zero residue of `Delta for`, `## ADDED Requirements` or
`Phase: spec` — verified by search.

## Promotion is not copying

Three requirements would have become false invariants if promoted verbatim, and
were split into a durable constraint plus a `History:` note. Every number
promoted was re-measured against the repository rather than carried over.

1. **`Requirement: Scope Boundary` → `Requirement: Landing Loader Is the
   Landing's Only Loading Overlay`.** The delta said the change "MUST touch only
   `Loader.tsx`, `useLanding.ts`, and `Landing3D.tsx`". That was a gate for one
   change. Read as a standing rule it is not merely stale, it is actively
   harmful: **it would forbid the `Personaje.tsx` fix that makes this capability
   work at all.** The durable half — the app's spinners stay separate, no
   route-level `loading.tsx`, `/landing-preview` inherits — is promoted; the file
   list is recorded as history with that contradiction stated explicitly.

2. **`Requirement: Removal of Dead Loading State`.** Its scenario read "WHEN
   searching `src/` for `loaded` or `setLoaded`, THEN zero declarations and zero
   call sites MUST remain". A text search over `src/` returns 12 hits
   across 7 files for `\b(loaded|setLoaded)\b`, or 9 for `loaded` alone, or 7
   if you count files instead of occurrences (all re-measured 2026-08-24) —
   comment prose, drei's own `loaded` store field in a test fixture, an
   unrelated prop, and the test asserting this very requirement. The requirement
   is true; the scenario as phrased invited a falsification that does not apply.
   Restated against the store's properties, and the `History:` note now carries
   the exact command beside the number — three different right answers to
   three different questions is precisely how a cited count goes wrong.

3. **The `~9 .glb files` count and the "if available" hedge.** Re-measured:
   `/models/ninja/` holds exactly 9 `.glb` files, but only `ninja.glb` is
   requested at first — `PersonajeReal` suspends on the mesh before the 8
   animation clips are reached, and the manager reports 18 items once the mesh
   resolves. The delta's hedge "via drei's error signal if available, otherwise
   the stall timer alone satisfies this requirement" was planning-time
   uncertainty; the signal is available and is used, so the hedge is dropped
   rather than promoted as an escape clause. The delta also described the 404
   scenario as "renamed" — the tests serve a 404 through `page.route`, so the
   repository is never mutated.

## Requirements added at promotion, and why

Promotion added one requirement and several scenarios that the delta did not
contain, because the change's own QA phase discovered behaviour the planning
phase could not have known:

- **`Requirement: Dismissal Gated on Real Load Completion`** is new. It records
  the invariant restored by this change's first fix: the overlay must wait for
  the load, never for a fixed elapsed time, and any module-scope
  `useGLTF.preload(...)` must run after drei's `useProgress` store exists.
  Without this requirement the spec would omit precisely the thing most likely
  to regress — and would have described a decorative overlay as a working one.
- **Absent-before-threshold scenarios** were added to the 8 s hint and the 20 s
  escape. The delta only required the states to appear. An implementation that
  rendered them from mount satisfied the delta and failed the intent.
- **`A late failure is not swallowed by dismissal`** records this change's
  second fix.

## Neighbouring QA gaps

Closed: the reduced-motion branch of the landing render-mode scenario, recorded
open at `automated-gates`' archive against its `Manual Behavior Preservation for
Hooks Refactors` requirement, because that change's tool set could not emulate
the preference. Covered here in both directions by 5.6 and 5.6b.
`openspec/specs/automated-verification-gates/spec.md` was updated: it said four
follow-ups remained open, and now names the remaining **three** — the leaderboard
filter and its offline empty state, the mobile drawer close-on-navigation paths,
and exercise-page completion. Three is the count after removing one from four,
and the three are named individually rather than summed.

Left open, deliberately: the GameEngine script's five unevidenced steps,
including the ~1.8 s success overlay. It is the same "rewritten timer nobody
measured" pattern this phase just found in the loader, so it deserves its own
pass — but it is a different component, and folding it in here would widen this
change's scope without a measurement to justify it. It remains recorded where
`automated-gates` left it.

## Files

Committed in `2e002ce`:

- `src/components/landing/Personaje.tsx` — fix 1 (+11 −1)
- `src/components/landing/Loader.tsx` — fix 2 (+10 −1)
- `e2e/landing-loader.spec.ts` — 374 lines, 11 specs (new)
- `openspec/changes/loader-moderno-dojo/tasks.md` — Phase 5 outcomes
- `openspec/specs/automated-verification-gates/spec.md` — follow-up closed

Added at archive:

- `openspec/specs/landing-loader/spec.md` — promoted
- `openspec/changes/loader-moderno-dojo/verify-report.md`
- `openspec/changes/loader-moderno-dojo/archive-report.md`
- `openspec/changes/loader-moderno-dojo/state.yaml` — phases advanced

## Not done here

**Pushed as a branch, not merged.** `fix/loader-espera-carga-real` is on
`origin` at `77253a3`. No pull request is open and nothing has been pushed to
`main`.

`.github/workflows/ci.yml` triggers on `push` to `main` and on `pull_request`
only, so this branch push ran no CI. Every gate reported in `verify-report.md`
was run locally. Remote validation happens when a PR is opened.

`origin/main` moved to `3f33a34` while this change was in progress (a one-file
edit to `openspec/changes/css-track-expansion/state.yaml` from a parallel
session). That commit is not an ancestor of this branch, so a direct push to
`main` would be non-fast-forward. There is no content conflict: the two commits
share zero files. Bringing `main` in is a one-command merge, deliberately left
for whoever opens the PR, and the gates must be re-run afterwards — green gates
on a tree you are not shipping prove nothing.

Two adjacent items were also left alone on purpose: `.claude/` and
`.gitattributes` remain untracked (the `.gitattributes` is measured inert — it
would renormalise zero files, the only 9 non-LF files being the `.glb`s git
already classifies binary), and `playwright.config.ts` still has
`reuseExistingServer: !process.env.CI`, which during this change silently
adopted another project's dev server on port 3000 and ran this suite against the
wrong application. Both are real, both are separate changes.
