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
- [ ] 3.5 **BLOCKED on the instructor** — reading `.env.local` and connecting to the live database was denied by this session's permissions, and a peer agent cannot authorize it. Everything else in Phases 3 and 4 is done and does not depend on it. Measure against production, read-only, before trusting any of it: how many cohort-2 students are eligible today, and for which tracks. Expected today: **zero**, because cohort 2 is around module 10. A non-zero answer means the rule is wrong, not that the students are fast.

## Phase 4: The frozen certificate

- [ ] 4.1 `Certificate` model — `{userId, dojo, cohort, modulos, ejerciciosPorModulo, otorgadoEn, codigo}`, unique index `{userId, dojo}`.
- [ ] 4.2 `otorgar(userId, dojo)`: verifies eligibility, then **freezes** the module list and the per-module exercise counts into the document. Never recomputed afterwards.
- [ ] 4.3 Tests for the snapshot, which are the whole point of the model: adding exercises to a demanded module later leaves the certificate unchanged; reclassifying a demanded module later leaves it unchanged; a second award creates no duplicate.
- [ ] 4.4 **Positive control:** make the reader recompute from live data instead of the record, and confirm the two snapshot tests turn red. A snapshot test that passes against a live query is testing nothing.

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
