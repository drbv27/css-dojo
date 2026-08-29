import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The guard on the roster. It carries every student's name, email, cohort and
 * exactly how far behind they are -- so who may read it is not a detail.
 */

const estado = {
  sesion: null as { id: string; role: string } | null,
  panelPedidoPara: [] as string[],
  otorgadosPedidos: [] as { userId: string; dojo: string }[],
};

vi.mock("@/lib/auth", () => ({ getSession: async () => estado.sesion }));
vi.mock("@/lib/db", () => ({ default: async () => {} }));
vi.mock("@/lib/certificados-panel", () => ({
  panelDeCertificados: async (dojo: string) => {
    estado.panelPedidoPara.push(dojo);
    return {
      certificable: true,
      dojo,
      modulos: [],
      exigidos: 0,
      filas: [],
      resumen: { alumnos: 0, puedenRecibirlo: 0, yaLoTienen: 0 },
    };
  },
}));

vi.mock("@/lib/certificados", () => ({
  otorgar: async (userId: string, dojo: string) => {
    estado.otorgadosPedidos.push({ userId, dojo });
    if (userId === "no-elegible") {
      return {
        otorgado: false,
        motivo: "no-elegible",
        detalle: { elegible: false, motivo: "faltan-ejercicios", faltantes: { flexbox: ["f1"] } },
      };
    }
    return {
      otorgado: true,
      nuevo: userId !== "ya-tiene",
      certificado: { dojo, cohort: 2, modulos: [], ejerciciosPorModulo: {}, otorgadoEn: new Date(), codigo: "CSS-C2-XXXX" },
    };
  },
}));

const { GET, POST } = await import("./route");

const otorgarPost = (body: unknown) =>
  POST(
    new Request("http://x/api/teacher/certificados", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );

const pedir = (qs = "") =>
  GET(new Request(`http://x/api/teacher/certificados${qs}`));

beforeEach(() => {
  estado.sesion = null;
  estado.panelPedidoPara = [];
  estado.otorgadosPedidos = [];
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

describe("POST /api/teacher/certificados: quien puede otorgar", () => {
  it("sin sesion, 403 y NO se otorga nada", async () => {
    const res = await otorgarPost({ userId: "u1", dojo: "css" });

    expect(res.status).toBe(403);
    expect(estado.otorgadosPedidos).toEqual([]);
  });

  it("un ALUMNO no puede otorgarse el certificado a si mismo", async () => {
    // El caso que importa de verdad: la credencial la firma el instructor, y
    // un POST desde la consola de un alumno logueado no debe emitirla.
    estado.sesion = { id: "u1", role: "student" };

    const res = await otorgarPost({ userId: "u1", dojo: "css" });

    expect(res.status).toBe(403);
    expect(estado.otorgadosPedidos).toEqual([]);
  });
});

describe("POST /api/teacher/certificados: que hace", () => {
  beforeEach(() => {
    estado.sesion = { id: "t1", role: "teacher" };
  });

  it("otorga al alumno y a la ruta pedidos", async () => {
    const res = await otorgarPost({ userId: "u1", dojo: "css" });

    expect(res.status).toBe(200);
    expect(estado.otorgadosPedidos).toEqual([{ userId: "u1", dojo: "css" }]);
    expect((await res.json()).certificado.codigo).toBe("CSS-C2-XXXX");
  });

  it("un alumno NO elegible se rechaza con 409 y CON el motivo", async () => {
    // 409 y no 400: la peticion esta bien formada, el estado del alumno es el
    // que no la permite. Y el motivo viaja entero para que la vista diga QUE le
    // falta, en vez de "no se pudo".
    const res = await otorgarPost({ userId: "no-elegible", dojo: "css" });

    expect(res.status).toBe(409);
    const cuerpo = await res.json();
    expect(cuerpo.motivo).toBe("no-elegible");
    expect(cuerpo.detalle.faltantes).toEqual({ flexbox: ["f1"] });
  });

  it("otorgar de nuevo NO duplica: devuelve el que ya existe", async () => {
    const res = await otorgarPost({ userId: "ya-tiene", dojo: "css" });

    expect(res.status).toBe(200);
    expect((await res.json()).nuevo).toBe(false);
  });

  it("sin alumno es 400, y no se otorga nada", async () => {
    const res = await otorgarPost({ dojo: "css" });

    expect(res.status).toBe(400);
    expect(estado.otorgadosPedidos).toEqual([]);
  });

  it("una ruta inventada es 400, y no se otorga nada", async () => {
    // Una credencial de una ruta que no existe no es un error del alumno: es
    // una peticion que no se debe ejecutar.
    const res = await otorgarPost({ userId: "u1", dojo: "cobol" });

    expect(res.status).toBe(400);
    expect(estado.otorgadosPedidos).toEqual([]);
  });

  it("un cuerpo que no es JSON es 400, no un 500", async () => {
    estado.sesion = { id: "t1", role: "teacher" };
    const res = await POST(
      new Request("http://x/api/teacher/certificados", { method: "POST", body: "{{{" }),
    );

    expect(res.status).toBe(400);
    expect(estado.otorgadosPedidos).toEqual([]);
  });
});
