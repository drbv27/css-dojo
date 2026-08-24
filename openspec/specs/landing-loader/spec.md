# Spec: landing-loader

Capability: `landing-loader`

Governs the progress, accessibility, degradation, and exit behaviour of the
public landing's 3D asset-loading overlay -- `src/components/landing/Loader.tsx`,
mounted only in `Landing3D.tsx`'s `modo === "3d"` branch and inherited
automatically by `/landing-preview`. This capability belongs to the public
landing, not to the css/html/js/react curriculum tracks: it is
**track-agnostic**, and is stated as such rather than forced into an
association.

Established by change `loader-moderno-dojo`, archived 2026-08-24, which replaced
a 21-line indeterminate spinner with a determinate "ensō gate" ring, added an
error boundary around `<Escena />`, removed the dead `loaded` field from
`useLanding.ts`, and -- during its QA phase -- found and fixed two production
defects that made the overlay decorative rather than load-gated. Shipped as a
single PR from branch `fix/loader-espera-carga-real`.

Where a requirement below cites a count or a file list taken from that one
change, the durable constraint is stated first and the historical number follows
on a `History:` line. Every number promoted here was re-measured against the
repository on 2026-08-24 rather than copied from the delta spec.

### Requirement: Determinate Progress Ring

The loader MUST render an SVG ring whose `stroke-dashoffset` is a direct
function of `useProgress().progress` (0-100), stroked `neon-blue → neon-purple`
over an `editor-border` track on `bg-editor-bg`, with an `editor-muted` mono
caption. The loader MUST NOT show an indeterminate spin at any point, and MUST
use existing design tokens only.

#### Scenario: Ring tracks real asset progress

- GIVEN the landing is in `modo === "3d"` while Personaje's `.glb` requests are in flight
- WHEN `useProgress().progress` advances from 0 to 100
- THEN the ring's `stroke-dashoffset` MUST track that value with no indeterminate spin

#### Scenario: Ring and caption render from the same value

- GIVEN the overlay is visible mid-load at a percentage that is neither 0 nor 100
- WHEN the caption prints that percentage
- THEN the ring's `stroke-dashoffset` MUST equal `circumference × (1 − pct/100)` for that same percentage, so the two can never disagree

The percentage bound is load-bearing, not decoration: at 0 every plausible offset
formula agrees, so a check that only ever observes 0 cannot fail and proves
nothing.

Note: `progress` is NOT globally monotonic and MUST NOT be required to be. drei
derives it from the last completed batch — `saveLastTotalLoaded` is assigned
inside `onProgress` when `loaded === total` — so each new batch restarts the
percentage at 0. In this scene the mesh completes at 100 and the 8 animation
clips then begin from 0, because `PersonajeReal` suspends on the mesh before
requesting them.

#### Scenario: No new tokens introduced

- GIVEN `Loader.tsx`
- WHEN inspecting its colour usage
- THEN only existing tokens (`neon-blue`, `neon-purple`, `editor-bg`, `editor-border`, `editor-muted`, `neon-red`) MUST appear

### Requirement: Dismissal Gated on Real Load Completion

The overlay MUST remain visible until the asset load it reports on has actually
finished, and MUST NOT dismiss on a fixed elapsed time. A cold-start guard that
resolves the overlay when no loading activity is ever observed is permitted, but
it MUST NOT be reachable while a request is genuinely in flight -- which means
drei's `useProgress().active` MUST be true for the whole of such a load.

Because `DefaultLoadingManager.onStart` is installed as a side effect of drei's
`useProgress` store being created, any module-scope `useGLTF.preload(...)` MUST
run after that store exists. Otherwise the first `itemStart` is emitted into a
manager with no listener, and -- when the preloaded asset is the only top-level
item -- three never re-emits it while the request is pending.

#### Scenario: An asset that never arrives keeps the overlay up

- GIVEN a `.glb` request is held open indefinitely
- WHEN more time elapses than the cold-start guard's threshold
- THEN the overlay MUST still be visible and MUST still report the loading phase

#### Scenario: A slow asset delays dismissal rather than the timer deciding

- GIVEN a `.glb` is served later than the cold-start guard's threshold
- WHEN the overlay eventually dismisses
- THEN dismissal MUST happen after the asset arrived, not at the guard's threshold

