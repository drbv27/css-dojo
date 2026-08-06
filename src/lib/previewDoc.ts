/**
 * Builds the document served to the preview iframe.
 *
 * Extracted from LivePreview so it can be asserted directly. 28 modules depend
 * on this output for their previews, and `previewDoc.test.ts` pins it byte for
 * byte: without a harness the result must be exactly what it was before
 * behavioral grading existed.
 */

export interface DocumentoPreview {
  html: string;
  css: string;
  js?: string;
  /**
   * Grading harness. When absent the document is unchanged from the original.
   * See the note below about why it gets its OWN script tag.
   */
  harness?: string;
}

export function construirSrcDoc({
  html,
  css,
  js = "",
  harness,
}: DocumentoPreview): string {
  // The harness goes in a SEPARATE script tag, not appended to the student's.
  //
  // A script tag containing a syntax error never executes, so a harness sharing
  // that tag would die with it -- and a syntax error would surface as a TIMEOUT
  // instead of as a syntax error, which is the one thing the student most needs
  // told. Separate tags parse independently, so the harness always runs and can
  // report the SyntaxError itself: it evaluates the submission through
  // `new Function`, which throws at construction time and is catchable.
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
  ${js ? `<script>${js}<\/script>` : ""}${harness ? `\n  <script>${harness}<\/script>` : ""}
</body>
</html>`;
}
