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

- [x] 3.1 `modulosExigidos(dojo, cohort)`: the track's `"obligatorio"` modules **enabled for that cohort**, reusing `@/lib/moduleVisibility` — not a second copy of the visibility rule.
  - Reuse required an extraction: `slugsVisiblesPara` is session-shaped and returns **every** module to a teacher, so a certificate computed from it would demand modules the cohort never saw. Extracted `slugsHabilitadosParaCohorte(cohort)` and `cohorteDe(userId)`, and the migrated branch of `slugsVisiblesPara` now calls the first one. Same rule, one copy.
  - Pre-migration returns empty, so nobody is awarded before the cohort migration. Fails safe on purpose.
- [x] 3.2 `esElegible(userId, dojo)`: certifiable, non-empty required set, and a `completed: true` `Progress` document for **every exercise** of **every** required module.
  - It is a **set-cover check, not a count**. `completados.size >= exercises.length` would let stale rows from a renamed exercise pay for one never done.
  - The eligible branch returns `modulos` + `ejerciciosPorModulo` — that IS the snapshot Phase 4 freezes. Computing it once removes the window where an award writes a different requirement than the one it just verified.
  - **Second vacuity case, added:** if every demanded module happened to carry zero exercises, "completed every exercise" is true for a student who did nothing. `sin-ejercicios-exigidos` rejects it, same shape as `track-vacio`.
- [x] 3.3 Tests for the four scenarios that decide the feature: a required module not enabled for the cohort is not demanded; one missing exercise blocks; an empty required set is **not** trivially eligible; optional modules are never demanded.
  - Plus a second file for the **database half** (`certificados-esElegible.test.ts`): it asserts the query itself — `completed: true`, and only the demanded modules — because that is where this kind of feature actually breaks.
- [x] 3.4 **Positive control:** remove a single `Progress` document from a fixture that was eligible and confirm eligibility flips. If it does not, the test was reading something other than exercise completion.
- [x] 3.5 Measure against production, read-only, before trusting any of it: how many cohort-2 students are eligible today, and for which tracks. Expected today: **zero**, because cohort 2 is around module 10. A non-zero answer means the rule is wrong, not that the students are fast.
  - **Measured 2026-08-25 against the live database, read-only, authorised by the instructor.** Result: **zero eligible, on all six tracks.** `migrated=true`, `activeCohort=2`.
  - **The zero is alive, not vacuous.** The database holds **5 349** `Progress` documents with `completed: true`, and the closest student is **2 exercises away**. A zero produced by a rule that reads nothing would have shown the same headline number, so this is the check that separates the two.
  - Certifiability confirmed against production data: `css` yes with 19 required; `html` 17, `js` 29, `react` 20, `react-eco` 5, `nextjs` 5 unclassified — the 76 measured in Phase 1.
  - **Cohort 2 is demanded 11 of the 19 required CSS modules — 97 exercises**, not 19 and 168. The eight not yet enabled are `float-display`, `posicionamiento`, `flexbox`, `css-grid`, `variables-css`, `media-queries`, `tailwind-css`, `proyecto-cv-css`. That gap IS the cohort-scoped rule doing its job.
  - **Population correction:** cohort 2 has **14** students with `role: "student"`. The "0 of 35" in `design.md` was measured over a different population (all students, both cohorts). Both numbers are zero; they are not the same measurement, and the 35 should not be quoted as a cohort-2 figure.
  - **This is now a Phase 5 input, not a curiosity:** one student is 2 exercises from the CSS certificate under today's enabled set. The first time a further required module is enabled for cohort 2, that student goes from 2-away to far away — the exact scenario the spec calls "Opening a new required module mid-course", about to happen to a named person before any teacher view exists to show it.

## Phase 4: The frozen certificate

- [x] 4.1 `Certificate` model — `{userId, dojo, cohort, modulos, ejerciciosPorModulo, otorgadoEn, codigo}`, unique index `{userId, dojo}`.
- [x] 4.2 `otorgar(userId, dojo)`: verifies eligibility, then **freezes** the module list and the per-module exercise counts into the document. Never recomputed afterwards.
  - The snapshot comes from the eligibility result itself, not from a second read of `ALL_MODULES`, so there is no window where the award records a different requirement than the one it just verified.
  - **Contradiction in `design.md`, resolved and corrected there:** it said a second award "is an update of the record". An update is exactly how a frozen document silently changes. A second award now returns the existing record **untouched** with `nuevo: false`.
  - Added `leerCertificado(userId, dojo)`, which task 4.4 needs to exist in order to be broken: it never touches `ALL_MODULES`, `Progress` or `esElegible`.
- [x] 4.3 Tests for the snapshot, which are the whole point of the model: adding exercises to a demanded module later leaves the certificate unchanged; reclassifying a demanded module later leaves it unchanged; a second award creates no duplicate.
- [x] 4.4 **Positive control:** make the reader recompute from live data instead of the record, and confirm the two snapshot tests turn red. A snapshot test that passes against a live query is testing nothing.
  - Run: **five** tests turn red, both named ones among them — adding exercises, reclassifying, disabling a module for the cohort, deleting the student's progress, and a second award after the module grew.

## Phase 5: Surfacing — BLOCKED on a product decision

- [ ] 5.1 **DECISION REQUIRED, and it blocks this phase only:** is a certificate awarded **automatically** on reaching 100 %, or by an **instructor action**? The model supports both; the endpoint cannot be written until it is chosen.
- [ ] 5.2 A teacher view of who is eligible per track, and — per the spec — who *was* eligible and no longer is because a required module was opened. The instructor must see that before a student does.
- [ ] 5.3 The student's own view of their certificate.

## Sequencing note: the mini-challenges

`plan-mejoras-css.md` Phase 4 (lesson → challenge → lesson → challenge) **adds
exercises to required modules**. That is exactly what Phase 4's snapshot exists
to survive, so it does not block this change.

But issuing the **first** certificates in the middle of that rollout produces two
populations with different definitions. Cleaner: land the challenges, or decide
explicitly not to, before Phase 5 issues anything.

## Explicitly out of scope

Reconciling cohort 1 (instructor decision: it was an experiment, its students
have largely stopped logging in, and the snapshot design is what will let them be
awarded honestly later) · classifying the other five unclassified tracks · public verification
pages, PDF rendering, LinkedIn.
