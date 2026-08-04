# Design: Automated Verification Gates

Phase: `sdd-design` · Store: hybrid (Engram `sdd/automated-gates/design`) · Depends on `proposal.md`, `exploration.md`, `state.yaml`.

## Technical Approach

Two stacked PRs to `main`, exactly as ratified. Slice 1 turns the lint gate on and makes it exit 0 by fixing 11 errors and downgrading one rule. Slice 2 adds two test tiers plus the CI workflow that finally *runs* the gates. No file is touched by both slices except `package.json` (scripts block) and `openspec/config.yaml`, which is why slice 2 branches off slice 1.

```
slice 1                         slice 2
eslint.config.mjs  ──┐          vitest.config.mts ──┐
package.json (lint,  ├─ gates   src/lib/xp.test.ts  ├─ tiers
  typecheck)         │          playwright.config.ts│
11 error fixes ──────┘          e2e/landing.spec.ts │
                                .github/workflows/ci.yml ← runs all four
```

The hooks fixes share one principle, taken from the rule's own diagnostic text: *an effect may write state from a callback of an external system, never synchronously in its body.* Verified in the installed plugin (`eslint-plugin-react-hooks/cjs/…production.js:50667-50789`): the validator scans only the effect function's own basic blocks, so `setState` inside `.then`, `setTimeout`, listeners and cleanup is legal, while any synchronous call — including inside `if`/`try` — is an error. Every fix below therefore either derives the value during render, moves the write to the event that causes it, or reads the browser through `useSyncExternalStore`.

## Architecture Decisions

### D1 — ESLint flat config shape

| Option | Tradeoff | Decision |
| --- | --- | --- |
| Documented snippet (`nextVitals` + `nextTs` + `globalIgnores`) plus a trailing `{ rules: { '@typescript-eslint/no-explicit-any': 'warn' } }` | One flat-config object with exactly one rule entry; flat merge overrides only that rule name, so no other severity moves | **Chosen** |
| Mapping over `nextTs` to rewrite its rules | Depends on the preset's internal array shape; breaks on upgrade | Rejected |
| `--max-warnings` / `reportUnusedDisableDirectives` tuning | Out of scope per proposal; warnings rise to ~56 by design | Rejected |
| `npx @next/codemod next-lint-to-eslint-cli .` | Generates the same file plus unreviewed edits; a 14-line hand-written config is more reviewable | Rejected |

Verified, not assumed:

- `eslint-config-next/typescript` = `typescript-eslint.configs.recommended` + two `warn` overrides + an `ignores` block for `.next/**`, `out/**`, `build/**`, `next-env.d.ts` (`node_modules/eslint-config-next/dist/typescript.js:33-51`). The explicit `globalIgnores([...])` from the docs therefore duplicates what the preset ships — kept anyway, because it is what the measured run used and it documents intent locally.
- `typescript-eslint/base` declares `plugins: { '@typescript-eslint': plugin }` with **no `files` key** (`@typescript-eslint/eslint-plugin/dist/configs/flat/base.js:8-17`), so the plugin is in scope for every linted file and the un-scoped override block cannot fail with "could not find plugin". A `files: ['**/*.ts','**/*.tsx']`-scoped variant is equivalent; the un-scoped form is the smaller diff.
- `configs.recommended` is **not** the type-checked preset: no `projectService`, no program construction. Lint is AST-only.

**Ignore set = exactly the measured set.** Slice 1 adds nothing to it. The 46→0 arithmetic is only true against the same file set that produced 46.

### D2 — No cache, no scoping; CI runs the plain script

`eslint .` over 243 files with an AST-only config is a single-digit-second job (no type information is built — see D1). A committed `--cache` would add `.eslintcache` to `.gitignore` and can serve stale results after a config change, which is precisely the failure mode a freshly repaired gate must not have. Script stays `eslint .`; CI runs `npm run lint` unscoped. Wall-clock time is **not measured** (this phase has no shell) — flagged in Risks.

### D3 — Vitest config

```ts
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: { environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}'] },
})
```

