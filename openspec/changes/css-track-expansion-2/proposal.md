# Proposal — css-track-expansion-2

Created: 2026-08-31
Status: **proposed — awaiting spec**

## Intent

Ship the four content modules the CSS track still owes from
`plan-mejoras-css.md`: **web typography, overflow, inheritance and global
values, and images and media**. All four **required**, each with its integrating
challenge, and renumber the track from 30 to 34 modules.

## This is not `css-track-fase-2`

Two things are called "Fase 2" and the confusion already cost a badly framed
status report on 2026-08-31.

| | |
|---|---|
| `css-track-fase-2` | Validating the required/optional classification against real `ModuleView` data. **Blocked** on data until ~2026-09-15. |
| **This change** | The four content modules. Second batch of `css-track-expansion`, which shipped the five of Fase 1 and is archived. |

## The four, and why each is required

The criterion is the instructor's, closed 2026-08-24: a module is required if it
meets at least one of — the next track assumes it; without it a junior fails a
real task; it is a concept rather than a catalogue; it blocks another required
module. If it only adds surface you can look up in MDN when you need it, it is
optional.

| Module | Category | Criterion met |
|---|---|---|
| **Web typography** — font stacks, Google Fonts (link vs `@import`, picking weights, the performance cost), `@font-face`, `font-display` | `css-texto` | *Without it a junior fails a real task.* "Use this font" is an everyday assignment and today the track cannot answer it. The student does not know how to leave Arial. |
| **Overflow** — `visible`/`hidden`/`scroll`/`auto`, `overflow-x`/`-y`, internal scroll, **and the trap that an `overflow` on an ancestor kills a `position: sticky`** | `css-caja` | *It is a concept* — what happens when content does not fit — *and it blocks another required module*: the sticky trap belongs to `posicionamiento`, which is required. |
| **Inheritance and global values** — what inherits and what does not, `inherit`, `initial`, `unset`, `revert`, `all: unset`, why an `<a>` does not inherit its parent's colour | `css-selectores` | *A concept, not a property*, in the plan's own words. It is the sibling of `especificidad`: both answer "how does the browser decide". |
| **Images and media** — `object-fit`, `object-position`, `aspect-ratio`, image filters, `clip-path`, background image vs `<img>` | `css-visual` | *Without it a junior fails a real task.* The stretched or overflowing image is the beginner's number-one visual bug. |

**All four come out required, and that is the answer the criterion gives — not a
preference.** The instructor approved it on 2026-08-31.

## What it costs, measured

Measured against `d03bf1f`.

| | Today | After |
|---|---|---|
| CSS modules | 30 | **34** |
| Required modules | 19 | **23** |
| Certificate's minimum path | 187 exercises | **~223** (4 modules x 8 exercises + 4 challenges) |
| Modules carrying a challenge | 19 | **23** |

The five Fase 1 modules are the yardstick and they are strikingly uniform: **4
lessons and 8 exercises each, ~500 lines of TypeScript**. Four more is roughly
2 000 lines of curriculum, plus the challenges.

## Why now, and why the window matters

Every new required module **grows the certificate's minimum path and knocks
anyone who was near 100 % back below it**.

Today that costs nothing. With 8 of the 19 required CSS modules still closed for
cohort 2, **no cohort-2 student can be at 100 %** — that is an impossibility, not
an optimistic reading — and cohort 1 is out of scope by instructor decision.

Once those 8 open, the same change starts costing real students their standing.
**This is the widest the window will ever be.**

## The four constraints this change must respect

### 1. Every module of the track must declare `nivel`

The certificate gate demands it, and `css` is today **the only track that
certifies** precisely because it has none unclassified. A single new module
without `nivel` takes the whole track out of certification. The four are
classified in this change, not after it.

### 2. Every required module must carry exactly one challenge

`openspec/specs/mini-retos` states it, with the literal 19. Four new required
modules without a challenge would violate a requirement promoted two days ago.

**And nothing would catch it**: `retos-curriculum.test.ts` compares the set of
modules carrying a challenge against a hardcoded registry of slugs. It is a
roll-out ledger, not the invariant. A new required module simply would not
appear, and the guard would stay green.

This change writes the four challenges and **turns the ledger into the
invariant** so the hole closes for good.

### 3. `order` is contiguous, and categories are contiguous within it

`orden-curriculum-css.test.ts` demands `order` be exactly `1..N` with no gaps or
repeats, pins the teaching sequence in a hardcoded `SECUENCIA`, and asserts that
grouping by section reproduces that same sequence — which is only true while each
category's modules are contiguous.

So the four cannot be appended as 31-34: they go **inside** their categories, and
everything after each insertion shifts. **Renumbering most of the track is part
of this change, not a side effect of it.**

Renumbering is display-only and safe: `Progress` and `ModuleSettings` are keyed
by **slug**, never by `order`.

### 4. The curriculum is written with accents

Unlike the class materials, the dojo's prose is accented Spanish and
`acentuacion.test.ts` enforces it. The four modules are written accordingly.

## Risks

### The renumbering touches files this change does not otherwise care about

Roughly 26 existing module files get a one-line `order` edit. A wrong number is
caught by the guard, so the risk is not silent breakage — it is a large diff that
buries the four modules that actually matter. **The task breakdown must isolate
the renumbering into its own slice** so the content is reviewable on its own.

### A new required module is invisible until enabled per cohort

`ModuleSettings` gates visibility. The four ship disabled for every cohort and
the instructor opens them when the course gets there — the same as the Fase 1
five. That is deliberate, and it is why growing the requirement today costs
nobody anything.

### Content quality is the actual risk, not the plumbing

The plumbing is measured and guarded. What no guard checks is whether a lesson
teaches. The four follow the shape the Fase 1 modules already validated, and the
data guards (`calificador-curriculum`, `validacion-curriculum`,
`selectores-del-enunciado`, `acentuacion`) cover correctness — not pedagogy.

## Non-goals

- Fase 3 of the plan (responsive images/video, visual accessibility, DevTools).
  Two of those need a `css-oficio` category that does not exist yet.
- Challenges for the 11 optional modules. Decided they will happen, as their own
  change.
- Belt rescaling. Adding ~36 exercises cheapens the absolute thresholds again;
  that is its own change and this one must not quietly absorb it.
- Enabling the four for any cohort. That is the instructor's call.
