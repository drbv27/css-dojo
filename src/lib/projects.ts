import { ALL_MODULES } from "@/data/modules";
import type { ModuleData } from "@/types";

// Categorias de modulos que aceptan ENTREGA de archivo (subida del alumno).
// Ampliar aqui cuando haya proyectos de otros tracks (js, react, etc.).
export const PROJECT_CATEGORIES = ["html-projects"] as const;

export function isProjectCategory(category: string): boolean {
  return (PROJECT_CATEGORIES as readonly string[]).includes(category);
}

export function isProjectModule(slug: string): boolean {
  const mod = ALL_MODULES.find((m) => m.slug === slug);
  return Boolean(mod && isProjectCategory(mod.category));
}

export function projectModules(): ModuleData[] {
  return ALL_MODULES.filter((m) => isProjectCategory(m.category));
}
