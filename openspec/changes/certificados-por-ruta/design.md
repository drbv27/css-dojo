# Design — certificados-por-ruta

## The one decision everything hangs on: a certificate is a SNAPSHOT

A certificate must never be recomputed from live data after it is awarded.

The reason is concrete, already scheduled, and **it already happened once**: on
2026-08-25, commit `6822485` added two exercises to `unidades-css` (order 5) to
teach `dvh`/`svh`/`lvh` instead of merely naming them. `unidades-css` is a
required module, so the required CSS path went from 166 exercises to **168** in a
single ordinary content commit — before a single certificate existed. The
mini-challenge pattern will do the same thing on purpose and repeatedly.

If eligibility were a live query, the morning such a commit lands every issued
certificate silently becomes a claim its holder no longer satisfies. Nobody would
notice until a student asks why their certificate disappeared.

### It already happened to a named student, and this is the measurement

Measured against production on 2026-08-25, read-only. The strongest student of
cohort 2 (245 completed exercises, more than anyone else in it) had
`unidades-css` at **8 of 8**. Commit `6822485` took the module to 10. He now
reads **8 of 10**, and the two exercises he lacks are `10-ej-09` and `10-ej-10` —
precisely the two that commit added.

He did nothing, and a module he had finished stopped being finished.

**Correction to an earlier version of this paragraph.** It claimed he "was
eligible for the certificate the day before yesterday and stopped being eligible
yesterday". That was true only under the cohort-scoped rule, which has since been
removed as wrong. Under the corrected rule he was never eligible — eight required
modules have not been taught to him yet. The claim overstated the case and is
retracted.

What survives, and is the actual point: **the required path of CSS moved from 166
exercises to 168 in an ordinary content commit.** Every student not yet awarded
had their bar raised, correctly and invisibly. The mini-challenge rollout will do
this on purpose and repeatedly. Had a certificate already been issued against 166,
a live-recomputing reader would have turned it false that morning. That is the
snapshot's whole job, and it is now an observed hazard rather than an argument.

## Where the classification lives

`nivel` goes on **`ModuleData`** (`src/types/index.ts`), as already decided:
the level is curriculum data, identical for every cohort. `ModuleSettings` is not
touched and stays binary `{cohort, slug, enabled}`.

```ts
nivel?: "obligatorio" | "profundizacion";
```

**Optional in the type, and the absence means "not classified" — never
"required".** A silent default would let an unclassified Next.js module become
part of a credential's minimum path without anyone deciding it.

The gate makes the absence safe:

> A track is certifiable only when **every** module of that track declares
> `nivel`. Otherwise the track reports itself as not certifiable, and gives the
> count of modules still missing a classification.

Measured 2026-08-25, and this corrects an earlier count in this document: the
repo has **six** tracks and **106** modules. `css` 30 (classified), `js` 29,
`react` 20, `html` 17, `react-eco` 5, `nextjs` 5 — **76 modules unclassified**.
Under this design that is not a bug to rush; it is **five** tracks that correctly
refuse to certify.

`react-eco` ("Ecosistema React") was missing from the first enumeration here and
is a live track in `DojoSwitcher` with `estado: "disponible"`. The gate handles it
with no change — an unclassified track refuses to certify — which is the point of
writing the rule over *every module of the track* rather than over a hardcoded
list of tracks.

## Eligibility, stated precisely

A student is eligible for the certificate of track `T` when:

1. `T` is certifiable — every module of `T` declares `nivel`.
2. Let `R` = **every** module of `T` with `nivel: "obligatorio"`. Not
   intersected with the cohort's enabled set — see the next section for why that
   intersection was there and why it is gone.
3. `R` is not empty.
4. For every module in `R`, the student has a `Progress` document with
   `completed: true` for **every** exercise of that module.

Note what is deliberately absent: no percentage threshold, no score minimum
beyond what `completed` already encodes. `completed` is set when `score >= 70`,
which is the existing bar and is not re-litigated here.

### The rule was scoped to the cohort at first, and that was wrong

The original design intersected the required set with what the student's cohort
had enabled, justified by a measurement: "0 of 35 students have progress in all
19 required CSS modules; the best nine reach 17 of 19, missing only
`tailwind-css` and `proyecto-cv-css`".

