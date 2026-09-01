import type { Rank, XPProgress } from "@/types";
import { RANKS } from "@/lib/constants";

export function getRank(xp: number): Rank {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXP) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getNextRank(xp: number): Rank | null {
  for (const rank of RANKS) {
    if (rank.minXP > xp) {
      return rank;
    }
  }
  return null;
}

export function getXPProgress(xp: number): XPProgress {
  const current = getRank(xp);
  const next = getNextRank(xp);

  if (!next) {
    return {
      current: xp - current.minXP,
      needed: 0,
      percentage: 100,
    };
  }

  const earned = xp - current.minXP;
  const needed = next.minXP - current.minXP;
  // FLOOR, no round: con round, estar a un XP del proximo cinturon en un tramo
  // de 300 o mas redondea a 100 y la barra dice que llegaste cuando no. Mientras
  // exista un cinturon siguiente el porcentaje tiene que ser menor a 100; el 100
  // se devuelve arriba, en la rama de quien ya no tiene proximo.
  const percentage = Math.min(Math.floor((earned / needed) * 100), 99);

  return {
    current: earned,
    needed,
    percentage,
  };
}
