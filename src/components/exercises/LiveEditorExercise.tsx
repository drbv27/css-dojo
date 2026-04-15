"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/types";
import CSSEditor from "@/components/editor/CSSEditor";
import TabCodeEditor from "@/components/editor/TabCodeEditor";
import LivePreview from "@/components/editor/LivePreview";
import HintButton from "./HintButton";

interface LiveEditorExerciseProps {
  exercise: Exercise;
  onSubmit: (css: string) => void;
  showJS?: boolean;
}

export default function LiveEditorExercise({
  exercise,
  onSubmit,
  showJS = false,
}: LiveEditorExerciseProps) {
  const template = exercise.codeTemplate;
  const initialCSS = template?.cssPrefix ?? "";
  const htmlTemplate = template?.html ?? "<div>Preview</div>";

  // CSS exercises have targetCSS defined — they need both HTML (read-only) and CSS (editable) tabs
  // HTML exercises have no targetCSS — they need a single HTML editor
  const isCSSExercise = !!exercise.targetCSS;
  const isHTMLExercise = !isCSSExercise && !template?.cssPrefix && !template?.cssSuffix;

  const [css, setCss] = useState(initialCSS);
  const [htmlCode, setHtmlCode] = useState(isHTMLExercise || isCSSExercise ? htmlTemplate : "");
  const [js, setJs] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const needsJS = showJS || (template?.html?.includes("<script") ?? false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (isHTMLExercise) {
      onSubmit(htmlCode);
    } else {
      onSubmit(css);
    }
  };

  // For HTML/CSS exercises: the preview uses user's HTML directly
  const previewHTML = isHTMLExercise || isCSSExercise ? htmlCode : htmlTemplate;
  const previewCSS = isHTMLExercise ? "" : css;

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
        {/* Editor */}
        <div className="flex flex-col gap-2">
          {needsJS && !isHTMLExercise ? (
            <TabCodeEditor
              html={htmlTemplate}
              css={css}
              js={js}
              onCSSChange={setCss}
              onJSChange={setJs}
              showHTML={true}
              showCSS={true}
              showJS={true}
              readOnlyHTML={true}
              readOnlyCSS={submitted}
              readOnlyJS={submitted}
              height="300px"
            />
          ) : isCSSExercise ? (
            <TabCodeEditor
              html={htmlCode}
              css={css}
              onHTMLChange={setHtmlCode}
              onCSSChange={setCss}
              showHTML={true}
              showCSS={true}
              showJS={false}
              readOnlyHTML={submitted}
              readOnlyCSS={submitted}
              height="300px"
              activeTab="css"
            />
          ) : (
            <>
              <div className="flex items-center gap-2 px-1">
                <span className={`w-2 h-2 rounded-full ${isHTMLExercise ? "bg-neon-orange" : "bg-neon-blue"}`} />
                <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
                  {isHTMLExercise ? "Editor HTML" : "Editor CSS"}
                </span>
              </div>
              <CSSEditor
                value={isHTMLExercise ? htmlCode : css}
                onChange={isHTMLExercise ? setHtmlCode : setCss}
                height="300px"
                readOnly={submitted}
                language={isHTMLExercise ? "html" : "css"}
              />
            </>
          )}
        </div>

        {/* Live Preview */}
        <div className="flex flex-col gap-2">
          {!needsJS && (
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-neon-green" />
              <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
                Vista Previa
              </span>
            </div>
          )}
          <LivePreview
            html={previewHTML}
            css={previewCSS}
            js={needsJS ? js : undefined}
            className="flex-1 min-h-[300px]"
          />
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