**The measurement was correct and the population was wrong.** No cohort-2 student
can reach 17 of 19 — eight of the nineteen have never been enabled for them, and
all fourteen sit at zero in all eight (measured 2026-08-25). Those nine are
cohort 1: a cohort whose course **ended** with two required modules never opened,
and which the instructor has declared out of scope.

So the scoped rule solved a problem belonging to a cohort nobody is certifying,
and bought a far worse one for the cohort that matters: **it certified people
mid-course.** Under it, the strongest student of cohort 2 qualified for a CSS
completion certificate having completed 11 of the 19 required modules and never
having seen `flexbox`, `css-grid` or `media-queries`. That is not a certificate;
it is a progress report with a seal on it.

"A student cannot complete what was never shown them" is true. Its honest
consequence is that **they have not finished yet** — not that the requirement
shrinks to whatever is open this week. Cohort 1 ending without two modules means
cohort 1 does not certify, and that is the correct answer for a cohort that did
not finish the course.

**The corrected rule:** every `"obligatorio"` module of the track, full stop.

The enabled set is still read, but only to report **why** a module is missing:
`aunNoHabilitados` separates "this student is behind" from "the course has not
got there". The instructor needs that distinction; the certificate must not.

## What this inherits from the visibility model

After the cohort migration a module is visible **only if a `ModuleSettings`
document with `enabled: true` exists** for that cohort; the default is blocked
(`src/app/api/modules/enabled/route.ts`, extracted to
`src/lib/moduleVisibility.ts`).

Certificates read that rule through `slugsHabilitadosParaCohorte(cohort)`,
extracted from `slugsVisiblesPara` so there is one copy and not two. But they
read it **for reporting only**.

This document used to say the opposite, and it is worth keeping the corrected
claim visible:

> ~~Enabling a required module for a cohort changes that cohort's certificate
> requirements. Opening a new required module mid-course means students who were
> at 100 % are no longer at 100 %. That is correct behaviour.~~

It is not correct behaviour; it is the symptom of the wrong rule. A student's
requirements should not move because of a teacher's calendar. Under the
corrected rule, opening a module changes nobody's verdict — it only changes the
reason shown for a gap that was already there.

What genuinely does change the requirements is the **curriculum**: adding a
required module, reclassifying one into `"obligatorio"`, or adding exercises to
an existing required module. Those are decisions about what the course *is*, and
they should move the bar for anyone not yet awarded. The snapshot is what
protects everyone already awarded.

## Data model

New collection, following the shape of `Progress` and `ModuleSettings`:

```ts
interface ICertificate {
  userId: Types.ObjectId;
  dojo: DojoType;           // la ruta certificada
  cohort: number;           // la cohorte al momento del otorgamiento
  modulos: string[];        // los slugs obligatorios EXIGIDOS, congelados
  ejerciciosPorModulo: Record<string, number>;  // el conteo, congelado
  otorgadoEn: Date;
  codigo: string;           // identificador estable para verificar
}
```

Unique index on `{userId, dojo}`: one certificate per student per track.

**Corrected during implementation.** This paragraph used to say a second award
"is an update of the record, never a duplicate". The second half is right and the
first half contradicts the snapshot rule three sections above: an update is
exactly how a frozen document silently changes. If a student re-triggers an award
after `unidades-css` grew from 8 exercises to 10, an update rewrites their
certificate from the path they walked to the one that exists now.

So a second award **returns the existing record untouched**, with `nuevo: false`.
The spec scenario ("no duplicate document MUST be created") is satisfied by both
readings; only this one also satisfies "reclassifying a module later leaves the
certificate unchanged".

`codigo` exists from version one even though public verification is out of scope,
because retrofitting a stable identifier onto documents already handed out is
exactly the kind of migration this change is written to avoid.

## What is NOT decided here

- **Issuance trigger.** Automatic on reaching 100 %, or an instructor action.
  This design supports both and does not choose; it is a product decision and it
  is listed in `tasks.md` as blocking the award endpoint, not the model.
- **Revocation.** Not modelled. A certificate awarded is awarded.
- **Cohort 1.** Out of scope by instructor decision. When it is reconciled, the
  snapshot design is what makes it possible to award them honestly for what they
  actually completed.
