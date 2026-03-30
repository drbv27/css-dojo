import type { ModuleData } from "@/types";

export const htmlMediaAvanzadoModule: ModuleData = {
  slug: "html-media-avanzado",
  title: "Media Avanzado en HTML",
  description:
    "Aprende a usar iframe, SVG inline, canvas, imagenes responsive con picture y srcset, lazy loading y formatos modernos como WebP y AVIF.",
  order: 14,
  category: "html-advanced",
  icon: "play",
  dojo: "html",
  lessons: [
    {
      id: "html14-leccion-01",
      title: "iframe, embed y object",
      content: `## iframe, embed y object

### iframe

El elemento \`<iframe>\` permite **incrustar otra pagina web** dentro de la tuya. Es la forma estandar de insertar contenido externo como videos de YouTube o mapas.

\`\`\`html
<iframe src="https://ejemplo.com" width="600" height="400"></iframe>
\`\`\`

### Atributos importantes de iframe

| Atributo | Funcion |
|----------|---------|
| \`src\` | URL de la pagina a incrustar |
| \`width\` / \`height\` | Dimensiones del iframe |
| \`title\` | Descripcion accesible (obligatorio para a11y) |
| \`sandbox\` | Restringe las acciones del contenido incrustado |
| \`allow\` | Permisos especificos (camara, microfono, etc.) |
| \`loading="lazy"\` | Carga el iframe solo cuando es visible |

### Sandbox: seguridad en iframes

El atributo \`sandbox\` restringe el contenido incrustado:

\`\`\`html
<!-- Muy restrictivo: no permite nada -->
<iframe src="..." sandbox></iframe>

<!-- Permite formularios y scripts -->
<iframe src="..." sandbox="allow-scripts allow-forms"></iframe>
\`\`\`

### embed y object

Son elementos mas antiguos para incrustar contenido. Hoy se usan poco:

\`\`\`html
<embed src="archivo.pdf" type="application/pdf" width="600" height="400">
<object data="archivo.pdf" type="application/pdf" width="600" height="400">
  <p>Tu navegador no soporta PDFs. <a href="archivo.pdf">Descargalo aqui</a></p>
</object>
\`\`\`

> **Tip:** Siempre agrega \`title\` a tus iframes para accesibilidad.`,
      codeExample: {
        html: `<!-- Ejemplo de iframe con sandbox -->
<h3>iframe con restricciones de seguridad</h3>
<iframe
  srcdoc="<html><body style='font-family:sans-serif;text-align:center;padding:20px;'><h2 style='color:#6c5ce7;'>Contenido del iframe</h2><p>Este contenido esta dentro de un iframe con sandbox.</p><button onclick='alert(&quot;Hola&quot;)'>Boton (no funciona con sandbox)</button></body></html>"
  width="100%"
  height="150"
  title="Ejemplo de iframe con sandbox"
  sandbox
  style="border:2px solid #6c5ce7;border-radius:8px;">
</iframe>

<br><br>

<!-- Mismo iframe pero permitiendo scripts -->
<h3>iframe con allow-scripts</h3>
<iframe
  srcdoc="<html><body style='font-family:sans-serif;text-align:center;padding:20px;'><h2 style='color:#00b894;'>Con scripts permitidos</h2><button onclick='this.textContent=&quot;Funciona!&quot;'>Haz clic</button></body></html>"
  width="100%"
  height="120"
  title="Ejemplo de iframe con scripts"
  sandbox="allow-scripts"
  style="border:2px solid #00b894;border-radius:8px;">
</iframe>`,
        css: `body { font-family: sans-serif; padding: 16px; }
h3 { color: #2d3436; }`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html14-leccion-02",
      title: "SVG inline y canvas",
      content: `## SVG inline y canvas

### SVG (Scalable Vector Graphics)

SVG es un formato de **imagen vectorial** que se puede escribir directamente en HTML. Las imagenes SVG no pierden calidad al cambiar de tamano.

\`\`\`html
<svg width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#6c5ce7" />
</svg>
\`\`\`

### Ventajas del SVG inline

- **Escalable:** sin perdida de calidad a cualquier tamano
- **Editable con CSS:** puedes cambiar colores, tamanos con CSS
- **Animable:** se puede animar con CSS o JavaScript
- **Liviano:** para iconos y formas simples pesa menos que una imagen

### Elementos SVG comunes

| Elemento | Descripcion |
|----------|-------------|
| \`<circle>\` | Circulo |
| \`<rect>\` | Rectangulo |
| \`<line>\` | Linea |
| \`<text>\` | Texto |
| \`<path>\` | Forma compleja con trazos |
| \`<polygon>\` | Poligono |

### Canvas

El elemento \`<canvas>\` proporciona un lienzo para dibujar graficos con **JavaScript**. A diferencia de SVG, canvas trabaja con pixeles (rasterizado).

\`\`\`html
<canvas id="mi-canvas" width="300" height="200"></canvas>
\`\`\`

Canvas requiere JavaScript para dibujar:
\`\`\`javascript
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#6c5ce7";
ctx.fillRect(10, 10, 100, 80);
\`\`\`

> **SVG vs Canvas:** Usa SVG para iconos, logos y graficos simples. Usa Canvas para graficos complejos, juegos y visualizaciones con muchos elementos.`,
      codeExample: {
        html: `<h3>SVG Inline - Figuras basicas</h3>
<svg width="300" height="120" style="background:#f8f9fa;border-radius:8px;">
  <!-- Circulo -->
  <circle cx="50" cy="60" r="35" fill="#6c5ce7" />

  <!-- Rectangulo -->
  <rect x="100" y="25" width="70" height="70" rx="10" fill="#00b894" />

  <!-- Triangulo -->
  <polygon points="230,25 265,95 195,95" fill="#e17055" />

  <!-- Texto -->
  <text x="150" y="115" text-anchor="middle" fill="#2d3436" font-size="12">SVG Figuras</text>
</svg>

<br><br>

<h3>Canvas con JavaScript</h3>
<canvas id="miCanvas" width="300" height="120" style="background:#f8f9fa;border-radius:8px;"></canvas>`,
        css: `body { font-family: sans-serif; padding: 16px; }
h3 { color: #2d3436; margin-bottom: 8px; }`,
        js: `const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

// Circulo
ctx.beginPath();
ctx.arc(50, 60, 35, 0, Math.PI * 2);
ctx.fillStyle = "#0984e3";
ctx.fill();

// Rectangulo
ctx.fillStyle = "#fdcb6e";
ctx.fillRect(100, 25, 70, 70);

// Texto
ctx.fillStyle = "#2d3436";
ctx.font = "12px sans-serif";
ctx.textAlign = "center";
ctx.fillText("Canvas Figuras", 150, 115);`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html14-leccion-03",
      title: "Imagenes responsive y lazy loading",
      content: `## Imagenes responsive y lazy loading

### El elemento picture

\`<picture>\` permite servir **diferentes imagenes** segun el tamano de pantalla o el formato soportado por el navegador.

\`\`\`html
<picture>
  <source media="(max-width: 600px)" srcset="imagen-small.webp">
  <source media="(max-width: 1200px)" srcset="imagen-medium.webp">
  <img src="imagen-large.jpg" alt="Descripcion">
</picture>
\`\`\`

### srcset para diferentes resoluciones

El atributo \`srcset\` en \`<img>\` permite al navegador elegir la mejor imagen segun la densidad de pixeles:

\`\`\`html
<img
  src="foto.jpg"
  srcset="foto-1x.jpg 1x, foto-2x.jpg 2x, foto-3x.jpg 3x"
  alt="Foto responsive">
\`\`\`

### Formatos modernos

| Formato | Ventaja |
|---------|---------|
| **WebP** | 25-35% mas liviano que JPEG con misma calidad |
| **AVIF** | 50% mas liviano que JPEG (nuevo, menos soporte) |

\`\`\`html
<picture>
  <source srcset="imagen.avif" type="image/avif">
  <source srcset="imagen.webp" type="image/webp">
  <img src="imagen.jpg" alt="Con fallback">
</picture>
\`\`\`

### Lazy loading

El atributo \`loading="lazy"\` retrasa la carga de imagenes e iframes hasta que estan **a punto de ser visibles**:

\`\`\`html
<img src="foto.jpg" alt="Foto" loading="lazy">
<iframe src="video.html" loading="lazy"></iframe>
\`\`\`

Esto mejora el **rendimiento** y ahorra datos, especialmente en paginas con muchas imagenes.

> **Tip:** No uses lazy loading en imagenes visibles inmediatamente (above the fold). Solo en las que estan mas abajo.`,
      codeExample: {
        html: `<h3>Elemento picture con formatos modernos</h3>
<div style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;white-space:pre;overflow-x:auto;">&lt;picture&gt;
  &lt;source srcset="hero.avif" type="image/avif"&gt;
  &lt;source srcset="hero.webp" type="image/webp"&gt;
  &lt;img src="hero.jpg" alt="Banner principal"
       loading="lazy"&gt;
&lt;/picture&gt;</div>

<br>

<h3>Comparativa de tamano de formatos</h3>
<div style="display:flex;gap:8px;align-items:flex-end;">
  <div style="text-align:center;">
    <div style="background:#e17055;width:80px;height:150px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">
      500 KB
    </div>
    <p style="font-size:12px;margin:4px 0;">JPEG</p>
  </div>
  <div style="text-align:center;">
    <div style="background:#fdcb6e;width:80px;height:100px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;color:#2d3436;font-weight:bold;">
      350 KB
    </div>
    <p style="font-size:12px;margin:4px 0;">WebP</p>
  </div>
  <div style="text-align:center;">
    <div style="background:#00b894;width:80px;height:65px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">
      250 KB
    </div>
    <p style="font-size:12px;margin:4px 0;">AVIF</p>
  </div>
</div>

<br>

<h3>Lazy loading</h3>
<p>Las imagenes con <code>loading="lazy"</code> se cargan solo cuando el usuario hace scroll hasta ellas.</p>
<div style="background:#f8f9fa;padding:12px;border-radius:8px;">
  <code>&lt;img src="foto.jpg" alt="Foto" loading="lazy"&gt;</code>
</div>`,
        css: `body { font-family: sans-serif; padding: 16px; }
h3 { color: #2d3436; }
code { background: #e8e8e8; padding: 2px 6px; border-radius: 4px; }`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html14-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que elemento HTML se usa para incrustar otra pagina web dentro de la tuya?",
      options: [
        { id: "a", text: "<embed>", isCorrect: false },
        { id: "b", text: "<iframe>", isCorrect: true },
        { id: "c", text: "<frame>", isCorrect: false },
        { id: "d", text: "<include>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Su nombre viene de 'inline frame'.",
      explanation:
        "<iframe> (inline frame) es el elemento estandar para incrustar otra pagina web. <frame> es obsoleto y <embed> se usa para plugins.",
    },
    {
      id: "html14-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que atributo retrasa la carga de imagenes hasta que estan a punto de ser visibles?",
      options: [
        { id: "a", text: 'loading="defer"', isCorrect: false },
        { id: "b", text: 'loading="lazy"', isCorrect: true },
        { id: "c", text: 'load="onscroll"', isCorrect: false },
        { id: "d", text: 'defer="true"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "'Lazy' significa perezoso en ingles.",
      explanation:
        'loading="lazy" es un atributo nativo que retrasa la carga de imagenes e iframes hasta que el usuario hace scroll cerca de ellos. Mejora el rendimiento de la pagina.',
    },
    {
      id: "html14-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa la etiqueta para crear un circulo SVG con radio 40:",
      codeTemplate: {
        html: "",
        cssPrefix: '<svg width="100" height="100"><',
        cssSuffix: ' cx="50" cy="50" r="40" fill="blue" /></svg>',
        blanks: ["circle"],
      },
      validation: { type: "exact", answer: "circle" },
      hint: "Es la forma geometrica redonda en ingles.",
      explanation:
        "El elemento <circle> de SVG dibuja un circulo. cx y cy definen el centro, y r define el radio.",
    },
    {
      id: "html14-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que hace el atributo sandbox en un iframe?",
      options: [
        { id: "a", text: "Cambia el fondo del iframe a color arena", isCorrect: false },
        { id: "b", text: "Permite ejecutar cualquier script dentro del iframe", isCorrect: false },
        { id: "c", text: "Restringe las acciones que el contenido del iframe puede realizar", isCorrect: true },
        { id: "d", text: "Oculta el iframe del usuario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una medida de seguridad que limita lo que puede hacer el contenido incrustado.",
      explanation:
        'El atributo sandbox restringe el contenido del iframe por seguridad. Por defecto bloquea scripts, formularios y popups. Se pueden habilitar permisos especificos como sandbox="allow-scripts".',
    },
    {
      id: "html14-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada tecnologia segun su tipo:",
      dragItems: [
        { id: "drag-1", content: "SVG", correctZone: "zone-vectorial" },
        { id: "drag-2", content: "Canvas", correctZone: "zone-raster" },
        { id: "drag-3", content: "WebP", correctZone: "zone-raster" },
        { id: "drag-4", content: "Iconos SVG inline", correctZone: "zone-vectorial" },
      ],
      dropZones: [
        { id: "zone-vectorial", label: "Vectorial (escalable)" },
        { id: "zone-raster", label: "Rasterizado (pixeles)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-vectorial",
          "drag-2": "zone-raster",
          "drag-3": "zone-raster",
          "drag-4": "zone-vectorial",
        },
      },
      hint: "Los graficos vectoriales se describen con matematicas; los rasterizados con pixeles.",
      explanation:
        "SVG es vectorial y se escala sin perdida de calidad. Canvas y WebP son formatos basados en pixeles (rasterizados).",
    },
    {
      id: "html14-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que elemento HTML permite servir diferentes imagenes segun el tamano de pantalla o formato?",
      options: [
        { id: "a", text: "<responsive-img>", isCorrect: false },
        { id: "b", text: "<image>", isCorrect: false },
        { id: "c", text: "<picture>", isCorrect: true },
        { id: "d", text: "<media>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Contiene elementos <source> y un <img> como fallback.",
      explanation:
        "El elemento <picture> permite definir multiples fuentes de imagen con <source> para diferentes tamanos de pantalla o formatos. El <img> actua como fallback.",
    },
    {
      id: "html14-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Cual de estos formatos de imagen es mas eficiente en compresion?",
      options: [
        { id: "a", text: "PNG", isCorrect: false },
        { id: "b", text: "JPEG", isCorrect: false },
        { id: "c", text: "GIF", isCorrect: false },
        { id: "d", text: "AVIF", isCorrect: true },
      ],
      validation: { type: "exact", answer: "d" },
      hint: "Es el formato mas nuevo de la lista.",
      explanation:
        "AVIF ofrece la mejor compresion, siendo hasta un 50% mas liviano que JPEG con calidad similar. WebP es el segundo mas eficiente, seguido de JPEG.",
    },
  ],
};
