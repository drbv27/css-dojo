import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The teacher's certificate roster.
 *
 * What this file guards is NOT the eligibility rule -- that lives in
 * `certificados-elegibilidad.test.ts` and this module calls the same pure
 * function. What it guards is the two things the roster adds: that it reads in
 * BATCHES instead of once per student, and that it separates "this student is
 * behind" from "the course has not got there".
 */

const db = {
  lecturas: [] as string[],
  alumnos: [] as Record<string, unknown>[],
  settings: [] as { slug: string; cohort: number }[],
  progreso: [] as { userId: string; moduleId: string; exerciseId: string }[],
  certificados: [] as { userId: string }[],
};

const registra = <T,>(nombre: string, filas: T[]) => {
  db.lecturas.push(nombre);
  return { select: () => ({ lean: async () => filas }) };
};

vi.mock("@/lib/models/User", () => ({
  default: { find: () => registra("User", db.alumnos) },
}));
vi.mock("@/lib/models/Progress", () => ({
  default: { find: () => registra("Progress", db.progreso) },
}));
vi.mock("@/lib/models/ModuleSettings", () => ({
  default: { find: () => registra("ModuleSettings", db.settings) },
}));
vi.mock("@/lib/models/Certificate", () => ({
  default: { find: () => registra("Certificate", db.certificados) },
}));

const ej = (...ids: string[]) => ids.map((id) => ({ id }));

vi.mock("@/data/modules", () => ({
  ALL_MODULES: [
    { slug: "box-model", dojo: "css", nivel: "obligatorio", exercises: ej("b1", "b2") },
    { slug: "flexbox", dojo: "css", nivel: "obligatorio", exercises: ej("f1") },
    { slug: "sass", dojo: "css", nivel: "profundizacion", exercises: ej("s1") },
    // `js` queda SIN clasificar a proposito: es la ruta que no certifica.
    { slug: "js-intro", dojo: "js", exercises: ej("j1") },
  ],
}));

const { panelDeCertificados } = await import("./certificados-panel");

const alumno = (id: string, nombre: string, cohort = 2) => ({
  _id: id,
  name: nombre,
  email: `${id}@x.test`,
  cohort,
});

const hizo = (userId: string, moduleId: string, ...ids: string[]) =>
  ids.map((exerciseId) => ({ userId, moduleId, exerciseId }));

beforeEach(() => {
  db.lecturas = [];
  db.alumnos = [];
  db.settings = [];
  db.progreso = [];
  db.certificados = [];
});

describe("panel de certificados: lee en lote, no una vez por alumno", () => {
  it("CUATRO lecturas para veinte alumnos, no ochenta", async () => {
    db.alumnos = Array.from({ length: 20 }, (_, i) => alumno(`u${i}`, `Alumno ${i}`));
    db.settings = [{ slug: "box-model", cohort: 2 }];

    await panelDeCertificados("css");

    expect(db.lecturas).toEqual(["User", "ModuleSettings", "Progress", "Certificate"]);
  });

  it("una ruta que no certifica no toca la base", async () => {
    // Corta ANTES de leer nada: el roster de una ruta sin clasificar no
    // responde ninguna pregunta, asi que leerlo seria trabajo tirado.
    const panel = await panelDeCertificados("js");

    expect(panel.certificable).toBe(false);
    expect(db.lecturas).toEqual([]);
  });

  it("sin alumnos no sigue leyendo, y no es un panel roto", async () => {
    const panel = await panelDeCertificados("css");

    expect(db.lecturas).toEqual(["User"]);
    expect(panel.certificable && panel.filas).toEqual([]);
    // El denominador se informa igual: cero alumnos no es cero exigencia.
    expect(panel.certificable && panel.exigidos).toBe(3);
  });
});

