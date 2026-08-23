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

- [x] 2.1 Renumber `order:` in the 25 `src/data/modules/[01-25]-*.ts` files to
      the **final relative sequence** (design D2): 1 que-es-css … 20
      media-queries … 25 proyecto-cv-css, per the list in `design.md` §D2.
      Every module changes at most one line.
- [x] 2.2 **GUARD REWRITE (fails loudly if wrong)**
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
- [x] 2.3 Measure the forward-reference ledger's true `casos.length` (design
      D4, open question) before this slice's edits, using the same file's
      `@media`/`transition:` pattern search. Record the before value.
- [x] 2.4 Re-measure `casos.length` after 2.1–2.2. If it rose above the
      pre-slice value, remove the newly-counted forward references from
      `18-transiciones-animaciones.ts` / `19-variables-css.ts` content —
      never raise the `toBeLessThanOrEqual(24)` ceiling (design D4 decision).
- [x] 2.5 Verify: `npm run test:run`, `npx tsc --noEmit`, `npm run lint`,
      `npm run build` all green.
- [x] 2.6 **HALLAZGO DE LA REVISION DEL SLICE 1 (WARNING, deterministic,
      introduced).** El `MEDIA_RESPONSIVE` que el slice 1 introdujo en
      `orden-curriculum-css.test.ts` exige `min-width`/`max-width`/
      `min-height`/`max-height`/`orientation`, y NO matchea la sintaxis de rango
      moderna: `@media (width >= 48rem)` ni `@media (400px <= width <= 700px)`.
      Las dos son responsive por la definicion del propio comentario, y el
      patron viejo `/@media/` si las agarraba: el guard quedo mas preciso en un
      eje y mas debil en otro. Hoy no hay ningun caso (el ledger mide cero
      `@media`), asi que es un hueco prospectivo. Arreglo: la alternacion pasa a
      `width|height|orientation`, que subsume `min-`/`max-` por el `\b` despues
      del guion Y cubre el rango, sin volver a contar `prefers-reduced-motion`,
      `prefers-color-scheme` ni `print`. Queda mas fuerte que la version del
      slice 1 y que la original. Volver a medir el ledger despues.
- [x] 2.7 **HALLAZGO DE LA REVISION DEL SLICE 1 (SUGGESTION).** El requisito 2
      de `css-track-sections` -- los nueve colores distintos entre si -- no
      tiene ninguna asercion ejecutable: vive en un comentario de
      `moduleCategories.ts`. Agregar el test a `categorias-panel.test.ts`:
      comparar los `color` de las nueve entradas `css-*` de a pares y exigir que
      ninguno se repita. (El revisor no podia ver `globals.css`, que esta fuera
      del candidato; los diez tokens de color SI existen ahi, verificado con
      shell. El hueco es la falta de test, no un color inventado.)


**Done when:** the 25-module CSS track shows the final relative order and the
rewritten guard is strictly stronger than the one it replaced.

**Resultado del slice 2 (medido, no estimado).** Verde en los cuatro gates, 173
tests. 11 rutas, 154 lineas. Revision acotada aprobada SIN HALLAZGOS: linaje
`review-a7b1b8bcd83cff67`, riesgo medium, lente R3 Reliability, inspeccion
completa de las 11 rutas, recibo acuñado, compuertas pre-commit/pre-push/pre-pr
en allow.

- **El guard pasa de contar a ordenar, y esta PROBADO que muerde.** Intercambiar
  flexbox y css-grid DENTRO de `css-layout` hace fallar tres aserciones. El guard
  que reemplaza pasaba ese mismo cambio en verde: los 170 tests daban identico
  antes y despues de mover los 8 numeros. Esa ceguera es como se colaron las dos
  inversiones originales.
- **Ledger: 23 antes, 23 despues.** Neto cero, con dos movimientos que se
  cancelan: sale `propiedades-logicas` de la ventana de `display:flex` (14 -> 16)
  y entra `shadows-gradients-filters` con `transition:` x5 (19 -> 17, ahora un
  modulo antes de transiciones). Un salto de uno es anticipacion normal.
- **Los dos hallazgos del slice 1 quedaron cerrados.** El revisor confirmo por su
  cuenta que el regex corregido es un SUPERCONJUNTO ESTRICTO del anterior:
  `\bwidth\b` sigue matcheando `min-width` porque el guion no es caracter de
  palabra, asi que no se perdio ninguna forma que antes se detectaba, y ademas
  entra la sintaxis de rango. Verificado tambien a mano, caso por caso.
