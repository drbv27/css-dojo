# Archive report: mini-retos-integradores

Archived **2026-08-29**, in place. The folder does not move: relocating it
breaks the bounded review, because the diff does not detect the rename.

## What shipped

One integrating challenge in each of the **19 required CSS modules** -- a new,
multi-step, self-graded exercise that closes its module, coexists with every
exercise that already existed, and shows its reference solution only once the
student's `Progress` for it reads `completed: true`.

Merged into `main` on 2026-08-28 across PRs #43, #44 and #45. 14 of 14 tasks
closed, 0 open.

## Measured at archive time

| | |
|---|---|
| Required modules with a challenge | 19 of 19 |
| Certificate's minimum CSS path | 187 exercises (was 168) |
| XP of the required modules | 4 470 (was 3 330) |
| Whole curriculum | 808 exercises, 15 890 XP (were 789 and 14 750) |
| Test suite on the merged tree | 327 passing, 31 files |

The first three came out exactly as the proposal had predicted.

## Spec promoted

`openspec/changes/mini-retos-integradores/specs/mini-retos/spec.md` ->
`openspec/specs/mini-retos/spec.md`, as a new capability `mini-retos`. Eight
requirements; no existing spec was modified, and no delta was destructive.

### One requirement was added during archive, and why

The delta spec carried seven requirements. The shipped grader carries an eighth
behaviour that none of them stated: **a challenge scores 100 or 0, never a
fraction** (`calificarReto` in `src/lib/calificar.ts`). The design phase raised
it and recommended it, the code implemented it, the guard
`retos-curriculum.test.ts` A.9 tests it -- and the spec never got the sentence.
Promoting the seven as they stood would have published a spec whose text,
combined with the platform's `score >= 70`, implies the opposite of what runs.

That is the same trap this project already paid for once: a correction made in
`design.md` does not travel back to the spec on its own, and archive promotes
whatever text is there.

The requirement was added to the delta spec first, then promoted, so the two
files still say the same thing.

**Positive control run before writing it** (2026-08-29): `calificarReto` was
changed to return a proportional score and `retos-curriculum.test.ts` went RED
on test A.9, naming the challenges that would then complete a step short.
`calificar.ts` was restored and the file is byte-identical to `main`.

Measured over the shipped set: **17 of the 19 challenges** would complete one
step short under a proportional score -- 15 four-step ones at 75, plus
`dimensiones` and `proyecto-cv-css` at 80 with five steps each.

## Left open on purpose

- **The 70 rule for the other 789 exercises.** 56 of the 77 `css-rules`
  exercises already complete with a declaration missing. It is a product
  question, it has 56 exercises behind it, and it goes in its own change.
- **Belt rescaling.** The thresholds are absolute numbers, so every content
  addition cheapens them by itself: Gran Maestro asked for 74.6 % of the whole
  curriculum's XP and these 19 challenges alone take it to 69.2 %. Out of scope
  here by the instructor's decision on 2026-08-27; its own change.
- **The 11 optional CSS modules.** Whether they get a challenge is undecided.
- **`Progress.xpEarned` stores `maxXP` even on failed attempts**
  (`src/app/api/progress/route.ts`). Noted, not this change's defect.
