"use client";

import GameEngine from "@/components/games/GameEngine";
import FlexboxBoard from "@/components/games/FlexboxBoard";
import { FLEXBOX_LEVELS } from "@/data/games/flexbox-levels";

export default function FlexboxGamePage() {
  return (
    <GameEngine
      levels={FLEXBOX_LEVELS}
      gameName="Flexbox Dojo"
      gameSlug="flexbox-dojo"
      accentColor="neon-teal"
      accentHex="#94E2D5"
      backHref="/juegos"
      renderBoard={(css, level) => (
        <FlexboxBoard
          css={css}
          boardConfig={(level as any).boardConfig}
        />
      )}
    />
  );
}
