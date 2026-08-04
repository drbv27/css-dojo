# Design: Modern, accessible landing loader ("ensō gate")

Phase: `sdd-design` · Store: hybrid (Engram `sdd/loader-moderno-dojo/design`) · Depends on `proposal.md`.

## Technical Approach

`Loader.tsx` becomes a self-contained presentational state machine over drei's `useProgress` store, driven by `fase: "cargando" | "completo" | "error"` plus three orthogonal booleans (`lento`, `visible`, `reducido`). `Landing3D` stays the sole owner of the `modo` machine and injects one callback (`onOmitirEscena`) so the loader can hand a failed visitor to `LandingEstatica`. `loaded`/`setLoaded` are deleted from `useLanding.ts`.

**One finding forced an addition beyond the proposal's 3-file plan** (see Decision 2 and Risks): a 404 `.glb` tears the whole landing down before the loader can render an error state, so `Landing3D` needs an inline error boundary around `<Escena />`.

## Verified facts (read from `node_modules`, not assumed)

| Question | Verified answer | Evidence |
| --- | --- | --- |
| Does the installed `useProgress` expose `errors`? | **Yes.** `{ errors: string[]; active: boolean; progress: number; item: string; loaded: number; total: number }`, and it is a `zustand` bound store, so selector subscriptions work. | `@react-three/drei@10.7.7` — `core/Progress.d.ts:2-11` |
| How does `errors` behave? | Appended by `DefaultLoadingManager.onError`, **never cleared**, and the store is module-global — it survives loader unmount and leaks across navigations. | `core/Progress.js:21-23, 36-43` |
| Can the loader show an error state on its own? | **No.** `Canvas` catches R3F subtree errors in an internal boundary and re-throws them from the outer tree (`if (error) throw error;`). `useGLTF` rejecting on 404 therefore crashes `Landing3D`, not just `Escena`. | `@react-three/fiber/dist/react-three-fiber.esm.js:60, 103-112`; `events-b389eeca.esm.js:77-92` |
| Is `Loader` server-rendered anywhere? | **Yes.** `/` goes through `next/dynamic({ssr:false})`, but `/landing-preview/page.tsx:5` imports `Landing3D` directly, so it is prerendered. All `window` access must be effect-only. | `LandingClient.tsx:7-10` vs `landing-preview/page.tsx:5-9` |

## Architecture Decisions

### 1. Escape reaches `modo` through a prop callback, not the store

| Option | Tradeoff | Decision |
| --- | --- | --- |
| `onOmitirEscena: () => void` prop from `Landing3D` | `Landing3D` stays the single owner of `modo` (already local `useState`, lines 27-35); `Loader` stays presentational and store-free | **Chosen** |
| New `useLanding` field (e.g. `modoForzado`) | Recreates the exact defect we are deleting (`loaded`): a second source of truth for one decision, plus `Landing3D` would have to reconcile store state with its own `useState` | Rejected |

`/landing-preview` inherits automatically because it renders `Landing3D`, never `Loader`.

### 2. Inline error boundary around `<Escena />` in `Landing3D`

Required, not optional: without it the "renamed/404 `.glb` shows an error state" success criterion is unreachable (evidence above). A ~18-line class component (`LimiteEscena`) lives at the bottom of `Landing3D.tsx`.

| Option | Tradeoff | Decision |
| --- | --- | --- |
| Inline class in `Landing3D.tsx` | Keeps the diff at 3 files; the boundary has exactly one consumer | **Chosen** |
| New `LimiteEscena.tsx` file | Cleaner separation, but a 4th file for a single-consumer helper | Rejected (trivial follow-up extraction if a 2nd consumer appears) |
| `react-error-boundary` | New dependency — forbidden | Rejected |

On catch: `setEscenaFallo(true)` → `<Escena />` stops rendering and `Loader` receives `escenaFallo` → `fase = "error"`. The drop to static stays **explicit** (button), never automatic, per the settled decision.

### 3. Stall detection uses the effect dependency array as the "last advance" marker

"No progress advance" means precisely: **no re-render of `Loader` with a `progress` value different from the previous one**.

