import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";
import { calificar, cssEsperadoDe, esRetoIntegrador } from "@/lib/calificar";

/**
 * Los retos integradores del curriculum.
 *
 * Un reto es el ejercicio que cierra un modulo haciendo que el alumno use
 * varios de sus conceptos en UNA sola tarea, y es el que mas peso tiene: vale
 * el doble de XP y cuenta para el certificado.
 */

const RETOS = ALL_MODULES.flatMap((m) =>
  m.exercises.filter(esRetoIntegrador).map((e) => ({ modulo: m.slug, ejercicio: e })),
);

/** El registro del rollout. Una tanda no puede entrar sin quedar anotada. */
const MODULOS_CON_RETO = ["box-model"];

describe("retos integradores", () => {
  it("los modulos con reto son exactamente los esperados", () => {
    // Cuando entre la tanda B/C/D este test falla y obliga a declararlo aca,
    // en vez de dejar el rollout derivar sin registro.
    expect(RETOS.map((r) => r.modulo).sort()).toEqual([...MODULOS_CON_RETO].sort());
  });

  it("ningun modulo lleva mas de un reto", () => {
    const porModulo = new Map<string, string[]>();
    for (const { modulo, ejercicio } of RETOS) {
      porModulo.set(modulo, [...(porModulo.get(modulo) ?? []), ejercicio.id]);
    }
    const duplicados = [...porModulo]
      .filter(([, ids]) => ids.length > 1)
      .map(([m, ids]) => `${m}: ${ids.join(", ")}`);
    expect(duplicados).toEqual([]);
  });

  it("todo reto tiene AL MENOS DOS pasos", () => {
    // Con un solo paso es un ejercicio comun con una insignia puesta, y cobra
    // el doble de XP por ello.
    const flacos = RETOS.filter((r) => (r.ejercicio.retoPasos?.length ?? 0) < 2).map(
      (r) => `${r.modulo}/${r.ejercicio.id} (${r.ejercicio.retoPasos?.length ?? 0} pasos)`,
    );
    expect(flacos).toEqual([]);
  });

  it("ningun reto declara targetCSS a mano: se deriva de sus pasos", () => {
    // Dos fuentes de verdad del mismo hecho derivan, y la derivacion se ve como
    // un preview que muestra una cosa y una correccion que exige otra.
    const aMano = RETOS.filter((r) => r.ejercicio.targetCSS !== undefined).map(
      (r) => `${r.modulo}/${r.ejercicio.id}`,
    );
    expect(aMano).toEqual([]);
  });

  it("POSITIVO: la solucion de referencia de cada reto saca 100", () => {
    const fallan: string[] = [];
    for (const { modulo, ejercicio } of RETOS) {
      const sol = ejercicio.referenceSolution;
      if (sol === undefined) {
        fallan.push(`${modulo}/${ejercicio.id}: sin referenceSolution`);
        continue;
      }
      const r = calificar(ejercicio, sol);
      if (!r.calificable || r.score !== 100) {
        fallan.push(
          `${modulo}/${ejercicio.id}: ` +
            (r.calificable ? `score ${r.score}` : `no calificable: ${r.motivo}`),
        );
      }
    }
    expect(fallan).toEqual([]);
  });

  it("NEGATIVO: una respuesta equivocada no saca 100", () => {
    // Sin esta mitad el guard de arriba es vacuo, exactamente como lo era para
    // los 93 drag-drop bajo la rama `exact`.
    const regalados = RETOS.filter((r) => {
      const c = calificar(r.ejercicio, "p { color: red; }");
      return c.calificable && c.score === 100;
    }).map((r) => `${r.modulo}/${r.ejercicio.id}`);
    expect(regalados).toEqual([]);
  });

  /**
   * EL CONTROL QUE DECIDE EL FEATURE (tarea A.9).
   *
   * La ruta completa un ejercicio con `score >= 70`. Si un reto puntuara la
   * fraccion de pasos cumplidos, tres de cuatro serian 75 y COMPLETARIA con un
   * paso entero salteado -- en el ejercicio cuyo punto es hacer las partes
   * juntas, y que cuenta para el certificado.
   *
   * Por eso un reto puntua 100 o 0, nunca una fraccion.
   */
  it("A.9 — con TODOS los pasos menos uno, un reto saca 0 y no 75", () => {
    const malos: string[] = [];

    for (const { modulo, ejercicio } of RETOS) {
      const pasos = ejercicio.retoPasos!;
      const casiTodo = pasos.slice(0, -1).map((p) => p.esperado).join("\n");
      const r = calificar(ejercicio, casiTodo);

      if (!r.calificable) {
        malos.push(`${modulo}/${ejercicio.id}: no calificable`);
        continue;
      }
      if (r.score !== 0) {
        malos.push(
          `${modulo}/${ejercicio.id}: con ${pasos.length - 1} de ${pasos.length} pasos ` +
            `saca ${r.score}${r.score >= 70 ? " y COMPLETARIA" : ""}`,
        );
      }
    }

    expect(malos).toEqual([]);
  });

  it("el veredicto viene POR PASO, no solo global", () => {
    // Decirle "esta mal" a quien hizo tres de cuatro no le sirve de nada.
    for (const { modulo, ejercicio } of RETOS) {
      const pasos = ejercicio.retoPasos!;
      const primero = pasos[0].esperado;
      const r = calificar(ejercicio, primero);

      if (!r.calificable || !("pasos" in r)) {
        throw new Error(`${modulo}/${ejercicio.id}: el reto no devolvio detalle por paso`);
      }
      expect(r.pasos).toHaveLength(pasos.length);
      expect(r.pasos[0].cumplido).toBe(true);
      expect(r.pasos.slice(1).every((p) => !p.cumplido)).toBe(true);
      // Y la instruccion viaja con el veredicto, para poder mostrarla.
      expect(r.pasos[0].instruccion).toBe(pasos[0].instruccion);
    }
  });

  it("el CSS esperado se deriva de los pasos, y el preview lee lo mismo", () => {
    for (const { modulo, ejercicio } of RETOS) {
      const derivado = cssEsperadoDe(ejercicio);
      for (const paso of ejercicio.retoPasos!) {
        if (!derivado.includes(paso.esperado)) {
          throw new Error(`${modulo}/${ejercicio.id}: el paso "${paso.instruccion}" no esta en el CSS derivado`);
        }
      }
    }
  });

  it("un reto vale mas XP que cualquier otro ejercicio de su modulo", () => {
    // Un integrador que paga lo mismo que un quiz de una linea es el peor
    // negocio del modulo, y simplemente no se hace.
    const baratos: string[] = [];
    for (const { modulo, ejercicio } of RETOS) {
      const mod = ALL_MODULES.find((m) => m.slug === modulo)!;
      const maxOtros = Math.max(
        ...mod.exercises.filter((e) => e.id !== ejercicio.id).map((e) => e.xpReward),
      );
      if (ejercicio.xpReward <= maxOtros) {
        baratos.push(`${modulo}/${ejercicio.id}: ${ejercicio.xpReward} XP vs ${maxOtros} del resto`);
      }
    }
    expect(baratos).toEqual([]);
  });
});
