# Delta for server-grading

One requirement is `MODIFIED` and one is `ADDED`. The rest of the capability is
untouched: the server still decides, still grades with the one extracted grader,
still refuses an exercise the curriculum does not declare, still records
disagreement, and still never revokes a completion already earned.

## MODIFIED Requirement: The Server Decides Completion

The sentence that made completion a threshold is replaced.

**An exercise MUST be recorded as completed only when its grade is 100.** Partial
credit MUST still be computed and reported to the student — it is what tells them
how far they are — but it MUST NOT complete the exercise.

**Why the threshold was wrong, measured.** Completion used to be `score >= 70`.
Nobody chose 70 for what it did: it came from a fixed threshold meeting a
proportional score. Measured 2026-08-31 over the CSS track: **63 of the 92
`css-rules` exercises completed with one declaration missing, and 47 of those sit
in required modules.** A four-property exercise was marked done with three.

**And it reached the certificate.** Eligibility is defined over
`Progress.completed === true`, so a student could hold the CSS certificate having
left up to 47 declarations unwritten — a credential the instructor signs.

It also produced a contradiction on screen: `correct` is `score === 100` while
completion was `score >= 70`, so a student at 80 was told the answer was
**wrong** and saw the exercise **done**. One threshold, two lies.

### Scenario: A partial answer does not complete

- GIVEN an exercise whose grade is below 100
- WHEN the route handles the submission
- THEN it MUST NOT be recorded as completed
- AND no XP MUST be awarded

### Scenario: The score is still reported

- GIVEN a partial answer
- WHEN the route handles it
- THEN the persisted score MUST be the computed one, not zero

### Scenario: Completion and correctness now agree

- GIVEN any submission
- WHEN it is graded
- THEN the exercise MUST be recorded as completed if and only if the grader reports it correct

## ADDED Requirement: An Exercise the Server Cannot Grade Completes on the Client's Verdict

For an exercise the server cannot grade, and **only** for those, completion MUST
be decided by the score the client reports.

This MUST be bound to the **enumerated predicate** that already lists them, not
to a validation type, a flag on the request, or anything a later exercise could
inherit by accident. A validation type added afterwards MUST NOT acquire this
exception: it lands in the ungradeable-grants-nothing rule until someone lists it
deliberately.

**Why this exists, and it is a defect being repaired.** The four `js-behavior`
exercises run the student's JavaScript in a Web Worker and have no server
equivalent. The instructor's decision was that they *keep being graded on the
client*. The implementation applied the ungradeable-grants-nothing rule to them
instead, and **made them impossible to complete** — measured: `isCompleted` was
always false for all four, whatever the student wrote. Three days live.

**The cost, stated rather than implied.** A student can forge a completion for
those four from the console. That is the accepted trade-off: the `js` track
declares no `nivel`, so it certifies nothing, and it is four exercises. **If that
track is ever classified this becomes a blocker for the classification**, exactly
as `revalidacion-en-servidor` already recorded.

### Scenario: An enumerated client-graded exercise can be completed

- GIVEN one of the exercises the server cannot grade
- AND a submission whose client score is 100
- WHEN the route handles it
- THEN it MUST be recorded as completed

### Scenario: The exception does not widen

- GIVEN an exercise with a validation type the grader does not implement
- AND a submission claiming a passing score
- WHEN the route handles it
- THEN it MUST NOT be recorded as completed

### Scenario: A failing client score does not complete either

- GIVEN one of the exercises the server cannot grade
- AND a submission whose client score is below 100
- WHEN the route handles it
- THEN it MUST NOT be recorded as completed
