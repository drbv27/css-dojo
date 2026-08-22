# Design: css-track-expansion

Phase: `design` · Store: openspec · Depends on `proposal.md`,
`specs/css-track-sections/spec.md`, `specs/css-track-content/spec.md`, and
`../../../../plan-mejoras-css.md`

> Size note: this document exceeds the usual 800-word design budget on purpose.
> Three of its decisions are corrections to the proposal and the specs, and a
> corrected fact stated briefly is how the trap gets re-set.

## Technical approach

Data and config only. `categoriesForDojo()` is the single source of truth for both
listings (`src/app/(app)/modulos/page.tsx:49`,
`src/app/(teacher)/teacher/modulos/page.tsx:376`), so **no component work**. The
whole change is: a type union, one presentation map, 25 one-line edits × 2 fields,
one guard rewrite, three one-line guard fixes, and five new content files.

Seven slices, each green on its own and revertable on its own:

```
1  sections      union + CATEGORY_META + DOJO_CATEGORY_ORDER + 25 category: lines
2  renumber      final RELATIVE order over 25 modules + guard rewrite
3a..3e content   one new module per PR, each shifting the tail of `order`
```

## Decisions

### D1 — Category migration runs in three commits, green at each

| Step | Edits | Why it is green |
|---|---|---|
| A | add the 9 `css-*` members to `ModuleCategory` (`src/types/index.ts:14`) + 9 `CATEGORY_META` entries + `DOJO_CATEGORY_ORDER.css = [...9 css-*, ...6 generic]` | typecheck passes (union widened); `categorias-panel.test.ts` passes (empty categories are legal); **no UI change** — both renderers do `if (catModules.length === 0) return null` (`modulos/page.tsx:80`, `teacher/modulos/page.tsx:378`) |
| B | flip the 25 `category:` lines; fix `tipos-ejercicio.test.ts:58`, `categorias-panel.test.ts:85`, and `orden-curriculum-css.test.ts` | the 6 generic entries are now empty and therefore skipped, so on-screen order is already the final one |
| C | delete the 6 generic members from the union, `CATEGORY_META` and `DOJO_CATEGORY_ORDER.css` | typecheck IS the proof that nothing references them |

**Rejected:** one atomic commit. Same final diff, but with no green intermediate a
typecheck failure cannot be distinguished from "still migrating".

**Correction to the specs — a third guard breaks, not two.**
`tipos-ejercicio.test.ts:58` reads `m.category === "preprocessors"`. Removing that
member makes it a `TS2367` no-overlap error *and* turns
`expect(preprocesadores.length).toBeGreaterThan(0)` into `0 > 0`. The fix pins the
two Sass **slugs** (`sass-fundamentos`, `sass-avanzado`), not the category:
`css-herramientas` also holds Bootstrap and Tailwind, which are not preprocessors.
Mapping to the category would pass today (both do ship a `live-editor`) while
silently making the test stop meaning what its comment says.

### D2 — `order` is renumbered twice, and the final 1..30 only exists at the end

Verified against every guard in `orden-curriculum-css.test.ts`, both times:

**Slice 2, 25 modules** — the final *relative* sequence:
1 que-es-css, 2 selectores, 3 propiedades-basicas, 4 box-model, 5 unidades-css,
6 dimensiones, 7 tipografias, 8 selectores-descendientes, 9 pseudo-clases,
10 pseudo-elementos, 11 especificidad, 12 float-display, 13 posicionamiento,
14 flexbox, 15 css-grid, 16 propiedades-logicas, 17 shadows-gradients-filters,
18 transiciones-animaciones, 19 variables-css, 20 media-queries,
21 sass-fundamentos, 22 sass-avanzado, 23 bootstrap-5, 24 tailwind-css,
25 proyecto-cv-css.

**After slice 3e, 30 modules** — exactly spec `css-track-sections` Requirement 4
(1..30 with the five new modules at 7, 9, 13, 20, 22).

