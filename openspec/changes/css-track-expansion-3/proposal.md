# Proposal: `css-track-expansion-3`

## Why

`plan-mejoras-css.md` calls these three modules "Fase 3 — our differentiator".
They are the last content batch the plan has left. Fase 1 shipped five modules
(`css-track-expansion`), Fase 2 shipped four (`css-track-expansion-2`), and this
is the third and final batch.

It is named for what it delivers and for its predecessor, never for a phase
number — the same reason the previous one is `css-track-expansion-2` and not
"fase 2". See the naming trap in `css-track-expansion-2/state.yaml`.

## What ships

Three modules, each at the bar the last two batches set: **4 lessons, 8 exercises
plus one integration challenge (9 total), ~220 XP.**

| # | Module | Slug | Section | `order` |
|---|---|---|---|---|
| 1 | Accesibilidad visual | `accesibilidad-visual` | `css-visual` | 29 |
| 2 | Responsive de imagenes y video | `responsive-imagenes-video` | `css-responsive` | 31 |
| 3 | Depurar con DevTools | `depurar-con-devtools` | `css-herramientas` | 32 |

**No new section is created.** `css-oficio`, which the plan assigned to two of
these, is never created — instructor decision 2026-08-31, written as Requirement
7 of `openspec/specs/css-track-sections` and enforced by
`secciones-sin-modulos.test.ts`.

### The resulting order

The track's sections are contiguous by `order`, and
`orden-curriculum-css.test.ts` pins the sequence by hand, so inserting anywhere
renumbers everything after. The tail becomes:

| `order` | module | section |
|---|---|---|
| 28 | variables-css | `css-visual` |
| **29** | **accesibilidad-visual** | `css-visual` |
| 30 | media-queries | `css-responsive` |
| **31** | **responsive-imagenes-video** | `css-responsive` |
| **32** | **depurar-con-devtools** | `css-herramientas` |
| 33-36 | sass-fundamentos, sass-avanzado, bootstrap-5, tailwind-css | `css-herramientas` |
| 37 | proyecto-cv-css | `css-proyecto` |

**Why DevTools is at 32 and not earlier.** Its content depends on modules taught
late: the box-model diagram (4), forcing `:hover`/`:focus` (13), the struck-out
declaration that teaches specificity (16), and device mode (media queries, 30).
Placing it early would mean cutting half the module. 32 is the first position
where every prerequisite is taught — right after native CSS ends and **before**
the framework block, so it still serves the capstone.

**Why `css-responsive` gains the images module.** It holds one module today
(`media-queries`). A section with one card is a heading, not a grouping; this
takes it to two.

## Classification: all three OBLIGATORIO

Applied against the criterion fixed on 2026-08-24 (obligatorio if it meets at
least one of: the next track assumes it; without it a junior fails real work; it
is a concept rather than a catalogue; it blocks another obligatorio).

| Module | Criterion met | Reading |
|---|---|---|
| Accesibilidad visual | 2, 3 | Deleting the focus outline is a real review-blocking defect, not an exam question. Contrast and motion preferences are concepts, not lookups |
| Responsive de imagenes y video | 1, 2 | An image that overflows on a phone is a failed task. The React track assumes fluid media |
| Depurar con DevTools | 2, 3 | "The style is not applying" is THE junior blocker — the same reason `especificidad` is obligatorio. It is a skill, not a catalogue |

**This is the cost, stated plainly:** the required path goes from **223 to ~250
exercises**, and required modules from 23 to 26. That is a real increase in what
a certificate demands. Classifying any of the three as `profundizacion` instead
is a live option and costs nothing structurally — the decision is the
instructor's.

**Not classifying them is not an option.** The certificate gate requires that
EVERY module of a track declare `nivel`; one module without it silently leaves
the whole track uncertifiable, with no error anywhere. They are classified in
THIS change.

## Consequences that must be handled in this change

1. **`order` renumbering.** Modules 29-34 shift. `orden-curriculum-css.test.ts`
   pins the sequence by hand and asserts `order` equals array position with no
   gaps; both move together.
2. **Guards that count.** `nivel-curriculum`, `calificador-curriculum` and
   `certificados` carry module and exercise counts that this change breaks by
   design.
3. **One integration challenge per module.** Invariant, not a slug list — every
   obligatorio carries one (`mini-retos` Requirement 10). Three new obligatorios
   means three new challenges, in this change.
4. **Belts get cheaper, again.** Gran Maestro asks 11000 XP of a curriculum that
   was 16780 (65.6%) and becomes ~17440 (**63.1%**). It was 74.6% before the
   challenges and 69.2% before Fase 2. **The thresholds are absolute, so every
   content batch discounts them silently.** This change does NOT rescale them —
   that is its own pending work — but it MUST report the new number so the drift
   stays visible instead of being discovered later.

## Out of scope

- Rescaling `RANKS` in `src/lib/constants.ts`. Named above, deliberately not done
  here: rescaling belts is a decision about every existing student's rank, not a
  side effect of adding content.
- Integration challenges for the 11 `profundizacion` modules. Decided, separate
  change, no date.
- `css-track-fase-2` (validating the obligatorio/opcional split against
  `ModuleView` data). Different thing, blocked on data until ~2026-09-15.