describe("panel de certificados: que dice de cada alumno", () => {
  it("quien hizo TODO lo exigido puede recibirlo", async () => {
    db.alumnos = [alumno("u1", "Ana")];
    db.settings = [{ slug: "box-model", cohort: 2 }, { slug: "flexbox", cohort: 2 }];
    db.progreso = [...hizo("u1", "box-model", "b1", "b2"), ...hizo("u1", "flexbox", "f1")];

    const panel = await panelDeCertificados("css");
    const fila = panel.certificable ? panel.filas[0] : null;

    expect(fila?.elegibilidad.elegible).toBe(true);
    expect(fila?.faltan).toBe(0);
    expect(fila?.exigidos).toBe(3);
  });

  it("un opcional NO se exige: quien no lo hizo igual puede recibirlo", async () => {
    // Ana hizo los dos obligatorios y NO hizo `sass`, que es opcional.
    //
    // Una version anterior de este test le hacia hacer `sass` y miraba que
    // `faltan` no se moviera. Era VACUO: con los opcionales exigidos por error,
    // `sass` pasaba a contar Y ella lo tenia hecho, asi que el numero daba
    // igual y el control positivo se quedaba verde. Lo que distingue es el
    // opcional SIN hacer.
    db.alumnos = [alumno("u1", "Ana")];
    db.settings = [{ slug: "box-model", cohort: 2 }, { slug: "flexbox", cohort: 2 }];
    db.progreso = [...hizo("u1", "box-model", "b1", "b2"), ...hizo("u1", "flexbox", "f1")];

    const panel = await panelDeCertificados("css");

    expect(panel.certificable && panel.filas[0].elegibilidad.elegible).toBe(true);
    expect(panel.certificable && panel.filas[0].faltan).toBe(0);
    expect(panel.certificable && panel.filas[0].exigidos).toBe(3);
  });

  it("SEPARA 'va atrasado' de 'el curso no llego'", async () => {
    // Los dos deben `flexbox`. A Ana se lo abrieron y no lo hizo; a Beto no.
    // Es la distincion que decide si hablas con el alumno o con el calendario.
    db.alumnos = [alumno("u1", "Ana", 2), alumno("u2", "Beto", 3)];
    db.settings = [
      { slug: "box-model", cohort: 2 },
      { slug: "flexbox", cohort: 2 },
      { slug: "box-model", cohort: 3 },
    ];
    db.progreso = [
      ...hizo("u1", "box-model", "b1", "b2"),
      ...hizo("u2", "box-model", "b1", "b2"),
    ];

    const panel = await panelDeCertificados("css");
    const ana = panel.certificable && panel.filas.find((f) => f.nombre === "Ana");
    const beto = panel.certificable && panel.filas.find((f) => f.nombre === "Beto");

    expect(ana && ana.faltan).toBe(1);
    expect(ana && ana.aunNoHabilitados).toEqual([]);

    expect(beto && beto.faltan).toBe(1);
    expect(beto && beto.aunNoHabilitados).toEqual(["flexbox"]);
  });

  it("cada cohorte lee SU set habilitado, no el de la primera", async () => {
    // Si el panel resolviera los habilitados una sola vez y se los aplicara a
    // todos, Beto -cohorte 3- heredaria lo abierto para la 2 y la columna
    // diria que va atrasado cuando el curso no llego.
    //
    // Con UN SOLO alumno este test era VACUO: su cohorte era tambien la
    // primera, asi que heredar "la de la primera cohorte" daba el mismo
    // resultado y el control positivo pasaba. Hacen falta DOS cohortes, y hay
    // que mirar la que NO es la primera.
    db.alumnos = [alumno("u1", "Ana", 2), alumno("u2", "Beto", 3)];
    db.settings = [
      { slug: "box-model", cohort: 2 },
      { slug: "flexbox", cohort: 2 },
      // La cohorte 3 no tiene NADA abierto.
    ];
    db.progreso = [];

    const panel = await panelDeCertificados("css");
    const beto = panel.certificable && panel.filas.find((f) => f.nombre === "Beto");

    expect(beto && beto.aunNoHabilitados).toEqual(["box-model", "flexbox"]);
  });

  it("marca a quien ya lo tiene", async () => {
    db.alumnos = [alumno("u1", "Ana")];
    db.settings = [{ slug: "box-model", cohort: 2 }];
    db.certificados = [{ userId: "u1" }];

    const panel = await panelDeCertificados("css");

    expect(panel.certificable && panel.filas[0].yaCertificado).toBe(true);
  });
});

describe("panel de certificados: los titulares", () => {
  it("'pueden recibirlo' EXCLUYE a quien ya lo tiene", async () => {
    // El defecto que se vio en el navegador y ningun test cazaba: el titular
    // contaba a los ya certificados, asi que prometia trabajo que no existe.
    // El profe abria esperando dos personas a quienes otorgar y encontraba una.
    db.alumnos = [alumno("u1", "Ana"), alumno("u2", "Beto")];
    db.settings = [{ slug: "box-model", cohort: 2 }, { slug: "flexbox", cohort: 2 }];
    db.progreso = [
      ...hizo("u1", "box-model", "b1", "b2"),
      ...hizo("u1", "flexbox", "f1"),
      ...hizo("u2", "box-model", "b1", "b2"),
      ...hizo("u2", "flexbox", "f1"),
    ];
    db.certificados = [{ userId: "u2" }];

    const panel = await panelDeCertificados("css");

    // Los DOS son elegibles por la regla...
    expect(panel.certificable && panel.filas.every((f) => f.elegibilidad.elegible)).toBe(true);
    // ...pero sobre uno solo hay algo que hacer.
    expect(panel.certificable && panel.resumen).toEqual({
      alumnos: 2,
      puedenRecibirlo: 1,
      yaLoTienen: 1,
    });
  });

  it("sin alumnos los titulares son ceros, no un panel roto", async () => {
    const panel = await panelDeCertificados("css");

    expect(panel.certificable && panel.resumen).toEqual({
      alumnos: 0,
      puedenRecibirlo: 0,
      yaLoTienen: 0,
    });
  });
});

describe("panel de certificados: el orden", () => {
  it("elegibles primero, despues por distancia, y los empates por nombre", async () => {
    db.alumnos = [
      alumno("u1", "Zoe"), // le falta 1
      alumno("u2", "Ana"), // completa
      alumno("u3", "Beto"), // le faltan 3
      alumno("u4", "Carla"), // le falta 1 -- empata con Zoe
    ];
    db.settings = [{ slug: "box-model", cohort: 2 }, { slug: "flexbox", cohort: 2 }];
    db.progreso = [
      ...hizo("u1", "box-model", "b1", "b2"),
      ...hizo("u2", "box-model", "b1", "b2"),
      ...hizo("u2", "flexbox", "f1"),
      ...hizo("u4", "box-model", "b1", "b2"),
    ];

    const panel = await panelDeCertificados("css");

    expect(panel.certificable && panel.filas.map((f) => f.nombre)).toEqual([
      "Ana",
      "Carla",
      "Zoe",
      "Beto",
    ]);
  });
});
