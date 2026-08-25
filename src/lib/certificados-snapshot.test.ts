import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * THE SNAPSHOT. This is the whole reason the `Certificate` model stores what it
 * certified instead of a reference to today's curriculum.
 *
 * The reason is not hypothetical and it is not in the future: on 2026-08-25,
 * commit 6822485 added two exercises to `unidades-css` — a REQUIRED module — to
 * teach `dvh`/`svh`/`lvh` properly. The required CSS path moved from 166 to 168
 * exercises in an ordinary content commit, before a single certificate existed.
 * The mini-challenge rollout will do the same thing on purpose, repeatedly.
 *
 * So the curriculum in this file is MUTABLE on purpose: every test here awards
 * a certificate, then changes the curriculum underneath it, then reads the
 * certificate back. A reader that recomputes cannot survive that, which is
 * exactly what the positive control at the bottom demonstrates.
 */

type Mod = {
  slug: string;
  dojo: string;
  nivel?: "obligatorio" | "profundizacion";
  exercises: { id: string }[];
};

const curriculum: { modulos: Mod[] } = { modulos: [] };
const db = {
  cohort: 2,
  habilitados: [] as string[],
  progreso: [] as { moduleId: string; exerciseId: string }[],
  certificados: [] as Record<string, unknown>[],
};

vi.mock("@/data/modules", () => ({
  get ALL_MODULES() {
    return curriculum.modulos;
  },
}));

vi.mock("@/lib/moduleVisibility", () => ({
  cohorteDe: async () => db.cohort,
  slugsHabilitadosParaCohorte: async () => db.habilitados,
}));

vi.mock("@/lib/models/Progress", () => ({
  default: {
    find: (q: Record<string, unknown>) => ({
      select: () => ({
        lean: async () =>
          db.progreso.filter((p) =>
            (q.moduleId as { $in: string[] }).$in.includes(p.moduleId),
          ),
      }),
    }),
  },
}));

vi.mock("@/lib/models/Certificate", () => ({
  default: {
    findOne: (q: { userId: string; dojo: string }) => ({
      lean: async () =>
        db.certificados.find((c) => c.userId === q.userId && c.dojo === q.dojo) ?? null,
    }),
    create: async (doc: Record<string, unknown>) => {
      const clave = (c: Record<string, unknown>) => `${c.userId}|${c.dojo}`;
      if (db.certificados.some((c) => clave(c) === clave(doc))) {
        // Mirrors the unique index on {userId, dojo}.
        throw new Error("E11000 duplicate key");
      }
      // Stored by value, like a real write: later mutation of the caller's
      // object must not reach the record.
      db.certificados.push(JSON.parse(JSON.stringify(doc)));
      return doc;
    },
  },
}));

const { otorgar, leerCertificado } = await import("./certificados");

/** Two required modules, one optional. `box-model` is the one that will grow. */
const curriculumInicial = (): Mod[] => [
  { slug: "box-model", dojo: "css", nivel: "obligatorio", exercises: [{ id: "b1" }, { id: "b2" }] },
  { slug: "flexbox", dojo: "css", nivel: "obligatorio", exercises: [{ id: "f1" }] },
  { slug: "sass-avanzado", dojo: "css", nivel: "profundizacion", exercises: [{ id: "s1" }] },
];

beforeEach(() => {
  curriculum.modulos = curriculumInicial();
  db.cohort = 2;
  db.habilitados = ["box-model", "flexbox", "sass-avanzado"];
  db.progreso = [
    { moduleId: "box-model", exerciseId: "b1" },
    { moduleId: "box-model", exerciseId: "b2" },
    { moduleId: "flexbox", exerciseId: "f1" },
  ];
  db.certificados = [];
});

