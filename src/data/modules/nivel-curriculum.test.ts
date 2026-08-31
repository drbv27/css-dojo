import { describe, it, expect } from "vitest";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

/**
 * Guards the CURRICULUM LEVEL (`nivel`) that the certificate feature reads.
 *
 * `nivel` is optional in the type, and its absence means "not classified" --
 * never "obligatorio". The safety of that default lives in the certifiability
 * gate, which refuses to certify a track until EVERY one of its modules
 * declares a level. These tests pin both halves of that contract.
 *
 * They enumerate by SLUG, never by count. A count that matches with the wrong
 * composition is not a match: swapping `flexbox` for `transforms` keeps 19 and
 * 11 intact while changing what a certificate means.
 *
 * The classification itself was decided with the instructor on 2026-08-24
 * against a written criterion (required if the next track assumes it, if a
 * junior fails a real task without it, if it is a concept rather than a
 * lookup, or if it blocks another required module). Three calls go against the
 * pure criterion on purpose: `tailwind-css` and `pseudo-elementos` were
 * promoted to required, and `math-functions` stays optional even though it
 * sits at order 7, so the required path jumps from 6 to 8.
 */

const OBLIGATORIOS_CSS = [
  "que-es-css",
  "selectores",
  "propiedades-basicas",
  "box-model",
  "unidades-css",
  "dimensiones",
  "tipografias",
  "selectores-descendientes",
  "pseudo-clases",
  "pseudo-elementos",
  "especificidad",
  "float-display",
  "posicionamiento",
  "flexbox",
  "css-grid",
  "variables-css",
  "media-queries",
  "tailwind-css",
  "proyecto-cv-css",
  // css-track-expansion-2, 2026-08-31: los cuatro de la Fase 2 del plan.
  // Obligatorios por el criterio del 2026-08-24, no por preferencia.
  "overflow",
  "tipografia-web",
  "herencia-valores-globales",
  "imagenes-y-medios",
];

const PROFUNDIZACION_CSS = [
  "math-functions",
  "advanced-text",
  "attribute-selectors",
  "propiedades-logicas",
  "lists-and-tables",
  "shadows-gradients-filters",
  "transforms",
  "transiciones-animaciones",
  "sass-fundamentos",
  "sass-avanzado",
  "bootstrap-5",
];

/**
 * The five tracks that are deliberately NOT classified, with the module count
 * each one has today. `react-eco` belongs here like any other: it is a live
 * track in the DojoSwitcher, so leaving it out of this list would let it slip
 * past the tripwire below.
 */
const TRACKS_SIN_CLASIFICAR: Record<string, number> = {
  html: 17,
  js: 29,
  react: 20,
  "react-eco": 5,
  nextjs: 5,
};

const porDojo = (dojo: DojoType) => ALL_MODULES.filter((m) => m.dojo === dojo);
const slugs = (ms: { slug: string }[]) => ms.map((m) => m.slug).sort();

describe("nivel del curriculum -- track CSS", () => {
  it("los 34 modulos de CSS declaran nivel", () => {
    const sinNivel = slugs(porDojo("css").filter((m) => m.nivel === undefined));
    // Enumerated, not counted: a failure has to name the module that is
    // missing its level, otherwise the next person re-measures by hand.
    expect(sinNivel).toEqual([]);
    expect(porDojo("css")).toHaveLength(34);
  });

  it("los 23 obligatorios son exactamente estos, por slug", () => {
    const encontrados = slugs(porDojo("css").filter((m) => m.nivel === "obligatorio"));
    expect(encontrados).toEqual([...OBLIGATORIOS_CSS].sort());
  });

  it("los 11 de profundizacion son exactamente estos, por slug", () => {
    const encontrados = slugs(
      porDojo("css").filter((m) => m.nivel === "profundizacion"),
    );
    expect(encontrados).toEqual([...PROFUNDIZACION_CSS].sort());
  });

  it("las dos listas particionan el track: ni solapan ni dejan huecos", () => {
    // Without this, both lists above could pass while a module appears twice
    // in the source of truth of this very test.
    const solapados = OBLIGATORIOS_CSS.filter((s) => PROFUNDIZACION_CSS.includes(s));
    expect(solapados).toEqual([]);
    expect([...OBLIGATORIOS_CSS, ...PROFUNDIZACION_CSS].sort()).toEqual(
      slugs(porDojo("css")),
    );
  });
});

describe("nivel del curriculum -- TRIPWIRE de los otros tracks", () => {
  /**
   * DELIBERATE. The other five tracks are unclassified because nobody decided
   * their required path yet, and the gate turns that into a refusal to
   * certify rather than a silent minimum path.
   *
   * When someone classifies a second track, THIS TEST FAILS. That is the
   * point: it forces the change to be deliberate, and it forces whoever makes
   * it to look at the gate and at the certificate snapshot before shipping.
   */
  it("ningun modulo fuera de CSS declara nivel todavia", () => {
    const clasificadosFuera = ALL_MODULES.filter(
      (m) => m.dojo !== "css" && m.nivel !== undefined,
    ).map((m) => `${m.dojo}/${m.slug}`);
    expect(clasificadosFuera).toEqual([]);
  });

  it("cada track sin clasificar conserva su conteo completo de modulos", () => {
    // A count that drifts here means modules were added or moved between
    // tracks, and the certifiability tests read the same numbers.
    const medido = Object.fromEntries(
      Object.keys(TRACKS_SIN_CLASIFICAR).map((d) => [d, porDojo(d as DojoType).length]),
    );
    expect(medido).toEqual(TRACKS_SIN_CLASIFICAR);
  });

  it("los seis tracks del repo estan contemplados: CSS mas los cinco sin clasificar", () => {
    // Guards against a SEVENTH track appearing and being certifiable by
    // omission. The design originally enumerated five tracks and missed
    // `react-eco`; this assertion is what makes that mistake fail loudly.
    const dojosDelRepo = [...new Set(ALL_MODULES.map((m) => m.dojo))].sort();
    expect(dojosDelRepo).toEqual(["css", ...Object.keys(TRACKS_SIN_CLASIFICAR)].sort());
  });
});
