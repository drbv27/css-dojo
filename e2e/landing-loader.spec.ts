import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "fs";

// E2E coverage for loader-moderno-dojo Phase 5 (design.md §Manual QA).
//
// These scenarios were written as a manual procedure because the session that
// planned them had no browser. They are automated here instead, with two
// deliberate exceptions kept manual and documented at the bottom of this file.
//
// Why real waits instead of `page.clock`: the loader's thresholds are plain
// `setTimeout`s, but the page also runs a react-three-fiber render loop on
// requestAnimationFrame. Faking the clock stalls that loop, so the scenarios
// are driven in real time. Cost is ~35 s of wall clock, paid once per run.
//
// Why the polling is coarse: this environment's Chromium renders WebGL through
// SwiftShader, so the page is slow once the canvas is live. Tight polling loops
// take minutes. Every assertion below either waits on a state change or takes a
// small number of single-round-trip snapshots.

const ASSET_GLOB = "**/models/ninja/*.glb";
const CIRCUNFERENCIA = 2 * Math.PI * 42;

const bytes = (nombre: string) => readFileSync(`public/models/ninja/${nombre}`);
const esMesh = (url: string) => url.endsWith("/ninja.glb");

/** Serves the real .glb bytes, optionally delaying the mesh, the clips, or both. */
async function servirAssets(
  page: Page,
  { mesh = 0, clips = 0 }: { mesh?: number; clips?: number } = {},
) {
  await page.route(ASSET_GLOB, async (route) => {
    const url = route.request().url();
    const espera = esMesh(url) ? mesh : clips;
    if (espera) await new Promise((r) => setTimeout(r, espera));
    await route.fulfill({
      status: 200,
      contentType: "model/gltf-binary",
      body: bytes(url.split("/").pop()!),
    });
  });
}

/** Holds the mesh request open for `ms`, which freezes `progress` at 0. */
async function colgarMesh(page: Page, ms: number) {
  await page.route("**/models/ninja/ninja.glb", async () => {
    await new Promise((r) => setTimeout(r, ms));
  });
}

/** One round trip: everything the loader renders, read straight from the DOM. */
function leerOverlay(page: Page) {
  return page.evaluate(() => {
    const arco = document.querySelector('[data-testid="enso-arco"]');
    const caption = document.querySelector('[data-testid="caption-progreso"]');
    const svg = arco?.closest("svg") ?? null;
    return {
      overlay: document.querySelectorAll('[role="status"]').length,
      anuncio: document.querySelector('[role="status"]')?.textContent ?? null,
      busy: document.querySelector('[role="status"]')?.getAttribute("aria-busy") ?? null,
      caption: caption?.textContent ?? null,
      pct: caption ? Number(/(\d+)\s*%/.exec(caption.textContent ?? "")?.[1] ?? NaN) : null,
      offset: arco ? Number(arco.getAttribute("stroke-dashoffset")) : null,
      trazo: arco?.getAttribute("stroke") ?? null,
      hint: document.querySelectorAll('[data-testid="hint-visible"]').length,
      error: document.querySelectorAll('[data-testid="error-visible"]').length,
      pulse: document.querySelectorAll('[data-testid="enso-pulse"]').length,
      svgOculto: svg?.getAttribute("aria-hidden") ?? null,
      canvas: document.querySelectorAll("canvas").length,
      nav: document.querySelectorAll('a[href="/login"]').length,
    };
  });
}

/** Records every distinct value the aria-live region takes, without polling. */
async function grabarAnuncios(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __anuncios: string[] };
    w.__anuncios = [];
    new MutationObserver(() => {
      const t = document.querySelector('[role="status"]')?.textContent?.trim();
      if (t && w.__anuncios[w.__anuncios.length - 1] !== t) w.__anuncios.push(t);
    }).observe(document, { childList: true, subtree: true, characterData: true });
  });
}

const anuncios = (page: Page) =>
  page.evaluate(() => (window as unknown as { __anuncios: string[] }).__anuncios ?? []);

