# Tasks — css-track-fase-2

## Phase 1: Measure production before writing anything

- [x] 1.1 Query `Progress`, `users` and `modulesettings` read-only against production. Results in `hallazgos.md`, each number with the command that produced it.
- [x] 1.2 Rule out the visibility confound before reading any zero. After migration the default is BLOCKED, so a module with no `ModuleSettings` doc is invisible and its zero means nothing. Cohort 1 turned out to be the clean signal: 21 students, everything visible.
- [x] 1.3 Contrast against the 19/11 classification. **Result: it cannot be validated with today's data.** The four optional modules at zero were added 2026-08-22/23; cohort 1 stopped on 2026-08-12.
- [x] 1.4 Check whether any module is a difficulty wall. It is not: `completed` is true on 99.3 % of documents and attempts per exercise top out at 2.00. `especificidad` (14) sits at 1.36.

## Phase 2: Instrument, because the data does not exist yet

- [x] 2.1 `ModuleView` model — one document per student and module, growth bounded to users × modules.
- [x] 2.2 `POST /api/module-views` with three guards, each so the number means what it says: teachers are never recorded, unknown `moduleId` is rejected, and a module not visible to that cohort is not a view.
- [x] 2.3 Extract the visibility rule to `@/lib/moduleVisibility`. Two routes needed the same rule, and two copies of a visibility rule is how they drift.
- [x] 2.4 Tests for that rule — it had **none**, living inline in a route handler. Six now, including the blocked-by-default case. Positive control: flipping the default to visible turns 4 of the 6 red.
- [x] 2.5 Wire it into the module page with a per-slug latch, so StrictMode's double mount does not make the number mean something different in dev than in production.
- [x] 2.6 All five gates. Merged as PR #33.

## Phase 3: Close the content gap that did not need data

- [x] 3.1 `unidades-css` (5) taught the `100vh` mobile problem, named `dvh` in one line, and never practised it. Measured: `dvh` once in all of `src/`; `svh`, `lvh`, `svw`, `lvw` zero times.
- [x] 3.2 Section with the cause, the three variants, and when each is worth using. Two exercises: a quiz on the cause rather than the symptom, and a code-completion that writes `dvh`.
- [x] 3.3 Both ceilings measured before and after: forward-reference ledger 23 → 23 (limit 23), `sinEscribir` 60 → 60 (limit 60). The ledger counts (module, pattern) pairs, not occurrences, and `unidades-css` already contributes 4 of the 23 — so any NEW pattern breaks it.
- [x] 3.4 Positive control that the guards inspect the new content: a missing accent turns `acentuacion.test.ts` red; switching the new exercise's validation to `includes` turns `validacion-curriculum.test.ts` red naming `10-ej-10`.
- [x] 3.5 All five gates. Merged as PR #34.

## Phase 4: Investigate the one zero antiquity does not explain

- [x] 4.1 `tailwind-css` (29) — old (2026-03-25), visible, required by the instructor's call, and at zero. **No content work needed.** The nine students who reached `bootstrap-5` (28) all stopped between 2026-07-03 and 2026-07-12, eight inside nine days. A cohort ending together, not nine decisions about Tailwind.
- [x] 4.2 Neighbouring finding, fixed with explicit authorisation: visibility was inverted at the track's ends. Cohort 1 could not see `proyecto-cv-css` (30); cohort 2 could, while unable to see modules 15-29. Enabled for cohort 1, disabled for cohort 2. Zero progress documents in that module in either cohort, so no student's work was interrupted.

## Phase 5: BLOCKED ON DATA — do not start without it

**This is the phase that is parked. It is not abandoned and it is not done.**

- [ ] 5.1 Wait for `ModuleView` data from cohort 2. Two to three weeks from the deploy of PR #33. The cohort is live and around module 10.
- [ ] 5.2 For each CSS module, compare opened against submitted. Tell apart the three patterns in `design.md` — opened-and-abandoned, genuinely skipped, and never reached — because only the second is evidence about the classification.
- [ ] 5.3 Decide required field versus defaulted field on `ModuleData`, measuring the cost across **107** module files and stating what the chosen default silently says about the 77 modules outside CSS.
- [ ] 5.4 Only then, implement the field and any content the data actually calls for.

**Do not skip to 5.3.** Writing the field without 5.2 encodes an unvalidated
hypothesis into the data model, and this repo has spent days on records that
asserted things nobody had measured.

## Explicitly out of scope

Reopening the 19/11 classification (settled — see `design.md`), touching
`ModuleSettings`' binary shape, and classifying the other five tracks.
