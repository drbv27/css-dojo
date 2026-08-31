# Design — css-track-expansion-2

## D1. The renumbering is its own slice, and it goes FIRST

Twenty-six existing module files get a one-line `order` edit. That is a large,
boring diff, and if it travels with the four new modules it **buries the only
part a reviewer can actually judge**.

So the order is: renumber first, into the gaps the new modules will occupy, then
add the modules.

**But renumbering first means the sequence is temporarily invalid** -- gaps at 7,
10, 17 and 23 with nothing in them -- and `orden-curriculum-css.test.ts` demands
1..N contiguous. A slice that leaves the suite red is not a slice.

**The resolution:** the renumbering slice moves the 26 existing modules to their
FINAL numbers *and* adds the four new modules as **skeletons** -- correct `slug`,
`title`, `order`, `nivel`, `category`, `icon`, and one lesson and one exercise
each so the module is producible and passes every guard. The content slices then
fill them.

This keeps every slice green, keeps the boring diff separate from the interesting
one, and means the track is never in a state the guards reject.

The alternative -- one giant slice -- was rejected: 2 000 lines of curriculum plus
26 renumbers in one review is not reviewable, and the budget is 800.

## D2. The invariant guard is written BEFORE the modules that need it

Requirement 10 turns "every required module carries a challenge" from a hardcoded
registry into a property over `nivel`.

**It is written in the first slice, not the last.** Written first, it goes red the
moment a skeleton lands as `obligatorio` without a challenge, and it stays red
until the content slices pay it off. That is the guard doing its job: it makes the
debt visible in CI instead of trusting four future slices to remember.

Written last, it would be a guard authored against a state already made correct
by hand -- which proves nothing about whether it would have caught the mistake.

**Consequence, stated because it is uncomfortable:** the suite is red between the
first slice and the last. This change therefore ships as **one PR with chained
commits**, not as chained PRs -- an intermediate PR that merges red is worse than
a big one that merges green.

Alternative considered and rejected: land the skeletons as `profundizacion` and
flip them to `obligatorio` at the end. It keeps CI green throughout, but it puts a
**wrong** `nivel` in `main` for the life of the change, and `nivel` is what the
certificate gate reads. A temporarily red guard is honest; a temporarily wrong
classification is a lie the gate believes.

## D3. Skeletons are producible, not placeholders

A skeleton carries one real lesson and one real exercise -- not `TODO`. The
existing guards do not accept placeholders: `validacion-curriculum` demands real
content, `calificador-curriculum` demands that every exercise's own correct
answer scores 100, and `acentuacion` demands correct Spanish.

That is a feature. It means a skeleton that lands is already a module a student
could open, just a short one, and every later slice only adds.

## D4. Position of each insertion, and why

| Module | Goes | Because |
|---|---|---|
| `overflow` | `css-caja`, 7, after `dimensiones` | `dimensiones` is where `width`/`height` and the overflowing box are introduced. Overflow is the answer to the problem that module raises, so it belongs immediately after it -- before `math-functions`, which is optional |
| `tipografia-web` | `css-texto`, 10, after `tipografias` | `tipografias` teaches `font-family` against fonts the machine already has. Web typography is the next question the student asks, and it needs the first one |
| `herencia-valores-globales` | `css-selectores`, 17, after `especificidad` | The plan's own words: it is the sibling of specificity. Both answer "how does the browser decide". Putting it before specificity would explain `unset` to someone who does not yet know why one rule beats another |
| `imagenes-y-medios` | `css-visual`, 23, first in section | It is the only required module of a section that is otherwise all optional, and it needs the box model (already at 4-8), nothing else. First in section puts the required one where a student reaches it before the optional four |

## D5. `icon` — CORRECTED DURING APPLY: nothing renders it

**What this section said, and why it was wrong.** It said a bad `icon` name would
fail the same silent way the nav icons did, and that the module card's resolution
would be verified in the browser.