| Question | Decision | Rationale |
| --- | --- | --- |
| `vite-tsconfig-paths` needed? | **Yes, required** | `src/lib/xp.ts:1-2` imports `@/types` and `@/lib/constants`; the alias lives only in `tsconfig.json:25-29`, which Vite does not read on its own. |
| Setup file? | **No** | Nothing to register: the suite is four pure functions, no DOM matchers, no cleanup. A `vitest.setup.ts` + `@testing-library/jest-dom` is the loader change's first task, not this one's. |
| `include` narrowed to `src/**/*.test.*` | **Yes** | Vitest's default glob would also collect `e2e/landing.spec.ts` and run Playwright specs under jsdom. Narrowing is one line and needs no `exclude`. |
| `environment: 'jsdom'` for pure functions | **Yes** | Slightly slower than `node`, but it is the environment the loader's 13 jsdom tests need; setting it once means those tests need no per-file `// @vitest-environment`. |
| `.mts` extension | Keep | `package.json` has no `"type": "module"`; `.mts` is unambiguous and falls outside `tsconfig.json`'s `**/*.ts` include, so it is not typechecked (harmless). |

`tsc --noEmit` **will** typecheck `src/lib/xp.test.ts` and `e2e/landing.spec.ts` (both match `**/*.ts`). Test code is therefore gate-relevant code: it must compile under `strict`.

### D4 — `src/lib/xp.ts` test structure

Three `describe` blocks plus one for `calculateXP`; boundary rows as `it.each`. Expected values are written as **literals**, never recomputed from `RANKS` — a test that re-derives the table proves nothing. Boundaries come from `src/lib/constants.ts:7-24` (`0/150/400/…/11000`, rewards `1:10, 2:20, 3:30`).

| Function | Named cases |
| --- | --- |
| `getRank` | `0` → Cinturón Blanco · `149` → Blanco · `150` → Amarillo (exact boundary) · `11000` → Gran Maestro · `999_999` → Gran Maestro · `-1` → Blanco (documents the `RANKS[0]` seed; no throw) |
| `getNextRank` | `0` → Amarillo · `149` → Amarillo · `150` → Naranja · `10_999` → Gran Maestro · `11_000` → `null` (top rank) · `50_000` → `null` |
| `getXPProgress` | `0` → `{0,150,0}` · `75` → `{75,150,50}` · `149` → `{149,150,99}` (rounding down) · `150` → `{0,250,0}` (boundary resets) · `11_000` → `{0,0,100}` · `12_000` → `{1000,0,100}` — **records, does not fix**, that the top-rank branch returns `current > needed` |
| `calculateXP` | `(1,100)`→10 · `(2,100)`→20 · `(3,100)`→30 · `(3,50)`→15 · `(3,33)`→10 (`Math.round(9.9)`) · `(1,0)`→0 · `(1,1)`→**10** (the `score > 1` heuristic reads `1` as 100 %, not 1 %) · `(1,0.5)`→5 · `(1,150)`→10 (upper clamp) · `(1,-20)`→0 (lower clamp) · `(99,100)`→10 (`?? 10` fallback) |

Per the proposal's security callout: if a case disagrees with the code, the finding is recorded in the verify report; `xp.ts` is not edited in this change. The `(1,1)` and `12_000` rows exist specifically to pin ambiguous behaviour before anyone "cleans it up".

### D5 — Playwright scope

