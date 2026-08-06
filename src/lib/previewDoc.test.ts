import { describe, expect, it } from "vitest";
import { construirSrcDoc } from "./previewDoc";

/**
 * Task 2.1 of openspec/changes/js-behavior-validator, written BEFORE the harness
 * touched LivePreview.
 *
 * 28 modules across four tracks depend on this document for their previews. The
 * expected string below is a golden copy of what the component produced before
 * behavioral grading existed -- written out literally, not generated -- so it
 * still fails if someone "tidies" the template later.
 */

const ESPERADO_SIN_HARNESS = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: white; }
    .caja { color: red; }
  </style>
</head>
<body>
  <div class="caja">hola</div>
  <script>console.log(1);</script>
</body>
</html>`;

describe("construirSrcDoc", () => {
  it("produce EXACTAMENTE el documento de antes", () => {
    const doc = construirSrcDoc({
      html: '<div class="caja">hola</div>',
      css: ".caja { color: red; }",
      js: "console.log(1);",
    });
    expect(doc).toBe(ESPERADO_SIN_HARNESS);
  });

  it("sin js no emite la etiqueta script", () => {
    const doc = construirSrcDoc({ html: "<p>a</p>", css: "" });
    expect(doc).not.toContain("<script>");
  });

});
