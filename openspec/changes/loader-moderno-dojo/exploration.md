# Exploration — loader-moderno-dojo

Phase: `sdd-explore` · Status: done · Artifact store: hybrid (mirrored in Engram as `sdd/loader-moderno-dojo/explore`)

## Scope of investigation

Map every loading state in the application before any target design is chosen. The stated intent is "a modernized loader for the Dojo"; the concrete goal is not yet specified, so this document deliberately picks no winner.

## Finding 1 — There are two structurally unrelated loading systems

They share no code today.

### System A — Public landing (`/` and `/landing-preview`)

A four-layer chain, each layer with its own fallback:

| Layer | File | Behavior |
| --- | --- | --- |
| 1. Chunk download | `src/components/landing/LandingClient.tsx:7-10` | `next/dynamic(..., { ssr: false, loading: () => <div className="fixed inset-0 bg-editor-bg" /> })` — a blank div, no spinner |
| 2. Capability probe | `src/components/landing/Landing3D.tsx:27-35` | Internal `"cargando"` state, another blank div, resolved by one `useEffect` calling `debeUsar3D()` (reduced-motion, viewport width, WebGL support) |
| 3. Asset progress | `src/components/landing/Loader.tsx` | The actual loader — mounted only at `Landing3D.tsx:48`, inside the `modo === "3d"` branch |
| 4. Scene suspense | `src/components/landing/Escena.tsx:61` | `<Suspense fallback={null}>` — the fallback renders nothing |

`Loader.tsx` in full (21 lines):

- `useProgress()` from `@react-three/drei`, destructuring only `{ active, progress }`.
- Full-screen `fixed inset-0 z-50` overlay on `bg-editor-bg`.
- A plain CSS `animate-spin` ring using `border-t-neon-purple` / `border-r-neon-blue`.
- Copy: `Preparando el dojo… {Math.round(progress)}%`.
- Unmounts via a hard `if (!active) return null` — no exit transition.

### System B — Authenticated app (`(app)/`, `(teacher)/`)

- `src/components/ui/LoadingSpinner.tsx` — shared CSS-spin component, used at `dashboard/page.tsx:76`, `playground/page.tsx:85`, `playground/[id]/page.tsx:153`, `leaderboard/page.tsx:174`, `teacher/open-code/page.tsx:88`.
- `src/components/auth/ApprovalGate.tsx:9-15` — its own duplicated inline spinner that does not reuse `LoadingSpinner`, wrapping the whole `(app)` layout via `layout.tsx:36`.

**The landing loader is confirmed landing-only.** It does not touch `(app)/` at any point.

## Finding 2 — The loader tracks real assets, not a timer

`src/components/landing/Personaje.tsx:30-35` issues `useGLTF` calls for roughly nine `.glb` files under `/models/ninja/` (`ninja.glb` plus eight animation clips). `MESH_DISPONIBLE = true` at `Personaje.tsx:12` confirms this path is live. `Dojo.tsx` loads no external assets.

So `useProgress()` reflects genuine GLTF download progress. Any redesign inherits a real, meaningful progress number — that is an asset, not a constraint.

## Finding 3 — Verified gaps

Each of these was confirmed by direct search, not inferred:

- **Dead state.** `src/components/landing/useLanding.ts` declares `loaded: boolean` (line 5), `setLoaded` (line 9), initializes `loaded: false` (line 16), and defines the setter (line 20). `setLoaded` is never called anywhere in `src/`. The field is unwired.
- **No accessibility affordances.** Zero occurrences of `aria-live`, `role="status"`, or `aria-busy` anywhere in `src/` outside curriculum content under `src/data/modules/`. The loader is invisible to screen readers.
- **No error or timeout path.** `Loader.tsx` destructures only `active` and `progress`, ignoring drei's `errors` array. If a `.glb` request hangs or 404s, the overlay persists indefinitely with no recovery and no message.
- **No route-level loading UI.** No `loading.tsx` file exists anywhere in `src/app/`, despite the pattern being taught in the curriculum.
- **Reduced-motion path is inconsistent.** `LandingEstatica.tsx` is the fallback for reduced-motion, mobile, and no-WebGL users, yet it has no loading state at all while still running framer-motion entrances and an unconditional `animate-pulse` (lines 13-14).
- **Preview route bypasses layer 1.** `src/app/landing-preview/page.tsx` imports `Landing3D` directly, skipping the `next/dynamic` fallback.

