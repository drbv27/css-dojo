# Spec: mini-retos

Capability: `mini-retos`

Governs the **integrating challenge** -- the exercise that closes a module by
making the student use several of its concepts together in one multi-step,
self-graded task, and which shows its reference solution only once completed.

Established by change `mini-retos-integradores`, archived 2026-08-29, which
shipped one challenge in each of the **19 required CSS modules** across PRs #43,
#44 and #45. Where a requirement below cites a count it is the count measured at
archive time: 19 of 19 modules covered, the certificate's minimum path at 187
exercises (was 168), and the whole curriculum at 808 exercises and 15 890 XP.
Those numbers are historical; the constraints are not -- they bind every future
challenge, in this track and in any other.

**Scope today**: `css` only, and within it the 19 required modules. The 11
optional CSS modules and the other five tracks carry no challenge until their
own change adds one, and "carries none" is the correct state for them, not a
gap.

## Requirements

### Requirement: A Module Carries At Most One Integrating Challenge

A module MUST carry at most one exercise marked as its integrating challenge.
The mark MUST be part of the exercise, MUST be optional, and its absence MUST
mean "an ordinary exercise" — never "a challenge".

**Every** required CSS module MUST carry exactly one. A module that is not
required MUST carry none until its own change adds it.

**This sentence used to count instead of stating the rule.** It read "each of
the 19 required CSS modules", which was true the day it was written and stopped
being true the moment a twentieth required module was planned -- and the guard
that should have caught the drift compared against a hardcoded registry of
slugs, so it would not have noticed either. Changed by `css-track-expansion-2`,
which took the required set from 19 to 23. That number does not appear here, on
purpose.

#### Scenario: An unmarked exercise is not a challenge

- GIVEN an exercise with no challenge mark
- WHEN the module's challenge is resolved
- THEN that exercise MUST NOT be returned as the challenge

#### Scenario: Two challenges in one module is a data error

- GIVEN a module with two exercises marked as its integrating challenge
- WHEN the curriculum is validated
- THEN validation MUST fail and MUST name the module and both exercises

### Requirement: The Challenge Is Additive

Adding a challenge MUST NOT change, renumber, reword, re-score or remove any
existing exercise. Existing exercise ids MUST remain stable.

This is not a style preference: production holds 5 349 completed `Progress`
documents keyed by `{userId, moduleId, exerciseId}`, and a changed id silently
discards a student's completed work.

#### Scenario: Existing progress survives the addition

- GIVEN a student who completed every exercise of a module before the challenge existed
- WHEN the challenge is added to that module
- THEN every one of that student's `Progress` documents MUST still match an exercise of the module
- AND the student MUST show as having completed everything except the challenge

### Requirement: The Challenge Declares Numbered Steps

An integrating challenge MUST declare an ordered list of steps. Each step MUST
carry a human-readable instruction and the expectation that proves it.

The steps MUST be shown to the student alongside the editor, numbered, before
any attempt is made.

A challenge with fewer than two steps MUST fail validation: a one-step task is
an ordinary exercise, and marking it as the module's integrator misrepresents
what it asks.

#### Scenario: The student sees what is being asked before attempting

- GIVEN a student opening an integrating challenge
- WHEN the page renders
- THEN every step's instruction MUST be visible, in order, without submitting anything

### Requirement: Grading Reports Which Steps Are Missing

Submitting a challenge MUST report, per step, whether that step is satisfied.
Reporting only an overall pass or fail MUST NOT be sufficient.

A student who satisfied three of four steps MUST be told which one is
outstanding, and MUST NOT be told merely that the answer is wrong.

Grading MUST use `css-rules`. `validation.type: "includes"` MUST NOT be used —
it is already forbidden for CSS exercises by `validacion-curriculum.test.ts`.

#### Scenario: Partial work is reported per step

- GIVEN a challenge with four steps and a submission satisfying the first three
- WHEN it is graded
- THEN steps one to three MUST report satisfied and step four MUST report outstanding

#### Scenario: A satisfied step stays satisfied when a later one is wrong

- GIVEN a submission satisfying step one and failing step two
- WHEN it is graded
- THEN step one MUST still report satisfied

### Requirement: A Challenge Is All Or Nothing

Grading a challenge MUST yield 100 when every step is satisfied and 0 otherwise.
A challenge MUST NOT yield a fractional score.

