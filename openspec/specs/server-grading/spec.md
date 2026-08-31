# Spec: server-grading

Capability: `server-grading`

Governs who decides that an exercise was completed. The server grades the
student's submitted answer itself, in `POST /api/progress`, instead of believing
the score the browser sent -- and the one grading module it calls,
`src/lib/calificar.ts`, is the same one the exercise UI calls.

**Track-agnostic.** Every exercise of every track writes through this route.

Established by change `revalidacion-en-servidor`, archived 2026-08-29, which
shipped in PRs #39, #40 and #41. Before it, the route read
`const isCompleted = score >= 70` from the request body and no grader was called
anywhere under `src/app/api/`: one `fetch` from the console of a logged-in
student completed any exercise -- and since `certificados-por-ruta` defines
eligibility over `Progress.completed === true`, that meant awarding oneself a
credential the instructor signs.

Where a requirement below cites a count it is the count measured at archive
time: 808 exercises, 804 of them server-graded, 4 client-graded and enumerated.
Those numbers are historical. The constraints are not -- they bind every
exercise and every validation type added from here on, and the requirement that
an unimplemented validation type grants nothing is written precisely so that
a later addition inherits the safe behaviour by default.

## Requirements

### Requirement: The Server Decides Completion

`POST /api/progress` MUST determine completion by grading the submitted answer
on the server. The score present in the request body MUST NOT decide completion,
XP, or the persisted score.

A request whose body claims a passing score MUST NOT complete an exercise unless
the submitted answer actually grades as passing.

**An exercise MUST be recorded as completed only when its grade is 100.** Partial
credit MUST still be computed and reported to the student -- it is what tells them
how far they are -- but it MUST NOT complete the exercise.

Completion used to be `score >= 70`. Nobody chose 70 for what it did: it came
from a fixed threshold meeting a proportional score. Measured 2026-08-31 before
removing it: **63 of the 90 `css-rules` exercises with two or more declarations
completed with one missing, and 47 of those sit in required CSS modules** -- so
the certificate, a credential the instructor signs, could be earned leaving
declarations unwritten. It also produced a contradiction on screen: `correct` is
`score === 100` while completion was `score >= 70`, so a student at 80 was told
the answer was wrong and saw the exercise done.

The route previously read `const isCompleted = score >= 70` from the body, and
no grader was called anywhere under `src/app/api/`. One `fetch` from the console
of a logged-in student completed any exercise. Since `certificados-por-ruta`
defines eligibility over `Progress.completed === true`, that meant awarding
oneself a credential the instructor signs.

#### Scenario: A forged score with an empty answer completes nothing

- GIVEN an authenticated student
- WHEN they submit an empty answer with a claimed score of 100
- THEN the exercise MUST NOT be recorded as completed
- AND no XP MUST be awarded

#### Scenario: A forged score with a wrong answer completes nothing

- GIVEN an authenticated student
- WHEN they submit a wrong answer with a claimed score of 100
- THEN the exercise MUST NOT be recorded as completed

#### Scenario: A correct answer completes despite a claimed zero

- GIVEN an authenticated student
- WHEN they submit the correct answer with a claimed score of 0
- THEN the exercise MUST be recorded as completed
- AND the persisted score MUST be the one the server computed

### Requirement: One Grader, Extracted Rather Than Reimplemented

The grading rule MUST exist as a single module that both the exercise UI and the
API call. A second, server-only implementation of the same rule MUST NOT exist.

This is not tidiness. A second implementation that is stricter about whitespace,
quoting or declaration order silently rejects students who genuinely solved the
exercise, and it reads to them as their own mistake. 674 of the 808 exercises
grade by `exact`, where any asymmetric normalisation is a false rejection.

Anything the grader needs that differs between the two environments — an HTML
parser, for one — MUST be passed in as a parameter, and MUST NOT be installed
onto a global. A global assignment makes a server module's behaviour depend on
something that happened in another file, and it breaks the day a second route
imports the grader and omits the incantation.

#### Scenario: The grader is reachable from the server

- GIVEN the module that grades an exercise
- WHEN the API route imports it
- THEN it MUST import without pulling a browser-only dependency into the server
- AND the exercise UI MUST call that same module

### Requirement: A Grader That Could Not Grade Grants Nothing

The grading result MUST make "I could not grade this, and here is a score"
unrepresentable: an ungradeable outcome MUST NOT carry a score a caller can
mistake for a passing one.

An answer whose shape the exercise cannot be graded against, an exercise
declaring no expectation, and a validation type nobody implements MUST each
yield an ungradeable outcome that completes nothing and awards no XP. None of
them MUST raise a server error in the middle of a student's attempt.

A validation type added later MUST land in this behaviour by default. It MUST
NOT fall through to trusting whatever the client claimed.

