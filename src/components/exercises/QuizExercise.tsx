"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Exercise } from "@/types";
import HintButton from "./HintButton";

interface QuizExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string) => void;
}

export default function QuizExercise({ exercise, onSubmit }: QuizExerciseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = exercise.options ?? [];

  const correctId = options.find((o) => o.isCorrect)?.id ?? "";
  const isCorrect = submitted && selectedId === correctId;
  const isWrong = submitted && selectedId !== correctId;

  const handleSubmit = () => {
    if (!selectedId) return;
    setSubmitted(true);
    onSubmit(selectedId);
  };

  const getOptionClasses = (optionId: string) => {
    const base =
      "relative rounded-xl p-4 border-2 transition-all duration-200 text-left cursor-pointer";

    if (submitted) {
      if (optionId === correctId) {
        return `${base} border-neon-green bg-neon-green/10 cursor-default`;
      }
      if (optionId === selectedId && optionId !== correctId) {
        return `${base} border-neon-red bg-neon-red/10 cursor-default`;
      }
      return `${base} border-editor-border bg-editor-surface opacity-50 cursor-default`;
    }

    if (optionId === selectedId) {
      return `${base} border-neon-blue bg-neon-blue/10`;
    }

    return `${base} border-editor-border bg-editor-surface hover:border-neon-blue/60 hover:bg-editor-hover`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Prompt */}
      <div className="text-lg font-semibold text-editor-text leading-relaxed">
        {exercise.prompt}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.3 }}
            onClick={() => !submitted && setSelectedId(option.id)}
            disabled={submitted}
            className={getOptionClasses(option.id)}
          >
            <div className="flex items-start gap-3">
              {/* Letter badge */}
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  submitted && option.id === correctId
                    ? "bg-neon-green/20 text-neon-green"
                    : submitted && option.id === selectedId
                    ? "bg-neon-red/20 text-neon-red"
                    : option.id === selectedId
                    ? "bg-neon-blue/20 text-neon-blue"
                    : "bg-editor-bg text-editor-muted"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>

              <span className="text-sm text-editor-text flex-1 pt-0.5">
                {option.text}
              </span>

              {/* Result icon */}
              {submitted && option.id === correctId && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <Check className="w-5 h-5 text-neon-green" />
                </motion.span>
              )}
              {submitted && option.id === selectedId && option.id !== correctId && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <X className="w-5 h-5 text-neon-red" />
                </motion.span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Correct animation */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center justify-center gap-2 text-neon-green font-semibold"
          >
            <Check className="w-6 h-6" />
            <span>Respuesta correcta!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {submitted && exercise.explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 rounded-xl bg-neon-blue/5 border border-neon-blue/15 text-sm text-editor-text leading-relaxed">
              <span className="font-semibold text-neon-blue">Explicacion: </span>
              {exercise.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint + Submit */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {exercise.hint && !submitted && <HintButton hint={exercise.hint} />}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className="ml-auto px-6 py-2.5 rounded-xl bg-neon-blue text-white font-semibold text-sm hover:bg-neon-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neon-blue/20"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
}
