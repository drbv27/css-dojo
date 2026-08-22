# Spec Delta: css-track-sections

Phase: `spec` · Capability: `css-track-sections` (new) · Change: `css-track-expansion`

Governs how CSS modules are grouped, ordered and presented, and the invariant
that every category is reachable from both the student listing (`/modulos`)
and the teacher panel (`/teacher/modulos`), both of which read
`categoriesForDojo()` in `src/data/moduleCategories.ts`.

RFC 2119 keywords are used as defined.

---

## ADDED Requirement 1 — Nine `css-*` sections replace the six generic categories

`ModuleCategory` SHALL gain nine dojo-prefixed members for CSS:
`css-fundamentos`, `css-caja`, `css-texto`, `css-selectores`, `css-layout`,
`css-visual`, `css-responsive`, `css-herramientas`, `css-proyecto`.
`css-oficio` MUST NOT be created in this change — it has no member until
Fase 3. The six generic members (`intro`, `intermediate`, `advanced`,
`preprocessors`, `frameworks`, `project`) SHALL be removed once no module
references them; they are used ONLY by the CSS track (verified: no `html`,
`js`, `react`, `react-eco` or `nextjs` module carries any of these six
values), so removal MUST NOT affect any other track.

### Scenario 1.1 — Every CSS module carries a `css-*` category

- **Given** all 25 existing CSS modules plus the 5 new ones
- **When** `ModuleCategory` and each module's `category:` field are read
- **Then** every one of the 30 MUST hold one of the nine `css-*` values, and
  none MUST hold a retired generic value

### Scenario 1.2 — Removal does not break another track

- **Given** the six generic categories are deleted from `ModuleCategory`
- **When** `npm run typecheck` runs
- **Then** it MUST pass, because no `html`/`js`/`react`/`react-eco`/`nextjs`
  module ever referenced them

### Scenario 1.3 — `css-oficio` stays absent

- **Given** `DOJO_CATEGORY_ORDER.css`
- **When** its members are listed
- **Then** `css-oficio` MUST NOT appear, and no module MUST carry it

---

## ADDED Requirement 2 — Every section is visually distinguishable

Each of the nine `css-*` entries in `CATEGORY_META` MUST use a `color` value
distinct from every other `css-*` entry. (Today `intro`, `intermediate` and
`frameworks` all render `css-purple` — indistinguishable on screen.)

### Scenario 2.1 — No two CSS sections share a colour

- **Given** the nine `CATEGORY_META` entries for `css-*`
- **When** their `color` fields are compared pairwise
- **Then** no two MUST be equal

---

## ADDED Requirement 3 — Section-to-module assignment

Modules SHALL be grouped as follows (new modules in **bold**, see
`css-track-content` for their definitions):

| Section | Members, in render order |
|---|---|
| `css-fundamentos` | que-es-css, selectores, propiedades-basicas |
| `css-caja` | box-model, unidades-css, dimensiones, **math-functions** |
| `css-texto` | tipografias, **advanced-text** |
| `css-selectores` | selectores-descendientes, pseudo-clases, pseudo-elementos, **attribute-selectors**, especificidad |
| `css-layout` | float-display, posicionamiento, flexbox, css-grid, propiedades-logicas |
| `css-visual` | **lists-and-tables**, shadows-gradients-filters, **transforms**, transiciones-animaciones, variables-css |
| `css-responsive` | media-queries |
| `css-herramientas` | sass-fundamentos, sass-avanzado, bootstrap-5, tailwind-css |
| `css-proyecto` | proyecto-cv-css |

### Scenario 3.1 — Panel and student listing agree

- **Given** the table above and `categoriesForDojo("css")`
- **When** `/modulos` and `/teacher/modulos` each render the CSS list
- **Then** both MUST show the same 9 sections in the same order, each holding
  exactly its listed members, per `categorias-panel.test.ts`

---

## ADDED Requirement 4 — `order` renumbering invariant

The full CSS track (30 modules) SHALL number `order` 1..30 with no gaps and
no duplicates, ascending in the exact section-then-member sequence of
Requirement 3. The resulting sequence MUST be:

1 que-es-css, 2 selectores, 3 propiedades-basicas, 4 box-model, 5
unidades-css, 6 dimensiones, 7 math-functions, 8 tipografias, 9
advanced-text, 10 selectores-descendientes, 11 pseudo-clases, 12
pseudo-elementos, 13 attribute-selectors, 14 especificidad, 15
float-display, 16 posicionamiento, 17 flexbox, 18 css-grid, 19
propiedades-logicas, 20 lists-and-tables, 21 shadows-gradients-filters, 22
transforms, 23 transiciones-animaciones, 24 variables-css, 25 media-queries,
26 sass-fundamentos, 27 sass-avanzado, 28 bootstrap-5, 29 tailwind-css, 30
proyecto-cv-css.