```ts
// playwright.config.ts
testDir: './e2e',
projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
retries: process.env.CI ? 1 : 0,
webServer: {
  command: process.env.CI ? 'npm start' : 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

| Question | Decision | Rationale |
| --- | --- | --- |
| Browsers | **chromium only** | Each extra project adds ~150 MB of binaries and a full CI run for zero information: "does the landing boot" is not browser-specific, and the only browser-sensitive surface (WebGL) is exercised by Chromium anyway. `Desktop Chrome`'s 1280×720 viewport is ≥ 768 px, so CI takes the 3D branch of `debeUsar3D()`. |
| Server | `npm start` in CI, `npm run dev` locally | CI already runs `npm run build` as an earlier step in the same job, so `.next` exists and the e2e step costs no second compile. Dev locally keeps the loop fast. |
| Env vars | **None needed** | `src/app/page.tsx:28` only reads the `dev-dojo-token` cookie — no DB, no Mongo, no Resend on `/`. Verified by file read. |
| Retries | 1 in CI, 0 locally | A single concession so one cold-start hiccup does not redden `main`; anything that needs a second retry is a real defect. |

**What the one test asserts.** `/` returns 200, no `pageerror` fires, and `NavLanding`'s brand text plus the `/login` link are visible. That last assertion is the load-bearing one: `NavLanding` renders in the `"3d"` and `"estatica"` branches of `Landing3D` but **not** in `"cargando"`, so seeing it proves hydration ran and the client-side mode decision resolved. It is deliberately WebGL-agnostic, so it stays green whether or not CI's Chromium exposes a WebGL context, and it stays green with today's 21-line `Loader.tsx`.

**Stated honestly:** this covers `landing-loader` scenario 4.2 **not at all, not now**. 4.2 needs an error state that does not exist until `loader-moderno-dojo` ships; its spec is authored in that change's apply, against this runner. What ships here is the runner plus a real regression net against "the landing crashes on load".

### D6 — GitHub Actions workflow

One job, `ubuntu-latest`, sequential steps, `permissions: contents: read`, triggers `push: [main]` and `pull_request`.

```
checkout → setup-node 22 (cache: npm) → npm ci
  → npm run typecheck   (~10 s, cheapest signal first)
  → npm run lint
  → npm run build       (produces .next for the e2e step)
  → npm run test:run
  → npx playwright install --with-deps chromium
  → npm run test:e2e
```

| Question | Decision | Rationale |
| --- | --- | --- |
| Node | `22.x` | Next 16 requires ≥ 20.9; 22 is the current LTS and matches Vercel's default. |
| Install | `npm ci` + `setup-node` npm cache | Lockfile is committed; `ci` is reproducible and cache-friendly. |
| Parallel jobs? | **No — one sequential job** | Every extra job repays `npm ci` (~40-60 s) and, for e2e, the browser download. Sequential is fewer total minutes and a linear log for a repo this size. |
| Playwright browsers in CI | Installed, chromium only, **after** the cheap gates | ~1-2 min and ~150 MB per run. Placed last so a lint or type error fails in under a minute. No browser caching for now (added only if run time becomes a complaint). |
| `concurrency` + `cancel-in-progress` | Included (3 lines) | Kills superseded PR runs; pure savings. |

### D7 — Slice boundary mechanics

| File | Slice | Note |
| --- | --- | --- |
| `eslint.config.mjs` | 1 | New, ~14 lines |
| `package.json` | 1 then 2 | S1: `lint` → `eslint .`, add `typecheck`. S2: add `test`, `test:run`, `test:e2e` + devDeps. Only shared file — the reason S2 branches off S1. |
| 9 source files (11 fixes) | 1 | See next section |
| `openspec/config.yaml` | 1 then 2 | S1: `testing.linter` / `type_checker` / drop the "do NOT rely on `npm run lint`" guideline. S2: `test_runner`, `unit`, `e2e`, `apply.test_command`, `verify.test_command`. Each slice leaves the file truthful at its own merge. |
| `vitest.config.mts`, `src/lib/xp.test.ts` | 2 | New |
| `playwright.config.ts`, `e2e/landing.spec.ts` | 2 | New |
| `.github/workflows/ci.yml` | 2 | New |
| `.gitignore` | 2 | `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/` (`/coverage` already present) |

**Slice 1 stands alone and mergeable:** `npm run lint` exits 0, `npm run typecheck` exits 0, `npm run build` exits 0, and it references no runner that does not exist yet. Nothing in slice 1 depends on slice 2. If slice 2 never ships, slice 1 is still a net improvement (a dead gate becomes a live one).

**Commit plan inside slice 1** — three commits so risk reverts independently:

1. `chore(lint)`: `eslint.config.mjs`, `package.json`, `openspec/config.yaml`, delete the dead `let result` line, delete the 2 unused `eslint-disable` comments. Zero runtime change.
2. `fix(hooks)`: the 5 low-risk components + the 2 memoization fixes.
3. `refactor(games)`: `GameEngine.tsx` alone — the one commit whose revert needs a compensating 1-line rule downgrade (see Rollback).

## The 11 fixes, grouped by root cause

### Group A — "close on route change" (`MobileMenu.tsx:76`, `MobileNav.tsx:73`)

**Root cause.** Both components own `isOpen` and then use an effect to reset it when `usePathname()` changes. That is React's canonical "reset state when a value changes" problem, whose documented answer is a `key`, not an effect.

**Fix.** Split each component in two: the exported function reads `usePathname()` and returns the existing body as `<…Cajon key={pathname} pathname={pathname} />`. The inner component keeps `useState(false)` and the body-overflow effect; the close effect is deleted. ~10 changed lines per file, no JSX re-indentation. `useAuth` is a pure `useContext` consumer (`src/hooks/useAuth.ts:37-39`), so remounting refetches nothing.

This is **stronger** than today: the reset now happens in the same commit as the navigation instead of one render later, and it covers navigations that bypass the in-drawer links (browser back/forward, programmatic redirects) which today's effect covered and a naive "just delete the effect" fix would lose.

**Human verification.** On a ≤ 1024 px viewport (or DevTools device mode): open the drawer, tap a nav item → drawer closes, route changes, `document.body.style.overflow` is empty (Elements panel). Open it again, press the browser **back** button → drawer closes and the page scrolls normally. Open it, tap the backdrop → closes. As teacher, confirm the "Profesor" section still lists the three teacher links. Repeat for both the app sidebar menu (`MobileMenu`) and the mobile nav (`MobileNav`).

### Group B — browser capability read at mount (`Landing3D.tsx:32`, `GameEngine.tsx:56`)

**Root cause.** Both read a client-only source (WebGL/`matchMedia`; `localStorage`) inside a mount effect and write the result to state. Both need a "not decided yet" first paint so hydration output matches the server. The React-19 answer is `useSyncExternalStore`, whose `getServerSnapshot` covers the hydration render and whose mount passive effect re-renders when the client snapshot differs — verified in the installed runtime at `react-dom/cjs/react-dom-client.development.js:8143-8159` (`updateStoreInstance` → `checkIfSnapshotChanged` → `forceStoreRerender`). The observable sequence is identical to today's effect flip, one render pass shorter.

**`Landing3D.tsx`** keeps `modo` as the single decision it owns, now derived:

```ts
// module scope — one probe per page load
const SIN_SUSCRIPCION = () => () => {};
let soporte: boolean | null = null;
const leerSoporte = () => (soporte ??= debeUsar3D());
const soporteServidor = () => null;

