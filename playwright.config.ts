import { defineConfig, devices } from "@playwright/test";

// Puerto propio, y NO se reusa un servidor ajeno.
//
// Con `reuseExistingServer: true` y el puerto 3000, Playwright adopta lo que
// sea que este escuchando ahi y le corre esta suite. Paso dos veces el
// 2026-08-24 con el dev server de `sabio-crm-fs/frontend`: la suite de css-dojo
// se ejecuto contra otra aplicacion y `landing.spec.ts` fallo con 404 en
// `/landing-preview` por eso, no por el codigo. Un fallo por la razon
// equivocada cuesta tiempo; el mismo bug al reves -- que la otra app tuviera
// esa ruta -- daria VERDE mintiendo, y eso no se descubre nunca.
//
// Con un puerto propio la colision desaparece, y con `reuseExistingServer` en
// false una colision en 3100 falla ruidosamente en vez de adoptarse en
// silencio. `E2E_PORT` queda para quien necesite moverlo.
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: BASE },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  retries: process.env.CI ? 1 : 0,
  webServer: {
    command: process.env.CI ? `npm start -- --port ${PORT}` : `npm run dev -- --port ${PORT}`,
    url: BASE,
    reuseExistingServer: false,
  },
});