- **El revisor reviso la zona muerta temporal antes de que nadie preguntara** y
  concluyo que no hay riesgo: los tests nuevos referencian `ORDEN_CATEGORIAS`
  desde callbacks que corren despues de que el `describe` termina.


---

## Phase 3a — math-functions, slot 7 (PR 3/7, ~650–790 lines)

- [x] 3a.1 Create `src/data/modules/26-math-functions.ts` following the
      "Authoring a CSS module" template in this file's Appendix and spec
      `css-track-content` Req. 7 row "Math functions": `calc()`, `min()`,
      `max()`, `clamp()`, at least one example mixing two units in one
      expression (e.g. `calc(100% - 2rem)`), `category: "css-caja"`,
      `dojo: "css"`.
- [x] 3a.2 Shift `order:` +1 for the 19 modules currently at slot ≥7 in the
      slice-2 sequence (tipografias through proyecto-cv-css), so
      math-functions lands at `order: 7`.
- [x] 3a.3 Register the module in `src/data/modules/index.ts`: import and
      insert in the CSS block at the position matching its `order`.
- [x] 3a.4 Verify: `npm run test:run`, `npx tsc --noEmit`, `npm run lint`,
      `npm run build`, `npm run test:e2e` all green. Confirm
      `tipos-ejercicio.test.ts`'s "sin escribir" count did not exceed 63.
- [x] 3a.5 Rollout: after merge and manual Coolify redeploy, enable
      `math-functions` per cohort in `/teacher/modulos` (design D7 — no
      `ModuleSettings` doc means blocked; do not skip this step and do not
      attempt it before redeploy).

**Resultado del slice 3a (medido, no estimado).** Verde en los CINCO gates: 173
tests, `tsc --noEmit`, lint 0 errores, build y los 5 E2E. 22 rutas, 498 lineas
contra un forecast de 650-790. Revision acotada aprobada: linaje
`review-d92af024c0c35633`, riesgo medium, lente R3 Reliability, inspeccion
completa de las 22 rutas, recibo acuñado, tres compuertas en allow.

- **Un solo hallazgo, SUGGESTION, y contestado con numeros.** El revisor dijo que
  los tres `targetCSS` con funciones multi-argumento (`clamp(1.5rem, 6vw, 3rem)`,
  `min(760px, 100% - 3rem)`) no tienen asercion DENTRO del candidato. Tenia razon
  sobre el alcance. Pero el camino de parseo SI esta cubierto por un guard que no
  cambia y que por eso el revisor no podia ver: `validacion-curriculum.test.ts`
  corre `compararReglas` sobre el curriculum real y exige que la respuesta propia
  de cada ejercicio puntue 100. Medido aparte con el grader real:

  | variante | ej-03 | ej-06 | ej-07 |
  |---|---|---|---|
  | identico | 100 | 100 | 100 |
  | sin espacio tras comas | 100 | 100 | 100 |
  | espacios extra tras comas | 100 | 100 | 100 |
  | mayusculas | 100 | 100 | 100 |
  | reglas en orden inverso | 100 | 100 | 100 |
  | sin espacios en el guion | 67 | 100 | 75 |

  O sea: robusto a toda variacion legitima y estricto solo donde CSS es estricto.
  `calc(100%-4rem)` es CSS INVALIDO, asi que 67 y 75 son el resultado correcto, no
  un defecto. ej-06 da 100 porque `clamp()` lleva solo comas, sin operador.
- **La trampa de los espacios se ENSEÑA.** Leccion 01 tiene su propio bloque y el
  hint de ej-03 la nombra, para que nadie quede mal calificado por algo invisible.
- **Ledger 23 -> 23.** El modulo nuevo no aporta NINGUN caso. Busqueda literal:
  cero apariciones de `line-height`, `font-family`, `text-align`, `@media`,
  `display:flex`, `display:grid`, `var(--`, `transition:`, `box-shadow` y
  `linear-gradient`. Las tres primeras importan porque `tipografias` se fue al 8.
- **Cobertura del requisito 7:** calc() x31, min() x34, max() x12, clamp() x26, y
  la expresion de unidades mezcladas `calc(100% - 4rem)` x7.
- **`sin escribir` sigue en 63**, sin subir, porque el modulo trae 2 live-editor y
  1 visual-match. OJO: ese techo tampoco tiene margen, asi que cada modulo de
  3b-3e DEBE traer al menos uno de esos dos tipos.
