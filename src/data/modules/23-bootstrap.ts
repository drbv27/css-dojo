import type { ModuleData } from "@/types";

export const bootstrapModule: ModuleData = {
  slug: "bootstrap-5",
  title: "Bootstrap 5",
  description:
    "Aprende el framework CSS mas popular del mundo: el sistema de grid, componentes predefinidos, clases utilitarias y diseno responsivo con Bootstrap 5.",
  order: 23,
  dojo: "css" as const,
  category: "frameworks",
  icon: "layout",
  lessons: [
    {
      id: "23-leccion-01",
      title: "Introduccion a Bootstrap",
      content: `## Introduccion a Bootstrap

### Que es Bootstrap?

**Bootstrap** es el framework CSS mas popular del mundo. Creado por Twitter en 2011, proporciona:

- **Sistema de grid** de 12 columnas responsive
- **Componentes** predefinidos (botones, cards, modales, etc.)
- **Clases utilitarias** para espaciado, colores, tipografia
- **Diseno mobile-first** incorporado

### Como incluir Bootstrap

La forma mas rapida es usar el CDN:

\`\`\`html
<!-- En el <head> de tu HTML -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Antes de cerrar </body> (para componentes interactivos) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
\`\`\`

O instalarlo con npm:

\`\`\`bash
npm install bootstrap
\`\`\`

### Filosofia Mobile-First

Bootstrap esta disenado **primero para moviles**. Los estilos base son para pantallas pequenas y se van agregando para pantallas mas grandes:

\`\`\`html
<!-- Esta columna es:
  - 12 cols (100%) en movil
  - 6 cols (50%) en tablet (md)
  - 4 cols (33%) en desktop (lg)
-->
<div class="col-12 col-md-6 col-lg-4">
  Contenido responsive
</div>
\`\`\`

### Breakpoints de Bootstrap 5

| Breakpoint | Clase | Ancho minimo |
|-----------|-------|-------------|
| Extra small | (sin sufijo) | < 576px |
| Small | \`sm\` | >= 576px |
| Medium | \`md\` | >= 768px |
| Large | \`lg\` | >= 992px |
| Extra large | \`xl\` | >= 1200px |
| XXL | \`xxl\` | >= 1400px |

### Tu primer layout con Bootstrap

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <h1 class="text-center my-4">Mi Pagina</h1>
    <div class="row">
      <div class="col-md-8">
        <p>Contenido principal</p>
      </div>
      <div class="col-md-4">
        <p>Sidebar</p>
      </div>
    </div>
  </div>
</body>
</html>
\`\`\`

> **Nota:** El meta tag \`viewport\` es **obligatorio** para que Bootstrap funcione correctamente en dispositivos moviles.`,
      codeExample: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<div class="container py-4">\n  <h2 class="text-center mb-4">Bootstrap 5 Demo</h2>\n  <div class="row g-3">\n    <div class="col-md-4">\n      <div class="p-3 bg-primary text-white rounded">Columna 1</div>\n    </div>\n    <div class="col-md-4">\n      <div class="p-3 bg-success text-white rounded">Columna 2</div>\n    </div>\n    <div class="col-md-4">\n      <div class="p-3 bg-danger text-white rounded">Columna 3</div>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: false,
      },
      order: 1,
    },
    {
      id: "23-leccion-02",
      title: "Grid System",
      content: `## Grid System de Bootstrap

El sistema de grid es la base de Bootstrap. Usa un sistema de **12 columnas** flexible y responsive.

### Estructura basica: container > row > col

\`\`\`html
<div class="container">      <!-- Contenedor centrado -->
  <div class="row">          <!-- Fila que contiene columnas -->
    <div class="col-6">A</div>  <!-- 6 de 12 = 50% -->
    <div class="col-6">B</div>  <!-- 6 de 12 = 50% -->
  </div>
</div>
\`\`\`

### Tipos de contenedor

| Clase | Comportamiento |
|-------|---------------|
| \`.container\` | Ancho fijo en cada breakpoint |
| \`.container-fluid\` | Siempre 100% de ancho |
| \`.container-md\` | 100% hasta md, luego ancho fijo |

### Columnas responsive

\`\`\`html
<div class="row">
  <!-- 100% en movil, 50% en md, 33% en lg -->
  <div class="col-12 col-md-6 col-lg-4">Columna</div>
  <div class="col-12 col-md-6 col-lg-4">Columna</div>
  <div class="col-12 col-md-12 col-lg-4">Columna</div>
</div>
\`\`\`

### Columnas automaticas

\`\`\`html
<!-- Columnas de igual ancho (automatico) -->
<div class="row">
  <div class="col">1/3</div>
  <div class="col">1/3</div>
  <div class="col">1/3</div>
</div>

<!-- Una columna con ancho fijo, las demas se ajustan -->
<div class="row">
  <div class="col">Auto</div>
  <div class="col-6">50% fijo</div>
  <div class="col">Auto</div>
</div>
\`\`\`

### Offset (desplazamiento)

\`\`\`html
<!-- Desplaza la columna 3 posiciones a la derecha -->
<div class="row">
  <div class="col-md-6 offset-md-3">Centrada</div>
</div>
\`\`\`

### Order (reordenar)

\`\`\`html
<div class="row">
  <div class="col order-3">Aparece tercero</div>
  <div class="col order-1">Aparece primero</div>
  <div class="col order-2">Aparece segundo</div>
</div>
\`\`\`

### Gutters (espaciado entre columnas)

\`\`\`html
<!-- g-0: sin espacio, g-3: espacio medio, g-5: espacio grande -->
<div class="row g-3">
  <div class="col-6"><div class="p-3 bg-light">A</div></div>
  <div class="col-6"><div class="p-3 bg-light">B</div></div>
</div>

<!-- gx- solo horizontal, gy- solo vertical -->
<div class="row gx-5 gy-2">
  <!-- ... -->
</div>
\`\`\`

### Row columns

Define cuantas columnas por fila sin especificar en cada col:

\`\`\`html
<!-- 2 columnas por fila en movil, 4 en md -->
<div class="row row-cols-2 row-cols-md-4 g-3">
  <div class="col"><div class="p-3 bg-light">1</div></div>
  <div class="col"><div class="p-3 bg-light">2</div></div>
  <div class="col"><div class="p-3 bg-light">3</div></div>
  <div class="col"><div class="p-3 bg-light">4</div></div>
</div>
\`\`\`

> **Regla de oro:** Las columnas siempre deben sumar 12 (o menos) dentro de una fila. Si suman mas de 12, las columnas extra bajan a la siguiente linea.`,
      codeExample: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<div class="container py-3">\n  <div class="row g-3 mb-3">\n    <div class="col-md-8">\n      <div class="p-3 bg-primary bg-opacity-75 text-white rounded">col-md-8</div>\n    </div>\n    <div class="col-md-4">\n      <div class="p-3 bg-primary bg-opacity-50 text-white rounded">col-md-4</div>\n    </div>\n  </div>\n  <div class="row g-3 mb-3">\n    <div class="col-md-4">\n      <div class="p-3 bg-success bg-opacity-75 text-white rounded">col-md-4</div>\n    </div>\n    <div class="col-md-4">\n      <div class="p-3 bg-success bg-opacity-50 text-white rounded">col-md-4</div>\n    </div>\n    <div class="col-md-4">\n      <div class="p-3 bg-success bg-opacity-25 rounded">col-md-4</div>\n    </div>\n  </div>\n  <div class="row g-3">\n    <div class="col-md-6 offset-md-3">\n      <div class="p-3 bg-warning bg-opacity-75 rounded text-center">col-md-6 offset-md-3 (centrada)</div>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: true,
      },
      order: 2,
    },
    {
      id: "23-leccion-03",
      title: "Componentes Basicos",
      content: `## Componentes Basicos de Bootstrap

Bootstrap incluye decenas de componentes listos para usar. Veamos los mas importantes.

### Botones (btn)

\`\`\`html
<!-- Colores de boton -->
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-success">Exito</button>
<button class="btn btn-danger">Peligro</button>
<button class="btn btn-warning">Advertencia</button>
<button class="btn btn-info">Info</button>

<!-- Variantes outline -->
<button class="btn btn-outline-primary">Outline</button>

<!-- Tamanios -->
<button class="btn btn-primary btn-lg">Grande</button>
<button class="btn btn-primary btn-sm">Pequeno</button>

<!-- Boton deshabilitado -->
<button class="btn btn-primary" disabled>Deshabilitado</button>
\`\`\`

### Cards (tarjetas)

\`\`\`html
<div class="card" style="width: 18rem;">
  <img src="imagen.jpg" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Titulo</h5>
    <p class="card-text">Texto de la tarjeta.</p>
    <a href="#" class="btn btn-primary">Ir</a>
  </div>
</div>

<!-- Card con header y footer -->
<div class="card">
  <div class="card-header">Encabezado</div>
  <div class="card-body">
    <h5 class="card-title">Titulo</h5>
    <p class="card-text">Contenido</p>
  </div>
  <div class="card-footer text-muted">Pie de tarjeta</div>
</div>
\`\`\`

### Alerts (alertas)

\`\`\`html
<div class="alert alert-success" role="alert">
  Operacion exitosa!
</div>

<div class="alert alert-danger alert-dismissible fade show" role="alert">
  Ha ocurrido un error.
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
\`\`\`

### Badges (insignias)

\`\`\`html
<span class="badge bg-primary">Nuevo</span>
<span class="badge bg-danger">3</span>
<span class="badge rounded-pill bg-success">Activo</span>

<!-- Badge dentro de un boton -->
<button class="btn btn-primary">
  Notificaciones <span class="badge bg-danger">4</span>
</button>
\`\`\`

### Navbar (barra de navegacion)

\`\`\`html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">MiSitio</a>
    <button class="navbar-toggler" type="button"
      data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" href="#">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Acerca de</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Contacto</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
\`\`\`

> **Tip:** Bootstrap 5 elimino la dependencia de jQuery. Todos los componentes interactivos ahora funcionan con JavaScript vanilla.`,
      codeExample: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<div class="container py-4">\n  <div class="mb-3">\n    <button class="btn btn-primary">Primario</button>\n    <button class="btn btn-success">Exito</button>\n    <button class="btn btn-danger">Peligro</button>\n    <button class="btn btn-outline-warning">Outline</button>\n  </div>\n  <div class="alert alert-info mb-3">Esta es una alerta informativa.</div>\n  <div class="card" style="max-width: 300px;">\n    <div class="card-body">\n      <h5 class="card-title">Tarjeta Bootstrap</h5>\n      <p class="card-text">Componente card con body, titulo y texto.</p>\n      <span class="badge bg-primary">Nuevo</span>\n      <span class="badge bg-success">Activo</span>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: true,
      },
      order: 3,
    },
    {
      id: "23-leccion-04",
      title: "Utilidades y Responsive",
      content: `## Utilidades y Responsive

Bootstrap incluye un sistema extenso de clases utilitarias que evitan escribir CSS personalizado.

### Spacing: margin (m) y padding (p)

La sintaxis es: \`{propiedad}{lado}-{tamanio}\`

| Prefijo | Propiedad |
|---------|-----------|
| \`m-\` | margin |
| \`p-\` | padding |
| \`mt-\`, \`pt-\` | top |
| \`mb-\`, \`pb-\` | bottom |
| \`ms-\`, \`ps-\` | start (izquierda en LTR) |
| \`me-\`, \`pe-\` | end (derecha en LTR) |
| \`mx-\`, \`px-\` | horizontal (izquierda y derecha) |
| \`my-\`, \`py-\` | vertical (arriba y abajo) |

Tamanios: \`0\`, \`1\` (0.25rem), \`2\` (0.5rem), \`3\` (1rem), \`4\` (1.5rem), \`5\` (3rem), \`auto\`

\`\`\`html
<div class="mt-3 mb-4 px-2">Espaciado personalizado</div>
<div class="mx-auto" style="width: 200px;">Centrado horizontal</div>
<div class="p-5">Padding grande en todos los lados</div>
\`\`\`

### Display

\`\`\`html
<div class="d-none">Oculto</div>
<div class="d-block">Block</div>
<div class="d-flex">Flexbox</div>
<div class="d-inline">Inline</div>
<div class="d-grid">Grid</div>

<!-- Responsive: oculto en movil, visible en md+ -->
<div class="d-none d-md-block">Solo desktop</div>

<!-- Visible solo en movil -->
<div class="d-block d-md-none">Solo movil</div>
\`\`\`

### Flexbox utilities

\`\`\`html
<div class="d-flex justify-content-between align-items-center">
  <span>Izquierda</span>
  <span>Derecha</span>
</div>

<div class="d-flex flex-column gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive -->
<div class="d-flex flex-column flex-md-row gap-3">
  <!-- Columna en movil, fila en desktop -->
</div>
\`\`\`

### Text alignment

\`\`\`html
<p class="text-start">Alineado a la izquierda</p>
<p class="text-center">Centrado</p>
<p class="text-end">Alineado a la derecha</p>
<p class="text-md-center">Centrado solo en md+</p>
\`\`\`

### Colors

\`\`\`html
<!-- Texto -->
<p class="text-primary">Azul primario</p>
<p class="text-success">Verde exito</p>
<p class="text-danger">Rojo peligro</p>
<p class="text-muted">Gris suave</p>

<!-- Fondos -->
<div class="bg-primary text-white">Fondo azul</div>
<div class="bg-light text-dark">Fondo claro</div>
<div class="bg-dark text-white">Fondo oscuro</div>

<!-- Fondos con opacidad -->
<div class="bg-primary bg-opacity-25">25% opacidad</div>
\`\`\`

### Bordes y border-radius

\`\`\`html
<div class="border">Borde en todos los lados</div>
<div class="border-top border-primary">Borde superior azul</div>
<div class="rounded">Bordes redondeados</div>
<div class="rounded-pill">Bordes tipo pastilla</div>
<div class="rounded-circle">Circulo</div>
\`\`\`

### Sombras

\`\`\`html
<div class="shadow-sm">Sombra pequena</div>
<div class="shadow">Sombra normal</div>
<div class="shadow-lg">Sombra grande</div>
<div class="shadow-none">Sin sombra</div>
\`\`\`

### Width y Height

\`\`\`html
<div class="w-25">25% de ancho</div>
<div class="w-50">50% de ancho</div>
<div class="w-100">100% de ancho</div>
<div class="vh-100">100% del viewport height</div>
\`\`\`

> **Consejo:** Las clases utilitarias de Bootstrap aceptan sufijos responsive: \`d-md-flex\`, \`text-lg-center\`, \`p-xl-5\`. Esto permite adaptar cualquier utilidad por breakpoint.`,
      codeExample: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<div class="container py-4">\n  <div class="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded mb-3">\n    <span class="fw-bold">Logo</span>\n    <div class="d-flex gap-3">\n      <span>Inicio</span>\n      <span>Blog</span>\n      <span>Contacto</span>\n    </div>\n  </div>\n  <div class="row g-3">\n    <div class="col-md-6">\n      <div class="p-4 bg-primary bg-opacity-10 rounded shadow-sm">\n        <h5 class="text-primary">Tarjeta con utilidades</h5>\n        <p class="text-muted mb-0">Padding, colores y sombras con clases utilitarias.</p>\n      </div>\n    </div>\n    <div class="col-md-6">\n      <div class="p-4 bg-success bg-opacity-10 rounded shadow-sm">\n        <h5 class="text-success">Responsive</h5>\n        <p class="text-muted mb-0">Redimensiona la ventana para ver el grid en accion.</p>\n      </div>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "23-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Cuantas columnas tiene el sistema de grid de Bootstrap?",
      options: [
        { id: "a", text: "6 columnas", isCorrect: false },
        { id: "b", text: "10 columnas", isCorrect: false },
        { id: "c", text: "12 columnas", isCorrect: true },
        { id: "d", text: "16 columnas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es un numero divisible por 2, 3, 4 y 6, lo que permite muchas combinaciones de layout.",
      explanation:
        "El grid de Bootstrap usa 12 columnas. Esto permite dividir en 2 (6+6), 3 (4+4+4), 4 (3+3+3+3), 6 (2+2+2+2+2+2) y muchas otras combinaciones.",
    },
    {
      id: "23-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt:
        "Cual es la estructura correcta del grid de Bootstrap?",
      options: [
        { id: "a", text: "row > container > col", isCorrect: false },
        { id: "b", text: "container > row > col", isCorrect: true },
        { id: "c", text: "col > row > container", isCorrect: false },
        { id: "d", text: "grid > row > col", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Primero el contenedor, luego la fila, luego las columnas.",
      explanation:
        "La estructura correcta es container > row > col. El container centra el contenido y establece el ancho maximo. El row crea una fila flexbox. Las col definen cuantas columnas ocupa cada elemento.",
    },
    {
      id: "23-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt:
        "Completa la clase de Bootstrap para crear un boton de color primario (azul):",
      codeTemplate: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<button class="btn ___">Aceptar</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["btn-primary"],
      },
      validation: { type: "exact", answer: "btn-primary" },
      hint: "Los botones de Bootstrap usan la clase 'btn' mas una clase de color como btn-{color}.",
      explanation:
        "Los botones de Bootstrap necesitan la clase base 'btn' y una clase de color como 'btn-primary' (azul), 'btn-success' (verde), 'btn-danger' (rojo), etc.",
    },
    {
      id: "23-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada clase utilitaria de Bootstrap a su funcion:",
      dragItems: [
        { id: "drag-1", content: "mt-3", correctZone: "zone-margin" },
        { id: "drag-2", content: "d-flex", correctZone: "zone-display" },
        { id: "drag-3", content: "text-center", correctZone: "zone-text" },
        { id: "drag-4", content: "bg-primary", correctZone: "zone-bg" },
      ],
      dropZones: [
        { id: "zone-margin", label: "Agrega margin-top de 1rem" },
        { id: "zone-display", label: "Establece display: flex" },
        { id: "zone-text", label: "Centra el texto horizontalmente" },
        { id: "zone-bg", label: "Aplica color de fondo azul primario" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-margin",
          "drag-2": "zone-display",
          "drag-3": "zone-text",
          "drag-4": "zone-bg",
        },
      },
      hint: "mt = margin-top, d = display, text = alineacion de texto, bg = background.",
      explanation:
        "mt-3 aplica margin-top de 1rem. d-flex establece display: flex. text-center centra el texto. bg-primary aplica el color de fondo primario (azul) de Bootstrap.",
    },
    {
      id: "23-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea un layout de 3 columnas iguales usando el grid de Bootstrap. Usa un container, un row con clase g-3 para gutters, y 3 divs con clase col-md-4. Dentro de cada columna pon un div con clases 'p-3 bg-primary bg-opacity-25 rounded text-center' y el texto 'Columna N'.",
      codeTemplate: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "",
      validation: {
        type: "includes",
        answer: [
          "container",
          "row",
          "col-md-4",
          "bg-primary",
          "rounded",
        ],
      },
      hint: "La estructura es: container > row.g-3 > col-md-4 (x3). Cada columna contiene un div con las clases de estilo.",
      explanation:
        "El grid de Bootstrap sigue la estructura container > row > col. col-md-4 ocupa 4 de 12 columnas (33%) en pantallas medianas y mas grandes. g-3 agrega espacio (gutter) entre columnas.",
    },
    {
      id: "23-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt:
        "Completa la clase de Bootstrap para crear una columna que ocupe 12 columnas en movil y 6 en pantallas medianas:",
      codeTemplate: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n<div class="container"><div class="row"><div class="col-12 ___">Contenido responsive</div></div></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["col-md-6"],
      },
      validation: { type: "exact", answer: "col-md-6" },
      hint: "Necesitas especificar el breakpoint 'md' y el numero de columnas '6'.",
      explanation:
        "col-md-6 hace que la columna ocupe 6 de 12 columnas (50%) en pantallas medianas (>= 768px). Combinado con col-12, es 100% en movil y 50% en desktop.",
    },
    {
      id: "23-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea una tarjeta (card) de Bootstrap con: un card-body que contenga un card-title con 'Mi Tarjeta', un card-text con 'Esta es una tarjeta de Bootstrap 5.', un badge con clase 'badge bg-success' con texto 'Activo', y un boton 'btn btn-primary' con texto 'Ver mas'. Agrega la clase 'shadow' a la card para sombra.",
      codeTemplate: {
        html: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "",
      validation: {
        type: "includes",
        answer: [
          "card",
          "card-body",
          "card-title",
          "card-text",
          "badge",
          "btn btn-primary",
          "shadow",
        ],
      },
      hint: "La estructura es: div.card.shadow > div.card-body > h5.card-title + p.card-text + span.badge + button.btn.",
      explanation:
        "Las cards de Bootstrap tienen la estructura card > card-body > card-title + card-text. Los badges usan 'badge bg-{color}'. Los botones usan 'btn btn-{color}'. La clase 'shadow' agrega una sombra predefinida.",
    },
    {
      id: "23-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt:
        "Como ocultas un elemento en movil pero lo muestras en pantallas medianas (md) y superiores con Bootstrap?",
      options: [
        { id: "a", text: "class='hidden-mobile visible-md'", isCorrect: false },
        { id: "b", text: "class='d-none d-md-block'", isCorrect: true },
        { id: "c", text: "class='display-none display-md-block'", isCorrect: false },
        { id: "d", text: "class='invisible visible-md'", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Usa las clases de display (d-) con el enfoque mobile-first: primero oculta (d-none), luego muestra en md.",
      explanation:
        "d-none oculta el elemento en todas las pantallas. d-md-block lo muestra como block a partir del breakpoint md (768px). Este patron mobile-first es fundamental en Bootstrap 5.",
    },
  ],
};
