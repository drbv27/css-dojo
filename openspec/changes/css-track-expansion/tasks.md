# Tasks: css-track-expansion

Phase: `tasks` · Depends on `proposal.md`, `design.md`,
`specs/css-track-sections/spec.md`, `specs/css-track-content/spec.md`

Seven slices. Each ends green on `npm run test:run`, `npx tsc --noEmit`,
`npm run build` (E2E and lint on the module-content slices too). Order:
1 sections → 2 renumber → 3a math-functions → 3b advanced-text →
3c attribute-selectors → 3d lists-and-tables → 3e transforms.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | Slice 1: ~110–140 · Slice 2: ~180–240 · 3a–3e: ~650–790 each · **Total ~3,500–4,300** |
| Configured review budget (this session) | 800 lines |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 7 chained PRs, one per slice below |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending — instructor must pick stacked-to-main / feature-branch-chain / size:exception |

```text
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High
```

Slice 1 lands first: cheapest, and both renderers already skip empty
categories, so the six generic sections vanish without a hole. It does NOT ship
with zero on-screen change and it does NOT leave `order` alone -- see the
measured result at the end of Phase 1. The category grouping and the `order`
numbers are one fact: the guard compares the grouped walk position against
`order`, so flipping one without the other is red. Slice 2 lands second: it freezes the final relative sequence and the
rewritten guard, so every module PR after it lands against a test that
already knows the shape it must satisfy. 3a–3e follow in ascending slot order
(7, 9, 13, 20, 22) — math-functions first because `clamp()` is the
highest-value gap named in the proposal.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 sections | 9 `css-*` categories replace 6 generic, + the 6 `order` moves the guard forces | PR 1 | `npx vitest run src/data/modules/categorias-panel.test.ts src/data/modules/tipos-ejercicio.test.ts` | N/A — no route/runtime change, data+type only | `git revert`: restores 6 categories + 2 test lines |
| 2 renumber | Final 25-module relative order + guard rewrite | PR 2 | `npx vitest run src/data/modules/orden-curriculum-css.test.ts` | N/A — no route/runtime change | `git revert`: restores 25 `order` numbers + 1 test file |
| 3a math-functions | New module at slot 7 | PR 3 | `npx vitest run src/data/modules/` | `npm run test:e2e -- --grep "modulos"` | delete `26-math-functions.ts`, revert `order` shifts + `index.ts` import |
| 3b advanced-text | New module at slot 9 | PR 4 | same as 3a | same as 3a | delete `27-advanced-text.ts`, revert shifts |
| 3c attribute-selectors | New module at slot 13 | PR 5 | same as 3a | same as 3a | delete `28-attribute-selectors.ts`, revert shifts |
| 3d lists-and-tables | New module at slot 20 | PR 6 | same as 3a | same as 3a | delete `29-lists-and-tables.ts`, revert shifts |
| 3e transforms | New module at slot 22 | PR 7 | same as 3a | same as 3a | delete `30-transforms.ts`, revert shifts |

---

## Phase 1 — Slice 1: sections (PR 1/7, ~110–140 lines)

- [x] 1.1 `src/types/index.ts`: add 9 members to `ModuleCategory` —
      `css-fundamentos`, `css-caja`, `css-texto`, `css-selectores`,
      `css-layout`, `css-visual`, `css-responsive`, `css-herramientas`,
      `css-proyecto` (spec `css-track-sections` Req. 1). Do not add
      `css-oficio`.
- [x] 1.2 `src/data/moduleCategories.ts`: add 9 `CATEGORY_META` entries, each
      with a `color` distinct from the other 8 (Req. 2, Scenario 2.1).
- [x] 1.3 `src/data/moduleCategories.ts`: set
      `DOJO_CATEGORY_ORDER.css = [...9 css-* in Req. 3 order, ...6 existing
      generic]` — additive only, so typecheck and `categorias-panel.test.ts`
      stay green with zero UI change (both renderers skip
      `catModules.length === 0`).
- [x] 1.4 Flip the `category:` line in each of the 25 files under
      `src/data/modules/[01-25]-*.ts` to its `css-*` value per spec Req. 3's
      table (e.g. `box-model` → `css-caja`, `proyecto-cv-css` →
      `css-proyecto`).
- [x] 1.5 `src/data/moduleCategories.ts`: delete the 6 generic members
      (`intro`, `intermediate`, `advanced`, `preprocessors`, `frameworks`,
      `project`) from `DOJO_CATEGORY_ORDER.css` and `CATEGORY_META`; delete
      them from `ModuleCategory` in `src/types/index.ts`. `npx tsc --noEmit`
      is the proof nothing else references them (Req. 1, Scenario 1.2).
