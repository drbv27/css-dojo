"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  renderBoard: (css: string, level: GameLevel, solved: boolean) => React.ReactNode;
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
  const [showSuccess, setShowSuccess] = useState(false);
  const successSavedRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  const level = levels[currentLevel];

  // Load completed levels from localStorage and resume at next uncompleted
  useEffect(() => {
    const saved = localStorage.getItem(`${gameSlug}-completed`);
    if (saved) {
      try {
        const completed = new Set<number>(JSON.parse(saved));
        setCompletedLevels(completed);
        // Find first uncompleted level
        const nextIdx = levels.findIndex((l) => !completed.has(l.id));
        if (nextIdx >= 0 && nextIdx !== 0) {
          setCurrentLevel(nextIdx);
          setCss(levels[nextIdx]?.initialCSS ?? "");
        }
      } catch { /* ignore */ }
    }
    setInitialized(true);
  }, [gameSlug, levels]);

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
      successSavedRef.current = false;
      // Delay overlay so the player sees the apprentices animate to position
      setTimeout(() => setShowSuccess(true), 1800);
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

    // Save progress to API (1 XP per level)
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId: gameSlug,
        exerciseId: `${gameSlug}-level-${level.id}`,
        exerciseType: "live-editor",
        difficulty: 1,
        score: 100,
        userAnswer: css,
      }),
    }).then(() => {
      // Check if ALL levels are now completed → bonus XP
      if (newCompleted.size === levels.length) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleId: gameSlug,
            exerciseId: `${gameSlug}-bonus`,
            exerciseType: "live-editor",
            difficulty: 1,
            score: 100,
            userAnswer: "all-levels-completed",
          }),
        }).then(() => refreshUser()).catch(() => {});
      } else {
        refreshUser();
      }
    }).catch(() => {});
  }, [solved, level, completedLevels, gameSlug, css, refreshUser]);

  const goToLevel = (idx: number) => {
    setCurrentLevel(idx);
    setCss(levels[idx]?.initialCSS ?? "");
    setSolved(false);
    setShowHint(false);
    setShowSuccess(false);
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

  if (!initialized) return null;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-editor-surface border-b border-editor-border shrink-0">
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

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-32 h-1.5 bg-editor-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentHex }}
            />
          </div>
          <span className="text-xs text-editor-muted font-mono">{progress}%</span>
        </div>
      </div>

      {/* Level stepper - always visible */}
      <div className="px-4 py-2.5 bg-editor-surface border-b border-editor-border shrink-0 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {levels.map((lvl, idx) => {
            const isCompleted = completedLevels.has(lvl.id);
            const isCurrent = idx === currentLevel;
            return (
              <button
                key={lvl.id}
                onClick={() => goToLevel(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? "text-editor-bg"
                    : isCompleted
                    ? "border-2 text-editor-bg"
                    : "bg-editor-bg text-editor-muted border border-editor-border hover:border-editor-muted/50"
                }`}
                style={
                  isCurrent
                    ? { backgroundColor: accentHex }
                    : isCompleted
                    ? { backgroundColor: `${accentHex}30`, borderColor: `${accentHex}60`, color: accentHex }
                    : undefined
                }
              >
                {isCompleted && !isCurrent ? (
                  <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  lvl.id
                )}
              </button>
            );
          })}
        </div>
      </div>

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

          {/* CSS Editor with context */}
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

            {/* Froggy-style editor: context CSS + editable area */}
            <div className="flex-1 min-h-0 flex flex-col bg-editor-bg overflow-auto">
              {/* Code block - compact, no flex-1 stretching */}
              <div className="px-5 py-4 font-mono text-sm">
                {/* Line 1: #container { */}
                <div className="flex leading-7">
                  <span className="w-8 text-right mr-4 text-editor-muted/50 text-xs select-none">1</span>
                  <span><span className="text-neon-yellow">#container</span> <span className="text-editor-muted">{"{"}</span></span>
                </div>
                {/* Line 2: display: flex; */}
                <div className="flex leading-7">
                  <span className="w-8 text-right mr-4 text-editor-muted/50 text-xs select-none">2</span>
                  <span className="ml-6"><span className="text-neon-blue">display</span><span className="text-editor-muted">:</span> <span className="text-neon-green">flex</span><span className="text-editor-muted">;</span></span>
                </div>
                {/* Line 3: editable input */}
                <div className="flex items-center leading-7 my-1">
                  <span className="w-8 text-right mr-4 text-editor-muted/50 text-xs select-none">3</span>
                  <div className="flex-1 ml-6">
                    <input
                      type="text"
                      value={css}
                      onChange={(e) => setCss(e.target.value)}
                      disabled={solved}
                      placeholder={`${level.property}: ...;`}
                      className="w-full bg-editor-surface/50 border border-editor-border rounded px-3 py-1.5 text-neon-green font-mono text-sm outline-none focus:border-neon-blue/50 transition-colors placeholder-editor-muted/40 disabled:opacity-60"
                      spellCheck={false}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && solved && currentLevel < levels.length - 1) {
                          nextLevel();
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Line 4: } */}
                <div className="flex leading-7">
                  <span className="w-8 text-right mr-4 text-editor-muted/50 text-xs select-none">4</span>
                  <span className="text-editor-muted">{"}"}</span>
                </div>
              </div>

              {/* Solution display when solved */}
              {solved && (
                <div className="px-5 pb-4 border-t border-editor-border pt-3 mt-auto">
                  <span className="text-[10px] text-editor-muted uppercase tracking-wider">Solucion:</span>
                  <p className="text-xs font-mono mt-1" style={{ color: accentHex }}>{level.solutionCSS}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Game Board */}
        <div className="flex-1 flex flex-col min-h-0 bg-editor-bg">
          <div className="px-4 py-2 border-b border-editor-border bg-editor-sidebar shrink-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentHex }} />
            <span className="text-xs text-editor-muted font-mono">Arena</span>
          </div>
          <div className="flex-1 min-h-0 relative">
            {renderBoard(css, level, solved)}

            {/* Success overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                  style={{ background: "radial-gradient(circle, rgba(18,18,31,0.95) 0%, rgba(18,18,31,0.85) 100%)" }}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", damping: 12, stiffness: 200 }}
                    className="text-center"
                  >
                    {/* Animated circle with glow */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 10 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: `radial-gradient(circle, ${accentHex}30, transparent)`,
                        boxShadow: `0 0 40px ${accentHex}20, 0 0 80px ${accentHex}10`,
                      }}
                    >
                      <div className="text-3xl">🥋</div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-bold mb-1"
                      style={{ color: accentHex }}
                    >
                      Kata completado!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-editor-muted mb-1"
                    >
                      +{level.xpReward} XP
                    </motion.p>
                    <p className="text-xs text-editor-muted mb-5">
                      {currentLevel < levels.length - 1
                        ? `Nivel ${level.id} de ${levels.length}`
                        : "Has completado todos los katas!"}
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
