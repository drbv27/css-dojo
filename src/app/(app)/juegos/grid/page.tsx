"use client";

import GameEngine from "@/components/games/GameEngine";
import GridBoard from "@/components/games/GridBoard";
import { GRID_LEVELS } from "@/data/games/grid-levels";

export default function GridGamePage() {
  return (
    <GameEngine
      levels={GRID_LEVELS}
      gameName="Grid Dojo"
      gameSlug="grid-dojo"
      accentColor="neon-purple"
      accentHex="#CBA6F7"
      backHref="/juegos"
      renderBoard={(css, level) => (
        <GridBoard
          css={css}
          boardConfig={(level as any).boardConfig}
        />
      )}
    />
  );
}