// component
const capaz3D = useSyncExternalStore(SIN_SUSCRIPCION, leerSoporte, soporteServidor);
const modo = capaz3D === false ? "estatica"
           : capaz3D === null ? "cargando" : "3d";
```

> **CORRECTED — this section originally shipped a speculative `omitirEscena` state.** The design as first written added `const [omitirEscena, setOmitirEscena] = useState(false)` with the setter never called, reserved for `loader-moderno-dojo`. The orchestrator REMOVED it during apply: it created an unreachable branch and was the only new lint warning in the very change meant to establish a clean gate. The shipped `Landing3D.tsx` has NO `omitirEscena` state. Verified: zero occurrences of `omitirEscena` anywhere in `src/`.

**Compatibility with `loader-moderno-dojo`** (its `design.md` Decision 1 and 2). That change adds `escenaFallo` state, an inline `LimiteEscena` class, and `onOmitirEscena: () => void` wired to "drop to the static landing".

After this fix, `Landing3D` is still the sole owner of the `modo` machine and `modo` still has the same three values. Two things changed for the downstream change, and it MUST account for both:

1. **There is no escape-hatch state to reuse.** `loader-moderno-dojo` must ADD its own — for example a `useState` whose setter the loader's `onOmitirEscena` prop calls — and fold it into the `modo` derivation, which is now a plain ternary over `capaz3D`. Do NOT expect a `setOmitirEscena` to exist; it does not.
2. **Line numbers shifted.** The loader design cites "lines 27-35", which this fix rewrote.

Slice 1 merges first; the loader's apply rebases onto it and re-reads the file. Called out so it is not discovered mid-apply.

**Human verification (`Landing3D`).** Desktop ≥ 768 px, WebGL on: load `/` → no flash of the static landing, then the 3D scene. DevTools → Rendering → *Emulate `prefers-reduced-motion: reduce`* → hard reload → static landing. Resize to < 768 px → hard reload → static landing. `chrome://settings` WebGL disabled (or `--disable-gpu`) → static landing. Load `/landing-preview` (prerendered, no `ssr:false` wrapper) and confirm the console shows **no hydration mismatch**. Known behaviour delta: the probe is cached per page load, so crossing the 767 px breakpoint and then client-navigating back to `/` keeps the earlier decision until a full reload; today it re-probes per mount.

