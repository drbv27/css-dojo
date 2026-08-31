import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * `certificadosDe`: lo que promete es lo que NO hace.
 *
 * Un certificado es una afirmacion sobre un estado pasado. Si la lectura
 * volviera a derivarlo del curriculum de hoy, un modulo que crecio reescribiria
 * en silencio lo que al alumno se le dijo que gano.
 */

const db = { lecturas: [] as string[], certificados: [] as Record<string, unknown>[] };

vi.mock("@/lib/models/Certificate", () => ({
  default: {
    find: () => {
      db.lecturas.push("Certificate");
      return { lean: async () => db.certificados };
    },
    findOne: () => {
      db.lecturas.push("Certificate");
      return { lean: async () => db.certificados[0] ?? null };
    },
  },
}));
vi.mock("@/lib/models/Progress", () => ({
  default: {
    find: () => {
      db.lecturas.push("Progress");
      return { select: () => ({ lean: async () => [] }) };
    },
  },
}));

const { certificadosDe } = await import("./certificados");

const cert = (dojo: string, fecha: string, conteo: unknown) => ({
  dojo,
  cohort: 2,
  modulos: ["box-model", "flexbox"],
  ejerciciosPorModulo: conteo,
  otorgadoEn: new Date(fecha),
  codigo: dojo.toUpperCase() + "-C2-XXXX",
});

beforeEach(() => {
  db.lecturas = [];
  db.certificados = [];
});

describe("certificadosDe: lee lo otorgado y nada mas", () => {
  it("UNA lectura, y solo a Certificate", async () => {
    db.certificados = [cert("css", "2026-08-29", { "box-model": 8, flexbox: 9 })];

    await certificadosDe("u1");

    // Si aparece "Progress" aca, la lectura dejo de ser una foto del pasado.
    expect(db.lecturas).toEqual(["Certificate"]);
  });

  it("normaliza el Map que devuelve Mongoose a un objeto", async () => {
    // Un documento hidratado devuelve Map y uno .lean() un objeto plano. Sin
    // normalizar, la vista recibe dos formas distintas del mismo dato.
    db.certificados = [
      cert("css", "2026-08-29", new Map([["box-model", 8], ["flexbox", 9]])),
    ];

    const [c] = await certificadosDe("u1");

    expect(c.ejerciciosPorModulo).toEqual({ "box-model": 8, flexbox: 9 });
  });

  it("el mas nuevo primero", async () => {
    db.certificados = [
      cert("css", "2026-01-10", {}),
      cert("html", "2026-08-29", {}),
      cert("js", "2026-05-01", {}),
    ];

    expect((await certificadosDe("u1")).map((c) => c.dojo)).toEqual(["html", "js", "css"]);
  });

  it("sin certificados devuelve lista vacia, no null", async () => {
    // La vista mapea sobre esto; un null seria un error en la cara del alumno
    // que todavia no completo ninguna ruta, que son casi todos.
    expect(await certificadosDe("u1")).toEqual([]);
  });
});
