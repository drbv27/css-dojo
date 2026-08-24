import { describe, expect, it, vi } from "vitest";
import { ejecutarRun } from "./jsRunner";
import type { JsBehaviorCase } from "@/types";

/**
 * The worker transport, tested by injecting a fake worker.
 *
 * A real Worker needs a browser, and e2e/js-behavior-worker.spec.ts already
 * proves the real one: that the harness runs in it, that `new Function` works
 * inside it, and that `terminate()` stops a spinning loop without freezing the
 * page. What is left to test is the runner's own logic -- the deadline, the
 * nonce filtering, and that it never rejects -- and that does not need a
 * browser.
 */

const CASOS: JsBehaviorCase[] = [{ call: "f()", expect: 1 }];

/** A worker whose messages the test drives by hand. */
function workerFalso() {
  const oyentes: Record<string, ((ev: unknown) => void)[]> = {};
  const terminado = { valor: false };

  const worker = {
    addEventListener(tipo: string, fn: (ev: unknown) => void) {
      (oyentes[tipo] ??= []).push(fn);
    },
    terminate() {
      terminado.valor = true;
    },
  };

  return {
    worker: worker as unknown as Worker,
    terminado,
    emitir(tipo: string, ev: unknown) {
      for (const fn of oyentes[tipo] ?? []) fn(ev);
    },
    /** The nonce the runner generated, read off the harness it built. */
    nonceDe(fuente: string) {
      return /var NONCE = "([^"]+)"/.exec(fuente)?.[1] ?? "";
    },
  };
}

describe("ejecutarRun", () => {
  it("resuelve con el resultado y termina el worker", async () => {
    const f = workerFalso();
    let fuente = "";

    const promesa = ejecutarRun("function f() { return 1; }", CASOS, {
      crearWorker: (src) => {
        fuente = src;
        return f.worker;
      },
    });

    f.emitir("message", {
      data: {
        fuente: "js-behavior",
        nonce: f.nonceDe(fuente),
        resultado: { kind: "ok", observaciones: [{ estado: "valor", json: "1" }] },
      },
    });

    await expect(promesa).resolves.toEqual({ kind: "ok", cases: [{ kind: "pass" }] });
    expect(f.terminado.valor).toBe(true);
  });

  it("ignora un mensaje ajeno y sigue esperando el propio", async () => {
    const f = workerFalso();
    let fuente = "";
    const promesa = ejecutarRun("function f() { return 1; }", CASOS, {
      crearWorker: (src) => {
        fuente = src;
        return f.worker;
      },
    });

    // Ruido: otra fuente, y el nonce equivocado.
    f.emitir("message", { data: { fuente: "otra-cosa", nonce: "x" } });
    f.emitir("message", {
      data: { fuente: "js-behavior", nonce: "viejo", resultado: { kind: "ok", observaciones: [] } },
    });
    expect(f.terminado.valor).toBe(false);

    f.emitir("message", {
      data: {
        fuente: "js-behavior",
        nonce: f.nonceDe(fuente),
        resultado: { kind: "ok", observaciones: [{ estado: "valor", json: "1" }] },
      },
    });
    await expect(promesa).resolves.toMatchObject({ kind: "ok" });
  });

  it("al vencer el plazo devuelve timeout y MATA el worker", async () => {
    vi.useFakeTimers();
    const f = workerFalso();
    const promesa = ejecutarRun("while (true) {}", CASOS, {
      limiteMs: 50,
      crearWorker: () => f.worker,
    });

    await vi.advanceTimersByTimeAsync(60);
    await expect(promesa).resolves.toEqual({ kind: "timeout" });
    // Matarlo es la diferencia con el iframe, donde el bucle solo se abandonaba.
    expect(f.terminado.valor).toBe(true);
    vi.useRealTimers();
  });

  it("un mensaje tardio no pisa el timeout ya entregado", async () => {
    vi.useFakeTimers();
    const f = workerFalso();
    let fuente = "";
    const promesa = ejecutarRun("while (true) {}", CASOS, {
      limiteMs: 50,
      crearWorker: (src) => {
        fuente = src;
        return f.worker;
      },
    });

    await vi.advanceTimersByTimeAsync(60);
    f.emitir("message", {
      data: {
        fuente: "js-behavior",
        nonce: f.nonceDe(fuente),
        resultado: { kind: "ok", observaciones: [{ estado: "valor", json: "1" }] },
      },
    });

    await expect(promesa).resolves.toEqual({ kind: "timeout" });
    vi.useRealTimers();
  });

  it("un error del worker se reporta, no se traga", async () => {
    const f = workerFalso();
    const promesa = ejecutarRun("f()", CASOS, { crearWorker: () => f.worker });
    f.emitir("error", { message: "boom" });
    await expect(promesa).resolves.toEqual({ kind: "syntax-error", message: "boom" });
  });

  it("si el worker no se puede crear, no es culpa del alumno", async () => {
    // Por ejemplo una CSP sin unsafe-eval. Devolver "incorrecto" seria mentirle.
    const outcome = await ejecutarRun("f()", CASOS, {
      crearWorker: () => {
        throw new Error("bloqueado");
      },
    });
    expect(outcome).toEqual({ kind: "syntax-error", message: "no se pudo iniciar el evaluador" });
  });

  it("nunca rechaza", async () => {
    const f = workerFalso();
    const promesa = ejecutarRun("f()", CASOS, { crearWorker: () => f.worker });
    f.emitir("message", { data: null });
    f.emitir("error", { message: "" });
    await expect(promesa).resolves.toBeDefined();
  });
});
