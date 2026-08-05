# Spec Delta: js-exercise-grading

Phase: `spec` · Capability: `js-exercise-grading` (new) · Change:
`js-behavior-validator`

Affected tracks: `js` (content in this change), and `react-eco` / `nextjs`
(enabled, content deferred). No change to `css` or `html` grading.

RFC 2119 keywords are used as defined.

---

## ADDED Requirement 1 — Behavioral grading of JavaScript

The system SHALL grade a JavaScript exercise by executing the submission and
comparing observed results against declared cases. It MUST NOT grade by matching
the submission's text or its syntax tree.

### Scenario 1.1 — All cases pass

- **Given** an exercise with cases `sumar(1,2)→3`, `sumar(-1,1)→0`, `sumar(0,0)→0`
- **When** the student submits `function sumar(a, b) { return a + b; }`
- **Then** the score MUST be 100 and the result MUST be correct

### Scenario 1.2 — Partial credit

- **Given** the same three cases
- **When** the student submits `function sumar(a, b) { return a + b + 1; }`
- **Then** the score MUST be 0, because no case passes

### Scenario 1.3 — Partial credit is proportional

- **Given** three cases where exactly two pass
- **When** the results are scored
- **Then** the score MUST be 67 (rounded from 2/3), matching how `cssRules.ts`
  awards partial credit

### Scenario 1.4 — Text that resembles the answer earns nothing

- **Given** an exercise whose cases call `sumar`
- **When** the student submits the prose `la funcion sumar devuelve a + b`
- **Then** the score MUST be 0 and the outcome MUST be reported as an execution
  error, not as a wrong answer

---

## ADDED Requirement 2 — Isolation and identification

Execution SHALL occur in the existing `LivePreview` iframe sandbox. The parent
MUST identify results by a per-run nonce.

### Scenario 2.1 — Origin cannot be trusted

- **Given** the iframe is sandboxed with `allow-scripts` and without
  `allow-same-origin`
- **When** the harness posts a result to the parent
- **Then** `event.origin` arrives as `"null"`, so the parent MUST accept the
  message based on its nonce and MUST NOT compare origins

### Scenario 2.2 — Stale results are discarded

- **Given** a run whose nonce is `A`, superseded by a later run with nonce `B`
- **When** a message tagged `A` arrives after `B` started
- **Then** the parent MUST ignore it

---

## ADDED Requirement 3 — The harness MUST NOT affect existing previews

The harness SHALL be injected only when the exercise declares at least one case.

### Scenario 3.1 — No cases, no harness

- **Given** any of the 28 modules that ship `js:` in `codeExample` and declare no
  cases
- **When** the preview srcdoc is built
- **Then** the srcdoc MUST be byte-identical to what it is today

### Scenario 3.2 — Cases present

- **Given** an exercise declaring cases
- **When** the srcdoc is built
- **Then** it MUST contain the harness and the run nonce

---

## ADDED Requirement 4 — Failure modes are distinguishable

The system MUST report a wrong answer, a syntax error, a runtime error, a missing
identifier and a timeout as distinct outcomes. It MUST NOT collapse them into a
single failure.

### Scenario 4.1 — Syntax error names itself

- **Given** a submission with `function sumar(a, b) { return a + }`
- **When** it is executed
- **Then** the outcome MUST be a syntax error and the reported message MUST
  include the engine's own text

### Scenario 4.2 — Missing identifier

- **Given** cases calling `sumar` and a submission defining only `restar`
- **When** the cases are evaluated
- **Then** the outcome MUST identify that `sumar` is not defined

### Scenario 4.3 — Runtime error in one case only

- **Given** three cases where the second throws
- **When** the run completes
- **Then** the first and third MUST still be scored, and the second MUST be
  reported as a runtime error

### Scenario 4.4 — Timeout

- **Given** a submission containing `while (true) {}`
- **When** the deadline elapses with no result
- **Then** the outcome MUST be a timeout, the exercise MUST remain usable, and a
  subsequent submission MUST be gradeable

---

## ADDED Requirement 5 — Comparison semantics are declared

Comparison of an observed value against `expect` SHALL be deep structural
equality over JSON-serializable values.

### Scenario 5.1 — Arrays and objects compare by value

- **Given** a case expecting `[1, 2, 3]`
- **When** the submission returns a different array instance with equal contents
- **Then** the case MUST pass

### Scenario 5.2 — Type is not coerced

- **Given** a case expecting the number `3`
- **When** the submission returns the string `"3"`
- **Then** the case MUST fail

### Scenario 5.3 — Non-serializable results are rejected clearly

- **Given** a submission returning a function or a value containing a cycle
- **When** the result is transported
- **Then** the outcome MUST report that the value cannot be compared, and MUST
  NOT crash the run

---

## ADDED Requirement 6 — Every exercise ships a proven reference solution

Every `js-behavior` exercise MUST carry a `referenceSolution`, and the test suite
MUST assert that each one scores 100.

### Scenario 6.1 — Reference solution is mandatory

- **Given** a `js-behavior` exercise without a `referenceSolution`
- **When** the data guard runs
- **Then** it MUST fail and name the exercise

### Scenario 6.2 — The guard is not a self-comparison

- **Given** an exercise whose cases are authored wrongly, so that no valid
  submission can satisfy them
- **When** the guard runs
- **Then** it MUST fail, because it evaluates the reference solution against the
  cases rather than comparing the cases to themselves

### Scenario 6.3 — Cases must be well-formed

- **Given** a case whose `call` does not parse as an expression, or which declares
  no `expect`
- **When** the data guard runs
- **Then** it MUST fail and name the exercise and the case

---

## ADDED Requirement 7 — Scoring integrates with existing progression

Score SHALL flow through the existing progress and XP path unchanged.

### Scenario 7.1 — XP scales with score

- **Given** a `js-behavior` exercise with `xpReward: 20` completed at 67
- **When** progress is recorded
- **Then** XP MUST be awarded by the existing scaling rule, with no new branch
  for this validation type

---

## Non-goals, explicitly

- The system does NOT prevent a student from reading the expected values and
  hardcoding them. Expectations are client-side data. Closing this requires
  server-side execution and is out of scope.
- The system does NOT terminate a runaway loop. It abandons the frame.
- The system does NOT grade TypeScript types or React component output.
