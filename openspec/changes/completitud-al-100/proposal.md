# Proposal — completitud-al-100

Created: 2026-08-31
Status: **proposed**

## Intent

An exercise is complete when it is **complete**, not at 70 %. And the four
`js-behavior` exercises, which are currently **impossible to complete**, work
again through the client's verdict, bounded to the enumerated list.

## Half one — the 70 rule

`POST /api/progress` marks an exercise complete at `score >= 70`. Nobody chose
that number for what it does now: it came from a fixed threshold meeting a
proportional score.

**Measured against `e560eb5`:**

| | |
|---|---|
| `css-rules` exercises in the CSS track | 92 |
| **Complete with one declaration missing** | **63** |
| Of those, in **required** modules | **47** |

A four-property exercise is marked done with three.

**And that reaches the certificate.** Eligibility is defined over
`Progress.completed === true`, so today a student can hold the CSS certificate
having left up to 47 declarations unwritten. It is a credential the instructor
signs with his own name, and the threshold is the back door into everything the
snapshot, the `nivel` gate and the server-side re-grading were built to protect.

**The second symptom, the one a student reported**: at 80 the screen says
**"Incorrecto"** and the exercise completes anyway. `correct` is `score === 100`
but `isCompleted` is `score >= 70`. The platform tells the student they are wrong
and records it as done. Two faces of the same threshold.

## Half two — four exercises are impossible, and we broke them

`js-funciones/js07-ej-17`, `js07-ej-18`, `js-arrays/js08-ej-07` and
`js-metodos-arrays/js09-ej-08` **cannot be completed**, whatever the student
writes.

`isCompleted = calificacion.calificable && score >= 70`. For `js-behavior` the
server returns `calificable: false` — it cannot run the student's JavaScript
without a sandbox — so `isCompleted` is always false. `route.ts` is the only
place that writes `completed`; there is no other path.

**Introduced by `revalidacion-en-servidor` (PR #41)**, three days live.

And the root cause is worth naming: **the decision and the spec contradict each
other, and the spec won.**

> **The instructor decided:** *"the four `js-behavior` keep being graded on the
> client, marked as such."*
>
> **The promoted spec says:** *"an ungradeable outcome MUST NOT carry a score a
> caller can mistake for a passing one."*

The code honoured the spec to the letter and made the four unreachable. Nobody
noticed because the `js` track declares no `nivel`, so it certifies nothing and
no eligibility check went red.

## Why both in one change

They live in **the same line**. Fixing them apart means touching `route.ts:66`
twice and writing the same guard twice, and re-arguing the same contract: what
completes an exercise.

## What this change does NOT do

- **It does not re-grade history.** The 5 349 `Progress` documents completed
  under the old rule stay exactly as they are. A mass re-grader with a bug would
  delete real student work, which is worse than leaving older, laxer completions
  in place. The rule governs from here forward — the same decision, for the same
  reason, as `revalidacion-en-servidor`.
- **It does not add a JavaScript sandbox to the backend.** The four stay
  client-graded, which is what was decided.
- **It does not touch the belt thresholds.**

## Risks

### Nothing becomes unpassable — verified, not assumed

`calificador-curriculum.test.ts` already asserts that **every** exercise's own
recorded correct answer scores 100 against the real grader. So requiring 100
makes nothing impossible. The only exercises that cannot reach 100 server-side
are the four `js-behavior`, and half two is exactly about them.

### The client-verdict exception is a door, and it must stay narrow

Accepting the browser's score for the four means a student could forge a
completion for those four. That is the trade-off the instructor already
accepted: the `js` track certifies nothing, and it is four exercises.

**What must not happen is the door widening on its own.** A `validation.type`
added later must NOT inherit the exception. It rides on `esSoloCliente`, the
enumerated predicate a curriculum guard already pins to exactly those four.

### Students mid-exercise will notice

Someone who today gets 80 and sees the exercise completed will, after this,
get 80 and see it not completed. That is the point, and it is honest — but it is
product-visible on the day it deploys.
