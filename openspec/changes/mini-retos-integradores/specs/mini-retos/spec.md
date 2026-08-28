# Delta for mini-retos

## Purpose

One **integrating challenge** per module in the CSS track: a new, multi-step,
self-graded exercise that closes a module by making the student use several of
its concepts together in one task.

**Track relevance**: `css` only, and within it the **19 required modules**. The
11 optional CSS modules and the other five tracks are out of scope. Every
requirement below is `ADDED`.

## ADDED Requirements

### Requirement: A Module Carries At Most One Integrating Challenge

A module MUST carry at most one exercise marked as its integrating challenge.
The mark MUST be part of the exercise, MUST be optional, and its absence MUST
mean "an ordinary exercise" — never "a challenge".

Each of the 19 required CSS modules MUST carry exactly one. A module outside
that set MUST carry none until its own change adds it.

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

### Requirement: The Reference Solution Is Revealed Only After Completion

An integrating challenge MUST carry a `referenceSolution`, and it MUST be
revealed to the student **only once that student has completed the challenge**.

It MUST NOT be reachable before completion by any number of attempts, by
elapsed time, or by any control on the page.

This is a deliberate departure from the reference site, where the solution sits
beside the editor from page load and one click reveals the complete answer. A
student who is stuck is not abandoned: `hint` and `explanation` already render
in all eight exercise components and MUST stay available throughout.

#### Scenario: An unattempted challenge does not expose its solution

- GIVEN a student who has never submitted this challenge
- WHEN the challenge page renders
- THEN the reference solution MUST NOT be present in what the page delivers to the client

#### Scenario: Failed attempts do not unlock it

- GIVEN a student who has submitted this challenge ten times without completing it
- WHEN the challenge page renders
- THEN the reference solution MUST still not be revealed

#### Scenario: Completion reveals it

- GIVEN a student whose `Progress` for this challenge has `completed: true`
- WHEN the challenge page renders
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
