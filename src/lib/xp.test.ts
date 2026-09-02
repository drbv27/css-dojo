import { describe, expect, it } from "vitest";
import { getRank, getNextRank, getXPProgress } from "@/lib/xp";
import { RANKS } from "@/lib/constants";

/**
 * Estos tests son sobre la LOGICA de getRank -- los bordes, el piso, el techo --
 * no sobre que numero tiene cada cinturon. Por eso salen de RANKS en vez de
 * repetir 150 y 11000 a mano: cuando la escala se reescalo, esos dos literales
 * fallaron sin que nada estuviera roto, que es el sintoma de un test que mide
 * la cosa equivocada.
 *
 * Que la ESCALA sea la correcta lo verifica `cinturones-escala.test.ts`, contra
 * el curriculum real.
 */
const PRIMERO = RANKS[0];
const SEGUNDO = RANKS[1];
const ULTIMO = RANKS[RANKS.length - 1];

describe("getRank", () => {
  it.each([
    [0, PRIMERO.name],
    [SEGUNDO.minXP - 1, PRIMERO.name],
    [SEGUNDO.minXP, SEGUNDO.name],
    [ULTIMO.minXP, ULTIMO.name],
    [ULTIMO.minXP * 100, ULTIMO.name],
    [-1, PRIMERO.name],
  ])("getRank(%i) returns %s", (xp, expectedName) => {
    expect(getRank(xp).name).toBe(expectedName);
  });
});

describe("getNextRank", () => {
  it.each([
    [0, SEGUNDO.name],
    [SEGUNDO.minXP - 1, SEGUNDO.name],
    [SEGUNDO.minXP, RANKS[2].name],
    [ULTIMO.minXP - 1, ULTIMO.name],
    [ULTIMO.minXP, null],
    [ULTIMO.minXP * 5, null],
  ])("getNextRank(%i) returns %s", (xp, expectedName) => {
    const next = getNextRank(xp);
    if (expectedName === null) {
      expect(next).toBeNull();
    } else {
      expect(next?.name).toBe(expectedName);
    }
  });
});

describe("getXPProgress", () => {
  // El tramo del primer cinturon al segundo, y el techo. Todo derivado, para
  // que reescalar la escala no rompa un test que no es sobre la escala.
  const TRAMO_1 = SEGUNDO.minXP - PRIMERO.minXP;
  const MITAD = PRIMERO.minXP + Math.floor(TRAMO_1 / 2);
  const TRAMO_2 = RANKS[2].minXP - SEGUNDO.minXP;

  it.each([
    [PRIMERO.minXP, { current: 0, needed: TRAMO_1, percentage: 0 }],
    [MITAD, { current: MITAD - PRIMERO.minXP, needed: TRAMO_1, percentage: 50 }],
    // A UN XP del siguiente cinturon. Antes esto redondeaba a 100 y la barra
    // decia que habias llegado sin haber llegado.
    [SEGUNDO.minXP - 1, { current: TRAMO_1 - 1, needed: TRAMO_1, percentage: 99 }],
    [SEGUNDO.minXP, { current: 0, needed: TRAMO_2, percentage: 0 }],
    [ULTIMO.minXP, { current: 0, needed: 0, percentage: 100 }],
    [ULTIMO.minXP + 1000, { current: 1000, needed: 0, percentage: 100 }],
  ])("getXPProgress(%i) returns %o", (xp, expected) => {
    expect(getXPProgress(xp)).toEqual(expected);
  });
});
