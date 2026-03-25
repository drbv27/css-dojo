import type { Exercise } from "@/types";

interface ValidationResult {
  correct: boolean;
  score: number;
}

function parseCSS(css: string): Record<string, string> {
  const properties: Record<string, string> = {};
  // Remove comments
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "");
  // Match property: value pairs (ignoring selectors/braces)
  const withoutBlocks = cleaned.replace(/[^{}]*\{/g, "").replace(/\}/g, "");
  const declarations = withoutBlocks.split(";").filter((d) => d.trim());

  for (const decl of declarations) {
    const colonIndex = decl.indexOf(":");
    if (colonIndex === -1) continue;
    const prop = decl.substring(0, colonIndex).trim().toLowerCase();
    const value = decl.substring(colonIndex + 1).trim().toLowerCase();
    if (prop) {
      properties[prop] = value;
    }
  }

  return properties;
}

export function validateExercise(
  exercise: Exercise,
  userAnswer: any
): ValidationResult {
  const { validation } = exercise;

  switch (validation.type) {
    case "exact": {
      const expected = String(validation.answer).trim().toLowerCase();
      const given = String(userAnswer).trim().toLowerCase();
      const correct = expected === given;
      return { correct, score: correct ? 1 : 0 };
    }

    case "regex": {
      const pattern = new RegExp(validation.answer, "i");
      const correct = pattern.test(String(userAnswer));
      return { correct, score: correct ? 1 : 0 };
    }

    case "includes": {
      // validation.answer is expected to be a Record<string, string>
      // representing CSS properties and their expected values
      const requiredProps = validation.answer as Record<string, string>;
      const userProps = parseCSS(String(userAnswer));

      let matched = 0;
      const total = Object.keys(requiredProps).length;

      if (total === 0) {
        return { correct: true, score: 1 };
      }

      for (const [prop, expectedValue] of Object.entries(requiredProps)) {
        const normalizedProp = prop.trim().toLowerCase();
        const normalizedExpected = expectedValue.trim().toLowerCase();
        const userValue = userProps[normalizedProp];

        if (userValue && userValue === normalizedExpected) {
          matched++;
        }
      }

      const score = matched / total;
      const correct = matched === total;
      return { correct, score };
    }

    case "visual": {
      // Visual matching is handled client-side via screenshot comparison.
      // Server-side we do a basic CSS property check as fallback.
      if (validation.answer && typeof validation.answer === "object") {
        const requiredProps = validation.answer as Record<string, string>;
        const userProps = parseCSS(String(userAnswer));

        let matched = 0;
        const total = Object.keys(requiredProps).length;

        if (total === 0) return { correct: true, score: 1 };

        for (const [prop, expectedValue] of Object.entries(requiredProps)) {
          const userValue = userProps[prop.trim().toLowerCase()];
          if (
            userValue &&
            userValue === expectedValue.trim().toLowerCase()
          ) {
            matched++;
          }
        }

        const score = matched / total;
        return { correct: matched === total, score };
      }

      return { correct: false, score: 0 };
    }

    default:
      return { correct: false, score: 0 };
  }
}