This satisfies every pre-existing ordering guard (box-model < unidades-css <
dimensiones; unidades-css < tipografias; selectores <
selectores-descendientes < especificidad; box-model/unidades-css < layout
modules; flexbox/css-grid < media-queries; variables-css/shadows <
sass-fundamentos; capstone last) plus three new ones this change introduces.

### Scenario 4.1 — No gaps or duplicates

- **Given** `ALL_MODULES` filtered to `dojo === "css"`
- **When** `order` values are sorted
- **Then** they MUST equal `[1, 2, ..., 30]` exactly

### Scenario 4.2 — `order` matches array position, which matches on-screen position

- **Given** `src/data/modules/index.ts` sorts by `order` ascending
- **When** the CSS slice of `ALL_MODULES` is walked
- **Then** each module's `order` MUST equal its 1-based position, AND the
  same sequence grouped by `css-*` category (Requirement 3) MUST produce an
  identical walk

### Scenario 4.3 — New pedagogical chains hold

- **Given** the sequence above
- **Then** `math-functions` (7) MUST render after `unidades-css` (5), because
  it composes `calc()`/`clamp()` over units already taught
- **AND** `attribute-selectors` (13) MUST render after `pseudo-elementos`
  (12) and before `especificidad` (14), because specificity calculation
  should cover every selector kind already taught
- **AND** `transforms` (22) MUST render before `transiciones-animaciones`
  (23), because that module explains why transform/opacity are the cheap
  properties to animate — a claim `transforms` must make first

### Scenario 4.4 — The capstone renders last

- **Given** `proyecto-cv-css`
- **Then** its `order` MUST be 30, strictly greater than every other CSS
  module's `order`

---

## ADDED Requirement 5 — `orden-curriculum-css.test.ts` is rewritten, not patched

The guard test SHALL be updated so it verifies the Requirement 4 sequence and
becomes data-driven where it was hardcoded.

### Scenario 5.1 — The category ledger stops duplicating data

- **Given** the file's local `ORDEN_CATEGORIAS` constant
- **When** the file is rewritten
- **Then** it MUST read `DOJO_CATEGORY_ORDER.css` from
  `src/data/moduleCategories.ts` instead of hardcoding a parallel list, so a
  future section change requires editing one file, not two

### Scenario 5.2 — The slug ledger accounts for 30, not 25

- **Given** the `referenciados` array asserting `length === cssModules.length`
- **When** the five new slugs are added
- **Then** the assertion MUST pass against 30 modules without widening its
  intent (still failing if a slug goes missing or an extra one appears
  unaccounted for)

### Scenario 5.3 — Pre-existing pedagogical assertions survive verbatim

- **Given** the tests `box-model < dimensiones`, `box-model < unidades-css`,
  `unidades-css < tipografias`/`dimensiones`, the selector chain, the layout
  chain, `media-queries` after flexbox/grid, preprocessors last, and the
  capstone-last check
- **When** the file is rewritten for 30 modules and 9 categories
- **Then** every one of these assertions MUST still be present and MUST still
  pass

---

## MODIFIED Requirement 6 — `categorias-panel.test.ts`'s closing-category literal

`categorias-panel.test.ts` hardcodes `CLOSING_CATEGORY.css = "project"` as a
typed `ModuleCategory` literal. Once `project` is removed from the union
(Requirement 1), this literal MUST become `"css-proyecto"` or the file fails
to typecheck. This is a correction to the proposal's Affected Areas table,
which lists this file as "Unchanged" — it needs exactly this one-line change,
with no other logic touched.

### Scenario 6.1 — The literal is updated, nothing else changes

- **Given** `CLOSING_CATEGORY.css` currently reads `"project"`
- **When** the six generic categories are removed
- **Then** the literal MUST be updated to `"css-proyecto"` and every other
  assertion in the file MUST remain unmodified and MUST still pass

---

## Non-goals, explicitly

- Fases 2, 3 and 4 of the plan (web typography, overflow, inheritance,
  images/media, responsive images/video, accessibility, DevTools, and the
  interleaved-challenge `Exercise` schema change) are OUT of scope.
- `css-oficio` is not created in this change.
- Filename renumbering (`01-`…`25-` no longer matching `order`) is known
  cosmetic debt and is NOT addressed here.
