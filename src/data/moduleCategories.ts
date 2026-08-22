import type { DojoType, ModuleCategory } from "@/types";

/**
 * Single source of truth for how module categories are grouped and ordered on
 * screen. Both the student listing (`/modulos`) and the teacher panel
 * (`/teacher/modulos`) render from this, so a category can never be visible in
 * one place and missing from the other.
 *
 * Why this file exists: a `project` category (since replaced by `css-proyecto`)
 * was added for the CSS capstone and wired into the student listing only. The teacher panel filtered modules
 * by its own hardcoded category list, so the capstone rendered for students but
 * had no toggle in the panel — it could not be enabled or disabled per cohort.
 * `categorias-panel.test.ts` now fails if any module's category is unreachable.
 */

export interface CategoryMeta {
  label: string;
  /** Section heading color. */
  color: string;
  /** Pill background + text. */
  badge: string;
  /** Left accent bar on the student listing. */
  accent: string;
  hoverBorder: string;
  hoverBg: string;
  hoverTitle: string;
}

export const CATEGORY_META: Record<ModuleCategory, CategoryMeta> = {
  "html-fundamentals": { label: "HTML Fundamentos", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange", accent: "border-neon-orange/40", hoverBorder: "hover:border-neon-orange/40", hoverBg: "hover:bg-neon-orange/[0.04]", hoverTitle: "group-hover:text-neon-orange" },
  "html-intermediate": { label: "HTML Intermedio", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow", accent: "border-neon-yellow/40", hoverBorder: "hover:border-neon-yellow/40", hoverBg: "hover:bg-neon-yellow/[0.04]", hoverTitle: "group-hover:text-neon-yellow" },
  "html-advanced": { label: "HTML Avanzado", color: "text-neon-red", badge: "bg-neon-red/10 text-neon-red", accent: "border-neon-red/40", hoverBorder: "hover:border-neon-red/40", hoverBg: "hover:bg-neon-red/[0.04]", hoverTitle: "group-hover:text-neon-red" },
  "html-projects": { label: "Proyecto final", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },

  // CSS sections. Requirement 2 of the css-track-sections spec: each one needs
  // a `color` distinct from the other eight, so a student can tell two sections
  // apart at a glance. The six generic categories these replaced could not --
  // intro, intermediate and frameworks all rendered css-purple.
  "css-fundamentos": { label: "Fundamentos", color: "text-css-purple", badge: "bg-css-purple/10 text-css-purple", accent: "border-css-purple/40", hoverBorder: "hover:border-css-purple/40", hoverBg: "hover:bg-css-purple/[0.04]", hoverTitle: "group-hover:text-css-purple" },
  "css-caja": { label: "La caja y las medidas", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange", accent: "border-neon-orange/40", hoverBorder: "hover:border-neon-orange/40", hoverBg: "hover:bg-neon-orange/[0.04]", hoverTitle: "group-hover:text-neon-orange" },
  "css-texto": { label: "Texto", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow", accent: "border-neon-yellow/40", hoverBorder: "hover:border-neon-yellow/40", hoverBg: "hover:bg-neon-yellow/[0.04]", hoverTitle: "group-hover:text-neon-yellow" },
  "css-selectores": { label: "Selectores", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  "css-layout": { label: "Layout", color: "text-neon-teal", badge: "bg-neon-teal/10 text-neon-teal", accent: "border-neon-teal/40", hoverBorder: "hover:border-neon-teal/40", hoverBg: "hover:bg-neon-teal/[0.04]", hoverTitle: "group-hover:text-neon-teal" },
  "css-visual": { label: "Efectos visuales", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink", accent: "border-neon-pink/40", hoverBorder: "hover:border-neon-pink/40", hoverBg: "hover:bg-neon-pink/[0.04]", hoverTitle: "group-hover:text-neon-pink" },
  "css-responsive": { label: "Responsive", color: "text-ts-blue", badge: "bg-ts-blue/10 text-ts-blue", accent: "border-ts-blue/40", hoverBorder: "hover:border-ts-blue/40", hoverBg: "hover:bg-ts-blue/[0.04]", hoverTitle: "group-hover:text-ts-blue" },
  "css-herramientas": { label: "Herramientas", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
  "css-proyecto": { label: "Proyecto final", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },

  "js-fundamentals": { label: "Fundamentos", color: "text-neon-yellow", badge: "bg-neon-yellow/10 text-neon-yellow", accent: "border-neon-yellow/40", hoverBorder: "hover:border-neon-yellow/40", hoverBg: "hover:bg-neon-yellow/[0.04]", hoverTitle: "group-hover:text-neon-yellow" },
  "js-intermediate": { label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  "js-advanced": { label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
  "js-async": { label: "Asincronia", color: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange", accent: "border-neon-orange/40", hoverBorder: "hover:border-neon-orange/40", hoverBg: "hover:bg-neon-orange/[0.04]", hoverTitle: "group-hover:text-neon-orange" },
  "js-dom": { label: "DOM y Eventos", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  "js-projects": { label: "Proyectos", color: "text-neon-pink", badge: "bg-neon-pink/10 text-neon-pink", accent: "border-neon-pink/40", hoverBorder: "hover:border-neon-pink/40", hoverBg: "hover:bg-neon-pink/[0.04]", hoverTitle: "group-hover:text-neon-pink" },
  "js-typescript": { label: "TypeScript", color: "text-ts-blue", badge: "bg-ts-blue/10 text-ts-blue", accent: "border-ts-blue/40", hoverBorder: "hover:border-ts-blue/40", hoverBg: "hover:bg-ts-blue/[0.04]", hoverTitle: "group-hover:text-ts-blue" },

  "react-fundamentals": { label: "React Fundamentos", color: "text-neon-teal", badge: "bg-neon-teal/10 text-neon-teal", accent: "border-neon-teal/40", hoverBorder: "hover:border-neon-teal/40", hoverBg: "hover:bg-neon-teal/[0.04]", hoverTitle: "group-hover:text-neon-teal" },
  "react-intermediate": { label: "React Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  "react-advanced": { label: "React Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
  "react-projects": { label: "React Proyectos", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },

  "react-eco-routing": { label: "Routing", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  "react-eco-state": { label: "Estado Global", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  "react-eco-ui": { label: "UI y Componentes", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  "react-eco-forms": { label: "Formularios", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },
  "react-eco-data": { label: "Data Fetching", color: "text-neon-green", badge: "bg-neon-green/10 text-neon-green", accent: "border-neon-green/40", hoverBorder: "hover:border-neon-green/40", hoverBg: "hover:bg-neon-green/[0.04]", hoverTitle: "group-hover:text-neon-green" },

  "nextjs-fundamentals": { label: "Fundamentos", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  "nextjs-intermediate": { label: "Intermedio", color: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue", accent: "border-neon-blue/40", hoverBorder: "hover:border-neon-blue/40", hoverBg: "hover:bg-neon-blue/[0.04]", hoverTitle: "group-hover:text-neon-blue" },
  "nextjs-advanced": { label: "Avanzado", color: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple", accent: "border-neon-purple/40", hoverBorder: "hover:border-neon-purple/40", hoverBg: "hover:bg-neon-purple/[0.04]", hoverTitle: "group-hover:text-neon-purple" },
};

/**
 * Category render order per dojo. Adding a module with a category that is not
 * listed under its own dojo makes that module unreachable in the teacher panel,
 * which is why the guard test asserts full coverage.
 */
export const DOJO_CATEGORY_ORDER: Record<DojoType, ModuleCategory[]> = {
  html: ["html-fundamentals", "html-intermediate", "html-advanced", "html-projects"],
  css: [
    "css-fundamentos",
    "css-caja",
    "css-texto",
    "css-selectores",
    "css-layout",
    "css-visual",
    "css-responsive",
    "css-herramientas",
    "css-proyecto",
  ],
  js: [
    "js-fundamentals",
    "js-intermediate",
    "js-advanced",
    "js-async",
    "js-dom",
    "js-projects",
    "js-typescript",
  ],
  react: ["react-fundamentals", "react-intermediate", "react-advanced", "react-projects"],
  "react-eco": [
    "react-eco-routing",
    "react-eco-state",
    "react-eco-ui",
    "react-eco-forms",
    "react-eco-data",
  ],
  nextjs: ["nextjs-fundamentals", "nextjs-intermediate", "nextjs-advanced"],
};

/** Categories of a dojo, in render order, each paired with its presentation. */
export function categoriesForDojo(
  dojo: DojoType
): { key: ModuleCategory; meta: CategoryMeta }[] {
  return DOJO_CATEGORY_ORDER[dojo].map((key) => ({ key, meta: CATEGORY_META[key] }));
}
