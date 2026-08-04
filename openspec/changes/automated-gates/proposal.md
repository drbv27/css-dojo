# Proposal: Automated Verification Gates

Phase: `sdd-propose` · Artifact store: hybrid (Engram mirror: `sdd/automated-gates/proposal`) · Depends on: `exploration.md`

**Recommendation up front: ship as TWO stacked slices.** Slice 1 repairs the lint gate and clears the errors it finds. Slice 2 adds the test tiers. Rationale in *Delivery*.

## Intent

### The risk today, in plain terms

| Fact | Consequence |
| --- | --- |
| `npm run build` is the only working gate | It proves the app compiles. It proves nothing about behaviour. |
| `npm run lint` is broken (`next lint` removed in Next.js 16.2.1) | 46 errors sit unseen. `next build` no longer lints, so the removal was silent. |
| No test runner at all | Every behavioural claim in this repo is verified by a human clicking, or not at all. |
| **No CI pipeline and no hook manager exist** (no `.github/`, no `.husky/`) | Even a repaired gate runs only when someone remembers. "Automated" means *scriptable*, not *enforced*. |
| 8 `react-hooks/set-state-in-effect` errors in live components | Real cascading-render risk, including in `Landing3D.tsx:32`, which `loader-moderno-dojo` is about to modify. |

`loader-moderno-dojo` is planned through tasks with 8 requirements and 15 Given/When/Then scenarios, and is on hold at apply. Without a harness, those 15 scenarios can only be verified by a 9-step manual QA checklist. This change builds the harness first so the loader can be implemented RED-first.

### Measurable outcomes

- [ ] Four gate commands exist and exit 0 on `main`: `lint`, `typecheck`, `test:run`, `test:e2e`.
- [ ] Lint **errors: 46 → 0**. `react-hooks/set-state-in-effect`: **8 → 0**. (The error budget adds up exactly: 35 `no-explicit-any` downgraded + 8 hooks fixed + 2 `preserve-manual-memoization` fixed + 1 `prefer-const` fixed = 46. See *Error arithmetic*.)
- [ ] `src/lib/xp.ts` covered by unit tests across four functions and their edge cases (`xp = 0`, exact rank boundary, above max rank, score clamping).
- [ ] `loader-moderno-dojo` can write its 13 jsdom tests with **zero infrastructure work**.
- [ ] `Landing3D.tsx` is lint-error-free before the loader change touches it (all of `src/components/landing/` if item 5b is ratified).

## Scope

### In scope

| # | Deliverable | Slice |
| --- | --- | --- |
| 1 | `eslint.config.mjs` (flat config: `eslint-config-next/core-web-vitals` + `/typescript`, ignores) | 1 |
| 2 | `lint` script → `eslint .`; new `typecheck` script → `tsc --noEmit` | 1 |
| 3 | `@typescript-eslint/no-explicit-any` downgraded `error` → `warn` + follow-up recorded for the 35 occurrences | 1 |
| 4 | Fix all 8 `react-hooks/set-state-in-effect` errors (6 files) | 1 |
| 5 | Clear the 3 trivial errors: 2 unused `eslint-disable` directives (`src/lib/db.ts`, `src/lib/mongodb-client.ts`), 1 `prefer-const` | 1 |
| 5b | Fix the 2 `react-hooks/preserve-manual-memoization` errors (`Personaje.tsx:49`; the second location was not recorded by the exploration) — **required for "0 errors" to be true**, see *Error arithmetic* | 1 |
| 6 | Vitest + jsdom + `@testing-library/react` v16 + `vite-tsconfig-paths` infra (`vitest.config.mts`) | 2 |
| 7 | `src/lib/xp.ts` unit test suite | 2 |
| 8 | Playwright infra (`playwright.config.ts`) + one green landing smoke E2E | 2 |

### Non-goals (deliberately excluded)