History: the guard's threshold is `ARRANQUE_MS = 2500`. Before this requirement
existed, a module-scope preload in `Personaje.tsx` fired `itemStart` before
`Loader.tsx`'s import of `useProgress` created the store, so `active` stayed
false for every load and the overlay always dismissed on that 2.5 s guard.
Measured at the time: an asset that never arrived still dismissed the overlay at
4156 ms.

### Requirement: Accessible Status Announcements

The loader container MUST carry `role="status"`, `aria-live="polite"`, and
`aria-busy="true"` while loading (`aria-busy="false"` once complete). The ring
MUST be `aria-hidden="true"`; the caption is the only content assistive tech
reads. The live region MUST update only at coarse milestones (0/25/50/75/100)
and state transitions -- never on every percent.

#### Scenario: Screen reader hears milestones, not every percent

- GIVEN a screen reader is attached and progress climbs in small increments
- WHEN progress crosses 25, 50, 75, and 100
- THEN the live region MUST update at each milestone and MUST NOT update between them

#### Scenario: Ring carries no accessible name

- GIVEN the rendered loader
- WHEN inspecting the SVG ring
- THEN it MUST have `aria-hidden="true"` and expose no independent accessible name

### Requirement: Stalled-Load Hint at 8 Seconds

If `progress` has not advanced for 8 continuous seconds while active, the loader
MUST show a non-blocking `editor-muted` hint below the caption, without altering
the ring or blocking interaction. The hint MUST clear automatically once
progress resumes. The hint MUST NOT be present before that threshold: an
implementation that renders it from mount does not satisfy this requirement.

#### Scenario: Hint is absent before the threshold

- GIVEN the loader is active and progress has been frozen for less than 8 seconds
- WHEN the overlay is inspected
- THEN no hint MUST be present

#### Scenario: Hint appears after 8s stall

- GIVEN the loader is active and progress stops advancing
- WHEN 8 seconds elapse with progress unchanged
- THEN an `editor-muted` hint MUST appear beneath the caption, non-blocking

#### Scenario: Hint clears on resume

- GIVEN the 8s hint is visible
- WHEN progress advances again
- THEN the hint MUST disappear

### Requirement: Failure Escape at 20 Seconds or on Load Error

The loader MUST enter an error state when EITHER 20 continuous seconds elapse
with no progress advance OR a load error is detected for a requested `.glb`
asset. In the error state the ring MUST turn `neon-red`, the progress caption
MUST be hidden, and the loader MUST show an explicit "Continuar sin la escena"
action -- with no retry action -- that sets `Landing3D`'s `modo` to `"estatica"`.
The error state MUST NOT be reachable before the 20 s threshold in the absence
of an error signal.

A load error MUST surface even when it arrives after the manager's queue has
otherwise drained. A failed item ends that queue exactly as a successful one
does, so completion MUST NOT be allowed to win that race and latch the overlay
dismissed: an error known to the loader MUST suppress the completion path, not
the reverse.

#### Scenario: Error state is absent before the threshold

- GIVEN the loader is active and progress has been frozen for less than 20 seconds with no error signal
- WHEN the overlay is inspected
- THEN the ring MUST still be stroked with the normal gradient and no escape action MUST be present

#### Scenario: 20-second stall triggers escape

- GIVEN the loader is active and progress has not advanced since it stalled
- WHEN 20 seconds elapse with progress unchanged
- THEN the ring MUST turn `neon-red` and "Continuar sin la escena" MUST become actionable and focused

#### Scenario: A failed asset triggers escape without waiting 20s

- GIVEN a requested `.glb` under `/models/ninja/` responds 404
- WHEN Personaje's GLTF load fails
- THEN the same `neon-red` error state MUST appear ahead of the 20 s timer, the error boundary MUST absorb the throw, and the framework's runtime-error screen MUST NOT take over the page

#### Scenario: A late failure is not swallowed by dismissal

- GIVEN the load has been running long enough that the completion path could fire
- WHEN a `.glb` request then fails
- THEN the error state MUST still appear with its escape action, rather than the overlay dismissing and leaving the visitor on a bare nav with no scene

#### Scenario: Escape reaches the static landing

- GIVEN the error state is visible
- WHEN the user activates "Continuar sin la escena" by click or by `Enter` after reaching it with `Tab`
- THEN `Landing3D`'s `modo` MUST become `"estatica"` and the 3D loader/canvas MUST unmount in favour of `LandingEstatica`

History: `/models/ninja/` holds 9 `.glb` files, re-measured 2026-08-24. Only
`ninja.glb` is requested at first: `PersonajeReal` suspends on the mesh before
the 8 animation clips are reached, so a failure on the mesh alone exercises this
requirement. Once the mesh resolves, the manager reports 18 items in total.

