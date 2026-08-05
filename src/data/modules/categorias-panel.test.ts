import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";
import {
  CATEGORY_META,
  DOJO_CATEGORY_ORDER,
  categoriesForDojo,
} from "../moduleCategories";
import type { DojoType, ModuleCategory } from "@/types";

/**
 * Both the student listing and the teacher panel render modules by walking a
 * per-dojo category list and filtering `ALL_MODULES` by category. A module whose
 * category is absent from its dojo's list is rendered NOWHERE — and in the
 * teacher panel that means it cannot be enabled or disabled for a cohort.
 *
 * That is exactly what happened to the CSS capstone (`proyecto-cv-css`,
 * category `project`): it shipped visible to students and invisible in the
 * panel, so no teacher could open it per cohort. The master track toggle even
 * read "0 de 25 modulos activos" over 24 rendered cards.
 *
 * These assertions are about DATA reachability, not styling.
 */

const DOJOS: DojoType[] = ["html", "css", "js", "react", "react-eco", "nextjs"];

describe("category coverage of the module panels", () => {
  it("renders every module: no module has an unreachable category", () => {
    const unreachable = ALL_MODULES.filter(
      (mod) => !DOJO_CATEGORY_ORDER[mod.dojo].includes(mod.category)
    ).map((mod) => `${mod.slug} (dojo ${mod.dojo}, category ${mod.category})`);

    expect(unreachable).toEqual([]);
  });

  it.each(DOJOS)(
    "accounts for every %s module across its rendered categories",
    (dojo) => {
      const dojoModules = ALL_MODULES.filter((m) => m.dojo === dojo);
      const rendered = categoriesForDojo(dojo).flatMap(({ key }) =>
        dojoModules.filter((m) => m.category === key)
      );

      // The master track toggle counts ALL_MODULES by dojo while the cards come
      // from the category walk. If these two numbers ever diverge, the panel
      // shows a denominator it cannot render.
      expect(rendered).toHaveLength(dojoModules.length);
    }
  );

  it("keeps the CSS capstone individually manageable", () => {
    const capstone = ALL_MODULES.find((m) => m.slug === "proyecto-cv-css");
    expect(capstone, "the CSS capstone module must exist").toBeDefined();
    expect(DOJO_CATEGORY_ORDER.css).toContain(capstone!.category);
  });

  it("gives every listed category a presentation entry", () => {
    const missing = DOJOS.flatMap((dojo) =>
      DOJO_CATEGORY_ORDER[dojo].filter((key) => !CATEGORY_META[key])
    );
    expect(missing).toEqual([]);
  });

  it("never lists the same category under two dojos", () => {
    const seen = new Map<ModuleCategory, DojoType>();
    const collisions: string[] = [];

    for (const dojo of DOJOS) {
      for (const key of DOJO_CATEGORY_ORDER[dojo]) {
        const previous = seen.get(key);
        if (previous) collisions.push(`${key}: ${previous} and ${dojo}`);
        else seen.set(key, dojo);
      }
    }

    expect(collisions).toEqual([]);
  });

  /**
   * A capstone integrates everything before it, so it closes its track and must
   * never render mid-list. `js` is deliberately absent: that track teaches
   * TypeScript after its projects, which is a curriculum decision this test has
   * no business overruling.
   */
  const CLOSING_CATEGORY: Partial<Record<DojoType, ModuleCategory>> = {
    css: "project",
    html: "html-projects",
    react: "react-projects",
  };

  it.each(Object.entries(CLOSING_CATEGORY) as [DojoType, ModuleCategory][])(
    "closes the %s track with its project category",
    (dojo, expected) => {
      const order = DOJO_CATEGORY_ORDER[dojo];
      expect(order[order.length - 1]).toBe(expected);
    }
  );

  it.each(Object.entries(CLOSING_CATEGORY) as [DojoType, ModuleCategory][])(
    "gives every %s capstone a higher order than every content module",
    (dojo, closing) => {
      const dojoModules = ALL_MODULES.filter((m) => m.dojo === dojo);
      const capstones = dojoModules.filter((m) => m.category === closing);
      const content = dojoModules.filter((m) => m.category !== closing);

      expect(capstones.length).toBeGreaterThan(0);

      // The card badge prints `order`, so a capstone rendered last while
      // carrying a lower number than the module above it reads as a mistake.
      const highestContent = Math.max(...content.map((m) => m.order));
      const misnumbered = capstones
        .filter((m) => m.order <= highestContent)
        .map((m) => `${m.slug} (order ${m.order} <= ${highestContent})`);

      expect(misnumbered).toEqual([]);
    }
  );
});
