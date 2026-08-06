import { describe, expect, it } from "vitest";
import type { JsBehaviorCase } from "@/types";
import {
  construirHarness,
  interpretarMensaje,
  puntuar,
  sonIguales,
  validarCasos,
  type MensajeCrudo,
} from "./jsBehavior";

/**
 * The harness is a string of source, so it would be easy to "test" it by
 * matching substrings. That proves nothing about whether it works.
 *
 * Instead these tests EXECUTE it. The harness body reads `self` as a free
 * variable, so wrapping it in a function with a `self` parameter shadows the
 * global and lets the test capture what it posts. That exercises the real path:
 * submission -> harness -> message -> interpretarMensaje -> puntuar, without
 * needing a worker.
 */
function ejecutarHarness(
  codigo: string,
  cases: JsBehaviorCase[],
  nonce = "n1"
): MensajeCrudo[] {
  const capturados: MensajeCrudo[] = [];
  const fuente = construirHarness(codigo, cases, nonce);
  const correr = new Function("self", fuente) as (s: {
    postMessage: (m: MensajeCrudo) => void;
  }) => void;
  correr({ postMessage: (m) => capturados.push(m) });
  return capturados;
}

/** The whole loop, the way the component will use it. */
function calificar(codigo: string, cases: JsBehaviorCase[]) {
  const mensajes = ejecutarHarness(codigo, cases);
  expect(mensajes).toHaveLength(1);
  const outcome = interpretarMensaje(mensajes[0], "n1", cases);
  expect(outcome).not.toBeNull();
  return { outcome: outcome!, puntaje: puntuar(outcome!) };
}

const SUMAR: JsBehaviorCase[] = [
  { call: "sumar(1, 2)", expect: 3 },
  { call: "sumar(-1, 1)", expect: 0 },
  { call: "sumar(0, 0)", expect: 0 },
];

describe("validarCasos", () => {
  it("acepta casos bien formados", () => {
    expect(validarCasos(SUMAR)).toEqual([]);
  });

  it("rechaza una lista vacia o que no es lista", () => {
    expect(validarCasos([])).toHaveLength(1);
    expect(validarCasos(null)).toHaveLength(1);
    expect(validarCasos("sumar(1,2)")).toHaveLength(1);
  });

  it("rechaza un `call` que no es una sola expresion", () => {
    // Estas se embeben dentro de un `return [...]`, asi que un `;` o una llave
    // rompe la lista y produciria un error de sintaxis dificil de rastrear.
    const razones = [
      { call: "sumar(1,2); otra()", expect: 3 },
      { call: "if (x) { y }", expect: 3 },
      { call: "sumar(1,2", expect: 3 },
      { call: "", expect: 3 },
    ].map((c) => validarCasos([c])[0]?.razon);

    expect(razones.every((r) => typeof r === "string" && r.length > 0)).toBe(true);
  });

  it("acepta un objeto literal como argumento", () => {
    // Encontrado escribiendo contenido real: la regla original prohibia toda
    // llave, asi que `totalCarrito([{ precio: 10 }])` quedaba invalido. Un
    // objeto como argumento es UNA expresion y es de lo mas comun.
    expect(validarCasos([{ call: "totalCarrito([{ precio: 10, cantidad: 2 }])", expect: 20 }])).toEqual([]);
  });

  it("sigue rechazando un statement, que no es una expresion", () => {
    // Las llaves ya no alcanzan para distinguirlo, asi que se mira la palabra
    // inicial. Un statement dentro de `return [...]` es un error de sintaxis.
    for (const call of ["if (x) { y }", "for (;;) {}", "return 1", "const a = 1"]) {
      expect(validarCasos([{ call, expect: 1 }]).length).toBeGreaterThan(0);
    }
  });

  it("exige `expect` explicito", () => {
    // Sin la clave no se distingue de `undefined`, y un caso sin expectativa no
    // puede fallar nunca: seria un ejercicio que siempre aprueba.
    expect(validarCasos([{ call: "sumar(1,2)" } as unknown as JsBehaviorCase])).toEqual([
      { indice: 0, razon: "falta `expect`" },
    ]);
  });

  it("rechaza un `expect` no serializable", () => {
    const problemas = validarCasos([
      { call: "sumar(1,2)", expect: () => 3 } as unknown as JsBehaviorCase,
    ]);
    expect(problemas).toHaveLength(1);
  });

  it("informa el indice del caso que falla, no solo que algo falla", () => {
    const problemas = validarCasos([
      { call: "sumar(1,2)", expect: 3 },
      { call: "malo;", expect: 0 },
    ]);
    expect(problemas.map((p) => p.indice)).toEqual([1]);
  });
});

