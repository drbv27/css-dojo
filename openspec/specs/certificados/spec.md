# Spec: certificados

Capability: `certificados`

Governs the **certificate of completion per track**: what a track must satisfy to
be certifiable at all, what a student must have completed to be eligible, who may
issue one, what the issued record freezes, and how it is read afterwards.

**Track-agnostic by construction.** The rules below are written over "every module
of the track", never over a fixed list of tracks, so a track becomes certifiable
the day its modules are classified and not before.

Established by change `certificados-por-ruta`, archived 2026-08-31. Phases 1-4
shipped in PR #36 (the model, the gate, eligibility and the frozen snapshot);
phase 5 shipped in PRs #48, #49 and #50 (the teacher's roster, the award endpoint
and the student's own view).

Where a requirement cites a count it is the count measured at archive time: of
the six tracks, **only `css` is fully classified and therefore only `css`
certifies**; its required path is 19 modules and 187 exercises. Those numbers are
historical. The constraints are not.

## Requirements

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

### Requirement: Eligibility Requires Every Required Module of the Track

A student MUST be eligible for the certificate of a track when, and only when:
the track is certifiable; the set of that track's `"obligatorio"` modules is not
empty; and the student has a `Progress` document with `completed: true` for
**every exercise** of **every** module in that set.

Eligibility MUST NOT be reduced to the modules currently enabled for the
student's cohort. A required module that a cohort has not been given yet MUST
still be demanded of them: they have not finished the course, they have not
reached the end of it.

The enabled set MUST still be reported, so that a missing module can be
attributed to the calendar rather than to the student. That report MUST be
informational only and MUST NOT change the verdict.

#### Scenario: A required module not yet enabled is still demanded

- GIVEN a student who has completed every exercise of every required module their cohort has been given
- AND at least one required module of the track has not been enabled for that cohort
- WHEN eligibility is evaluated
- THEN the student MUST NOT be eligible
- AND the un-enabled module MUST be reported as not yet available, distinct from a module the student simply has not finished

#### Scenario: One missing exercise blocks the certificate

- GIVEN a student who has completed every exercise of every required module except one
- WHEN eligibility is evaluated
- THEN the student MUST NOT be eligible

#### Scenario: A track with no required module is not eligible

- GIVEN a certifiable track whose every module is `"profundizacion"`
- WHEN eligibility is evaluated
- THEN the student MUST NOT be eligible, rather than trivially eligible over an empty set

#### Scenario: Optional modules are never demanded

- GIVEN a student who completed every required module and no optional one
- WHEN eligibility is evaluated
- THEN the student MUST be eligible

#### Scenario: Enabling a module changes nothing about the verdict

- GIVEN a student with an incomplete required module
- WHEN that module is enabled for their cohort
- THEN their eligibility MUST be unchanged
- AND only the reason reported for the gap MUST change

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

### Requirement: A Certificate Is Awarded by an Instructor Action

A certificate MUST be issued only by an explicit action of a teacher. It MUST NOT
be issued automatically by reaching 100 %, and the endpoint that issues it MUST
refuse any caller who is not a teacher.

**The caller says WHO, never WHETHER.** A request naming a student who is not
eligible MUST be refused by the eligibility check itself, not by the handler and
not by a button being hidden. A user interface that hides the control is a
convenience, never a check: a request made outside that interface does not see it.

The refusal MUST carry the reason, so the surface that asked can say what is
missing rather than that it failed.

**What this choice costs, stated rather than implied**: with automatic issuance a
student is protected by the snapshot the instant they qualify. Under an
instructor action they are protected only once someone acts, and in between a
growing required module can pull them back below 100 % with nobody watching. That
is why the teacher's view is a requirement below and not a nicety.

#### Scenario: A student cannot award themselves

- GIVEN an authenticated student, eligible or not
- WHEN they call the award endpoint
- THEN it MUST be refused
- AND no certificate MUST be created

#### Scenario: An ineligible student is refused with the reason

- GIVEN a teacher awarding to a student who is not eligible
- WHEN the endpoint handles it
- THEN it MUST refuse
- AND the response MUST carry why the student is not eligible

### Requirement: A Teacher Can See Who Is Eligible and Who Is Close

A teacher MUST be able to see, per track, which students may be awarded and how
far the others are, and that view MUST be restricted to teachers.

It MUST report the eligible, those already awarded, and, for the rest, how many
exercises are missing. Of the missing modules it MUST distinguish those the
student's cohort **has not been given yet** from those they simply have not done:
the first is a conversation with the calendar and the second with the student.

The roster MUST compute eligibility with **the same rule** the award uses, not a
second implementation of it. A rule that drifted would show a roster disagreeing
with what the award will do, and it would surface as an award that refuses for no
visible reason.

#### Scenario: A student cannot read the roster

- GIVEN an authenticated student
- WHEN they request the roster
- THEN it MUST be refused

#### Scenario: The roster separates being behind from not having been taught

- GIVEN two students missing the same required module
- AND that module is enabled for one cohort and not for the other
- WHEN the roster is built
- THEN it MUST report the module as not-yet-enabled only for the second

### Requirement: A Student Reads Their Own Certificate, and It Never Recomputes

A student MUST be able to read the certificates they hold. The read MUST be
scoped to the caller's own session and MUST NOT accept a parameter naming
another person: a certificate carries one person's frozen path, and a read that
can name anyone turns a personal record into a directory.

The read MUST consult the awarded records and nothing else -- not the curriculum,
not the student's progress, not the eligibility check. Re-deriving a certificate
from today's curriculum would silently rewrite what the student was told they
earned.

A student holding none MUST receive an empty result, not an error: it is the
normal state of almost everyone.

#### Scenario: The read is scoped to the session

- GIVEN an authenticated student
- WHEN they read their certificates
- THEN only certificates issued to that student MUST be returned

#### Scenario: A grown curriculum does not change what is shown

- GIVEN a student holding a certificate
- AND a required module of that track has gained exercises since it was awarded
- WHEN the student reads it
- THEN it MUST still report the module list and counts frozen at award time

### Requirement: The Curriculum Defines the Requirements, Not the Cohort Calendar

Adding a `"obligatorio"` module to a track, or reclassifying a module INTO
`"obligatorio"`, MUST change the certificate requirements of every student not
yet awarded. Adding exercises to an existing required module MUST do the same.

Enabling or disabling a module for a cohort MUST NOT change any student's
eligibility verdict.

An already-awarded certificate MUST be unaffected by any of these.

#### Scenario: A required module grows mid-course

- GIVEN a student who has completed every exercise of a required module
- WHEN exercises are added to that module
- THEN that student MUST NOT be eligible until the new exercises are completed
- AND an already-awarded certificate MUST be unaffected

#### Scenario: Opening a module mid-course does not move anyone's verdict

- GIVEN a student who is not eligible because a required module is unfinished
- WHEN a further required module of that track is enabled for their cohort
- THEN their verdict MUST be unchanged, because that module was already demanded