The `visual` branch once returned a passing score with a comment claiming real
validation happened on the server. It did not, so everything reaching it was
granted credit for anything at all. A validator that cannot validate must not
grant credit.

#### Scenario: An unreadable answer is a qualified rejection, not a crash

- GIVEN a submission whose shape the exercise cannot be graded against
- WHEN the route grades it
- THEN the response MUST be a normal rejection
- AND the route MUST NOT return a 500

#### Scenario: An unknown validation type grants nothing

- GIVEN an exercise whose validation type no grading branch implements
- WHEN it is graded
- THEN the outcome MUST be ungradeable
- AND the exercise MUST NOT be recorded as completed

### Requirement: An Exercise The Curriculum Does Not Declare Cannot Be Completed

A submission naming a module or exercise that `ALL_MODULES` does not declare
MUST be rejected, and MUST NOT write a `Progress` document.

A pair the curriculum does not declare cannot be graded, so it cannot be
completed. The route previously wrote a `Progress` for it anyway, with whatever
score arrived in the body.

#### Scenario: An invented exercise writes nothing

- GIVEN a submission naming an exercise id the curriculum does not declare
- WHEN the route handles it
- THEN it MUST reject the request
- AND no `Progress` document MUST be created or modified

### Requirement: Grading Dispatches On The Exercise, Not On Its Declared Validation Alone

Where an exercise's real grading rule differs from what its `validation` field
declares, the grader MUST follow the real rule, and the divergence MUST be
stated in the code rather than left implicit.

Every `drag-drop` exercise declares `validation: {type: "exact", answer: {...}}`
while its actual rule is "each item in its own `correctZone`". Running the
`exact` branch on one compares `String(object)` against `String(object)` — that
is `"[object Object]"` against itself — so it passes for ANY placement,
including an empty one. Measured and reproduced 2026-08-28: 93 exercises would
have become free, and a guard asserting only "the correct answer scores 100"
would have stayed green throughout.

#### Scenario: A wrong placement does not pass

- GIVEN a drag-drop exercise and a placement with every item in the wrong zone
- WHEN it is graded
- THEN it MUST NOT score 100

#### Scenario: An empty placement does not pass

- GIVEN a drag-drop exercise and an empty placement
- WHEN it is graded
- THEN it MUST NOT score 100

#### Scenario: A correct placement passes

- GIVEN a drag-drop exercise and a placement with every item in its own zone
- WHEN it is graded
- THEN it MUST score 100

### Requirement: The Exercises The Server Cannot Grade Are Enumerated, Not Implied

Exercises the server cannot grade MUST be enumerated by an exported predicate,
and a curriculum guard MUST assert that the enumerated set is exactly the set
that exists. Adding an ungradeable exercise MUST fail the guard until someone
lists it deliberately.

Measured 2026-08-29 over the shipped curriculum: **804 of 808 exercises are
graded by the server**. The four that are not are the `js-behavior` exercises —
`js-funciones/js07-ej-17`, `js-funciones/js07-ej-18`, `js-arrays/js08-ej-07`,
`js-metodos-arrays/js09-ej-08` — which run the student's JavaScript in a Web
Worker and have no server equivalent without putting a code-execution sandbox in
the backend.

The `js` track declares no `nivel`, so it certifies nothing and those four touch
no credential today. **If the `js` track is ever classified, this becomes a
blocker for that classification**, and it belongs to that change, not this one.

#### Scenario: An unlisted ungradeable exercise fails the guard

- GIVEN an exercise the server cannot grade and which the predicate does not list
- WHEN the curriculum guard runs
- THEN it MUST fail and MUST name that exercise

#### Scenario: No exercise is unpassable

- GIVEN every exercise in the curriculum
- WHEN each is graded
- THEN none MUST yield "no expectation declared", which would be an exercise nobody can pass

### Requirement: The Server Grader Must Not Be Stricter Than The Student's Answer

A data guard MUST run every exercise's own recorded correct answer through the
server grader and require 100, and MUST run a deliberately wrong answer through
it and require anything but 100.

The positive half alone is worth nothing. For the 93 `drag-drop` exercises it
stays green while every one of them is awarded to everybody, because the
declared `exact` branch passes for any placement. The negative half is what
catches that, and it MUST NOT be dropped as redundant.

Without the positive half, an over-strict server expectation ships a rejection
that honest students read as their own mistake — the risk this whole change
carries, concentrated in the 674 `exact` exercises where any normalisation the
client does and the server does not becomes a false rejection.

#### Scenario: The guard covers the whole curriculum

- GIVEN the curriculum as shipped
- WHEN the guard runs
- THEN it MUST assert the exercise count it covered
- AND that count MUST equal the number of exercises that exist

#### Scenario: A stricter server grader fails the build

- GIVEN an exercise whose recorded correct answer no longer scores 100 on the server
- WHEN the guard runs
- THEN it MUST fail and MUST name that exercise