describe("sonIguales", () => {
  it("compara estructuras por valor", () => {
    expect(sonIguales([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(sonIguales({ a: 1, b: [2] }, { a: 1, b: [2] })).toBe(true);
    expect(sonIguales({ b: [2], a: 1 }, { a: 1, b: [2] })).toBe(true);
  });

  it("no coacciona tipos", () => {
    expect(sonIguales(3, "3")).toBe(false);
    expect(sonIguales(0, false)).toBe(false);
    expect(sonIguales("", null)).toBe(false);
    expect(sonIguales(1, [1])).toBe(false);
  });

  it("un objeto no es igual a un primitivo", () => {
    // Este caso descubrio un agujero: sin el chequeo de `typeof` previo,
    // Object.keys(1) da [] igual que Object.keys({}), asi que dos "objetos" con
    // cero claves se comparaban iguales y sonIguales({}, 1) daba true. Los otros
    // casos de coaccion pasan por el guard de `typeof a !== "object"` y no
    // ejercitan esa linea.
    expect(sonIguales({}, 1)).toBe(false);
    expect(sonIguales(1, {})).toBe(false);
    expect(sonIguales({}, "")).toBe(false);
    expect(sonIguales([], 0)).toBe(false);
    expect(sonIguales({ a: 1 }, 1)).toBe(false);
  });

  it("distingue longitud y claves", () => {
    expect(sonIguales([1, 2], [1, 2, 3])).toBe(false);
    expect(sonIguales({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(sonIguales({ a: 1 }, { b: 1 })).toBe(false);
  });

  it("trata null y NaN sin sorpresas", () => {
    expect(sonIguales(null, null)).toBe(true);
    expect(sonIguales(null, {})).toBe(false);
    expect(sonIguales(NaN, NaN)).toBe(true);
  });
});

describe("puntuar", () => {
  it("da credito parcial redondeado", () => {
    const outcome = {
      kind: "ok" as const,
      cases: [{ kind: "pass" as const }, { kind: "pass" as const }, { kind: "fail" as const, observed: 1 }],
    };
    expect(puntuar(outcome)).toEqual({ score: 67, correct: false, fallidos: [2] });
  });

  it("da 100 solo si pasan todos", () => {
    expect(puntuar({ kind: "ok", cases: [{ kind: "pass" }, { kind: "pass" }] })).toEqual({
      score: 100,
      correct: true,
      fallidos: [],
    });
  });

  it("da 0 cuando no pasa ninguno", () => {
    const p = puntuar({ kind: "ok", cases: [{ kind: "fail", observed: 9 }] });
    expect(p).toEqual({ score: 0, correct: false, fallidos: [0] });
  });

  it("un fallo de run entero puntua 0, no parcial", () => {
    // Un error de sintaxis o un timeout no produjeron evidencia de que algo
    // funcione, que es distinto de fallar algunos casos.
    expect(puntuar({ kind: "syntax-error", message: "x" }).score).toBe(0);
    expect(puntuar({ kind: "timeout" }).score).toBe(0);
  });
});

describe("interpretarMensaje", () => {
  const caso: JsBehaviorCase[] = [{ call: "f()", expect: 1 }];
  const base = (resultado: unknown) =>
    ({ fuente: "js-behavior", nonce: "n1", resultado }) as unknown;

  it("ignora lo que no es suyo sin lanzar", () => {
    expect(interpretarMensaje(null, "n1", caso)).toBeNull();
    expect(interpretarMensaje("hola", "n1", caso)).toBeNull();
    expect(interpretarMensaje({ fuente: "otra-cosa" }, "n1", caso)).toBeNull();
    expect(interpretarMensaje(base({ kind: "ok", observaciones: [] }), "OTRO", caso)).toBeNull();
    expect(interpretarMensaje(base(undefined), "n1", caso)).toBeNull();
    expect(interpretarMensaje(base({ kind: "vaya" }), "n1", caso)).toBeNull();
  });

  it("descarta un run con distinta cantidad de observaciones", () => {
    // Emparejar observaciones con casos por indice solo es valido si son del
    // mismo run; si no coinciden, puntuar seria inventar.
    const dos = [
      { estado: "valor" as const, json: "1" },
      { estado: "valor" as const, json: "1" },
    ];
    expect(interpretarMensaje(base({ kind: "ok", observaciones: dos }), "n1", caso)).toBeNull();
  });

  it("pasa un error de sintaxis como fallo de run", () => {
    const outcome = interpretarMensaje(base({ kind: "syntax-error", message: "boom" }), "n1", caso);
    expect(outcome).toEqual({ kind: "syntax-error", message: "boom" });
  });

  it("no lanza con una observacion malformada", () => {
    const outcome = interpretarMensaje(
      base({ kind: "ok", observaciones: [{ estado: "valor" }] }),
      "n1",
      caso
    );
    expect(outcome).toEqual({ kind: "ok", cases: [{ kind: "runtime-error", message: "observacion malformada" }] });
  });
});

describe("el ciclo completo, ejecutando el harness", () => {
  it("una solucion correcta puntua 100", () => {
    const { puntaje } = calificar("function sumar(a, b) { return a + b; }", SUMAR);
    expect(puntaje).toEqual({ score: 100, correct: true, fallidos: [] });
  });

  it("una solucion con const/let tambien queda visible", () => {
    // Este es el caso que obligo a evaluar el codigo DENTRO del harness. Un
    // `const` en el tope de un script no es global, asi que con el codigo
    // inyectado como script hermano esto daria "sumar is not defined" mientras
    // funciona perfecto en la vista previa.
    const { puntaje } = calificar("const sumar = (a, b) => a + b;", SUMAR);
    expect(puntaje.score).toBe(100);
  });

  it("una solucion parcialmente correcta puntua parcial", () => {
    // Devuelve bien solo cuando el resultado es 0.
    const { puntaje } = calificar("function sumar(a, b) { return (a + b) === 0 ? 0 : 99; }", SUMAR);
    expect(puntaje.score).toBe(67);
    expect(puntaje.fallidos).toEqual([0]);
  });

  it("un error de sintaxis se reporta con el mensaje del motor", () => {
    const { outcome, puntaje } = calificar("function sumar(a, b) { return a + }", SUMAR);
    expect(outcome.kind).toBe("syntax-error");
    if (outcome.kind === "syntax-error") {
      expect(outcome.message.length).toBeGreaterThan(0);
    }
    expect(puntaje.score).toBe(0);
  });

  it("prosa que menciona la respuesta no aprueba nada", () => {
    // El defecto que el PR #5 saco de CSS y HTML: escribir la respuesta como
    // texto. Aca ni siquiera parsea.
    const { puntaje } = calificar("la funcion sumar devuelve a mas b", SUMAR);
    expect(puntaje.score).toBe(0);
  });

  it("un identificador que falta se distingue de una respuesta incorrecta", () => {
    const { outcome } = calificar("function restar(a, b) { return a - b; }", SUMAR);
    expect(outcome.kind).toBe("ok");
    if (outcome.kind === "ok") {
      expect(outcome.cases[0]).toEqual({ kind: "not-defined", identifier: "sumar" });
    }
  });

  it("una excepcion en un caso no impide puntuar los otros", () => {
    const cases: JsBehaviorCase[] = [
      { call: "dividir(6, 2)", expect: 3 },
      { call: "dividir(1, 0)", expect: 0 },
    ];
    const { outcome } = calificar(
      "function dividir(a, b) { if (b === 0) throw new Error('division por cero'); return a / b; }",
      cases
    );
    expect(outcome.kind).toBe("ok");
    if (outcome.kind === "ok") {
      expect(outcome.cases[0]).toEqual({ kind: "pass" });
      expect(outcome.cases[1].kind).toBe("runtime-error");
    }
  });

  it("devolver undefined es un resultado, no un fallo de serializacion", () => {
    // Encontrado escribiendo contenido real: `ultimo([])` devolviendo undefined
    // es la respuesta CORRECTA. JSON.stringify(undefined) da undefined, asi que
    // sin un estado propio se confundia con algo incomparable y ningun caso
    // podia esperarlo.
    const cases: JsBehaviorCase[] = [{ call: "ultimo([])", expect: undefined }];
    const { puntaje } = calificar("function ultimo(l) { return l[l.length - 1]; }", cases);
    expect(puntaje.score).toBe(100);
  });

  it("undefined no aprueba un caso que espera otra cosa", () => {
    const cases: JsBehaviorCase[] = [{ call: "ultimo([])", expect: null }];
    const { puntaje } = calificar("function ultimo(l) { return l[l.length - 1]; }", cases);
    expect(puntaje.score).toBe(0);
  });

  it("un valor no serializable se reporta como tal, sin romper el run", () => {
    const cases: JsBehaviorCase[] = [{ call: "dame()", expect: 1 }];
    const { outcome } = calificar("function dame() { return function () {}; }", cases);
    expect(outcome.kind).toBe("ok");
    if (outcome.kind === "ok") {
      expect(outcome.cases[0]).toEqual({ kind: "unserializable" });
    }
  });

  it("una estructura devuelta compara por valor", () => {
    const cases: JsBehaviorCase[] = [{ call: "pares([1,2,3,4])", expect: [2, 4] }];
    const { puntaje } = calificar("const pares = (a) => a.filter((n) => n % 2 === 0);", cases);
    expect(puntaje.score).toBe(100);
  });

  it("devolver un string donde se espera un numero NO aprueba", () => {
    const cases: JsBehaviorCase[] = [{ call: "sumar(1, 2)", expect: 3 }];
    const { puntaje } = calificar("const sumar = (a, b) => String(a + b);", cases);
    expect(puntaje.score).toBe(0);
  });

  it("un mensaje de un run superado se descarta por nonce", () => {
    const mensajes = ejecutarHarness("const sumar = (a, b) => a + b;", SUMAR, "viejo");
    expect(interpretarMensaje(mensajes[0], "nuevo", SUMAR)).toBeNull();
  });
});
