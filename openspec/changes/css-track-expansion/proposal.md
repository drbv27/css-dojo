# Proposal: css-track-expansion

Phase: `propose` · Store: openspec · Source of intent: `../../../../plan-mejoras-css.md` (2026-08-21, authored by the instructor)

## Recommendation up front

Do **Fase 0 (regroup into `css-*` sections)** and **Fase 1 (five new modules)** in this
change, in that order, as separate slices. Fase 0 is 27 files touched, one line each, plus
two config files and two curriculum guards — it is the cheap fix that makes Fase 1
navigable. Fases 2, 3 and 4 stay out.

## Intent

**The measured gap.** The CSS track has 25 modules and 220 exercises (verified: 220
`xpReward:` fields across `src/data/modules/[0-2][0-9]-*.ts`). It teaches `:has()`,
`@layer`, `@container`, `subgrid` and logical properties — and does **not** teach
`clamp()`, attribute selectors, tables, `text-overflow: ellipsis` or `transform` as a
subject of its own. We are behind on everyday CSS, not on modern CSS. A student leaves the
track able to explain cascade layers and unable to truncate a long title with an ellipsis.

**The navigation gap.** CSS is the **only** track still on generic categories: `css:
["intro", "intermediate", "advanced", "preprocessors", "frameworks", "project"]` in
`DOJO_CATEGORY_ORDER` (`src/data/moduleCategories.ts:73`), while every other track uses
prefixed semantic ones. Worse, `intro`, `intermediate` and `frameworks` all render in
`css-purple` (lines 35, 36, 39), so three of the six sections look identical on screen.

**Why now.** Fase 1 adds five modules. Adding them to a flat 25-item list with three
same-coloured sections makes the listing worse, not better. Regrouping costs one line per
module today and gets more expensive with every module added.

## Scope

### In

- **Fase 0** — ten `css-*` sections replacing the six generic CSS categories:
  `css-fundamentos`, `css-texto`, `css-caja`, `css-selectores`, `css-layout`, `css-visual`,
  `css-responsive`, `css-oficio`, `css-herramientas`, `css-proyecto`. Touches the
  `ModuleCategory` union (`src/types/index.ts`), `CATEGORY_META` +
  `DOJO_CATEGORY_ORDER` (`src/data/moduleCategories.ts`), and the `category:` line of the
  25 CSS module files. Sections with no Fase 1 or Fase 0 member (`css-oficio`) are **not**
  created in this change.
- **Fase 1** — five new modules, each ~4 lessons + ~8 exercises:

  | Module | Section | Content |
  |---|---|---|
  | Math functions | `css-caja` | `calc()` `min()` `max()` `clamp()`, mixing units in one operation |
  | Attribute selectors | `css-selectores` | `[type=]` `[href^=]` `[src$=]` `[class*=]` `[lang\|=]`, the ` i` flag |
  | Lists and tables | `css-visual` | `list-style-*`, `::marker`, `border-collapse`, `border-spacing`, column widths, horizontal scroll on mobile |
  | Advanced text | `css-texto` | full `text-decoration`, `text-transform`, `letter-spacing`, `word-spacing`, `text-indent`, `white-space`, `text-overflow: ellipsis`, `text-shadow` |
  | Transforms | `css-visual` | `translate` `rotate` `scale` `skew`, `transform-origin`, combining, a look at `perspective`/`rotateY`, why transform+opacity are the cheap ones to animate |

- Updating the curriculum guards this change necessarily breaks (see Approach).

### Out (named, not designed)

- **Fase 2**: web typography, overflow, inheritance and global values, images and media.
- **Fase 3**: responsive images/video, visual accessibility, DevTools debugging.
- **Fase 4**: interleaved lesson → challenge pattern. Verified: `Exercise`
  (`src/types/index.ts:165`) has `order` and **no** lesson link; it needs a new optional
  field plus renderer work. Separate change.
- Any recipe module (tooltips, modals, sprites, pagination, dropdowns, galleries) and any
  niche topic (counters, multi-column, `border-image`, masking, `@property`).
