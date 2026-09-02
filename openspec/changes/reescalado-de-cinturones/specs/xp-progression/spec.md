# Delta for xp-progression

Requirements 1 and 2 are `MODIFIED` — only their illustrative numbers, which
went stale the moment the scale was rescaled. Requirement 3 is `MODIFIED` — a
real defect in the percentage. Requirements 6 and 7 are `ADDED`.

## Why the numbers were in the spec at all

The header said every concrete number was re-measured on 2026-08-24, and it
named `150`, `400` and `11000`. That was honest and it still rotted: the moment
the scale changed, a promoted spec was asserting thresholds that no longer
existed. **A spec that names a number owes that number a guard**, and there was
none — which is the same shape as the four JS exercises that stayed impossible
for three days.

The scenarios below now name the ROLE (`RANKS[0]`, the second rank, the top
rank) instead of the value, and the values themselves are pinned by
`cinturones-escala.test.ts` against the real curriculum.

## MODIFIED Requirement 1 — `getRank`

The rule is unchanged: return the highest-XP rank whose `minXP` is less than or
equal to `xp`; `RANKS[0]` is the floor.

Scenarios are restated without literals:

- **Given** `xp = 0` — **Then** it returns `RANKS[0]`
- **Given** `xp` equal to the second rank's `minXP` — **Then** it returns that rank
- **Given** `xp` one below the second rank's `minXP` — **Then** it returns `RANKS[0]`
- **Given** `xp` far above the top rank's `minXP` — **Then** it returns the top rank
- **Given** `xp` negative — **Then** it returns `RANKS[0]`

## MODIFIED Requirement 2 — `getNextRank`

Unchanged rule, same de-literalisation: the boundary cases are expressed against
the second and top ranks rather than against `150` and `11000`.

## MODIFIED Requirement 3 — The progress percentage never reaches 100 below the next rank

**This corrects a defect, not just a number.** The percentage was
`Math.min(Math.round((earned / needed) * 100), 100)`. With `round`, a student one
XP short of the next belt in a band of 300 or more sees **100%** on the progress
bar while still holding the previous belt.

It was already reachable on the old scale in the wide upper bands — 2499 of a
2500 band rounded to 100 — and no test caught it because the only case exercised
was the first band, where 149 of 150 happened to round to 99.

The system MUST return a percentage strictly below 100 whenever a next rank
exists. `100` is returned only by the branch for someone who has no next rank.

### Scenario 3.1 — One XP short is not 100%

- **Given** `xp` one below the next rank's `minXP`
- **When** `getXPProgress` is called
- **Then** `percentage` MUST be less than 100

### Scenario 3.2 — The top rank still reports 100%

- **Given** `xp` at or above the top rank's `minXP`
- **Then** `percentage` MUST be `100` and `needed` MUST be `0`

## ADDED Requirement 6 — Thresholds are anchored to curriculum milestones

Each of the top five thresholds MUST sit just below a milestone that can be
named, so a belt means something a student can be told:

| Rank | Milestone |
|---|---|
| Cinturon Morado | the REQUIRED CSS path — the one the certificate demands |
| Cinturon Marron | all of CSS, optional modules included |
| Cinturon Rojo | CSS + HTML |
| Cinturon Negro | CSS + HTML + JS |
| Gran Maestro | CSS + HTML + JS + React |

### Scenario 6.1 — Each milestone grants exactly its rank

- **Given** the XP of each milestone, computed from `ALL_MODULES`
- **When** `getRank` is called on it
- **Then** it MUST return exactly the rank in the table

### Scenario 6.2 — The top of the scale does not flatten

- **Given** the five milestones
- **When** their ranks are collected
- **Then** all five MUST be distinct

This is the defect the rescale fixes. Under the previous scale, CSS+HTML+JS
(76.6% of the curriculum), the same plus React (93.3%) and the entire curriculum
(100%) **all returned Gran Maestro**. The badge did not distinguish a student who
finished everything from one who skipped React, Next and the React ecosystem
entirely.

### Scenario 6.3 — The ceiling is reachable

- **Given** the total XP of the curriculum
- **Then** `getRank` MUST return the top rank

A ceiling nobody can reach is a promise about content that does not exist.

## ADDED Requirement 7 — Threshold drift must fail loudly

Thresholds stay ABSOLUTE. Making them a percentage of the curriculum was
considered and rejected: a cohort taught only CSS would cap at ~44% forever, and
the upper belts would stop being reachable by anyone actually in the programme.
No cushion is reserved for future content either — a cushion is a guess wearing
the costume of a plan, and it leaves the ceiling untouchable meanwhile.

**The defect was never the numbers. It was that the drift was silent.** Gran
Maestro asked 74.6% of the curriculum, then 69.2%, then 65.6%, then 64.2%. Every
one of those was discovered by measuring by hand.

Therefore the intended percentage of each rank MUST be declared, and the suite
MUST fail when any rank drifts more than 3 percentage points from it.

### Scenario 7.1 — A content batch turns the suite red

- **Given** content is added that grows the curriculum's total XP
- **When** any rank's real percentage moves more than 3 points from its declared one
- **Then** the suite MUST fail, naming the rank and the drift

Verified: adding 600 XP (3.5% growth) to one JS module fails it, naming
`Gran Maestro`.

**The answer to that failure is never to widen the band.** It is to decide the
scale again — which is precisely what was not happening.

### Scenario 7.2 — The declared table cannot go stale

- **Given** a rank is added to `RANKS` and not to the declared table
- **Then** the suite MUST fail

Without this the drift check compares against `undefined`, and `NaN > 3` is
false, so a new rank would be silently unguarded.
