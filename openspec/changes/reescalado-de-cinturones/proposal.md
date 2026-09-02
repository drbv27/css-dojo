# Proposal: `reescalado-de-cinturones`

## Why

`RANKS` uses ABSOLUTE `minXP` thresholds and the curriculum keeps growing, so
every content batch quietly discounts every belt. Gran Maestro asked **74.6%** of
the curriculum, then 69.2%, then 65.6%, then 64.2%. All four were discovered by
measuring by hand; nothing ever turned red.

But measuring properly turned up a bigger problem than the drift.

## The real defect: the top of the scale is flat

| Milestone | XP | % of curriculum | Rank under the old scale |
|---|---|---|---|
| CSS + HTML + JS | 13125 | 76.6% | **Gran Maestro** |
| + React | 15985 | 93.3% | **Gran Maestro** |
| The entire curriculum | 17140 | 100% | **Gran Maestro** |

Three different achievements, one badge. Gran Maestro did not mean "you mastered
the dojo" — it meant "you passed 11000 and the ladder ran out". A student who
finished everything wore the same belt as one who skipped React, the React
ecosystem and Next entirely.

And the bottom was the opposite: finishing the REQUIRED CSS path — the minimum
for a certificate — already granted **Cinturon Marron**, third from the top.

## The new scale

Anchored to milestones that can be named, not to round numbers:

| Rank | minXP | % | Meaning |
|---|---|---|---|
| Blanco | 0 | 0% | |
| Amarillo | 300 | 1.8% | |
| Naranja | 900 | 5.3% | |
| Verde | 1800 | 10.5% | |
| Azul | 3200 | 18.7% | |
| **Morado** | **5200** | 30.3% | the required CSS path — the certificate's |
| **Marron** | **7400** | 43.2% | all of CSS, optional modules included |
| **Rojo** | **9600** | 56.0% | CSS + HTML |
| **Negro** | **12800** | 74.7% | CSS + HTML + JS |
| **Gran Maestro** | **15800** | 92.2% | + React |

Three things fall out of this:

1. Gran Maestro is demanding but reachable: it asks the four large tracks. The
   React ecosystem and Next are margin, not requirement.
2. The certificate now lands on Morado, not Marron — so CSS's optional modules
   are worth a belt, an incentive that did not exist.
3. A CSS-only cohort walks **six** belts instead of five.

## What was rejected, and why

**Percentage-based thresholds.** The obvious fix, and wrong: a cohort taught only
CSS caps at 44.5% forever, so the upper belts stop being reachable by anyone
actually in the programme.

**A cushion for the JS and React content still to come.** A cushion is a guess
wearing the costume of a plan. It leaves the ceiling untouchable meanwhile, and
if those tracks grow differently than guessed it needs re-correcting anyway.

**The answer instead: correct later, but be told.** The thresholds stay absolute
and a guard declares the intended percentage per rank with a 3-point band. The
next content batch breaks a test rather than discounting in silence.

## Also fixed: the bar that said 100% too early

`getXPProgress` used `Math.round`, so one XP short of the next belt in a band of
300 or more displayed **100%** while the student still held the previous belt.
Already reachable on the old scale in the wide upper bands (2499 of 2500); no
test caught it because the only band exercised was the first, where 149 of 150
happened to round to 99. Now `Math.floor`, capped at 99 while a next rank exists.

## Out of scope

- Freezing anyone's current rank. The instructor decided explicitly that dropping
  is fine and the cohort was already told. Rank is derived from XP, and no XP is
  touched — there is no data migration.
- Rescaling per-exercise `xpReward`. The scale moved; what an exercise is worth
  did not.
