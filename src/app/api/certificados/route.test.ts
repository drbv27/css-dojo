import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Los certificados del alumno.
 *
 * Lo que este archivo guarda es lo que la ruta NO hace: no acepta que le digan
 * de quien leer, y no vuelve a calcular nada.
 */

const estado = {
  sesion: null as { id: string; role: string } | null,
  pedidosA: [] as string[],
};

vi.mock("@/lib/auth", () => ({ getSession: async () => estado.sesion }));
vi.mock("@/lib/db", () => ({ default: async () => {} }));

vi.mock("@/lib/certificados", () => ({
  certificadosDe: async (userId: string) => {
    estado.pedidosA.push(userId);
    return userId === "u1"
      ? [
          {
            dojo: "css",
            cohort: 2,
            modulos: ["box-model", "flexbox"],
            ejerciciosPorModulo: { "box-model": 8, flexbox: 9 },
            otorgadoEn: new Date("2026-08-29"),
            codigo: "CSS-C2-XXXX",
          },
        ]
      : [];
  },
}));

const { GET } = await import("./route");

const pedir = () => GET();

beforeEach(() => {
  estado.sesion = null;
  estado.pedidosA = [];
});

describe("GET /api/certificados: quien puede leerlo", () => {
  it("sin sesion, 401 y NO se lee nada", async () => {
    const res = await pedir();

    expect(res.status).toBe(401);
    expect(estado.pedidosA).toEqual([]);
  });

  it("un alumno logueado si", async () => {
    estado.sesion = { id: "u1", role: "student" };

    const res = await pedir();

    expect(res.status).toBe(200);
    expect((await res.json()).certificados).toHaveLength(1);
  });
});

describe("GET /api/certificados: de quien lee", () => {
  it("NO PUEDE leer de quien: el handler no recibe el pedido", async () => {
    // EL CASO QUE IMPORTA, y se guarda por la FIRMA y no por la conducta.
    // Un certificado lleva el camino congelado de una persona; dejar que el
    // pedido nombre a otro convertiria un registro personal en un directorio de
    // la cohorte. Ignorar un parametro es una decision que alguien puede
    // revertir sin darse cuenta; NO RECIBIR el pedido no se revierte por
    // descuido, hay que cambiarle la firma a la funcion.
    expect(GET.length).toBe(0);

    estado.sesion = { id: "u1", role: "student" };
    await pedir();

    expect(estado.pedidosA).toEqual(["u1"]);
  });

  it("un alumno sin certificados recibe una lista vacia, no un error", async () => {
    // El estado normal de casi todos: todavia no completaron la ruta. No es un
    // fallo y la vista tiene que poder decirlo.
    estado.sesion = { id: "u2", role: "student" };

    const res = await pedir();

    expect(res.status).toBe(200);
    expect((await res.json()).certificados).toEqual([]);
  });

  it("un profesor lee LOS SUYOS, no los de la cohorte", async () => {
    // Para el roster esta /api/teacher/certificados, que si mira el rol.
    estado.sesion = { id: "t1", role: "teacher" };

    await pedir();

    expect(estado.pedidosA).toEqual(["t1"]);
  });
});
