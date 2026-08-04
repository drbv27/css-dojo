# Delta for XP Progression

## Purpose

States the existing rank/XP rules already implemented in `src/lib/xp.ts` (`getRank`, `getNextRank`, `getXPProgress`) as testable requirements, so the first unit suite verifies a spec rather than describing whatever the code happens to do. This capability underpins gamification across **all four dojo tracks (css/html/js/react)** rather than belonging to one — rank and XP are computed identically regardless of which track a student is working in. `calculateXP` was also documented here originally; it is now a REMOVED requirement (deleted in slice 2 — zero callers, see below).

## ADDED Requirements

### Requirement: Rank Lookup by XP (`getRank`)

The system MUST return the highest-XP rank in `RANKS` whose `minXP` is less than or equal to the given `xp`, by scanning `RANKS` in ascending `minXP` order and keeping the last rank that still qualifies.

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

### Requirement: Next-Rank Lookup (`getNextRank`)

The system MUST return the first rank in `RANKS` whose `minXP` is strictly greater than the given `xp`, or `null` when no such rank exists (i.e., `xp` is at or above the top rank's `minXP`).

#### Scenario: A mid-progression XP has a next rank

- GIVEN `xp = 149`
- WHEN `getNextRank(149)` is called
- THEN it returns "Cinturon Amarillo" (`minXP: 150`)

#### Scenario: XP at or above the top rank has no next rank

- GIVEN `xp = 11000` (equal to "Gran Maestro"'s `minXP`)
- WHEN `getNextRank(11000)` is called
- THEN it returns `null`

### Requirement: Progress-to-Next-Rank Calculation (`getXPProgress`)

The system MUST return `{ current, needed, percentage }` where, when a next rank exists, `current` is `xp` minus the current rank's `minXP`, `needed` is the next rank's `minXP` minus the current rank's `minXP`, and `percentage` is `round(current / needed * 100)` capped at `100`. When no next rank exists, the system MUST return `{ current: xp - currentRank.minXP, needed: 0, percentage: 100 }`.

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

## REMOVED Requirements

### Requirement: XP Award Calculation and Clamping (`calculateXP`)

(Reason: `calculateXP` has zero callers in `src/` — the live XP-award path is
`src/app/api/progress/route.ts` using `exercise?.xpReward ?? 10`. Its
`score > 1 ? score / 100 : score` boundary bug at `score = 1` is real but
latent and never fires. Deleted in `automated-gates` slice 2 rather than
fixed, to avoid testing/preserving dead, ambiguous logic.)
(Migration: No consumers exist; no call sites require updating.)