- No change to auth, `ApprovalGate`, MongoDB models, XP or the graders themselves.

## Capabilities

### New Capabilities

- `css-track-sections`: how CSS modules are grouped, ordered and presented; the invariant
  that every category is reachable from both the student listing and the teacher panel.
- `css-track-content`: what a new CSS module must contain and satisfy to ship — lessons,
  exercise mix, grading type, authoring constraints.

### Modified Capabilities

- None. `openspec/specs/` holds no specs yet; both capabilities above are new.

## Approach

**Fase 0 is a data-and-config change with a guard rewrite.** `categoriesForDojo()` is read
by both `src/app/(app)/modulos/page.tsx:49` and
`src/app/(teacher)/teacher/modulos/page.tsx:376` — verified single source of truth, so no
component work is needed. But two guards hardcode today's shape and **will fail**:

1. `orden-curriculum-css.test.ts` hardcodes `ORDEN_CATEGORIAS` as the six generic names and
   asserts no CSS module carries a category outside it; it also asserts
   `referenciados.length === cssModules.length`, so it breaks on both the rename (Fase 0)
   and the count 25 → 30 (Fase 1). Updating it is part of the work, not collateral damage.
2. The same file asserts `order` equals the module's on-screen position, with no gaps and no
   duplicates, **and** that the category grouping does not contradict that sequence.

**Correction to a stated assumption.** `src/data/modules/index.ts:156` ends with
`.sort((a, b) => a.order - b.order)`. The walked sequence therefore *is* `order` ascending;
the docstring in `orden-curriculum-css.test.ts` saying nothing sorts by `order` is stale.
Consequence: inserting a module mid-track means **renumbering `order` for every later CSS
module**, and the new section order must agree with the resulting numbering.

**A blocking contradiction in the plan's section order.** The plan lists `css-texto`
(tipografias) before `css-caja` (box-model, unidades). The existing guard asserts
`box-model < unidades-css < tipografias`. Both cannot hold. See Open decisions.

### Constraints that govern the content

