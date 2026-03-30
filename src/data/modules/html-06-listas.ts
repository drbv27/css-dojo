import type { ModuleData } from "@/types";

export const htmlListasModule: ModuleData = {
  slug: "html-06-listas",
  title: "Listas en HTML",
  description:
    "Domina las listas en HTML: listas no ordenadas, ordenadas con atributos especiales, listas anidadas y listas de descripcion.",
  order: 6,
  dojo: "html",
  category: "html-fundamentals",
  icon: "list",
  lessons: [
    {
      id: "html-06-leccion-01",
      title: "Listas no ordenadas (ul)",
      content: `## Listas no ordenadas: \`<ul>\`

Una lista no ordenada presenta elementos **sin un orden especifico**. Se crea con la etiqueta \`<ul>\` (unordered list) y cada elemento con \`<li>\` (list item).

### Estructura basica

\`\`\`html
<ul>
  <li>Manzanas</li>
  <li>Naranjas</li>
  <li>Platanos</li>
</ul>
\`\`\`

Por defecto, los elementos se muestran con **viñetas** (puntos negros).

### Usos comunes

- **Menus de navegacion**: la mayoria de menus web son listas no ordenadas estilizadas con CSS
- **Listas de caracteristicas**: funcionalidades de un producto
- **Ingredientes**: en una receta de cocina
- **Cualquier grupo** de elementos donde el orden no importa

### Reglas importantes

1. Dentro de \`<ul>\`, **solo** deben ir elementos \`<li>\` como hijos directos
2. Dentro de cada \`<li>\` puedes poner cualquier contenido: texto, enlaces, imagenes, incluso otras listas

> **Dato:** La etiqueta \`<ul>\` es una de las mas usadas en la web. Casi todos los menus de navegacion estan construidos con listas no ordenadas.`,
      codeExample: {
        html: `<h2>Lista de compras</h2>\n<ul>\n  <li>Pan integral</li>\n  <li>Leche descremada</li>\n  <li>Huevos</li>\n  <li>Frutas frescas</li>\n  <li>Verduras variadas</li>\n</ul>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n}\n\nul {\n  font-family: sans-serif;\n  color: #4a5568;\n  line-height: 1.8;\n}\n\nli {\n  padding: 2px 0;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-06-leccion-02",
      title: "Listas ordenadas (ol)",
      content: `## Listas ordenadas: \`<ol>\`

Una lista ordenada presenta elementos en un **orden secuencial**. Se crea con \`<ol>\` (ordered list) y cada elemento con \`<li>\`.

### Estructura basica

\`\`\`html
<ol>
  <li>Primer paso</li>
  <li>Segundo paso</li>
  <li>Tercer paso</li>
</ol>
\`\`\`

Por defecto, los elementos se numeran con **numeros arabigos** (1, 2, 3...).

### Atributos especiales de \`<ol>\`

#### \`type\` — Tipo de numeracion
- \`type="1"\` — Numeros (por defecto): 1, 2, 3
- \`type="A"\` — Letras mayusculas: A, B, C
- \`type="a"\` — Letras minusculas: a, b, c
- \`type="I"\` — Numeros romanos mayusculas: I, II, III
- \`type="i"\` — Numeros romanos minusculas: i, ii, iii

#### \`start\` — Numero inicial
Define desde que numero empieza la lista:

\`\`\`html
<ol start="5">
  <li>Este es el elemento 5</li>
  <li>Este es el elemento 6</li>
</ol>
\`\`\`

#### \`reversed\` — Orden inverso
Numera los elementos de mayor a menor:

\`\`\`html
<ol reversed>
  <li>Tercer lugar</li>
  <li>Segundo lugar</li>
  <li>Primer lugar</li>
</ol>
\`\`\`

> **Tip:** Usa \`<ol>\` siempre que el orden de los elementos sea relevante: pasos de instrucciones, rankings, procedimientos.`,
      codeExample: {
        html: `<h2>Pasos para crear una pagina web</h2>\n<ol>\n  <li>Crear el archivo HTML</li>\n  <li>Escribir la estructura basica</li>\n  <li>Agregar contenido</li>\n  <li>Aplicar estilos CSS</li>\n</ol>\n\n<h2>Top 3 lenguajes (reversed)</h2>\n<ol reversed type="1">\n  <li>JavaScript</li>\n  <li>Python</li>\n  <li>HTML/CSS</li>\n</ol>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n  margin-top: 16px;\n}\n\nol {\n  font-family: sans-serif;\n  color: #4a5568;\n  line-height: 1.8;\n}\n\nli {\n  padding: 2px 0;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-06-leccion-03",
      title: "Listas anidadas y listas de descripcion",
      content: `## Listas anidadas y listas de descripcion

### Listas anidadas

Puedes colocar una lista **dentro de otra** para crear subniveles. La lista hija va dentro de un \`<li>\`:

\`\`\`html
<ul>
  <li>Frutas
    <ul>
      <li>Manzana</li>
      <li>Naranja</li>
    </ul>
  </li>
  <li>Verduras
    <ul>
      <li>Zanahoria</li>
      <li>Brocoli</li>
    </ul>
  </li>
</ul>
\`\`\`

Puedes anidar \`<ul>\` dentro de \`<ol>\` y viceversa. No hay limite de niveles, pero se recomienda no pasar de **3 niveles** para mantener la legibilidad.

### Listas de descripcion: \`<dl>\`, \`<dt>\`, \`<dd>\`

Las listas de descripcion asocian **terminos con sus definiciones**:

- \`<dl>\` — Definition List (contenedor)
- \`<dt>\` — Definition Term (termino)
- \`<dd>\` — Definition Description (descripcion)

\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>Lenguaje de marcado para la web.</dd>
  <dt>CSS</dt>
  <dd>Lenguaje de estilos para la web.</dd>
</dl>
\`\`\`

### Usos de listas de descripcion

- **Glosarios** de terminos
- **Metadatos**: autor, fecha, categoria
- **Preguntas frecuentes** (FAQ)

> **Consejo:** Las listas de descripcion son perfectas para glosarios y definiciones. Muchos desarrolladores las desconocen, pero son muy utiles y semanticas.`,
      codeExample: {
        html: `<h2>Menu del sitio (anidado)</h2>\n<ul>\n  <li>Inicio</li>\n  <li>Cursos\n    <ul>\n      <li>HTML Basico</li>\n      <li>CSS Avanzado</li>\n      <li>JavaScript\n        <ul>\n          <li>Fundamentos</li>\n          <li>DOM</li>\n        </ul>\n      </li>\n    </ul>\n  </li>\n  <li>Contacto</li>\n</ul>\n\n<h2>Glosario</h2>\n<dl>\n  <dt>HTML</dt>\n  <dd>HyperText Markup Language</dd>\n  <dt>CSS</dt>\n  <dd>Cascading Style Sheets</dd>\n  <dt>JS</dt>\n  <dd>JavaScript</dd>\n</dl>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n  margin-top: 16px;\n}\n\nul, dl {\n  font-family: sans-serif;\n  color: #4a5568;\n  line-height: 1.8;\n}\n\ndt {\n  font-weight: bold;\n  color: #2b6cb0;\n}\n\ndd {\n  margin-left: 20px;\n  margin-bottom: 8px;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html-06-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que etiqueta se usa para crear una lista no ordenada?",
      options: [
        { id: "a", text: "<list>", isCorrect: false },
        { id: "b", text: "<ol>", isCorrect: false },
        { id: "c", text: "<ul>", isCorrect: true },
        { id: "d", text: "<dl>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es la abreviatura de 'unordered list'.",
      explanation:
        "La etiqueta <ul> (unordered list) crea una lista no ordenada con viñetas.",
    },
    {
      id: "html-06-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa las etiquetas de apertura y cierre para que esta sea una lista ordenada:",
      codeTemplate: {
        html: `<_____>\n  <li>Primero</li>\n  <li>Segundo</li>\n  <li>Tercero</li>\n</_____>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["ol", "ol"],
      },
      validation: { type: "exact", answer: ["ol", "ol"] },
      hint: "Es la abreviatura de 'ordered list'.",
      explanation:
        "La etiqueta <ol> crea una lista ordenada donde los elementos se numeran automaticamente.",
    },
    {
      id: "html-06-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Que atributo de <ol> hace que la numeracion vaya de mayor a menor?",
      options: [
        { id: "a", text: "reverse", isCorrect: false },
        { id: "b", text: "reversed", isCorrect: true },
        { id: "c", text: "desc", isCorrect: false },
        { id: "d", text: "order='desc'", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un atributo booleano cuyo nombre sugiere 'invertido'.",
      explanation:
        "El atributo reversed en <ol> hace que la numeracion vaya en orden descendente (de mayor a menor).",
    },
    {
      id: "html-06-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Arrastra cada etiqueta de lista de descripcion a su funcion:",
      dragItems: [
        { id: "d1", content: "<dl>", correctZone: "z1" },
        { id: "d2", content: "<dt>", correctZone: "z2" },
        { id: "d3", content: "<dd>", correctZone: "z3" },
      ],
      dropZones: [
        { id: "z1", label: "Contenedor de la lista de descripcion" },
        { id: "z2", label: "Termino o palabra a definir" },
        { id: "z3", label: "Descripcion o definicion del termino" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3" },
      },
      hint: "dl = definition list, dt = definition term, dd = definition description.",
      explanation:
        "<dl> es el contenedor, <dt> es el termino que se define y <dd> es la descripcion o definicion del termino.",
    },
    {
      id: "html-06-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea una lista no ordenada <ul> con 3 elementos. El segundo elemento debe contener una lista ordenada <ol> anidada con 2 sub-elementos.",
      codeTemplate: {
        html: `<!-- Crea la lista con anidacion -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<ul>", "<li>", "<ol>", "</ol>", "</li>", "</ul>"],
      },
      hint: "Coloca un <ol> dentro de un <li> del <ul> principal.",
      explanation:
        "Las listas anidadas se crean colocando una nueva lista (<ol> o <ul>) dentro de un elemento <li> de la lista padre.",
    },
    {
      id: "html-06-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Completa la lista ordenada para que empiece en el numero 5 y use letras mayusculas:",
      codeTemplate: {
        html: `<ol _____="5" _____="A">\n  <li>Elemento E</li>\n  <li>Elemento F</li>\n  <li>Elemento G</li>\n</ol>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["start", "type"],
      },
      validation: { type: "exact", answer: ["start", "type"] },
      hint: "Un atributo define el inicio y otro el tipo de numeracion.",
      explanation:
        "El atributo start define desde que numero empieza la lista y type define el estilo de numeracion (A para letras mayusculas).",
    },
    {
      id: "html-06-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea una lista de descripcion <dl> con al menos 2 terminos (<dt>) y sus definiciones (<dd>). Tema: conceptos basicos de desarrollo web.",
      codeTemplate: {
        html: `<!-- Crea la lista de descripcion -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<dl>", "<dt>", "</dt>", "<dd>", "</dd>", "</dl>"],
      },
      hint: "Usa dl como contenedor, dt para cada termino y dd para cada definicion.",
      explanation:
        "Las listas de descripcion <dl> son ideales para glosarios: <dt> define el termino y <dd> su descripcion.",
    },
  ],
};
