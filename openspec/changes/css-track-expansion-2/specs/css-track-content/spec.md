# Delta for css-track-content

Requirement 7 is `MODIFIED` -- it gains four rows. Requirements 9 and 10 are
`ADDED`. Everything else in the capability binds these four modules unchanged:
structural grading, no `includes`, accented Spanish, unbiased quizzes, our own
examples, concepts over recipes.

## MODIFIED Requirement 7 — Per-module content and acceptance criteria

The table gains four rows. The five existing rows are unchanged.

| Module | Section | Position | Must teach | Acceptance criteria |
|---|---|---|---|---|
| Overflow | `css-caja` | 7, after `dimensiones` | `visible`/`hidden`/`scroll`/`auto`, `overflow-x` and `-y` independently, an internal scrolling panel, **and that an `overflow` on an ancestor kills a descendant's `position: sticky`** | Content demonstrably covers the four values, both axes, and the sticky interaction. The sticky point MUST be taught as a debugging story -- the student sees a sticky that stopped working and finds the ancestor -- not as a footnote |
| Web typography | `css-texto` | 10, after `tipografias` | Font stacks and why a fallback is not optional, Google Fonts via `<link>` **and** `@import` with the difference between them, picking weights and what each one costs, `@font-face`, `font-display` and the flash of unstyled text | Content demonstrably covers all six. At least one lesson states the performance cost of loading weights in numbers, not as "it is slower" |
| Inheritance and global values | `css-selectores` | 17, after `especificidad` | What inherits and what does not, `inherit`, `initial`, `unset`, `revert`, `all: unset`, and why an `<a>` does not take its parent's colour | Content demonstrably covers the four keywords plus `all`. The `<a>` case MUST be answered as the concrete question the student already has, and the module MUST connect explicitly to `especificidad` as the other half of "how the browser decides" |
| Images and media | `css-visual` | 23, first in section | `object-fit`, `object-position`, `aspect-ratio`, filters on images, `clip-path`, and background image vs `<img>` with when each is right | Content demonstrably covers all six. At least one exercise starts from a **visibly deformed** image and fixes it with `object-fit`, because that is the bug the module exists for |

### Scenario 7.1 — Coverage is verifiable, not assumed

Unchanged, and it now binds nine modules instead of five.

- **Given** each module's lessons and exercises
- **When** its listed properties/functions are searched for in lesson content or `targetCSS`
- **Then** each MUST appear at least once, matching the "Must teach" column

## ADDED Requirement 9 — A new required module arrives fully classified

A CSS module MUST declare `nivel` in the same change that introduces it. Shipping
one without it is forbidden, not discouraged.

The certificate gate demands that **every** module of a track declare `nivel`, and
`css` is today the only track that certifies precisely because none is missing.
A single unclassified module silently takes the whole track out of certification
-- the student sees no error, the teacher sees no eligible student, and nothing
in the build objects.

The four modules of this change are **required** (`nivel: "obligatorio"`), by the
instructor's criterion of 2026-08-24: a module is required if the next track
assumes it, or a junior fails a real task without it, or it is a concept rather
than a catalogue, or it blocks another required module.

### Scenario 9.1 — An unclassified CSS module fails the build

- **Given** a CSS module with no `nivel`
- **When** the curriculum guards run
- **Then** they MUST fail and MUST name the module

### Scenario 9.2 — The required path grows by exactly what was added

- **Given** the certificate's minimum path before this change (187 exercises)
- **When** the four required modules and their challenges land
- **Then** the minimum path MUST equal the previous total plus the exercises of the four modules
- **AND** no previously required module's exercise count MUST change

## ADDED Requirement 10 — Every required module carries a challenge, as an invariant

Every CSS module marked `nivel: "obligatorio"` MUST carry exactly one integrating
challenge. This MUST be asserted **as a property of being required**, not as a
list of slugs.

`openspec/specs/mini-retos` already demands it, phrased with the literal count of
nineteen. The guard that was supposed to enforce it compares the set of modules
carrying a challenge against a **hardcoded registry** -- a roll-out ledger, useful
for recording a batch, useless for catching a required module that never got one.
A twentieth required module simply would not appear in either side of the
comparison, and the guard would stay green while the promoted spec was violated.

The ledger is kept: it still records which batch added what. What changes is that
the invariant is asserted separately, over `nivel`.

### Scenario 10.1 — A required module without a challenge fails the build

- **Given** a CSS module with `nivel: "obligatorio"` and no exercise marked as its challenge
- **When** the curriculum guards run
- **Then** they MUST fail and MUST name the module

### Scenario 10.2 — An optional module is not forced to have one

- **Given** a CSS module with `nivel: "profundizacion"` and no challenge
- **When** the curriculum guards run
- **Then** they MUST pass

The eleven optional modules deliberately carry none. Their challenges are their
own change.
