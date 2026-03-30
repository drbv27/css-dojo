"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ChevronRight, Sparkles } from "lucide-react";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { UserMenu } from "@/components/auth/UserMenu";

const PATH_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  modulos: "Modulos",
  playground: "Playground",
  leaderboard: "Leaderboard",
  perfil: "Perfil",
  teacher: "Panel Profesor",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const segments = pathname.split("/").filter(Boolean);
  const pageKey = segments[0] ?? "dashboard";
  const pageLabel = PATH_LABELS[pageKey] ?? pageKey.charAt(0).toUpperCase() + pageKey.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-editor-border bg-editor-sidebar/80 backdrop-blur px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-editor-muted">Dev Dojo</span>
        <ChevronRight className="h-4 w-4 text-editor-muted/50" />
        <span className="font-medium text-editor-text">{pageLabel}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <StreakCounter streak={0} />

            <div className="flex items-center gap-1.5 rounded-lg bg-editor-hover px-3 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-neon-yellow" />
              <span className="font-semibold text-neon-yellow">0</span>
              <span className="text-editor-muted">XP</span>
            </div>

            <UserMenu />
          </>
        )}
      </div>
    </header>
  );
}
