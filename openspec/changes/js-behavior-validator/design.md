# Design: js-behavior-validator

Phase: `design` · Depends on `proposal.md`, `specs/js-exercise-grading/spec.md`,
`exploration.md`

## Technical approach

Three layers, split so that the interesting logic is testable without a browser.

```
src/lib/jsBehavior.ts          PURE. No DOM, no iframe. Unit-testable.
  ├─ validarCasos(cases)       well-formedness of authored data
  ├─ construirHarness(cases, nonce) -> string   the <script> source
  ├─ interpretarMensaje(raw, nonce) -> Resultado | null
  └─ puntuar(resultados) -> { score, correct, fallidos }

src/components/editor/LivePreview.tsx    injects the harness when cases exist
src/hooks/useJsBehavior.ts               parent runner: nonce, listener, deadline
```

The split matters: everything a test can meaningfully assert lives in the pure
module. The component and the hook contain only wiring, which is what Playwright
covers.

## Data shapes

```ts
interface JsBehaviorCase {
  /** Expression evaluated after the submission runs, e.g. "sumar(1, 2)". */
  call: string;
  /** Expected value. MUST be JSON-serializable. */
  expect: unknown;
  /** Optional label shown to the student instead of the raw expression. */
  label?: string;
}

type JsCaseOutcome =
  | { kind: "pass" }
  | { kind: "fail"; observed: unknown }
  | { kind: "runtime-error"; message: string }
  | { kind: "not-defined"; identifier: string }
  | { kind: "unserializable" };

type JsRunOutcome =
  | { kind: "ok"; cases: JsCaseOutcome[] }
  | { kind: "syntax-error"; message: string }
  | { kind: "timeout" };
```

`syntax-error` and `timeout` are run-level: neither produces per-case results.
That is why `JsRunOutcome` is a union rather than a struct with optional fields —
it makes the impossible states unrepresentable instead of merely unused.

## The nonce protocol

The frame is sandboxed `allow-scripts` **without** `allow-same-origin`, so its
origin is opaque and `event.origin` arrives as the literal string `"null"`. Origin
checks are therefore useless here, and writing one would be worse than useless
because it would look like a security control while enforcing nothing.

Instead every run generates a nonce, the harness echoes it, and the parent accepts
only messages carrying the nonce of the run it is waiting for. Late messages from
a superseded run are dropped by nonce mismatch, which also solves the debounce
race: `LivePreview` already debounces 300ms, so an in-flight run can be
superseded by a newer submission.

The nonce is a run correlator, not a secret. It is not a defence against a hostile
student — the student already controls the code inside the frame. It exists to
keep results matched to runs.

**To be proven by a test in slice 2, not assumed:** that a message posted from
this exact sandbox configuration reaches the parent at all. The design rests on
it, so it gets an explicit Playwright assertion rather than a comment.

## Timeout

The parent arms a deadline when it sets the srcdoc and clears it on the first
matching message.

A blocking loop in the submission occupies the frame's only thread, so no message
can ever arrive — the deadline is the *only* signal available. On expiry the
parent reports `timeout` and bumps the existing `key`, which discards the frame
and its running script. `LivePreview` already remounts on `key`, so this reuses a
mechanism that is in production rather than adding one.

The loop is not interrupted; the frame is thrown away. A Web Worker would be
terminable but has no DOM, and DOM-based exercises are a large part of the `js`
track, so the iframe is the right host and the abandonment is the accepted cost.

## Comparison and the serialization boundary

`postMessage` uses structured clone, which handles cycles and more types than JSON
but still cannot transport functions, DOM nodes, or class instances usefully. Rather
than depend on which engine clones what, the harness serializes each observed value
explicitly and reports `unserializable` when it cannot. Comparison then happens in
the parent over plain data, by deep structural equality with no type coercion:
`3` and `"3"` are different, and two arrays with equal contents are equal.

Doing the comparison in the parent — not in the harness — keeps the semantics in
the pure, unit-tested module instead of inside a string of injected script that no
test can reach directly.

## Why the harness is conditional

28 modules ship `js:` today and depend on this srcdoc for their previews. The
harness is appended only when `cases.length > 0`, and Requirement 3 turns that
into an assertion: with no cases, the srcdoc must be **byte-identical** to today's
output. That test is what makes it safe to touch a component four tracks depend
on.

## Interaction with ModuleSettings and static module data

None, deliberately. Visibility is decided per cohort in `ModuleSettings` and
resolved by `GET /api/modules/enabled` before a module is reachable; grading runs
only inside an exercise the student already opened. A `js-behavior` exercise adds
no new coupling in either direction: it does not read visibility, and hiding a
module does not change how it would be graded.

The one existing rule that does apply: the exercise lives in static module data
under `src/data/modules/`, so its cases and reference solution are part of the
same file as the rest of the module, and every existing data guard
(`orden-lecciones`, `acentuacion`, `signos-interrogacion`, `tipos-ejercicio`) runs
over it automatically. The new guard joins them rather than replacing anything.

## Decisions, with rationale

| Decision | Rationale | Alternative rejected |
|---|---|---|
| Behavioral, not AST | grades correctness rather than shape; needs no parser in the browser | AST via `acorn`: new dependency, and it approximates what it should verify |
| Comparison in the parent | keeps semantics in the unit-tested module | comparison inside the harness: untestable from Vitest |
| Nonce, not origin | opaque origin makes `event.origin` the string `"null"` | origin check: enforces nothing while looking like it does |
| Run-level union type | makes "syntax error with per-case results" unrepresentable | struct with optional fields: allows impossible states |
| Harness conditional on cases | 28 modules depend on the current srcdoc | always inject: a harness bug breaks working lessons |
| Reference solution mandatory | `validacion-html.test.ts` precedent; an over-strict case otherwise ships an unpassable exercise | trust the author: already proven insufficient twice in this repo |
| Deep equality, no coercion | `"3"` passing a test expecting `3` would teach the wrong thing | loose equality: hides real bugs from the student |

## Testability split

**Unit (Vitest, no browser) — slice 1:**
`validarCasos` over well-formed and malformed data; `construirHarness` output
containing the nonce and each call; `interpretarMensaje` accepting a matching
nonce, rejecting a mismatched one, and rejecting malformed payloads;
`puntuar` for 0/N, N/N, and rounding; deep equality including nested structures,
type mismatches, and the unserializable path.

**Integration (Playwright) — slice 2:**
A correct submission scores 100 end to end; a syntax error surfaces the engine
message; `while (true)` produces a timeout and the exercise stays usable
afterwards; a message really does cross the sandbox boundary.

**Data guard (Vitest) — slice 3:**
Every `js-behavior` exercise has a `referenceSolution`; every reference solution
scores 100 against its own cases; every case is well-formed. This is the guard
that must not be a self-comparison — it evaluates the solution against the cases,
which is exactly what catches cases authored wrongly.

## Estimated size

| Slice | Files | Changed lines |
|---|---|---|
| 1 — engine | `src/lib/jsBehavior.ts`, `src/lib/jsBehavior.test.ts` | ~260 |
| 2 — integration | `LivePreview.tsx`, `useJsBehavior.ts`, `ExerciseRenderer.tsx`, a JS editor mode, `types/index.ts`, one e2e spec | ~300 |
| 3 — content | 1 module file, 1 guard test, threshold update | ~200 |

Each slice is under the 400-line review budget in `config.yaml`, so chained PRs
are not required. Slice 1 is inert until slice 2 consumes it, and slice 3 is inert
without slice 2 — so the natural merge order is also the natural revert order.
