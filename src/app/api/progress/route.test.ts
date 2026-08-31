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
          // CUATRO items a proposito: con tres bien da 75, que es un parcial
          // ENTRE 70 y 100. Con dos items el parcial era 50, que tampoco
          // completa bajo el umbral viejo, y el test no distinguia una regla de
          // la otra: su control positivo pasaba. Un control que pasa significa
          // que el test esta roto.
          dragItems: [
            { id: "d1", content: "", correctZone: "z1" },
            { id: "d2", content: "", correctZone: "z2" },
            { id: "d3", content: "", correctZone: "z1" },
            { id: "d4", content: "", correctZone: "z2" },
          ],
          dropZones: [{ id: "z1", label: "" }, { id: "z2", label: "" }],
          validation: { type: "exact", answer: { d1: "z1", d2: "z2" } },
        },
        {
          // Uno de los que el SERVIDOR no puede corregir: corre el JS del alumno
          // en un Worker. `esSoloCliente` los enumera.
          id: "ej-js",
          type: "code-completion",
          xpReward: 20,
          validation: { type: "js-behavior" },
        },
        {
          // Un tipo que ningun corrector implementa. NO debe heredar la
          // excepcion del de arriba.
          id: "ej-desconocido",
          type: "quiz",
          xpReward: 20,
          validation: { type: "telepatia", answer: "lo que sea" },
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
      userAnswer: { d1: "z1", d2: "z2", d3: "z1", d4: "z2" },
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

describe("POST /api/progress: se completa con el 100, no con el 70", () => {
  it("una respuesta PARCIAL no completa y no da XP", async () => {
    // EL CAMBIO ENTERO. Antes esto completaba: el umbral era 70 y un ejercicio
    // de cuatro propiedades se daba por hecho con tres. Medido antes de sacarlo:
    // 63 de los 92 css-rules de CSS completaban con una declaracion faltante, y
    // 47 estaban en modulos obligatorios, o sea que el certificado se ganaba
    // dejando trabajo sin hacer.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 100,
      // tres de las cuatro bien: 75. Un parcial que bajo el umbral VIEJO SI
      // completaba, y bajo la regla nueva no.
      userAnswer: { d1: "z1", d2: "z2", d3: "z1", d4: "z1" },
    });

    expect(progresoDe("ej-drag")).toMatchObject({ completed: false, score: 75 });
    expect(db.usuario.xp).toBe(0);
  });

  it("pero el score parcial SI se guarda: el alumno tiene que ver cuanto le falta", async () => {
    // Quitarle la completitud no es quitarle la informacion. Si el score se
    // guardara en cero, el alumno no sabria si le falta una propiedad o todas.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 0,
      userAnswer: { d1: "z1", d2: "z2", d3: "z1", d4: "z1" },
    });

    expect(progresoDe("ej-drag")).toMatchObject({ score: 75 });
  });

  it("la respuesta completa si completa", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 0,
      userAnswer: { d1: "z1", d2: "z2", d3: "z1", d4: "z2" },
    });

    expect(progresoDe("ej-drag")).toMatchObject({ completed: true, score: 100 });
    expect(db.usuario.xp).toBe(20);
  });
});

describe("POST /api/progress: lo que el servidor no puede corregir", () => {
  it("un js-behavior SI se completa con el veredicto del cliente", async () => {
    // ESTABA ROTO EN PRODUCCION. `isCompleted` daba false para los cuatro
    // js-behavior escribiera lo que escribiera el alumno, porque el servidor no
    // puede correr su JS y "no calificable" no otorgaba nada. Eran cuatro
    // ejercicios inalcanzables.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-js",
      exerciseType: "code-completion",
      score: 100,
      userAnswer: "function sumar(a, b) { return a + b; }",
    });

    expect(progresoDe("ej-js")).toMatchObject({ completed: true });
  });

  it("con menos de 100 NO completa, aunque sea del cliente", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-js",
      exerciseType: "code-completion",
      score: 80,
      userAnswer: "algo a medias",
    });

    expect(progresoDe("ej-js")).toMatchObject({ completed: false });
  });

  it("sin score del cliente tampoco completa", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-js",
      exerciseType: "code-completion",
      userAnswer: "sin score en el body",
    });

    expect(progresoDe("ej-js")).toMatchObject({ completed: false });
  });

  it("LA PUERTA NO SE ENSANCHA: un tipo desconocido no hereda la excepcion", async () => {
    // El caso que decide si la excepcion esta bien atada. `ej-desconocido` es
    // igual de no-calificable que el js-behavior, pero NO esta en la lista
    // enumerada. Si esto completara, cualquier validation.type nuevo entraria a
    // confiar en el cliente sin que nadie lo decidiera.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-desconocido",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "lo que sea",
    });

    expect(progresoDe("ej-desconocido")).toMatchObject({ completed: false });
  });
});

