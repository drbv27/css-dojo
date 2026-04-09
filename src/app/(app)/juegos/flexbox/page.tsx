"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import GameEngine from "@/components/games/GameEngine";
import FlexboxBoard from "@/components/games/FlexboxBoard";
import { FLEXBOX_LEVELS } from "@/data/games/flexbox-levels";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function FlexboxGamePage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/games/enabled")
      .then((r) => r.json())
      .then((data) => {
        const disabled = data.disabledSlugs ?? [];
        setEnabled(!disabled.includes("game-flexbox-dojo"));
      })
      .catch(() => setEnabled(true));
  }, []);

  if (enabled === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-neon-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!enabled && !isTeacher) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-editor-surface border border-editor-border flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-editor-muted" />
          </div>
          <h2 className="text-lg font-bold text-editor-text mb-2">Juego no disponible</h2>
          <p className="text-editor-muted text-sm mb-6">
            El profesor aun no ha habilitado este juego. Vuelve pronto.
          </p>
          <Link href="/juegos" className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors">
            Volver a Juegos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <GameEngine
      levels={FLEXBOX_LEVELS}
      gameName="Flexbox Dojo"
      gameSlug="flexbox-dojo"
      accentColor="neon-teal"
      accentHex="#94E2D5"
      backHref="/juegos"
      renderBoard={(css, level, solved) => (
        <FlexboxBoard
          css={css}
          boardConfig={(level as any).boardConfig}
          solved={solved}
        />
      )}
    />
  );
}
