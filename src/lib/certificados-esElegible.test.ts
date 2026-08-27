import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The DATABASE HALF of eligibility. `elegibilidadDe` is pure and covered
 * separately; what this file guards is the wiring around it, which is where
 * this kind of feature actually breaks: querying the wrong field, forgetting
 * `completed: true`, or looking up the wrong student's cohort.
 */

const db = {
  cohort: 2,
  habilitados: [] as string[],
  progreso: [] as { userId: string; moduleId: string; exerciseId: string; completed: boolean }[],
};

/** Records what the query actually asked for, so the filter can be asserted. */
const consultas: Record<string, unknown>[] = [];

vi.mock("@/lib/moduleVisibility", () => ({
  cohorteDe: async () => db.cohort,
  slugsHabilitadosParaCohorte: async (c: number) =>
    c === db.cohort ? db.habilitados : [],
}));

vi.mock("@/lib/models/Progress", () => ({
  default: {
    find: (q: Record<string, unknown>) => {
      consultas.push(q);
      const enModulos = (q.moduleId as { $in: string[] }).$in;
      return {
        select: () => ({
          lean: async () =>
            db.progreso.filter(
              (p) =>
                p.userId === q.userId &&
                enModulos.includes(p.moduleId) &&
                p.completed === q.completed,
            ),
        }),
      };
    },
  },
}));

vi.mock("@/data/modules", () => ({
  ALL_MODULES: [
    { slug: "box-model", dojo: "css", nivel: "obligatorio", exercises: [{ id: "b1" }, { id: "b2" }] },
    { slug: "flexbox", dojo: "css", nivel: "obligatorio", exercises: [{ id: "f1" }] },
    { slug: "sass-avanzado", dojo: "css", nivel: "profundizacion", exercises: [{ id: "s1" }] },
    { slug: "js-01", dojo: "js", exercises: [{ id: "j1" }] },
  ],
}));

const { esElegible } = await import("./certificados");

const completo = (moduleId: string, exerciseId: string, completed = true) => ({
  userId: "alumno", moduleId, exerciseId, completed,
});

beforeEach(() => {
  consultas.length = 0;
  db.cohort = 2;
  db.habilitados = ["box-model", "flexbox", "sass-avanzado"];
  db.progreso = [];
});

describe("esElegible contra la base", () => {
  it("un alumno con todo lo exigido completo es elegible, y trae el snapshot", async () => {
    db.progreso = [completo("box-model", "b1"), completo("box-model", "b2"), completo("flexbox", "f1")];

    const r = await esElegible("alumno", "css");

    expect(r.elegible).toBe(true);
    if (!r.elegible) return;
    expect(r.cohort).toBe(2);
    expect(r.modulos).toEqual(["box-model", "flexbox"]);
    expect(r.ejerciciosPorModulo).toEqual({ "box-model": 2, flexbox: 1 });
  });

  it("solo consulta el progreso COMPLETADO, y solo de los modulos exigidos", async () => {
    await esElegible("alumno", "css");

    expect(consultas).toHaveLength(1);
    expect(consultas[0]).toEqual({
      userId: "alumno",
      moduleId: { $in: ["box-model", "flexbox"] },
      completed: true,
    });
    // The optional module is enabled and is deliberately NOT in the query.
    const pedidos = (consultas[0].moduleId as { $in: string[] }).$in;
    expect(pedidos).not.toContain("sass-avanzado");
  });

  it("un intento fallido no cuenta: completed false no paga el ejercicio", async () => {
    db.progreso = [
      completo("box-model", "b1"),
      completo("box-model", "b2", false),
      completo("flexbox", "f1"),
    ];

    const r = await esElegible("alumno", "css");

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(`motivo inesperado: ${r.motivo}`);
    expect(r.faltantes).toEqual({ "box-model": ["b2"] });
  });

  it("un track no certificable ni siquiera toca la base", async () => {
    db.progreso = [completo("js-01", "j1")];

    const r = await esElegible("alumno", "js");

    expect(r.elegible).toBe(false);
    if (r.elegible) return;
    expect(r.motivo).toBe("track-no-certificable");
    // No query at all: an unclassified track can never award, so reading a
    // student's progress for it is work that could only mislead.
    expect(consultas).toHaveLength(0);
  });

  it("se mide contra TODO el track, no contra lo que la cohorte tenga habilitado", async () => {
    // Under the old rule this student was eligible with a single module done.
    // The requirement is the whole track; the enabled set only explains the gap.
    db.habilitados = ["box-model"];
    db.progreso = [completo("box-model", "b1"), completo("box-model", "b2")];

    const r = await esElegible("alumno", "css");

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("no puede certificar con un modulo de dos");
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(r.modulos).toEqual(["box-model", "flexbox"]);
    expect(r.faltantes).toEqual({ flexbox: ["f1"] });
    expect(r.aunNoHabilitados).toEqual(["flexbox"]);
  });

  it("una cohorte sin nada habilitado no es elegible, y todo el hueco es del calendario", async () => {
    db.habilitados = [];

    const r = await esElegible("alumno", "css");

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(r.aunNoHabilitados).toEqual(["box-model", "flexbox"]);
  });

  it("la consulta pide TODOS los obligatorios, incluso los que la cohorte no abrio", async () => {
    db.habilitados = ["box-model"];

    await esElegible("alumno", "css");

    expect((consultas[0].moduleId as { $in: string[] }).$in).toEqual([
      "box-model",
      "flexbox",
    ]);
  });
});
