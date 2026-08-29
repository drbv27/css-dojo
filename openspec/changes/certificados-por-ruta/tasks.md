# Tasks — certificados-por-ruta

Nothing is issued to a student until Phase 5. Everything before it is
infrastructure that can land safely on `main` with no visible change.

## Phase 1: The classification, as a credential contract

- [x] 1.1 Add `nivel?: "obligatorio" | "profundizacion"` to `ModuleData` in `src/types/index.ts`. **Optional in the type**, and absence means *not classified* — never `"obligatorio"`.
- [x] 1.2 Declare `nivel: "profundizacion"` on the **11 optional CSS modules** and `nivel: "obligatorio"` on the **19 required** ones. All 30 CSS modules declare it, because the track has to be **fully** classified to be certifiable at all.
- [x] 1.3 **Do NOT touch the other 76 modules** (`js` 29, `react` 20, `html` 17, `react-eco` 5, `nextjs` 5). Those **five** tracks stay unclassified on purpose, and Phase 2's gate is what makes that safe.
  - **Measured, and it corrects the plan:** the repo has **six** tracks and **106** modules, not five and 101. `react-eco` ("Ecosistema React", `estado: "disponible"` in `DojoSwitcher`) was missing from every enumeration in this change. The gate covers it correctly — five unclassified modules means it refuses to certify — so this is a wrong count, not a wrong rule. `nivel-curriculum.test.ts` now pins the set of tracks so a seventh cannot appear and certify by omission.
- [x] 1.4 Curriculum test: exactly 30 CSS modules declare `nivel`, of which exactly **19 are `obligatorio`** and **11 are `profundizacion`**, enumerated by slug — not by count alone. A count that matches with the wrong composition is not a match.
- [x] 1.5 Curriculum test: no module outside `css` declares `nivel` yet. This one is a **tripwire**: when someone classifies a second track, this test fails and forces them to update it deliberately.

## Phase 2: Certifiability, the safety gate

- [x] 2.1 `esCertificable(dojo)` in `src/lib/certificados.ts`: true only when **every** module of the track declares `nivel`. Returns the count of unclassified modules when false.
  - Returns a **discriminated union**, not `{certificable, sinClasificar}`, so "certifiable, and also 7 modules are unclassified" is not representable. Same reason `JsRunOutcome` is a union.
  - **Added case not in the plan: `track-vacio`.** "Every module declares a level" is **vacuously true over zero modules**, so a `DojoType` that ships before its content would be certifiable *and* trivially completable at once. The gate rejects an empty track explicitly.
  - Split into a pure `certificabilidadDe(modulos, dojo)` plus `esCertificable(dojo)` bound to `ALL_MODULES`. The real curriculum cannot express a partially classified track, which is exactly the state task 2.3 has to exercise.
- [x] 2.2 Tests, both directions: `css` certifiable; `js`, `react`, `html`, `react-eco`, `nextjs` **not** certifiable, each reporting its own count.
- [x] 2.3 **Positive control:** declare `nivel` on one non-CSS module in a fixture and confirm the count drops by exactly one, and that the track is still not certifiable. A gate that cannot move is a gate that is not being read.

## Phase 3: Eligibility

> **CORRECTED 2026-08-25, after the instructor read the measurement.** Eligibility
> was first scoped to the cohort's enabled set. That is gone. See 3.6.

- [x] 3.1 `modulosObligatoriosDe(dojo)`: **every** `"obligatorio"` module of the track, in curriculum order. The cohort's enabled set is read through `@/lib/moduleVisibility` — one copy of the visibility rule, not two — but **only to report why a module is missing**, never to shrink what is required.
  - Reuse required an extraction: `slugsVisiblesPara` is session-shaped and returns **every** module to a teacher. Extracted `slugsHabilitadosParaCohorte(cohort)` and `cohorteDe(userId)`; the migrated branch of `slugsVisiblesPara` now calls the first.
