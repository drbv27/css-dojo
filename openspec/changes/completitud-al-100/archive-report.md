# Archive report: completitud-al-100

Archived **2026-08-31**, in place. The folder does not move: relocating it breaks
the bounded review.

## What shipped — two conditions in one line

```ts
const isCompleted = calificacion.calificable
  ? score === 100
  : completaEnCliente && scoreCliente === 100;
```

Everything else in this change is guards and spec. The design said the production
diff would be one line; it was.

## Half one — completion requires 100

Measured before removing the threshold: **63 of the 90 `css-rules` exercises with
two or more declarations completed with one missing, and 47 of those are in
required CSS modules.** A four-property exercise was marked done with three, and
because certificate eligibility is defined over `Progress.completed === true`,
the credential could be earned leaving declarations unwritten.

It also produced a contradiction a student reported: at 80 the screen said
**"Incorrecto"** and the exercise completed anyway. `correct` was already
`score === 100`; now the two finally agree.

## Half two — four exercises were impossible, and we broke them

`js-funciones/js07-ej-17`, `js07-ej-18`, `js-arrays/js08-ej-07` and
`js-metodos-arrays/js09-ej-08` could not be completed at all. `isCompleted` was
always false for them because the server cannot run the student's JavaScript.
Introduced by `revalidacion-en-servidor` (PR #41), three days live.

**The root cause is worth keeping**: the instructor's decision said the four
*keep being graded on the client*; the promoted spec said *an ungradeable outcome
grants nothing*. The code honoured the spec and made them unreachable. **A
decision recorded in a `state.yaml` and a requirement promoted to a spec can
contradict each other, and the spec is what the code follows.**

The exception is bound to `esSoloCliente`, the enumerated predicate a curriculum
guard already pins to exactly those four — so the door cannot widen when a new
validation type appears.

## Verification

| | |
|---|---|
| Suite | 382 → **389**, 39 files |
| Positive controls | **5** |
| typecheck / eslint / build | clean |

**End to end against the real app in QA, over the API** — not only unit tests:

| answer | `completed` | `score` | XP |
|---|---|---|---|
| 3 of 4 declarations | **false** | 75 | 0 |
| all 4 | **true** | 100 | 20 |

The partial keeps its 75, which is what tells the student how far they are.

### One control caught a vacuous test of mine

The first version of "a partial answer does not complete" used a **50 %** answer
— which does not complete under the old threshold either. Putting `>= 70` back
left the test **green**. The mock drag-drop now has four items so three correct
give **75**: a partial that *did* complete before and does not now. Re-controlled,
red.

**A control that passes means the test is broken, not that the code is right.**
That is the second time in this session the rule paid for itself.

### And a false alarm, recorded so it is not re-discovered

An ad-hoc check claimed `tailwind-css/24-ej-reto`'s reference solution scored 0.
It scores 100 — the check did not pass `parserHtmlServidor`, which the route
always does. **Nothing became unpassable**, and the existing
`calificador-curriculum` guard was already the proof: it asserts every exercise's
own correct answer scores 100.

## Spec promoted

The delta went into `openspec/specs/server-grading`: the completion requirement
redlined from a threshold to 100, and a new requirement for the client-verdict
exception. Ten requirements now.

## Left open on purpose

- **The 5 349 historical completions stay as they are.** A mass re-grader with a
  bug deletes real student work, which is worse than leaving older, laxer
  completions in place. Same decision, same reason, as `revalidacion-en-servidor`.
- **No JavaScript sandbox in the backend.** The four stay client-graded, and that
  remains a blocker for classifying the `js` track.
- **Belt thresholds untouched.** Gran Maestro sits at 65.6 % of available XP.
- **Product-visible on deploy day**: a student who today gets 80 and sees the
  exercise completed will, after this, get 80 and see it not completed. Their
  existing progress is not revoked — the route never un-completes.
