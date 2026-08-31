import { describe, it, expect } from "vitest";
import { certificabilidadDe, esCertificable } from "./certificados";
import type { ModuloClasificable } from "./certificados";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

/**
 * The certifiability gate, tested in BOTH directions.
 *
 * One direction alone proves nothing here. A gate that only ever says "no"
 * passes every negative test while being broken, and a gate that only ever says
 * "yes" passes every positive one. The whole value of this rule is that it
 * moves, so the fixture tests at the bottom are what actually hold it up.
 */

describe("certificabilidad sobre el curriculum real", () => {
  it("CSS certifica, y devuelve sus 23 obligatorios", () => {
    const r = esCertificable("css");
    expect(r.certificable).toBe(true);
    if (!r.certificable) return;
    expect(r.obligatorios).toHaveLength(23);
    expect(r.obligatorios).toContain("box-model");
    expect(r.obligatorios).toContain("especificidad");
    // Enumerated, not counted: `tailwind-css` and `proyecto-cv-css` are the two
    // that no student reached in the production measurement, and they are
    // required by an explicit instructor decision. If either silently leaves
    // the list, the certificate quietly becomes easier.
    expect(r.obligatorios).toContain("tailwind-css");
    expect(r.obligatorios).toContain("proyecto-cv-css");
    expect(r.obligatorios).not.toContain("sass-avanzado");
  });

  /**
   * DELIBERATE, not pending. Each of these five tracks has to refuse, and it
   * has to report exactly its own modules — a gate reporting the wrong track's
   * count is a gate reading the wrong thing.
   */
  const SIN_CLASIFICAR: [DojoType, number][] = [
    ["html", 17],
    ["js", 29],
    ["react", 20],
    ["react-eco", 5],
    ["nextjs", 5],
  ];

  it.each(SIN_CLASIFICAR)("%s NO certifica, y reporta sus %i modulos sin clasificar", (dojo, n) => {
    const r = certificabilidadDe(ALL_MODULES, dojo);
    expect(r.certificable).toBe(false);
    if (r.certificable) return;
    expect(r.motivo).toBe("sin-clasificar");
    if (r.motivo !== "sin-clasificar") return;
    expect(r.sinClasificar).toHaveLength(n);
    // Every module of the track, not some of them: a partially classified
    // track must still refuse, and must still name what is missing.
    expect([...r.sinClasificar].sort()).toEqual(
      ALL_MODULES.filter((m) => m.dojo === dojo).map((m) => m.slug).sort(),
    );
  });

  it("ningun track distinto de CSS certifica hoy", () => {
    const certificables = (
      ["html", "css", "js", "react", "react-eco", "nextjs"] as DojoType[]
    ).filter((d) => esCertificable(d).certificable);
    expect(certificables).toEqual(["css"]);
  });
});

/**
 * FIXTURES. Small, hand-built module lists, because the real curriculum cannot
 * express the states this gate exists to reject.
 */
const mod = (
  slug: string,
  dojo: DojoType,
  nivel?: "obligatorio" | "profundizacion",
): ModuloClasificable => ({ slug, dojo, nivel });

describe("certificabilidad sobre fixtures: la compuerta se mueve", () => {
  const parcial: ModuloClasificable[] = [
    mod("a", "js", "obligatorio"),
    mod("b", "js"),
    mod("c", "js"),
    mod("z", "css", "obligatorio"),
  ];

  it("un track parcialmente clasificado se niega, y nombra los que faltan", () => {
    const r = certificabilidadDe(parcial, "js");
    expect(r).toEqual({
      certificable: false,
      motivo: "sin-clasificar",
      sinClasificar: ["b", "c"],
    });
  });

  /**
   * CONTROL POSITIVO (tarea 2.3). Classify ONE of the two missing modules and
   * the count has to drop by exactly one, while the track still refuses.
   *
   * This is the assertion that proves the gate is being read at all. Without
   * it, a `certificabilidadDe` hardcoded to `{certificable: false}` passes
   * every negative test in this file.
   */
  it("clasificar UN modulo baja el conteo en exactamente uno, y el track sigue sin certificar", () => {
    const antes = certificabilidadDe(parcial, "js");
    expect(antes.certificable).toBe(false);
    if (antes.certificable || antes.motivo !== "sin-clasificar") throw new Error("fixture rota");

    const conUnoMas = parcial.map((m) =>
      m.slug === "b" ? mod("b", "js", "profundizacion") : m,
    );
    const despues = certificabilidadDe(conUnoMas, "js");

    expect(despues.certificable).toBe(false);
    if (despues.certificable || despues.motivo !== "sin-clasificar") throw new Error();
    expect(despues.sinClasificar).toHaveLength(antes.sinClasificar.length - 1);
    expect(despues.sinClasificar).toEqual(["c"]);
  });

  it("clasificar el ultimo que faltaba abre la compuerta", () => {
    const completo = parcial.map((m) =>
      m.nivel === undefined ? mod(m.slug, m.dojo, "profundizacion") : m,
    );
    const r = certificabilidadDe(completo, "js");
    expect(r).toEqual({ certificable: true, obligatorios: ["a"] });
  });

  it("un modulo sin nivel NO entra en los obligatorios de un track que si certifica", () => {
    // The absence means "not classified", never "obligatorio". If this ever
    // flips, an undecided module joins the minimum path of a credential.
    const r = certificabilidadDe(
      [mod("a", "css", "obligatorio"), mod("b", "css", "profundizacion")],
      "css",
    );
    expect(r).toEqual({ certificable: true, obligatorios: ["a"] });
  });

  it("un track VACIO no certifica: 'todos declaran nivel' es cierto por vacuidad sobre cero modulos", () => {
    // A DojoType that ships before its content would otherwise be certifiable
    // and trivially completable at the same time.
    expect(certificabilidadDe(parcial, "nextjs")).toEqual({
      certificable: false,
      motivo: "track-vacio",
    });
  });

  it("un track donde todos son de profundizacion certifica con cero obligatorios", () => {
    // Certifiable is not the same as awardable. The empty required set is
    // rejected by eligibility, not here, and the two must not be conflated.
    const r = certificabilidadDe([mod("a", "html", "profundizacion")], "html");
    expect(r).toEqual({ certificable: true, obligatorios: [] });
  });
});
