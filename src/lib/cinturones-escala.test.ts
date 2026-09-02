import { describe, expect, it } from "vitest";
import { RANKS } from "@/lib/constants";
import { getRank } from "@/lib/xp";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

/**
 * EL GUARD QUE FALTABA, y el defecto que existe para cazar.
 *
 * `RANKS` usa umbrales ABSOLUTOS y el curriculum crece. Cada tanda de contenido
 * abarata todos los cinturones **en silencio**: Gran Maestro pedia el 74.6% del
 * curriculum, despues el 69.2%, despues el 65.6% y despues el 64.2%. Las cuatro
 * veces nos enteramos porque alguien fue a medir a mano. Nada se puso rojo.
 *
 * El defecto nunca fueron los numeros. Fue que la deriva no avisaba.
 *
 * Este archivo la hace avisar, en dos capas:
 *
 *  1. LOS ANCLAJES -- lo que cada cinturon SIGNIFICA. Se derivan del curriculum
 *     real en cada corrida, asi que siguen midiendo algo aunque el contenido
 *     cambie. Es la capa fuerte.
 *  2. LA BANDA DE DERIVA -- el porcentaje declarado por cinturon, con
 *     tolerancia. Caza el caso que los anclajes podrian dejar pasar: que todo
 *     se mueva a la vez de forma proporcionada.
 *
 * Cuando esto se ponga rojo, la respuesta NO es ensanchar la banda. Es decidir
 * la escala de nuevo, que es exactamente lo que no estaba pasando.
 */

const xpDe = (ms: { exercises: { xpReward: number }[] }[]) =>
  ms.reduce((t, m) => t + m.exercises.reduce((s, e) => s + e.xpReward, 0), 0);

const XP_TOTAL = xpDe(ALL_MODULES);

const deTracks = (...dojos: DojoType[]) =>
  xpDe(ALL_MODULES.filter((m) => dojos.includes(m.dojo)));

const cssObligatorio = () =>
  xpDe(ALL_MODULES.filter((m) => m.dojo === "css" && m.nivel === "obligatorio"));

/**
 * Lo que cada cinturon de la mitad de arriba tiene que significar. Escrito como
 * el HITO, no como el numero: si manana CSS crece, el hito crece con el y la
 * afirmacion sigue siendo la misma.
 */
const ANCLAJES: { hito: string; xp: () => number; cinturon: string }[] = [
  { hito: "el camino obligatorio de CSS", xp: cssObligatorio, cinturon: "Cinturon Morado" },
  { hito: "CSS entero", xp: () => deTracks("css"), cinturon: "Cinturon Marron" },
  { hito: "CSS + HTML", xp: () => deTracks("css", "html"), cinturon: "Cinturon Rojo" },
  { hito: "CSS + HTML + JS", xp: () => deTracks("css", "html", "js"), cinturon: "Cinturon Negro" },
  { hito: "CSS + HTML + JS + React", xp: () => deTracks("css", "html", "js", "react"), cinturon: "Gran Maestro" },
];

/**
 * El porcentaje del curriculum que cada cinturon PRETENDE pedir, medido el
 * 2026-09-01 sobre 17140 XP. La tolerancia es de 3 puntos: un ejercicio suelto
 * no molesta, una tanda de contenido si.
 */
const DERIVA_TOLERADA_EN_PUNTOS = 3;
const PORCENTAJE_PRETENDIDO: Record<string, number> = {
  "Cinturon Blanco": 0,
  "Cinturon Amarillo": 1.8,
  "Cinturon Naranja": 5.3,
  "Cinturon Verde": 10.5,
  "Cinturon Azul": 18.7,
  "Cinturon Morado": 30.3,
  "Cinturon Marron": 43.2,
  "Cinturon Rojo": 56.0,
  "Cinturon Negro": 74.7,
  "Gran Maestro": 92.2,
};

describe("la escala de cinturones significa algo", () => {
  it.each(ANCLAJES)(
    "terminar $hito da exactamente $cinturon",
    ({ xp, cinturon }) => {
      expect(getRank(xp()).name).toBe(cinturon);
    },
  );

  it("y cada anclaje da un cinturon DISTINTO: la escala no se aplana arriba", () => {
    // El defecto que tenia la escala vieja. Con 11000 de techo, terminar tres
    // tracks, cuatro tracks o los seis daba Gran Maestro en los tres casos: la
    // insignia no distinguia a alguien que hizo todo de alguien que salteo
    // React, Next y el ecosistema entero.
    const obtenidos = ANCLAJES.map((a) => getRank(a.xp()).name);
    expect(new Set(obtenidos).size).toBe(ANCLAJES.length);
  });

  it("el maximo alcanzable llega al ultimo cinturon", () => {
    // Un techo que nadie puede tocar es una promesa sobre contenido que no
    // existe. Si esto falla, la escala se fue arriba del curriculum.
    expect(getRank(XP_TOTAL).name).toBe(RANKS[RANKS.length - 1].name);
  });
});

describe("la deriva de los umbrales avisa en vez de descontar en silencio", () => {
  it("ningun cinturon se corrio mas de la tolerancia de su porcentaje pretendido", () => {
    const derivados = RANKS.map((r) => {
      const real = (r.minXP / XP_TOTAL) * 100;
      const pretendido = PORCENTAJE_PRETENDIDO[r.name];
      return { cinturon: r.name, pretendido, real: Number(real.toFixed(1)), deriva: Number((real - pretendido).toFixed(1)) };
    }).filter((d) => Math.abs(d.deriva) > DERIVA_TOLERADA_EN_PUNTOS);

    // Enumerado y no contado: el fallo tiene que nombrar el cinturon y decir
    // cuanto se movio, o el proximo que lo lea vuelve a medir a mano.
    expect(derivados).toEqual([]);
  });

  it("la tabla de porcentajes cubre TODOS los cinturones y ninguno de mas", () => {
    // Si alguien agrega un cinturon y se olvida de la tabla, el test de arriba
    // compararia contra undefined y pasaria: NaN nunca es mayor que 3.
    expect(Object.keys(PORCENTAJE_PRETENDIDO).sort()).toEqual(
      RANKS.map((r) => r.name).sort(),
    );
  });

  it("los umbrales suben de forma estricta", () => {
    const ordenados = RANKS.every((r, i) => i === 0 || r.minXP > RANKS[i - 1].minXP);
    expect(ordenados).toBe(true);
  });
});
