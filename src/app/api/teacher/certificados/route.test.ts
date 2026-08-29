import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The guard on the roster. It carries every student's name, email, cohort and
 * exactly how far behind they are -- so who may read it is not a detail.
 */

const estado = {
  sesion: null as { id: string; role: string } | null,
  panelPedidoPara: [] as string[],
};

vi.mock("@/lib/auth", () => ({ getSession: async () => estado.sesion }));
vi.mock("@/lib/db", () => ({ default: async () => {} }));
vi.mock("@/lib/certificados-panel", () => ({
  panelDeCertificados: async (dojo: string) => {
    estado.panelPedidoPara.push(dojo);
    return { certificable: true, dojo, modulos: [], exigidos: 0, filas: [] };
  },
}));

const { GET } = await import("./route");

const pedir = (qs = "") =>
  GET(new Request(`http://x/api/teacher/certificados${qs}`));

beforeEach(() => {
  estado.sesion = null;
  estado.panelPedidoPara = [];
});

describe("GET /api/teacher/certificados: quien puede leerlo", () => {
  it("sin sesion, 403 y NO se calcula nada", async () => {
    const res = await pedir();

    expect(res.status).toBe(403);
    expect(estado.panelPedidoPara).toEqual([]);
  });

  it("un ALUMNO logueado tampoco, y tampoco se calcula nada", async () => {
    // El caso que importa: no es un anonimo, es alguien que ya paso el login y
    // podria leer cuanto le falta a cada companiero suyo.
    estado.sesion = { id: "u1", role: "student" };

    const res = await pedir();

    expect(res.status).toBe(403);
    expect(estado.panelPedidoPara).toEqual([]);
  });

  it("el profesor si", async () => {
    estado.sesion = { id: "t1", role: "teacher" };

    const res = await pedir();

    expect(res.status).toBe(200);
    expect((await res.json()).panel.certificable).toBe(true);
  });
});

describe("GET /api/teacher/certificados: que ruta calcula", () => {
  beforeEach(() => {
    estado.sesion = { id: "t1", role: "teacher" };
  });

  it("sin parametro, css", async () => {
    await pedir();

    expect(estado.panelPedidoPara).toEqual(["css"]);
  });

  it("respeta la ruta pedida", async () => {
    await pedir("?dojo=react-eco");

    expect(estado.panelPedidoPara).toEqual(["react-eco"]);
  });

  it("una ruta inventada es un 400, NO un panel vacio", async () => {
    // Un panel vacio se leeria como "esta cohorte no tiene alumnos", que es una
    // respuesta distinta y falsa.
    const res = await pedir("?dojo=cobol");

    expect(res.status).toBe(400);
    expect(estado.panelPedidoPara).toEqual([]);
  });
});
