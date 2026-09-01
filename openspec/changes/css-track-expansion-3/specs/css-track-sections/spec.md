# Delta for css-track-sections

Requirement 4 is `MODIFIED` — the literal `order` sequence goes from 34 to 36.
Requirement 7 is **exercised, not modified**: this is the first change written
under it, and it holds.

## The section count does not move

Requirement 7 says `css-oficio` is never created and Fase 3 lands in existing
sections. This change is that requirement being spent:

| Module | Section it landed in | Section size before → after |
|---|---|---|
| `accesibilidad-visual` | `css-visual` | 6 → 7 |
| `depurar-con-devtools` | `css-herramientas` | 4 → 5 |
| (the fluid-image lesson) | `css-visual`, inside `imagenes-y-medios` | unchanged |

**The track still has nine sections.** `secciones-sin-modulos.test.ts` stays
green without being touched, which is the outcome the requirement was written
for: the guard asserts the invariant, not the name, so a change that respects
the decision needs no exemption added to it.

**`css-responsive` stays at one module.** The plan would have given it a second
one; measuring showed that module was mostly redundant. Its one-module state is
noted, not fixed here — fixing it by shipping duplicate content would be worse
than leaving it.

## MODIFIED Requirement 4 — `order` renumbering invariant

The invariant is unchanged: `order` is what the student walks, it MUST equal the
module's position in the `ALL_MODULES` array, with no gaps and no repeats, and
sections MUST stay contiguous.

What changes is the literal tail of the CSS sequence, from 34 modules to 36:

| `order` | module | section |
|---|---|---|
| 28 | `variables-css` | `css-visual` |
| **29** | **`accesibilidad-visual`** | `css-visual` |
| 30 | `media-queries` | `css-responsive` |
| **31** | **`depurar-con-devtools`** | `css-herramientas` |
| 32 | `sass-fundamentos` | `css-herramientas` |
| 33 | `sass-avanzado` | `css-herramientas` |
| 34 | `bootstrap-5` | `css-herramientas` |
| 35 | `tailwind-css` | `css-herramientas` |
| 36 | `proyecto-cv-css` | `css-proyecto` |

Six modules shifted by two. `orden-curriculum-css.test.ts` pins this sequence
**by hand, deliberately** — deriving it from `order` or from the categories
would make it agree with whatever is there and stop being a check.

### Scenario 4.1 — DevTools is placed by its prerequisites, not by preference

- **Given** the module teaches the box-model diagram, forcing `:hover`, the
  struck-out declaration that shows specificity, and device mode
- **When** its position is chosen
- **Then** it MUST come after `box-model`, `pseudo-clases`, `especificidad` and
  `media-queries`, which puts it no earlier than 31
- **And** it MUST come **before** the preprocessor block, so it still serves the
  capstone rather than arriving after it

An earlier slot was considered and rejected: it would have required cutting half
the module's content, so "teach debugging early" was an illusion — the module's
own prerequisites push it to the end of native CSS regardless.

### Scenario 4.2 — The guards that count break by design

- **Given** the track goes from 34 to 36 modules and 844 to 862 exercises
- **When** the suite runs
- **Then** `nivel-curriculum`, `orden-curriculum-css` and
  `calificador-curriculum` MUST fail until their literals are updated in this
  same change

They are counted, hand-written literals on purpose. Breaking is their job.
