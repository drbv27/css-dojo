"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/types";
import { calificar } from "@/lib/calificar";
import CSSEditor from "@/components/editor/CSSEditor";
import LivePreview from "@/components/editor/LivePreview";
import HintButton from "./HintButton";

/**
 * El RETO INTEGRADOR de un modulo: instrucciones numeradas al costado del
 * editor, y una correccion que dice CUAL paso falta en vez de "esta mal".
 *
 * ## Por que es un componente propio y no una rama de LiveEditorExercise
 *
 * `LiveEditorExercise` ya elige modo CSS vs HTML por negacion
 * (`isCSSExercise = !!targetCSS`, `isHTMLExercise = !isCSSExercise && ...`) y
 * su propio comentario avisa que una tercera negacion volveria fragiles a las
 * tres. Por eso `JsBehaviorExercise` existe aparte, y por eso este tambien.
 *
 * Ademas un reto NO declara `targetCSS` -- lo deriva de sus pasos -- asi que
 * `LiveEditorExercise` lo tomaria por un ejercicio de HTML y le mostraria el
 * editor equivocado.
 *
 * ## La solucion de referencia
 *
 * Se muestra SOLO cuando este alumno ya completo el reto. No se abre por
 * intentos, ni por tiempo, ni por ningun control de la pagina.
 *
 * ES UNA LLAVE EN LA INTERFAZ, NO UN LIMITE, y conviene decirlo donde alguien
 * lo vaya a leer: la pagina del ejercicio es "use client" e importa
 * ALL_MODULES, asi que las respuestas de los 789 ejercicios ya estan en el
 * bundle del navegador. Esto frena al alumno que haria clic; no frena al que
 * abre devtools. Lo que si esta cerrado -mandar una completitud que no se
 * gano- lo cerro `revalidacion-en-servidor` del lado del servidor.
 */

interface RetoIntegradorProps {
  exercise: Exercise;
  onSubmit: (css: string) => void;
  submitted?: boolean;
  /** Si este alumno ya completo el reto. Unica llave de la solucion. */
  yaCompletado?: boolean;
}

