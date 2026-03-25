"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface ExerciseResultProps {
  correct: boolean;
  score: number;
  xpEarned: number;
  explanation?: string;
  onNext: () => void;
  onRetry?: () => void;
}

export default function ExerciseResult({
  correct,
  score,
  xpEarned,
  explanation,
  onNext,
  onRetry,
}: ExerciseResultProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-editor-surface border border-editor-border text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.15 }}
      >
        {correct ? (
          <CheckCircle2 className="w-20 h-20 text-neon-green drop-shadow-[0_0_24px_rgba(166,227,161,0.4)]" />
        ) : (
          <XCircle className="w-20 h-20 text-neon-red drop-shadow-[0_0_24px_rgba(243,139,168,0.4)]" />
        )}
      </motion.div>

      {/* Title */}
      <h2
        className={`text-3xl font-bold ${
          correct ? "text-neon-green" : "text-neon-red"
        }`}
      >
        {correct ? "Correcto!" : "Incorrecto"}
      </h2>

      {/* XP Badge */}
      {correct && xpEarned > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-neon-purple/15 border border-neon-purple/30"
        >
          <span className="text-neon-purple font-bold text-lg">
            +{xpEarned} XP
          </span>
        </motion.div>
      )}

      {/* Score */}
      <p className="text-editor-muted text-sm">
        Puntuacion: <span className="text-editor-text font-semibold">{score}/100</span>
      </p>

      {/* Explanation */}
      {explanation && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-full max-w-md px-5 py-4 bg-editor-bg rounded-xl border border-editor-border text-left"
        >
          <p className="text-xs uppercase tracking-wider text-editor-muted mb-2 font-semibold">
            Explicacion
          </p>
          <p className="text-sm text-editor-text leading-relaxed">
            {explanation}
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-2">
        {!correct && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-editor-bg border border-editor-border text-editor-text hover:bg-editor-hover transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Intentar de nuevo
          </button>
        )}
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-blue text-white hover:bg-neon-blue/90 transition-colors text-sm font-semibold shadow-lg shadow-neon-blue/20"
        >
          Siguiente ejercicio
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
