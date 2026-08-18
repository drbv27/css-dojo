/**
 * Deterministic shuffling for exercise options.
 *
 * Why this exists: quiz options used to render in the order they were authored,
 * and 69% of the curriculum's quizzes happened to have the correct answer in the
 * second slot. A student who always picked B passed roughly seven out of ten
 * quizzes without reading the question -- the pattern was learnable, the CSS was
 * not.
 *
 * Randomizing on every render would fix that but lose reproducibility: the order
 * would differ between the server and client render, and a student reporting
 * "the third one is wrong" could not be helped. Seeding the shuffle instead gives
 * each student their own stable order: different from their classmates', and the
 * same every time they come back to that exercise.
 */

/** FNV-1a. Small, fast, and stable across runs -- unlike `hashCode`-style sums,
 * it does not collide on short seeds that differ only by one character. */
function hash(semilla: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < semilla.length; i++) {
    h ^= semilla.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: one 32-bit state, uniform enough for ordering four options. */
function generador(estado: number): () => number {
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a new array with the same items in a shuffled order. The order is a
 * pure function of `semilla`: the same seed always yields the same permutation,
 * and every item appears exactly once.
 */
export function mezclarDeterminista<T>(items: readonly T[], semilla: string): T[] {
  const salida = [...items];
  const siguiente = generador(hash(semilla));
  // Fisher-Yates, walking backwards so every permutation is equally likely.
  for (let i = salida.length - 1; i > 0; i--) {
    const j = Math.floor(siguiente() * (i + 1));
    [salida[i], salida[j]] = [salida[j], salida[i]];
  }
  return salida;
}

/**
 * Seed for one student on one exercise. Falls back to a fixed label when the
 * user is not loaded yet, so the order never depends on render timing.
 */
export function semillaDeEjercicio(idUsuario: string | undefined, idEjercicio: string): string {
  return `${idUsuario ?? "anon"}:${idEjercicio}`;
}
