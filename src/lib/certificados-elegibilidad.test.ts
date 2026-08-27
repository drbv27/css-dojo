import { describe, it, expect } from "vitest";
import { elegibilidadDe, modulosObligatoriosDe } from "./certificados";
import type { ModuloExigible } from "./certificados";
import type { DojoType } from "@/types";

/**
 * Eligibility: the certificate is earned by completing EVERY required module of
 * the track. Not every required module that happens to be open this week.
 *
 * ## The rule this file replaced, and why it was wrong
 *
 * Eligibility used to be intersected with the cohort's enabled set, justified
 * by "0 of 35 students qualify under a global rule; the best nine reach 17 of
 * 19". That measurement was over cohort 1 — a cohort whose course ENDED with
 * two required modules never opened, and which the instructor has declared out
 * of scope. No cohort-2 student can reach 17 of 19, because eight of the
 * nineteen have never been enabled for them.
 *
 * So the scoped rule fixed a problem belonging to a cohort nobody certifies,
 * and in exchange it certified people mid-course: the strongest student of
 * cohort 2 qualified for a CSS completion certificate having never seen
 * `flexbox`, `css-grid` or `media-queries`.
 *
 * The enabled set is still read — to say WHY a module is missing. Never to
 * shrink what is required.
 */

const ej = (...ids: string[]) => ids.map((id) => ({ id }));

/** Three required CSS modules and one optional one. */
const CURRICULUM: ModuloExigible[] = [
  { slug: "box-model", dojo: "css", nivel: "obligatorio", exercises: ej("b1", "b2") },
  { slug: "flexbox", dojo: "css", nivel: "obligatorio", exercises: ej("f1") },
  { slug: "tailwind-css", dojo: "css", nivel: "obligatorio", exercises: ej("t1") },
  { slug: "sass-avanzado", dojo: "css", nivel: "profundizacion", exercises: ej("s1") },
];

const LOS_TRES = ["box-model", "flexbox", "tailwind-css"];
const TODO_LO_EXIGIDO = { "box-model": ["b1", "b2"], flexbox: ["f1"], "tailwind-css": ["t1"] };

const hechos = (m: Record<string, string[]>) =>
  new Map(Object.entries(m).map(([slug, ids]) => [slug, new Set(ids)]));

const evaluar = (
  habilitados: string[],
  completados: Record<string, string[]>,
  dojo: DojoType = "css",
) => elegibilidadDe(CURRICULUM, dojo, 2, habilitados, hechos(completados));

describe("modulos obligatorios: TODOS los del track, sin intersectar con nada", () => {
  it("son los obligatorios del track, en orden de curriculum", () => {
    expect(modulosObligatoriosDe(CURRICULUM, "css")).toEqual(LOS_TRES);
  });

  it("un opcional NUNCA se exige", () => {
    expect(modulosObligatoriosDe(CURRICULUM, "css")).not.toContain("sass-avanzado");
  });

  it("no depende de lo que la cohorte tenga habilitado", () => {
    // The function no longer takes an enabled set at all. This test exists so
    // that reintroducing the intersection is a visible change, not a quiet one.
    expect(modulosObligatoriosDe.length).toBe(2);
  });
});

describe("elegibilidad: los cuatro escenarios que deciden el feature", () => {
  it("ESCENARIO 1 -- un obligatorio que la cohorte AUN NO tiene habilitado SIGUE exigiendose", () => {
    // THE REVERSAL. Under the old rule this student was eligible. He has done
    // everything that is open, and he has not finished the course: `tailwind-css`
    // has not been taught yet.
    const r = evaluar(["box-model", "flexbox"], {
      "box-model": ["b1", "b2"],
      flexbox: ["f1"],
    });

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("no deberia calificar a mitad del curso");
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(r.modulos).toEqual(LOS_TRES);
    expect(r.faltantes).toEqual({ "tailwind-css": ["t1"] });
    // And it says WHY, so the teacher view can tell "this student is behind"
    // apart from "the course has not got there".
    expect(r.aunNoHabilitados).toEqual(["tailwind-css"]);
  });

  it("ESCENARIO 2 -- UN solo ejercicio sin hacer bloquea el certificado", () => {
    const r = evaluar(LOS_TRES, { ...TODO_LO_EXIGIDO, "box-model": ["b1"] });

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(r.faltantes).toEqual({ "box-model": ["b2"] });
    // The module IS open, so this gap is the student's, not the calendar's.
    expect(r.aunNoHabilitados).toEqual([]);
  });

  it("ESCENARIO 3 -- un track sin ningun obligatorio NO es elegible por vacuidad", () => {
    const soloOpcionales: ModuloExigible[] = [
      { slug: "a", dojo: "html", nivel: "profundizacion", exercises: ej("a1") },
    ];
    const r = elegibilidadDe(soloOpcionales, "html", 2, ["a"], new Map());

    expect(r.elegible).toBe(false);
    if (r.elegible) return;
    expect(r.motivo).toBe("sin-obligatorios");
  });

  it("ESCENARIO 4 -- los opcionales nunca se exigen: sin tocar uno solo, califica igual", () => {
    const r = evaluar([...LOS_TRES, "sass-avanzado"], TODO_LO_EXIGIDO);

    expect(r.elegible).toBe(true);
    if (!r.elegible) return;
    expect(r.modulos).toEqual(LOS_TRES);
    expect(r.modulos).not.toContain("sass-avanzado");
    expect(r.ejerciciosPorModulo).toEqual({ "box-model": 2, flexbox: 1, "tailwind-css": 1 });
  });
});

