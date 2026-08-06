import { construirHarness, interpretarMensaje } from "./jsBehavior";
import type { JsBehaviorCase, JsRunOutcome } from "@/types";

/**
 * Runs a submission in a Web Worker and resolves with what it did.
 *
 * The worker is not a detail, it is the point. Grading first ran in the preview
 * iframe, and a `while (true)` in a submission froze the whole tab -- a srcdoc
 * iframe shares its thread with the page, so React, the deadline and the UI all
 * stopped with it. A worker has its own thread, so the page stays responsive,
 * and `terminate()` genuinely kills a spinning one instead of merely abandoning
 * it.
 *
 * The cost, accepted deliberately: a worker has no DOM. Exercises that
 * manipulate the DOM cannot be graded this way and stay on other exercise types.
 */

/** Deadline for a submission. Generous for real work, short enough to feel like an answer. */
export const LIMITE_MS = 2000;

export interface OpcionesRun {
  limiteMs?: number;
  /** Injected by tests. Production passes nothing and gets a Blob worker. */
  crearWorker?: (fuente: string) => Worker;
}

function crearWorkerDesdeFuente(fuente: string): Worker {
  const blob = new Blob([fuente], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  // Revoking immediately is safe: the worker already holds the script it loaded,
  // and leaving the URL alive leaks it for the lifetime of the document.
  URL.revokeObjectURL(url);
  return worker;
}

/**
 * Never rejects. Every failure mode is a `JsRunOutcome`, because a student's
 * mistake is data about their code, not an exception for the caller to handle.
 */
export function ejecutarRun(
  codigo: string,
  cases: JsBehaviorCase[],
  opciones: OpcionesRun = {}
): Promise<JsRunOutcome> {
  const limiteMs = opciones.limiteMs ?? LIMITE_MS;
  const crear = opciones.crearWorker ?? crearWorkerDesdeFuente;
  const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return new Promise<JsRunOutcome>((resolve) => {
    let terminado = false;
    let worker: Worker;

    const cerrar = (outcome: JsRunOutcome) => {
      if (terminado) return;
      terminado = true;
      clearTimeout(temporizador);
      try {
        worker.terminate();
      } catch {
        // Terminating twice, or terminating a worker that never started, is not
        // a problem worth surfacing to the student.
      }
      resolve(outcome);
    };

    const temporizador = setTimeout(() => cerrar({ kind: "timeout" }), limiteMs);

    try {
      worker = crear(construirHarness(codigo, cases, nonce));
    } catch {
      // A worker that cannot even be created (blocked by CSP, for instance) is
      // not the student's fault and must not read as a wrong answer.
      clearTimeout(temporizador);
      resolve({ kind: "syntax-error", message: "no se pudo iniciar el evaluador" });
      return;
    }

    worker.addEventListener("message", (ev: MessageEvent) => {
      const outcome = interpretarMensaje(ev.data, nonce, cases);
      // A message that is not ours is ignored rather than treated as a result.
      if (outcome) cerrar(outcome);
    });

    worker.addEventListener("error", (ev: ErrorEvent) => {
      // Reaches here for a failure the harness could not catch itself. A syntax
      // error inside the submission does NOT: the harness builds it with
      // `new Function`, which throws at construction time and is catchable.
      cerrar({ kind: "syntax-error", message: ev.message || "error al ejecutar" });
    });
  });
}