| Excluded | Why |
| --- | --- |
| Typing the 35 `any` occurrences | Real work, unrelated to establishing gates. Downgraded to `warn`, follow-up recorded. |
| The 21 existing warnings (unused vars, `no-img-element`, `exhaustive-deps`) | Non-blocking. Sweeping them touches many files for no gate benefit. |
| Extracting + testing `ExerciseRenderer`'s validation logic | Refactor of a live component. `src/lib/xp.ts` proves the harness with zero coupling. |
| The 13 jsdom `landing-loader` tests | Written RED-first inside `loader-moderno-dojo`'s own apply. Merging a red suite into `main` is not acceptable. |
| The `landing-loader` 4.2 E2E spec | Cannot be green here — `Loader.tsx` has no error state yet. Authored in the loader change against this change's runner. |
| MongoDB models, API routes, auth | Untouched. See *Security*. |
| CI workflow / pre-commit hooks | Not requested. Gates ship as scriptable commands; enforcement is an open question (see *Proposal question round*). |
| `--max-warnings` threshold | Warnings rise to ~56 by design in this change. A ratchet is a follow-up, not a gate. |

## Capabilities

### New Capabilities

- `automated-verification-gates`: which gate commands MUST exist, what each covers, exit-code semantics (errors block, warnings do not), and the lint-error-free baseline invariant for the `loader-moderno-dojo` handoff files.
- `xp-progression`: the existing rank/XP rules in `src/lib/xp.ts` stated as requirements so the first unit suite verifies a spec rather than describing whatever the code happens to do.

### Modified Capabilities

None. `openspec/specs/` is empty.

## Approach

### Target `package.json` scripts

```json
"dev":       "next dev",
"build":     "next build",
"start":     "next start",
"lint":      "eslint .",
"typecheck": "tsc --noEmit",
"test":      "vitest",
"test:run":  "vitest run",
"test:e2e":  "playwright test"
```

### What each gate covers

| Gate | Covers | Does not cover |
| --- | --- | --- |
| `lint` | Flat-config Next.js core-web-vitals + TS rules over 243 files. Blocks on errors only. | Anything runtime. |
| `typecheck` | Standalone `strict` type check. Passes clean today; only the script is missing. | Anything runtime. |
| `test:run` | jsdom unit tier. Pure logic today; the loader's 13 scenarios tomorrow. | Real WebGL, real network. |
| `test:e2e` | Real browser, real network, real `Canvas` mount. | Pixel-level visual correctness (stays manual). |

### Error arithmetic — a gap in the settled decisions

The four user decisions cover 44 of the 46 errors. The remaining 2 were not assigned, and without them the headline outcome is false:

| Rule | Count | Treatment | Source |
| --- | --- | --- | --- |
| `@typescript-eslint/no-explicit-any` | 35 | Downgrade to `warn` + follow-up | User decision 1 |
| `react-hooks/set-state-in-effect` | 8 | Fix | User decision 1 |
| `prefer-const` | 1 | Fix (trivial) | Implied |
| `react-hooks/preserve-manual-memoization` | **2** | **Unassigned** | — |
| **Total** | **46** | | |

**Recommendation: fix the 2.** They are memoization-correctness issues in `Personaje.tsx` and neighbours, roughly 10 lines, and fixing them is what makes "`npm run lint` exits 0 with 0 errors" a true statement instead of an aspiration. The alternative — downgrading a third rule — buys nothing and leaves the gate weaker. This is a small scope addition the spec phase must ratify, not a decision this proposal can settle alone.

### Playwright, stated honestly

jsdom cannot mount `@react-three/fiber`'s `Canvas`, so it can prove the loader *reacts* to an injected `useProgress().errors` entry but never that a real `.glb` 404 *produces* one. That gap is exactly **1 of the 15** `landing-loader` scenarios (4.2), plus a future home for visual regression that no current scenario requires. The cost is browser binaries (~300MB+), a second runner and fixture model, and CI time. The user was told this and reaffirmed; Playwright is in.

