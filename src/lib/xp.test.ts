import { describe, expect, it } from "vitest";
import { getRank, getNextRank, getXPProgress } from "@/lib/xp";

describe("getRank", () => {
  it.each([
    [0, "Cinturon Blanco"],
    [149, "Cinturon Blanco"],
    [150, "Cinturon Amarillo"],
    [11000, "Gran Maestro"],
    [999_999, "Gran Maestro"],
    [-1, "Cinturon Blanco"],
  ])("getRank(%i) returns %s", (xp, expectedName) => {
    expect(getRank(xp).name).toBe(expectedName);
  });
});

describe("getNextRank", () => {
  it.each([
    [0, "Cinturon Amarillo"],
    [149, "Cinturon Amarillo"],
    [150, "Cinturon Naranja"],
    [10_999, "Gran Maestro"],
    [11_000, null],
    [50_000, null],
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
  it.each([
    [0, { current: 0, needed: 150, percentage: 0 }],
    [75, { current: 75, needed: 150, percentage: 50 }],
    [149, { current: 149, needed: 150, percentage: 99 }],
    [150, { current: 0, needed: 250, percentage: 0 }],
    [11_000, { current: 0, needed: 0, percentage: 100 }],
    [12_000, { current: 1000, needed: 0, percentage: 100 }],
  ])("getXPProgress(%i) returns %o", (xp, expected) => {
    expect(getXPProgress(xp)).toEqual(expected);
  });
});
