# Exploración — mini-retos-integradores

Measured 2026-08-27. Every number below came from running against the real
curriculum or from navigating the reference site, never from a summary.

## What a mini-reto is, and how that got mis-defined once already

`plan-mejoras-css.md` §2, "Lo bueno, y hay que copiarlo":

> **El challenge inmediato.** Un desafío chico y autocorregido después de cada
> lección, no un paquete de 8 ejercicios al final del módulo.

A **new** exercise. An earlier attempt at this work read §5 instead — the effort
table, which says *"intercalar"* and *"0 módulos nuevos"* — and built a
redistribution of the existing exercises. That PR (#38) was closed unmerged.

**The rule that came out of it: a summary or an effort table is not a
definition.** Cite the paragraph that defines the WHAT, not the one that
estimates the COST.

## What W3Schools actually does, navigated 2026-08-27

`css/css_border.asp` → sidebar group `CSS Borders`: Border Style · Border Width ·
Border Color · Border Sides · Border Shorthand · Rounded Borders · **Code
Challenge**.

- **One per topic GROUP**, at the end — not one per lesson.
- **Multi-step**: four numbered instructions inside a single exercise.
- Full editor, **Check Code** button, **Solution** tab.
- **Integrating**: solid, dashed, shorthand and border-radius in one task.

Note the plan and the reference disagree: the plan says one per *lesson*, the
site does one per *group*. Our modules are roughly a W3Schools group.

### The Solution tab is ungated

Measured: the Solution tab sits beside Code from the moment the page loads. No
attempt required, no unlock, no delay. One click reveals the complete solved
HTML and CSS.

That collides with "conceptos > código" — the same objection the plan already
raises against the site's recipe pages.

## The CSS track as it stands

| | |
|---|---|
| modules | 30 |
| lessons | 121 |
| exercises | **262** |
| required modules | 19, **168** exercises |
| exercises per module | **6 to 11** — never a flat 8 |
| lessons per module | 3 to 6 |
| modules already using `live-editor` | **29 of 30** |
| modules already using `visual-match` | 25 of 30 |

`live-editor` is the type a multi-step integrating challenge needs, and it is
already the norm rather than a new capability.

## The three help levels, and the one that is switched off

`Exercise` already carries all three. Measured in `src/`:

| field | in the type | rendered to the student |
|---|---|---|
| `hint` | yes | **yes**, in all 8 exercise components |
| `explanation` | yes | **yes** |
| `referenceSolution` | yes | **no** — read only by a data guard |

`referenceSolution` appears in exactly **3 module files**, all JavaScript, and
**zero** CSS ones. It exists to prove an exercise is passable, not to help
anyone. So "add a Solution" is not a new field: it is switching on a field that
is already there, for an audience it was never shown to.

## What this does to the certificate

One new exercise in each of the 19 required modules moves the required CSS path
from **168 to 187** exercises.

Everyone not yet awarded has their bar raised. That is correct, and it is exactly
the hazard `certificados-por-ruta` built the snapshot for — an awarded
certificate keeps the counts it was awarded against. No certificate has been
issued yet, so nothing existing is affected.

## Guards this will trip, by design

- `nivel-curriculum.test.ts` pins the CSS classification by slug and the set of
  tracks. Adding exercises does not trip it; adding a module would.
- `validacion-curriculum.test.ts` **forbids** `validation.type: "includes"` for
  CSS. A multi-step challenge must be graded with `css-rules`.
- `orden-curriculum-css.test.ts` pins module count and category list.
- `tipos-ejercicio.test.ts` asserts no module can be passed without producing
  something.

## Open questions for the proposal

1. One integrating challenge per module — the instructor has settled this.
2. Coexists with the existing 6-11 exercises — settled; student progress must
   not be destroyed.
3. `referenceSolution` shown **behind a lock** — settled; the unlock condition is
   not.
4. Scope: all 30 CSS modules, or the 19 required first?
5. Does the challenge carry more XP than an ordinary exercise?