What it delivers *here* is the runner plus one smoke test that is green on `main`. Scenario 4.2's spec is authored in `loader-moderno-dojo`'s apply, because the error state it asserts does not exist yet — the alternative is merging a red E2E, which contradicts the settled RED-first-in-the-loader-change decision.

### Unblocking `loader-moderno-dojo`

1. **`Landing3D.tsx:32` handoff.** This change fixes it alongside the other 7 of its family, so the loader change starts from an error-free file and does not mix hooks-debt repair with a loader redesign. With item 5b ratified, all of `src/components/landing/` becomes error-free (`Personaje.tsx:49` fixed; `:57` remains a warning). Without item 5b, the guarantee narrows to `Landing3D.tsx` alone — still enough for the handoff.
2. **Harness ready.** jsdom, fake timers, `matchMedia` mocking, and a `Canvas`-capable E2E runner all exist, so the loader's apply writes tests, not config.
3. **`openspec/config.yaml` corrected.** Its `testing.linter: "BROKEN"` and `apply.guidelines` "do NOT rely on `npm run lint`" entries are what this change repairs. `loader-moderno-dojo`'s `forward_to_apply.note` (task 4.1 marked BLOCKED) can be lifted afterwards by its own re-plan — this change does not edit that folder.

## Delivery: one change or two slices?

**Two stacked slices.** Aggregate estimate is **266-381 authored lines** against a 400-line budget (generated `package-lock.json` excluded from the authored count per the review guard, but reviewers still see it).

| Slice | Content | Est. authored lines | Review mode |
| --- | --- | --- | --- |
| **1 — Gate on, errors cleared** | Items 1-5b | 95-145 | Behaviour-preservation reasoning + manual QA per component |
| **2 — Test tiers** | Items 6-8 | 170-240 | Mechanical config review; zero production code touched |

Rationale, against `chained-pr`'s decision gates:

- The aggregate is under 400 at the midpoint, so the size rule alone would permit one PR — but that gate requires the PR be *focused*, and this one is not. It mixes behavioural refactors of 6 live production components that have **no test coverage** with purely additive tooling. Those demand different review modes and carry different rollback scopes: reverting a config file is free, reverting a hooks refactor may require re-running manual QA.
- The upper bound (381) leaves only 19 lines of headroom, and the single largest uncertainty — items 4's true size, with 3 of the 8 fixes concentrated in `GameEngine.tsx` — is only knowable while doing it. A single PR risks silently breaching the budget mid-apply, which under `delivery_strategy: ask-on-risk` forces a stop at the worst possible moment.
- Both slices land independently green, so **Stacked PRs to main** applies, not a Feature Branch Chain tracker. Slice 2 branches off slice 1 to avoid a `package.json` scripts-block conflict and retargets `main` once slice 1 merges.

The seam evaluated and adopted is the one the orchestrator suggested, with the reasoning made explicit. One alternative was considered and rejected: putting the hooks fixes in slice 2 and shipping the gate first with `set-state-in-effect` temporarily at `warn`. It would make slice 1 purely additive, but it puts a rule downgrade on `main` and then reverts it inside the same change — extra motion for no reviewer benefit. Keeping "turn the gate on and make it pass" as one coherent unit is stronger.

Within slice 1, commit the non-behavioural work (items 1-3 and 5) separately from the behavioural work (items 4 and 5b), so a regression can be reverted without losing the gate.

## Affected Areas

