# Exploración — revalidacion-en-servidor

Measured 2026-08-28 against the real code and the compiled client bundle.

## The hole

`POST /api/progress` takes the score from the request body and believes it:

```ts
const { exerciseId, exerciseType, score, userAnswer } = body;
const isCompleted = score >= 70;
```

Grepped across `src/app/api/`: there is **no** call to `compararReglas`,
`validarHtml` or any grader. The only `score >= 70` in the whole API is that
line. Grading lives entirely in `ExerciseRenderer.tsx`, on the client.

The route does authenticate — `getSession()` returns 401 without a session — and
it does read `xpReward` from `ALL_MODULES` rather than trusting the body for XP.
So a student cannot invent XP amounts. **They can invent the score.**

One `fetch` from the console of a logged-in student marks any exercise complete.

## Why it stopped being only a gamification bug

Until 2026-08-27 the blast radius was XP and a belt. Then
`certificados-por-ruta` shipped, and certificate eligibility is defined over
`Progress.completed === true`.

**A student can now award themselves the entire certificate from the browser
console.** It is a credential the instructor signs.

## What can be re-graded on the server, measured

789 exercises across the six tracks.

| validation | count | server-side? |
|---|---|---|
| `exact` | 674 | yes — string comparison |
| `css-rules` | 77 | **yes** — `cssRules.ts` has zero DOM references, it is pure TS |
| `html-structure` | 24 | needs a DOM; `jsdom` is already in the repo, as a **devDependency** |
| `includes-ordered` | 6 | yes |
| `regex` | 4 | yes |
| `js-behavior` | 4 | **no** — runs in a Web Worker in the browser |

**761 of 789 (96.5 %) re-grade with zero new dependencies.** `htmlStructure.ts`
already fails safe without a DOM: `if (typeof DOMParser === "undefined") return
null`.

### The four that cannot

`js-behavior` runs the student's JavaScript in a Worker and observes what it
does. There is no server equivalent without adding a sandboxed runtime.

They live in `js-07-funciones`, `js-08-arrays`, `js-09-metodos-arrays`. The `js`
track declares no `nivel`, so it **does not certify** and cannot. Those four
exercises therefore have no effect on any certificate today, which is what makes
it safe to decide their policy separately rather than blocking on it.

## What the client already gives away

The exercise page is `"use client"` and imports `ALL_MODULES`. Measured in the
built bundle, `.next/static/chunks/04xlc4ayw5o2e.js`:

- 154 `isCorrect` — which quiz option is right
- 80 `targetCSS` — the expected CSS of each graded exercise
- the `referenceSolution` values that already exist

**Every answer in the course is already in the browser.** This change does not
close that, and should not pretend to: a determined student can always read the
expected answer. What it closes is different and more important — **submitting a
completion you did not earn.** Reading the answer still requires pasting it and
being graded on it.

## What already exists and helps

- `userAnswer` is **already sent** in the request body and already persisted on
  `Progress`. The server has what it needs to re-grade without any client change.
- `xpReward` is already read server-side from `ALL_MODULES`, not from the body.
  The same pattern extends to the score.
- `compararReglas(esperado, enviado)` returns `{correct, score, faltantes}` and
  is pure.
- `Progress` already keeps the best score and never un-completes.

## Open questions for the proposal

1. What happens to the 4 `js-behavior` exercises — trust the client, refuse, or
   add a server sandbox?
2. `html-structure` (24): promote `jsdom` to a dependency, or treat those the
   same as `js-behavior` for now?
3. Existing `Progress` documents were written under the old rule. Are they
   re-verified, left alone, or flagged?
4. Does a mismatch between the client score and the server score get logged, so
   the instructor can see whether anyone was actually doing this?