export default function RetoIntegrador({
  exercise,
  onSubmit,
  submitted = false,
  yaCompletado = false,
}: RetoIntegradorProps) {
  const pasos = exercise.retoPasos ?? [];
  const plantilla = exercise.codeTemplate?.html ?? "<div>Preview</div>";

  /**
   * QUE ESCRIBE EL ALUMNO. No siempre es CSS: en los modulos de framework
   * -Tailwind, Bootstrap- lo que se aprende es el MARCADO con clases
   * utilitarias, y esos retos se corrigen con `html-structure`.
   *
   * Sin esta distincion el editor quedaba en modo CSS y Monaco subrayaba en
   * rojo el HTML valido que el alumno escribia, mientras la vista previa
   * mostraba la plantilla original en vez de su trabajo.
   */
  const escribeHtml = exercise.validation.type === "html-structure";

  const [codigo, setCodigo] = useState(
    escribeHtml ? plantilla : (exercise.codeTemplate?.cssPrefix ?? ""),
  );
  const [verSolucion, setVerSolucion] = useState(false);
  /**
   * Que muestra la columna derecha. Arranca en el preview porque el resultado
   * es lo que el alumno mira mientras escribe, pero el HTML esta a un clic:
   * sin verlo esta aplicando CSS a un marcado que no conoce, y `.hero h1` no
   * significa nada si nunca vio que hay un h1 adentro de .hero.
   */
  const [panel, setPanel] = useState<"preview" | "html">("preview");

  // Se califica en vivo para pintar el estado de cada paso mientras escribe.
  // El veredicto que cuenta lo da el servidor al enviar; esto es la guia.
  const calificacion = calificar(exercise, codigo);
  const detalle =
    calificacion.calificable && "pasos" in calificacion ? calificacion.pasos : [];

  const cumplidos = detalle.filter((d) => d.cumplido).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold text-editor-text leading-relaxed whitespace-pre-wrap">
        {exercise.prompt}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Los pasos, numerados, visibles ANTES de intentar nada. */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-purple" />
              <span className="text-xs font-medium text-editor-muted uppercase tracking-wider">
                Reto integrador
              </span>
            </div>
            <span className="text-xs font-mono text-editor-muted">
              {cumplidos} de {pasos.length}
            </span>
          </div>

          <ol className="flex flex-col gap-2">
            {pasos.map((paso, i) => {
              const cumplido = detalle[i]?.cumplido ?? false;
              return (
                <li
                  key={paso.instruccion}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    cumplido
                      ? "border-neon-green/40 bg-neon-green/5"
                      : "border-editor-border bg-editor-surface"
                  }`}
                >
                  <span
                    className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      cumplido
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-editor-bg text-editor-muted"
                    }`}
                    aria-label={cumplido ? "Cumplido" : "Pendiente"}
                  >
                    {cumplido ? "✓" : i + 1}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      cumplido ? "text-editor-muted" : "text-editor-text"
                    }`}
                  >
                    {paso.instruccion}
                  </span>
                </li>
              );
            })}
          </ol>

          <CSSEditor
            value={codigo}
            onChange={setCodigo}
            height="240px"
            readOnly={submitted}
            language={escribeHtml ? "html" : "css"}
          />
        </div>

        <div className="flex flex-col gap-2">
          {/* El HTML es de SOLO LECTURA: el reto es escribir el CSS, y poder
              cambiar el marcado convertiria "aplicale esto a .hero" en
              "renombra la clase y listo". */}
          <div className="flex items-center gap-1 px-1" role="tablist">
            {(
              escribeHtml
                ? ([["preview", "Vista previa", "bg-neon-green"]] as const)
                : ([
                    ["preview", "Vista previa", "bg-neon-green"],
                    ["html", "HTML", "bg-neon-orange"],
                  ] as const)
            ).map(([clave, etiqueta, punto]) => (
              <button
                key={clave}
                role="tab"
                aria-selected={panel === clave}
                onClick={() => setPanel(clave)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                  panel === clave
                    ? "bg-editor-surface text-editor-text"
                    : "text-editor-muted hover:text-editor-text"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${panel === clave ? punto : "bg-editor-border"}`} />
                {etiqueta}
              </button>
            ))}
            {panel === "html" && (
              <span className="ml-auto text-[10px] font-mono text-editor-muted">
                solo lectura
              </span>
            )}
          </div>

          {panel === "preview" ? (
            <LivePreview
              html={escribeHtml ? codigo : plantilla}
              css={escribeHtml ? "" : codigo}
              className="flex-1 min-h-[300px]"
            />
          ) : (
            <CSSEditor
              value={plantilla}
              onChange={() => {}}
              height="300px"
              readOnly
              language="html"
            />
          )}
        </div>
      </motion.div>

      {/* La solucion, solo para quien ya lo resolvio. */}
      {yaCompletado && exercise.referenceSolution && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setVerSolucion((v) => !v)}
            className="self-start text-xs font-medium text-editor-muted hover:text-neon-blue transition-colors"
          >
            {verSolucion ? "Ocultar" : "Ver"} la solucion de referencia
          </button>
          {verSolucion && (
            <pre className="p-4 rounded-xl bg-editor-bg border border-editor-border text-xs font-mono text-editor-text overflow-x-auto">
              {exercise.referenceSolution}
            </pre>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {exercise.hint && !submitted && <HintButton hint={exercise.hint} />}
        {!submitted && (
          <button
            onClick={() => onSubmit(codigo)}
            className="ml-auto px-6 py-2.5 rounded-xl bg-neon-purple text-white font-semibold text-sm hover:bg-neon-purple/90 transition-colors shadow-lg shadow-neon-purple/20"
          >
            Verificar el reto
          </button>
        )}
      </div>
    </div>
  );
}