| Area | Impact | Description |
| --- | --- | --- |
| `eslint.config.mjs` | New | Flat config + `no-explicit-any` override |
| `package.json` | Modified | 1 script fixed, 4 added, devDeps for both runners |
| `vitest.config.mts`, `playwright.config.ts` | New | Test tier config |
| `src/lib/xp.test.ts` (or `__tests__/`) | New | First unit suite |
| `e2e/landing.spec.ts` | New | One smoke test |
| `src/app/(app)/leaderboard/page.tsx:102` | Modified | `set-state-in-effect` fix |
| `src/app/(auth)/nueva-contrasena/page.tsx:29` | Modified | `set-state-in-effect` fix — **auth-adjacent UI, see Security** |
| `src/components/games/GameEngine.tsx:56,93,107` | Modified | 3 `set-state-in-effect` fixes |
| `src/components/landing/Landing3D.tsx:32` | Modified | `set-state-in-effect` fix — the `loader-moderno-dojo` handoff |
| `src/components/layout/MobileMenu.tsx:76`, `MobileNav.tsx:73` | Modified | `set-state-in-effect` fixes |
| `src/components/landing/Personaje.tsx:49` (+1 unlocated site) | Modified | `preserve-manual-memoization` fixes — item 5b, pending spec-phase ratification |
| `src/lib/db.ts`, `src/lib/mongodb-client.ts` | Modified | Remove one unused `eslint-disable` comment each — **comment-only, zero runtime effect** |
| `.gitignore` | Modified | `test-results/`, `playwright-report/`, coverage output |

## Security-sensitive callout

Per `rules.proposal`, stated explicitly rather than omitted:

- **`src/lib/auth.ts`: NOT touched. `ApprovalGate.tsx`: NOT touched. No Mongoose model, no API route, no JWT/cookie logic.**
- **XP/gamification logic: NOT modified.** This change *tests* `src/lib/xp.ts`; it does not change a line of it. If a test disagrees with the code, the finding is recorded — the code is not silently "fixed" to match.
- **Two adjacencies that deserve naming**, neither of which is an auth-logic change:
  1. `src/app/(auth)/nueva-contrasena/page.tsx:29` is a hooks fix on the **password-reset page**. It is presentation state, not credential handling, but it sits on a security-relevant flow. The reset flow MUST be manually exercised end-to-end before slice 1 merges.
  2. `src/lib/db.ts` and `src/lib/mongodb-client.ts` are DB connection modules, but the edit removes a dead lint directive comment — no executable change.

## Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| A `set-state-in-effect` fix changes behaviour, with no tests to catch it | **High** | 6 components, manual QA per component; separate commit so it reverts alone; `GameEngine.tsx` (3 fixes) gets the closest scrutiny |
| Item 4 exceeds its 60-110 line estimate | Medium | Slice boundary absorbs it; slice 1 has ~255 lines of headroom against the budget |
| Playwright browser install needs network; unverified in this environment | Medium | Verify `npx playwright install` early in slice 2; if it fails, slice 2 stops at the Vitest tier and Playwright becomes its own slice |
| Warning count rises 21 → ~56 and normalises noise | Medium | Recorded follow-up; `--max-warnings` ratchet proposed as the fix, deliberately not in this change |
| framer-motion `AnimatePresence` timing in jsdom (loader scenario 5.1) | Medium | Not this change's problem to solve; flagged for the loader's apply |
| Gates exist but nothing runs them (no CI, no hooks) | **High** | Open question below. Untreated, this change delivers capability without enforcement |
| The single `prefer-const` error's location, and the second `preserve-manual-memoization` site, were not recorded | Low | Locate by running the gate during apply |
| The 2 `preserve-manual-memoization` errors fall outside the four settled decisions, so "0 errors" is not yet a ratified goal | **High** | Surfaced in *Error arithmetic* and in the question round; the spec phase MUST ratify item 5b or restate the outcome as "0 errors excluding 2 known" |

## Rollback Plan

| Scenario | Action |
| --- | --- |
| Slice 2 causes any problem | `git revert` the slice. Purely additive: config files, test files, devDeps. **Zero production code touched, therefore zero runtime risk.** Optionally `npm uninstall` the runners. |
| Slice 1 hooks fix regresses a component | Revert **only** the item-4 commit. The lint gate, typecheck script, and config survive. Then downgrade `react-hooks/set-state-in-effect` to `warn` in `eslint.config.mjs` (1 line) so `main` stays green while the fix is redone. |
| The lint gate itself is wrong (bad ignores, wrong config) | Revert the item 1-3 commit. `npm run lint` returns to its broken state — no worse than today, and `npm run build` is unaffected throughout. |
| Full abort | Revert both slices. `package.json` returns to 4 scripts, `openspec/config.yaml` keeps its "BROKEN" annotations as accurate. |

