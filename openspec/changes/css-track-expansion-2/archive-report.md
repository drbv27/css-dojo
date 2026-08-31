# Archive report: css-track-expansion-2

Archived **2026-08-31**, in place. The folder does not move: relocating it breaks
the bounded review, because the diff does not detect the rename.

## What shipped

The four content modules the CSS track owed from `plan-mejoras-css.md`, all four
**required**, each with four lessons, eight exercises and its integrating
challenge:

| Module | Position | Section |
|---|---|---|
| `overflow` | 7 | `css-caja` |
| `tipografia-web` | 10 | `css-texto` |
| `herencia-valores-globales` | 17 | `css-selectores` |
| `imagenes-y-medios` | 23 | `css-visual` |

Plus the renumbering the insertions forced: **24 existing modules** got a
one-line `order` edit.

## Measured at archive time

| | Before | After |
|---|---|---|
| CSS modules | 30 | **34** |
| Required | 19 | **23** |
| Certificate minimum path | 187 exercises | **223** |
| Curriculum | 808 exercises / 15 890 XP | **844 / 16 780** |
| Test suite | 376 | **376, all green** |

Scenario 9.2 verified explicitly: the nineteen pre-existing required modules
still sum **187 unchanged**. The +36 is exactly what the four added.

Requirement 7 coverage measured by searching each listed property in lessons and
`targetCSS`: **4 of 4 modules cover everything the spec demands.**

## Specs promoted

Three deltas, all against capabilities that already existed:

- **`css-track-content`** — Requirement 7 gained four rows; Requirements 9 and 10
  are new.
- **`css-track-sections`** — the literal `order` sequence redlined from 30 to 34.
- **`mini-retos`** — "each of the **19** required modules" became "**every**
  required module".

That last one is the point worth keeping. **A literal in a spec is a maintenance
obligation that only surfaces when it breaks.** "19" was true the day it was
written and stopped being true the moment a twentieth required module was
planned. And the guard that should have caught the drift compared against a
hardcoded registry of slugs, so it would not have noticed either: a new required
module simply would not appear on either side of the comparison.

Requirement 10 turns that into an invariant over `nivel`. It was written in the
**first** slice, deliberately red, naming all four -- and it stayed red until the
last slice paid it off. Written last, it would have been a guard authored against
a state already made correct by hand, which proves nothing.

## What the guards caught that the author did not

**The pedagogical order guard found a real defect in new content**:
`imagenes-y-medios/34-ej-07` used `transition`, taught **four modules later** at
position 27. Removed; the colour change is instant on purpose and the exercise
says so.

## Two false positives fixed, and the two real defects they were hiding

Both were guards **rejecting correct prose**, which does not protect spelling --
it pushes an author to write worse to silence them.

1. **`acentuacion`** matched `funcion` *inside* the correctly spelled `funcionó`.
   `\b` in JavaScript is ASCII, so there is a word boundary between a plain
   letter and an accented one. Fixed with a lookahead; two positive controls
   confirm it still catches real misspellings, including one immediately before
   an accented word.

2. **`signos-interrogacion`** did not count a `?` followed by `*`, so
   `**¿Pregunta?**` in markdown bold read as never opened.

Fixing the second **surfaced two genuine pre-existing defects**: an unopened
question in `media-queries`, and `**Por que?**` in `react-05-estado-usestate`
which had been balancing **by accident** against a ternary inside a code block.
Two errors cancelling each other out.

## A collision worth remembering

A class name in quotes inside a prompt collides with the accent guard: `'titulo'`
and `'boton-texto'` make it demand `título` and `botón`, which would break the
selector the student has to type. Written as `.titulo` and `.boton-texto`, which
the guard's own mask already exempts.

This is the same collision already recorded for the class materials. **Write the
selector, not the word.**

## Three things the design predicted wrong, redlined rather than quietly fixed

- **D9** — the design said only the invariant would be red. Five guards that
  *count* also broke: `nivel-curriculum` (30, and a 19-slug list),
  `calificador-curriculum` (808 exercises), `certificados` (19 required).
- **D10** — a skeleton with one lesson and one quiz pushed `tipos-ejercicio`'s
  ratchet on "modules with nothing to write" past its cap, which says never raise
  it. Each skeleton gained a `live-editor` instead.
- **D5** — `ModuleData.icon` is read by nothing but `/api/modules`. The silent
  failure the design worried about does not exist, and the browser check it
  promised was impossible.

## Verified by eye, not only green

Against a seeded QA database: the 34 modules render in their correct sections
with contiguous numbering, and `overflow`'s challenge opens with its four
numbered steps and its `0 de 4` counter. The QA `ModuleSettings` used for the
check were deleted afterwards.

## Left open on purpose

- **Fase 3 of the plan** — responsive images/video, visual accessibility,
  DevTools. Two of them need a `css-oficio` section that still does not exist,
  and creating it empty is the vacuity this system refuses elsewhere.
- **Challenges for the 11 optional modules** — decided they will happen, as their
  own change.
- **Belt rescaling.** Measured here and *not* absorbed: the curriculum went from
  15 890 to 16 780 XP, so Gran Maestro's fixed 11 000 fell from 69.2 % to
  **65.6 %** of what is available. Absolute thresholds cheapen themselves every
  time content lands. Its own change.
- **Enabling the four for any cohort** — the instructor's call. They ship blocked,
  and every cohort will see four new locked cards the day this deploys.