- **Lo que la revision NO cubre y es del instructor:** si el contenido se entiende
  y si el nivel le sirve a la cohorte. Los tests prueban que parsea, que puntua
  100, que tiene tildes y que no adelanta conceptos. No prueban que se entienda.


---

## Phase 3b — advanced-text, slot 9 (PR 4/7, ~650–790 lines)

- [x] 3b.1 Create `src/data/modules/27-advanced-text.ts` per spec Req. 7 row
      "Advanced text": full `text-decoration` (line/style/color/thickness),
      `text-transform`, `letter-spacing`, `word-spacing`, `text-indent`,
      `white-space`, `text-overflow: ellipsis` (with the
      `white-space`+`overflow`+`text-overflow` combination demonstrated
      together), `text-shadow`. `category: "css-texto"`.
- [x] 3b.2 Shift `order:` +1 for the 18 modules at slot ≥9 in the current
      sequence, landing advanced-text at `order: 9`.
- [x] 3b.3 Register in `src/data/modules/index.ts`.
- [x] 3b.4 Verify: same 6 commands as 3a.4.
- [x] 3b.5 Rollout: same as 3a.5, slug `advanced-text`.

**Resultado del slice 3b (medido, no estimado).** Verde en los CINCO gates: 173
tests, `tsc --noEmit`, lint 0 errores, build y los 5 E2E. 21 rutas, 493 lineas.
Revision acotada aprobada **SIN HALLAZGOS**: linaje `review-ada5775b076e2cb4`,
riesgo medium, lente R3 Reliability, inspeccion completa de las 21 rutas.

- **La leccion 03 es el centro y por eso se llama "tres propiedades o ninguna".**
  `text-overflow: ellipsis` sola no hace nada: hacen falta `white-space: nowrap`,
  `overflow: hidden` y `text-overflow: ellipsis` juntas. La leccion las explica
  como una cadena en orden y dice que pasa si falta cada una. La combinacion
  aparece 12 veces en el archivo, que es el criterio de aceptacion del requisito 7.
- **Ledger 23 -> 23.** El modulo no aporta ningun caso.
- **`text-align`, `line-height` y `font-family` SI se usan, y es correcto.** El
  ledger los apunta a `tipografias`, que queda en el slot 8, y este modulo esta en
  el 9. Desde el 9 ya no son referencias adelantadas, y un modulo de texto los
  necesita. Y `text-shadow` tampoco cuenta: el patron es `\bbox-shadow`, otra palabra.
- **Los commits van partidos a proposito.** Primero el archivo del modulo sin
  registrar -- verde e invisible, porque ningun guard lo ve si no esta en
  ALL_MODULES -- y despues la mecanica de insercion. Sirve para leer el contenido
  aparte de los shifts, y deja disponible la opcion de revisar solo la mecanica en
  los slices que vienen. El instructor eligio revisar el candidato completo.
- **El revisor hizo dos chequeos que no se le pidieron y que valen:** verifico que
  `box-model` y `unidades-css`, ausentes del manifiesto, no quedaran con un `order`
  en colision; y escaneo el archivo por backticks sin escapar y por interpolaciones
  accidentales de template literal.

**DEFECTO ABIERTO DEL GUARD DE ACENTUACION, encontrado escribiendo este modulo.**
`acentuacion.test.ts` rechazo la frase "un ancho que limite". Ese `limite` es el
VERBO EN SUBJUNTIVO y va correctamente SIN tilde; el sustantivo `limite` es el que
la lleva. El test tiene esa palabra en su lista de "inequivocas por diccionario" y
no es inequivoca, que es exactamente la clase de caso que su propio docstring
excluye a proposito con `esta` y `solo`. El mismo falso positivo pega con
`habilite`, `deposite` y `milite` -- y `habilite` aparece seguido hablando de
habilitar modulos por cohorte. La frase se reformulo para no ampliar el alcance de
3b; el arreglo (sacar la palabra, o exigirla solo tras articulo) esta pendiente de
decision del instructor.


---

## Phase 3c — attribute-selectors, slot 13 (PR 5/7, ~650–790 lines)

- [x] 3c.1 Create `src/data/modules/28-attribute-selectors.ts` per spec Req. 7
      row "Attribute selectors" and Req. 3: `[attr=]`, `^=`, `$=`, `*=`,
      `|=`, the case-insensitive ` i` flag. `category: "css-selectores"`.
      Every attribute selector in `targetCSS`/lesson code uses **double
      quotes** (`[href^="https"]`) — `normalizarSelectores` does not
      normalize quote style (Req. 3, Scenario 3.1). Where the exercise's
      purpose is choosing the right operator rather than writing a selector,
      prefer `quiz`/`drag-drop` over `css-rules` (Scenario 3.2).
