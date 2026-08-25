# Design — css-track-fase-2

## The classification: settled 2026-08-24, not reopened

19 required modules (78 lessons, 166 exercises) and 11 optional ones (43
lessons, 94 exercises). The minimum path is **63 % of the 260 exercises**.

**Required (19):**
`1 que-es-css` · `2 selectores` · `3 propiedades-basicas` · `4 box-model` ·
`5 unidades-css` · `6 dimensiones` · `8 tipografias` ·
`10 selectores-descendientes` · `11 pseudo-clases` · `12 pseudo-elementos` ·
`14 especificidad` · `15 float-display` · `16 posicionamiento` · `17 flexbox` ·
`18 css-grid` · `24 variables-css` · `25 media-queries` · `29 tailwind-css` ·
`30 proyecto-cv-css`

**Optional (11):**
`7 math-functions` · `9 advanced-text` · `13 attribute-selectors` ·
`19 propiedades-logicas` · `20 lists-and-tables` ·
`21 shadows-gradients-filters` · `22 transforms` ·
`23 transiciones-animaciones` · `26 sass-fundamentos` · `27 sass-avanzado` ·
`28 bootstrap-5`

## The criterion, so new modules classify by the same rule

A module is **required** if it meets at least one:

1. The next track assumes it — a React student reads or writes it daily.
2. Without it a junior fails a real task.
3. It is a concept, not a catalogue. The cascade is understood; `text-overflow`
   is looked up.
4. It blocks another required module.

If it only adds surface area that gets looked up on MDN when needed, it is
depth.

## Three deliberate departures from the pure criterion

These are the instructor's calls and they override the rule above. They are
recorded here so nobody "corrects" them later.

- **`tailwind-css` (29) is REQUIRED** even though it is a tool and not a
  fundamental. Reason: market value today, and the React ecosystem assumes it.
- **`pseudo-elementos` (12) is REQUIRED.** `::before` / `::after` appear in a
  great deal of real CSS, and a junior who does not recognise them stalls while
  reading.
- **`math-functions` (7) is OPTIONAL** despite sitting at slot 7. The required
  path jumps from 6 to 8. That visual gap is accepted on purpose; if it ever
  becomes annoying, the fix is to reorder the module, **not** to promote it.

## Where the distinction lives: `ModuleData`

Decided by the instructor on 2026-08-24. `ModuleSettings` is **not** touched and
stays binary `{cohort, slug, enabled}`.

The level is **curriculum data** — identical for every cohort — so it belongs
next to `slug`, `title`, `order` and `category` in `ModuleData`
(`src/types/index.ts:201`).

Rejected, with reasons:

- **Per cohort.** Would force marking 30 modules every time a cohort opens, and
  repeated manual work is where omissions come from. Measured today: five
  modules were already invisible to a cohort for exactly this reason.
- **Default plus per-cohort override.** More machinery than today's problem
  needs.

The future exit stays open, and that is what makes this choice safe: going from
"curriculum only" to "curriculum plus per-cohort override" is **additive**.
Choosing this today does not close the door on an intensive cohort; it only
defers that work until the need exists.

## The one open decision, deliberately deferred

**Required field or defaulted field?** There are **107 module files** in the
repo, not 30. A required field means all 107 declare it; a defaulted field means
only the ones that deviate do.

The reading is that the default is the cheap one and avoids 107 edits, but the
other five tracks have no classification decided, so whatever default is chosen
silently classifies 77 modules outside CSS. That is the part that needs
measuring before it is written.

**This is not implemented in this change**, because implementing it today would
encode an unvalidated hypothesis into the data model. See `proposal.md`.

## What the instrumentation has to answer first

For each module, from `ModuleView` versus `Progress`:

| Pattern | Reading |
|---|---|
| Opened, nothing submitted | Candidate to **split or rewrite**, not to mark optional |
| Never opened, but later modules were | Genuine skipping — the missing evidence |
| Neither opened nor reached | Says nothing at all — the trap the four new modules set |

Until those three can be told apart, marking modules optional is a guess wearing
a schema.
