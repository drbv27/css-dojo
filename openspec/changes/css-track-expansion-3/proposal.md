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

## Classification: ONE obligatorio, TWO profundizacion

**Instructor decision, 2026-09-01**, taken after measuring the track rather than
from the criterion alone.

| Module | `nivel` | Why |
|---|---|---|
| `responsive-imagenes-video` | **obligatorio** | Closes a hole that already exists — see below |
| `accesibilidad-visual` | `profundizacion` | The floor is already in the required path; this deepens it |
| `depurar-con-devtools` | `profundizacion` | A gesture, not knowledge; taught live in five minutes |

Required path: **223 → 232 exercises**, required modules 23 → 24.

### Why images is obligatorio, and it is not a preference

Measured against `1c9cdb2`:

| Searched across the whole CSS track | Hits |
|---|---|
| `max-width: 100%` | **0** |
| `object-fit` | **0** |
| `aspect-ratio` | **0** |
| `width: 100%` | 53 |

And `proyecto-cv-css` — **which is obligatorio** — has 25 occurrences of "foto"
and three `<img>`. The required capstone asks the student to put a photo in a CV,
and the track never taught them to keep it from breaking on a phone. Worse, it
taught `width: 100%` 53 times, which is the wrong tool for an image.

**This is not adding a requirement. It is closing a hole that ships today.**

### Why the other two are profundizacion

**DevTools** is a gesture, not knowledge. The instructor demonstrates it live in
five minutes the first time a student says "the style is not applying", and that
moment teaches more than four lessons. It also ages badly — Chrome moves its
panels. Optional is where a reference module belongs.

**Visual accessibility** was argued against and then measured. It is NOT absent
from the required path: 32 occurrences of "accesib", 46 of `outline`, 19 of
`:focus`, 17 of `alt=`. What is missing is the modern layer — `focus-visible`,
`prefers-reduced-motion` and `sr-only` are each at **zero**. Because the floor
is already taught, the new module **deepens** rather than introduces. This is
not the same as saying accessibility is optional.

### Consequence for challenges

Only `responsive-imagenes-video` gets an integration challenge, because the
invariant is that every **obligatorio** carries one (`mini-retos` Requirement
10). The two `profundizacion` modules get theirs in the separate, already-decided
change covering all 11 optional modules.

### Nothing is revoked

No certificate has been awarded yet, and an awarded certificate is a frozen
snapshot. Raising the bar takes nothing from anyone.

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
