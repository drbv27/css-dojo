import type { ModuleData } from "@/types";

export const tailwindModule: ModuleData = {
  slug: "tailwind-css",
  title: "Tailwind CSS",
  description:
    "Domina el framework utility-first mas moderno: construye interfaces completas usando clases utilitarias, responsive design, estados interactivos y dark mode con Tailwind CSS.",
  order: 24,
  dojo: "css" as const,
  category: "frameworks",
  icon: "wind",
  lessons: [
    {
      id: "24-leccion-01",
      title: "Introduccion a Tailwind CSS",
      content: `## Introduccion a Tailwind CSS

### Que es Tailwind CSS?

**Tailwind CSS** es un framework CSS **utility-first** (utilidades primero). En lugar de componentes predefinidos como Bootstrap, Tailwind proporciona cientos de clases utilitarias de bajo nivel que se combinan directamente en el HTML.

### Utility-First: un enfoque diferente

\`\`\`html
<!-- Enfoque tradicional (CSS separado) -->
<div class="tarjeta">
  <h2 class="tarjeta-titulo">Hola</h2>
</div>
<style>
  .tarjeta { padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .tarjeta-titulo { font-size: 1.25rem; font-weight: bold; }
</style>

<!-- Enfoque Tailwind (todo en clases) -->
<div class="p-4 rounded-lg shadow-md">
  <h2 class="text-xl font-bold">Hola</h2>
</div>
\`\`\`

### Ventajas de Tailwind

1. **No inventas nombres de clases** - No mas ".contenedor-principal-wrapper"
2. **CSS no crece** - Reutilizas clases existentes, el archivo CSS no crece con cada componente
3. **Cambios seguros** - Modificar una clase solo afecta al elemento donde la usas
4. **Diseno consistente** - Sistema de espaciado y colores predefinido
5. **Responsive built-in** - Prefijos como \`md:\`, \`lg:\` para cada breakpoint

### Como incluir Tailwind

Para prototipar rapido, usa el CDN (Play CDN):

\`\`\`html
<script src="https://cdn.tailwindcss.com"></script>
\`\`\`

Para produccion, instala con npm:

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

### Comparacion con Bootstrap

| Aspecto | Bootstrap | Tailwind CSS |
|---------|-----------|-------------|
| Enfoque | Componentes predefinidos | Clases utilitarias |
| Personalizacion | Sobreescribir variables | Configurar tailwind.config.js |
| Tamano final | Incluye todo | Solo lo que usas (purge) |
| Curva de aprendizaje | Rapido al inicio | Memorizar clases, luego rapido |
| Diseno | Sitios "Bootstrap-like" | Diseno totalmente personalizado |

### Primeros pasos

\`\`\`html
<!-- Una tarjeta completa con Tailwind -->
<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-2">
      Tailwind CSS
    </h2>
    <p class="text-gray-600 text-sm leading-relaxed">
      Framework utility-first para construir interfaces
      modernas sin salir del HTML.
    </p>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      Empezar
    </button>
  </div>
</div>
\`\`\`

> **Dato:** Tailwind fue creado por Adam Wathan en 2017 y ha crecido enormemente. Es el framework CSS preferido por desarrolladores de React, Vue y Next.js.`,
      codeExample: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-8 bg-gray-100 min-h-[200px] flex items-center justify-center">\n  <div class="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">\n    <div class="p-6">\n      <div class="text-sm font-semibold text-blue-500 uppercase tracking-wide mb-1">Framework CSS</div>\n      <h2 class="text-xl font-bold text-gray-900 mb-2">Tailwind CSS</h2>\n      <p class="text-gray-600 text-sm">Construye interfaces modernas usando clases utilitarias directamente en tu HTML.</p>\n      <button class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">Aprender mas</button>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: true,
      },
      order: 1,
    },
    {
      id: "24-leccion-02",
      title: "Layout con Tailwind",
      content: `## Layout con Tailwind

### Flexbox

Tailwind hace que Flexbox sea extremadamente simple:

\`\`\`html
<!-- Flex basico -->
<div class="flex">...</div>
<div class="flex flex-col">...</div>

<!-- Justify (eje principal) -->
<div class="flex justify-center">...</div>    <!-- center -->
<div class="flex justify-between">...</div>   <!-- space-between -->
<div class="flex justify-around">...</div>    <!-- space-around -->
<div class="flex justify-end">...</div>       <!-- flex-end -->

<!-- Align (eje cruzado) -->
<div class="flex items-center">...</div>      <!-- center -->
<div class="flex items-start">...</div>       <!-- flex-start -->
<div class="flex items-end">...</div>         <!-- flex-end -->
<div class="flex items-stretch">...</div>     <!-- stretch -->

<!-- Gap -->
<div class="flex gap-4">...</div>             <!-- gap: 1rem -->
<div class="flex gap-x-2 gap-y-4">...</div>  <!-- gaps diferentes -->

<!-- Flex wrap -->
<div class="flex flex-wrap">...</div>

<!-- Flex grow/shrink -->
<div class="flex-1">...</div>      <!-- flex: 1 1 0% -->
<div class="flex-none">...</div>   <!-- flex: none -->
<div class="grow">...</div>        <!-- flex-grow: 1 -->
<div class="shrink-0">...</div>    <!-- flex-shrink: 0 -->
\`\`\`

### CSS Grid

\`\`\`html
<!-- Grid basico -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 1 col movil, 2 cols tablet, 3 cols desktop -->
</div>

<!-- Column span -->
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Ocupa 2 columnas</div>
  <div class="col-span-1">1 columna</div>
  <div class="col-span-1">1 columna</div>
</div>

<!-- Grid rows -->
<div class="grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-span-2">Alto doble</div>
  <div>Normal</div>
  <div>Normal</div>
</div>
\`\`\`

### Container

\`\`\`html
<!-- Container centrado con ancho maximo -->
<div class="container mx-auto px-4">
  Contenido centrado
</div>

<!-- Max-width personalizado -->
<div class="max-w-4xl mx-auto">...</div>   <!-- max-width: 56rem -->
<div class="max-w-screen-xl mx-auto">...</div>  <!-- max-width: 1280px -->
\`\`\`

### Spacing (espaciado)

El sistema de espaciado de Tailwind usa una escala de 4px:

| Clase | Valor | Pixeles |
|-------|-------|---------|
| \`p-0\` | 0 | 0px |
| \`p-1\` | 0.25rem | 4px |
| \`p-2\` | 0.5rem | 8px |
| \`p-3\` | 0.75rem | 12px |
| \`p-4\` | 1rem | 16px |
| \`p-6\` | 1.5rem | 24px |
| \`p-8\` | 2rem | 32px |
| \`p-12\` | 3rem | 48px |
| \`p-16\` | 4rem | 64px |

\`\`\`html
<div class="p-4">Padding 16px todos los lados</div>
<div class="px-6 py-3">Padding horizontal 24px, vertical 12px</div>
<div class="mt-8 mb-4">Margin top 32px, bottom 16px</div>
<div class="space-y-4">Espacio vertical de 16px entre hijos</div>
\`\`\`

### Sizing (dimensiones)

\`\`\`html
<div class="w-full">width: 100%</div>
<div class="w-1/2">width: 50%</div>
<div class="w-64">width: 16rem (256px)</div>
<div class="h-screen">height: 100vh</div>
<div class="min-h-screen">min-height: 100vh</div>
<div class="max-w-md">max-width: 28rem</div>
\`\`\`

> **Consejo:** La escala de 4px de Tailwind (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24...) crea un ritmo visual consistente. Usa siempre estas unidades para mantener la armonia.`,
      codeExample: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-6 bg-gray-100">\n  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">\n    <div class="bg-blue-500 text-white p-6 rounded-lg text-center font-bold">1</div>\n    <div class="bg-green-500 text-white p-6 rounded-lg text-center font-bold">2</div>\n    <div class="bg-purple-500 text-white p-6 rounded-lg text-center font-bold">3</div>\n  </div>\n  <div class="flex justify-between items-center mt-6 max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">\n    <span class="font-bold text-gray-700">Flex layout</span>\n    <div class="flex gap-2">\n      <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Tag 1</span>\n      <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Tag 2</span>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: true,
      },
      order: 2,
    },
    {
      id: "24-leccion-03",
      title: "Estilos Visuales",
      content: `## Estilos Visuales con Tailwind

### Colores

Tailwind incluye una paleta de colores extensa con 10 tonos por color:

\`\`\`html
<!-- Texto -->
<p class="text-blue-500">Azul medio</p>
<p class="text-red-700">Rojo oscuro</p>
<p class="text-gray-400">Gris claro</p>

<!-- Fondo -->
<div class="bg-blue-500">Fondo azul</div>
<div class="bg-emerald-100">Fondo verde suave</div>

<!-- La escala va de 50 a 950 -->
<!-- 50: muy claro, 500: medio, 950: muy oscuro -->
<div class="bg-blue-50">Casi blanco azulado</div>
<div class="bg-blue-500">Azul medio</div>
<div class="bg-blue-950">Azul casi negro</div>
\`\`\`

Colores disponibles: slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose.

### Tipografia

\`\`\`html
<!-- Tamanio -->
<p class="text-xs">Extra small (0.75rem)</p>
<p class="text-sm">Small (0.875rem)</p>
<p class="text-base">Base (1rem)</p>
<p class="text-lg">Large (1.125rem)</p>
<p class="text-xl">Extra large (1.25rem)</p>
<p class="text-2xl">2XL (1.5rem)</p>
<p class="text-4xl">4XL (2.25rem)</p>

<!-- Peso -->
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>

<!-- Line height -->
<p class="leading-tight">Apretado (1.25)</p>
<p class="leading-normal">Normal (1.5)</p>
<p class="leading-relaxed">Relajado (1.625)</p>

<!-- Letter spacing -->
<p class="tracking-tight">Apretado</p>
<p class="tracking-wide">Amplio</p>

<!-- Transformacion -->
<p class="uppercase">mayusculas</p>
<p class="capitalize">primera letra</p>
\`\`\`

### Bordes

\`\`\`html
<!-- Ancho de borde -->
<div class="border">1px</div>
<div class="border-2">2px</div>
<div class="border-4">4px</div>
<div class="border-t-2">Solo arriba 2px</div>

<!-- Color de borde -->
<div class="border border-blue-500">Borde azul</div>
<div class="border border-gray-200">Borde gris sutil</div>

<!-- Border radius -->
<div class="rounded">4px</div>
<div class="rounded-md">6px</div>
<div class="rounded-lg">8px</div>
<div class="rounded-xl">12px</div>
<div class="rounded-2xl">16px</div>
<div class="rounded-full">Circulo/Pastilla</div>
\`\`\`

### Sombras

\`\`\`html
<div class="shadow-sm">Sombra pequena</div>
<div class="shadow">Sombra normal</div>
<div class="shadow-md">Sombra media</div>
<div class="shadow-lg">Sombra grande</div>
<div class="shadow-xl">Sombra extra grande</div>
<div class="shadow-2xl">Sombra 2XL</div>
<div class="shadow-none">Sin sombra</div>
\`\`\`

### Fondos y degradados

\`\`\`html
<!-- Degradado -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  Degradado de azul a morado
</div>

<div class="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
  Degradado diagonal con color intermedio
</div>

<!-- Direcciones: to-t, to-r, to-b, to-l, to-tr, to-br, to-bl, to-tl -->

<!-- Opacidad del fondo -->
<div class="bg-blue-500/50">50% opacidad</div>
<div class="bg-black/25">Negro al 25%</div>
\`\`\`

### Transiciones y animaciones

\`\`\`html
<button class="transition-colors duration-300 ease-in-out">
  Transicion de color
</button>

<button class="transition-all duration-200 hover:scale-105">
  Escala al hover
</button>

<!-- Animaciones predefinidas -->
<div class="animate-spin">Girando</div>
<div class="animate-bounce">Rebotando</div>
<div class="animate-pulse">Pulsando</div>
\`\`\`

> **Tip:** Tailwind usa la sintaxis \`color/opacidad\` para controlar transparencia: \`bg-blue-500/75\` es azul al 75% de opacidad.`,
      codeExample: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-8 bg-gray-50 space-y-4">\n  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">\n    <h2 class="text-2xl font-bold mb-1">Degradado con Tailwind</h2>\n    <p class="text-blue-100 text-sm">from-blue-500 to-purple-600</p>\n  </div>\n  <div class="flex gap-3">\n    <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex-1">\n      <p class="text-sm font-semibold text-gray-700">Sombra SM</p>\n    </div>\n    <div class="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex-1">\n      <p class="text-sm font-semibold text-gray-700">Sombra MD</p>\n    </div>\n    <div class="bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex-1">\n      <p class="text-sm font-semibold text-gray-700">Sombra XL</p>\n    </div>\n  </div>\n</div>`,
        css: ``,
        editable: true,
      },
      order: 3,
    },
    {
      id: "24-leccion-04",
      title: "Responsive y Estados",
      content: `## Responsive y Estados

### Breakpoints responsive

Tailwind usa un sistema mobile-first con prefijos de breakpoint:

| Prefijo | Ancho minimo | Equivale a |
|---------|-------------|------------|
| (sin prefijo) | 0px | Movil por defecto |
| \`sm:\` | 640px | @media (min-width: 640px) |
| \`md:\` | 768px | @media (min-width: 768px) |
| \`lg:\` | 1024px | @media (min-width: 1024px) |
| \`xl:\` | 1280px | @media (min-width: 1280px) |
| \`2xl:\` | 1536px | @media (min-width: 1536px) |

\`\`\`html
<!-- Columna en movil, fila en desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/3">Sidebar</div>
  <div class="w-full md:w-2/3">Contenido</div>
</div>

<!-- Texto pequeno en movil, grande en desktop -->
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">
  Titulo responsive
</h1>

<!-- Ocultar/mostrar por breakpoint -->
<nav class="hidden md:block">Menu desktop</nav>
<button class="block md:hidden">Menu hamburguesa</button>

<!-- Padding responsive -->
<div class="p-4 md:p-8 lg:p-12">
  Mas espacio en pantallas grandes
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>
\`\`\`

### State variants (estados)

Tailwind permite aplicar estilos a estados especificos con prefijos:

\`\`\`html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-700 text-white">
  Cambia color al hover
</button>

<!-- Focus -->
<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded px-3 py-2">

<!-- Active (click) -->
<button class="bg-blue-500 active:bg-blue-800 active:scale-95">
  Efecto al clickear
</button>

<!-- Disabled -->
<button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
  Deshabilitado
</button>

<!-- First/Last child -->
<div class="space-y-2">
  <div class="first:pt-0 last:pb-0 py-2 border-b">Item</div>
</div>

<!-- Group hover (hover del padre) -->
<div class="group hover:bg-gray-50 p-4 rounded-lg cursor-pointer">
  <h3 class="group-hover:text-blue-500 transition-colors">Titulo</h3>
  <p class="group-hover:text-gray-700 text-gray-500">Descripcion</p>
</div>

<!-- Odd/Even -->
<tr class="odd:bg-white even:bg-gray-50">
  <td>Fila con color alternado</td>
</tr>
\`\`\`

### Dark mode

Tailwind soporta modo oscuro con el prefijo \`dark:\`:

\`\`\`html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-2xl font-bold">
    Titulo adaptable
  </h1>
  <p class="text-gray-600 dark:text-gray-400">
    Este texto cambia segun el modo.
  </p>
  <button class="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded">
    Boton
  </button>
</div>
\`\`\`

Para activar dark mode por clase (en tailwind.config.js):

\`\`\`js
module.exports = {
  darkMode: 'class', // o 'media' para seguir preferencias del sistema
}
\`\`\`

\`\`\`html
<!-- Agregar la clase 'dark' al html para activar -->
<html class="dark">
  <body class="bg-white dark:bg-gray-900">
    ...
  </body>
</html>
\`\`\`

### Combinando variantes

Los prefijos se pueden combinar:

\`\`\`html
<!-- Hover solo en pantallas md+ -->
<button class="md:hover:bg-blue-700">...</button>

<!-- Dark mode + hover -->
<a class="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
  Enlace adaptable
</a>

<!-- Focus visible (accesibilidad) -->
<button class="focus-visible:ring-2 focus-visible:ring-blue-500">
  Visible con teclado
</button>
\`\`\`

> **Importante:** Tailwind es mobile-first. Los estilos base son para movil, y los prefijos (\`md:\`, \`lg:\`) agregan estilos para pantallas mas grandes. No existe un prefijo para "solo movil" - simplemente no uses prefijo.`,
      codeExample: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-6 bg-gray-100 space-y-4">\n  <button class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">\n    Hover y Active\n  </button>\n  <div class="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">\n    <h3 class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Group Hover</h3>\n    <p class="text-gray-500 group-hover:text-gray-700 transition-colors text-sm mt-1">Pasa el mouse sobre toda la tarjeta para ver el efecto group-hover.</p>\n  </div>\n  <input class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Focus en este input...">\n</div>`,
        css: ``,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "24-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Cual es el enfoque principal de Tailwind CSS?",
      options: [
        { id: "a", text: "Componentes predefinidos como Bootstrap", isCorrect: false },
        { id: "b", text: "Utility-first: clases utilitarias de bajo nivel", isCorrect: true },
        { id: "c", text: "Animaciones y transiciones complejas", isCorrect: false },
        { id: "d", text: "Preprocesamiento de CSS como Sass", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Tailwind se basa en utilidades pequenas que se combinan, no en componentes grandes.",
      explanation:
        "Tailwind CSS usa el enfoque utility-first: proporciona cientos de clases utilitarias de bajo nivel (como p-4, text-xl, bg-blue-500) que se combinan directamente en el HTML para construir cualquier diseno.",
    },
    {
      id: "24-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa la clase de Tailwind para agregar padding de 1rem (16px) a un elemento:",
      codeTemplate: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="___">Contenido con padding</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["p-4"],
      },
      validation: { type: "exact", answer: "p-4" },
      hint: "En Tailwind, p = padding y el numero sigue la escala de 4px. Para 16px, necesitas 16/4 = 4.",
      explanation:
        "En Tailwind, p-4 aplica padding de 1rem (16px) en todos los lados. La escala de espaciado multiplica el numero por 4px: p-1 = 4px, p-2 = 8px, p-3 = 12px, p-4 = 16px.",
    },
    {
      id: "24-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt:
        "En Tailwind, que hace la clase 'flex justify-between items-center'?",
      options: [
        { id: "a", text: "Crea un grid con 3 columnas centradas", isCorrect: false },
        { id: "b", text: "Crea un flexbox con elementos separados en el eje principal y centrados en el cruzado", isCorrect: true },
        { id: "c", text: "Centra el texto y agrega un borde", isCorrect: false },
        { id: "d", text: "Crea un layout de 2 columnas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "flex activa flexbox, justify-between separa los items, items-center los centra verticalmente.",
      explanation:
        "'flex' activa display: flex. 'justify-between' aplica justify-content: space-between (distribuye con espacio entre elementos). 'items-center' aplica align-items: center (centra verticalmente). Es un patron muy comun para barras de navegacion.",
    },
    {
      id: "24-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada clase de Tailwind a la propiedad CSS que genera:",
      dragItems: [
        { id: "drag-1", content: "rounded-lg", correctZone: "zone-radius" },
        { id: "drag-2", content: "shadow-md", correctZone: "zone-shadow" },
        { id: "drag-3", content: "text-xl", correctZone: "zone-font" },
        { id: "drag-4", content: "bg-blue-500", correctZone: "zone-bg" },
      ],
      dropZones: [
        { id: "zone-radius", label: "border-radius: 0.5rem (8px)" },
        { id: "zone-shadow", label: "box-shadow mediana" },
        { id: "zone-font", label: "font-size: 1.25rem" },
        { id: "zone-bg", label: "background-color: azul medio (#3b82f6)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-radius",
          "drag-2": "zone-shadow",
          "drag-3": "zone-font",
          "drag-4": "zone-bg",
        },
      },
      hint: "rounded = border-radius, shadow = box-shadow, text-xl = font-size, bg = background-color.",
      explanation:
        "rounded-lg aplica border-radius de 8px. shadow-md aplica una sombra mediana. text-xl establece font-size en 1.25rem. bg-blue-500 aplica un color de fondo azul medio.",
    },
    {
      id: "24-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt:
        "Completa el prefijo de Tailwind para que el fondo solo cambie en pantallas medianas (768px) y superiores:",
      codeTemplate: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="bg-white ___:bg-blue-500">Fondo azul en desktop</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["md"],
      },
      validation: { type: "exact", answer: "md" },
      hint: "Es el prefijo de breakpoint para 768px en Tailwind. Dos letras.",
      explanation:
        "El prefijo md: en Tailwind aplica estilos a partir de 768px (pantallas medianas). Es equivalente a @media (min-width: 768px). Los breakpoints de Tailwind son: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).",
    },
    {
      id: "24-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 6,
      prompt:
        "Crea una tarjeta con Tailwind que tenga: un div contenedor con clases 'max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden', dentro un div con 'p-6', un h2 con 'text-xl font-bold text-gray-900 mb-2' con texto 'Mi Tarjeta', un p con 'text-gray-600 text-sm' con un texto descriptivo, y un boton con 'mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors' con texto 'Ver mas'.",
      codeTemplate: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-8 bg-gray-100 min-h-[200px] flex items-center justify-center">`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "",
      validation: {
        type: "includes",
        answer: [
          "max-w-sm",
          "rounded-xl",
          "shadow-lg",
          "font-bold",
          "bg-blue-500",
          "hover:bg-blue-600",
        ],
      },
      hint: "Construye la tarjeta paso a paso: contenedor con max-w-sm, padding con p-6, titulo con text-xl font-bold, y boton con bg-blue-500.",
      explanation:
        "La tarjeta de Tailwind se construye combinando clases utilitarias: max-w-sm para ancho maximo, rounded-xl y shadow-lg para apariencia, p-6 para padding interno, y clases de tipografia y color para el contenido. El boton usa hover:bg-blue-600 para interactividad.",
    },
    {
      id: "24-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt:
        "Como se aplica un estilo de hover al padre que afecte a un hijo en Tailwind?",
      options: [
        { id: "a", text: "Usando 'parent-hover:' en el hijo", isCorrect: false },
        { id: "b", text: "Usando 'group' en el padre y 'group-hover:' en el hijo", isCorrect: true },
        { id: "c", text: "No es posible en Tailwind", isCorrect: false },
        { id: "d", text: "Usando 'hover:child:' en el padre", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Tailwind usa un concepto de 'grupo' donde el padre se marca y los hijos reaccionan.",
      explanation:
        "En Tailwind, para estilos basados en el estado del padre: agrega la clase 'group' al padre, y en los hijos usa 'group-hover:', 'group-focus:', etc. Ejemplo: <div class='group'><p class='group-hover:text-blue-500'>...</p></div>.",
    },
    {
      id: "24-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt:
        "Completa el prefijo de Tailwind para aplicar un fondo oscuro cuando el modo oscuro esta activo:",
      codeTemplate: {
        html: `<script src="https://cdn.tailwindcss.com"></script>\n<div class="bg-white ___:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-lg">\n  Contenido con dark mode\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["dark"],
      },
      validation: { type: "exact", answer: "dark" },
      hint: "Es el prefijo de cuatro letras que activa estilos para el modo oscuro.",
      explanation:
        "El prefijo dark: en Tailwind aplica estilos cuando el modo oscuro esta activo. Se puede activar por clase (agregando 'dark' al html) o por preferencia del sistema (prefers-color-scheme). Ejemplo: dark:bg-gray-900 aplica fondo oscuro solo en dark mode.",
    },
  ],
};
