import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";
import {
  construirHarness,
  interpretarMensaje,
  puntuar,
  validarCasos,
  type MensajeCrudo,
} from "@/lib/jsBehavior";
import type { Exercise, JsBehaviorCase } from "@/types";

/**
 * Data guard for js-behavior exercises. Task 3.1 of
 * openspec/changes/js-behavior-validator, written BEFORE any content.
 *
 * The load-bearing assertion RUNS each reference solution against its own cases.
 * It does NOT compare the cases to themselves, and that distinction is the whole
 * point: "the answer scores 100 against itself" is tautological and cannot
 * detect an expectation nobody can satisfy. This project already paid for that
 * lesson -- a malformed `targetCSS` made an exercise demand something no valid
 * CSS could produce, and a correct submission scored 33% while every test
 * passed. See the swallowed-property guard in validacion-curriculum.test.ts.
 *
 * The same shape as validacion-html.test.ts, which carries a reference solution
 * for all 20 HTML exercises for exactly this reason.
 */

/** Runs a submission against cases the way the app does, minus the worker. */
function calificar(codigo: string, cases: JsBehaviorCase[]) {
  const nonce = "guard";
  const mensajes: MensajeCrudo[] = [];
  // The harness reads `self` as a free variable, so a `self` parameter shadows
  // the global and captures what it posts. Same technique as jsBehavior.test.ts.
  const correr = new Function("self", construirHarness(codigo, cases, nonce)) as (s: {
    postMessage: (m: MensajeCrudo) => void;
  }) => void;
  correr({ postMessage: (m) => mensajes.push(m) });

  if (mensajes.length !== 1) return null;
  const outcome = interpretarMensaje(mensajes[0], nonce, cases);
  return outcome ? puntuar(outcome) : null;
}

const ejerciciosJs: { mod: string; ex: Exercise }[] = ALL_MODULES.flatMap((m) =>
  m.exercises
    .filter((e) => e.validation.type === "js-behavior")
    .map((e) => ({ mod: m.slug, ex: e }))
);

describe("el evaluador del guarda funciona", () => {
  // Without this the guard would pass vacuously today: there are no
  // js-behavior exercises yet, so every loop below iterates nothing. These two
  // cases prove the machinery can tell right from wrong, so the loops are
  // trustworthy the moment content arrives.
  const CASOS: JsBehaviorCase[] = [
    { call: "sumar(2, 3)", expect: 5 },
    { call: "sumar(-1, 1)", expect: 0 },
  ];

  it("una solucion correcta puntua 100", () => {
    expect(calificar("const sumar = (a, b) => a + b;", CASOS)?.score).toBe(100);
  });

  it("una solucion incorrecta NO puntua 100", () => {
    expect(calificar("const sumar = (a, b) => a - b;", CASOS)?.score).not.toBe(100);
  });

  it("un caso que nadie puede satisfacer se detecta", () => {
    // Exactamente el defecto que la autocomparacion no puede ver: la expectativa
    // esta mal escrita, asi que ni la solucion correcta aprueba.
    const casosRotos: JsBehaviorCase[] = [{ call: "sumar(2, 3)", expect: "5" }];
    expect(calificar("const sumar = (a, b) => a + b;", casosRotos)?.score).not.toBe(100);
  });
});

describe("ejercicios js-behavior", () => {
  it("cada uno declara casos bien formados", () => {
    const malos = ejerciciosJs
      .map(({ mod, ex }) => ({ id: `${mod}/${ex.id}`, problemas: validarCasos(ex.validation.cases) }))
      .filter((r) => r.problemas.length > 0)
      .map((r) => `${r.id}: ${r.problemas.map((p) => `[${p.indice}] ${p.razon}`).join("; ")}`);

    expect(malos).toEqual([]);
  });

  it("cada uno trae una solucion de referencia", () => {
    const sinSolucion = ejerciciosJs
      .filter(({ ex }) => !ex.referenceSolution || ex.referenceSolution.trim() === "")
      .map(({ mod, ex }) => `${mod}/${ex.id}`);

    expect(sinSolucion).toEqual([]);
  });

  it("CADA solucion de referencia puntua 100 corriendo contra sus casos", () => {
    // La assertion que importa. Si un caso quedo mal escrito, esto falla ANTES
    // de que el ejercicio llegue a un alumno que va a creer que el error es suyo.
    const fallidos: string[] = [];

    for (const { mod, ex } of ejerciciosJs) {
      const cases = ex.validation.cases ?? [];
      const puntaje = calificar(ex.referenceSolution ?? "", cases);
      if (!puntaje) {
        fallidos.push(`${mod}/${ex.id}: la solucion de referencia no se pudo evaluar`);
      } else if (puntaje.score !== 100) {
        const cuales = puntaje.fallidos.map((i) => cases[i]?.call ?? i).join(", ");
        fallidos.push(`${mod}/${ex.id}: puntua ${puntaje.score}, falla en ${cuales}`);
      }
    }

    expect(fallidos).toEqual([]);
  });

  it("ninguno usa validacion debil", () => {
    // `includes` fue removido de CSS y HTML tras encontrar 61 ejercicios que se
    // aprobaban escribiendo la respuesta como prosa. No vuelve por la puerta de JS.
    const debiles = ALL_MODULES.flatMap((m) =>
      m.exercises
        .filter((e) => e.referenceSolution && ["includes", "includes-ordered", "regex"].includes(e.validation.type))
        .map((e) => `${m.slug}/${e.id}`)
    );

    expect(debiles).toEqual([]);
  });
});