describe("POST /api/progress: el XP del registro sigue a la completitud", () => {
  /**
   * `xpEarned` se escribia `maxXP` FIJO, sin mirar si el ejercicio se habia
   * completado. El saldo del alumno nunca estuvo mal -- `user.xp` suma
   * `xpToAward`, que si mira `isCompleted` -- y el leaderboard filtra por
   * `completed: true`, asi que el defecto era de LECTURA: en
   * `/teacher/estudiante/[id]` una fila roja que decia "Incompleto" mostraba
   * "+20 XP" al lado. El dato con el que el profe evalua, mintiendo.
   *
   * Ninguno de estos casos tenia un test. Por eso vivio.
   */
  it("un intento FALLIDO no guarda XP en el registro", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 100,
      userAnswer: "a",
    });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: false, xpEarned: 0 });
  });

  it("un intento PARCIAL tampoco", async () => {
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-drag",
      exerciseType: "drag-drop",
      score: 0,
      // tres de cuatro: 75. Score real, completitud no.
      userAnswer: { d1: "z1", d2: "z2", d3: "z1", d4: "z1" },
    });

    expect(progresoDe("ej-drag")).toMatchObject({ score: 75, completed: false, xpEarned: 0 });
  });

  it("completar SI guarda el XP", async () => {
    // El reverso. Sin esto, `xpEarned: 0` fijo pasaria los dos de arriba.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-quiz",
      exerciseType: "quiz",
      score: 0,
      userAnswer: "b",
    });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, xpEarned: 20 });
  });

  it("un js-behavior completado por el cliente tambien guarda su XP", async () => {
    // La rama no calificable escribe por otro camino: `completaEnCliente`.
    await postear({
      moduleId: "modulo-demo",
      exerciseId: "ej-js",
      exerciseType: "code-completion",
      score: 100,
      userAnswer: "function sumar(a, b) { return a + b; }",
    });

    expect(progresoDe("ej-js")).toMatchObject({ completed: true, xpEarned: 20 });
  });

  /**
   * EL CONTROL QUE PRUEBA QUE NO SE ARREGLO DE MAS.
   *
   * `xpEarned: isCompleted ? maxXP : 0` -- sin `wasAlreadyCompleted` -- pasa
   * los cuatro casos de arriba y le BORRA el XP a un ejercicio ya ganado en
   * cuanto el alumno lo reabre y falla. Igual que `completed`, el XP no se
   * des-otorga: los dos campos salen del mismo booleano.
   */
  it("un fallo POSTERIOR a completar no le borra el XP ya ganado", async () => {
    const ok = { moduleId: "modulo-demo", exerciseId: "ej-quiz", exerciseType: "quiz", score: 0, userAnswer: "b" };
    await postear(ok);
    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, xpEarned: 20 });

    await postear({ ...ok, userAnswer: "a" });

    expect(progresoDe("ej-quiz")).toMatchObject({ completed: true, xpEarned: 20 });
    expect(db.usuario.xp).toBe(20);
  });

  it("NINGUN registro queda con XP y sin completitud, sea cual sea la mezcla", async () => {
    // La invariante entera sobre una secuencia mixta, en vez de caso por caso:
    // un fallo, un parcial, un acierto y un reintento fallido.
    await postear({ moduleId: "modulo-demo", exerciseId: "ej-quiz", exerciseType: "quiz", score: 100, userAnswer: "a" });
    await postear({ moduleId: "modulo-demo", exerciseId: "ej-drag", exerciseType: "drag-drop", score: 100, userAnswer: { d1: "z1", d2: "z2", d3: "z1", d4: "z1" } });
    await postear({ moduleId: "modulo-demo", exerciseId: "ej-js", exerciseType: "code-completion", score: 100, userAnswer: "ok" });
    await postear({ moduleId: "modulo-demo", exerciseId: "ej-js", exerciseType: "code-completion", score: 10, userAnswer: "roto" });

    expect(db.progreso).toHaveLength(3);
    for (const p of db.progreso) {
      if (!p.completed) expect(p.xpEarned).toBe(0);
    }

    // Y el saldo del usuario coincide con lo que dicen los registros, que es lo
    // que el leaderboard suma.
    const sumaRegistros = db.progreso.reduce((t, p) => t + (p.xpEarned as number), 0);
    expect(db.usuario.xp).toBe(sumaRegistros);
  });
});
