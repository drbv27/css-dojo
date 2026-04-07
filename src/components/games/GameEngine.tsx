"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CSSEditor from "@/components/editor/CSSEditor";
import { useAuth } from "@/hooks/useAuth";

interface GameLevel {
  id: number;
  title: string;
  description: string;
  property: string;
  initialCSS: string;
  solutionCSS: string;
  validateFn: string;
  xpReward: number;
  hint: string;
}

interface GameEngineProps {
  levels: GameLevel[];
  gameName: string;
  gameSlug: string;
  accentColor: string;        // e.g. "neon-teal"
  accentHex: string;          // e.g. "#94E2D5"
  renderBoard: (css: string, level: GameLevel) => React.ReactNode;
  backHref: string;
}

export default function GameEngine({
  levels,
  gameName,
  gameSlug,
  accentColor,
  accentHex,
  renderBoard,
  backHref,
}: GameEngineProps) {
  const { refreshUser } = useAuth();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [css, setCss] = useState(levels[0]?.initialCSS ?? "");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successSavedRef = useRef(false);

  const level = levels[currentLevel];

  // Load completed levels from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${gameSlug}-completed`);
    if (saved) {
      try {
        setCompletedLevels(new Set(JSON.parse(saved)));
      } catch { /* ignore */ }
    }
  }, [gameSlug]);

  // Validate CSS against level solution
  const validateCSS = useCallback((cssText: string, lvl: GameLevel): boolean => {
    const pairs = lvl.validateFn.split(",").map((p) => p.trim());
    const normalized = cssText.replace(/\s+/g, " ").toLowerCase().trim();

    return pairs.every((pair) => {
      const [prop, ...valueParts] = pair.split(":");
      const value = valueParts.join(":").trim();
      // Check if the CSS contains the property:value
      const propNormalized = prop.trim();
      const valueNormalized = value.trim();
      // Match property: value with flexible whitespace
      const regex = new RegExp(
        propNormalized.replace("-", "[-]?") + "\\s*:\\s*" + valueNormalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*"),
        "i"
      );
      return regex.test(normalized);
    });
  }, []);

  // Auto-validate on CSS change
  useEffect(() => {
    if (!level || solved) return;
    const isValid = validateCSS(css, level);
    if (isValid) {
      setSolved(true);
      setShowSuccess(true);
      successSavedRef.current = false;
    }
  }, [css, level, solved, validateCSS]);

  // Save progress when solved
  useEffect(() => {
    if (!solved || !level || successSavedRef.current) return;
    successSavedRef.current = true;

    const newCompleted = new Set(completedLevels);
    newCompleted.add(level.id);
    setCompletedLevels(newCompleted);
    localStorage.setItem(`${gameSlug}-completed`, JSON.stringify([...newCompleted]));

    // Save progress to API
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId: gameSlug,
        exerciseId: `${gameSlug}-level-${level.id}`,
        exerciseType: "live-editor",
        difficulty: level.id <= 8 ? 1 : level.id <= 16 ? 2 : 3,
        score: 100,
        userAnswer: css,
      }),
    }).then(() => refreshUser()).catch(() => {});
  }, [solved, level, completedLevels, gameSlug, css, refreshUser]);

  const goToLevel = (idx: number) => {
    setCurrentLevel(idx);
    setCss(levels[idx]?.initialCSS ?? "");
    setSolved(false);
    setShowHint(false);
    setShowSuccess(false);
    setShowLevelSelect(false);
    successSavedRef.current = false;
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      goToLevel(currentLevel + 1);
    }
  };

  const resetLevel = () => {
    setCss(level?.initialCSS ?? "");
    setSolved(false);
    setShowSuccess(false);
    successSavedRef.current = false;
  };

  if (!level) return null;

  const progress = Math.round((completedLevels.size / levels.length) * 100);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-editor-surface border-b border-editor-border shrink-0">
        <div className="flex items-center gap-3">
          <a
            href={backHref}
            className="p-1.5 rounded-md hover:bg-editor-hover transition-colors text-editor-muted hover:text-editor-text"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <span className="text-sm font-bold text-editor-text">{gameName}</span>
          <span className="text-xs text-editor-muted">
            Nivel {level.id} de {levels.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-1.5 bg-editor-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: accentHex }}
              />
            </div>
            <span className="text-xs text-editor-muted font-mono">{progress}%</span>
          </div>

          {/* Level selector button */}
          <button
            onClick={() => setShowLevelSelect((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-${accentColor}/10 text-${accentColor} border-${accentColor}/20 hover:bg-${accentColor}/20`}
          >
            Niveles
          </button>
        </div>
      </div>

      {/* Level selector dropdown */}
      <AnimatePresence>
        {showLevelSelect && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-editor-surface border-b border-editor-border"
          >
            <div className="p-4 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {levels.map((lvl, idx) => {
                const isCompleted = completedLevels.has(lvl.id);
                const isCurrent = idx === currentLevel;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => goToLevel(idx)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? `bg-${accentColor} text-editor-bg`
                        : isCompleted
                        ? `bg-${accentColor}/20 text-${accentColor} border border-${accentColor}/30`
                        : "bg-editor-bg text-editor-muted border border-editor-border hover:border-editor-muted/50"
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      lvl.id
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content: Editor + Board */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Instructions + Editor */}
        <div className="flex-1 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-editor-border">
          {/* Instructions */}
          <div className="px-5 py-4 border-b border-editor-border bg-editor-bg shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${accentHex}20`, color: accentHex }}
              >
                {level.property}
              </span>
              <span className="text-xs text-editor-muted">{level.title}</span>
            </div>
            <p className="text-sm text-editor-text leading-relaxed">
              {level.description}
            </p>
          </div>

          {/* CSS Editor */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="px-4 py-2 border-b border-editor-border bg-editor-sidebar shrink-0 flex items-center justify-between">
              <span className="text-xs text-editor-muted font-mono">style.css</span>
              <div className="flex items-center gap-2">
                {!solved && (
                  <button
                    onClick={() => setShowHint((v) => !v)}
                    className="text-xs text-editor-muted hover:text-neon-yellow transition-colors"
                  >
                    {showHint ? "Ocultar pista" : "Pista"}
                  </button>
                )}
                <button
                  onClick={resetLevel}
                  className="text-xs text-editor-muted hover:text-editor-text transition-colors"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && !solved && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-2.5 bg-neon-yellow/5 border-b border-neon-yellow/20 text-xs text-neon-yellow">
                    {level.hint}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 min-h-0">
              <CSSEditor
                value={css}
                onChange={setCss}
                height="100%"
                readOnly={solved}
              />
            </div>
          </div>
        </div>

        {/* Right: Game Board */}
        <div className="flex-1 flex flex-col min-h-0 bg-editor-bg">
          <div className="px-4 py-2 border-b border-editor-border bg-editor-sidebar shrink-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentHex }} />
            <span className="text-xs text-editor-muted font-mono">Resultado</span>
          </div>
          <div className="flex-1 min-h-0 relative">
            {renderBoard(css, level)}

            {/* Success overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-editor-bg/80 backdrop-blur-sm z-10"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                    className="text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${accentHex}20`, border: `2px solid ${accentHex}40` }}
                    >
                      <svg className="w-8 h-8" fill="none" stroke={accentHex} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-editor-text mb-1">Correcto!</h3>
                    <p className="text-sm text-editor-muted mb-1">+{level.xpReward} XP</p>
                    <p className="text-xs text-editor-muted mb-5">
                      {currentLevel < levels.length - 1
                        ? `Nivel ${level.id} completado`
                        : "Has completado todos los niveles!"}
                    </p>
                    <div className="flex items-center gap-3 justify-center">
                      <button
                        onClick={() => setShowSuccess(false)}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-editor-surface border border-editor-border text-editor-text hover:bg-editor-hover transition-colors"
                      >
                        Ver solucion
                      </button>
                      {currentLevel < levels.length - 1 && (
                        <button
                          onClick={nextLevel}
                          className="px-5 py-2 rounded-lg text-xs font-bold text-editor-bg transition-colors"
                          style={{ backgroundColor: accentHex }}
                        >
                          Siguiente nivel
                        </button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
