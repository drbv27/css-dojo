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
  const percentage = Math.min(Math.round((earned / needed) * 100), 100);

  return {
    current: earned,
    needed,
    percentage,
  };
}
