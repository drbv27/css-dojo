# Delta for certificados

## Purpose

Award and record a **certificate of completion per track** (`css`, `html`, `js`,
`react`, `nextjs`), earned by completing every exercise of that track's required
modules as enabled for the student's cohort. Every requirement below is `ADDED`.

**Track relevance**: this capability is **per track by construction** — the track
is the unit being certified.

## ADDED Requirements

### Requirement: Curriculum Level on Module Data

`ModuleData` MUST carry an optional `nivel` field with the values
`"obligatorio"` or `"profundizacion"`. The level is curriculum data and MUST be
identical for every cohort; `ModuleSettings` MUST remain binary
`{cohort, slug, enabled}` and MUST NOT gain a level.

The absence of `nivel` MUST mean **"not classified"** and MUST NOT be treated as
`"obligatorio"` by any consumer.

#### Scenario: An unclassified module is not silently required

- GIVEN a module with no `nivel` declared
- WHEN the required set of its track is computed
- THEN that module MUST NOT appear in it

#### Scenario: ModuleSettings keeps its shape

- GIVEN the certificate feature is implemented
- WHEN `ModuleSettings` documents are inspected
- THEN they MUST still contain only `cohort`, `slug` and `enabled`

### Requirement: A Track Certifies Only When Fully Classified

A track MUST be reported as **certifiable** only when **every** module of that
track declares a `nivel`. A track with any unclassified module MUST report itself
as not certifiable, and MUST expose how many of its modules still lack a level.

No certificate MUST be awarded for a track that is not certifiable.

#### Scenario: A partially classified track refuses to certify

- GIVEN a track where some modules declare `nivel` and at least one does not
- WHEN certifiability is evaluated
- THEN the track MUST report not certifiable, with the count of unclassified modules
- AND no certificate MUST be awarded for it, regardless of any student's progress

#### Scenario: A fully classified track certifies

- GIVEN a track where every module declares `nivel`
- WHEN certifiability is evaluated
- THEN the track MUST report certifiable

### Requirement: Eligibility Is Scoped to the Student's Cohort

A student MUST be eligible for the certificate of a track when, and only when:
the track is certifiable; the set of that track's `"obligatorio"` modules
**enabled for that student's cohort** is not empty; and the student has a
`Progress` document with `completed: true` for **every exercise** of **every**
module in that set.

Eligibility MUST NOT be computed against the track's required modules globally.

#### Scenario: A required module not enabled for the cohort is not demanded

- GIVEN a track with required modules, one of which has no `ModuleSettings` document enabled for the student's cohort
- WHEN eligibility is evaluated
- THEN that module MUST NOT be required of that student
- AND the student MUST be eligible if every other enabled required module is fully completed

#### Scenario: One missing exercise blocks the certificate

- GIVEN a student who has completed every exercise of every enabled required module except one
- WHEN eligibility is evaluated
- THEN the student MUST NOT be eligible

#### Scenario: A cohort with no required module enabled is not eligible

- GIVEN a student whose cohort has zero required modules enabled for the track
- WHEN eligibility is evaluated
- THEN the student MUST NOT be eligible, rather than trivially eligible over an empty set

#### Scenario: Optional modules are never demanded

- GIVEN a student who completed every enabled required module and no optional one
- WHEN eligibility is evaluated
- THEN the student MUST be eligible

### Requirement: An Awarded Certificate Is a Frozen Snapshot

An awarded certificate MUST record what it certified: the track, the cohort, the
list of required module slugs demanded at award time, the exercise count of each
of those modules at award time, the award date, and a stable code.

Validity of an awarded certificate MUST be read from its own record and MUST NOT
be recomputed from live curriculum or progress data.

#### Scenario: Adding exercises later does not invalidate an issued certificate

- GIVEN a student holding a certificate for a track
- WHEN new exercises are later added to a module that certificate demanded
- THEN the certificate MUST remain valid and MUST still report the module list and counts it was awarded against

#### Scenario: Reclassifying a module later does not invalidate an issued certificate

- GIVEN a student holding a certificate for a track
- WHEN a module of that track is later changed from `"obligatorio"` to `"profundizacion"`
- THEN the certificate MUST remain valid and unchanged

#### Scenario: One certificate per student per track

- GIVEN a student who already holds a certificate for a track
- WHEN an award is attempted again for the same track
- THEN no duplicate document MUST be created

### Requirement: Enabling a Required Module Changes the Requirements

Enabling a `"obligatorio"` module for a cohort MUST change the certificate
requirements of every student in that cohort who has not yet been awarded.

This MUST be observable to the instructor before it surprises a student: a
student who was eligible and is no longer eligible MUST be reported as such, not
silently dropped.

#### Scenario: Opening a new required module mid-course

- GIVEN a student eligible for a track's certificate and not yet awarded
- WHEN a further required module of that track is enabled for their cohort
- THEN the student MUST become not eligible until that module is fully completed
- AND an already-awarded certificate MUST be unaffected
