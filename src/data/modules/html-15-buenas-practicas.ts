import type { ModuleData } from "@/types";

export const htmlBuenasPracticasModule: ModuleData = {
  slug: "html-buenas-practicas",
  title: "Buenas Practicas de HTML",
  description:
    "Aprende validacion HTML, codigo limpio, etiquetas obsoletas, rendimiento con defer/async, preload/prefetch y una introduccion a las APIs de HTML5.",
  order: 15,
  category: "html-advanced",
  icon: "check-circle",
  dojo: "html",
  lessons: [
    {
      id: "html15-leccion-01",
      title: "Validacion y codigo limpio",
      content: `## Validacion y codigo limpio

### Validador W3C

El **W3C Markup Validation Service** (validator.w3.org) analiza tu HTML y reporta errores. Es la herramienta oficial para verificar que tu codigo cumple con los estandares.

### Errores comunes que detecta

- Etiquetas sin cerrar
- Atributos invalidos
- Elementos mal anidados
- Falta de \`alt\` en imagenes
- Uso de etiquetas obsoletas

### Buenas practicas de codigo limpio

1. **Indentacion consistente:** Usa 2 o 4 espacios (nunca mezcles tabs y espacios)
2. **Cierra todas las etiquetas:** Incluso las opcionales como \`</li>\` y \`</p>\`
3. **Usa minusculas:** Para nombres de etiquetas y atributos
4. **Comillas dobles:** En valores de atributos
5. **Un atributo por linea:** En elementos con muchos atributos
6. **Comentarios utiles:** Explica el "por que", no el "que"

### Anidacion correcta

\`\`\`html
<!-- Correcto -->
<p>Texto con <strong>negrita</strong> y <em>cursiva</em></p>

<!-- Incorrecto: mal anidado -->
<p>Texto con <strong>negrita y <em></strong>cursiva</em></p>
\`\`\`

### DOCTYPE y estructura minima

\`\`\`html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi pagina</title>
</head>
<body>
  <!-- Contenido aqui -->
</body>
</html>
\`\`\`

> **Regla:** Si el validador W3C no reporta errores, tu HTML es valido. Hazlo un habito.`,
      codeExample: {
        html: `<h3>Ejemplo de HTML limpio y valido</h3>

<div style="display:flex;gap:16px;">
  <!-- Mal ejemplo -->
  <div style="flex:1;background:#ffe5e5;padding:12px;border-radius:8px;border:2px solid #e17055;">
    <h4 style="color:#e17055;">Mal codigo</h4>
    <pre style="font-size:12px;white-space:pre-wrap;"><code>&lt;DIV CLASS=contenido&gt;
&lt;P&gt;Texto sin cerrar
&lt;img src=foto.jpg&gt;
&lt;b&gt;Negrita&lt;/b&gt;
&lt;center&gt;Centrado&lt;/center&gt;
&lt;/div&gt;</code></pre>
    <ul style="font-size:13px;color:#e17055;">
      <li>Mayusculas en etiquetas</li>
      <li>Sin comillas en atributos</li>
      <li>Falta alt en imagen</li>
      <li>Usa etiqueta obsoleta</li>
    </ul>
  </div>

  <!-- Buen ejemplo -->
  <div style="flex:1;background:#e5ffe5;padding:12px;border-radius:8px;border:2px solid #00b894;">
    <h4 style="color:#00b894;">Buen codigo</h4>
    <pre style="font-size:12px;white-space:pre-wrap;"><code>&lt;div class="contenido"&gt;
  &lt;p&gt;Texto bien cerrado&lt;/p&gt;
  &lt;img src="foto.jpg" alt="Desc"&gt;
  &lt;strong&gt;Negrita&lt;/strong&gt;
  &lt;p style="text-align:center"&gt;
    Centrado
  &lt;/p&gt;
&lt;/div&gt;</code></pre>
    <ul style="font-size:13px;color:#00b894;">
      <li>Minusculas</li>
      <li>Comillas dobles</li>
      <li>Alt presente</li>
      <li>CSS en vez de center</li>
    </ul>
  </div>
</div>`,
        css: `body { font-family: sans-serif; padding: 16px; }
pre { background: white; padding: 8px; border-radius: 4px; }
ul { padding-left: 20px; }`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html15-leccion-02",
      title: "Etiquetas obsoletas y alternativas modernas",
      content: `## Etiquetas obsoletas y alternativas modernas

HTML5 elimino muchas etiquetas presentacionales. Aqui estan las mas comunes y sus **alternativas correctas**:

### Etiquetas obsoletas

| Obsoleta | Alternativa moderna |
|----------|-------------------|
| \`<center>\` | \`text-align: center\` en CSS |
| \`<font>\` | \`font-family\`, \`color\`, \`font-size\` en CSS |
| \`<big>\` | \`font-size\` en CSS |
| \`<strike>\` | \`<del>\` (contenido eliminado) o \`text-decoration: line-through\` |
| \`<marquee>\` | Animaciones CSS |
| \`<blink>\` | Animaciones CSS (mejor no usarla) |
| \`<frame>\` / \`<frameset>\` | \`<iframe>\` |

### b vs strong / i vs em

Estas NO son obsoletas pero tienen significados diferentes:

| Etiqueta | Significado |
|----------|-------------|
| \`<b>\` | Texto visualmente en negrita (sin importancia semantica) |
| \`<strong>\` | Texto importante (negrita con significado) |
| \`<i>\` | Texto visualmente en cursiva (terminos tecnicos, titulos) |
| \`<em>\` | Enfasis (cursiva con significado) |

### Ejemplo

\`\`\`html
<!-- Usa strong cuando el texto es IMPORTANTE -->
<p><strong>Advertencia:</strong> No compartas tu contrasena.</p>

<!-- Usa b cuando solo quieres negrita visual -->
<p>Ingredientes: <b>harina</b>, <b>azucar</b>, <b>huevos</b></p>

<!-- Usa em para enfasis al leer -->
<p>Debes <em>siempre</em> validar en el servidor.</p>
\`\`\`

> **Principio:** El HTML describe el significado, el CSS describe la apariencia. No mezcles los dos.`,
      codeExample: {
        html: `<h3>Etiquetas obsoletas vs modernas</h3>

<table>
  <thead>
    <tr>
      <th>Obsoleto</th>
      <th>Moderno</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>&lt;center&gt;</code></td>
      <td><code>text-align: center</code></td>
    </tr>
    <tr>
      <td><code>&lt;font color="red"&gt;</code></td>
      <td><code>color: red</code> en CSS</td>
    </tr>
    <tr>
      <td><code>&lt;strike&gt;</code></td>
      <td><code>&lt;del&gt;</code> o CSS</td>
    </tr>
  </tbody>
</table>

<br>

<h3>strong vs b</h3>
<p><strong>Importante:</strong> Este texto tiene significado semantico de importancia.</p>
<p><b>Negrita:</b> Este texto solo tiene estilo visual, sin importancia especial.</p>

<h3>em vs i</h3>
<p>Debes <em>siempre</em> cerrar tus etiquetas. (enfasis)</p>
<p>El termino <i>responsive design</i> fue acunado por Ethan Marcotte. (termino tecnico)</p>

<h3>del y ins</h3>
<p>El precio es <del>$99</del> <ins>$49</ins> (oferta especial).</p>`,
        css: `body { font-family: sans-serif; padding: 16px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background: #6c5ce7; color: white; }
tr:nth-child(even) { background: #f8f9fa; }
code { background: #e8e8e8; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
del { color: #e17055; }
ins { color: #00b894; text-decoration: none; font-weight: bold; }`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html15-leccion-03",
      title: "Rendimiento y APIs de HTML5",
      content: `## Rendimiento y APIs de HTML5

### Carga de scripts: defer y async

La posicion y atributos de \`<script>\` afectan el rendimiento:

\`\`\`html
<!-- Bloquea el renderizado -->
<script src="app.js"></script>

<!-- Se ejecuta cuando el DOM esta listo (en orden) -->
<script src="app.js" defer></script>

<!-- Se ejecuta apenas se descarga (sin orden) -->
<script src="app.js" async></script>
\`\`\`

| Atributo | Descarga | Ejecucion |
|----------|----------|-----------|
| (ninguno) | Bloquea | Inmediata, bloquea |
| \`defer\` | En paralelo | Al terminar el DOM, en orden |
| \`async\` | En paralelo | Apenas descarga, sin orden |

> **Regla general:** Usa \`defer\` para la mayoria de scripts. Usa \`async\` solo para scripts independientes como analytics.

### Preload y prefetch

\`\`\`html
<!-- Preload: recurso necesario para la pagina actual -->
<link rel="preload" href="fuente.woff2" as="font" crossorigin>

<!-- Prefetch: recurso para una pagina futura -->
<link rel="prefetch" href="/siguiente-pagina.html">

<!-- Preconnect: conectar anticipadamente a un servidor -->
<link rel="preconnect" href="https://fonts.googleapis.com">
\`\`\`

### APIs de HTML5 (introduccion)

HTML5 incluye APIs de JavaScript poderosas:

| API | Funcion |
|-----|---------|
| **Web Storage** | localStorage y sessionStorage para guardar datos |
| **Geolocation** | Obtener ubicacion del usuario |
| **Drag & Drop** | Arrastrar y soltar elementos nativamente |
| **Canvas** | Dibujar graficos 2D con JavaScript |
| **Web Workers** | Ejecutar JavaScript en segundo plano |
| **History API** | Manipular el historial del navegador (SPA) |

### Ejemplo: Web Storage

\`\`\`javascript
// Guardar dato
localStorage.setItem("nombre", "Juan");

// Leer dato
const nombre = localStorage.getItem("nombre");

// Eliminar dato
localStorage.removeItem("nombre");
\`\`\``,
      codeExample: {
        html: `<h3>Carga de scripts: defer vs async</h3>
<div style="display:flex;flex-direction:column;gap:12px;">
  <div style="background:#e17055;color:white;padding:12px;border-radius:8px;">
    <strong>&lt;script src="app.js"&gt;</strong><br>
    Bloquea el renderizado hasta que se descarga y ejecuta.
  </div>
  <div style="background:#00b894;color:white;padding:12px;border-radius:8px;">
    <strong>&lt;script src="app.js" defer&gt;</strong><br>
    Se descarga en paralelo. Se ejecuta cuando el DOM esta listo, en orden.
  </div>
  <div style="background:#0984e3;color:white;padding:12px;border-radius:8px;">
    <strong>&lt;script src="app.js" async&gt;</strong><br>
    Se descarga en paralelo. Se ejecuta apenas descarga, sin orden garantizado.
  </div>
</div>

<br>

<h3>Demo: Web Storage</h3>
<input type="text" id="nombre-input" placeholder="Escribe tu nombre" style="padding:8px;border:2px solid #ddd;border-radius:4px;">
<button onclick="guardar()">Guardar</button>
<button onclick="cargar()">Cargar</button>
<button onclick="borrar()">Borrar</button>
<p id="storage-resultado" style="font-weight:bold;color:#6c5ce7;"></p>`,
        css: `body { font-family: sans-serif; padding: 16px; }
h3 { color: #2d3436; }
button {
  padding: 8px 16px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 4px;
}`,
        js: `function guardar() {
  const nombre = document.getElementById("nombre-input").value;
  if (nombre) {
    localStorage.setItem("dojo-nombre", nombre);
    document.getElementById("storage-resultado").textContent = "Guardado: " + nombre;
  }
}

function cargar() {
  const nombre = localStorage.getItem("dojo-nombre");
  document.getElementById("storage-resultado").textContent = nombre
    ? "Cargado: " + nombre
    : "No hay datos guardados.";
}

function borrar() {
  localStorage.removeItem("dojo-nombre");
  document.getElementById("storage-resultado").textContent = "Datos borrados.";
}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html15-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que herramienta oficial verifica que tu HTML cumple con los estandares web?",
      options: [
        { id: "a", text: "Google Lighthouse", isCorrect: false },
        { id: "b", text: "W3C Markup Validation Service", isCorrect: true },
        { id: "c", text: "ESLint", isCorrect: false },
        { id: "d", text: "Prettier", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es mantenido por la organizacion que crea los estandares web.",
      explanation:
        "El W3C Markup Validation Service (validator.w3.org) es la herramienta oficial del World Wide Web Consortium para validar codigo HTML.",
    },
    {
      id: "html15-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Cual es la alternativa moderna a la etiqueta obsoleta <center>?",
      options: [
        { id: "a", text: "<middle>", isCorrect: false },
        { id: "b", text: '<div align="center">', isCorrect: false },
        { id: "c", text: "text-align: center en CSS", isCorrect: true },
        { id: "d", text: "<align-center>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "La presentacion visual se maneja con CSS, no con HTML.",
      explanation:
        "La etiqueta <center> es obsoleta. En HTML moderno, el centrado se hace con CSS usando text-align: center para texto o margin: auto para bloques.",
    },
    {
      id: "html15-ej-03",
      type: "drag-drop",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Clasifica cada etiqueta como obsoleta o vigente en HTML5:",
      dragItems: [
        { id: "drag-1", content: "<center>", correctZone: "zone-obsoleta" },
        { id: "drag-2", content: "<strong>", correctZone: "zone-vigente" },
        { id: "drag-3", content: "<font>", correctZone: "zone-obsoleta" },
        { id: "drag-4", content: "<em>", correctZone: "zone-vigente" },
        { id: "drag-5", content: "<marquee>", correctZone: "zone-obsoleta" },
      ],
      dropZones: [
        { id: "zone-obsoleta", label: "Obsoleta" },
        { id: "zone-vigente", label: "Vigente en HTML5" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-obsoleta",
          "drag-2": "zone-vigente",
          "drag-3": "zone-obsoleta",
          "drag-4": "zone-vigente",
          "drag-5": "zone-obsoleta",
        },
      },
      hint: "Las etiquetas que controlan apariencia visual fueron reemplazadas por CSS.",
      explanation:
        "center, font y marquee son obsoletas porque son etiquetas presentacionales. strong y em son vigentes porque tienen significado semantico.",
    },
    {
      id: "html15-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Cual es la diferencia entre <strong> y <b>?",
      options: [
        { id: "a", text: "No hay diferencia, se ven igual", isCorrect: false },
        { id: "b", text: "strong indica importancia semantica; b solo es negrita visual", isCorrect: true },
        { id: "c", text: "b es la version moderna de strong", isCorrect: false },
        { id: "d", text: "strong solo funciona en formularios", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una tiene significado para lectores de pantalla, la otra no.",
      explanation:
        "<strong> indica que el texto es importante (los lectores de pantalla lo enfatizan). <b> solo aplica negrita visual sin significado semantico adicional.",
    },
    {
      id: "html15-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa el atributo para que el script se ejecute cuando el DOM este listo, sin bloquear la carga:",
      codeTemplate: {
        html: "",
        cssPrefix: '<script src="app.js" ',
        cssSuffix: "></script>",
        blanks: ["defer"],
      },
      validation: { type: "exact", answer: "defer" },
      hint: "Significa 'diferir' o 'posponer' en ingles.",
      explanation:
        "El atributo defer hace que el script se descargue en paralelo pero se ejecute solo cuando el DOM este completamente construido, manteniendo el orden de los scripts.",
    },
    {
      id: "html15-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada estrategia de carga segun su proposito:",
      dragItems: [
        { id: "drag-1", content: "defer", correctZone: "zone-scripts" },
        { id: "drag-2", content: "async", correctZone: "zone-scripts" },
        { id: "drag-3", content: "preload", correctZone: "zone-recursos" },
        { id: "drag-4", content: "prefetch", correctZone: "zone-recursos" },
      ],
      dropZones: [
        { id: "zone-scripts", label: "Carga de scripts" },
        { id: "zone-recursos", label: "Precarga de recursos" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-scripts",
          "drag-2": "zone-scripts",
          "drag-3": "zone-recursos",
          "drag-4": "zone-recursos",
        },
      },
      hint: "defer y async son atributos de <script>. preload y prefetch son valores de rel en <link>.",
      explanation:
        "defer y async controlan como se cargan y ejecutan los scripts. preload y prefetch anticipan la descarga de recursos (fuentes, paginas, etc.) para mejorar el rendimiento.",
    },
    {
      id: "html15-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Que API de HTML5 permite guardar datos en el navegador de forma persistente?",
      options: [
        { id: "a", text: "Geolocation API", isCorrect: false },
        { id: "b", text: "Drag & Drop API", isCorrect: false },
        { id: "c", text: "Web Storage (localStorage)", isCorrect: true },
        { id: "d", text: "History API", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Permite guardar pares clave-valor que persisten al cerrar el navegador.",
      explanation:
        "Web Storage incluye localStorage (persistente) y sessionStorage (solo durante la sesion). Permite guardar datos clave-valor en el navegador sin necesidad de un servidor.",
    },
  ],
};