```ts
useEffect(() => {
  if (fase !== "cargando") return;
  setLento(false);                                   // an advance retracts the hint
  const t1 = setTimeout(() => setLento(true), 8_000);
  const t2 = setTimeout(() => setFase("error"), 20_000);
  return () => { clearTimeout(t1); clearTimeout(t2); };
}, [progress, fase]);
```

Both timers are re-armed on every genuine advance because `progress` is a dependency, so a slow-but-advancing load never fires either threshold. No `useRef` bookkeeping is needed — `Object.is` on the dep array already is the comparison. Both clocks are anchored to the **last advance**, not to mount.

*Rejected*: a `useRef(lastProgress)` + interval poll. Same semantics, more state, and it fires on wall-clock ticks rather than on real data events.

**Cold-start guard.** drei's store initialises `active: false`, so "not started yet" is indistinguishable from "done" on the first render. A mount effect seeds `huboActividad.current` and a 2.5 s `ARRANQUE_MS` timer resolves `fase = "completo"` if no activity was ever observed — otherwise a page with nothing to load would reach the 20 s error state. `huboActividad` is seeded in an **effect**, never in render, so SSR and the first client render agree.

### 4. Coarse announcements are derived, so no throttling is needed

```ts
const hito = fase === "cargando" ? Math.floor(Math.min(progress, 100) / 25) * 25 : null; // 0|25|50|75|100
const anuncio = useMemo(() => textoAnuncio(fase, hito, lento), [fase, hito, lento]);
```

The live region's text is a pure function of `(fase, hito, lento)`, so it mutates at most ~7 times per load regardless of how many `progress` ticks arrive. No timers, no debounce, no extra state.

**DOM split** (a deliberate refinement of settled decision 4, stated openly):

| Node | Role | Content |
| --- | --- | --- |
| `<svg aria-hidden>` | decorative | ring + track + gradient |
| `<div role="status" aria-live="polite" aria-busy={fase==="cargando"} class="sr-only">` | announced | coarse `anuncio` only |
| `<p aria-hidden class="font-mono text-sm text-editor-muted">` | visible caption | `Preparando el dojo… {Math.round(progress)} %` |

The visible caption still carries the meaning for sighted users; it is `aria-hidden` so the fine percentage never reaches the live region. *Rejected*: `role="progressbar"` + `aria-valuenow` — spams verbose screen readers on every tick and contradicts the settled `role="status"`.

Copy: `Preparando el dojo…` / `Preparando el dojo, 50 %` / `La conexión va lenta, seguimos cargando.` / `Dojo listo.` / `No pudimos cargar la escena 3D.` / button `Continuar sin la escena`.

### 5. Exit sequence: `visible` state + a one-way `terminado` latch

`Loader` must **never** early-return `null` — `AnimatePresence` needs the element to outlive its own exit. Shape:

```tsx
return <AnimatePresence>{visible && <motion.div … />}</AnimatePresence>;
```

Sequence on completion: `active → false` (with `huboActividad`) ⇒ `fase = "completo"` ⇒ 600 ms `HOLD_MS` beat (the closed ring reads as resolved and the canvas paints its first frames underneath) ⇒ `setVisible(false)` ⇒ ~450 ms opacity exit ⇒ unmount.

Two safeguards:
- `terminado` ref latches on completion. Today's `if (!active) return null` would **re-show** the whole overlay if any later asset touched `DefaultLoadingManager` (the store is global); the latch makes dismissal one-way.
- The overlay gets `pointer-events-none` during exit so the fading layer cannot swallow clicks on the revealed canvas.

Canvas-reveal race: the loader is a `Landing3D` sibling of `Escena`, never a parent, so its unmount cannot delay or remount the canvas. `HOLD_MS` biases the sequencing so the fade reveals a painted canvas rather than a blank one. Visual confirmation is QA step 1.

### 6. SSR/CSR safety

