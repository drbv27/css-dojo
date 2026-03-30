"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Exercise } from "@/types";
import HintButton from "./HintButton";

interface CodeCompletionExerciseProps {
  exercise: Exercise;
  onSubmit: (answers: string[]) => void;
}

export default function CodeCompletionExercise({
  exercise,
  onSubmit,
}: CodeCompletionExerciseProps) {
  const template = exercise.codeTemplate;
  const blankCount = template?.blanks?.length ?? 0;

  const [answers, setAnswers] = useState<string[]>(
    Array(blankCount).fill("")
  );
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers = template?.blanks ?? [];

  const blankResults = useMemo(() => {
    if (!submitted) return [];
    return answers.map((answer, i) => {
      const correct = correctAnswers[i];
      if (!correct) return false;
      return answer.trim().toLowerCase() === correct.trim().toLowerCase();
    });
  }, [submitted, answers, correctAnswers]);

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(answers);
  };

  const canSubmit = answers.every((a) => a.trim().length > 0);

  // Build the rendered code with inline inputs
  // Fall back to html field only when cssPrefix AND cssSuffix are both empty
  // (i.e. the blanks are inside the html template itself, like HTML exercises)
  const renderCode = () => {
    const hasCSS = !!(template?.cssPrefix || template?.cssSuffix);
    const prefix = hasCSS ? (template?.cssPrefix ?? "") : (template?.html ?? "");
    const suffix = hasCSS ? (template?.cssSuffix ?? "") : "";

    // Split on placeholder markers (3 or more underscores)
    const parts = prefix.split(/_{3,}/);

    const elements: React.ReactNode[] = [];
    let blankIdx = 0;

    parts.forEach((part, i) => {
      // Add the text part
      elements.push(
        <span key={`text-${i}`} className="text-editor-text">
          {part}
        </span>
      );

      // Add a blank input after each part (except the last)
      if (i < parts.length - 1 && blankIdx < blankCount) {
        const idx = blankIdx;
        const isCorrect = submitted && blankResults[idx];
        const isWrong = submitted && !blankResults[idx];

        elements.push(
          <span key={`blank-${idx}`} className="inline-block mx-1 relative">
            <input
              type="text"
              value={answers[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              disabled={submitted}
              placeholder="..."
              className={`inline-block w-32 bg-editor-bg font-mono text-sm px-2 py-0.5 border-b-2 outline-none transition-colors ${
                isCorrect
                  ? "border-neon-green text-neon-green"
                  : isWrong
                  ? "border-neon-red text-neon-red"
                  : "border-neon-blue text-neon-green focus:border-neon-purple"
              }`}
              style={{ caretColor: "var(--color-neon-blue, #89B4FA)" }}
            />
            {isWrong && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 top-full mt-1 text-xs text-neon-green whitespace-nowrap"
              >
                {correctAnswers[idx]}
              </motion.span>
            )}
          </span>
        );
        blankIdx++;
      }
    });

    // If there are blanks not yet consumed (no markers in prefix), append them
    while (blankIdx < blankCount) {
      const idx = blankIdx;
      const isCorrect = submitted && blankResults[idx];
      const isWrong = submitted && !blankResults[idx];

      elements.push(
        <span key={`extra-blank-${idx}`} className="inline-block mx-1 relative">
          <input
            type="text"
            value={answers[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            disabled={submitted}
            placeholder="..."
            className={`inline-block w-32 bg-editor-bg font-mono text-sm px-2 py-0.5 border-b-2 outline-none transition-colors ${
              isCorrect
                ? "border-neon-green text-neon-green"
                : isWrong
                ? "border-neon-red text-neon-red"
                : "border-neon-blue text-neon-green focus:border-neon-purple"
            }`}
          />
          {isWrong && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 top-full mt-1 text-xs text-neon-green whitespace-nowrap"
            >
              {correctAnswers[idx]}
            </motion.span>
          )}
        </span>
      );
      blankIdx++;
    }

    if (suffix) {
      elements.push(
        <span key="suffix" className="text-editor-text">
          {suffix}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Prompt */}
      <div className="text-lg font-semibold text-editor-text leading-relaxed">
        {exercise.prompt}
      </div>

      {/* Code editor area */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-editor-surface border border-editor-border overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-editor-border bg-editor-bg">
          <span className="w-3 h-3 rounded-full bg-neon-red/60" />
          <span className="w-3 h-3 rounded-full bg-neon-yellow/60" />
          <span className="w-3 h-3 rounded-full bg-neon-green/60" />
          <span className="ml-3 text-xs text-editor-muted font-mono">
            {exercise.id.startsWith("html") ? "index.html" : exercise.id.startsWith("ts") ? "index.ts" : exercise.id.startsWith("js") || exercise.id.startsWith("reco") || exercise.id.startsWith("njs") ? "index.js" : "styles.css"}
          </span>
        </div>

        {/* Code content */}
        <pre className="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
          {renderCode()}
        </pre>
      </motion.div>

      {/* Result summary */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
              blankResults.every(Boolean)
                ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                : "bg-neon-red/10 border-neon-red/30 text-neon-red"
            }`}
          >
            {blankResults.every(Boolean) ? (
              <>
                <Check className="w-5 h-5" />
                Todas las respuestas son correctas!
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                Algunas respuestas son incorrectas. Las respuestas correctas se muestran debajo de cada campo.
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {submitted && exercise.explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
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
            disabled={!canSubmit}
            className="ml-auto px-6 py-2.5 rounded-xl bg-neon-blue text-white font-semibold text-sm hover:bg-neon-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neon-blue/20"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
}
