# Proposal — css-track-fase-2

Created: 2026-08-25
Status: **parked on data, not closed**

## What Phase 2 was supposed to decide

Phase 1 (`css-track-expansion`, archived) grew the CSS track from 25 to 30
modules: 121 lessons and 260 exercises. Phase 2's question follows from that
growth — a cohort facing 260 exercises sees a wall, so which modules are the
**required path** and which are **optional depth**?

The instructor settled a classification on 2026-08-24: **19 required / 11
optional**, with three deliberate departures from the pure criterion recorded in
`design.md`. That classification is **not reopened by this change.**

What was left open was everything downstream of it: where the distinction lives
in the data model, and whether the classification survives contact with what
students actually do.

## Why this is parked rather than done

**The classification is expert judgment, and the data cannot validate it yet.**

Production was measured read-only on 2026-08-25. The findings are in
`hallazgos.md`; two of them decide this proposal.

First, the four optional modules with zero progress — `math-functions` (7),
`attribute-selectors` (13), `lists-and-tables` (20), `transforms` (22) — look
like proof that students skip optional content. They are not. They were added on
2026-08-22 and 2026-08-23. Cohort 1 stopped working on 2026-08-12. **The modules
that would be the evidence are newer than the only cohort that finished.**

Second, and more uncomfortable: **the CSS track has no drop-off curve.** Cohort
1 puts 12 students on module 1 and stays flat at 9-11 all the way to module 28,
Sass and Bootstrap included. The funnel is `21 enrolled → 15 with any progress →
12 reach CSS module 1 → 9 sustain to module 28`. Students are lost at the
**entrance**, not along the way.

A 166-exercise path would not have helped the nine who finished, and the nine who
never started never see it. That does not make the classification wrong — cohort
1 never saw 30 modules, it finished before the expansion landed. **The wall the
classification solves has not yet existed for anyone.** Cohort 2 is the first to
face it, and it is now instrumented.

Building the field today would encode an unvalidated hypothesis into the data
model. Deferring costs nothing: the decision that was chosen (a field on
`ModuleData`, defaulted rather than required) stays equally cheap in a month, and
by then it can be made on evidence.

## What shipped under this change

Two pieces of work were done and merged, because both stand on their own
regardless of how the classification resolves.

**Instrumentation (PR #33).** `Progress` is written only when a student SUBMITS
an exercise, so a student who opens a module, reads it and leaves left no record
at all. With that collection alone, "skipped it" and "never opened it" were
indistinguishable — exactly the distinction the classification needs. `ModuleView`
now records the opening. This is what unparks the decision.

**The dynamic viewport units gap (PR #34).** `unidades-css` (5) taught the
`100vh` mobile problem, named `dvh` in one line of prose, and never practised it.
Measured before: `dvh` appeared once in all of `src/`; `svh`, `lvh`, `svw` and
`lvw` appeared zero times. It now has the explanation, the three variants, and
two exercises.

A third item was investigated and produced no work: `tailwind-css` (29) has zero
progress despite being old and visible, but the nine students who reached
`bootstrap-5` (28) all stopped between 2026-07-03 and 2026-07-12, eight of them
inside nine days. That is a cohort ending together, not nine decisions about
Tailwind. Nothing to write.

## What unparks this

`ModuleView` data from cohort 2, which is live and currently around module 10.
Two to three weeks of it answers the question the classification needs: for each
module, how many students **opened** it versus how many **submitted** anything.

- A module opened and abandoned is a candidate to split or rewrite, not to mark
  optional.
- A module never opened, while the ones after it were, is genuine skipping — and
  that is the evidence the classification was missing.
- A module neither opened nor reached says nothing at all, which is precisely the
  trap the four new modules set on 2026-08-25.

## Explicitly not in scope

- **Reopening the 19/11 classification.** It is settled. See `design.md`.
- **`ModuleSettings`.** It stays binary `{cohort, slug, enabled}`. The level is
  curriculum data, the same for every cohort.
- **The other five tracks.** They have no such classification decided, and any
  field added to `ModuleData` has to account for 107 module files, not 30.