- [x] 1.6 **GUARD REWRITE (fails loudly if wrong)**
      `src/data/modules/categorias-panel.test.ts`: change
      `CLOSING_CATEGORY.css` from `"project"` to `"css-proyecto"` — the one
      line the proposal wrongly called "Unchanged" (spec Req. 6, Scenario
      6.1). Touch nothing else in the file.
- [x] 1.7 **GUARD REWRITE (fails loudly if wrong)**
      `src/data/modules/tipos-ejercicio.test.ts:58`: replace
      `m.category === "preprocessors"` with a slug-pinned check for
      `sass-fundamentos` and `sass-avanzado` only (NOT `css-herramientas`,
      which also holds Bootstrap/Tailwind). Prevents
      `expect(preprocesadores.length).toBeGreaterThan(0)` from silently
      becoming `0 > 0`.
- [x] 1.8 **GUARD REWRITE (interim, superseded by 2.2)**
      `src/data/modules/orden-curriculum-css.test.ts`: minimally swap the
      hardcoded `ORDEN_CATEGORIAS` list from the 6 generic names to the 9
      `css-*` names, just enough to stay green after 1.4–1.5. Do not derive
      it from `DOJO_CATEGORY_ORDER` yet — that is task 2.2.
- [x] 1.9 `src/data/modules/index.ts:125`: fix the stale comment ("nada
      ordena por el campo `order`") — line 156 ends in
      `.sort((a, b) => a.order - b.order)`, so the array literal order is
      documentary only.
- [x] 1.10 Verify: `npm run test:run`, `npx tsc --noEmit`, `npm run lint`,
      `npm run build` all green. Manually check `/modulos` and
      `/teacher/modulos` show identical CSS listings to before this slice.

**Done when:** 9 `css-*` categories exist, 6 generic ones are gone, and the
listing shows the same 25 modules grouped into the 9 sections, each in its own
colour, numbered 1..25 with no gaps.

**Resultado del slice 1 (medido, no estimado).** Verde en los cuatro gates.
213 lineas cambiadas contra un forecast de 110-140. Tres desviaciones, todas
con evidencia de shell:

1. **El slice 1 SI toca `order`, contra design.md D6.** El test
   `la categoria no contradice el orden` arma el walk agrupando por
   `ORDEN_CATEGORIAS` y compara la POSICION contra el campo `order`. Con las
   secciones nuevas y los numeros viejos daba 6 inconsistencias, asi que las
   categorias y los `order` son un solo hecho, no dos. Se movieron los 6
   minimos: dimensiones 7 -> 6, tipografias 6 -> 7, transiciones 18 -> 17,
   variables 19 -> 18, shadows 20 -> 19, media-queries 17 -> 20. Son los mismos
   valores de la secuencia final de D2, asi que no hay trabajo tirado y la
   tarea 2.1 queda con menos por hacer.
   (El orden INTRA-seccion lo deriva el test del array, no de la tabla de la
   spec Req 3, y por eso `css-layout` paso sin tocar nada. La tarea 2.1 todavia
   debe reordenar `css-layout` y `css-visual` para que coincidan con Req 3.)

2. **El techo del ledger no estaba "acotado pero no fijado": era exacto.** El
   valor real en main medido con shell es EXACTAMENTE 24, contra un techo de
   `toBeLessThanOrEqual(24)`. Cero margen. Las tareas 2.3 y 2.4 asumian holgura
   y no habia.

3. **El ledger subio a 26 y se resolvio afinando el patron, no borrando
   contenido.** Los 6 `order` movidos dejaron el conteo en 26: sale 1 caso
   (media-queries/`transition:`) y entran 3 -- `@media` en
   transiciones-animaciones (x2), `@media` en variables-css (x1) y
   `text-align:` en dimensiones (x1). Los dos primeros son
   `prefers-reduced-motion` y `prefers-color-scheme: dark`, que NO son
   referencias adelantadas al modulo responsive: son accesibilidad y tema, se
   ensenan donde estan. El patron era `/@media/` a secas. Ahora exige
   min/max-width/height u orientation, con UNA definicion compartida por los
   dos tests que miran `@media`. Ledger medido despues: **23**, con cero casos
   de `@media`, o sea que ningun modulo usa una media query responsive antes de
   tiempo. El techo baja de 24 a 23.
   Decision del instructor (consultada, no inventada): afinar el patron. La
   alternativa de D4 -- borrar las referencias -- habria quitado la
   accesibilidad de `transiciones-animaciones` y el dark mode de
   `variables-css`, que son los mejores ejemplos de esos dos modulos.

Commits: paso A (agregar), paso B (voltear + guards + ledger), paso C (borrar
las genericas, con `tsc` como prueba). Cada uno verde por su cuenta.


---

## Phase 2 — Slice 2: renumber (PR 2/7, ~180–240 lines)

- [ ] 2.1 Renumber `order:` in the 25 `src/data/modules/[01-25]-*.ts` files to
      the **final relative sequence** (design D2): 1 que-es-css … 20
      media-queries … 25 proyecto-cv-css, per the list in `design.md` §D2.
      Every module changes at most one line.
- [ ] 2.2 **GUARD REWRITE (fails loudly if wrong)**
      `src/data/modules/orden-curriculum-css.test.ts`: full rewrite per
      spec `css-track-sections` Req. 5 —
      (a) `ORDEN_CATEGORIAS` now imports `DOJO_CATEGORY_ORDER.css` instead of
      a hardcoded list (Scenario 5.1);
      (b) replace the `referenciados` ledger + `length === cssModules.length`
      with one pinned `SECUENCIA` array of the 25 slugs in teaching order,
      asserted three ways — equals `cssModules.map(m => m.slug)`, each
      `order` equals index + 1, and grouping by `DOJO_CATEGORY_ORDER.css`
      reproduces the same walk (D3);
      (c) keep `posicionDe` and all 9 pedagogical `it()` blocks verbatim
      (Scenario 5.3);
      (d) correct the docstring's `IMPORTANT:` paragraph to match the fixed
      `index.ts:156` comment from task 1.9.
- [ ] 2.3 Measure the forward-reference ledger's true `casos.length` (design
      D4, open question) before this slice's edits, using the same file's
      `@media`/`transition:` pattern search. Record the before value.
