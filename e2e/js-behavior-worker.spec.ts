import { test, expect } from "@playwright/test";
import { construirHarness } from "../src/lib/jsBehavior";

/**
 * Task 2.8 of openspec/changes/js-behavior-validator, second attempt.
 *
 * The first version ran the harness in the preview iframe and proved two things:
 * a message DOES cross a `sandbox="allow-scripts"` boundary with `origin ===
 * "null"`, and a `while (true)` in that iframe FREEZES the parent page, because
 * a srcdoc iframe shares its thread. The second finding refuted the design's
 * timeout strategy and moved the executor to a Web Worker.
 *
 * These tests exist because unit tests cannot reach any of it: the harness unit
 * tests run in jsdom with a stubbed `self`, so they prove the logic and nothing
 * about a real worker, a real Blob URL, or `terminate()` actually stopping a
 * spinning loop.
 */

const CASOS = [
  { call: "sumar(1, 2)", expect: 3 },
  { call: "sumar(-1, 1)", expect: 0 },
];

/** A page with a heartbeat, so "did the UI freeze" is measurable. */
async function montarPagina(page: import("@playwright/test").Page) {
  await page.setContent(`<!DOCTYPE html><html><body>
<script>
  window.__latidos = 0;
  setInterval(function () { window.__latidos++; }, 20);
  window.__recibidos = [];
  window.__correr = function (fuente, ms) {
    var url = URL.createObjectURL(new Blob([fuente], { type: "text/javascript" }));
    var w = new Worker(url);
    URL.revokeObjectURL(url);
    w.addEventListener("message", function (ev) { window.__recibidos.push(ev.data); });
    if (ms) setTimeout(function () { w.terminate(); window.__terminado = true; }, ms);
    return true;
  };
</script>
</body></html>`);
}

test("el harness corre en un worker y devuelve resultados", async ({ page }) => {
  await montarPagina(page);
  const fuente = construirHarness("const sumar = (a, b) => a + b;", CASOS, "nonce-w");

  await page.evaluate((f) => (window as never as { __correr: (s: string) => void }).__correr(f), fuente);
  await page.waitForFunction(() => (window as never as { __recibidos: unknown[] }).__recibidos.length > 0);

  const recibidos = await page.evaluate(
    () => (window as never as { __recibidos: unknown[] }).__recibidos
  );
  const msg = recibidos[0] as {
    fuente: string;
    nonce: string;
    resultado: { kind: string; observaciones: unknown[] };
  };

  expect(msg.fuente).toBe("js-behavior");
  expect(msg.nonce).toBe("nonce-w");
  expect(msg.resultado.kind).toBe("ok");
  expect(msg.resultado.observaciones).toHaveLength(2);
});

test("`new Function` funciona dentro del worker", async ({ page }) => {
  // El harness evalua el codigo del alumno con `new Function`. Si una CSP sin
  // unsafe-eval lo bloqueara, todo el enfoque se cae -- y fallaria en produccion,
  // no aca. Este test lo fija como requisito explicito del entorno.
  await montarPagina(page);
  const fuente = construirHarness("function sumar(a, b) { return a + b; }", CASOS, "nonce-fn");

  await page.evaluate((f) => (window as never as { __correr: (s: string) => void }).__correr(f), fuente);
  await page.waitForFunction(() => (window as never as { __recibidos: unknown[] }).__recibidos.length > 0);

  const msg = (await page.evaluate(
    () => (window as never as { __recibidos: unknown[] }).__recibidos
  ))[0] as { resultado: { kind: string } };
  expect(msg.resultado.kind).toBe("ok");
});

test("un error de sintaxis llega como error de sintaxis", async ({ page }) => {
  await montarPagina(page);
  const fuente = construirHarness("function sumar(a, b) { return a + }", CASOS, "nonce-sx");

  await page.evaluate((f) => (window as never as { __correr: (s: string) => void }).__correr(f), fuente);
  await page.waitForFunction(() => (window as never as { __recibidos: unknown[] }).__recibidos.length > 0);

  const msg = (await page.evaluate(
    () => (window as never as { __recibidos: unknown[] }).__recibidos
  ))[0] as { resultado: { kind: string; message: string } };

  expect(msg.resultado.kind).toBe("syntax-error");
  expect(msg.resultado.message.length).toBeGreaterThan(0);
});

test("un bucle infinito NO congela la pagina, y terminate() lo mata", async ({ page }) => {
  // Esta es la razon de existir del worker, y en el iframe era imposible de
  // asertar: la pagina quedaba tan bloqueada que ni el timeout de Playwright
  // podia rechazar. Aca el latido sigue y la pagina responde.
  await montarPagina(page);
  const fuente = construirHarness("while (true) {}", CASOS, "nonce-loop");

  const antes = await page.evaluate(() => (window as never as { __latidos: number }).__latidos);
  await page.evaluate(
    (f) => (window as never as { __correr: (s: string, ms: number) => void }).__correr(f, 400),
    fuente
  );

  // La pagina sigue viva CON el bucle corriendo: esto es lo que el iframe no daba.
  await page.waitForTimeout(600);
  const despues = await page.evaluate(() => (window as never as { __latidos: number }).__latidos);
  expect(despues).toBeGreaterThan(antes);

  // El worker se termino y nunca mando nada.
  expect(await page.evaluate(() => (window as never as { __terminado: boolean }).__terminado)).toBe(true);
  expect(await page.evaluate(() => (window as never as { __recibidos: unknown[] }).__recibidos)).toHaveLength(0);

  // Y la pagina sigue respondiendo despues.
  expect(await page.evaluate(() => 1 + 1)).toBe(2);
});
