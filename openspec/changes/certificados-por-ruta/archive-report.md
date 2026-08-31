# Archive report: certificados-por-ruta

Archived **2026-08-31**, in place. The folder does not move: relocating it breaks
the bounded review, because the diff does not detect the rename.

## Why it archives now

Phase 5 landed whole. It was the only thing holding the change open, and the
`state.yaml` said so explicitly rather than leaving it implied.

| Phase | Shipped |
|---|---|
| 1-4 — model, gate, eligibility, frozen snapshot | 2026-08-27, PR #36 |
| **5.2 — the teacher's roster** | 2026-08-29, PR #48 |
| **5.1 — the award endpoint** | 2026-08-29, PR #49 |
| **5.3 — the student's own view** | 2026-08-31, this change |

What remains in `orden_de_lo_que_viene` is *issuing the first certificate*, which
is an action of the instructor's, not code.

## Spec promoted, with three requirements added

`specs/certificados/spec.md` -> `openspec/specs/certificados/spec.md`, as a new
capability `certificados`. **Eight requirements, not the five it carried.**

The five originals cover the `nivel` field, the classification gate, eligibility
over every required module, the frozen snapshot, and the rule that the cohort
calendar does not shrink the requirement. **None of them said who may award, nor
how a certificate is read afterwards** — and those are the three surfaces phase 5
built, months after the spec was written.

Publishing the five as they stood would have left the spec of a credential
**silent about the most sensitive thing it has**: that only a teacher can issue
one. The three added are:

- **A Certificate Is Awarded by an Instructor Action** — teacher-only; the caller
  says WHO, never WHETHER; a hidden button is a convenience, not a check.
- **A Teacher Can See Who Is Eligible and Who Is Close** — teacher-only, and it
  must compute with the same rule the award uses, not a second copy.
- **A Student Reads Their Own Certificate, and It Never Recomputes** — scoped to
  the session, no parameter can name another person, and it consults awarded
  records only.

Added to the delta first, then promoted, so the two files say the same thing.
This is the same trap the project already paid for twice: a correction or a late
decision does not travel back to the spec on its own, and archive promotes
whatever text is there.

## Measured at archive time

| | |
|---|---|
| Tracks that certify | **1 of 6** (`css`) — the other five have unclassified modules, which is the designed state |
| CSS required path | 19 modules, 187 exercises |
| Test suite | **373 passing, 39 files** |
| Positive controls in phase 5.3 | 9, all red |

## The archive gate

It warns when a change touches auth, MongoDB models or XP logic. This one touches
auth (two role-guarded endpoints), a model (`Certificate`) and what
`Progress.completed` is used for. **Reviewed rather than waived**: the guards are
the role checks on both teacher endpoints, the session-scoped read with no
parameter, and the snapshot requirement that keeps an issued certificate immune
to a growing curriculum.

## A pre-existing defect this phase uncovered

Adding the nav entry revealed that the icon map **fails silently**: all three
layout components render `{Icon && <Icon />}`, so an icon missing from the map
leaves the link iconless and breaks nothing.

Measured: `Sidebar` was missing `Gamepad2` and `Settings`; `MobileNav` was
missing `Settings`. Three links had been rendering without icons since they
existed, unnoticed, precisely because nothing failed. All three fixed, and
`src/components/layout/nav-iconos.test.ts` now cross-checks every icon named by
`NAV_ITEMS` and `TEACHER_NAV_ITEMS` against all three maps. **The guard found the
third gap by itself, on its first run.**

Same shape as the undeclared color class caught by `globals-tokens.test.ts`: a
name pointing at nothing, and an interface that swallows the absence.

## Left open on purpose

- **The first certificate is Diego's to issue.** In production, with 8 of the 19
  required CSS modules still closed for cohort 2, nobody is eligible yet — which
  is what the roster exists to show.
- **Cohort 1 stays out of scope.** The snapshot design is what will let it be
  reconciled honestly later.
- **Revocation is not modelled.** A certificate awarded is awarded; the award
  dialog says so before confirming.
- **`Progress.xpEarned` stores `maxXP` even on failed attempts** and has no test.
  Pre-existing, noted across three archive reports now.
