import { describe, it, expect } from "vitest";
import { elegibilidadDe, modulosExigidosDe } from "./certificados";
import type { ModuloExigible } from "./certificados";
import type { DojoType } from "@/types";

/**
 * Eligibility: the four scenarios that decide this feature, plus the positive
 * control that proves the tests are reading exercise completion and not
 * something that merely correlates with it.
 *
 * Everything here runs over fixtures rather than the real curriculum, because
 * the cases that matter — a required module NOT enabled for the cohort, a
 * cohort with nothing enabled — cannot be expressed by production content.
 */

const ej = (...ids: string[]) => ids.map((id) => ({ id }));

/** Four CSS modules: three required, one optional. */
const CURRICULUM: ModuloExigible[] = [
  { slug: "box-model", dojo: "css", nivel: "obligatorio", exercises: ej("b1", "b2") },
  { slug: "flexbox", dojo: "css", nivel: "obligatorio", exercises: ej("f1") },
  { slug: "tailwind-css", dojo: "css", nivel: "obligatorio", exercises: ej("t1") },
  { slug: "sass-avanzado", dojo: "css", nivel: "profundizacion", exercises: ej("s1") },
];

const hechos = (m: Record<string, string[]>) =>
  new Map(Object.entries(m).map(([slug, ids]) => [slug, new Set(ids)]));

/** Every exercise of the three required modules, and nothing else. */
const TODO_LO_EXIGIDO = { "box-model": ["b1", "b2"], flexbox: ["f1"], "tailwind-css": ["t1"] };

const LOS_TRES = ["box-model", "flexbox", "tailwind-css"];

const evaluar = (
  habilitados: string[],
  completados: Record<string, string[]>,
  dojo: DojoType = "css",
) => elegibilidadDe(CURRICULUM, dojo, 2, habilitados, hechos(completados));

describe("modulos exigidos: obligatorios INTERSECTADOS con lo habilitado en la cohorte", () => {
  it("solo los obligatorios habilitados, en orden de curriculum", () => {
    expect(
      modulosExigidosDe(CURRICULUM, "css", ["sass-avanzado", "flexbox", "box-model"]),
    ).toEqual(["box-model", "flexbox"]);
  });

  it("un obligatorio que la cohorte no tiene habilitado NO se exige", () => {
    // The measured reason this rule exists: with a global rule 0 of 35 students
    // qualify, and the two modules they all miss are `tailwind-css` and
    // `proyecto-cv-css`. A student cannot complete what was never shown.
    expect(modulosExigidosDe(CURRICULUM, "css", ["box-model", "flexbox"])).not.toContain(
      "tailwind-css",
    );
  });

  it("un opcional habilitado NUNCA se exige", () => {
    expect(modulosExigidosDe(CURRICULUM, "css", ["sass-avanzado"])).toEqual([]);
  });
});

describe("elegibilidad: los cuatro escenarios que deciden el feature", () => {
  it("ESCENARIO 1 -- un obligatorio no habilitado para la cohorte no se exige, y el alumno califica sin el", () => {
    const r = evaluar(["box-model", "flexbox"], {
      "box-model": ["b1", "b2"],
      flexbox: ["f1"],
    });
    expect(r.elegible).toBe(true);
    if (!r.elegible) return;
    expect(r.modulos).toEqual(["box-model", "flexbox"]);
    expect(r.modulos).not.toContain("tailwind-css");
    // The snapshot the certificate will freeze, computed here so the award
    // cannot write a different requirement than the one it just verified.
    expect(r.ejerciciosPorModulo).toEqual({ "box-model": 2, flexbox: 1 });
  });

  it("ESCENARIO 2 -- UN solo ejercicio sin hacer bloquea el certificado", () => {
    const r = evaluar(LOS_TRES, { ...TODO_LO_EXIGIDO, "box-model": ["b1"] });
    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(`motivo inesperado: ${r.motivo}`);
    // Names the missing exercise, so the answer is actionable and not just "no".
    expect(r.faltantes).toEqual({ "box-model": ["b2"] });
  });

  it("ESCENARIO 3 -- una cohorte sin ningun obligatorio habilitado NO es elegible por vacuidad", () => {
    // Trivially true over an empty set is the failure mode this guards: a
    // brand-new cohort starts with everything blocked, and would otherwise
    // graduate on day zero.
    const r = evaluar(["sass-avanzado"], {});
    expect(r.elegible).toBe(false);
    if (r.elegible) return;
    expect(r.motivo).toBe("sin-obligatorios-habilitados");
  });

  it("ESCENARIO 4 -- los opcionales nunca se exigen: sin tocar uno solo, califica igual", () => {
    const r = evaluar([...LOS_TRES, "sass-avanzado"], TODO_LO_EXIGIDO);
    expect(r.elegible).toBe(true);
    if (!r.elegible) return;
    expect(r.modulos).toEqual(LOS_TRES);
    expect(r.modulos).not.toContain("sass-avanzado");
  });
});

