import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The API half of server-side grading.
 *
 * `calificar` is covered over the whole curriculum in
 * `calificador-curriculum.test.ts`. What this file guards is the route: that it
 * grades at all, that it ignores the score the browser claims, and that an
 * ungradeable submission grants nothing instead of throwing at the student.
 */

const db = {
  progreso: [] as Record<string, unknown>[],
  usuario: { _id: "u1", xp: 0, streak: 0, lastActivityDate: null as Date | null, save: async () => {} },
  mismatches: [] as Record<string, unknown>[],
  mismatchFalla: false,
};

vi.mock("@/lib/auth", () => ({ getSession: async () => ({ id: "u1", role: "student" }) }));
vi.mock("@/lib/db", () => ({ default: async () => {} }));

vi.mock("@/lib/models/Progress", () => ({
  default: {
    find: () => ({ lean: async () => db.progreso }),
    findOne: (q: Record<string, string>) => ({
      lean: async () =>
        db.progreso.find(
          (p) => p.moduleId === q.moduleId && p.exerciseId === q.exerciseId,
        ) ?? null,
    }),
    findOneAndUpdate: async (
      q: Record<string, string>,
      upd: { $set: Record<string, unknown> },
    ) => {
      const i = db.progreso.findIndex(
        (p) => p.moduleId === q.moduleId && p.exerciseId === q.exerciseId,
      );
      const doc = { ...q, ...upd.$set };
      if (i === -1) db.progreso.push(doc);
      else db.progreso[i] = { ...db.progreso[i], ...upd.$set };
      return doc;
    },
  },
}));

// La ruta usa `findById(...)` para actualizar y `findById(...).lean()` para
// leer, asi que el mock tiene que servir a los dos usos.
vi.mock("@/lib/models/User", () => {
  const findById = () => {
    const p = Promise.resolve(db.usuario) as Promise<typeof db.usuario> & {
      lean: () => Promise<typeof db.usuario>;
    };
    p.lean = async () => db.usuario;
    return p;
  };
  return { default: { findById } };
});

vi.mock("@/lib/models/GradeMismatch", () => ({
  default: {
    create: async (d: Record<string, unknown>) => {
      // Registrar es diagnostico. Este mock puede fallar a proposito para
      // probar que un fallo aca no le cuesta el progreso al alumno.
      if (db.mismatchFalla) throw new Error("mongo caido (a proposito)");
      db.mismatches.push(d);
      return d;
    },
  },
}));

vi.mock("@/lib/achievements", () => ({
  checkAchievements: async () => [],
  verificarLogros: async () => [],
}));

vi.mock("@/data/modules", () => ({
  ALL_MODULES: [
    {
      slug: "modulo-demo",
      dojo: "css",
      exercises: [
        {
          id: "ej-quiz",
          type: "quiz",
          xpReward: 20,
          validation: { type: "exact", answer: "b" },
        },
        {
          id: "ej-drag",
          type: "drag-drop",
          xpReward: 20,
          dragItems: [
            { id: "d1", content: "", correctZone: "z1" },
            { id: "d2", content: "", correctZone: "z2" },
          ],
          dropZones: [{ id: "z1", label: "" }, { id: "z2", label: "" }],
          validation: { type: "exact", answer: { d1: "z1", d2: "z2" } },
        },
      ],
    },
  ],
}));

const { POST } = await import("./route");

const postear = (body: Record<string, unknown>) =>
  POST(new Request("http://x/api/progress", { method: "POST", body: JSON.stringify(body) }));

const progresoDe = (exerciseId: string) =>
  db.progreso.find((p) => p.exerciseId === exerciseId);

beforeEach(() => {
  db.progreso = [];
  db.mismatches = [];
  db.mismatchFalla = false;
  db.usuario = { _id: "u1", xp: 0, streak: 0, lastActivityDate: null, save: async () => {} };
});

