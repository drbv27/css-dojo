"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Code2 } from "lucide-react";
import type { Exercise } from "@/types";
import CSSEditor from "@/components/editor/CSSEditor";
import LivePreview from "@/components/editor/LivePreview";
import HintButton from "./HintButton";

interface VisualMatchExerciseProps {
  exercise: Exercise;
  onSubmit: (css: string) => void;
  submitted?: boolean;
}

export default function VisualMatchExercise({
  exercise,
  onSubmit,
  submitted = false,
}: VisualMatchExerciseProps) {
  const template = exercise.codeTemplate;
  const html = template?.html ?? "<div>Preview</div>";
  const targetCSS = exercise.targetCSS ?? "";
  const initialCSS = template?.cssPrefix ?? "";

  const [css, setCss] = useState(initialCSS);

  const handleSubmit = () => {
    onSubmit(css);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Prompt */}
      <div className="text-lg font-semibold text-editor-text leading-relaxed">
        {exercise.prompt}
      </div>

      {/* Two-column layout: Target vs Student */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Target column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Eye className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-semibold text-neon-purple uppercase tracking-wider">
              Objetivo
            </span>
          </div>
          <div className="rounded-xl border-2 border-neon-purple/30 overflow-hidden">
            <LivePreview
              html={html}
              css={targetCSS}
              className="min-h-[250px]"
            />
          </div>
        </div>

        {/* Student column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Code2 className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-semibold text-neon-blue uppercase tracking-wider">
              Tu codigo
            </span>
          </div>

          {/* Student editor */}
          <CSSEditor
            value={css}
            onChange={setCss}
            height="200px"
            readOnly={submitted}
          />

          {/* Student preview */}
          <div className="rounded-xl border-2 border-neon-blue/30 overflow-hidden">
            <LivePreview
              html={html}
              css={css}
              className="min-h-[250px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Side-by-side comparison after submit */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <p className="text-sm font-semibold text-editor-muted uppercase tracking-wider">
            Comparacion
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neon-purple/30 overflow-hidden">
              <div className="px-3 py-1.5 bg-neon-purple/10 border-b border-neon-purple/20 text-xs font-semibold text-neon-purple text-center">
                Objetivo
              </div>
              <LivePreview html={html} css={targetCSS} className="min-h-[180px]" />
            </div>
            <div className="rounded-xl border border-neon-blue/30 overflow-hidden">
              <div className="px-3 py-1.5 bg-neon-blue/10 border-b border-neon-blue/20 text-xs font-semibold text-neon-blue text-center">
                Tu resultado
              </div>
              <LivePreview html={html} css={css} className="min-h-[180px]" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Hint + Submit */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {exercise.hint && !submitted && <HintButton hint={exercise.hint} />}
        {!submitted && (
          <button
            onClick={handleSubmit}
            className="ml-auto px-6 py-2.5 rounded-xl bg-neon-blue text-white font-semibold text-sm hover:bg-neon-blue/90 transition-colors shadow-lg shadow-neon-blue/20"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
}
