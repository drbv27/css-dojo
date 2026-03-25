"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AchievementToastProps {
  achievement: {
    title: string;
    description: string;
    icon: string;
  };
  onClose: () => void;
}

const ICON_MAP: Record<string, string> = {
  trophy: "🏆",
  "book-check": "📚",
  flame: "🔥",
  zap: "⚡",
  milestone: "🚩",
  crown: "👑",
  star: "⭐",
  compass: "🧭",
  timer: "⏱️",
  award: "🎖️",
};

export default function AchievementToast({
  achievement,
  onClose,
}: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = ICON_MAP[achievement.icon] ?? "🏅";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, x: 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="relative overflow-hidden rounded-xl border border-neon-yellow/30 bg-editor-surface shadow-lg shadow-neon-yellow/10">
          {/* Gold accent top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-neon-yellow/80 to-neon-yellow" />

          <div className="flex items-start gap-3 p-4">
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neon-yellow/10 text-xl">
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-neon-yellow mb-0.5">
                Logro desbloqueado
              </p>
              <p className="text-sm font-bold text-editor-text truncate">
                {achievement.title}
              </p>
              <p className="text-xs text-editor-muted mt-0.5">
                {achievement.description}
              </p>
              <p className="text-xs font-semibold text-neon-yellow mt-1">
                +XP
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="shrink-0 text-editor-muted hover:text-editor-text transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