describe("elegibilidad: control positivo y trampas de conteo", () => {
  /**
   * CONTROL POSITIVO (tarea 3.4). Start from a fixture that IS eligible, remove
   * exactly one completed exercise, and require the verdict to flip.
   *
   * If it does not flip, the test above was reading something other than
   * exercise completion, and every green in this file means nothing.
   */
  it("quitar UN ejercicio completado a un alumno elegible da vuelta el veredicto", () => {
    const antes = evaluar(LOS_TRES, TODO_LO_EXIGIDO);
    expect(antes.elegible).toBe(true);

    const menosUno = { ...TODO_LO_EXIGIDO, "tailwind-css": [] as string[] };
    const despues = evaluar(LOS_TRES, menosUno);

    expect(despues.elegible).toBe(false);
    if (despues.elegible) throw new Error("esperaba NO elegible");
    if (despues.motivo !== "faltan-ejercicios") throw new Error(`motivo: ${despues.motivo}`);
    expect(despues.faltantes).toEqual({ "tailwind-css": ["t1"] });
  });

  it("no alcanza con el CONTEO: dos filas de un ejercicio viejo no pagan uno real", () => {
    // A renamed or deleted exercise leaves stale `Progress` rows behind. If
    // this were `completados.size >= exercises.length`, those rows would buy a
    // certificate for work never done.
    const r = evaluar(LOS_TRES, {
      ...TODO_LO_EXIGIDO,
      "box-model": ["b1", "b-viejo", "b-mas-viejo"],
    });
    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(`motivo inesperado: ${r.motivo}`);
    expect(r.faltantes).toEqual({ "box-model": ["b2"] });
  });

  it("un track no certificable no es elegible por mas progreso que tenga el alumno", () => {
    const conSinClasificar: ModuloExigible[] = [
      ...CURRICULUM,
      { slug: "css-nuevo", dojo: "css", exercises: ej("n1") },
    ];
    const r = elegibilidadDe(
      conSinClasificar,
      "css",
      2,
      LOS_TRES,
      hechos(TODO_LO_EXIGIDO),
    );
    expect(r.elegible).toBe(false);
    if (r.elegible) return;
    expect(r.motivo).toBe("track-no-certificable");
  });

  it("si todos los obligatorios exigidos tienen CERO ejercicios, no certifica", () => {
    // The same vacuity trap as an empty track, one level down: "completed every
    // exercise" is true for a student who has done nothing.
    const vacios: ModuloExigible[] = [
      { slug: "a", dojo: "html", nivel: "obligatorio", exercises: [] },
    ];
    const r = elegibilidadDe(vacios, "html", 2, ["a"], new Map());
    expect(r.elegible).toBe(false);
    if (r.elegible) return;
    expect(r.motivo).toBe("sin-ejercicios-exigidos");
  });

  it("el progreso de OTRO modulo no paga el de un exigido", () => {
    const r = evaluar(LOS_TRES, {
      "box-model": ["b1", "b2"],
      flexbox: ["f1"],
      "sass-avanzado": ["s1", "t1"],
    });
    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(`motivo inesperado: ${r.motivo}`);
    expect(r.faltantes).toEqual({ "tailwind-css": ["t1"] });
  });
});
