# Proposal — certificados-por-ruta

Created: 2026-08-25

## What this is

A **certificate of completion, issued per track** (`css`, `html`, `js`, `react`,
`nextjs`), earned by completing **100 % of the exercises of that track's required
modules, as enabled for the student's cohort**.

Certificates are not issued until the whole thing is ready. But it is the
destination, and everything from here is planned toward it — which is precisely
why it needs a spec now rather than later.

## Why a certificate changes the stakes

A label on a module is an internal convenience. **A certificate is a durable
public claim.** Once a student holds one, the meaning of "completed the CSS
track" cannot be revised retroactively without making an already-issued document
false.

That single property drives every decision below.

## The measured problem

Production was queried read-only on 2026-08-25.

**Nobody would earn a certificate under a naive rule.** With "100 % of the
exercises of the 19 required CSS modules", measured across all 35 students:

```
students with progress in all 19 required modules:   0 of 35
the best nine:                                       134 exercises, 17 of 19 modules
```

The two missing modules are `tailwind-css` (29) and `proyecto-cv-css` (30). That
is not lack of effort: cohort 1 stopped between 2026-07-03 and 2026-07-12 because
the course ended, and `proyecto-cv-css` had **no `ModuleSettings` document at
all**, so it was invisible to them until it was enabled on 2026-08-25.

A rule that certifies nobody — including the nine students who did everything put
in front of them — is not a strict rule. It is a broken one.

## The rule, decided

**100 % of the exercises of the required modules ENABLED FOR THAT STUDENT'S
COHORT.**

This is the only reading that survives the measurement, and it is honest about
how the course actually runs: the instructor opens modules per cohort as the
class advances, and a student cannot complete what was never shown to them. The
certificate says "this person did everything their cohort was taught", which is
true and defensible.

## Scope decisions from the instructor

- **Cohort 1 is out of scope.** It was an experiment, its students have largely
  stopped logging in, and it can be reconciled later. **Cohort 2 is the standard
  from here on**, and it is the cohort this change is designed for.
- **Certificates are per track, not per course.** Five tracks, five certificates.
- **Nothing is issued** until the full flow exists.

## The consequence nobody had priced in

Per-track certificates mean the required/optional classification is needed in
**all five tracks**, not only CSS. Measured: **101 modules** — `css` 30, `js` 29,
`react` 20, `html` 17, `nextjs` 5 — and only CSS has a classification decided.

The answer is not to hurry the other four. It is to make the absence a **safety
gate**:

> A track is **certifiable only when every one of its modules declares a
> `nivel`.** An unclassified track cannot issue certificates, and says so.

That turns "we haven't decided yet" from a silent default into a refusal, which
is the correct behaviour for a credential. CSS certifies first because it is the
only track with the decision made; the other four unlock as they are classified.

## Known dependency: the mini-challenges

The `plan-mejoras-css.md` challenge pattern (lesson → challenge → lesson →
challenge) will **add exercises to required modules**. A student at 100 % today
drops below 100 % the day those land.

This is handled by the versioning requirement in `design.md`, not by delaying:
the certificate records what it certified. But the sequencing matters and is
stated in `tasks.md`.

## Explicitly out of scope

- Reconciling cohort 1 retroactively.
- Classifying the four non-CSS tracks (this change only makes the gate that
  requires it).
- Public verification pages, PDF rendering, or LinkedIn integration. The first
  version records the award; presentation comes after.