### Requirement: Animated Exit on Completion

On reaching 100% with no error active, the loader MUST hold the completed ring
for one beat, then exit via framer-motion's `AnimatePresence` -- never a hard
conditional unmount. Dismissal MUST be one-way: once the overlay has exited it
MUST NOT reappear for the remainder of that page load.

#### Scenario: Completion holds then dissolves

- GIVEN progress reaches 100 with no error active
- WHEN the completion beat elapses
- THEN the overlay MUST exit through an `AnimatePresence` transition, not vanish on the same render

#### Scenario: The overlay does not come back

- GIVEN a successful load whose overlay has exited
- WHEN the visitor scrolls the whole landing
- THEN the overlay MUST NOT reappear at any scroll position

### Requirement: Reduced-Motion Compliance

The loader MUST render a static ring arc with no pulse when
`prefers-reduced-motion: reduce` is active, and MUST re-evaluate that media
query reactively (a change listener), not only once at mount. Suppressing
motion MUST NOT suppress the progress signal itself.

#### Scenario: Reduced motion at mount

- GIVEN `prefers-reduced-motion: reduce` is active before the landing mounts
- WHEN the render mode is decided
- THEN `Landing3D` MUST render `LandingEstatica` with no loader and no canvas at all

#### Scenario: Reduced motion flips mid-load

- GIVEN the loader is active with motion enabled
- WHEN the setting flips to reduce while progress is still advancing
- THEN the pulse MUST disappear without a full remount, and the overlay and its ring MUST keep tracking progress

### Requirement: Removal of Dead Loading State

The `useLanding` store MUST NOT expose a `loaded` field or a `setLoaded` setter,
and nothing MUST call either. The loader's lifecycle MUST be driven solely by
`useProgress()` plus one error callback prop into `Landing3D` -- not a second
"ready" flag.

#### Scenario: Dead field is gone

- GIVEN the `useLanding` store's state object
- WHEN its properties are inspected
- THEN it MUST have neither a `loaded` property nor a `setLoaded` property

History: `useLanding.ts` itself contains zero occurrences of the identifier.
A text search over `src/` does return hits, and the number depends entirely on
what you ask for -- which is why the command is written next to the count.
Re-measured 2026-08-24:

    rg -o -N '\b(loaded|setLoaded)\b' src/ --glob '*.ts' --glob '*.tsx' | wc -l
    -> 12   (9 x `loaded`, 3 x `setLoaded`, across 7 files)

All 12 are comment prose, drei's own `loaded` store field in a test fixture, an
unrelated prop, and the three references inside the test that asserts this very
requirement. Narrowing the pattern to `loaded` alone returns 9; counting files
instead of occurrences returns 7. None of the three numbers is wrong, and none of
them is the requirement -- which is exactly why this scenario is stated against
the store's properties rather than against a text search. A search cannot
falsify it.

### Requirement: Landing Loader Is the Landing's Only Loading Overlay

The public landing's loading overlay MUST remain this one component. The
authenticated app's spinners -- `src/components/ui/LoadingSpinner.tsx` and
`src/components/auth/ApprovalGate.tsx` -- MUST stay separate and MUST NOT be
folded into it, and no route-level `loading.tsx` MUST be introduced for the
landing. `/landing-preview` MUST inherit this loader by importing `Landing3D`
directly, with no separate implementation of its own.

#### Scenario: The app's spinners stay separate

- GIVEN a change to the landing loader
- WHEN `LoadingSpinner.tsx` and `ApprovalGate.tsx` are inspected
- THEN neither MUST have been merged into, or replaced by, the landing loader

#### Scenario: `/landing-preview` inherits automatically

- GIVEN `/landing-preview` imports `Landing3D` directly
- WHEN its `modo === "3d"` branch mounts
- THEN it MUST show the same loader with no separate implementation

History: the establishing change scoped itself to `Loader.tsx`,
`useLanding.ts` and `Landing3D.tsx` under `src/components/landing/`, and its
tasks.md carried that file list as a gate. That list was a boundary for that one
change and is deliberately NOT promoted as an invariant: the same change's QA
phase had to touch `Personaje.tsx` to fix the module-ordering defect recorded
under *Dismissal Gated on Real Load Completion*. Read as a standing rule, the
original list would forbid the fix that makes this capability work.
