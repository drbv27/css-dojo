"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/types";
import CSSEditor from "@/components/editor/CSSEditor";
import LivePreview from "@/components/editor/LivePreview";
import HintButton from "./HintButton";

interface LiveEditorExerciseProps {
  exercise: Exercise;
  onSubmit: (css: string) => void;
}

export default function LiveEditorExercise({
  exercise,
  onSubmit,
}: LiveEditorExerciseProps) {
  const template = exercise.codeTemplate;
  const initialCSS = template?.cssPrefix ?? "";
  const html = template?.html ?? "<div>Preview</div>";

  const [css, setCss] = useState(initialCSS);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(css);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Prompt */}
      <div className="text-lg font-semibold text-editor-text leading-relaxed">
        {exercise.prompt}
      </div>

      {/* Editor + Preview split */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* CSS Editor */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-neon-blue" />
            <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
              Editor CSS
            </span>
          </div>
          <CSSEditor
            value={css}
            onChange={setCss}
            height="300px"
            readOnly={submitted}
          />
        </div>

        {/* Live Preview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-neon-green" />
            <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
              Vista Previa
            </span>
          </div>
          <LivePreview html={html} css={css} className="flex-1 min-h-[300px]" />
        </div>
      </motion.div>

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