describe("otorgar", () => {
  it("congela los modulos exigidos y el conteo de ejercicios de cada uno", async () => {
    const r = await otorgar("alumno", "css");

    expect(r.otorgado).toBe(true);
    if (!r.otorgado) return;
    expect(r.nuevo).toBe(true);
    expect(r.certificado.cohort).toBe(2);
    expect(r.certificado.modulos).toEqual(["box-model", "flexbox"]);
    expect(r.certificado.ejerciciosPorModulo).toEqual({ "box-model": 2, flexbox: 1 });
    expect(r.certificado.codigo).toMatch(/^CSS-C2-[A-Z2-9]{8}$/);
  });

  it("no otorga a quien no es elegible, y dice que le falta", async () => {
    db.progreso = db.progreso.filter((p) => p.exerciseId !== "b2");

    const r = await otorgar("alumno", "css");

    expect(r.otorgado).toBe(false);
    if (r.otorgado) return;
    expect(r.motivo).toBe("no-elegible");
    expect(db.certificados).toHaveLength(0);
  });

  it("no exige los opcionales: el certificado no los nombra", async () => {
    const r = await otorgar("alumno", "css");
    expect(r.otorgado && r.certificado.modulos).not.toContain("sass-avanzado");
  });
});

describe("el snapshot sobrevive a que cambie el curriculum", () => {
  it("agregar ejercicios a un modulo exigido NO cambia el certificado ya emitido", async () => {
    const emitido = await otorgar("alumno", "css");
    expect(emitido.otorgado).toBe(true);

    // Exactly what commit 6822485 did to `unidades-css`, which is required.
    curriculum.modulos[0].exercises.push({ id: "b3" }, { id: "b4" });

    const leido = await leerCertificado("alumno", "css");

    expect(leido).not.toBeNull();
    expect(leido!.ejerciciosPorModulo).toEqual({ "box-model": 2, flexbox: 1 });
    // NOT 4. The student earned this against the two that existed.
    expect(leido!.ejerciciosPorModulo["box-model"]).toBe(2);
  });

  it("reclasificar un modulo exigido NO cambia el certificado ya emitido", async () => {
    await otorgar("alumno", "css");

    curriculum.modulos[1].nivel = "profundizacion";

    const leido = await leerCertificado("alumno", "css");

    expect(leido!.modulos).toEqual(["box-model", "flexbox"]);
    expect(leido!.modulos).toContain("flexbox");
  });

  it("apagar un modulo para la cohorte NO cambia el certificado ya emitido", async () => {
    await otorgar("alumno", "css");

    db.habilitados = ["box-model"];

    const leido = await leerCertificado("alumno", "css");

    expect(leido!.modulos).toEqual(["box-model", "flexbox"]);
  });

  it("borrar el progreso del alumno NO invalida el certificado ya emitido", async () => {
    await otorgar("alumno", "css");

    db.progreso = [];

    const leido = await leerCertificado("alumno", "css");

    expect(leido).not.toBeNull();
    expect(leido!.modulos).toEqual(["box-model", "flexbox"]);
  });
});

describe("un certificado por alumno y por ruta", () => {
  it("un segundo otorgamiento no crea duplicado y devuelve el mismo documento", async () => {
    const primero = await otorgar("alumno", "css");
    const segundo = await otorgar("alumno", "css");

    expect(db.certificados).toHaveLength(1);
    expect(segundo.otorgado).toBe(true);
    if (!segundo.otorgado || !primero.otorgado) return;
    expect(segundo.nuevo).toBe(false);
    expect(segundo.certificado.codigo).toBe(primero.certificado.codigo);
  });

  it("un segundo otorgamiento DESPUES de que crezca el modulo devuelve el conteo viejo", async () => {
    // `design.md` said a second award "is an update of the record". This is why
    // it is not: an update here would silently move the certificate from 2 to 4
    // exercises, which is precisely what the snapshot exists to prevent.
    await otorgar("alumno", "css");
    curriculum.modulos[0].exercises.push({ id: "b3" }, { id: "b4" });
    db.progreso.push({ moduleId: "box-model", exerciseId: "b3" });
    db.progreso.push({ moduleId: "box-model", exerciseId: "b4" });

    const segundo = await otorgar("alumno", "css");

    expect(segundo.otorgado && segundo.certificado.ejerciciosPorModulo).toEqual({
      "box-model": 2,
      flexbox: 1,
    });
    expect(db.certificados).toHaveLength(1);
  });

  it("otro alumno tiene su propio certificado", async () => {
    await otorgar("alumno", "css");
    await otorgar("otro", "css");
    expect(db.certificados).toHaveLength(2);
  });

  it("sin certificado, el lector devuelve null en vez de inventar uno", async () => {
    expect(await leerCertificado("nadie", "css")).toBeNull();
  });
});
