# Delta for css-track-content

Requirement 7 is `MODIFIED` — it gains three rows: two new modules and one
lesson added to a module that already shipped. Requirement 11 is `ADDED`.
Everything else in the capability binds this content unchanged: structural
grading, no `includes`, accented Spanish, unbiased quizzes, our own examples,
concepts over recipes.

**`mini-retos` needs no delta.** Its Requirement 10 is an invariant over `nivel`
— every **obligatorio** carries a challenge — and this change adds no new
obligatorio. The two new modules are `profundizacion`; their challenges belong to
the already-decided separate change covering all optional modules.
`imagenes-y-medios` was already obligatorio and already had its challenge.

## MODIFIED Requirement 7 — Per-module content and acceptance criteria

The table gains three rows. The nine existing rows are unchanged.

| Module | Section | Position | Must teach | Acceptance criteria |
|---|---|---|---|---|
| Accesibilidad visual | `css-visual` | 29, after `variables-css` | `outline` vs `border` and why the browser picked `outline`, `outline-offset`, `:focus` vs `:focus-visible`, contrast ratio with its 4.5:1 and 3:1 thresholds, colour as the sole carrier of meaning, `prefers-reduced-motion`, the `sr-only` recipe vs `display: none`, and minimum touch-target size | Content demonstrably covers all eight. The `:focus-visible` pair MUST be taught as the ANSWER to `outline: none` — the module's job is to satisfy the person who wanted the ring gone, not to scold them — and the ordering trap (`:focus` written after `:focus-visible` silently restores the bug) MUST be stated |
| Depurar con DevTools | `css-herramientas` | 31, first in section, before the preprocessors | Inspect and the Styles panel ordered by weight, `user agent stylesheet`, a selector that does not appear vs one that appears struck out, `element.style`, the box-model diagram, the Computed panel and inherited values, forcing states with `:hov`, and device mode for finding a real breakpoint | Content demonstrably covers all eight. The struck-out declaration MUST be taught as a **decision tree** — does the rule appear, does it appear struck out, does it appear unstruck and still invisible — because the module exists to replace "add `!important`" with a diagnosis |
| Imágenes y medios (**existing module, one lesson added**) | `css-visual` | 23, unchanged | Adds: `max-width: 100%` with `height: auto` as the fluid-image rule, **why `max-width` and not `width`**, and `aspect-ratio` on an `<iframe>` for responsive video | The `max-width` vs `width` distinction MUST be answered with the concrete consequence — `width: 100%` enlarges a small image past its real size and blurs it — not as a definition. The video case MUST state why `width: 100%` IS right there, so the two rules do not read as contradictory |

### Scenario 7.1 — Coverage is verifiable, not assumed

Unchanged, and it now binds eleven modules instead of nine.

- **Given** each module's lessons and exercises
- **When** its listed properties/functions are searched for in lesson content or `targetCSS`
- **Then** each MUST appear at least once, matching the "Must teach" column

## ADDED Requirement 11 — Adding a lesson to a shipped required module is a measured act

A lesson MAY be added to a module that already shipped, and it is often the right
call: `imagenes-y-medios` already owns the subject, so a competing module beside
it would split what a student searches for in one place. This is the same
judgement already applied to `dvh` inside `unidades-css`.

But when that module is **obligatorio**, adding EXERCISES to it raises the
required path for everyone not yet certified. That has happened before and was
measured: a content commit took the required CSS path from 166 to 168 exercises
and moved the bar under students who had a module finished.

Therefore:

- The change MUST report the new required-path count, not only the total.
- The change MUST state whether any certificate has been awarded. An awarded
  certificate is a frozen snapshot and is never affected; the exposure is only
  to students not yet certified.

### Scenario 11.1 — The required path is reported, not discovered later

- **Given** this change adds two exercises to `imagenes-y-medios`, which is `obligatorio`
- **When** the change is closed
- **Then** it MUST state that the required path went from **223 to 225** exercises
- **And** that no certificate has been awarded, so nothing is revoked

### Scenario 11.2 — A module is not duplicated when one already owns the subject

- **Given** a plan proposes a new module whose subject overlaps a shipped one
- **When** the overlap is measured before writing
- **Then** the genuinely new material MUST be added to the existing module rather
  than shipped as a competing one

This is not hypothetical. The plan's "Responsive de imágenes y video" was written
**before** `imagenes-y-medios` existed. Measured against the shipped track,
`object-fit` (36 occurrences), `object-position` (16) and `aspect-ratio` (43)
were already taught, and `srcset`/`<picture>` are covered by the HTML track.
Only the fluid-image rule and responsive video were genuinely missing — one
lesson, not a module.
