import type { Exercise, Lesson } from "@/types";

/**
 * Interleaves a module's exercises into its lesson sequence.
 *
 * Today a module is two separate lists: N lessons, then a block of 8-11
 * exercises at the end. A student meets the whole block after the theory is
 * cold. Anchoring an exercise to a lesson with `afterLesson` turns that into
 * lesson -> challenge -> lesson -> challenge.
 *
 * Pure on purpose: the rule about what goes where is worth testing without
 * mounting a page.
 */

/** One lesson and the challenges that belong to it, in curriculum order. */
export interface BloqueLeccion {
  leccion: Lesson;
  retos: Exercise[];
}

export interface Intercalado {
  bloques: BloqueLeccion[];
  /**
   * Exercises that belong to no lesson block: the ones with no `afterLesson`,
   * plus any whose anchor names a lesson this module does not have.
   *
   * THE DANGLING CASE IS THE IMPORTANT ONE. A typo in an id must not make an
   * exercise vanish from the page — a student would simply never see it, and
   * nothing would look broken. So a dangling anchor degrades to un-anchored
   * here, and `intercalado-curriculum.test.ts` fails the build so someone
   * actually fixes the typo.
   */
  sinAnclar: Exercise[];
}

const porOrden = <T extends { order: number }>(xs: readonly T[]) =>
  [...xs].sort((a, b) => a.order - b.order);

export function intercalarModulo(
  lessons: readonly Lesson[],
  exercises: readonly Exercise[],
): Intercalado {
  const lecciones = porOrden(lessons);
  const idsDeLeccion = new Set(lecciones.map((l) => l.id));

  const anclados = new Map<string, Exercise[]>();
  const sinAnclar: Exercise[] = [];

  for (const ej of porOrden(exercises)) {
    const ancla = ej.afterLesson;
    if (ancla !== undefined && idsDeLeccion.has(ancla)) {
      anclados.set(ancla, [...(anclados.get(ancla) ?? []), ej]);
    } else {
      sinAnclar.push(ej);
    }
  }

  return {
    bloques: lecciones.map((leccion) => ({
      leccion,
      retos: anclados.get(leccion.id) ?? [],
    })),
    sinAnclar,
  };
}

/** True when at least one exercise of the module is anchored to a lesson. */
export function tieneRetosIntercalados(
  lessons: readonly Lesson[],
  exercises: readonly Exercise[],
): boolean {
  return intercalarModulo(lessons, exercises).bloques.some((b) => b.retos.length > 0);
}
