# Tasks — css-track-expansion-2

**Review Workload Forecast**

| | |
|---|---|
| Slices | 6 |
| Estimated authored lines | ~2 400 (4 modules x ~500, plus challenges, guards and the renumber) |
| Delivery | **ONE PR with chained commits**, not chained PRs |
| Why | Slice 1 writes the invariant guard, which stays RED until slice 5. An intermediate PR that merges red is worse than one big PR that merges green. See design D2. |
| Risk | Medium. The plumbing is guarded; the content is not, and content is the real risk. |

---

## Slice 1 — Renumber, skeletons, and the invariant guard

The boring diff and the guard, separated from the content on purpose.

- [x] 1.1 Move the 26 existing CSS modules to their final `order`, per the sequence in the `css-track-sections` delta. Leave 7, 10, 17 and 23 free.
- [x] 1.2 Update the literal sequence in `orden-curriculum-css.test.ts` (`SECUENCIA`) to the 34-module list.
- [x] 1.3 Create the four modules as **producible skeletons**: real `slug`/`title`/`description`/`order`/`nivel: "obligatorio"`/`category`/`icon`, one real lesson and one real exercise each. No `TODO`, no placeholder — the guards reject them (design D3).
- [x] 1.4 Verify each `icon` is a name lucide actually exports. **Done, and it corrected the design**: measured that `ModuleData.icon` is read by nothing but `/api/modules` — the cards use a track-level icon, so there is no silent failure and nothing to verify on screen. The four names are real lucide exports anyway, for the day something does render them. See design D5, redlined.
- [x] 1.5 Register the four in `src/data/modules/index.ts`, in declaration order for readability, knowing the `.sort()` is what actually decides.
- [x] 1.6 **Write the Requirement 10 guard**: every `nivel: "obligatorio"` CSS module carries exactly one challenge, asserted over `nivel` and not over a slug list. Keep the existing roll-out ledger as a separate test.
- [x] 1.7 ~~Add the four slugs to the ledger with a `Tanda E` comment.~~ **Reversed while applying, and the task was wrong.** The ledger records *which modules carry a challenge*; listing the four before they have one makes it assert something false, and it turns the ledger red for the wrong reason — burying the invariant, which is the guard actually reclaiming them. A `Tanda E` comment now says each slug is added *when its challenge exists*, one per slice.
- [x] 1.8 **Positive control on 1.6**: mark a required module's challenge as ordinary and confirm the guard goes red naming it. Then a second control: mark an OPTIONAL module without a challenge and confirm it stays green.
- [x] 1.9 Expected state at the end of this slice: **exactly one red test — the Requirement 10 invariant, naming all four.** Reached: 375 passing, 1 failing. That red is the debt made visible; slices 2-5 pay it.
- [x] 1.10 **ADDED during apply — redline five guards that count.** Adding modules broke `nivel-curriculum` (30 -> 34, plus the four slugs in the required list), `calificador-curriculum` (808 -> 816) and `certificados` (19 -> 23). The design did not predict these; see D9.
- [x] 1.11 **ADDED during apply — give each skeleton a `live-editor`.** A quiz alone pushed `tipos-ejercicio`'s ratchet on "modules with nothing to write" past its cap, and that cap says never raise it. See D10.
- [x] 1.12 **ADDED during apply — fix a false positive in `acentuacion.test.ts`.** `\b` in JavaScript is ASCII, so there is a word boundary between a plain letter and an accented one: searching `funcion` matched *inside* `funcionó`, which is spelled correctly, and demanded an accent that was already there. Fixed with a lookahead. Two positive controls confirm it still catches real misspellings.

## Slice 2 — `overflow`

