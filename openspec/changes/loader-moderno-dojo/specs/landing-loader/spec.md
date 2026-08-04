# Delta for landing-loader

## Purpose

Progress, accessibility, degradation, and exit behavior of the public landing's 3D asset-loading overlay (`src/components/landing/Loader.tsx`, mounted only in `Landing3D.tsx`'s `modo === "3d"` branch, inherited automatically by `/landing-preview`). `openspec/specs/` is empty, so this capability is entirely new — every requirement below is `ADDED`.

**Track relevance**: this capability belongs to the public landing, not to the css/html/js/react curriculum tracks. It is track-agnostic and is stated as such rather than forcing an association.

## ADDED Requirements

### Requirement: Determinate Progress Ring

The loader MUST render an SVG ring whose `stroke-dashoffset` is a direct function of `useProgress().progress` (0-100), stroked `neon-blue → neon-purple` over an `editor-border` track on `bg-editor-bg`, with an `editor-muted` mono caption. The loader MUST NOT show an indeterminate spin at any point, and MUST use existing design tokens only.

#### Scenario: Ring tracks real asset progress

- GIVEN the landing is in `modo === "3d"` while Personaje's `.glb` requests are in flight
- WHEN `useProgress().progress` advances from 0 to 100
- THEN the ring's `stroke-dashoffset` MUST track that value with no indeterminate spin

#### Scenario: No new tokens introduced

- GIVEN the rewritten `Loader.tsx`
- WHEN inspecting its color usage
- THEN only existing tokens (`neon-blue`, `neon-purple`, `editor-bg`, `editor-border`, `editor-muted`, `neon-red`) MUST appear

### Requirement: Accessible Status Announcements

The loader container MUST carry `role="status"`, `aria-live="polite"`, and `aria-busy="true"` while loading (`aria-busy="false"` once complete). The ring MUST be `aria-hidden="true"`; the caption is the only content assistive tech reads. The live region MUST update only at coarse milestones (0/25/50/75/100) and state transitions — never on every percent.

#### Scenario: Screen reader hears milestones, not every percent

- GIVEN a screen reader is attached and progress climbs in small increments
- WHEN progress crosses 25, 50, 75, and 100
- THEN the live region MUST update at each milestone and MUST NOT update between them

#### Scenario: Ring carries no accessible name

- GIVEN the rendered loader
- WHEN inspecting the SVG ring
- THEN it MUST have `aria-hidden="true"` and expose no independent accessible name

### Requirement: Stalled-Load Hint at 8 Seconds

If `progress` has not advanced for 8 continuous seconds while active, the loader MUST show a non-blocking `editor-muted` hint below the caption, without altering the ring or blocking interaction. The hint MUST clear automatically once progress resumes.

#### Scenario: Hint appears after 8s stall

- GIVEN the loader is active and progress stops advancing
- WHEN 8 seconds elapse with progress unchanged
- THEN an `editor-muted` hint MUST appear beneath the caption, non-blocking

#### Scenario: Hint clears on resume

- GIVEN the 8s hint is visible
- WHEN progress advances again
- THEN the hint MUST disappear

### Requirement: Failure Escape at 20 Seconds or on Load Error

The loader MUST enter an error state when EITHER 20 continuous seconds elapse with no progress advance OR a load error is detected for a requested `.glb` asset (via drei's error signal if available, otherwise the stall timer alone satisfies this requirement). In the error state the ring MUST turn `neon-red`, and the loader MUST show an explicit "Continuar sin la escena" action — with no retry action — that sets `Landing3D`'s `modo` to `"estatica"`.

#### Scenario: 20-second stall triggers escape

- GIVEN the loader is active and progress has not advanced since it stalled
- WHEN 20 seconds elapse with progress unchanged
- THEN the ring MUST turn `neon-red` and "Continuar sin la escena" MUST become actionable

#### Scenario: A 404 asset triggers escape without waiting 20s

- GIVEN one of the ~9 `.glb` files under `/models/ninja/` is renamed so the request 404s
- WHEN Personaje's GLTF load fails
- THEN the same `neon-red` error state MUST appear, offering "Continuar sin la escena" ahead of the 20s timer if an error signal is available

#### Scenario: Escape reaches the static landing

- GIVEN the error state is visible
- WHEN the user activates "Continuar sin la escena"
- THEN `Landing3D`'s `modo` MUST become `"estatica"` and the 3D loader/canvas MUST unmount in favor of `LandingEstatica`

### Requirement: Animated Exit on Completion

On reaching 100% with no error active, the loader MUST hold the completed ring for one beat, then exit via framer-motion's `AnimatePresence` — never a hard conditional unmount.

#### Scenario: Completion holds then dissolves

- GIVEN progress reaches 100 with no error active
- WHEN the completion beat elapses
- THEN the overlay MUST exit through an `AnimatePresence` transition, not vanish on the same render

### Requirement: Reduced-Motion Compliance

The loader MUST render a static ring arc with no pulse when `prefers-reduced-motion: reduce` is active, and MUST re-evaluate that media query reactively (a change listener), not only once at mount.

#### Scenario: Reduced motion at mount

- GIVEN `prefers-reduced-motion: reduce` is active when the loader mounts
- WHEN the ring renders
- THEN it MUST show a static arc with no pulse or transition

#### Scenario: Reduced motion flips mid-load

- GIVEN the loader is active with motion enabled
- WHEN the OS setting flips to reduce while progress is still advancing
- THEN the loader MUST switch to the static presentation without a full remount

### Requirement: Removal of Dead Loading State

`useLanding.ts` MUST NOT declare a `loaded` field, a `setLoaded` setter, or any caller of either. The loader's lifecycle MUST be driven solely by `useProgress()` and one error callback prop into `Landing3D` — not a second "ready" flag.

#### Scenario: Dead field is gone

- GIVEN the rewritten `useLanding.ts`
- WHEN searching `src/` for `loaded` or `setLoaded`
- THEN zero declarations and zero call sites MUST remain

### Requirement: Scope Boundary

This change MUST touch only `Loader.tsx`, `useLanding.ts`, and `Landing3D.tsx` under `src/components/landing/`. `src/components/ui/LoadingSpinner.tsx` and `src/components/auth/ApprovalGate.tsx` MUST remain unchanged, and no route-level `loading.tsx` MUST be introduced.

#### Scenario: Out-of-scope files untouched

- GIVEN the change is complete
- WHEN diffing against the pre-change commit
- THEN `LoadingSpinner.tsx` and `ApprovalGate.tsx` MUST show zero changes

#### Scenario: `/landing-preview` inherits automatically

- GIVEN `/landing-preview` imports `Landing3D` directly
- WHEN its `modo === "3d"` branch mounts
- THEN it MUST show the same redesigned loader with no separate implementation
