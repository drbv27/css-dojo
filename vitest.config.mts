import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // Narrowed so Vitest's default glob does not also collect Playwright's
    // e2e/*.spec.ts files and try to run them under jsdom.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