Measured at apply time: **`ModuleData.icon` is read by nothing.** The only
reference in the whole codebase is `src/app/api/modules/route.ts`, which echoes it
in the payload. The module cards use a **track-level** icon (`SiCss` and friends
from react-icons), never a per-module one. There is no `ICON_MAP` for modules and
no card to look at.

So the risk this section described does not exist, and the verification it
promised is impossible — there is nothing on screen to check.

**What still holds:** the four names are real lucide exports
(`ArrowDownUp`, `TypeOutline`, `Network`, `Image`, all confirmed present), because
the field is declared as an icon name and the day something starts rendering it,
a made-up string becomes the bug this section imagined. Consistency now is
cheaper than an audit later.

**And the honest note:** this is a dead field carried by all 105 modules. Whether
it should be used or removed is a question this change does not answer and does
not touch.

## D6. Challenges follow the shape the archived change already settled

Nothing is redesigned. Each challenge is one exercise with `retoPasos`, graded
100-or-0, `css-rules` or `html-structure`, its reference solution scoring 100
under the real grader, and every step that introduces a selector naming it -- all
already required by `openspec/specs/mini-retos` and enforced by
`retos-curriculum.test.ts`.

XP is the module's highest exercise doubled, the rule the previous batch used.

## D7. Delivery: the four ship blocked for every cohort

`ModuleSettings` with no document for a slug means blocked. The four are
unreachable until the instructor enables them in `/teacher/modulos`.

**And every cohort will see four new locked cards the day this deploys** --
`modulos/page.tsx` renders a blocked module as a greyed, non-clickable card. That
is product-visible and it is the instructor's to decide, exactly as Requirement 8
of `css-track-content` was amended to say after the Fase 1 batch got it wrong.

## D8. What this change deliberately does NOT do

- **It does not touch the belt thresholds.** Adding ~36 exercises cheapens
  `RANKS` again -- Gran Maestro is already down to 69.2 % of the curriculum from
  74.6 %. That is real and it is a separate change. Absorbing it here would hide
  a platform-wide decision inside a content batch.
- **It does not enable anything for any cohort.**
- **It does not create `css-oficio`.** Empty sections are the vacuity the rest of
  this system refuses.


## D9. ADDED DURING APPLY — five hardcoded counts also broke, and D1 did not predict it

D1 said slice 1 would leave the suite green except for the invariant. **Measured,
it left eight tests red.** One was the invariant, as designed. Two were real
defects in the new content. **Five were guards that count.**

| Guard | What it pinned |
|---|---|
| `nivel-curriculum` | `toHaveLength(30)`, the 19-slug required list, and the partition of the two lists |
| `calificador-curriculum` | `toBe(808)` exercises |
| `certificados` | `toHaveLength(19)` required modules for CSS |

None of them is wrong to pin a number -- pinning is what makes them catch an
accidental change. What was wrong was **the design's estimate**: a change that
adds modules touches every guard that counts modules or exercises, and there were
five, not zero. They are redlined to 34 / 816 / 23.

**The lesson, and it is the third time this shape appears in this project:** a
literal in a guard is a maintenance obligation that only surfaces when it breaks.
`mini-retos` had "19" in a spec sentence; `orden-curriculum-css` has the full
sequence; these five have counts. The ones that name what they expect are fine --
they fail loudly and are one edit. The dangerous variant is the one that counts
*a set it does not enumerate*, because it fails without telling you which member
moved.

## D10. ADDED DURING APPLY — a skeleton with only a quiz makes the track worse

D3 said a skeleton carries "one real lesson and one real exercise". Measured, a
quiz is not enough: `tipos-ejercicio.test.ts` keeps a **ratchet** on how many
modules have nothing to write in them (`<= 60`, with an explicit "never raise
this"), and four quiz-only modules pushed it over.

The right answer was never to raise the ratchet. Each skeleton gained a
`live-editor` exercise, so every one of the four ships with something the student
actually writes.

**A guard that says "never raise this number" is a design constraint, and the
design should have read it before promising a shape that violates it.**
