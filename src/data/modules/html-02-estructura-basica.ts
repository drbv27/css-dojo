import type { ModuleData } from "@/types";

export const htmlEstructuraModule: ModuleData = {
  slug: "html-02-estructura-basica",
  title: "Estructura básica de HTML",
  description:
    "Aprende en detalle la estructura de un documento HTML: DOCTYPE, etiquetas meta, title, comentarios y buenas prácticas de indentación.",
  order: 2,
  dojo: "html",
  category: "html-fundamentals",
  icon: "layout",
  lessons: [
    {
      id: "html-02-leccion-01",
      title: "DOCTYPE y la etiqueta html",
      content: `## DOCTYPE y la etiqueta html

### La declaración DOCTYPE

\`<!DOCTYPE html>\` no es una etiqueta HTML propiamente dicha, sino una **instrucción para el navegador**. Le indica que versión de HTML estamos utilizando.

En HTML5, la declaración es muy simple:

\`\`\`html
<!DOCTYPE html>
\`\`\`

En versiones anteriores era mucho mas complicada. Por ejemplo, en HTML 4.01:

\`\`\`html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
\`\`\`

### La etiqueta \`<html>\`

Es el **elemento raíz** del documento. Todo el contenido HTML debe estar dentro de esta etiqueta.

Se recomienda siempre incluir el atributo **\`lang\`** para indicar el idioma del contenido:

\`\`\`html
<html lang="es">
\`\`\`

Esto ayuda a:
- Los **lectores de pantalla** a pronunciar correctamente el contenido
- Los **motores de busqueda** a clasificar la página por idioma
- Los **traductores automáticos** a identificar el idioma original

> **Buena práctica:** Siempre específica el atributo \`lang\` en la etiqueta \`<html>\`. Para espanol usa \`"es"\`, para ingles \`"en"\`.`,
      codeExample: {
        html: `<!DOCTYPE html>\n<html lang="es">\n  <head>\n    <title>Documento en espanol</title>\n  </head>\n  <body>\n    <p>Este documento esta en espanol.</p>\n  </body>\n</html>`,
        css: `p {\n  font-family: sans-serif;\n  color: #4a5568;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-02-leccion-02",
      title: "La etiqueta head y metadatos",
      content: `## La etiqueta head y metadatos

La etiqueta \`<head>\` contiene **información sobre el documento** que no se muestra directamente en la página. Aquí van los metadatos.

### Elementos esenciales del head

#### 1. meta charset
Define la **codificación de caracteres**. Siempre usa UTF-8 para soportar acentos, enes y caracteres especiales:

\`\`\`html
<meta charset="UTF-8">
\`\`\`

#### 2. title
El **título de la página**. Aparece en la pestana del navegador y en los resultados de busqueda:

\`\`\`html
<title>Mi sitio web - Inicio</title>
\`\`\`

#### 3. meta viewport
Esencial para que la página se vea bien en **dispositivos móviles**:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

#### 4. meta description
Una descripción breve de la página para **motores de busqueda**:

\`\`\`html
<meta name="description" content="Aprende HTML desde cero">
\`\`\`

### Ejemplo completo de head

\`\`\`html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Mi sitio web personal">
  <title>Mi Sitio Web</title>
</head>
\`\`\`

> **Importante:** Sin \`<meta charset="UTF-8">\`, los caracteres especiales como n, acentos y signos de interrogación invertidos pueden no mostrarse correctamente.`,
      codeExample: {
        html: `<!DOCTYPE html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mi sitio web</title>\n  </head>\n  <body>\n    <h1>Pagina con metadatos correctos</h1>\n    <p>Los acentos y la n funcionan perfectamente.</p>\n  </body>\n</html>`,
        css: `h1 {\n  color: #2d3748;\n  font-family: sans-serif;\n}\n\np {\n  color: #718096;\n  font-family: sans-serif;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-02-leccion-03",
      title: "Comentarios e indentación",
      content: `## Comentarios e indentación

### Comentarios en HTML

Los comentarios son notas que dejas en el código para ti o para otros desarrolladores. **El navegador los ignora completamente.**

\`\`\`html
<!-- Esto es un comentario -->
\`\`\`

Los comentarios pueden abarcar múltiples líneas:

\`\`\`html
<!--
  Este es un comentario
  de varias lineas
-->
\`\`\`

### Usos comunes de los comentarios

- **Explicar** secciones complejas del código
- **Desactivar** temporalmente partes del HTML
- **Organizar** el código con separadores visuales

### Indentación: buenas prácticas

La indentación no afecta como se muestra la página, pero hace que el código sea **mucho mas legible**.

#### Reglas recomendadas:

1. Usa **2 o 4 espacios** de indentación (se consistente)
2. Indenta los **elementos hijos** un nivel mas que su padre
3. Las etiquetas de **apertura y cierre** deben estar al mismo nivel
4. Los elementos que van **en una sola línea** no necesitan indentación extra

\`\`\`html
<!-- Buena indentacion -->
<body>
  <header>
    <h1>Mi sitio</h1>
  </header>
  <main>
    <p>Contenido principal</p>
  </main>
</body>
\`\`\`

> **Consejo:** La mayoria de los editores de código como VS Code pueden formatear automáticamente tu HTML. Usa el atajo Shift + Alt + F.`,
      codeExample: {
        html: `<!-- Seccion de bienvenida -->\n<header>\n  <h1>Bienvenido</h1>\n  <!-- TODO: agregar logo aqui -->\n</header>\n\n<!-- Contenido principal -->\n<main>\n  <p>Este codigo esta bien indentado y comentado.</p>\n  <p>Los comentarios ayudan a entender la estructura.</p>\n</main>`,
        css: `header {\n  background-color: #edf2f7;\n  padding: 16px;\n  border-radius: 8px;\n  margin-bottom: 12px;\n}\n\nh1 {\n  color: #2d3748;\n  font-family: sans-serif;\n  margin: 0;\n}\n\np {\n  color: #4a5568;\n  font-family: sans-serif;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html-02-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Cuál es la función principal de la etiqueta <head> en un documento HTML?",
      options: [
        { id: "a", text: "Mostrar el encabezado de la página", isCorrect: false },
        { id: "b", text: "Contener los metadatos y configuración del documento", isCorrect: true },
        { id: "c", text: "Definir la cabecera visual del sitio web", isCorrect: false },
        { id: "d", text: "Agregar el título principal de la página", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "No confundas <head> con <header>. El head no muestra contenido visible.",
      explanation:
        "La etiqueta <head> contiene metadatos como charset, title, viewport y otros elementos de configuración que no son visibles directamente.",
    },
    {
      id: "html-02-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Completa la etiqueta meta para definir la codificación de caracteres como UTF-8:",
      codeTemplate: {
        html: `<head>\n  <meta _____="UTF-8">\n  <title>Mi pagina</title>\n</head>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["charset"],
      },
      validation: { type: "exact", answer: ["charset"] },
      hint: "Es un atributo que define el conjunto de caracteres (character set).",
      explanation:
        "El atributo charset='UTF-8' asegura que los caracteres especiales como acentos y la n se muestren correctamente.",
    },
    {
      id: "html-02-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "¿Para que sirve el atributo lang en la etiqueta <html>?",
      options: [
        { id: "a", text: "Cambiar el idioma de la interfaz del navegador", isCorrect: false },
        { id: "b", text: "Traducir automáticamente el contenido", isCorrect: false },
        { id: "c", text: "Indicar el idioma del contenido del documento", isCorrect: true },
        { id: "d", text: "Activar el corrector ortografico", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Ayuda a lectores de pantalla y motores de busqueda.",
      explanation:
        "El atributo lang indica el idioma del contenido, lo que ayuda a lectores de pantalla, motores de busqueda y traductores automáticos.",
    },
    {
      id: "html-02-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Completa la meta etiqueta viewport para dispositivos móviles:",
      codeTemplate: {
        html: `<meta name="_____" content="width=device-width, initial-scale=1.0">`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["viewport"],
      },
      validation: { type: "exact", answer: ["viewport"] },
      hint: "Se relaciona con la ventana de visualización del dispositivo.",
      explanation:
        "La meta viewport con width=device-width e initial-scale=1.0 asegura que la página se ajuste al ancho del dispositivo.",
    },
    {
      id: "html-02-ej-05",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Arrastra cada elemento a la sección del documento HTML donde debe ir:",
      dragItems: [
        { id: "d1", content: "<meta charset=\"UTF-8\">", correctZone: "z1" },
        { id: "d2", content: "<h1>Hola mundo</h1>", correctZone: "z2" },
        { id: "d3", content: "<title>Mi pagina</title>", correctZone: "z1" },
        { id: "d4", content: "<p>Bienvenido</p>", correctZone: "z2" },
      ],
      dropZones: [
        { id: "z1", label: "Dentro de <head>" },
        { id: "z2", label: "Dentro de <body>" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z1", d4: "z2" },
      },
      hint: "Los metadatos van en head, el contenido visible va en body.",
      explanation:
        "Las etiquetas meta y title van dentro de <head>. Los elementos visibles como h1 y p van dentro de <body>.",
    },
    {
      id: "html-02-ej-06",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Crea un documento HTML5 completo con: DOCTYPE, html con lang='es', head con meta charset UTF-8, meta viewport, título 'Dev Dojo', y un body con un párrafo que diga 'Aprendiendo HTML'.",
      codeTemplate: {
        html: `<!-- Escribe el documento HTML completo -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "!doctype",
          "html[lang=\"es\"]",
          "meta[charset]",
          "meta[name=\"viewport\"]",
          "head > title",
          "body > p",
        ],
      },
      hint: "Recuerda la estructura: DOCTYPE, html, head (con meta y title), body (con p).",
      explanation:
        "Un documento HTML5 completo incluye DOCTYPE, html con lang, head con charset, viewport y title, y body con el contenido.",
    },
    {
      id: "html-02-ej-07",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 7,
      prompt: "¿Cuál es la sintaxis correcta para escribir un comentario en HTML?",
      options: [
        { id: "a", text: "// Esto es un comentario", isCorrect: false },
        { id: "b", text: "/* Esto es un comentario */", isCorrect: false },
        { id: "c", text: "<!-- Esto es un comentario -->", isCorrect: true },
        { id: "d", text: "# Esto es un comentario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Los comentarios HTML empiezan con <!-- y terminan con -->.",
      explanation:
        "En HTML, los comentarios se escriben entre <!-- y -->. Las otras opciones son comentarios de JavaScript, CSS y otros lenguajes.",
    },
  ],
};