**`GameEngine.tsx:56`** replaces the localStorage effect with lazy initializers plus a hydration gate:

```ts
const hidratado = useSyncExternalStore(SIN_SUSCRIPCION, SI_CLIENTE, NO_SERVIDOR); // () => true / () => false
const [completedLevels, setCompletedLevels] = useState(() => leerCompletados(gameSlug));
const [currentLevel, setCurrentLevel]       = useState(() => nivelDeArranque(levels, leerCompletados(gameSlug)));
const [css, setCss] = useState(() => levels[nivelDeArranque(levels, leerCompletados(gameSlug))]?.initialCSS ?? "");
…
if (!hidratado) return null;   // replaces `if (!initialized) return null`
```

`leerCompletados` is a module-scope helper guarded by `typeof window === "undefined"` and wrapped in the same `try/catch` as today; `nivelDeArranque` reproduces today's `idx > 0 ? idx : 0` guard exactly (`findIndex` returning `-1` or `0` both mean "start at level 0"). The initializers run once, only on the very first render, and reading storage three times there costs microseconds. The `initialized` state is deleted.

### Group C — derived state and persistence in effects (`GameEngine.tsx:93`, `:107`)

**Root cause (shared with :56).** All four of this component's state writes happen at commit time rather than in response to an event, so `solved` is recomputed into state and `completedLevels` is written from a persistence effect.

**Fix.**

- `:93` — `solved` becomes derived: `const solved = useMemo(() => !!level && validateCSS(css, level), [css, level, validateCSS])`. The `solved` state, and the `setSolved` calls in `goToLevel`/`resetLevel`, disappear; resetting `css` now recomputes `solved` as `false` for free. The 1800 ms overlay stays an effect but only *arms a timer* (`setShowSuccess` already lives inside the `setTimeout` callback, which the rule permits) and now clears it on unmount — today's version leaks a pending timer when the level changes mid-delay.
- `:107` — the completion side effect moves to the event that causes it. A `manejarCss(texto)` handler replaces the inline `onChange`: it calls `setCss(texto)` and, when `!solved && validateCSS(texto, level)`, calls one `registrarNivelCompletado(level)` that writes `completedLevels`, writes `localStorage`, and fires the same two `/api/progress` POSTs with the same bodies. Effect 3 and `successSavedRef` are deleted; single-fire is now guaranteed by the event path plus a `completedLevels.has(level.id)` guard instead of a ref.

**Residual behaviour gap, stated rather than hidden.** With completion recorded from the change handler, a level whose `initialCSS` already satisfies its own `validateFn` would render as solved (derived) but never be recorded. Apply MUST verify by inspection that no level in `src/data/games/flexbox-levels.ts` or `grid-levels.ts` has that property; if one does, the fix is a `?? ` guard in `goToLevel`, not a return to effect-driven persistence.

**Human verification (GameEngine — the highest-risk fix; verify both `/juegos/flexbox` and `/juegos/grid`).**
1. Fresh profile: `localStorage.clear()`, load the game → level 1, editor empty, progress 0 %.
2. Type the solution → board animates, input disables, solution line appears, and the success overlay appears **~1.8 s later** (not instantly).
3. Network tab: exactly **one** `POST /api/progress` per level, body `score: 100`, `difficulty: 1`; sidebar XP increases after `refreshUser`.
4. Progress bar and stepper checkmark update **immediately** on completion, not after the POST resolves.
5. "Ver solución" hides the overlay and leaves the level solved; "Siguiente nivel" advances and re-enables the input.
6. Reload → resumes at the first uncompleted level with that level's `initialCSS`; `localStorage[<slug>-completed]` matches the stepper.
7. "Reiniciar" restores `initialCSS`, clears the solved state, and the level can be re-solved without a duplicate POST.
8. Complete the final level → the bonus `POST /api/progress` with `exerciseId: <slug>-bonus` fires exactly **once**.
9. Solve a level and navigate away during the 1.8 s window → no console warning, no overlay on the next page.