### Requirement: Disagreement Between Client And Server Is Recorded

When the score the client claimed differs from the one the server computed, the
server's MUST decide, and the disagreement MUST be recorded with both scores.

The record MUST live in its own append-only collection, NOT as a field of
`Progress`. `Progress` is one document per `{userId, moduleId, exerciseId}` and
is read by every dashboard, every module page and every certificate check; a
disagreement is an event, several per exercise, and must not grow the documents
on the hottest reads.

Recording MUST happen after the student's progress is persisted, and a failure
to record MUST NOT lose that progress. Recording is diagnosis, not part of the
contract with the student.

Matching scores MUST NOT be recorded.

**The second reason to record matters more than the first.** A scattered
disagreement suggests someone is forging submissions. A broad, even
disagreement is evidence that the server grader is wrong and the students are
not. Without the record the two look identical, and the first thing anyone would
do is accuse the students.

#### Scenario: A forged submission is recorded with both scores

- GIVEN a submission claiming a score the server does not compute
- WHEN the route handles it
- THEN a disagreement MUST be recorded carrying the claimed score and the computed score

#### Scenario: Agreement records nothing

- GIVEN a submission whose claimed score equals the computed one
- WHEN the route handles it
- THEN no disagreement MUST be recorded

#### Scenario: A failed recording does not cost the student their progress

- GIVEN a submission that completes an exercise and disagrees with the client
- WHEN recording the disagreement fails
- THEN the student's `Progress` MUST still reflect the completion

### Requirement: An Exercise the Server Cannot Grade Completes on the Client's Verdict

For an exercise the server cannot grade, and **only** for those, completion MUST
be decided by the score the client reports, and only when that score is 100.

This MUST be bound to the **enumerated predicate** that already lists them, not
to a validation type, a flag on the request, or anything a later exercise could
inherit by accident. A validation type added afterwards MUST NOT acquire this
exception: it lands in the ungradeable-grants-nothing rule until someone lists
it deliberately.

**This requirement exists because a defect had to be repaired.** The four
`js-behavior` exercises run the student's JavaScript in a Web Worker and have no
server equivalent. The instructor's decision was that they *keep being graded on
the client*; the implementation applied the ungradeable-grants-nothing rule to
them and **made them impossible to complete** -- measured: `isCompleted` was
always false for all four, whatever the student wrote, for three days in
production. The decision and this spec contradicted each other, and the spec won
in code.

**The cost, stated rather than implied.** A student can forge a completion for
those four from the console. That is the accepted trade-off: the `js` track
declares no `nivel`, so it certifies nothing, and it is four exercises. **If that
track is ever classified this becomes a blocker for the classification.**

#### Scenario: An enumerated client-graded exercise can be completed

- GIVEN one of the exercises the server cannot grade
- AND a submission whose client score is 100
- WHEN the route handles it
- THEN it MUST be recorded as completed

#### Scenario: The exception does not widen

- GIVEN an exercise with a validation type the grader does not implement
- AND a submission claiming a passing score
- WHEN the route handles it
- THEN it MUST NOT be recorded as completed

#### Scenario: A failing client score does not complete either

- GIVEN one of the exercises the server cannot grade
- AND a submission whose client score is below 100
- WHEN the route handles it
- THEN it MUST NOT be recorded as completed

### Requirement: Completion Already Earned Is Never Revoked

A later failed attempt MUST NOT un-complete an exercise a student had already
completed, and MUST NOT lower the recorded score below their best.

XP MUST be awarded once, on first completion, and MUST NOT be awarded again on
any resubmission.

The `Progress` documents written under the previous rule are left as they are.
Re-grading them would be a mass write against the live database, and a bug in
the re-grader would delete legitimate student work — a worse outcome than
leaving an unlikely cheat in place. The new rule governs from here forward, and
this is a deliberate decision, not an omission.

#### Scenario: A later failed attempt does not undo a completion

- GIVEN a student who already completed an exercise
- WHEN they submit a wrong answer to it afterwards
- THEN the exercise MUST still read as completed
- AND the recorded score MUST NOT drop below their best

#### Scenario: XP is granted once

- GIVEN a student who already completed an exercise
- WHEN they resubmit the correct answer
- THEN no further XP MUST be awarded

## What this change deliberately does NOT close

Every answer in the course is already in the browser. The exercise page is
`"use client"` and imports `ALL_MODULES` whole, so the compiled bundle carries
154 `isCorrect` flags, 80 `targetCSS` blocks and the `referenceSolution` values
(`.next/static/chunks/04xlc4ayw5o2e.js`, measured 2026-08-28).

This change does not close that and must not claim to. **What it closes is
different and more important: submitting a completion you did not earn.**
Reading the answer still means pasting it and being graded on it by the server.

Taking the curriculum out of the client bundle is its own change.