describe("POST /api/progress: corrige el servidor", () => {
  /**
   * EL CONTROL QUE PRUEBA EL CAMBIO ENTERO (tarea B.8).
   *
   * Antes de esto la ruta hacia `isCompleted = score >= 70` con el score del
   * body, asi que este mismo POST completaba el ejercicio y otorgaba XP. Desde
   * que existen los certificados, eso era otorgarse la credencial entera desde
   * la consola del navegador.
   */
  it("un score 100 forjado con respuesta VACIA no completa nada", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "",
    });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: false, score: 0 });
    expect(db.usuario.xp).toBe(0);
  });

  it("un score 100 forjado con la respuesta EQUIVOCADA tampoco", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "a",
    });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: false, score: 0 });
    expect(db.usuario.xp).toBe(0);
  });

  it("la respuesta correcta completa, aunque el body afirme un score de 0", async () => {
    // El reverso: el servidor manda en las dos direcciones, no solo para negar.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 0,
      userAnswer: "b",
    });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, score: 100 });
    expect(db.usuario.xp).toBe(20);
  });

  it("un drag-drop mal colocado no pasa, aunque su validation diga exact con un objeto", async () => {
    // Los 93 drag-drop del curriculum declaran `exact` con un objeto. Si la
    // ruta corrigiera por validation.type compararia "[object Object]" contra
    // si mismo y aprobaria cualquier colocacion, incluida la vacia.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 100,
      userAnswer: { d1: "z2", d2: "z1" },
    });

    expect(progresoDe("ej-drag")).toMatchObject({ completed: false });
    expect(db.usuario.xp).toBe(0);
  });

  it("un drag-drop VACIO tampoco pasa", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 100,
      userAnswer: {},
    });

    expect(progresoDe("ej-drag")).toMatchObject({ completed: false });
  });

  it("un drag-drop bien colocado si pasa", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 0,
      userAnswer: { d1: "z1", d2: "z2" },
    });

    expect(progresoDe("ej-drag")).toMatchObject({ completed: true, score: 100 });
  });
});

describe("POST /api/progress: falla cerrado", () => {
  it("un ejercicio que el curriculum no declara se rechaza sin escribir nada", async () => {
    const res = await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-que-no-existe",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "b",
    });

    expect(res.status).toBe(400);
    expect(db.progreso).toEqual([]);
  });

  it("una respuesta de forma inesperada da un rechazo calificado, NO un 500", async () => {
    const res = await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 100,
      userAnswer: "esto-no-es-una-colocacion",
    });

    expect(res.status).toBe(200);
    expect(progresoDe("ej-drag")).toMatchObject({ completed: false, score: 0 });
  });
});

describe("POST /api/progress: registro de discrepancias", () => {
  it("un envio forjado queda registrado con los dos scores", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "",
    });

    expect(db.mismatches).toHaveLength(1);
    expect(db.mismatches[0]).toMatchObject({
      userId: "u1",
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      scoreCliente: 100,
      scoreServidor: 0,
    });
  });

  it("cuando cliente y servidor coinciden NO se registra nada", async () => {
    // Si se registrara siempre, el registro dejaria de significar algo.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "b",
    });

    expect(db.mismatches).toEqual([]);
  });

  /**
   * El registro se escribe DESPUES de persistir el progreso, y su fallo se
   * traga a proposito. Si se escribiera antes, o si el error se propagara, una
   * coleccion de diagnostico caida le costaria al alumno un ejercicio que SI
   * resolvio -- y encima solo a los alumnos cuyo cliente discrepa, que es
   * exactamente la poblacion sobre la que uno esta tratando de averiguar algo.
   */
  it("un fallo escribiendo la discrepancia NO le cuesta el progreso al alumno", async () => {
    db.mismatchFalla = true;

    // Respuesta CORRECTA y un score del cliente que discrepa: completa, y de
    // paso dispara el registro.
    const res = await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 0,
      userAnswer: "b",
    });

    expect(res.status).toBe(200);
    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, score: 100 });
    expect(db.usuario.xp).toBe(20);
    expect(db.mismatches).toEqual([]);
  });
});

describe("POST /api/progress: lo que NO cambia", () => {
  it("una completitud previa no se pierde con un intento fallido posterior", async () => {
    await postear({ moduleId: "modulo-demo", exerciseId: "ej-quiz", exerciseType: "quiz", score: 0, userAnswer: "b" });
    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, score: 100 });

    await postear({ moduleId: "modulo-demo", exerciseId: "ej-quiz", exerciseType: "quiz", score: 0, userAnswer: "a" });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, score: 100 });
  });

  it("el XP se otorga UNA sola vez, no en cada reenvio", async () => {
    const ok = { moduleId: "modulo-demo", exerciseId: "ej-quiz", exerciseType: "quiz", score: 0, userAnswer: "b" };
    await postear(ok);
    await postear(ok);
    await postear(ok);

    expect(db.usuario.xp).toBe(20);
  });
});