### Group D — action initiated from an effect (`nueva-contrasena/page.tsx:29`) — security-adjacent

**Root cause.** The OTP auto-submit lives in an effect keyed on `[otp, verifying, resetToken, email]` and opens with a synchronous `setVerifying(true)` / `setError("")`. Verification is a response to a keystroke or a paste, not to a render.

**Fix.** Delete the effect. Add `verificarOtp(code: string)`, an async function containing the identical `fetch("/api/auth/verify-otp")` call, the identical success/failure branches (`setResetToken`, or `setError` + clear the six boxes + refocus box 0), and the same `finally { setVerifying(false) }`. Call it from `handleOtpChange` when the newly computed `newOtp.join("")` reaches 6 characters and from `handleOtpPaste` when 6 digits are pasted. The credential path is untouched: no change to `/api/auth/verify-otp`, `/api/auth/reset-password`, `src/lib/auth.ts`, token handling, or cookies.

**One deliberate behaviour change — a latent defect removed.** Today, a network failure takes the `.catch` branch, which sets an error but does **not** clear `otp`; `.finally` then flips `verifying` to false, the effect's dependencies change, the guard passes again, and it refetches — an unbounded retry loop against the OTP endpoint while the connection is down. Event-driven verification attempts exactly once per user action. The user now edits a digit to retry. This must be recorded in the PR body, not slipped in.

**Human verification — full password-reset flow, mandatory before slice 1 merges.** Requires `MONGODB_URI` plus either a real `RESEND_API_KEY` and mailbox, or a temporary local `console.log` of the OTP (see the QA note below).
1. `/recuperar` → submit a registered email → success message.
2. `/nueva-contrasena?email=…` renders six boxes with box 1 focused.
3. Type a **wrong** 6-digit code → one `POST /api/auth/verify-otp` → "Codigo incorrecto", boxes cleared, focus back on box 1.
4. DevTools → Network → **Offline** → type any 6 digits → **exactly one** failed request and "Error de conexion". Watch for 10 s: **no request storm** (this is the fixed loop). Go back online, edit a digit → one new request.
5. Paste the correct 6-digit code → "Verificando…" → the new-password form.
6. Mismatched passwords → "Las contrasenas no coinciden"; a 5-character password → the minimum-length message; neither issues a request.
7. Valid matching password → "Contrasena actualizada" → redirect to `/login` after ~2 s.
8. Log in with the **new** password → dashboard. Log in with the old one → rejected.

> QA note: the OTP is bcrypt-hashed before storage (`api/auth/forgot-password/route.ts:25-29`), so it cannot be read from MongoDB. Without a Resend key, add a temporary `console.log("[QA] otp", otp)` after line 24, run the flow, then `git checkout src/app/api/auth/forgot-password/route.ts` and confirm with `git status` that it is not staged. Never commit OTP logging.

### Group E — fetch effect writing its own loading flag (`leaderboard/page.tsx:102`)

**Root cause.** `setLoading(true)` at the top of the fetch effect. `loading` is not independent state; it means "the data I hold is not for the filter I am showing".

**Fix.** Replace `entries` + `loading` with one `datos: { filtro, entries } | null`; derive `const loading = datos?.filtro !== activeFilter`. The effect keeps its `fetch` and writes only inside `.then`/`.catch`, guarded by a `cancelado` flag in the cleanup — which also removes a real race where a slow response for "general" could overwrite the rows of a filter the user has since switched to.

Minor behaviour difference to confirm during QA: on a **failed** refetch, today's code leaves the previous filter's rows on screen with `loading: false`; the new code shows the empty state for the requested filter. Showing another dojo's rows under the wrong label is the worse of the two.

**Human verification.** `/leaderboard`: initial load shows the skeleton, then rows. Click each dojo filter (css/html/js/react/general) → skeleton on every switch → correct rows, and the header meta matches the active filter. Open the ranks modal → the ten belts with their XP ranges. Go **Offline** and switch filters → empty state, no stale rows, no infinite skeleton. Rapidly click three filters in a row → the rows that settle belong to the **last** one clicked.