- [x] 3c.2 Shift `order:` +1 for the 15 modules at slot ≥13, landing
      attribute-selectors at `order: 13` (after `pseudo-elementos`, before
      `especificidad`).
- [x] 3c.3 Register in `src/data/modules/index.ts`.
- [x] 3c.4 Verify: same 6 commands as 3a.4.
- [x] 3c.5 Rollout: same as 3a.5, slug `attribute-selectors`.

**Resultado del slice 3c (medido, no estimado).** Verde en los CINCO gates, 173
tests. 18 rutas, 540 lineas. Revision acotada aprobada: linaje
`review-1a6d5cb250fd6cd7`, riesgo medium, inspeccion completa de las 18 rutas,
dos hallazgos, ninguno bloqueante.

**EL DEFECTO DEL GRADER, medido ANTES de escribir una linea.** `compararReglas`
sobre un target con selectores de atributo:

| Lo que escribe el alumno | Puntaje |
|---|---|
| `a[href^="https"]` comilla doble | 100 |
| `a[href^='https']` comilla simple | **0** |
| `a[href^=https]` sin comillas | **0** |

CERO, no 50. Y la forma sin comillas **es CSS valido**: las comillas son
opcionales cuando el valor es un identificador. El corrector puntua en 0 codigo
correcto. Alcance medido: exactamente 3 ejercicios en todo el repo, los tres de
este slice. Nada en produccion afectado. Va como cambio APARTE sobre
`normalizarSelectores`, no dentro de este slice, porque esa funcion respalda todo
ejercicio css-rules de todos los tracks y tocarla en medio de la cadena moveria
los baselines medidos (ledger 23, sinEscribir 63) de los que 3d y 3e dependen.

**Los dos hallazgos del revisor:**
- WARNING `icon: "SquareBrackets"`: acerto en el HECHO y erro en la CONSECUENCIA,
  y las dos quedaron verificadas. El token no existe en lucide-react. Pero el
  campo `icon` de un modulo NO SE RENDERIZA: `ICON_MAP` va sobre `NavItem.icon` y
  el `typeInfo.icon` del detalle es el icono del tipo de ejercicio. 56 modulos ya
  llevan tokens invalidos sin romper nada, que solo es posible porque el campo no
  se lee. Corregido a `Brackets` en un commit propio, por prolijidad.
- SUGGESTION sobre la cobertura de los tres `targetCSS`: el camino de parseo SI
  esta cubierto por `validacion-curriculum.test.ts`, fuera del candidato. Medido:
  los tres puntuan 100.

**Desviacion declarada del escenario 3.1:** la leccion 01 contiene comilla simple
y valor sin comillas, en el bloque que muestra las tres formas lado a lado, que es
el que ENSENA la trampa. Cada linea lleva comentario inline para que un
copiar-pegar se lleve la advertencia. Todos los `targetCSS` usan comilla doble.

**Ledger 23 -> 23.** Cobertura del requisito 7: `[required]` x9, `^=` x26, `$=`
x15, `*=` x8, `|=` x7, bandera ` i` x3. `sinEscribir` sigue en 63.


---

## Phase 3d — lists-and-tables, slot 20 (PR 6/7, ~650–790 lines)

- [x] 3d.1 Create `src/data/modules/29-lists-and-tables.ts` per spec Req. 7
      row "Lists and tables": `list-style-type`/`position`/`image`,
      `::marker`, `border-collapse`, `border-spacing`, column widths, a
      horizontal-scroll technique for a table on mobile. `category:
      "css-visual"`. At least one exercise builds a styled table or list
      from scratch (`live-editor` or `visual-match`).
- [x] 3d.2 Shift `order:` +1 for the 10 modules at slot ≥20, landing
      lists-and-tables at `order: 20` (first in `css-visual`).
- [x] 3d.3 Register in `src/data/modules/index.ts`.
- [x] 3d.4 Verify: same 6 commands as 3a.4.
- [x] 3d.5 Rollout: same as 3a.5, slug `lists-and-tables`.

**Resultado del slice 3d (medido, no estimado).** Verde en los CINCO gates, 173
tests. 12 rutas, 531 lineas. Revision acotada aprobada: linaje
`review-b7c14679638d2d80`, inspeccion completa de las 12 rutas, **un hallazgo que
era un defecto real y le pegaba al alumno**.