Both sequences satisfy: `box-model` < `unidades-css` < `dimensiones`;
`unidades-css` < `tipografias`; `selectores` < `selectores-descendientes` <
`especificidad`; `pseudo-clases` < `especificidad`; box-model/units < flexbox,
css-grid, posicionamiento; flexbox/css-grid < media-queries; variables-css and
shadows < sass-fundamentos < sass-avanzado; flexbox/grid/media-queries/variables <
bootstrap-5/tailwind-css/proyecto; capstone last.

**Rejected:** appending the five at 26..30 and renumbering afterwards. It is not
even green — `categorias-panel.test.ts:98` asserts the capstone outranks every
content module, and `proyecto-cv-css` at 25 with `math-functions` at 26 fails it.

**How a half-applied state is prevented:** `order` lives in exactly one place per
module (one line), and `orden-curriculum-css.test.ts` asserts `order === array
position` *and* `[1..n]` with no gaps. Any subset of the edits fails
`npm run test:run`. That is the gate; no new mechanism is needed.

**Two stale comments must be corrected in the same slice** — `index.ts:125` ("nada
ordena por el campo `order`") and the `IMPORTANT:` paragraph in the
`orden-curriculum-css.test.ts` docstring. `index.ts:156` ends in
`.sort((a, b) => a.order - b.order)`, so the array literal's order is documentary
only. Leaving the comments is how the next person re-sets the trap.

### D3 — The guard rewrite: one pinned sequence replaces two weaker pins

| Element | After the rewrite |
|---|---|
| `ORDEN_CATEGORIAS` | **derived** — import `DOJO_CATEGORY_ORDER.css` (spec 5.1) |
| `referenciados` ledger + `length === cssModules.length` | **replaced** by one pinned `SECUENCIA` of 30 slugs in teaching order |
| `posicionDe` | kept verbatim (it throws on a slug typo instead of returning 0) |
| the 9 pedagogical `it()` blocks | kept verbatim (spec 5.3) |
| `expect(proyecto.category).toBe("project")` | → `"css-proyecto"` |

`SECUENCIA` is asserted three ways: it equals `cssModules.map(m => m.slug)`; each
`order` equals its index + 1; and grouping by `DOJO_CATEGORY_ORDER.css` reproduces
the identical walk. This is **strictly stronger** than what it replaces — a
carelessly added module fails on array length, and a reorder fails on element
equality, where the old count pin only caught the first.

**Rejected:** deriving the expected sequence from `DOJO_CATEGORY_ORDER` + `order`.
That is tautological: it would pass for any self-consistent renumbering, which is
precisely the failure mode the file exists to catch.

### D4 — HIGH RISK, not covered by the specs: the forward-reference ledger moves

`media-queries` goes 17 → 25 (because `css-responsive` follows `css-visual` in the
plan's section order) and `transiciones-animaciones` 18 → 23. Both ledger tests key
off `posicionDe(...)`, so **moving a reference point re-classifies existing
content**:

| Pattern | Target module | old → new pos | newly counted |
|---|---|---|---|
| `@media` | media-queries | 17 → 25 | `18-transiciones-animaciones`, `19-variables-css` |
| `transition:` | transiciones-animaciones | 18 → 23 | `20-shadows-gradients-filters` (`17-media-queries` drops out) |
| `line-height:`/`font-family:`/`text-align:` | tipografias | 6 → 8 | `05-dimensiones` |

Estimated net **+2 to +4** cases against the `expect(casos.length)
.toBeLessThanOrEqual(24)` ceiling, whose current true value is *bounded, not
pinned*. Measured by `rg` here; this phase has no shell, so it is an estimate.

**Decision:** do not raise the threshold — the test's own comment says never to.
`sdd-apply` measures the count in slice 2 first; if it rises, it removes the
forward references the ledger just surfaced. The `@media` mentions in
`18-transiciones-animaciones` and `19-variables-css` are exactly the debt the
ledger exists to name.

**Rejected:** putting `css-responsive` before `css-visual` to keep `media-queries`
near 20. It contradicts frozen spec Requirement 4 and the plan's section order, and
only defers the same coupling.

**Verified safe:** the hard-failing test (`ningun EJERCICIO exige un concepto que se
ensena mucho despues`, `SALTO_TOLERADO = 3`). No module newly inside a risk window
carries the matching pattern in `prompt`/`targetCSS`/`hint` — notably `var(--` does
not appear anywhere in `16-css-grid.ts`, the only module the `variables-css` shift
newly exposes.

### D5 — The authoring template is documentation, not a fixture or a generator

**Choice:** an `## Authoring a CSS module` block in `tasks.md`, plus the guards that
already exist. **Rationale:** the enforcement layer is already there and already
runs over real data — `validacion-curriculum`, `tipos-ejercicio`, `acentuacion`,
`orden-lecciones`, `signos-interrogacion`, `shuffle`. A shared fixture would only
mean something if the 25 existing modules were migrated onto it. A generator would
emit a skeleton that still has to be hand-authored, because concepts-over-recipes,
anti-plagiarism and CV-grounded examples are judgement, not templating. A new
"module shape" test would duplicate `orden-lecciones` + `tipos-ejercicio`.

Conventions the block must state, all read from the code:

- Files `26-math-functions.ts` … `30-transforms.ts`. Do **not** renumber `01-`…`25-`
  (spec non-goal; file prefix already diverges from `order`).
- IDs follow the **file** prefix: `26-leccion-01`, `26-ej-01`.
  `validacion-curriculum.test.ts:26` keys `REFERENCIAS_HTML_EN_CSS` by ids like
  `23-ej-05`, and `shuffle` seeds per exercise id.
- `lessons[].order` and `exercises[].order` each 1..n, no gaps, no duplicates
  (`orden-lecciones.test.ts`).
- `dojo: "css" as const`; `category` one of the nine; `icon` is a decorative
  free-form string (no lookup table consumes it).
- ≥1 `live-editor` or `visual-match` per module (`tipos-ejercicio.test.ts:38`,
  ceiling 63).
- `validation.type` ∈ `css-rules` | `html-structure` | `quiz` | `drag-drop`. Prefer
  `css-rules`: an `html-structure` exercise **also** requires adding a reference to
  `REFERENCIAS_HTML_EN_CSS`, or `validacion-curriculum.test.ts:150` fails.
- Attribute selectors use double quotes everywhere (`normalizarSelectores` does not
  normalize quote style).

### D6 — Slicing and changed-line forecast

| Slice | Content | Files | Forecast (add+del) |
|---|---|---|---|
| 1 sections | union, `CATEGORY_META` ×9, `DOJO_CATEGORY_ORDER.css`, 25 `category:` lines, 3 guard one-liners, `index.ts` comment | 30 | **~110–140** |
| 2 renumber | 25 `order:` lines, `index.ts` CSS block + comment, `orden-curriculum-css.test.ts` rewrite, ledger re-measure | 27 | **~180–240** |
| 3a math-functions (slot 7) | 1 new file + 19 `order:` shifts + `index.ts` | 21 | **~650–790** |
| 3b advanced-text (slot 9) | 1 new file + 18 shifts + `index.ts` | 20 | **~650–790** |
| 3c attribute-selectors (slot 13) | 1 new file + 15 shifts + `index.ts` | 17 | **~650–790** |
| 3d lists-and-tables (slot 20) | 1 new file + 10 shifts + `index.ts` | 12 | **~650–790** |
| 3e transforms (slot 22) | 1 new file + 9 shifts + `index.ts` | 11 | **~650–790** |

Total **~3,500–4,300** changed lines. The per-module figure is calibrated on real
files: `23-bootstrap.ts` is ~660 lines for 4 lessons + 8 exercises. Every slice
fits the 800-line budget, but 3a–3e sit at the ceiling, so chained PRs are required
rather than optional.

**Landing order and why.** Slice 1 first: cheapest, touches no `order`, and makes a
30-item listing navigable before anything is added to it. Slice 2 second: it fixes
the final relative sequence and ships the rewritten guard, so every module PR
afterwards is landing against a test that already knows the shape it must satisfy.
Then 3a→3e in **ascending slot order**, each inserting its module and shifting the
tail of `order` by one.

**Revert.** Slice 1 restores six categories and three test lines. Slice 2 restores
25 numbers and one test file. Each module PR reverts to one deleted file plus the
shifts it introduced. Nothing persisted depends on any of it (see below).

### D7 — ModuleSettings, static data, and rollout order

`ModuleSettings` (`src/lib/models/ModuleSettings.ts`) has no document for a new
slug, and no document means blocked. It keys by `(cohort, slug)`; `Progress` keys by
slug. **Slices 1 and 2 change no slug**, so they touch nothing persisted: no
migration, no backfill, no schema change. The `order` and `category` fields are
static presentation data that the DB never mirrors.

**Correction to `css-track-content` Scenario 8.1.** It says a blocked module "MUST
NOT appear". It does appear. `modulos/page.tsx:96-103` renders a blocked module as
a greyed, non-clickable **locked card** when `!isEnabled && !isTeacher`. So from the
moment slice 3a deploys, every cohort sees a locked "Funciones matemáticas" card.
That is product-visible and belongs to the instructor's decision, not to a bug
report.

**Sequence, which cannot be reordered:** merge → **manual Coolify redeploy** →
enable per cohort in `/teacher/modulos`. Enabling first is impossible: the panel can
only toggle slugs present in the deployed `ALL_MODULES` (`teacher/modulos/page.tsx:377`).
This is the `html-16`/`html-17` lesson.

## File changes

| File | Action | Slice |
|---|---|---|
| `src/types/index.ts` | Modify | 1 (add 9, delete 6 from `ModuleCategory`) |
| `src/data/moduleCategories.ts` | Modify | 1 (9 `CATEGORY_META` entries, distinct `color`; `DOJO_CATEGORY_ORDER.css`) |
| `src/data/modules/[01-25]-*.ts` | Modify | 1 (`category:`) and 2/3a-e (`order:`) |
| `src/data/modules/index.ts` | Modify | 1 (comment at :125), 2 (CSS block), 3a-e (imports + registration) |
| `src/data/modules/orden-curriculum-css.test.ts` | Modify | 2 (rewrite per D3; docstring corrected) |
| `src/data/modules/categorias-panel.test.ts` | Modify | 1 (`CLOSING_CATEGORY.css` → `"css-proyecto"`, one line) |
| `src/data/modules/tipos-ejercicio.test.ts` | Modify | 1 (line 58 → slug-pinned, per D1) |
| `src/data/modules/26-math-functions.ts` … `30-transforms.ts` | Create | 3a–3e |

## Testing strategy

| Layer | What | How |
|---|---|---|
| Types | no dangling reference to a removed category | `npm run typecheck` after slice 1 step C |
| Data guard | reachability, colour distinctness, capstone closing | `categorias-panel.test.ts` (one literal changed, rest untouched) |
| Data guard | 1..n sequence, array agreement, 9 pedagogical chains | `orden-curriculum-css.test.ts` rewritten per D3 |
| Data guard | ledger count did not rise | same file, `casos.length <= 24`, measured before/after slice 2 |
| Data guard | grading is structural, references score 100 | `validacion-curriculum.test.ts` unmodified |
| Data guard | producibility, accents, lesson numbering, no positional bias | `tipos-ejercicio` (one line), `acentuacion`, `orden-lecciones`, `signos-interrogacion`, `shuffle` — all unmodified |
| Build | listing compiles and renders | `npm run lint`, `npm run build`, `npm run test:e2e` |
| Manual | 9 sections in order, distinct colours, both pages agree | `/modulos` and `/teacher/modulos` after each deploy |

## Threat matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file
classification, or process-integration boundary. Static content data and a type
union only.

## Open questions

- [ ] **Ledger threshold.** The current true value of `casos.length` is unknown
      (the test only bounds it at 24). This phase has no shell. `sdd-apply` must
      measure it before and after slice 2 and fix content, never the ceiling.
- [ ] **`media-queries` moves 17 → 25.** Responsive would be taught *after*
      shadows, transforms, transitions and variables. This follows from the plan's
      own section order but was never stated as a teaching-order decision. Worth an
      explicit confirmation from the instructor.
- [ ] **Five locked cards.** Between deploy and per-cohort enabling, students see
      locked cards, not nothing. Enable immediately at deploy, or accept them?
