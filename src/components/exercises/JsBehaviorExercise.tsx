"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Exercise, JsCaseOutcome } from "@/types";
import CSSEditor from "@/components/editor/CSSEditor";
import HintButton from "./HintButton";
import { useJsBehavior } from "@/hooks/useJsBehavior";

interface JsBehaviorExerciseProps {
  exercise: Exercise;
  /** Receives an already-computed score: grading here is asynchronous. */
  onSubmit: (resultado: { correct: boolean; score: number; codigo: string }) => void;
  submitted?: boolean;
}

/**
 * A JavaScript exercise graded by running the submission.
 *
 * Separate from LiveEditorExercise on purpose. That component picks between its
 * CSS and HTML modes by negation (`!targetCSS`, `!cssPrefix && !cssSuffix`), and
 * adding a third negation on top would make all three fragile. Keeping this
 * apart also means the 64 existing CSS and HTML exercises are untouched by this
 * change.
 *
 * The submission runs in a Web Worker, not in the preview iframe: an iframe
 * shares its thread with the page, so a `while (true)` froze the whole tab.
 */
export default function JsBehaviorExercise({
  exercise,
  onSubmit,
  submitted = false,
}: JsBehaviorExerciseProps) {
  const casos = exercise.validation.cases ?? [];
  const [codigo, setCodigo] = useState(exercise.codeTemplate?.cssPrefix ?? "");
  const { estado, resultado, puntaje, ejecutar } = useJsBehavior(casos);

  const correr = async () => {
    await ejecutar(codigo);
  };

  // The score is computed here and handed over, following the precedent
  // handleSubmitDragDrop already sets: ExerciseRenderer.validate() is
  // synchronous and this is not.
  const enviar = () => {
    if (!puntaje) return;
    onSubmit({ correct: puntaje.correct, score: puntaje.score, codigo });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold text-editor-text leading-relaxed whitespace-pre-wrap">
        {exercise.prompt}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <CSSEditor value={codigo} onChange={setCodigo} language="javascript" />

        <div className="flex items-center gap-3">
          <button
            onClick={correr}
            disabled={estado === "corriendo" || submitted}
            className="px-4 py-2 rounded-lg bg-neon-blue/15 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/25 disabled:opacity-50 transition-colors"
          >
            {estado === "corriendo" ? "Ejecutando…" : "Probar"}
          </button>

          <button
            onClick={enviar}
            disabled={!puntaje || submitted}
            className="px-4 py-2 rounded-lg bg-neon-green/15 text-neon-green border border-neon-green/30 hover:bg-neon-green/25 disabled:opacity-50 transition-colors"
          >
            Enviar
          </button>

          {exercise.hint && <HintButton hint={exercise.hint} />}
        </div>

        {resultado && <Resultados exercise={exercise} resultado={resultado} />}
      </motion.div>
    </div>
  );
}

function Resultados({
  exercise,
  resultado,
}: {
  exercise: Exercise;
  resultado: NonNullable<ReturnType<typeof useJsBehavior>["resultado"]>;
}) {
  const casos = exercise.validation.cases ?? [];

  // A run-level failure has no per-case detail to show, and saying "0 of 3
  // passed" would suggest the cases even ran. They did not.
  if (resultado.kind === "syntax-error") {
    return (
      <Aviso tono="rojo" titulo="Tu código no se pudo interpretar">
        {resultado.message}
      </Aviso>
    );
  }

  if (resultado.kind === "timeout") {
    return (
      <Aviso tono="naranja" titulo="Tu código no terminó de ejecutarse">
        Suele ser un bucle que nunca corta. Revisá que la condición llegue a ser falsa.
      </Aviso>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {resultado.cases.map((caso, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-lg border border-editor-border bg-editor-surface px-4 py-2.5 text-sm"
        >
          <span className={caso.kind === "pass" ? "text-neon-green" : "text-neon-red"}>
            {caso.kind === "pass" ? "✓" : "✕"}
          </span>
          <div className="flex flex-col gap-0.5">
            <code className="text-editor-text">{casos[i]?.label ?? casos[i]?.call}</code>
            <span className="text-xs text-editor-muted">{detalle(caso, casos[i]?.expect)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Says what actually happened, so a wrong answer is never confused with a crash. */
function detalle(caso: JsCaseOutcome, esperado: unknown): string {
  switch (caso.kind) {
    case "pass":
      return `Devolvió ${JSON.stringify(esperado)}`;
    case "fail":
      return `Esperaba ${JSON.stringify(esperado)} y devolvió ${JSON.stringify(caso.observed)}`;
    case "not-defined":
      return `No encontré ${caso.identifier || "la función"}. Revisá el nombre.`;
    case "runtime-error":
      return `Lanzó un error: ${caso.message}`;
    case "unserializable":
      return "Devolvió algo que no se puede comparar, como una función.";
  }
}

// Full class strings, never interpolated. Tailwind scans the source for literal
// class names, so `text-${color}` produces a class that is never generated and
// fails silently -- the element just renders unstyled.
const TONOS = {
  rojo: {
    caja: "rounded-lg border border-neon-red/30 bg-neon-red/[0.06] px-4 py-3",
    titulo: "text-sm font-semibold text-neon-red",
  },
  naranja: {
    caja: "rounded-lg border border-neon-orange/30 bg-neon-orange/[0.06] px-4 py-3",
    titulo: "text-sm font-semibold text-neon-orange",
  },
} as const;

function Aviso({
  tono,
  titulo,
  children,
}: {
  tono: keyof typeof TONOS;
  titulo: string;
  children: React.ReactNode;
}) {
  const estilo = TONOS[tono];
  return (
    <div className={estilo.caja}>
      <p className={estilo.titulo}>{titulo}</p>
      <p className="mt-1 text-xs text-editor-muted font-mono">{children}</p>
    </div>
  );
}
