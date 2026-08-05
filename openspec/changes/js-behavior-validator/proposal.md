# Proposal: js-behavior-validator

Phase: `propose` · Store: hybrid · Depends on: `exploration.md`

## Recommendation up front

Grade JavaScript exercises by **running the submission and checking what it
does**, not by inspecting how it is written. Ship it as **three slices**, the
first of which is a pure library with no UI and no content changes.

## Intent

Give the `js`, `react`, `react-eco` and `nextjs` tracks exercises where the
student writes code from scratch and gets told whether it works. Today those
tracks can only ask the student to recognise or to fill a blank, because grading
has no way to check JavaScript.

## Approach: behavioral grading

A `js-behavior` exercise carries serializable cases:

```ts
validation: {
  type: "js-behavior",
  cases: [
    { call: "sumar(1, 2)", expect: 3 },
    { call: "sumar(-1, 1)", expect: 0 },
    { call: "sumar(0, 0)", expect: 0 },
  ],
}
```

The submission runs inside the existing `LivePreview` sandbox. A harness
evaluates each `call`, compares the result to `expect`, and posts a per-case
verdict back to the parent, which scores `passed / total`.

### Why this and not an AST

An AST validator grades the shape of the code. Behavioral grading grades whether
the code works, which is both the thing the student is being taught and the thing
that cannot be faked by writing something that merely looks right. It also needs
no new dependency: the sandbox exists and no parser has to reach the browser.

### Options rejected

| Option | Rejected because |
|---|---|
| AST matching with `acorn` | grades shape not correctness; new dependency for one consumer; approximates what it should verify — the PR #5 failure mode in a new form |
| `regex` / `includes` on the submission | exactly what PR #5 removed after 61 exercises proved passable as prose; a test forbids `includes` |
| Server-side execution now | closes the inspectability hole, but needs a Node sandbox, an endpoint, and time/memory limits. Bigger than this change and independently valuable — see Follow-ups |
| Web Worker instead of iframe | terminable (fixes runaway loops) but has no DOM, which several JS-track exercises need |

## Scope

### In

- A `js-behavior` member of `ValidationType`, plus the case and result types.
- A pure scoring module, `src/lib/jsBehavior.ts`, holding everything testable
  without a browser: case validation, harness source construction, result
  interpretation, partial-credit scoring, error classification.
- A harness injected into the `LivePreview` srcdoc **only when cases are
  present**, communicating by nonce-tagged `postMessage`.
- A parent-side runner with a deadline that reports a timeout as its own outcome,
  distinct from a wrong answer.
- Reference-solution guard: every `js-behavior` exercise ships a
  `referenceSolution` and a test asserts it scores 100%.
- First content: exercises in the `js` track.

### Out

- Server-side grading. Named as the follow-up that closes inspectability.
- Converting existing `code-completion` or `quiz` exercises. Additive only.
- TypeScript type-level exercises. The harness runs JavaScript; `ts-*` modules
  keep `code-completion`.
- React component exercises. Rendering React in the sandbox needs a runtime and
  is its own change.
- Any change to how CSS or HTML exercises are graded.

## Success criteria

1. A student writing a correct function scores 100%; writing a function that
   fails one of three cases scores 67%.
2. A syntax error reports **which** error, not a generic failure.
3. An infinite loop reports a timeout within the deadline and the exercise stays
   usable afterwards.
4. The 28 modules that already use `js:` previews render unchanged — proven by a
   test that the harness is absent from the srcdoc when no cases exist.
5. Every `js-behavior` exercise's reference solution scores 100%, asserted for
   all of them, and the assertion is **not** a self-comparison.
6. All five gates green.

## Slices

**Slice 1 — engine.** `src/lib/jsBehavior.ts` plus its unit tests. No UI, no
content, no component touched. Independently mergeable and independently
revertable. If the approach is wrong, this is where it gets discovered cheaply.

**Slice 2 — integration.** Harness in `LivePreview`, the runner, `ExerciseRenderer`
wiring, the JS editor mode, the reference-solution guard.

**Slice 3 — content.** Exercises in the `js` track, each with a reference
solution, plus lowering the `tipos-ejercicio.test.ts` "no writing exercise"
threshold from 63.

## Risks and rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| Harness breaks existing previews | activate only when cases exist; test asserts srcdoc is unchanged without them | revert slice 2; slices 1 and 3 are inert without it |
| Runaway loop wedges the UI | parent deadline plus iframe remount by `key`, which already exists | none needed; the frame is disposable |
| Expectation format proves too weak | slice 1 is a library with no consumers; changing the format before slice 2 costs nothing | revert slice 1 |
| A case is authored wrong, making an exercise unpassable | reference-solution guard, which is the whole reason it is mandatory | fix the case; the guard fails CI before merge |

Not security-sensitive: nothing touches `src/lib/auth.ts`, `ApprovalGate`,
MongoDB models, or XP computation. XP is awarded from the existing `xpReward`
path scaled by score, unchanged.

## Accepted constraints, stated rather than solved

1. **Expectations are inspectable.** They ship in the module data. A student can
   read `expect: 3` and write `return 3`. This is the same limitation the existing
   `targetCSS` has, and closing it is server-side work.
2. **A runaway loop is abandoned, not killed.** The parent times out; the loop
   keeps running until the frame is discarded.
3. **Async support is deadline-bound.** The harness awaits a settled value up to
   the deadline and reports a timeout otherwise.

## Follow-ups, not in this change

- Server-side execution, which closes constraint 1 and the standing `ESTADO.md`
  debt item about client-side grading in one move.
- React component exercises, once a runtime story exists.
- Extending behavioral grading to the `react-eco` and `nextjs` tracks, which is
  content work once slices 1 and 2 exist.