**EL HALLAZGO, aceptado completo.** El enunciado de `29-ej-04` decia *"una regla
para `'datos th, .datos td'`"*: al PRIMER selector le faltaba el punto de la clase.
Un alumno que copia el enunciado literal escribe `datos th`, que apunta a una
etiqueta `<datos>` inexistente, y su intento correcto se califica mal por una razon
que no puede ver ni depurar. Determinista, introducido por este slice. Corregido en
un commit propio ANTES del push, asi que el enunciado roto nunca llego a una
cohorte desplegada. Y se barrio el repo entero buscando el mismo error en todo
ejercicio `css-rules`: **cero casos mas**, era instancia unica y no una clase.

**NOTA DE PROCESO, porque cambio un juicio y conviene que quede.** El orquestador
habia argumentado DOS VECES por revisar solo el commit mecanico (~41 lineas) en
lugar del candidato completo, sobre la evidencia de que cuatro revisiones
anteriores no habian encontrado nada en el contenido de un modulo. El instructor
eligio el candidato completo las cuatro veces. Este hallazgo es el contraejemplo
exacto: con el alcance angosto, el defecto se publicaba. El argumento estaba mal.

**Ledger 23 -> 23.** Y por primera vez en la cadena, desde el slot 20
`display: grid`, `display: flex`, `text-align` y `line-height` habrian sido gratis,
porque flexbox (17), css-grid (18) y tipografias (8) quedan antes. No hicieron
falta: el scroll horizontal es `overflow-x: auto` mas `min-width`.

**Cobertura del requisito 7:** list-style-type x4, list-style-position x3,
list-style-image x3, `::marker` x14, border-collapse x15, border-spacing x12,
table-layout x5, overflow-x: auto x9, min-width x13. El criterio de aceptacion lo
cumplen 29-ej-04, 29-ej-06 y 29-ej-08. `sinEscribir` sigue en 63.


---

## Phase 3e — transforms, slot 22 (PR 7/7, ~650–790 lines)

**Corregido al arrancar 3e:** la tarea 3e.2 decia 9 modulos y son **8**. Contados
sobre el arbol real con 29 modulos: transiciones-animaciones 22 -> 23,
variables-css 23 -> 24, media-queries 24 -> 25, sass-fundamentos 25 -> 26,
sass-avanzado 26 -> 27, bootstrap-5 27 -> 28, tailwind-css 28 -> 29 y
proyecto-cv-css 29 -> 30. El forecast del diseno se escribio contra 25 modulos y
esa cuenta quedo vieja tras cuatro inserciones.

**Estado del rollout.** El instructor confirmo redeploy y habilitacion por
cohorte de `math-functions`, `advanced-text`, `attribute-selectors` -- este en
AMBAS cohortes -- y `lists-and-tables`, y aprobo el contenido de los cuatro.
Queda pendiente solo el de `transforms`: mergeado a main (cd3db52) y todavia sin
pushear, sin desplegar y sin habilitar.

**Resultado del slice 3e.** Los cinco gates verdes. Ledger 23 -> 23 y sinEscribir
63 -> 63, los dos techos quietos, con aporte CERO del modulo nuevo. Revision
acotada review-bd3b06c13ad3ca4e: un WARNING inferencial sobre el orden de
`transformsModule` dentro del literal de ALL_MODULES, cero blockers, y los tres
gates de entrega en allow. Ese WARNING queda como deuda aceptada a pedido del
instructor: no tiene efecto de comportamiento por el `.sort()` final del literal,
y corregirlo despues del recibo exigia autorizacion de mantenedor para reabrir un
linaje aprobado.


- [x] 3e.1 Create `src/data/modules/30-transforms.ts` per spec Req. 7 row
      "Transforms": `translate`, `rotate`, `scale`, `skew`,
      `transform-origin`, combining transforms, a look at
      `perspective`/`rotateY`, and an explicit statement of why
      transform/opacity are cheap to animate — `transiciones-animaciones`
      builds on this claim. `category: "css-visual"`.
- [x] 3e.2 Shift `order:` +1 for the 8 modules at slot ≥22, landing transforms
      at `order: 22` (before `transiciones-animaciones`).
- [x] 3e.3 Register in `src/data/modules/index.ts`.
- [x] 3e.4 Verify: same 6 commands as 3a.4. This is the final slice — also
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
