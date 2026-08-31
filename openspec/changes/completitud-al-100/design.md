# Design — completitud-al-100

## D1. The whole production change is two conditions in one line

`route.ts:66` today:

```ts
const isCompleted = calificacion.calificable && score >= 70;
```

After:

```ts
const isCompleted = calificacion.calificable
  ? score === 100
  : esSoloCliente(exercise) && scoreCliente === 100;
```

Everything else in this change is guards and spec. **If the production diff grows
past this, something was misunderstood.**

## D2. The exception rides on `esSoloCliente`, and that is the point

`esSoloCliente(ejercicio)` already exists, is exported, and a curriculum guard
already pins it to exactly the four `js-behavior` exercises — adding an
ungradeable exercise without listing it there fails the build.

Binding the exception to that predicate means **the door cannot widen by
accident**. A new `validation.type` lands in the default branch, which grants
nothing, until someone deliberately adds it to the enumerated list — and that
addition is itself guarded.

Alternatives rejected:

- **A flag in the request body.** Anything the client can set, the client can
  forge for any exercise. The whole point of `revalidacion-en-servidor` was to
  stop trusting the body about completion.
- **Keying on `validation.type === "js-behavior"`.** Works today and rots
  tomorrow: a second untrainable type would inherit the exception silently.

## D3. `scoreCliente` is already parsed, and already distrusted

`route.ts` reads `body.score` into `scoreCliente` for the sole purpose of
recording disagreement. This change gives it **one** additional use, in the one
branch where the server has nothing better.

The `null` case matters: a request with no `score` must not complete a
client-graded exercise. `scoreCliente === 100` handles it — `null === 100` is
false.

## D4. The order of the two halves, and why

The four broken exercises are fixed **first**, in their own commit. They are a
live production bug; the threshold is a deliberate product change. Commit order
makes the bug fix revertible without taking the rule with it.

## D5. Nothing becomes unpassable, and it is already proven

`calificador-curriculum.test.ts` asserts that every exercise's own recorded
correct answer scores 100 against the real grader, over all 844. Requiring 100
therefore makes nothing impossible.

The only exercises that cannot reach 100 server-side are the four, and half two
is exactly about them. **This change needs no new proof of passability — the
existing guard is the proof**, and that is worth saying rather than re-deriving.

## D6. What happens to a student mid-exercise

Someone who today gets 80 and sees the exercise completed will, after this, get
80 and see it not completed. It is product-visible the day it deploys, and it is
the correct behaviour.

Their **existing** `Progress` is untouched: the route never un-completes
(`completed: isCompleted || wasAlreadyCompleted`), which this change does not
alter. A student who already completed something at 80 keeps it.

## D7. What this change deliberately does not do

- **No mass re-grade of the 5 349 historical completions.** A re-grader with a
  bug deletes real student work. The rule governs forward.
- **No JavaScript sandbox in the backend.**
- **No change to the belt thresholds**, and no change to `correct`, which was
  already `score === 100`. After this the two finally agree, which is the point.