- [ ] 2.4 Re-measure `casos.length` after 2.1–2.2. If it rose above the
      pre-slice value, remove the newly-counted forward references from
      `18-transiciones-animaciones.ts` / `19-variables-css.ts` content —
      never raise the `toBeLessThanOrEqual(24)` ceiling (design D4 decision).
- [ ] 2.5 Verify: `npm run test:run`, `npx tsc --noEmit`, `npm run lint`,
      `npm run build` all green.

**Done when:** the 25-module CSS track shows the final relative order and the
rewritten guard is strictly stronger than the one it replaced.

---

## Phase 3a — math-functions, slot 7 (PR 3/7, ~650–790 lines)

- [ ] 3a.1 Create `src/data/modules/26-math-functions.ts` following the
      "Authoring a CSS module" template in this file's Appendix and spec
      `css-track-content` Req. 7 row "Math functions": `calc()`, `min()`,
      `max()`, `clamp()`, at least one example mixing two units in one
      expression (e.g. `calc(100% - 2rem)`), `category: "css-caja"`,
      `dojo: "css"`.
- [ ] 3a.2 Shift `order:` +1 for the 19 modules currently at slot ≥7 in the
      slice-2 sequence (tipografias through proyecto-cv-css), so
      math-functions lands at `order: 7`.
- [ ] 3a.3 Register the module in `src/data/modules/index.ts`: import and
      insert in the CSS block at the position matching its `order`.
- [ ] 3a.4 Verify: `npm run test:run`, `npx tsc --noEmit`, `npm run lint`,
      `npm run build`, `npm run test:e2e` all green. Confirm
      `tipos-ejercicio.test.ts`'s "sin escribir" count did not exceed 63.
- [ ] 3a.5 Rollout: after merge and manual Coolify redeploy, enable
      `math-functions` per cohort in `/teacher/modulos` (design D7 — no
      `ModuleSettings` doc means blocked; do not skip this step and do not
      attempt it before redeploy).

---

## Phase 3b — advanced-text, slot 9 (PR 4/7, ~650–790 lines)

- [ ] 3b.1 Create `src/data/modules/27-advanced-text.ts` per spec Req. 7 row
      "Advanced text": full `text-decoration` (line/style/color/thickness),
      `text-transform`, `letter-spacing`, `word-spacing`, `text-indent`,
      `white-space`, `text-overflow: ellipsis` (with the
      `white-space`+`overflow`+`text-overflow` combination demonstrated
      together), `text-shadow`. `category: "css-texto"`.
- [ ] 3b.2 Shift `order:` +1 for the 18 modules at slot ≥9 in the current
      sequence, landing advanced-text at `order: 9`.
- [ ] 3b.3 Register in `src/data/modules/index.ts`.
- [ ] 3b.4 Verify: same 6 commands as 3a.4.
- [ ] 3b.5 Rollout: same as 3a.5, slug `advanced-text`.

