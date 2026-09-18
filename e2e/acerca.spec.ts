import { test, expect } from "@playwright/test";

// Smoke test only. Targets /acerca directly (unlike landing.spec.ts, which
// targets /landing-preview instead of /): this page is a static Server
// Component that only reads the `dev-dojo-token` cookie to pick the header
// CTA, never touches MongoDB, and has no write path — safe against the
// production database this repo's .env.local points at.
test("acerca page boots and hydrates", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  const response = await page.goto("/acerca");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href="/registro"]').first()).toBeVisible();

  expect(pageErrors).toHaveLength(0);
});
