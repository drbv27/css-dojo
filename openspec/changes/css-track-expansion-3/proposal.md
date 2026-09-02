# Proposal: `css-track-expansion-3`

## Why

`plan-mejoras-css.md` calls these three modules "Fase 3 — our differentiator".
They are the last content batch the plan has left. Fase 1 shipped five modules
(`css-track-expansion`), Fase 2 shipped four (`css-track-expansion-2`), and this
is the third and final batch.

It is named for what it delivers and for its predecessor, never for a phase
number — the same reason the previous one is `css-track-expansion-2` and not
"fase 2". See the naming trap in `css-track-expansion-2/state.yaml`.

## What shipped

**Two** new modules plus one lesson added to a module that already existed. The
plan asked for three modules; the third was measured away — see below.

| Module | Slug | Section | `order` | `nivel` |
|---|---|---|---|---|
| Accesibilidad visual | `accesibilidad-visual` | `css-visual` | 29 | `profundizacion` |
| Depurar con DevTools | `depurar-con-devtools` | `css-herramientas` | 31 | `profundizacion` |
| (fluid image + responsive video) | inside `imagenes-y-medios` | `css-visual` | 23, unchanged | already `obligatorio` |

The track went from **34 to 36** modules and from **844 to 862** exercises.

**No new section was created.** `css-oficio` is never created — Requirement 7 of
`openspec/specs/css-track-sections`, enforced by `secciones-sin-modulos.test.ts`.

### The resulting order

Sections are contiguous by `order`, and `orden-curriculum-css.test.ts` pins the
sequence by hand, so inserting renumbers everything after:

| `order` | module | section |
|---|---|---|
| 28 | variables-css | `css-visual` |
| **29** | **accesibilidad-visual** | `css-visual` |
| 30 | media-queries | `css-responsive` |
| **31** | **depurar-con-devtools** | `css-herramientas` |
| 32-35 | sass-fundamentos, sass-avanzado, bootstrap-5, tailwind-css | `css-herramientas` |
| 36 | proyecto-cv-css | `css-proyecto` |

**Why DevTools is at 31 and not earlier.** Its content depends on modules taught
late: the box-model diagram (4), forcing `:hover` (13), the struck-out
declaration that teaches specificity (16), and device mode (media queries, 30).
Placing it early would mean cutting half the module — so "teach debugging early"
was an illusion. 31 is the first position where every prerequisite is taught, and
it is still **before** the framework block, so it serves the capstone.

## The third module was measured away — AND THE FIRST MEASUREMENT WAS WRONG

The plan asked for a "Responsive de imágenes y video" module. **It was written
before `imagenes-y-medios` existed**, which shipped in Fase 2.

**This section originally justified building it with a measurement that was
false.** A script using `JSON.stringify` plus a hand-built regex had its escaping
mangled by the shell heredoc and returned zeros:

> ~~`max-width: 100%`: 0 · `object-fit`: 0 · `aspect-ratio`: 0~~

Those numbers were reported to the instructor as evidence that the track never
taught fluid images, and the argument for making the module `obligatorio` was
built on them. **A broken measurement does not raise an error — it returns
zeros, and a zero that confirms the hypothesis you already held does not get
audited.** What exposed it was reading the promoted spec, which said
`imagenes-y-medios` teaches `object-fit`.

Re-measured with `rg --fixed-strings`:

| Term | Real occurrences |
|---|---|
| `object-fit` | **36** — 28 of them in `imagenes-y-medios` |
| `aspect-ratio` | **43** — in `dimensiones` and `imagenes-y-medios` |
| `object-position` | **16** |
| `max-width: 100%` | 4 |
| `srcset` / `<picture>` | 19 / 17, **in the HTML track** |

So the module would have been mostly duplication. Genuinely missing were only the
fluid-image rule (`max-width: 100%` with `height: auto`, and **why not `width`**)
and responsive video via `aspect-ratio` on an `<iframe>` — **one lesson**, which
was added inside `imagenes-y-medios`, the module that already owns the subject.
Same judgement previously applied to `dvh` inside `unidades-css`.

## Classification: BOTH new modules are `profundizacion`

**Instructor decision, 2026-09-01**, taken after measuring rather than from the
criterion alone.

**DevTools** is a gesture, not knowledge. The instructor demonstrates it live in
five minutes the first time a student says "the style is not applying", and that
moment teaches more than four lessons. It also ages badly — Chrome moves its
panels.

**Visual accessibility** was argued against and then measured. It is NOT absent
from the required path: 32 occurrences of "accesib", 46 of `outline`, 19 of
`:focus`, 17 of `alt=`. What is missing is the modern layer — `focus-visible`,
`prefers-reduced-motion` and `sr-only`, each at zero. Because the floor is
already taught, the new module **deepens** rather than introduces. That is not
the same as saying accessibility is optional.

### The required path still moved

No new `obligatorio` was added, but the two exercises added to
`imagenes-y-medios` — which IS obligatorio — take the required path from **223 to
225**. No certificate has been awarded, and an awarded certificate is a frozen
snapshot, so nothing is revoked.

### Consequence for challenges

No new challenge was needed: the invariant is that every **obligatorio** carries
one, `imagenes-y-medios` already had its own, and both new modules are
`profundizacion`. Their challenges belong to the separate, already-decided change
covering all optional modules.

## Consequences that must be handled in this change

1. **`order` renumbering.** Modules 29-34 shift. `orden-curriculum-css.test.ts`
   pins the sequence by hand and asserts `order` equals array position with no
   gaps; both move together.
2. **Guards that count.** `nivel-curriculum`, `calificador-curriculum` and
   `certificados` carry module and exercise counts that this change breaks by
   design.
3. **No new integration challenge.** The invariant binds `obligatorio` modules,
   and this change adds none.
4. **Belts got cheaper, again — and this is what finally fixed it.** Gran Maestro
   asked 11000 XP of a curriculum that was 16780 (65.6%) and became 17140
   (**64.2%**), the fourth silent discount. Reporting it here is what led to
   `reescalado-de-cinturones` (PR #59), which rescaled the ladder and added a
   guard so the next batch breaks a test instead.

## Out of scope

- Rescaling `RANKS`. Deliberately not done here — it is a decision about every
  existing student's rank, not a side effect of adding content. It was done
  immediately afterwards as its own change, `reescalado-de-cinturones`.
- Integration challenges for the 13 `profundizacion` modules. Decided, separate
  change, no date.
- `css-track-fase-2` (validating the obligatorio/opcional split against
  `ModuleView` data). Different thing, blocked on data until ~2026-09-15.
