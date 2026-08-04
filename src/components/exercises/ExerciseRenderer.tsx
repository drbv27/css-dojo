"use client";

import { useCallback, useState } from "react";
import type { Exercise } from "@/types";
import { compararReglas } from "@/lib/cssRules";
import QuizExercise from "./QuizExercise";
import CodeCompletionExercise from "./CodeCompletionExercise";
import LiveEditorExercise from "./LiveEditorExercise";
import VisualMatchExercise from "./VisualMatchExercise";
import DragDropExercise from "./DragDropExercise";
import ExerciseResult from "./ExerciseResult";

interface ExerciseRendererProps {
  exercise: Exercise;
  onComplete: (result: {
    correct: boolean;
    score: number;
    xpEarned: number;
    userAnswer: any;
  }) => void;
}

export default function ExerciseRenderer({
  exercise,
  onComplete,
}: ExerciseRendererProps) {
  const [result, setResult] = useState<{
    correct: boolean;
    score: number;
    xpEarned: number;
    userAnswer: any;
  } | null>(null);

  const validate = useCallback(
    (userAnswer: any): { correct: boolean; score: number } => {
      const v = exercise.validation;

      switch (v.type) {
        case "exact": {
          // Both answer and userAnswer can be arrays or strings
          const expectedArr = Array.isArray(v.answer) ? v.answer : [v.answer];
          const actualArr = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          const correct =
            expectedArr.length === actualArr.length &&
            expectedArr.every(
              (exp: string, i: number) =>
                String(exp).trim().toLowerCase() === String(actualArr[i]).trim().toLowerCase()
            );
          return { correct, score: correct ? 100 : 0 };
        }

        case "regex": {
          const regex = new RegExp(v.answer, "i");
          const actual = Array.isArray(userAnswer)
            ? userAnswer.join(" ")
            : String(userAnswer);
          const correct = regex.test(actual);
          return { correct, score: correct ? 100 : 0 };
        }

        case "includes": {
          const expected = Array.isArray(v.answer) ? v.answer : [v.answer];
          const actual = String(userAnswer).toLowerCase();
          const matches = expected.filter((e: string) =>
            actual.includes(e.toLowerCase())
          );
          const score = Math.round((matches.length / expected.length) * 100);
          return { correct: score === 100, score };
        }

        case "includes-ordered": {
          // Como "includes" pero exige que los fragmentos aparezcan EN ORDEN,
          // lo que fuerza estructura/anidacion correcta (menos falsos positivos).
          const expected = Array.isArray(v.answer) ? v.answer : [v.answer];
          const actual = String(userAnswer).toLowerCase();
          let pos = 0;
          let matched = 0;
          for (const e of expected) {
            const frag = String(e).toLowerCase();
            const idx = actual.indexOf(frag, pos);
            if (idx === -1) break; // falta o esta fuera de orden -> se detiene
            matched++;
            pos = idx + frag.length;
          }
          const score = Math.round((matched / expected.length) * 100);
          return { correct: score === 100, score };
        }

        case "css-rules": {
          // Parses the answer as CSS instead of searching it as text. Two things
          // "includes" cannot do: it rejects prose (no rules parse out of
          // "display flex justify-content center"), and it checks that each
          // declaration sits under the selector it belongs to, so swapping two
          // rules' bodies no longer passes.
          // Grades against the exercise's own targetCSS by default, so the
          // correct answer lives in one place and cannot drift out of sync with
          // what the preview shows. `answer` is only an override.
          const esperado = v.answer
            ? (Array.isArray(v.answer) ? v.answer : [v.answer]).join("\n")
            : (exercise.targetCSS ?? "");
          const { correct, score } = compararReglas(esperado, String(userAnswer));
          return { correct, score };
        }

        case "visual": {
          // Fails closed on purpose. This branch used to `return { correct: true,
          // score: 80 }` with a comment saying real validation happened
          // server-side -- it does not, so every exercise reaching here was
          // awarded credit for anything at all. A validator that cannot validate
          // must not grant credit. No exercise currently uses this type; if one
          // needs visual comparison, implement it rather than re-opening this.
          return { correct: false, score: 0 };
        }

        default:
          return { correct: false, score: 0 };
      }
    },
    [exercise.validation, exercise.targetCSS]
  );

  const handleSubmit = useCallback(
    (userAnswer: any) => {
      const { correct, score } = validate(userAnswer);
      const xpEarned = correct ? exercise.xpReward : 0;
      const r = { correct, score, xpEarned, userAnswer };
      setResult(r);
      onComplete(r);
    },
    [validate, exercise.xpReward, onComplete]
  );

  const handleSubmitDragDrop = useCallback(
    (placements: Record<string, string>) => {
      const items = exercise.dragItems ?? [];
      let correctCount = 0;
      for (const item of items) {
        if (placements[item.id] === item.correctZone) correctCount++;
      }
      const score = items.length > 0 ? Math.round((correctCount / items.length) * 100) : 0;
      const correct = score === 100;
      const xpEarned = correct ? exercise.xpReward : 0;
      const r = { correct, score, xpEarned, userAnswer: placements };
      setResult(r);
      onComplete(r);
    },
    [exercise.dragItems, exercise.xpReward, onComplete]
  );

  const renderExercise = () => {
    switch (exercise.type) {
      case "quiz":
        return <QuizExercise exercise={exercise} onSubmit={handleSubmit} />;

      case "code-completion":
        return (
          <CodeCompletionExercise exercise={exercise} onSubmit={handleSubmit} />
        );

      case "live-editor":
        return (
          <LiveEditorExercise exercise={exercise} onSubmit={handleSubmit} submitted={result !== null} />
        );

      case "visual-match":
        return (
          <VisualMatchExercise exercise={exercise} onSubmit={handleSubmit} submitted={result !== null} />
        );

      case "drag-drop":
        return (
          <DragDropExercise exercise={exercise} onSubmit={handleSubmitDragDrop} />
        );

      default:
        return (
          <div className="p-8 text-center text-editor-muted">
            Tipo de ejercicio no soportado:{" "}
            <code className="text-neon-red">{exercise.type}</code>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {renderExercise()}

      {result && (
        <div className="mt-4">
          <ExerciseResult
            correct={result.correct}
            score={result.score}
            xpEarned={result.xpEarned}
            explanation={exercise.explanation}
            onNext={() => {
              /* handled by parent */
            }}
            onRetry={
              !result.correct
                ? () => setResult(null)
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