describe("elegibilidad: control positivo y trampas de conteo", () => {
  /**
   * CONTROL POSITIVO (tarea 3.4). Start from a fixture that IS eligible, remove
   * exactly one completed exercise, and require the verdict to flip.
   */
  it("quitar UN ejercicio completado a un alumno elegible da vuelta el veredicto", () => {
    const antes = evaluar(LOS_TRES, TODO_LO_EXIGIDO);
    expect(antes.elegible).toBe(true);

    const despues = evaluar(LOS_TRES, { ...TODO_LO_EXIGIDO, "tailwind-css": [] });

    expect(despues.elegible).toBe(false);
    if (despues.elegible) throw new Error("esperaba NO elegible");
    if (despues.motivo !== "faltan-ejercicios") throw new Error(despues.motivo);
    expect(despues.faltantes).toEqual({ "tailwind-css": ["t1"] });
  });

  /**
   * CONTROL POSITIVO DE LA REGLA NUEVA. Habilitar el modulo que faltaba no debe
   * cambiar el veredicto: si lo cambiara, la intersección con la cohorte
   * seguiría viva en algún lado.
   */
  it("habilitar o no un modulo NO cambia el veredicto, solo el porque", () => {
    const progreso = { "box-model": ["b1", "b2"], flexbox: ["f1"] };

    const cerrado = evaluar(["box-model", "flexbox"], progreso);
    const abierto = evaluar(LOS_TRES, progreso);

    expect(cerrado.elegible).toBe(false);
    expect(abierto.elegible).toBe(false);
    if (cerrado.elegible || abierto.elegible) return;
    if (cerrado.motivo !== "faltan-ejercicios" || abierto.motivo !== "faltan-ejercicios") return;

    // Same requirement, same gap. Only the explanation moves.
    expect(cerrado.modulos).toEqual(abierto.modulos);
    expect(cerrado.faltantes).toEqual(abierto.faltantes);
    expect(cerrado.aunNoHabilitados).toEqual(["tailwind-css"]);
    expect(abierto.aunNoHabilitados).toEqual([]);
  });

  it("no alcanza con el CONTEO: dos filas de un ejercicio viejo no pagan uno real", () => {
    // A renamed or deleted exercise leaves stale `Progress` rows behind. If this
    // were `completados.size >= exercises.length`, those rows would buy a
    // certificate for work never done.
    const r = evaluar(LOS_TRES, {
      ...TODO_LO_EXIGIDO,
      "box-model": ["b1", "b-viejo", "b-mas-viejo"],
    });

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("esperaba NO elegible");
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(r.faltantes).toEqual({ "box-model": ["b2"] });
  });

  it("un track no certificable no es elegible por mas progreso que tenga el alumno", () => {
    const conSinClasificar: ModuloExigible[] = [
      ...CURRICULUM,
      { slug: "css-nuevo", dojo: "css", exercises: ej("n1") },
    ];
    const r = elegibilidadDe(conSinClasificar, "css", 2, LOS_TRES, hechos(TODO_LO_EXIGIDO));

    expect(r.elegible).toBe(false);
    if (r.elegible) return;
    expect(r.motivo).toBe("track-no-certificable");
  });

  it("si todos los obligatorios tienen CERO ejercicios, no certifica", () => {
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
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(r.faltantes).toEqual({ "tailwind-css": ["t1"] });
  });

  /**
   * EL CASO REAL QUE ORIGINO EL CAMBIO, como test de regresion.
   *
   * Medido en produccion el 2026-08-25: el mejor alumno de la cohorte 2 tenia
   * completos los 11 obligatorios de CSS habilitados y CERO en los 8 que
   * todavia no se abrieron. La regla vieja lo declaraba elegible para un
   * certificado de finalizacion de CSS sin haber visto flexbox, grid ni media
   * queries.
   */
  it("el mejor alumno a mitad de curso NO califica, y se reporta que le falta media carrera", () => {
    const r = evaluar(["box-model"], { "box-model": ["b1", "b2"] });

    expect(r.elegible).toBe(false);
    if (r.elegible) throw new Error("un certificado a mitad de curso es un parcial con sello");
    if (r.motivo !== "faltan-ejercicios") throw new Error(r.motivo);
    expect(Object.keys(r.faltantes).sort()).toEqual(["flexbox", "tailwind-css"]);
    expect(r.aunNoHabilitados.sort()).toEqual(["flexbox", "tailwind-css"]);
  });
});
