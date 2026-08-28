# Proposal — revalidacion-en-servidor

Created: 2026-08-28
Status: **proposed — awaiting spec**

## Intent

Grade the student's answer **on the server** before writing `Progress`, instead
of believing the score the browser sends.

## The hole, exactly

`POST /api/progress`:

```ts
const { exerciseId, exerciseType, score, userAnswer } = body;
const isCompleted = score >= 70;
```

Grepped across `src/app/api/`: no grader is called anywhere. That line is the
only `score >= 70` in the whole API. One `fetch` from the console of a logged-in
student marks any exercise complete.

The route is not careless everywhere — it authenticates, and it reads `xpReward`
from `ALL_MODULES` rather than from the body, so XP amounts cannot be invented.
This change extends that same pattern to the score.

## Why now, and not last month

Until 2026-08-27 the blast radius was XP and a belt: annoying, self-inflicted,
nobody else harmed.

Then `certificados-por-ruta` shipped, and eligibility is defined over
`Progress.completed === true`.

**A student can now award themselves the entire CSS certificate from the browser
console.** It is a credential the instructor signs with their own name. That is
what moved this ahead of the mini-retos, which are now parked on it.

## What this does NOT fix, said plainly

Every answer in the course is already in the browser. Measured in the compiled
bundle `.next/static/chunks/04xlc4ayw5o2e.js`: 154 `isCorrect`, 80 `targetCSS`,
and the `referenceSolution` values that already exist — because the exercise page
is `"use client"` and imports `ALL_MODULES` whole.

This change does not close that and must not claim to. A determined student can
always read the expected answer.

**What it closes is different and more important: submitting a completion you
did not earn.** Reading the answer still means pasting it and being graded on it
— which, for a `css-rules` exercise, is most of the learning anyway.

## Coverage, measured over 789 exercises

| validation | count | after this change |
|---|---|---|
| `exact` | 674 | re-graded on the server |
| `css-rules` | 77 | re-graded — `cssRules.ts` is pure TS, zero DOM |
| `html-structure` | 24 | re-graded — `jsdom` promoted to a dependency |
| `includes-ordered` | 6 | re-graded |
| `regex` | 4 | re-graded |
| `js-behavior` | 4 | **client-graded, and labelled as such** |

**785 of 789.**

## Decisions taken by the instructor, 2026-08-28

### The four `js-behavior` exercises keep trusting the client

They run the student's JavaScript in a Web Worker and observe what it does;
there is no server equivalent without adding a code-execution sandbox to the
backend. That is the riskiest change of the three options, for four exercises.

They stay client-graded and are **explicitly marked as such** in the code and
here — not left as an unstated gap. They live in `js-07-funciones`,
`js-08-arrays` and `js-09-metodos-arrays`; the `js` track declares no `nivel`,
so it does not certify and cannot until someone classifies it. Those four
exercises affect no credential today.

**If the `js` track is ever classified, this becomes a blocker for it.** That
belongs in the classification change, not here.

### `jsdom` is promoted from devDependency to dependency

Already installed (`^30.0.1`), already used by the test suite. It takes
`html-structure` from client-graded to server-graded, and the `html` track is
one that will certify once it is classified.

### Existing progress is left alone

5 349 completed `Progress` documents were written under the old rule. They stay.

Re-grading them would be a mass write against the live database, and a bug in
the re-grader would delete legitimate student work — a far worse outcome than
leaving an unlikely cheat in place. The new rule governs from here forward.

### The server wins, and disagreements are recorded

When the client's score and the server's disagree, the server's decides, and the
disagreement is recorded.

The reason to record is not only cheating. **A broad, even pattern of
disagreement is evidence the re-grader is wrong, not that students are.** Without
the record, a grader regression looks exactly like a cheating wave, and the first
thing anyone would do is accuse the students.

## Risks

### A stricter server grader silently fails honest students

The client and server must agree on the same answer. If the server is stricter —
whitespace, quote style, property order — a student who genuinely solved the
exercise sees it rejected, and it reads as their mistake.

`compararReglas` is the same function in both places, which removes most of the
risk for `css-rules`. `exact` is where the danger sits: 674 exercises, and any
normalisation the client does and the server does not becomes a false rejection.

**Mitigation the spec must require:** every exercise's own recorded correct
answer must score 100 against the server grader, asserted by a data guard over
all 789 — the same shape as the `referenceSolution` guard `js-behavior` already
carries.

### `Progress.userAnswer` is `Schema.Types.Mixed`

The server has to re-grade whatever shape the client sent. An unexpected shape
must fail closed and be recorded, never throw a 500 in the middle of a student's
exercise.

## Non-goals

- Removing the curriculum from the client bundle.
- Re-grading historical progress.
- A server sandbox for JavaScript execution.
- Anything about the mini-retos, which are parked on this.
