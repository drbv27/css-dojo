# Spec Delta: css-track-content

Phase: `spec` · Capability: `css-track-content` (new) · Change:
`css-track-expansion`

Governs what a new CSS module must contain and satisfy to ship: lessons,
exercise mix, grading type, and authoring constraints. Covers the five Fase 1
modules: math functions, attribute selectors, lists and tables, advanced
text, transforms.

RFC 2119 keywords are used as defined.

---

## ADDED Requirement 1 — Shape and producibility of a new module

Each new module SHALL be a `ModuleData` object with `lessons.length >= 1` and
`exercises.length >= 1` (target: ~4 lessons, ~8 exercises), and MUST include
at least one `live-editor` or `visual-match` exercise, satisfying
`tipos-ejercicio.test.ts`'s non-increasing "nothing to write" and "nothing to
produce" thresholds.

### Scenario 1.1 — Every new module is producible

- **Given** the five new modules
- **When** `tipos-ejercicio.test.ts` runs
- **Then** none MUST fall into "solo reconocer" (quiz/drag-drop only), and
  the "sin escribir" count MUST NOT increase past its current ceiling of 63

### Scenario 1.2 — Lessons carry real content

- **Given** any new module's lessons
- **Then** each lesson MUST have non-empty `content` and, where the concept
  is demonstrated in code, a `codeExample`

---

## ADDED Requirement 2 — Grading is structural, never substring

Every new exercise's `validation.type` MUST be one of `css-rules`,
`html-structure`, `quiz`, or `drag-drop`. `includes` and `visual` MUST NOT be
used, per `validacion-curriculum.test.ts`.

### Scenario 2.1 — No `includes` in the new modules

- **Given** the five new modules' exercises
- **When** `validation.type` is inspected
- **Then** none MUST equal `"includes"` or `"visual"`

### Scenario 2.2 — Every `css-rules` exercise has a reference that scores 100

- **Given** an exercise graded with `css-rules`
- **When** its own `targetCSS` is compared against itself with
  `compararReglas`
- **Then** the score MUST be 100, and the target MUST NOT be passable by
  prose or by swapping two rule bodies

---

## ADDED Requirement 3 — Attribute-selector quoting is disambiguated

`normalizarSelectores` (`src/lib/cssRules.ts`) lowercases and collapses
whitespace only; it does NOT normalize quote style, so
`[href^="https"]` and `[href^='https']` are different selector keys.

### Scenario 3.1 — One quote style, consistently

- **Given** the attribute-selectors module's `css-rules` exercises
- **When** `targetCSS` and any lesson code example use attribute selectors
- **Then** every occurrence MUST use double quotes (`[href^="https"]`), never
  single quotes, so a student's differently-quoted-but-equivalent answer is
  not silently marked wrong

### Scenario 3.2 — Syntax recognition falls back to quiz/drag-drop

- **Given** an exercise whose PURPOSE is choosing the right operator
  (`^=`/`$=`/`*=`/`|=`) rather than writing a selector from scratch
- **When** the exercise type is chosen
- **Then** it MAY use `quiz` or `drag-drop` instead of `css-rules`, avoiding
  the quoting trap entirely

---

## ADDED Requirement 4 — Correct Spanish and unbiased quizzes

All new lesson and exercise text MUST use correct Spanish accentuation
(`acentuacion.test.ts`). No new quiz MUST push any answer slot to hold ≥50%
of correct answers across the curriculum (`shuffle.test.ts`).

### Scenario 4.1 — Accents are present

- **Given** the five new modules' Spanish text
- **When** `acentuacion.test.ts` runs
- **Then** it MUST pass with no missing tilde or `ñ`

### Scenario 4.2 — No positional bias reintroduced

- **Given** the real curriculum including the five new modules' quizzes
- **When** `shuffle.test.ts` computes correct-answer distribution per slot
- **Then** no slot MUST hold ≥50% of correct answers

---

## ADDED Requirement 5 — Anti-plagiarism