- No `window` / `matchMedia` / `document` / timer at module scope or in render. All of it lives in `useEffect`, which never runs on the server.
- Every `useState` initialiser is a literal (`"cargando"`, `false`, `true`) — never `useProgress.getState()` — so the server HTML and the first client render are identical: overlay visible, `fase = "cargando"`, `0 %`. No hydration mismatch on `/landing-preview`.
- `reducido` starts `false` (matching `debeUsar3D()`'s server return) and is corrected in the mount effect.

### 7. Reduced motion is re-evaluated, not sampled once

```ts
useEffect(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  setReducido(mq.matches);
  const onChange = (e: MediaQueryListEvent) => setReducido(e.matches);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);
```

`Landing3D.tsx:15` samples the query once at mount; the loader subscribes so a mid-load flip is honoured. When `reducido`: no pulse on the ring, `stroke-dashoffset` updated as a plain attribute instead of a spring, and the enter/exit fade collapses to `duration: 0` with no `scale`. The data-driven arc itself is information, not decoration, so it stays.

No new loading state is added to `LandingEstatica.tsx` (it loads no async assets).

## Data Flow

```
Personaje.tsx  useGLTF ×9 ──► three DefaultLoadingManager ──► drei useProgress (global zustand)
                                                                 │ active / progress / errors
                                                                 ▼
   Landing3D  ── escenaFallo ──────────────────────────────►  Loader
   (owns modo)                                                 │ fase · lento · visible · reducido
       ▲                                                       │
       │ onOmitirEscena() → setModo("estatica")  ◄─────────────┘ (button)
       │
   LimiteEscena.componentDidCatch → setEscenaFallo(true) → unmount <Escena />
```

## File Changes

| File | Action | Description |
| --- | --- | --- |
| `src/components/landing/Loader.tsx` | Modify | Full rewrite (~165 lines): SVG ensō ring, `role="status"` region, stall timers, error state + escape button, `AnimatePresence` exit, reduced-motion subscription |
| `src/components/landing/Landing3D.tsx` | Modify | `escenaFallo` state, `LimiteEscena` inline class, wire both props into `<Loader />` (~+28 lines) |
| `src/components/landing/useLanding.ts` | Modify | Delete `loaded` (line 5), `setLoaded` (line 9), init (line 16), setter (line 20) — 4 lines |

## Interfaces / Contracts

```ts
// Loader.tsx
type FaseLoader = "cargando" | "completo" | "error";

interface LoaderProps {
  /** true when Landing3D's boundary caught a throw from <Escena /> */
  escenaFallo?: boolean;
  /** Landing3D: () => setModo("estatica") */
  onOmitirEscena: () => void;
}

const HOLD_MS = 600, SALIDA_MS = 450, HINT_MS = 8_000, ESCAPE_MS = 20_000, ARRANQUE_MS = 2_500;
```

Ring geometry: `viewBox="0 0 96 96"`, `r=42`, `C = 2πr ≈ 263.89`, `strokeDasharray={C}`, `strokeDashoffset={C * (1 - pct/100)}`, group rotated `-90deg` to start at 12 o'clock. Track `stroke="var(--color-editor-border)"`; arc `stroke="url(#enso-grad)"` with a `<linearGradient>` from `var(--color-neon-blue)` to `var(--color-neon-purple)`; on `fase === "error"` the arc keeps its last offset and switches to `var(--color-neon-red)` (preserves "we got this far"). Tailwind v4 `@theme` tokens (`globals.css:3-27`) are emitted as `:root` custom properties, so `var(--color-…)` is valid inside SVG `stroke`/`stop-color`. **No new tokens, no new colours.**

Escape button reuses the existing landing button class from `NavLanding.tsx:35` verbatim: `px-4 py-2 rounded-lg border border-editor-border text-editor-text font-semibold text-sm hover:border-neon-blue/50 hover:text-neon-blue transition-all`. Focus moves to it via `ref` when `fase → "error"`, so keyboard users are not stranded behind a `z-50` full-screen overlay (`NavLanding` is only `z-30`).

## Testing Strategy

No test runner exists (`strict_tdd: false`). Automated gates: `npm run lint` and `npm run build` only. Everything else is the scripted manual procedure below.

| Layer | What | Approach |
| --- | --- | --- |
| Unit / Integration / E2E | — | N/A — no runner configured |
| Static | types, lint | `npm run build` (tsc via Next), `npm run lint` |
| Manual | all 9 steps below | scripted, reproducible |

### Manual QA procedure

Run every step against `http://localhost:3000/landing-preview` at a viewport ≥ 768 px in a WebGL-capable browser (`Loader` only mounts when `debeUsar3D()` is true).

1. **Happy path** — `npm run dev`, load the page. Expect: overlay on `#1E1E2E`; arc filling clockwise from 12 o'clock; caption `Preparando el dojo… N %`; ring closes; ~600 ms hold; fade; canvas visible. No blank frame between fade-out and first canvas paint.
2. **Determinate tracking** — DevTools → Network → custom throttle profile 400 kb/s → reload. Arc growth must match the caption monotonically, and the hint must **not** appear while the number keeps moving.
3. **8 s hint** — DevTools → Network → custom profile 20 kb/s → reload. After ~8 s with a frozen percentage, the `editor-muted` hint appears under the caption; no button yet. Bump the profile back to `No throttling`: the hint must disappear on the next advance.
4. **20 s escape (stall, no error)** — custom profile 1 kb/s → reload → wait ~20 s with no advance. Expect: ring turns `neon-red`, failure copy, `Continuar sin la escena` focused. Click it → `NavLanding` + `LandingEstatica` render, overlay gone, console clean.
5. **404 asset** — `mv public/models/ninja/ninja.glb public/models/ninja/ninja.glb.bak`, then hard-reload. Expect the boundary to catch the throw, the canvas to unmount, and the loader's `neon-red` error state with the escape action — **not** the Next.js error page and **not** an eternal overlay. Repeat under `npm run build && npm start`, because the dev overlay masks boundary behaviour. Restore the file.
6. **Reduced motion, post-mount flip** — load normally, then with the overlay on screen toggle DevTools → Rendering → *Emulate CSS `prefers-reduced-motion: reduce`*. Pulse stops immediately, arc still tracks progress, exit fade collapses. Separately confirm that starting with reduced motion enabled lands on `LandingEstatica` with no loader at all.
7. **Screen reader** — Orca or NVDA. Expect announcements at start, ~25/50/75/100, completion, and failure — and specifically **not** a stream of every percent. The `<svg>` must not be announced.
8. **Keyboard** — in the error state, Tab reaches the escape button with a visible focus ring; Enter activates it.
9. **Dismissal latch** — after a successful load, scroll the entire landing. The overlay must never reappear.

## ModuleSettings / static module data interaction (per `rules.design`)

**N/A — stated explicitly rather than invented.** The landing loader is public, pre-auth, and client-side. It reads no `ModuleSettings` document, never calls `GET /api/modules/enabled`, and touches no `ModuleData` under `src/data/modules/`. It has no dojo-track dimension (css/html/js/react): its only data source is `three`'s `DefaultLoadingManager` via drei. DB-driven module visibility is therefore unaffected in both directions.

## Threat Matrix

**N/A** — no routing, shell commands, subprocesses, VCS/PR automation, executable-file classification, or process integration. Three client components and one zustand store; no network calls authored by this change, no auth surface, no MongoDB model, no XP/gamification logic.

## Migration / Rollout

No migration required. No DB change, no env var, no config, no API contract, no new dependency. Rollback = `git revert <sha>` over three files under `src/components/landing/`; the current 21-line loader returns with zero cleanup.

## Open Questions

- [ ] The design adds an error boundary the proposal did not budget for, pushing the estimate to ~225 changed lines (still well under the 400-line review budget). Flagged in the return envelope; no scope decision is blocked by it.
- [ ] `useProgress().errors` is global and never cleared, so a soft-navigation return to `/` could show a stale error. Mitigation in scope: gate the error path on `escenaFallo || (errors.length > 0 && fase === "cargando")` so a stale array cannot resurrect a dismissed overlay (the `terminado` latch already blocks re-showing). No open decision.
