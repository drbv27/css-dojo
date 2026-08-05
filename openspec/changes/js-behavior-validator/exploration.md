# Exploration: js-behavior-validator

Phase: `explore` · Store: hybrid · Change: `js-behavior-validator`

## The question

Four of the six tracks — `js`, `react`, `react-eco`, `nextjs` — have no exercise
where the student writes code from scratch. 63 of 101 modules have no
`live-editor` and no `visual-match`. Why, and what would it take to change it?

## What grading can do today

`ValidationType` has seven members, and only **two** are structural:

| Type | Structural | What it does |
|---|---|---|
| `css-rules` | yes | `src/lib/cssRules.ts` parses CSS into `selector -> Set<declaration>` |
| `html-structure` | yes | `src/lib/htmlStructure.ts` parses into a DOM, checks CSS-selector expectations |
| `exact` | no | strict equality against a token or an id map |
| `regex` | no | pattern match over the submission |
| `includes` | no | substring search |
| `includes-ordered` | no | ordered substring search |
| `visual` | no | validates nothing; a test forbids its use |

There is **no validator for JavaScript**. That is the whole answer to "why":
grading has no way to check a JS submission, so no JS exercise can ask for one.

`includes` is not a fallback. PR #5 removed it from every CSS and HTML exercise
after finding **61 exercises passable by typing the answer as prose**, and
`validacion-curriculum.test.ts` now forbids its return. Reintroducing it for JS
would rebuild the defect the project already paid to remove.

## Why not parse the JavaScript

The obvious design is an AST validator — the sibling of `cssRules.ts`. Two
findings argue against it.

**No parser is usable client-side.** Grading runs in the browser. The only
parser dependency in `package.json` is `typescript` (~7MB), which cannot ship to
the browser. Adding `acorn` (~120KB) or `@babel/parser` (~300KB) is possible but
is a new dependency whose only consumer would be this validator.

**An AST grades shape, not correctness.** A submission can match the expected
shape and still return the wrong answer, and can be correct in a way the
expectation did not anticipate. That is the same failure mode as substring
search: it approximates the thing it is supposed to verify. Choosing it would
repeat PR #5's mistake in a new form.

## The finding that changes the design

**`src/components/editor/LivePreview.tsx` already executes JavaScript.**

```
srcDoc = `<!DOCTYPE html> … ${html} ${js ? `<script>${js}<\/script>` : ""} …`
<iframe srcDoc={srcdoc} sandbox="allow-scripts" />
```

Verified properties:

- `sandbox="allow-scripts"` **without** `allow-same-origin`. The frame gets an
  opaque origin: it cannot read the parent DOM, `localStorage`, or cookies.
- `postMessage` to `window.parent` works from an opaque origin, but
  `event.origin` arrives as the string `"null"`. **Messages must be identified by
  a nonce, not by origin.**
- The iframe is remounted by bumping a `key`, and the preview is debounced 300ms.
- **28 modules already ship `js:` inside `codeExample`**, so this path is in
  production use today, not theoretical.

So the capability to run student JavaScript in an isolated context already
exists. What is missing is a way to *ask questions about the result*.

## Constraints that will not be solved by this change

**Grading stays client-side, so expectations stay inspectable.** Whatever format
the expectations take, they travel to the browser inside the module data. A
determined student can read the expected value and hardcode a return. More test
cases raise the cost without closing the hole. Closing it requires server-side
execution, which is a separate change and already an open debt item in
`ESTADO.md`. This exploration recommends accepting the limit explicitly rather
than pretending a client-side design can close it.

**A runaway loop cannot be killed, only abandoned.** `while (true)` blocks the
iframe's single thread, so no result message ever arrives. The parent can time
out and remount the frame; it cannot interrupt the loop. A Web Worker would be
terminable, but workers have no DOM, which several JS-track exercises need.

**Async submissions need a deadline.** Promises and `setTimeout` mean "the code
finished" is not the same event as "the script tag ran".

## The regression risk worth naming

Any harness injected into the srcdoc changes a component that 28 modules depend
on for previews. If the harness runs unconditionally, a bug in it breaks working
lessons across four tracks. It must activate **only** when the exercise carries
test cases.

## What the repo's own history says the guard must be

Two precedents, both earned:

- `validacion-html.test.ts` ships a **reference solution for all 20** HTML
  exercises and asserts each scores 100%. Without it, an over-strict expectation
  leaves an exercise unpassable and it reads as the student's fault.
- The malformed-`targetCSS` guard in `validacion-curriculum.test.ts` exists
  because "the answer scores 100% against itself" is **tautological** — it cannot
  detect an invalid expectation. A missing semicolon made one exercise demand
  something no valid CSS could produce, and a correct submission scored 33%.

Both apply directly. Every JS exercise must ship a reference solution proven to
score 100%, and the assertion must not be a self-comparison.

## Open questions for the proposal

1. Expectation format: expression/expected-value pairs, or arbitrary assertion
   snippets? The first is serializable and diffable; the second is more powerful
   and much harder to guard.
2. Partial credit: `passed / total` like `cssRules.ts`, or all-or-nothing?
3. Does the JS editor need its own exercise renderer, or does `live-editor`
   extend to a third mode alongside its CSS and HTML modes?
4. Which track gets the first content — `js` fundamentals, or the modules that
   currently have the weakest exercises?
