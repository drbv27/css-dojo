import type { ModuleData } from "@/types";

export const queEsCSSModule: ModuleData = {
  slug: "que-es-css",
  title: "¿Qué es CSS?",
  description:
    "Descubre que es CSS, cómo funciona y las distintas formas de agregar estilos a tus documentos HTML.",
  order: 1,
  dojo: "css" as const,
  category: "css-fundamentos",
  icon: "Paintbrush",
  lessons: [
    {
      id: "01-leccion-01",
      title: "¿Qué es CSS?",
      content: `## ¿Qué es CSS?

**CSS** significa **Cascading Style Sheets** (Hojas de Estilo en Cascada). Es el lenguaje que utilizamos para **dar estilo y presentación** a los documentos HTML.

Si HTML es el esqueleto de una página web, **CSS es la piel, la ropa y el maquillaje**. Sin CSS, todas las páginas web se verian como documentos de texto plano con enlaces azules.

### ¿Qué puede hacer CSS?

- Cambiar **colores** de texto y fondos
- Definir **tipografías** y tamaños de letra
- Controlar el **espaciado** y la disposición de los elementos
- Crear **animaciones** y transiciones
- Adaptar el diseño a **diferentes dispositivos** (responsive design)

### Un poco de historia

CSS fue propuesto por **Hakon Wium Lie** en 1994 y la primera versión oficial (CSS1) se público en 1996. Actualmente trabajamos con CSS3, que se desarrolla en modulos independientes.

> **Dato curioso:** Antes de CSS, los estilos se aplicaban directamente en HTML con etiquetas como \`<font>\` y atributos como \`bgcolor\`. Era un caos absoluto.`,
      codeExample: {
        html: `<h1>Hola Mundo</h1>\n<p>Este es un parrafo con estilos CSS.</p>`,
        css: `h1 {\n  color: steelblue;\n  font-size: 32px;\n}\n\np {\n  color: slategray;\n  font-size: 18px;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "01-leccion-02",
      title: "Anatomia de una regla CSS",
      content: `## Anatomia de una regla CSS

Una **regla CSS** se compone de tres partes fundamentales:

### 1. Selector
Indica **a que elemento(s)** HTML se le aplicaran los estilos. En el ejemplo de abajo, \`main\` es el selector.

### 2. Propiedad
Es el **aspecto visual** que queremos cambiar. Por ejemplo, \`background-color\` cambia el color de fondo.

### 3. Valor
Es el **dato específico** que le asignamos a la propiedad. Por ejemplo, \`lightslategray\` es un color valido en CSS.

### Estructura completa

\`\`\`css
selector {
  propiedad: valor;
}
\`\`\`

Cada par \`propiedad: valor\` se llama **declaración** y termina con punto y coma (\`;\`). Las declaraciones van dentro de llaves (\`{ }\`), que forman el **bloque de declaraciones**.

### Múltiples declaraciones

Puedes incluir tantas declaraciones como necesites dentro de una misma regla:

\`\`\`css
main {
  background-color: lightslategray;
  color: white;
  padding: 20px;
}
\`\`\`

> **Importante:** No olvides el punto y coma al final de cada declaración. Olvidarlo es uno de los errores más comunes para principiantes.`,
      codeExample: {
        html: `<main>\n  <h2>Bienvenido al Dev Dojo</h2>\n  <p>Aprende CSS paso a paso.</p>\n</main>`,
        css: `main {\n  background-color: lightslategray;\n  color: white;\n  padding: 20px;\n  border-radius: 8px;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "01-leccion-03",
      title: "Formas de añadir estilos",
      content: `## Formas de añadir estilos CSS

Existen **tres formas** de agregar CSS a un documento HTML. Cada una tiene sus ventajas y desventajas.

---

### 1. Estilos en línea (inline)

Se agregan directamente en el atributo \`style\` de un elemento HTML:

\`\`\`html
<p style="color: red; font-size: 18px;">Texto rojo</p>
\`\`\`

**Desventajas:** No se puede reutilizar, mezcla contenido con presentación, difícil de mantener. Se considera un **anti-patrón**.

---

### 2. Estilos internos (en el archivo)

Se escriben dentro de una etiqueta \`<style>\` en el \`<head>\` del documento:

\`\`\`html
<head>
  <style>
    p { color: red; }
  </style>
</head>
\`\`\`

**Ventaja:** Útil para páginas únicas o prototipos rápidos.
**Desventaja:** No se comparte entre páginas.

---

### 3. Hoja de estilos externa (recomendado)

Se crea un archivo \`.css\` separado y se enlaza con la etiqueta \`<link>\`:

\`\`\`html
<head>
  <link rel="stylesheet" href="estilos.css">
</head>
\`\`\`

**Ventajas:**
- **Separación de responsabilidades:** HTML para contenido, CSS para presentación
- **Reutilización:** Un mismo archivo CSS para múltiples páginas
- **Cache del navegador:** Se descarga una vez y se reutiliza
- **Mantenimiento:** Cambias un archivo y se actualiza todo el sitio

> **Recomendación:** Siempre usa hojas de estilo externas en proyectos reales.`,
      codeExample: {
        html: `<!-- Forma recomendada: archivo externo -->\n<head>\n  <link rel="stylesheet" href="estilos.css">\n</head>\n<body>\n  <p>Este parrafo recibe estilos del archivo externo.</p>\n</body>`,
        css: `/* Contenido de estilos.css */\np {\n  color: darkslateblue;\n  font-size: 18px;\n  line-height: 1.6;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "01-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Qué significa CSS?",
      options: [
        { id: "a", text: "Cascading Style Sheets", isCorrect: true },
        { id: "b", text: "Computer Style Sheets", isCorrect: false },
        { id: "c", text: "Creative Style Sheets", isCorrect: false },
        { id: "d", text: "Colorful Style Sheets", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "La primera palabra hace referencia a cómo se aplican los estilos: en cascada.",
      explanation:
        "CSS significa Cascading Style Sheets (Hojas de Estilo en Cascada). El término 'cascada' se refiere al mecanismo que determina que estilos se aplican cuando hay múltiples reglas en conflicto.",
    },
    {
      id: "01-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "¿Cuál es la forma recomendada de añadir estilos CSS a un sitio web?",
      options: [
        { id: "a", text: "Estilos en línea (atributo style)", isCorrect: false },
        { id: "b", text: "Estilos internos (etiqueta <style>)", isCorrect: false },
        {
          id: "c",
          text: "Hoja de estilos externa (archivo .css con <link>)",
          isCorrect: true,
        },
        { id: "d", text: "Usando JavaScript para modificar estilos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Piensa en cual opción permite reutilizar estilos en múltiples páginas.",
      explanation:
        "La hoja de estilos externa es la forma recomendada porque separa el contenido (HTML) de la presentación (CSS), permite reutilizar estilos en múltiples páginas y el navegador puede almacenarla en cache.",
    },
    {
      id: "01-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt:
        "Completa el selector para que esta regla CSS aplique estilos a todos los elementos <p> del documento:",
      codeTemplate: {
        html: "",
        cssPrefix: "___",
        cssSuffix: " {\n  color: red;\n}",
        blanks: ["p"],
      },
      validation: { type: "exact", answer: "p" },
      hint: "Un selector de tipo usa directamente el nombre de la etiqueta HTML, sin ningun prefijo.",
      explanation:
        "El selector 'p' es un selector de tipo que selecciona todos los elementos <p> del documento. No necesita ningun prefijo como '.' o '#'.",
    },
    {
      id: "01-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada parte de la regla CSS `main { background-color: lightslategray; }` a su categoría correcta:",
      dragItems: [
        { id: "drag-1", content: "main", correctZone: "zone-selector" },
        {
          id: "drag-2",
          content: "background-color",
          correctZone: "zone-propiedad",
        },
        {
          id: "drag-3",
          content: "lightslategray",
          correctZone: "zone-valor",
        },
      ],
      dropZones: [
        { id: "zone-selector", label: "Selector" },
        { id: "zone-propiedad", label: "Propiedad" },
        { id: "zone-valor", label: "Valor" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-selector",
          "drag-2": "zone-propiedad",
          "drag-3": "zone-valor",
        },
      },
      hint: "El selector indica A QUIEN se aplica, la propiedad indica QUE se cambia y el valor indica Cómo se cambia.",
      explanation:
        "'main' es el selector (indica el elemento), 'background-color' es la propiedad (que aspecto cambiar) y 'lightslategray' es el valor (el color específico).",
    },
    {
      id: "01-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Completa la etiqueta HTML para importar correctamente una hoja de estilos externa llamada 'estilos.css':",
      codeTemplate: {
        html: `<head>\n  <link rel="___" href="estilos.css">\n</head>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["stylesheet"],
      },
      validation: { type: "exact", answer: "stylesheet" },
      hint: "El atributo 'rel' indica la relación entre el documento HTML y el archivo enlazado. En CSS, esa relación es...",
      explanation:
        "El valor 'stylesheet' en el atributo rel indica al navegador que el archivo enlazado es una hoja de estilos CSS. La etiqueta completa es: <link rel=\"stylesheet\" href=\"estilos.css\">",
    },
    {
      id: "01-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "¿Cuál de estas formas de añadir estilos CSS es considerada un anti-patrón en proyectos profesionales?",
      options: [
        {
          id: "a",
          text: "Estilos en línea (atributo style)",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Hoja de estilos externa",
          isCorrect: false,
        },
        { id: "c", text: "Ambas", isCorrect: false },
        { id: "d", text: "Ninguna", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Un anti-patrón es una práctica que parece funcionar pero genera problemas a largo plazo. Piensa en cual forma mezcla contenido y presentación directamente.",
      explanation:
        "Los estilos en línea (inline) se consideran un anti-patrón porque mezclan contenido con presentación, no se pueden reutilizar, tienen una especificidad muy alta y hacen que el código sea difícil de mantener.",
    },
  ],
};