The platform completes an exercise at `score >= 70`. Under a proportional score
a four-step challenge completes with three steps satisfied -- a whole step
skipped in the one exercise whose point is doing the parts together, and which
counts toward the certificate. Measured 2026-08-29 over the shipped set: **17 of
the 19 challenges** would complete one step short (15 four-step ones at 75, and
`dimensiones` and `proyecto-cv-css` at 80 with five).

This binds challenges only. Whether the 70 rule should change for the other 789
exercises is a product question -- 56 of the 77 `css-rules` exercises already
complete with a declaration missing -- and belongs to its own change.

The per-step verdict still reaches the student through the previous
requirement, so nothing is lost in the interface: what stops happening is a
score that claims an integration the student did not finish.

#### Scenario: One step short does not complete

- GIVEN a four-step challenge and a submission satisfying exactly three steps
- WHEN it is graded
- THEN the score MUST be 0
- AND the exercise MUST NOT be recorded as completed

#### Scenario: Every step satisfied completes

- GIVEN a submission satisfying every step of a challenge
- WHEN it is graded
- THEN the score MUST be 100

### Requirement: The Reference Solution Is Not Shown Before Completion

An integrating challenge MUST carry a `referenceSolution`, and the exercise UI
MUST NOT show it until that student's `Progress` for the challenge reads
`completed: true`.

It MUST NOT be revealed by any number of attempts, by elapsed time, or by any
control on the page. A student who is stuck is not abandoned: `hint` and
`explanation` already render in all eight exercise components and MUST stay
available throughout.

This is a deliberate departure from the reference site, where the Solution tab
sits beside the editor from page load and one click reveals the complete
answer — measured 2026-08-27.

#### What this requirement deliberately does NOT claim

An earlier version demanded the solution "MUST NOT be present in what the page
delivers to the client". **That is not achievable and it was written without
measuring.** The exercise page is `"use client"` and imports `ALL_MODULES`, so
the whole curriculum ships to the browser: 154 `isCorrect` flags and 80
`targetCSS` blocks are already in the bundle
(`.next/static/chunks/04xlc4ayw5o2e.js`, measured 2026-08-28).

So this is a lock in the interface, not a boundary, **and the spec says so
rather than implying otherwise.** It stops the student who would click; it does
not stop the one who opens devtools — who could already read the expected answer
of any of the 789 exercises today.

Making it a real boundary means taking the curriculum out of the client bundle.
That is its own change, and the case for it is now weak: what actually mattered
— **claiming a completion you did not earn** — was closed by
`revalidacion-en-servidor`. Reading the answer still means pasting it and being
graded on it by the server.

#### Scenario: An unattempted challenge does not show its solution

- GIVEN a student who has never submitted this challenge
- WHEN the challenge renders
- THEN no control MUST offer the reference solution

#### Scenario: Failed attempts do not unlock it

- GIVEN a student who has submitted this challenge ten times without completing it
- WHEN the challenge renders
- THEN the reference solution MUST still not be shown

#### Scenario: Completion reveals it

- GIVEN a student whose `Progress` for this challenge has `completed: true`
- WHEN the challenge renders
- THEN the reference solution MUST be available to compare against their own answer

### Requirement: A Challenge Must Be Provably Passable

Every integrating challenge's `referenceSolution` MUST score 100 against that
challenge's own steps, asserted by a data guard.

Without it an over-strict expectation ships an unpassable exercise, and it reads
as the student's mistake. This is the same guard `js-behavior` already carries
for the JavaScript track, and the same reason.

#### Scenario: An over-strict challenge fails the build

- GIVEN a challenge whose steps cannot all be satisfied by its own reference solution
- WHEN the curriculum is validated
- THEN validation MUST fail and MUST name the challenge and the unsatisfiable step

### Requirement: The Challenge Counts Toward the Certificate

An integrating challenge MUST be an ordinary exercise of its module for every
purpose other than presentation: it counts for module progress, for XP, and for
certificate eligibility.

No concept of an exercise that does not count MUST be introduced.

#### Scenario: The required path grows

- GIVEN the 19 required CSS modules, demanding 168 exercises
- WHEN each receives its integrating challenge
- THEN the required path MUST become 187 exercises
- AND a student previously at 100 % MUST become not eligible until the challenges are completed
- AND any already-awarded certificate MUST be unaffected, per its frozen snapshot