### Group F — incomplete manual memoization (2 errors)

| Site | Root cause | Fix |
| --- | --- | --- |
| `.../ejercicio/[exerciseId]/page.tsx:49` | The `useCallback` reads `exercise?.type` and `exercise?.difficulty` but declares `[slug, exerciseId, refreshUser]`, so the compiler cannot preserve the memo | Hoist `const tipo = exercise?.type; const dificultad = exercise?.difficulty;` above the callback, use those inside, and add both **primitives** to the dep array. Primitives keep the memo stable even if `exercise`'s identity ever churns. |
| `src/components/landing/Personaje.tsx:49` | The material `useMemo` closes over the reactive `color` while declaring `[]` — deliberate (the comment says "el color se actualiza abajo"), but unpreservable | Remove the reactive capture: seed `emissive` from a module constant `COLOR_INICIAL = SECCIONES[0]?.color ?? "#94E2D5"` so `[]` is genuinely correct. The existing effect at `:72-74` (`material.emissive.set(color)`) keeps owning every subsequent colour, including the first. |

`Personaje` mounts with `activeSection = 0`, so `SECCIONES[0].color` is the same value the old closure captured on the first render: the seeded material is byte-identical to today's, and no frame can render a different emissive colour. The `exhaustive-deps` **warning** at `Personaje.tsx:57` is deliberately left alone. Neither fix changes a dependency array in a way that adds or removes a render-time computation.

**Human verification.** Landing `/` on desktop with WebGL: the ninja appears with the same teal emissive glow as before; scroll through all sections and confirm the glow re-tints per section, and that the animation clips still play (idle → per-section clips). For the exercise page: open any module exercise, complete it → XP toast, sidebar XP updates, an achievement toast when one unlocks; then use "Siguiente ejercicio" and complete a **second** one without reloading, confirming the callback picked up the new exercise's `type`/`difficulty` in the POST body (Network tab).

### Group G — dead `let` (`CodeBlock.tsx:100`)

`let result = escapeHtml(code);` is never read again in `highlightCSS` — the function returns `built` (`:126`). `escapeHtml` is a pure chain of `String.replace` calls. **Delete the line** rather than converting it to `const`: that clears the `prefer-const` error and one `no-unused-vars` warning at once, with provably no runtime effect.

**Human verification.** Open a lesson that renders CSS, HTML and JS code blocks (any module in `/modulos`) and confirm highlighting is unchanged: selectors, properties, values, numbers-with-units, comments, and HTML tags/attributes all keep their colours.

## Data Flow

```
developer / CI
   │
   ├─ npm run typecheck ─→ tsc --noEmit (strict) ─→ src/**, e2e/**, *.test.ts
   ├─ npm run lint ──────→ eslint . ──→ eslint.config.mjs
   │                                     ├─ eslint-config-next/core-web-vitals
   │                                     ├─ eslint-config-next/typescript (tseslint recommended)
   │                                     └─ { '@typescript-eslint/no-explicit-any': 'warn' }
   ├─ npm run build ─────→ next build
   ├─ npm run test:run ──→ vitest (jsdom) ─→ src/lib/xp.test.ts
   └─ npm run test:e2e ──→ playwright ─→ webServer(npm start) ─→ GET / ─→ e2e/landing.spec.ts
                                                  ▲
   .github/workflows/ci.yml ───────────────────────┘  (push to main + every PR)
```

Errors block (exit ≠ 0); warnings never do. That asymmetry is the whole enforcement contract.

## Interfaces / Contracts

```json
"lint": "eslint .", "typecheck": "tsc --noEmit",
"test": "vitest", "test:run": "vitest run", "test:e2e": "playwright test"
```

Slice 2 devDependencies (latest published, unpinned; `@testing-library/react` **must** resolve to the v16 line for React 19): `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`, `@playwright/test`.

## Testing Strategy