---

## Phase 3c — attribute-selectors, slot 13 (PR 5/7, ~650–790 lines)

- [ ] 3c.1 Create `src/data/modules/28-attribute-selectors.ts` per spec Req. 7
      row "Attribute selectors" and Req. 3: `[attr=]`, `^=`, `$=`, `*=`,
      `|=`, the case-insensitive ` i` flag. `category: "css-selectores"`.
      Every attribute selector in `targetCSS`/lesson code uses **double
      quotes** (`[href^="https"]`) — `normalizarSelectores` does not
      normalize quote style (Req. 3, Scenario 3.1). Where the exercise's
      purpose is choosing the right operator rather than writing a selector,
      prefer `quiz`/`drag-drop` over `css-rules` (Scenario 3.2).
- [ ] 3c.2 Shift `order:` +1 for the 15 modules at slot ≥13, landing
      attribute-selectors at `order: 13` (after `pseudo-elementos`, before
      `especificidad`).
- [ ] 3c.3 Register in `src/data/modules/index.ts`.
- [ ] 3c.4 Verify: same 6 commands as 3a.4.
- [ ] 3c.5 Rollout: same as 3a.5, slug `attribute-selectors`.

---

## Phase 3d — lists-and-tables, slot 20 (PR 6/7, ~650–790 lines)

- [ ] 3d.1 Create `src/data/modules/29-lists-and-tables.ts` per spec Req. 7
      row "Lists and tables": `list-style-type`/`position`/`image`,
      `::marker`, `border-collapse`, `border-spacing`, column widths, a
      horizontal-scroll technique for a table on mobile. `category:
      "css-visual"`. At least one exercise builds a styled table or list
      from scratch (`live-editor` or `visual-match`).
- [ ] 3d.2 Shift `order:` +1 for the 10 modules at slot ≥20, landing
      lists-and-tables at `order: 20` (first in `css-visual`).
- [ ] 3d.3 Register in `src/data/modules/index.ts`.
- [ ] 3d.4 Verify: same 6 commands as 3a.4.
- [ ] 3d.5 Rollout: same as 3a.5, slug `lists-and-tables`.

---

## Phase 3e — transforms, slot 22 (PR 7/7, ~650–790 lines)

- [ ] 3e.1 Create `src/data/modules/30-transforms.ts` per spec Req. 7 row
      "Transforms": `translate`, `rotate`, `scale`, `skew`,
      `transform-origin`, combining transforms, a look at
      `perspective`/`rotateY`, and an explicit statement of why
      transform/opacity are cheap to animate — `transiciones-animaciones`
      builds on this claim. `category: "css-visual"`.
- [ ] 3e.2 Shift `order:` +1 for the 9 modules at slot ≥22, landing transforms
      at `order: 22` (before `transiciones-animaciones`).
- [ ] 3e.3 Register in `src/data/modules/index.ts`.
- [ ] 3e.4 Verify: same 6 commands as 3a.4. This is the final slice — also
      confirm `orden-curriculum-css.test.ts`'s `SECUENCIA` now holds all 30
      slugs and `order` runs 1..30 with no gaps (spec `css-track-sections`
      Req. 4, Scenarios 4.1–4.4).
- [ ] 3e.5 Rollout: same as 3a.5, slug `transforms`.

---

## Appendix — Authoring a CSS module (reference for 3a.1–3e.1)

Per `design.md` §D5: files `26-…ts`–`30-…ts`, do not renumber `01-`–`25-`.
IDs follow the **file** prefix (`26-leccion-01`, `26-ej-01`). `lessons[].order`
and `exercises[].order` each 1..n, no gaps, no duplicates. `dojo: "css" as
const`. `icon` is decorative free-form. ≥1 `live-editor`/`visual-match` per
module. `validation.type` ∈ `css-rules`\|`html-structure`\|`quiz`\|`drag-drop`
— never `includes`/`visual`; an `html-structure` exercise also needs a
`REFERENCIAS_HTML_EN_CSS` entry. Spanish text fully accented
(`acentuacion.test.ts`). No W3Schools text/examples/ordering — author fresh
examples, preferably grounded in Ana Martinez's CV project.

## Deferred (not designed, out of this change)

- **Fase 2**: web typography, overflow, inheritance/global values, images and
  media.
- **Fase 3**: responsive images/video, visual accessibility, DevTools
  debugging. Also where `css-oficio` gets its first member.
- **Fase 4**: interleaved lesson → challenge pattern (`Exercise` schema change
  + renderer work).
- Filename renumbering (`01-`…`25-` vs `order`) — known cosmetic debt, not
  addressed here.
