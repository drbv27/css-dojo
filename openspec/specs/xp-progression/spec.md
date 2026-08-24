# Spec: xp-progression

Capability: `xp-progression`

Governs how a student's XP total maps to a rank and to progress toward the next
rank: `getRank`, `getNextRank`, and `getXPProgress` in `src/lib/xp.ts`, reading
the `RANKS` table in `src/lib/constants.ts`. This capability underpins
gamification across **all four dojo tracks (css/html/js/react)** rather than
belonging to one -- rank and XP are computed identically regardless of which
track a student is working in.

Established by change `automated-gates`, archived 2026-08-24, which stated the
already-implemented rules as testable requirements so the project's first unit
suite verified a spec instead of describing whatever the code happened to do.
The suite lives in `src/lib/xp.test.ts`: 18 tests, all passing at archive time.

Every concrete number below was re-measured against `src/lib/constants.ts` on
2026-08-24: Cinturon Blanco `minXP: 0`, Cinturon Amarillo `150`, Cinturon Naranja
`400`, Gran Maestro `11000`.

## Requirements

### Requirement: Rank Lookup by XP (`getRank`)

The system MUST return the highest-XP rank in `RANKS` whose `minXP` is less than
or equal to the given `xp`. It scans `RANKS` in ascending `minXP` order keeping
the last rank that qualifies, and it starts from `RANKS[0]` rather than from
nothing -- so `RANKS[0]` is the floor, and an `xp` below every threshold still
resolves to the first rank instead of to no rank at all. That floor is what the
negative-XP scenario below exercises; the qualifying rule alone would leave it
undefined.

#### Scenario: Zero XP resolves to the first rank

- GIVEN `xp = 0`
- WHEN `getRank(0)` is called
- THEN it returns "Cinturon Blanco" (`minXP: 0`)

#### Scenario: Exact boundary XP resolves to the boundary rank

- GIVEN `xp = 150` (exactly "Cinturon Amarillo"'s `minXP`)
- WHEN `getRank(150)` is called
- THEN it returns "Cinturon Amarillo", not "Cinturon Blanco"

#### Scenario: XP above the maximum rank resolves to the top rank

- GIVEN `xp = 50000` (far above "Gran Maestro"'s `minXP: 11000`)
- WHEN `getRank(50000)` is called
- THEN it returns "Gran Maestro"

#### Scenario: Negative XP resolves to the first rank

- GIVEN `xp = -1`
- WHEN `getRank(-1)` is called
- THEN it returns "Cinturon Blanco"

### Requirement: Next-Rank Lookup (`getNextRank`)

The system MUST return the first rank in `RANKS` whose `minXP` is strictly
greater than the given `xp`, or `null` when no such rank exists -- that is, when
`xp` is at or above the top rank's `minXP`.

#### Scenario: A mid-progression XP has a next rank

- GIVEN `xp = 149`
- WHEN `getNextRank(149)` is called
- THEN it returns "Cinturon Amarillo" (`minXP: 150`)

#### Scenario: XP at or above the top rank has no next rank

- GIVEN `xp = 11000` (equal to "Gran Maestro"'s `minXP`)
- WHEN `getNextRank(11000)` is called
- THEN it returns `null`

### Requirement: Progress-to-Next-Rank Calculation (`getXPProgress`)

The system MUST return `{ current, needed, percentage }` where, when a next rank
exists, `current` is `xp` minus the current rank's `minXP`, `needed` is the next
rank's `minXP` minus the current rank's `minXP`, and `percentage` is
`round(current / needed * 100)` capped at `100`. When no next rank exists, the
system MUST return `{ current: xp - currentRank.minXP, needed: 0, percentage: 100 }`.

#### Scenario: Zero XP starts progress at 0%

- GIVEN `xp = 0`
- WHEN `getXPProgress(0)` is called
- THEN it returns `{ current: 0, needed: 150, percentage: 0 }`

#### Scenario: XP at an exact rank boundary starts the new segment at 0%

- GIVEN `xp = 150`
- WHEN `getXPProgress(150)` is called
- THEN `current` is `0` relative to "Cinturon Amarillo" and `needed` is `250` (`400 - 150`)

#### Scenario: XP above the maximum rank reports 100% with no target

- GIVEN `xp = 50000`
- WHEN `getXPProgress(50000)` is called
- THEN it returns `{ current: 39000, needed: 0, percentage: 100 }`

## Recorded Deletions

### `calculateXP` -- removed, not fixed

`calculateXP` was documented as a requirement of this capability in the original
delta spec and was then deleted in `automated-gates` slice 2 (commit `f1897c5`,
landed via PR #2). It is recorded here so a future reader does not mistake its
absence for an oversight.

Reason: zero callers in `src/`. The live XP-award path is
`src/app/api/progress/route.ts` using `exercise?.xpReward ?? 10`. `calculateXP`
carried a real boundary defect -- `score > 1 ? score / 100 : score` misbehaves at
`score = 1` -- but the defect was latent and never fired. Deleting dead,
ambiguous logic was chosen over writing tests that would preserve it.

Migration: none required; no call sites existed. Re-verified 2026-08-24: zero
occurrences of `calculateXP` anywhere in `src/`.