No migration, no persisted data, no schema. Every step is a plain `git revert`.

## Dependencies

- **None to install for the lint or typecheck gate.** `eslint@^9.39.4` and `eslint-config-next@^16.2.1` are already in `node_modules`; the flat-config subpaths `./core-web-vitals`, `./typescript`, `./parser` are confirmed present.
- Slice 2 installs: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react` (v16 line — required for React 19), `@testing-library/dom`, `vite-tsconfig-paths`, `@playwright/test` + browser binaries.
- `@testing-library/react` is installed even though `xp.ts` needs no DOM, so `loader-moderno-dojo` inherits a complete harness.

## Success Criteria

- [ ] `npm run lint` exits 0 with **0 errors** (requires item 5b; see *Error arithmetic*).
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test:run` exits 0 with the `xp.ts` suite passing.
- [ ] `npm run test:e2e` exits 0 with one smoke test passing.
- [ ] `npm run build` still exits 0.
- [ ] `npx eslint src/components/landing/` reports 0 errors for `Landing3D.tsx`.
- [ ] `react-hooks/set-state-in-effect` reports 0 occurrences repo-wide.
- [ ] All 6 refactored components manually exercised, including the password-reset flow end to end.
- [ ] A follow-up is recorded for the 35 `no-explicit-any` occurrences.
- [ ] `openspec/config.yaml` `testing.linter`, `testing.unit`, `testing.e2e`, `apply.test_command`, and `verify.test_command` updated to the new truth.

## Proposal question round

Executed as a written round: this phase runs as a sub-agent and cannot prompt the user directly. These are product/policy questions, not harness mechanics. Answer, correct, skip, or request a second round.

1. **Enforcement.** There is no `.github/`, no `.husky/`, and no CI of any kind in this repo. Four green npm scripts that nothing runs automatically still rely on someone remembering. Should a minimal CI workflow (or a pre-commit hook) be part of this change, or is "the commands exist and agents/devs run them" the intended end state for now? Default assumption: **out of scope** — gates ship as commands only.
2. **Warning policy.** After downgrading `no-explicit-any`, `main` carries ~56 non-blocking warnings, up from 21 visible today. Is an unbounded warning count acceptable, or should the follow-up freeze it with `--max-warnings 56` so it can only shrink? Default assumption: **unbounded for now**, ratchet proposed as a follow-up.
3. **Regression tolerance on the hooks fixes.** Six live components get refactored with zero automated coverage; the only safety net is manual QA. Is that acceptable for `GameEngine.tsx` (3 of the 8 fixes, and the component behind the games track), or should its 3 fixes be deferred to their own change with tests written first? Default assumption: **all 8 fixed here**, per the settled decision.

### Assumptions needing confirmation

- Playwright ships here as **infra plus one green smoke test**; the `landing-loader` 4.2 spec is authored during `loader-moderno-dojo`'s apply, because the error state it asserts does not exist yet. This follows from the settled RED-first decision rather than reopening the Playwright decision.
- **Item 5b is a scope addition beyond the four settled decisions.** 46 errors − 35 downgraded `any` − 8 hooks − 1 `prefer-const` leaves **2 `preserve-manual-memoization` errors** that nobody has assigned. Either they are fixed here (recommended, ~10 lines, makes "0 errors" true) or the rule is downgraded (weaker gate, no benefit) or the outcome is restated as "0 errors excluding 2 known" (honest but leaves a red gate). This proposal recommends the first and flags it for ratification rather than assuming it.
- `Personaje.tsx:57` (`exhaustive-deps`, missing dependency `color`) stays a **warning** and is not fixed. Its sibling at `:49` is fixed only if item 5b is ratified.
- The lint-clean invariant this change guarantees is scoped to **`Landing3D.tsx`** — the `loader-moderno-dojo` handoff file — not to all of `src/components/landing/`, which retains warnings regardless.