- [x] 2.1 Four lessons: the four values; `overflow-x`/`-y` independently; the internal scrolling panel; **the sticky trap as a debugging story** — a sticky that stopped working, and finding the ancestor that did it.
- [x] 2.2 Eight exercises, following the mix the Fase 1 modules use.
- [x] 2.3 Its integrating challenge, and remove it from the Requirement 10 red list.
- [x] 2.4 Positive control: broke the challenge's reference solution and `retos-curriculum` went red naming `overflow/31-ej-reto: score 0`.
- [x] 2.5 **ADDED** — redline the exercise count again (816 -> 823). Every content slice moves it; see D9.

## Slice 3 — `tipografia-web`

- [x] 3.1 Four lessons: stacks and why a fallback is not optional; Google Fonts `<link>` vs `@import` and the real difference; weights and **what each costs, in numbers**; `@font-face` and `font-display` with the flash of unstyled text.
- [x] 3.2 Eight exercises.
- [x] 3.3 Its integrating challenge.
- [x] 3.4 Positive control as in 2.4.

## Slice 4 — `herencia-valores-globales`

- [x] 4.1 Four lessons: what inherits and what does not; `inherit`/`initial`/`unset`/`revert`; `all: unset`; **why an `<a>` does not take its parent's colour**, answered as the question the student already has.
- [x] 4.2 The module states its connection to `especificidad` explicitly: the two halves of "how the browser decides".
- [x] 4.3 Eight exercises.
- [x] 4.4 Its integrating challenge.
- [x] 4.5 Positive control as in 2.4.

## Slice 5 — `imagenes-y-medios`

- [x] 5.1 Four lessons: `object-fit` and `object-position`; `aspect-ratio`; filters and `clip-path`; background image vs `<img>` and when each is right.
- [x] 5.2 **At least one exercise starts from a visibly deformed image** and fixes it with `object-fit`. That is the bug the module exists for, so it has to be seen, not described.
- [x] 5.3 Eight exercises total.
- [x] 5.4 Its integrating challenge.
- [x] 5.5 **The Requirement 10 guard must now be GREEN.** If it is not, a slice missed its challenge and this is where it surfaces.

## Slice 6 — Verify and close

- [x] 6.1 Measure the coverage of Requirement 7: every listed property appears in lesson content or `targetCSS` of its module. Report per module, not as a total.
- [x] 6.2 Measure the certificate's minimum path before and after, and confirm no previously required module's exercise count moved (Scenario 9.2).
- [x] 6.3 Full suite, typecheck, eslint, build.
- [x] 6.4 **Look at the four in the browser**: the module cards render with their icons, the lessons read, the challenges grade. The guards cover correctness, never whether a lesson teaches.
- [x] 6.5 Belt consequence, measured: the curriculum went from 15 890 to **16 780 XP**, so Gran Maestro's fixed 11 000 dropped from 69.2 % to **65.6 %** of what is available. Recorded as a follow-up, not absorbed here (design D8).
- [x] 6.7 **ADDED — two false positives fixed in existing guards, and two real defects they were hiding.** `acentuacion` matched `funcion` *inside* the correctly-spelled `funcionó`, because `\b` in JavaScript is ASCII and sees a boundary before an accented letter. `signos-interrogacion` did not count a `?` followed by `*`, so `**¿Pregunta?**` in markdown bold read as unopened. Fixing the second surfaced **two genuine pre-existing defects**: an unopened question in `media-queries` and `**Por que?**` in `react-05-estado-usestate`, which had been balancing by accident against a ternary in a code block.
- [x] 6.8 **ADDED — a class name in quotes collides with the accent guard.** `'titulo'` and `'boton-texto'` in a prompt make `acentuacion` demand `título`/`botón`, which would break the selector. Written as `.titulo` and `.boton-texto`, which the guard's mask already exempts. Same collision already recorded for the class materials.
- [x] 6.6 Archive: the three deltas promoted into the existing capabilities, `archive-report.md` written, record closed.

---

## What is NOT in this change

- Fase 3 of the plan, and the `css-oficio` section two of its modules need.
- Challenges for the 11 optional modules.
- Belt rescaling.
- Enabling any of the four for any cohort — the instructor's call.
