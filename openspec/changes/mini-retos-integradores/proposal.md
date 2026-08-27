# Proposal — mini-retos-integradores

Created: 2026-08-27
Status: **proposed — awaiting spec**

## Intent

Add **one integrating challenge per module** to the CSS track: a new,
multi-step, self-graded exercise that closes a module by making the student use
several of its concepts together in one task.

Modelled on the W3Schools Code Challenge (navigated 2026-08-27), with one
deliberate departure — see *The solution is locked*.

## The problem, in the plan's words

> **El challenge inmediato.** Un desafío chico y autocorregido después de cada
> lección, no un paquete de 8 ejercicios al final del módulo. El tema se
> practica mientras está caliente. Hoy nosotros acumulamos todo al final: se
> pierde el momento.
> — `plan-mejoras-css.md` §2

A module today is 3-6 lessons and then 6-11 separate exercises, each drilling one
thing. Nothing asks the student to put the module together. A student can pass
all eleven `especificidad` exercises one at a time and never once resolve a real
cascade conflict end to end.

## Scope

**The 19 required CSS modules.** They are the minimum path and the only ones the
certificate counts. The 11 optional ones follow later, as their own change.

**Nothing existing is touched.** The current 262 exercises stay exactly as they
are, keeping their ids, their prompts and their XP. Students have already
completed 5 349 exercises in production; a renumbering or a rewrite would
invalidate real work. The challenge is **added**, never a replacement.

## Decisions taken by the instructor, 2026-08-27

### One per module, not one per lesson

The plan says one per lesson; W3Schools does one per topic group. Our modules
are roughly a W3Schools group, so **one per module** — and it is *integrating*
by definition: a per-lesson challenge can only test one concept, which is what
the existing exercises already do.

### It coexists with the exercises that already exist

Additive. See *Scope*.

### The solution is LOCKED, and this is the departure from W3Schools

Measured: W3Schools shows the Solution tab beside the editor from page load. No
attempt required, no unlock. One click gives the complete solved code.

That turns the one exercise most worth struggling with into copy-paste, and it
is the same objection `plan-mejoras-css.md` §2 already raises against the site's
recipe pages.

**Here the reference solution appears only after the student completes the
challenge**, as something to compare their own answer against. A student who is
stuck is not abandoned: `hint` and `explanation` already render in all eight
exercise components and stay available throughout.

This is not a new field. `Exercise.referenceSolution` already exists — measured
in exactly 3 module files, all JavaScript, zero CSS, and rendered to **nobody**.
It exists so a data guard can prove an exercise is passable. This change switches
it on for an audience it was never shown to.

### It counts for the certificate

The rule is already "every exercise of every required module". The challenge is
an exercise of a required module, so it counts, with no new code and no concept
of a second-class exercise.

**Consequence, stated plainly:** the required CSS path goes from **168 to 187**
exercises, and every student not yet awarded has their bar raised by 19. Nobody
holds a certificate yet, so nothing issued is affected — and this is precisely
the hazard the `certificados-por-ruta` snapshot exists to survive.

### XP: double the module's highest

An integrating challenge that pays the same as a one-line quiz is the worst deal
in the module, and it will simply not be done.

Measured: `xpReward` across the repo is 10/15/20/25/30/40, and 17 of the 19
required modules top out at 30. So the rule yields **60 XP** almost everywhere
(40 for `que-es-css`, 80 for `proyecto-cv-css`).

## Risks

### ~~The XP jump is bigger than it looks — 34 %~~ CORRECTED, and it was wrong

An earlier version of this section claimed the change would move students up
belts "for work they have not done", off a measured 34 % rise.

**Both halves were wrong.**

Adding exercises grants nobody XP retroactively — a student's XP is the sum of
what they completed, and a new exercise is worth 0 until it is done. **No
student changes belt. The leaderboard does not move.** And the 34 % was measured
against the required CSS path alone; against the whole curriculum the 19
challenges are **+7.7 %** (14 750 → 15 890 XP across 106 modules).

The XP consequence of this change is therefore: the ceiling rises, nothing else.

**A real defect surfaced while measuring it, and it is NOT this change's to
fix.** Belt thresholds are absolute numbers, so every content addition makes them
relatively cheaper on its own. Measured today: Gran Maestro asks 11 000 of the
14 750 available — **74.6 % of the entire six-track curriculum** — and these 19
challenges alone drop it to 69.2 %. Phases 1-3 of `plan-mejoras-css.md` (12 more
modules) would drop it again, with nobody deciding it.

Pegging belts to a fraction of available XP instead of a fixed number would fix
that durably, and it carries its own hazard — a recomputed threshold can move a
student DOWN a belt when content lands, so a rank would have to never regress.

That touches all six tracks and every existing student. **Out of scope here, by
instructor decision 2026-08-27; it gets its own change.**

### `css-rules` has to carry a multi-step task

`validacion-curriculum.test.ts` forbids `validation.type: "includes"` for CSS, so
grading must be `css-rules`. It checks several selector→declaration rules at
once, which is the right shape — but a four-step challenge is a bigger
expectation set than anything currently written, and an over-strict one ships an
unpassable exercise that reads as the student's mistake. `referenceSolution`
must be proven to score 100 against the exercise's own validation, the same
guard `js-behavior` already carries.

### Nineteen pieces of teaching content

The schema and the renderer are small. Nineteen genuinely integrating challenges
are not, and they are pedagogical judgment, not code. Delivery must slice this.

## Non-goals

- The 11 optional CSS modules · the other five tracks.
- Rewriting, renumbering or removing any existing exercise.
- A per-lesson challenge, and the `afterLesson` anchor built for it (PR #38,
  closed unmerged).
- An ungated Solution tab.
