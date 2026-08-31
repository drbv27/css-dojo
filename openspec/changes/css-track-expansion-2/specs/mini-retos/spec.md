# Delta for mini-retos

One requirement is `MODIFIED`: a count written as a literal becomes the rule it
was always meant to express.

## MODIFIED Requirement: A Module Carries At Most One Integrating Challenge

The paragraph that reads:

> Each of the 19 required CSS modules MUST carry exactly one. A module outside
> that set MUST carry none until its own change adds it.

is replaced by:

> **Every** required CSS module MUST carry exactly one. A module that is not
> required MUST carry none until its own change adds it.

**Why the literal was a defect waiting to happen.** "19" was true the day it was
written and stopped being true the moment a twentieth required module was
planned. A spec that counts instead of stating the rule forces every later change
to remember to redline it -- and the one guard that could have caught the drift
compares against a hardcoded registry of slugs, so it would not have noticed
either.

At the time of this change the count is 23. **That number does not appear in the
requirement**, on purpose.

#### Scenario: A newly required module must gain a challenge

- GIVEN a CSS module that becomes required
- WHEN it carries no integrating challenge
- THEN validation MUST fail and MUST name the module