// 5.1 — Happy path. The visual half (arc drawn clockwise from 12 o'clock, the
// blue→purple gradient, no blank frame between fade-out and first canvas paint)
// stays manual: those are pixels, and this asserts DOM and network.
test("5.1 happy path: el overlay traza, cierra el anillo y se va dejando el canvas", async ({ page }) => {
  test.setTimeout(60_000);
  const RETRASO_MESH = 5000; // deliberately past ARRANQUE_MS (2.5 s)
  await servirAssets(page, { mesh: RETRASO_MESH });
  const t0 = Date.now();
  await page.goto("/landing-preview", { waitUntil: "commit" });

  const caption = page.getByTestId("caption-progreso");
  await caption.waitFor({ state: "attached", timeout: 15_000 });
  const alMontar = await leerOverlay(page);
  expect(alMontar.overlay).toBe(1);
  expect(alMontar.busy).toBe("true");
  expect(alMontar.caption).toMatch(/^Preparando el dojo… \d+ %$/);
  // Ring starts open: the full circumference is hidden.
  expect(alMontar.offset).toBeCloseTo(CIRCUNFERENCIA, 1);

  // Positive control for the fix in Personaje.tsx. The mesh is held back past
  // ARRANQUE_MS on purpose: if the loader ever goes back to resolving on its
  // cold-start timer rather than on the load, it dismisses at roughly
  // 2.5 s + HOLD_MS + SALIDA_MS ≈ 3.5 s, and both assertions below fail —
  // the overlay is gone at 4.2 s, and it left before the asset ever arrived.
  //
  // Verified by reverting the fix and re-running: this test goes red. An
  // earlier version asserted only `dismissal > 1500 ms`, which the broken
  // build satisfied too, so it proved nothing.
  await page.waitForTimeout(4200 - (Date.now() - t0));
  expect(
    (await leerOverlay(page)).overlay,
    "el overlay no puede irse antes de que llegue el asset",
  ).toBe(1);

  await caption.waitFor({ state: "detached", timeout: 30_000 });
  expect(Date.now() - t0).toBeGreaterThan(RETRASO_MESH);

  await expect(page.locator("canvas")).toHaveCount(1);
  const alFinal = await leerOverlay(page);
  expect(alFinal.overlay).toBe(0);
  expect(alFinal.error).toBe(0);
});

// 5.2 — Determinate tracking: the arc must agree with the caption and never go
// backwards, and the stall hint must stay away while the number keeps moving.
test("5.2 progreso determinado: el arco sigue al caption de forma monótona y sin hint", async ({ page }) => {
  test.setTimeout(60_000);
  // Mesh first, clips staggered behind it, so `progress` climbs in real steps
  // instead of jumping 0 → 100 the way an unthrottled localhost load does.
  await servirAssets(page, { mesh: 800, clips: 2500 });
  await page.goto("/landing-preview", { waitUntil: "commit" });
  await page.getByTestId("caption-progreso").waitFor({ state: "attached", timeout: 15_000 });

  const muestras = [];
  for (let i = 0; i < 6; i++) {
    muestras.push(await leerOverlay(page));
    await page.waitForTimeout(500);
  }

  const conCaption = muestras.filter((m) => m.pct !== null && !Number.isNaN(m.pct));
  expect(conCaption.length).toBeGreaterThan(2);

  for (const m of conCaption) {
    // The arc is derived from the same percentage the caption prints, so a
    // drift here means the two rendered from different values.
    expect(m.offset).toBeCloseTo(CIRCUNFERENCIA * (1 - m.pct! / 100), 1);
    // HINT_MS is 8 s and no sample here is past 3 s of advancing load.
    expect(m.hint).toBe(0);
    expect(m.error).toBe(0);
  }

  const pcts = conCaption.map((m) => m.pct!);
  expect(pcts).toEqual([...pcts].sort((a, b) => a - b));
});

// 5.3 — The 8 s stall hint. Both halves matter: absent before the threshold,
// present after. Asserting only "the hint is there" would pass even if the
// element rendered from mount, which is exactly the bug this guards.
test("5.3 hint de 8s: ausente a los 7s, presente a los 9.5s, y se retracta al avanzar", async ({ page }) => {
  test.setTimeout(90_000);
  let liberar = () => {};
  const congelado = new Promise<void>((r) => { liberar = r; });
  await page.route("**/models/ninja/ninja.glb", async (route) => {
    await congelado;
    await route.fulfill({ status: 200, contentType: "model/gltf-binary", body: bytes("ninja.glb") });
  });

  const t0 = Date.now();
  await page.goto("/landing-preview", { waitUntil: "commit" });
  await page.getByTestId("caption-progreso").waitFor({ state: "attached", timeout: 15_000 });

  await page.waitForTimeout(7000 - (Date.now() - t0));
  const antes = await leerOverlay(page);
  expect(antes.hint, "el hint no puede existir antes de HINT_MS").toBe(0);
  expect(antes.anuncio).toBe("Preparando el dojo…");

  await page.waitForTimeout(9500 - (Date.now() - t0));
  const despues = await leerOverlay(page);
  expect(despues.hint).toBe(1);
  expect(despues.anuncio).toBe("La conexión va lenta, seguimos cargando.");
  expect(despues.error, "un stall no es un error todavía").toBe(0);

  // Restoring the connection must retract the hint on the next genuine advance.
  liberar();
  await expect(page.getByTestId("hint-visible")).toHaveCount(0, { timeout: 15_000 });
});