- [x] 3.2 `esElegible(userId, dojo)`: certifiable, non-empty required set, and a `completed: true` `Progress` document for **every exercise** of **every** required module.
  - It is a **set-cover check, not a count**. `completados.size >= exercises.length` would let stale rows from a renamed exercise pay for one never done.
  - The eligible branch returns `modulos` + `ejerciciosPorModulo` — that IS the snapshot Phase 4 freezes. Computing it once removes the window where an award writes a different requirement than the one it just verified.
  - **Second vacuity case, added:** if every demanded module happened to carry zero exercises, "completed every exercise" is true for a student who did nothing. `sin-ejercicios-exigidos` rejects it, same shape as `track-vacio`.
  - `aunNoHabilitados` reports which missing modules the cohort has not been given. Informational, never a gate — it separates "this student is behind" from "the course has not got there".
- [x] 3.3 Tests for the four scenarios that decide the feature: a required module **not yet enabled is still demanded**; one missing exercise blocks; an empty required set is **not** trivially eligible; optional modules are never demanded.
  - Plus a second file for the **database half** (`certificados-esElegible.test.ts`): it asserts the query itself — `completed: true`, and every required module including the un-enabled ones.
- [x] 3.4 **Positive control:** remove a single `Progress` document from a fixture that was eligible and confirm eligibility flips.
- [x] 3.5 Measure against production, read-only. **Done 2026-08-25, instructor-authorised, read-only.** Zero eligible on all six tracks, as predicted — and the zero is **alive, not vacuous**: the database holds 5 349 `Progress` documents with `completed: true`, and one student is two exercises short of what was then demanded. Certifiability confirmed against production: `css` yes with 19 required; the other five refuse with 17, 29, 20, 5 and 5 unclassified. **Population correction:** cohort 2 has 14 students, cohort 1 has 21. The "0 of 35" in `design.md` was both cohorts together.
- [x] 3.6 **RULE CORRECTED — the cohort intersection is removed.** The instructor rejected the scoped rule on reading the measurement, and he is right.
  - **The justification was measured over the wrong population.** "0 of 35 qualify; the best nine reach 17 of 19" — those nine are necessarily **cohort 1**, because no cohort-2 student can reach 17 of 19 with eight modules never enabled for them (all fourteen sit at 0 in all eight). Cohort 1 is **explicitly out of scope**: its course ended with those modules never opened.
  - So the scoped rule fixed a problem belonging to a cohort nobody certifies, and in exchange **certified people mid-course**: the strongest student of cohort 2 qualified for a CSS completion certificate having done 11 of 19 required modules, never having seen `flexbox`, `css-grid` or `media-queries`.
  - **Retraction:** an earlier note here and in `design.md` claimed that student "was eligible the day before yesterday and stopped being eligible yesterday". True only under the removed rule. Under the corrected rule he was never eligible. Overstated, and withdrawn.
  - The snapshot rationale survives on its own evidence: commit `6822485` moved the required CSS path from **166 to 168 exercises**, raising the bar for everyone not yet awarded.
  - **Positive controls on the corrected rule:** reintroducing the cohort intersection turns **5** tests red; making `aunNoHabilitados` always empty turns **5** red; demanding the optional modules turns **24** red.

## Phase 4: The frozen certificate

- [x] 4.1 `Certificate` model — `{userId, dojo, cohort, modulos, ejerciciosPorModulo, otorgadoEn, codigo}`, unique index `{userId, dojo}`.
- [x] 4.2 `otorgar(userId, dojo)`: verifies eligibility, then **freezes** the module list and the per-module exercise counts into the document. Never recomputed afterwards.
  - The snapshot comes from the eligibility result itself, not from a second read of `ALL_MODULES`, so there is no window where the award records a different requirement than the one it just verified.
  - **Contradiction in `design.md`, resolved and corrected there:** it said a second award "is an update of the record". An update is exactly how a frozen document silently changes. A second award now returns the existing record **untouched** with `nuevo: false`.
  - Added `leerCertificado(userId, dojo)`, which task 4.4 needs to exist in order to be broken: it never touches `ALL_MODULES`, `Progress` or `esElegible`.
- [x] 4.3 Tests for the snapshot, which are the whole point of the model: adding exercises to a demanded module later leaves the certificate unchanged; reclassifying a demanded module later leaves it unchanged; a second award creates no duplicate.
- [x] 4.4 **Positive control:** make the reader recompute from live data instead of the record, and confirm the two snapshot tests turn red. A snapshot test that passes against a live query is testing nothing.
  - Run: **five** tests turn red, both named ones among them — adding exercises, reclassifying, disabling a module for the cohort, deleting the student's progress, and a second award after the module grew.

## Phase 5: Surfacing — DECIDED, and deliberately scheduled LAST

