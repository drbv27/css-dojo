/**
 * Builds the document served to the preview iframe.
 *
 * Extracted from LivePreview so it can be asserted directly. 28 modules depend
 * on this output for their previews, and `previewDoc.test.ts` pins it byte for
 * byte -- written out as a literal, so it still fails if someone tidies the
 * template later.
 *
 * It carries NO grading harness. Grading briefly ran here and was moved to a Web
 * Worker after measuring that a `while (true)` in a submission froze the whole
 * tab: a srcdoc iframe shares its thread with the page. The iframe's only job is
 * showing the student their own result.
 */

export interface DocumentoPreview {
  html: string;
  css: string;
  js?: string;
}

export function construirSrcDoc({ html, css, js = "" }: DocumentoPreview): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: white; }
    ${css}
  </style>
</head>
<body>
  ${html}
  ${js ? `<script>${js}<\/script>` : ""}
</body>
</html>`;
}
