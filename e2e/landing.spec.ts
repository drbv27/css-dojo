import { test, expect } from "@playwright/test";

// Smoke test only. Targets /landing-preview (not /) per orchestrator
// instruction: it renders Landing3D directly with hasSession hardcoded to
// false, needs no MONGODB_URI/cookie/session read, and has no write path —
// safe against the production database this repo's .env.local points at.
//
// Deliberately WebGL-agnostic: NavLanding renders in Landing3D's "3d" and
// "estatica" modes but not in "cargando", so seeing it proves hydration ran
// and the client-side render-mode decision resolved, regardless of whether
// this environment's Chromium exposes a WebGL context.
//
// This does NOT cover landing-loader scenario 4.2 (an error state that does
// not exist until loader-moderno-dojo is implemented).
test("landing preview boots and hydrates", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  const response = await page.goto("/landing-preview");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("link", { name: "Dev Dojo" })).toBeVisible();
  await expect(page.locator('a[href="/login"]').first()).toBeVisible();

  expect(pageErrors).toHaveLength(0);
});
