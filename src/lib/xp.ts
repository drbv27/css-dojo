import type { Rank, XPProgress } from "@/types";
import { RANKS, XP_REWARDS } from "@/lib/constants";

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

export function calculateXP(difficulty: number, score: number): number {
  const baseXP = XP_REWARDS[difficulty] ?? 10;
  // score is expected to be between 0 and 1
  return Math.round(baseXP * Math.max(0, Math.min(1, score)));
}