| Constraint | Why it is binding |
|---|---|
| **Concepts over code** | Every module teaches something reusable. A recipe enters as a `reto` inside an existing module or not at all. |
| **Anti-plagiarism (non-negotiable)** | From W3Schools we take the topic **inventory** only — facts, not expression. No text, no examples, no literal ordering. Every example authored by us, preferably on Ana Martinez's CV, the product we already build in class. |
| **Grading must be structural** | `validacion-curriculum.test.ts` forbids `validation.type: "includes"` in the CSS track outright (61 exercises were once passable as prose) and forbids `"visual"`. New CSS writing exercises use `css-rules`, graded against the exercise's own `targetCSS`, and every reference must score 100%. |
| **`css-rules` selector keys are literal** | `normalizarSelectores` lowercases and collapses whitespace only (`src/lib/cssRules.ts:31`). `[href^="https"]` and `[href^='https']` are different keys — the attribute-selector module must fix quoting in the prompt or grade by quiz/drag-drop. |
| **No positional quiz bias** | 69% of quizzes once had the answer in slot B; `src/lib/shuffle.ts` disolves it per student and `src/lib/shuffle.test.ts` asserts over the real curriculum that no slot holds ≥50% of correct answers. New quizzes must not push it back. |
| **Every module must be producible** | `tipos-ejercicio.test.ts` asserts no module can be passed by recognition alone, and caps "nothing to write" modules at 63. Each new module needs at least one writing exercise. |
| **Spanish prose must be accented** | `acentuacion.test.ts` fails on missing tildes and `ñ`. |

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/types/index.ts` | Modified | Add `css-*` members to `ModuleCategory`; remove the six generic ones once unused |
| `src/data/moduleCategories.ts` | Modified | One `CATEGORY_META` entry per section (distinct colours) + rewrite `DOJO_CATEGORY_ORDER.css` |
| `src/data/modules/[01-25]-*.ts` | Modified | One `category:` line each; `order:` renumbered where Fase 1 inserts |
| `src/data/modules/` (new files) | New | Five modules + registration in `index.ts` |
| `src/data/modules/orden-curriculum-css.test.ts` | Modified | New `ORDEN_CATEGORIAS`, new slug ledger, ordering assertions for the new modules |
| `src/data/modules/categorias-panel.test.ts` | Unchanged | Already fails on any unreachable category — the safety net, kept as-is |
| `/teacher/modulos` (operational) | Runtime | Five new slugs must be enabled per cohort |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| New modules invisible to every cohort | **Certain, by design** | `ModuleSettings` has no doc for a new slug and "no doc = blocked" (`src/lib/models/ModuleSettings.ts:3-6`). Enabling per cohort in `/teacher/modulos` is a delivery step, not a bug. It already bit us with `html-16`/`html-17`. |
| Renumbering `order` desynchronises the track | Med | Guards fail loudly on gaps, duplicates and category/order contradiction. Renumber in one pass, tests green before commit. |
| Section order breaks a pedagogical dependency | Med | The `box-model < unidades-css < tipografias` chain is asserted. Resolve the ordering decision *before* writing content. |
| File numbering (`01-`…`25-`) drifts further from track order | High | Already true today (`11-box-model.ts` has `order: 4`). Do **not** renumber filenames in this change; say so and leave it as a known cosmetic debt. |
| 30 modules is a lot for one cohort | Med | The data model has **no** notion of required vs optional deepening today. This change does not invent one. Sections make the track skimmable; scoping per cohort stays a teacher decision. |
| A generic category is removed while a non-CSS module still uses it | Low | `project`, `intro` etc. are CSS-only in `DOJO_CATEGORY_ORDER`; typecheck + `categorias-panel.test.ts` catch a miss. |

## Rollback

Fase 0 and Fase 1 are separate slices, each revertable on its own. Fase 0 is data and
config only: `git revert` restores the six categories and the guard. Fase 1 is additive —
reverting removes the five files and their `index.ts` registration, plus the `order`
renumbering. Nothing persisted depends on it: `Progress` and `ModuleSettings` key by slug,
so a removed slug leaves orphan rows that render nowhere and break nothing. No migration,
no schema change, no auth surface touched.

## Open decisions (need the instructor's answer before spec/design freezes)

1. **Section order vs teaching order.** The plan puts `css-texto` before `css-caja`, which
   contradicts the guarded chain `box-model < unidades-css < tipografias`. Preferred
   resolution: place `css-caja` before `css-texto`. Alternative: keep `04-tipografias` in
   `css-fundamentos` and let `css-texto` hold only the advanced text material.
2. **`css-oficio`.** It has no member until Fase 3. Assumption: do not create it now.
3. **Cohort 2, in progress.** Assumption: the five new modules ship as self-study and
   reinforcement, not as new class sessions, and are enabled per cohort at the
   instructor's discretion.
4. **`css-visual` gains two of the five modules** (lists/tables, transforms). Assumption:
   acceptable; no further split.

## Success Criteria

- [ ] `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run test:e2e` and
      `npm run build` all green.
- [ ] `categorias-panel.test.ts` passes unmodified: every CSS module's category is
      reachable from both the student listing and the teacher panel, and no module is
      orphaned.
- [ ] No two CSS sections share a colour in `CATEGORY_META`.
- [ ] 30 CSS modules, `order` 1..30 with no gaps or duplicates, matching on-screen order.
- [ ] The five modules cover, verifiably in their content: `calc` `min` `max` `clamp`;
      `[attr=]` `^=` `$=` `*=` `|=` and ` i`; `list-style-type` `::marker`
      `border-collapse` `border-spacing`; `text-overflow: ellipsis` `text-transform`
      `letter-spacing` `white-space`; `translate` `rotate` `scale` `skew`
      `transform-origin` `perspective`.
- [ ] Every new writing exercise validates with `css-rules` and its reference scores 100%.
- [ ] `shuffle.test.ts` still shows no answer slot holding ≥50% of correct answers.
- [ ] No text or example traceable to W3Schools; examples grounded in our own product.
