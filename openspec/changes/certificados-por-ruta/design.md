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

So the `Certificate` document stores **what it certified**:

- the track,
- the cohort,
- the list of required module slugs that were enabled for that cohort at award
  time,
- the exercise count per module at award time,
- the award date.

Recomputation is for *eligibility*, never for *validity*. An awarded certificate
is read from its own record.

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
2. Let `R` = the modules of `T` with `nivel: "obligatorio"` **that are enabled for
   that student's cohort**.
3. `R` is not empty.
4. For every module in `R`, the student has a `Progress` document with
   `completed: true` for **every** exercise of that module.

Note what is deliberately absent: no percentage threshold, no score minimum
beyond what `completed` already encodes. `completed` is set when `score >= 70`,
which is the existing bar and is not re-litigated here.

### Why "enabled for that cohort" and not "all required modules"

Measured: 0 of 35 students have progress in all 19 required CSS modules; the best
nine reach 17 of 19. The two they miss are `tailwind-css` (29) and
`proyecto-cv-css` (30) — one because their course ended first, the other because
it had no `ModuleSettings` document and was invisible.

A student cannot complete what was never shown. Tying eligibility to the cohort's
enabled set is not leniency: it is the only definition that is *true*.

## What this inherits from the visibility model, and the trap in it

After the cohort migration a module is visible **only if a `ModuleSettings`
document with `enabled: true` exists** for that cohort; the default is blocked
(`src/app/api/modules/enabled/route.ts`, extracted to
`src/lib/moduleVisibility.ts`).

That has a consequence this design must state out loud:

> **Enabling a required module for a cohort changes that cohort's certificate
> requirements.** Opening a new required module mid-course means students who
> were at 100 % are no longer at 100 %.

That is correct behaviour — the requirements genuinely grew — but it must be
visible to the instructor rather than discovered by a confused student. Hence the
`tasks.md` item for surfacing eligibility, and the snapshot for anything already
awarded.

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
