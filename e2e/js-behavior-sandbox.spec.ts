import { test, expect } from "@playwright/test";
import { construirHarness } from "../src/lib/jsBehavior";
import { construirSrcDoc } from "../src/lib/previewDoc";

/**
 * Task 2.8 of openspec/changes/js-behavior-validator, and the assertion the
 * whole design rests on.
 *
 * The harness unit tests run in jsdom with a stubbed `parent`, so they prove the
 * harness LOGIC and nothing about the real boundary. This proves the boundary
 * itself: that a message posted from an iframe sandboxed `allow-scripts` WITHOUT
 * `allow-same-origin` -- an opaque origin, no access to the parent DOM or
 * cookies -- actually reaches the parent, and that its origin arrives as the
 * string "null" so it cannot be used to identify the sender.
 *
 * It builds the parent page itself rather than driving the app, so it fails for
 * exactly one reason: the sandbox. No auth, no database, no components.
 * HALLAZGO que invalida una restriccion del diseno, medido aparte y NO cubierto
 * por un test aca: un bucle infinito en el iframe BLOQUEA al padre. Un iframe
 * srcdoc corre en el MISMO hilo que su pagina en Chromium, asi que
 * `while (true)` congela React, el deadline y todo lo demas. Medido con un
 * contador en el padre: tickea antes de inyectar el marco, y despues
 * `page.evaluate` no vuelve.
 *
 * No hay test aca porque el hallazgo no es asertable: la pagina queda tan
 * bloqueada que ni el timeout de Playwright puede rechazar -- necesita evaluar
 * en la pagina, y la pagina esta muerta. Un test que no puede fallar de forma
 * confiable es peor que un hallazgo escrito.
 *
 * Consecuencia: "abandonar el marco con un timeout" no sirve como estrategia, y
 * el ejecutor necesita un hilo propio (Web Worker, terminable) o salir del
 * navegador.
 */

const CASOS = [
  { call: "sumar(1, 2)", expect: 3 },
  { call: "sumar(-1, 1)", expect: 0 },
];

/**
 * A parent page that records every message it receives.
 *
 * The iframe is built through the DOM instead of an HTML attribute. Passing the
 * document as a `srcdoc="..."` attribute needs HTML entity escaping, and it
 * silently truncates the document at the first inner quote -- which looks
 * exactly like "the sandbox blocks postMessage" while actually being a broken
 * test.
 */
async function montarPadre(page: import("@playwright/test").Page, srcdoc: string) {
  await page.setContent(`<!DOCTYPE html>
<html><body>
<script>
  window.__recibidos = [];
  window.addEventListener("message", function (ev) {
    window.__recibidos.push({ origin: ev.origin, data: ev.data });
  });
</script>
</body></html>`);

  await page.evaluate((doc) => {
    const marco = document.createElement("iframe");
    marco.id = "marco";
    marco.setAttribute("sandbox", "allow-scripts");
    marco.srcdoc = doc;
    document.body.appendChild(marco);
  }, srcdoc);
}

async function esperarMensajes(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => (window as never as { __recibidos: unknown[] }).__recibidos.length > 0, {
    timeout: 5000,
  });
  return page.evaluate(
    () => (window as never as { __recibidos: { origin: string; data: unknown }[] }).__recibidos
  );
}

test("un mensaje del harness cruza el sandbox allow-scripts", async ({ page }) => {
  const harness = construirHarness("const sumar = (a, b) => a + b;", CASOS, "nonce-e2e");
  await montarPadre(page, construirSrcDoc({ html: "<p>x</p>", css: "", harness }));

  const recibidos = await esperarMensajes(page);
  expect(recibidos).toHaveLength(1);

  const mensaje = recibidos[0] as {
    origin: string;
    data: { fuente: string; nonce: string; resultado: { kind: string; observaciones: unknown[] } };
  };

  // El origen NO sirve para identificar al emisor: llega como la cadena "null"
  // porque el sandbox sin allow-same-origin da un origen opaco. Por eso el
  // protocolo usa nonce.
  expect(mensaje.origin).toBe("null");
  expect(mensaje.data.fuente).toBe("js-behavior");
  expect(mensaje.data.nonce).toBe("nonce-e2e");
  expect(mensaje.data.resultado.kind).toBe("ok");
  expect(mensaje.data.resultado.observaciones).toHaveLength(2);
});

test("un error de sintaxis llega como error de sintaxis, no como silencio", async ({ page }) => {
  // Esta es la razon por la que el harness va en su PROPIA etiqueta script. Con
  // el codigo del alumno en la misma etiqueta, el error de parseo impediria
  // ejecutar el harness y el fallo llegaria como timeout.
  const codigoRoto = "function sumar(a, b) { return a + }";
  const harness = construirHarness(codigoRoto, CASOS, "nonce-sintaxis");
  await montarPadre(
    page,
    construirSrcDoc({ html: "<p>x</p>", css: "", js: codigoRoto, harness })
  );

  const recibidos = await esperarMensajes(page);
  const mensaje = recibidos[0] as {
    data: { resultado: { kind: string; message: string } };
  };

  expect(mensaje.data.resultado.kind).toBe("syntax-error");
  expect(mensaje.data.resultado.message.length).toBeGreaterThan(0);
});