// 5.4 — The 20 s escape. Same two-sided assertion as 5.3.
test("5.4 escape de 20s: ausente a los 19s, presente a los 22s con foco, y lleva a la estática", async ({ page }) => {
  test.setTimeout(90_000);
  await colgarMesh(page, 60_000);

  const t0 = Date.now();
  await page.goto("/landing-preview", { waitUntil: "commit" });
  await page.getByTestId("caption-progreso").waitFor({ state: "attached", timeout: 15_000 });

  await page.waitForTimeout(19_000 - (Date.now() - t0));
  const antes = await leerOverlay(page);
  expect(antes.error, "el estado de error no puede existir antes de ESCAPE_MS").toBe(0);
  expect(antes.trazo).toBe("url(#enso-grad)");

  await page.waitForTimeout(22_000 - (Date.now() - t0));
  const despues = await leerOverlay(page);
  expect(despues.error).toBe(1);
  expect(despues.trazo).toBe("var(--color-neon-red)");
  expect(despues.hint, "el hint cede el lugar al error").toBe(0);
  expect(despues.caption, "el caption se oculta para no contradecir al error").toBeNull();

  const escape = page.getByRole("button", { name: "Continuar sin la escena" });
  await expect(escape).toBeFocused();
  await escape.click();

  const tras = await leerOverlay(page);
  expect(tras.overlay).toBe(0);
  expect(tras.canvas, "LandingEstatica no monta el Canvas").toBe(0);
  expect(tras.nav).toBeGreaterThan(0);
});

// 5.5 — A 404 on the mesh. Served through page.route rather than renaming a
// tracked file, so the repo is never mutated and nothing needs restoring.
//
// The late case is a regression guard: a failure that lands after the load has
// otherwise settled used to be swallowed by the `terminado` latch, leaving the
// visitor on a bare nav with no scene, no message and no way out.
for (const [nombre, retraso] of [["inmediato", 0], ["tardío", 3500]] as const) {
  test(`5.5 asset 404 ${nombre}: el boundary atrapa el throw y ofrece el escape`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.route("**/models/ninja/ninja.glb", async (route) => {
      if (retraso) await new Promise((r) => setTimeout(r, retraso));
      await route.fulfill({ status: 404, body: "not found" });
    });

    await page.goto("/landing-preview", { waitUntil: "commit" });
    await expect(page.getByTestId("error-visible")).toHaveCount(1, { timeout: 30_000 });

    const estado = await leerOverlay(page);
    expect(estado.trazo).toBe("var(--color-neon-red)");
    expect(estado.caption).toBeNull();
    await expect(page.getByRole("button", { name: "Continuar sin la escena" })).toBeVisible();

    // Measured: the loader can reach its error phase one render before the
    // boundary unmounts the subtree, because drei's `onError` fires on the
    // failed fetch while react-three-fiber only rethrows on its next render.
    // The contract is that the canvas goes away, not that it goes away in the
    // same frame — so this retries instead of sampling once.
    await expect(page.locator("canvas"), "el boundary desmonta el Canvas").toHaveCount(0, {
      timeout: 10_000,
    });

    // What must NOT happen is Next's runtime-error screen taking over the page.
    // Deliberately not asserted here: the absence of a `pageerror`. Measured in
    // dev, React still surfaces the caught error to `window` even though the
    // boundary handled it and rendered the right UI, so its absence is not a
    // signal about the boundary. design.md §Manual QA step 5 says as much and
    // asks for this step to be re-run under `npm run build && npm start`; that
    // production re-run stays manual (see tasks.md 5.5).
    expect(await page.evaluate(() => /Unhandled Runtime Error|Build Error/.test(document.body.innerText))).toBe(false);
  });
}