> **No longer blocked. Instructor decisions, 2026-08-25:**
>
> 1. **A certificate is awarded by an INSTRUCTOR ACTION**, never automatically on
>    reaching 100 %.
> 2. **The mini-challenges land BEFORE the first certificate is issued.** There is
>    no time pressure: infrastructure first, certificates last.

- [x] 5.1 **DECIDED: instructor action.** The endpoint is an explicit award, not a trigger fired by progress.
  - **What this buys.** No student is awarded by a background rule nobody watched. The instructor sees the list, decides, and acts — which matches how the course actually ends.
  - **What this costs, and 5.2 is the mitigation.** Nobody is watching eligibility for you. A student can reach 100 % and sit there unnoticed, and can silently fall back below it when a required module grows. Under automatic issuance the snapshot would have protected them the moment they qualified; under instructor action the protection only starts when you click. **So the teacher view is not a nicety here — it is the only thing that makes this choice safe.**
  - `otorgar(userId, dojo)` already implements exactly this shape: it verifies eligibility and freezes, and it is called by nobody. It needs an authenticated teacher-only endpoint on top, nothing more.
  - **Endpoint shipped 2026-08-29.** `POST /api/teacher/certificados`, teacher-only, plus an **Otorgar** button on eligible rows of the 5.2 view.
  - **Eligibility is not re-decided by the caller.** The teacher says WHO, never WHETHER: a request naming an ineligible student is refused by `otorgar`, not by the handler and not by the button being hidden. A UI that hides the button is a convenience, not a check.
  - **409, not 400, on an ineligible student**, and the reason travels whole. The request is well-formed; the student's state is what does not allow it. In practice a refusal here means this screen's roster went stale — content landed in a required module and the student fell below 100 % — so the view reloads and says so.
  - **The button confirms first, naming the student and the route.** There is no revocation (`design.md`: "a certificate awarded is awarded"), so a click on the wrong row is permanent and no screen undoes it. A confirmation that only asks "are you sure?" does not help anyone notice they hit the wrong row.
  - **No bulk award.** Mass + irreversible + unrevocable is the wrong combination for a credential the instructor signs.
- [x] 5.2 A teacher view of who is eligible per track, and who is close. Ship this **before or with** the award endpoint, never after — see the cost noted in 5.1.
  - **Shipped 2026-08-29, read-only.** `/teacher/certificados`, `GET /api/teacher/certificados`, and `src/lib/certificados-panel.ts`.
  - **Batched, not looped.** `esElegible` is right for one student and wrong for a roster: over 35 students it is 105 round trips for one screen. The panel does four reads total and then calls `elegibilidadDe` — the SAME pure function, not a second copy of the rule. A re-implementation that drifted would show a roster disagreeing with what the award endpoint will do, and it would surface as an award that "mysteriously" refuses. A guard counts the reads.
  - **No invented "close enough" threshold.** Rows sort by distance; who is worth a click is the instructor's call. The platform already carries one rule nobody chose (partial credit completes at 70); a second invented cutoff would hide students behind a number nobody picked.
  - **`aunNoHabilitados` is its own column**, because "this student is behind" is a conversation with the student and "the course has not got there" is a conversation with the calendar.
  - `esElegible` already returns everything it needs: the required list, the missing exercise ids per module, and `aunNoHabilitados`, which separates "this student is behind" from "the course has not got there".
- [ ] 5.3 The student's own view of their certificate. Reads `leerCertificado`, which never recomputes.

## Sequencing — DECIDED

`plan-mejoras-css.md` Phase 4 (lesson → challenge → lesson → challenge) **adds
exercises to required modules**.

**Instructor decision 2026-08-25: the mini-challenges land first, and the first
certificate is issued after them.** That avoids two populations certified against
different definitions of the same track, and it means the snapshot is protecting
against future content changes rather than one already in flight.

Concretely, the order is: mini-challenges → all 19 required CSS modules enabled
for cohort 2 → Phase 5 → first award. Nothing in Phases 1–4 waits on any of it.

## Explicitly out of scope

Reconciling cohort 1 (instructor decision: it was an experiment, its students
have largely stopped logging in, and the snapshot design is what will let them be
awarded honestly later) · classifying the other five unclassified tracks · public verification
pages, PDF rendering, LinkedIn.