The topic inventory is informed by reviewing W3Schools' CSS reference. No
text, no example, and no literal page ordering MUST be copied. Every example
MUST be authored by us; examples SHOULD ground in Ana Martinez's CV, the
running product built in class, rather than generic placeholders.

### Scenario 5.1 — Examples are our own

- **Given** any new lesson's `codeExample` or exercise `targetCSS`
- **Then** it MUST NOT be traceable to a W3Schools example verbatim or by
  trivial renaming, and SHOULD reference the CV project's existing markup
  where a realistic example is needed

---

## ADDED Requirement 6 — Concepts over recipes

Each new module SHALL teach a reusable concept, never a copy-paste recipe.
Recipe patterns (tooltips, modals, sprites, pagination, dropdowns, image
galleries) MUST NOT appear as lessons in these five modules; if a recipe
idea is valuable, it enters as a `reto`-style exercise inside an EXISTING
module, or not at all.

### Scenario 6.1 — No recipe lessons

- **Given** the five new modules
- **When** their lesson titles and content are reviewed
- **Then** none MUST teach a named UI-widget recipe as its subject

---

## ADDED Requirement 7 — Per-module content and acceptance criteria

| Module | Section | Position (Requirement 4, `css-track-sections`) | Must teach | Acceptance criteria |
|---|---|---|---|---|
| Math functions | `css-caja` | 7, after `unidades-css` | `calc()`, `min()`, `max()`, `clamp()`; mixing two units in one operation | Content demonstrably covers all four functions AND at least one example mixes units (e.g. `calc(100% - 2rem)`) inside a single expression |
| Attribute selectors | `css-selectores` | 13, after `pseudo-elementos`, before `especificidad` | `[attr=]`, `^=`, `$=`, `*=`, `|=`, the case-insensitive ` i` flag | Content demonstrably covers all five operators and the `i` flag; quoting fixed per Requirement 3 |
| Lists and tables | `css-visual` | 20, first in section | `list-style-type`/`position`/`image`, `::marker`, `border-collapse`, `border-spacing`, column widths, a horizontal-scroll technique for a table on mobile | Content demonstrably covers all six items; at least one exercise produces a styled table or list from scratch |
| Advanced text | `css-texto` | 9, after `tipografias` | `text-decoration` (line/style/color/thickness), `text-transform`, `letter-spacing`, `word-spacing`, `text-indent`, `white-space`, `text-overflow: ellipsis`, `text-shadow` | Content demonstrably covers all eight properties, including the `white-space`+`overflow`+`text-overflow` combination needed for `ellipsis` to work |
| Transforms | `css-visual` | 22, before `transiciones-animaciones` | `translate`, `rotate`, `scale`, `skew`, `transform-origin`, combining transforms, `perspective`/`rotateY`, why transform+opacity are cheap to animate | Content demonstrably covers all listed items and explicitly states the transform/opacity performance point, which `transiciones-animaciones` builds on |

### Scenario 7.1 — Coverage is verifiable, not assumed

- **Given** each module's lessons and exercises
- **When** its listed properties/functions are searched for in lesson content
  or `targetCSS`
- **Then** each MUST appear at least once, matching the "Must teach" column

---

## ADDED Requirement 8 — Delivery: new modules ship blocked by default

`ModuleSettings` has no document for a new slug means blocked
(`src/lib/models/ModuleSettings.ts`). The five new slugs SHALL be invisible
to every cohort until a teacher enables them in `/teacher/modulos`.

### Scenario 8.1 — Invisible until enabled

- **Given** a cohort with no `ModuleSettings` document for
  `math-functions`
- **When** that cohort's student views `/modulos`
- **Then** the module MUST NOT appear, until a teacher creates an
  `enabled: true` document for that `(cohort, slug)` pair

---

## Non-goals, explicitly

- Fase 2 (web typography, overflow, inheritance/global values, images and
  media), Fase 3 (responsive images/video, visual accessibility, DevTools),
  and Fase 4 (interleaved lesson → challenge pattern, which needs a new
  optional field on `Exercise` plus renderer work) are OUT of scope.
- No change to auth, `ApprovalGate`, MongoDB models, XP, or the graders
  themselves.