// 5.6 — Reduced motion. This is the gap `automated-gates` recorded as open
// because its toolset could not emulate the preference; Playwright can.
test("5.6 reduced-motion a mitad de carga: el pulse para y el arco sigue trackeando", async ({ page }) => {
  test.setTimeout(60_000);
  await servirAssets(page, { mesh: 2000, clips: 3000 });
  await page.goto("/landing-preview", { waitUntil: "commit" });
  await page.getByTestId("caption-progreso").waitFor({ state: "attached", timeout: 15_000 });

  const conMovimiento = await leerOverlay(page);
  expect(conMovimiento.pulse, "el pulse existe mientras el movimiento está permitido").toBe(1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByTestId("enso-pulse")).toHaveCount(0, { timeout: 5000 });

  // The preference suppresses decoration, never the progress signal itself.
  const reducido = await leerOverlay(page);
  expect(reducido.overlay).toBe(1);
  expect(reducido.offset).toBeCloseTo(CIRCUNFERENCIA * (1 - reducido.pct! / 100), 1);
});

test("5.6b reduced-motion desde el arranque: cae en la estática sin loader", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/landing-preview", { waitUntil: "commit" });
  await expect(page.locator('a[href="/login"]').first()).toBeVisible();

  const estado = await leerOverlay(page);
  expect(estado.overlay, "debeUsar3D() es false, así que el Loader nunca monta").toBe(0);
  expect(estado.canvas).toBe(0);
});

// 5.7 — Announcements. The DOM half is asserted here; confirming that Orca or
// NVDA actually speak these strings stays manual.
test("5.7 anuncios: por hitos gruesos, nunca por porcentaje, y el svg no se anuncia", async ({ page }) => {
  test.setTimeout(60_000);
  await grabarAnuncios(page);
  await servirAssets(page, { mesh: 800, clips: 2000 });
  await page.goto("/landing-preview", { waitUntil: "commit" });

  await page.getByTestId("caption-progreso").waitFor({ state: "attached", timeout: 15_000 });
  const montado = await leerOverlay(page);
  expect(montado.svgOculto, "el anillo es decorativo").toBe("true");
  expect(montado.busy).toBe("true");

  await page.getByTestId("caption-progreso").waitFor({ state: "detached", timeout: 30_000 });
  const dichos = await anuncios(page);

  expect(dichos[0]).toBe("Preparando el dojo…");
  expect(dichos.at(-1)).toBe("Dojo listo.");
  // Milestones are floor(pct/25)*25, so at most: start, 25, 50, 75, 100, done.
  expect(dichos.length).toBeLessThanOrEqual(6);
  for (const d of dichos) {
    expect(d).toMatch(/^(Preparando el dojo…|Preparando el dojo, (25|50|75|100) %|Dojo listo\.)$/);
  }
});

// 5.8 — Keyboard reachability in the error state.
test("5.8 teclado: Tab llega al botón de escape y Enter lo activa", async ({ page }) => {
  test.setTimeout(60_000);
  await page.route("**/models/ninja/ninja.glb", (route) => route.fulfill({ status: 404, body: "nope" }));
  await page.goto("/landing-preview", { waitUntil: "commit" });

  const escape = page.getByRole("button", { name: "Continuar sin la escena" });
  await expect(escape).toBeVisible({ timeout: 30_000 });

  // The error state moves focus itself; blur first so Tab has to earn it.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let i = 0; i < 12 && !(await escape.evaluate((b) => b === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(escape).toBeFocused();

  await page.keyboard.press("Enter");
  const tras = await leerOverlay(page);
  expect(tras.overlay).toBe(0);
  expect(tras.canvas).toBe(0);
  expect(tras.nav).toBeGreaterThan(0);
});

// 5.9 — The dismissal latch is one-way.
test("5.9 latch de descarte: el overlay no reaparece al scrollear el landing", async ({ page }) => {
  test.setTimeout(60_000);
  await servirAssets(page);
  await page.goto("/landing-preview", { waitUntil: "commit" });
  await page.getByTestId("caption-progreso").waitFor({ state: "detached", timeout: 30_000 });
  await expect(page.locator('[role="status"]')).toHaveCount(0);

  for (const y of [800, 2400, 4000, 6000, 0]) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(400);
    await expect(page.locator('[role="status"]'), `overlay reapareció en y=${y}`).toHaveCount(0);
  }
});

// Deliberately NOT automated, and why:
//
//   5.1 (visual half) — arc drawn clockwise from 12 o'clock, the blue→purple
//       gradient, and "no blank frame between fade-out and first canvas paint".
//       These are pixels. A DOM assertion cannot distinguish a correct gradient
//       from an inverted one, and this environment renders through SwiftShader,
//       so a screenshot baseline would encode software-rasteriser output rather
//       than what a visitor sees.
//
//   5.7 (screen-reader half) — that Orca or NVDA actually speak these strings.
//       The assertions above prove the text, the roles and the milestone
//       cadence; they cannot prove the speech.
