import { describe, it, expect } from "vitest";
import { mezclarDeterminista, semillaDeEjercicio } from "./shuffle";
import { ALL_MODULES } from "@/data/modules";

const OPCIONES = ["a", "b", "c", "d"];

describe("mezclarDeterminista", () => {
  it("es estable: la misma semilla siempre da el mismo orden", () => {
    const primera = mezclarDeterminista(OPCIONES, "user-1:03-ej-08");
    for (let i = 0; i < 20; i++) {
      expect(mezclarDeterminista(OPCIONES, "user-1:03-ej-08")).toEqual(primera);
    }
  });

  it("no pierde ni duplica opciones", () => {
    const mezclado = mezclarDeterminista(OPCIONES, "user-1:03-ej-08");
    expect([...mezclado].sort()).toEqual([...OPCIONES].sort());
  });

  it("no muta el arreglo original", () => {
    const original = [...OPCIONES];
    mezclarDeterminista(original, "user-1:03-ej-08");
    expect(original).toEqual(OPCIONES);
  });

  it("da ordenes distintos a alumnos distintos en el mismo ejercicio", () => {
    const ordenes = new Set(
      Array.from({ length: 40 }, (_, i) =>
        mezclarDeterminista(OPCIONES, semillaDeEjercicio(`user-${i}`, "03-ej-08")).join("")
      )
    );
    // Con 4 opciones hay 24 permutaciones; 40 alumnos tienen que caer en varias.
    expect(ordenes.size).toBeGreaterThan(5);
  });

  it("da ordenes distintos a un mismo alumno en ejercicios distintos", () => {
    const ordenes = new Set(
      ["03-ej-08", "03-ej-09", "05-ej-01", "11-ej-03", "15-ej-02"].map((id) =>
        mezclarDeterminista(OPCIONES, semillaDeEjercicio("user-1", id)).join("")
      )
    );
    expect(ordenes.size).toBeGreaterThan(1);
  });

  it("sobrevive los casos borde", () => {
    expect(mezclarDeterminista([], "x")).toEqual([]);
    expect(mezclarDeterminista(["solo"], "x")).toEqual(["solo"]);
  });
});

/**
 * El defecto que motivo todo esto: en el curso, la respuesta correcta estaba en
 * la SEGUNDA posicion en el 69% de los quizzes. Marcar siempre la B aprobaba 7
 * de cada 10 sin leer el enunciado.
 *
 * Este test no exige que los datos se arreglen (el orden autoral puede seguir
 * sesgado); exige que la MEZCLA lo disuelva, que es lo que ve el alumno.
 */
describe("el sesgo posicional del curso queda disuelto", () => {
  const quizzes = ALL_MODULES.flatMap((m) =>
    m.exercises
      .filter((e) => (e.options?.length ?? 0) > 1)
      .map((e) => ({ id: e.id, options: e.options! }))
  );

  it("hay quizzes para medir", () => {
    expect(quizzes.length).toBeGreaterThan(100);
  });

  it("ninguna posicion concentra mas de la mitad de las respuestas correctas", () => {
    const porPosicion = new Map<number, number>();
    for (const quiz of quizzes) {
      const mezclado = mezclarDeterminista(quiz.options, semillaDeEjercicio("user-1", quiz.id));
      const i = mezclado.findIndex((o) => o.isCorrect);
      if (i >= 0) porPosicion.set(i, (porPosicion.get(i) ?? 0) + 1);
    }
    const total = [...porPosicion.values()].reduce((a, b) => a + b, 0);
    const mayor = Math.max(...porPosicion.values());
    expect(mayor / total).toBeLessThan(0.5);
  });
});
