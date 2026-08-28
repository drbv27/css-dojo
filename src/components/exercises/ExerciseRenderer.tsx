"use client";

import { useCallback, useState } from "react";
import type { Exercise } from "@/types";
import { calificar } from "@/lib/calificar";
import QuizExercise from "./QuizExercise";
import CodeCompletionExercise from "./CodeCompletionExercise";
import LiveEditorExercise from "./LiveEditorExercise";
import VisualMatchExercise from "./VisualMatchExercise";
import DragDropExercise from "./DragDropExercise";
import ExerciseResult from "./ExerciseResult";
import JsBehaviorExercise from "./JsBehaviorExercise";

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

  /**
   * The grading rule lives in `@/lib/calificar`, not here.
   *
   * It used to be a switch in this file, which is `"use client"` — so the
   * server could not reach it, and `POST /api/progress` had no choice but to
   * believe whatever score the browser sent. One copy, both sides.
   *
   * An ungradeable submission is worth nothing here, exactly as the old
   * `default` branch returned `{correct: false, score: 0}`.
   */
  const validate = useCallback(
    (userAnswer: any): { correct: boolean; score: number } => {
      const r = calificar(exercise, userAnswer);
      return r.calificable ? { correct: r.correct, score: r.score } : { correct: false, score: 0 };
    },
    [exercise]
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

  /**
   * js-behavior arrives already scored. `validate()` above is synchronous and
   * behavioral grading is not: the submission runs in a worker and the result
   * comes back asynchronously. Same shape as handleSubmitDragDrop, which also
   * computes its score outside `validate`.
   *
   * XP follows the existing rule exactly -- all or nothing on `correct` -- so
   * this type adds no new branch to progression.
   */
  const handleSubmitJs = useCallback(
    ({ correct, score, codigo }: { correct: boolean; score: number; codigo: string }) => {
      const xpEarned = correct ? exercise.xpReward : 0;
      const r = { correct, score, xpEarned, userAnswer: codigo };
      setResult(r);
      onComplete(r);
    },
    [exercise.xpReward, onComplete]
  );

  const handleSubmitDragDrop = useCallback(
    (placements: Record<string, string>) => {
      // Through `calificar` like everything else. It grades drag-drop by its
      // zones and NOT by `validation`, which declares `exact` with an object
      // answer -- a comparison that passes for any placement at all.
      const { correct, score } = validate(placements);
      const xpEarned = correct ? exercise.xpReward : 0;
      const r = { correct, score, xpEarned, userAnswer: placements };
      setResult(r);
      onComplete(r);
    },
    [validate, exercise.xpReward, onComplete]
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
        // Branching on the VALIDATION type, explicitly. LiveEditorExercise picks
        // its CSS and HTML modes by negation, and a third negation on top would
        // make all three fragile -- so a js-behavior exercise gets its own
        // component and the 64 CSS/HTML exercises stay untouched.
        if (exercise.validation.type === "js-behavior") {
          return (
            <JsBehaviorExercise
              exercise={exercise}
              onSubmit={handleSubmitJs}
              submitted={result !== null}
            />
          );
        }
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
