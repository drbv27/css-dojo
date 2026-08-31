# Tasks — completitud-al-100

**Review Workload Forecast**

| | |
|---|---|
| Slices | 2 |
| Production diff | **one line**, plus its import |
| Delivery | one PR, two commits — the bug fix first |
| Risk | Medium. The line is small; what it changes is the meaning of "completed" platform-wide. |

## Slice 1 — the four impossible exercises

- [x] 1.1 Make completion fall back to the client's verdict when the server cannot grade, bound to `esSoloCliente` and requiring `scoreCliente === 100`.
- [x] 1.2 Guard: each of the four enumerated exercises completes with a client score of 100.
- [x] 1.3 Guard: an exercise with an unimplemented validation type does **not** complete, even claiming 100. The door must not widen.
- [x] 1.4 Guard: a client score below 100, or absent, does not complete a client-graded exercise.
- [x] 1.5 **Positive controls**: widen the condition to any ungradeable exercise → 1.3 red. Remove the fallback → 1.2 red.

## Slice 2 — completion requires 100

- [x] 2.1 Replace `score >= 70` with `score === 100`.
- [x] 2.2 Guard: a partial answer does not complete and awards no XP.
- [x] 2.3 Guard: the persisted score is still the computed one, not zero — partial credit is still reported.
- [x] 2.4 Guard: completion and `correct` now agree, asserted as a property rather than on one example.
- [x] 2.5 **Positive control**: put the threshold back to 70 → 2.2 red.
- [x] 2.6 Confirm no exercise became unpassable by re-running `calificador-curriculum`, which already proves every correct answer scores 100. **Do not write a second proof of the same fact.**
- [x] 2.7 Measured: **63 of the 90 `css-rules` exercises with two or more declarations stop completing on partial work, and 47 of those are in required CSS modules.**
- [x] 2.8 **ADDED — the first version of the partial test was VACUOUS, and its own positive control caught it.** It used a 50 % answer, which does not complete under the old threshold either, so putting `>= 70` back left it green. The mock drag-drop now has four items so three correct give **75** — a partial that *did* complete before and does not now. Re-controlled: red.
- [x] 2.9 **ADDED — a false alarm worth recording.** An ad-hoc check said `tailwind-css/24-ej-reto`'s reference solution scored 0. It scores 100: the check did not pass `parserHtmlServidor`, which the route always does. Nothing became unpassable.

## Slice 3 — verify and close

- [x] 3.1 Full suite, typecheck, eslint, build.
- [x] 3.2 Look at it against QA: a partial answer shows its score and does not complete; a complete one does.
- [x] 3.3 Archive: promote the delta into `openspec/specs/server-grading`, write `archive-report.md`, close the record.
- [x] 3.4 Record as a follow-up, not absorbed here: the historical 5 349 completions stay as they are, and the `js` track classification remains blocked by the four client-graded exercises.