| Layer | What | Approach |
| --- | --- | --- |
| Static | 243 files, errors only | `npm run lint` (slice 1) + `npm run typecheck` (slice 1) |
| Build | route manifest compiles | `npm run build`, no env vars required (verified) |
| Unit | `getRank`, `getNextRank`, `getXPProgress`, `calculateXP` | Vitest + jsdom, ~25 literal-expectation cases (D4) |
| Component | none yet | Harness installed so `loader-moderno-dojo` writes 13 tests, not config. **Vitest cannot test async Server Components** (official Next.js guidance) — every future component test must target a `'use client'` or synchronous component; async pages stay E2E-only. |
| E2E | landing boots, hydrates, resolves its mode | Playwright, chromium only, one spec |
| Manual | the 11 fixes | The scripted procedures in Groups A-G. Slice 1 has **no** automated behavioural net; this is the whole safety net. |

## ModuleSettings / static module data (per `rules.design`)

Mostly N/A, but not entirely — stated precisely instead of waved away. No `ModuleSettings` document, `GET /api/modules/enabled` response, `ALL_MODULES` entry, `ModuleData` shape, or dojo-track filter changes in either slice. One touched file *is* a visibility consumer: `.../ejercicio/[exerciseId]/page.tsx` fetches `/api/modules/enabled` and gates on `moduleDisabled`/`isTeacher`. That effect is already legal (its `setState` calls sit inside `.then`) and is **not** modified — only `handleComplete`'s memoization is. Teacher-toggled visibility therefore behaves identically before and after, and the `xp-progression` tests read `RANKS`/`XP_REWARDS` from `src/lib/constants.ts`, never from the DB.

## Threat Matrix

The change adds process integration (a CI workflow, and Playwright spawning `npm start`), so the matrix is recorded rather than skipped. No row is applicable.

| Boundary | Applicability | Reason |
| --- | --- | --- |
| Documentation-like paths | **N/A** | No file is classified or executed by content. ESLint selects files by extension via flat config; nothing runs `README.sh` or executable Markdown. |
| Git repository selection | **N/A** | No authored code runs `git`. The workflow uses `actions/checkout` at the event's own SHA; no `-C`, no path composition. |
| Commit state | **N/A** | Nothing in the change stages, commits, or inspects the index. CI is read-only (`permissions: contents: read`). |
| Push state | **N/A** | Nothing pushes. No refspec, no tracking-branch logic, no release step. |
| PR commands | **N/A** | No `gh`, no PR automation, no composed shell arguments. The workflow runs fixed npm scripts with no interpolated input. |

Process-integration safe behaviour that *is* in scope: the workflow declares least-privilege `permissions: contents: read`, consumes no secrets (no gate needs `MONGODB_URI`, `JWT_SECRET`, or `RESEND_API_KEY` — verified: `/` reads only a cookie), and interpolates nothing from the event payload into a shell command. Playwright's `webServer` spawns `npm start` on localhost only and is torn down by the runner.

## Migration / Rollout

No migration, no data, no schema, no env var, no feature flag. Rollout is two merges.

| Scenario | Action |
| --- | --- |
| Slice 2 misbehaves | `git revert` the merge. Purely additive: config, tests, workflow, devDeps. Zero production code. |
| A Group A-F fix regresses | Revert commit 2 of slice 1. The gate, the config and `typecheck` survive; `react-hooks/set-state-in-effect` must then be set to `'warn'` (one line) so `main` stays green while the fix is redone. |
| `GameEngine` regresses | Revert commit 3 only, plus the same 1-line downgrade. The other five components keep their fixes. |
| The gate config itself is wrong | Revert commit 1. `npm run lint` returns to today's broken state — no worse than now; `build` is unaffected throughout. |

## Open Questions

- [ ] Lint wall-clock time on 243 files is unmeasured (no shell in this phase). If `npm run lint` turns out slow enough to annoy, the answer is `--cache` in a local alias, not in the committed script.
- [ ] Dependency **resolution** for the seven slice-2 devDeps is unverified (no install permitted here). `@testing-library/react` must land on v16.x; `@vitejs/plugin-react` must match the Vite major that the installed Vitest brings.
- [ ] `npx playwright install --with-deps chromium` needs network and has never run in this environment. Per the proposal's mitigation: verify it early in slice 2; if it fails, slice 2 ships the Vitest tier plus the workflow and Playwright becomes its own slice.