## Affected areas

- Landing loader chain: `Loader.tsx`, `Landing3D.tsx`, `LandingClient.tsx`, `Escena.tsx`, `Personaje.tsx`, `useLanding.ts`
- App spinner system (in scope only if unification is chosen): `src/components/ui/LoadingSpinner.tsx`, `src/components/auth/ApprovalGate.tsx`
- Supporting: `src/app/globals.css` (design tokens), `package.json` (framer-motion, drei versions)

## Approach options

No recommendation — that is the proposal phase's decision.

| # | Approach | Scope | Est. changed lines | Risk | What it buys |
| --- | --- | --- | --- | --- | --- |
| 1 | Restyle in place | `Loader.tsx` only | ~30-60 | Low | Visual refresh only; leaves every a11y and error gap open |
| 2 | Progress-driven redesign plus hardening | `Loader.tsx`, `useLanding.ts`, possibly `Landing3D.tsx` | ~80-150 | Medium — SSR/CSR seam, no test suite | Real accessibility (`aria-live`), an error/timeout path, exit transition via `AnimatePresence` |
| 3 | Suspense / `loading.tsx` adoption | New route file plus refactor | ~100-200 | Medium-High | Largely the wrong fit: the bottleneck is client-side WebGL asset loading, invisible to route-level Suspense |
| 4 | Unify landing and app loaders | Shared component plus 5+ call sites including `(app)`/`(teacher)` | ~150-250+ | Medium-High | Cross-app consistency, but pulls in the `interface-design` skill and risks breaching the 400-line review budget |

## Risks

- ~~**Dirty working tree.**~~ **RESOLVED — not a risk.** The session-start snapshot reported all 11 files under `src/components/landing/` as modified, and exploration inherited that claim. Direct verification afterwards showed the working tree is clean: `git status --porcelain -- src/components/landing/` returns nothing, `git diff --shortstat` is empty, `git diff --cached --shortstat` is empty, HEAD is unchanged at `fa9e07d`, and the stash is empty. The only untracked paths are `.atl/`, `.claude/`, `.gitattributes`, and `openspec/`. This change starts from a clean base; there is no scope-bleed risk.
- **No test suite.** Confirmed project-wide. Any new error or timeout logic is verifiable only by hand, plus `npm run lint` and `npm run build`.
- **Unconfirmed drei signature.** The claim that `useProgress` exposes an `errors` array rests on public API knowledge; the installed `.d.ts` under `node_modules` could not be located to confirm the exact version signature.
- **Skill injection.** `interface-design` was correctly not injected because the loader is landing-only and that skill excludes marketing/landing surfaces. If scope expands to option 4, it must be injected for later phases.

## Open product questions — must be answered before `sdd-propose`

1. Purely visual and motion work, or also close the accessibility gaps (`aria-live`, error/timeout path)?
2. Landing-only, or also unify with the `(app)` spinners (`LoadingSpinner`, `ApprovalGate`)?
3. Wire the dead `loaded`/`setLoaded` field, or remove it?
4. Does `/landing-preview` get the same treatment?
5. ~~What happens to the already-dirty `src/components/landing/` working tree?~~ **Moot** — the tree is verified clean, see Risks.
6. Is there a specific visual reference for "modern," or is that open for the proposal to suggest?

## Answers collected from the user (product question round)

These decisions are settled and bind the proposal:

1. **Intent — visual plus accessibility.** Redesign the loader visually AND close the confirmed gaps: an `aria-live` region announcing progress, an error/timeout path for a failed or hanging `.glb`, and a real exit transition. Not a paint-only job.
2. **Scope — landing only.** Work stays inside `src/components/landing/`. `LoadingSpinner.tsx` and `ApprovalGate.tsx` are explicitly out of scope; the two loading systems stay separate. `interface-design` therefore stays uninjected.
3. **Visual direction — proposal decides.** No external reference supplied. Derive the direction from existing design tokens (`neon-purple`, `neon-blue`, `editor-bg`, `editor-border`, `editor-muted`) and the ensō motif the current `Loader.tsx` comment already names.
4. **Working tree — clean, verified.** No pre-work commit needed.

Approach option 2 in the table above is the selected shape. Options 1, 3, and 4 are rejected: option 1 leaves the real defects open, option 3 targets the wrong bottleneck, option 4 exceeds the agreed scope.
