import type { ModuleData } from "@/types";

export const htmlProyectoCVModule: ModuleData = {
  slug: "html-16-proyecto-cv",
  title: "Proyecto: Tu hoja de vida en HTML",
  description:
    "Ejercicio integrador de cierre del track de HTML: construye una hoja de vida (CV) completa, semantica, accesible y valida. Es el esqueleto que despues vestiras con CSS.",
  // Closes the track, so it renders after every content module. The slug keeps
  // its original "16" because it is a live URL and progress records key on it.
  order: 17,
  dojo: "html",
  category: "html-projects",
  icon: "file-code",
  lessons: [
    {
      id: "html16-leccion-01",
      title: "El proyecto: tu CV en HTML",
      content: `## El proyecto: tu hoja de vida en HTML

Llegaste al cierre de HTML. Vamos a **juntar todo** lo aprendido en un solo documento util de verdad:
**tu hoja de vida (CV)**.

### Una aclaracion importante

HTML **no** hace que las cosas se vean bonitas: eso es trabajo de **CSS**, que viene en el proximo modulo.
Asi que este CV va a verse **plano a proposito** — texto negro sobre fondo blanco. Y esta perfecto:

> **HTML es el esqueleto.** Lo que evaluamos aca no es el diseno, sino que el documento tenga una
> **estructura correcta, semantica, accesible y valida**. En el modulo de CSS retomaras **este mismo CV**
> y le pondras la piel (colores, tipografia, columnas). Hoy construyes; despues decoras.

### Por que un CV

Porque es un **documento real** (no un "sitio"): se compone de texto, titulos, listas y una tabla —
justo lo que HTML hace bien. Y al terminar tendras algo tuyo, listo para reutilizar.

### Lo que va a tener

- Un **encabezado** con tu nombre, tu titulo profesional y tus datos de contacto.
- Un **cuerpo** con secciones: Perfil, Experiencia, Educacion y Habilidades.
- Una **tabla** de habilidades y una **foto**.
- Todo con **etiquetas semanticas**, buena **accesibilidad** y que **pase el validador**.`,
      codeExample: {
        html: `<!-- Asi de plano se ve un CV en HTML puro. En CSS le damos vida. -->
<header>
  <h1>Ana Martinez</h1>
  <p>Desarrolladora Frontend Junior</p>
</header>
<main>
  <section>
    <h2>Perfil</h2>
    <p>Aprendiendo desarrollo web desde cero, con foco en HTML y CSS.</p>
  </section>
</main>`,
        css: ``,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html16-leccion-02",
      title: "El plan: estructura semantica",
      content: `## El plan: estructura semantica

Antes de escribir, pensemos la **estructura** con etiquetas semanticas (landmarks). Un CV encaja asi:

\`\`\`
<header>   -> nombre + titulo + contacto
<main>     -> el contenido principal
   <section> Perfil
   <section> Experiencia
   <section> Educacion
   <section> Habilidades  (con una tabla)
<footer>   -> nota final / ano
\`\`\`

### Reglas que vamos a respetar

- **Un solo \`<h1>\`**: tu nombre. Las secciones usan \`<h2>\`, y dentro de cada trabajo un \`<h3>\`.
- **Landmarks**: \`<header>\`, \`<main>\`, \`<footer>\` — le dan significado a las zonas.
- **Listas** para lo que es lista (logros, estudios) y **tabla** para datos tabulares (habilidad / nivel).
- **Contacto** con enlaces reales: \`mailto:\` para el correo y \`tel:\` para el telefono.`,
      codeExample: {
        html: `<header>
  <h1>Ana Martinez</h1>
  <p>Desarrolladora Frontend Junior</p>
  <p>
    <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a> ·
    <a href="tel:+573001112233">+57 300 111 2233</a> ·
    <a href="https://github.com/ana" target="_blank" rel="noopener">GitHub</a>
  </p>
</header>`,
        css: ``,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html16-leccion-03",
      title: "Accesibilidad y validacion",
      content: `## Accesibilidad y validacion

Un buen documento HTML no solo "funciona": es **accesible** y **valido**.

### Accesibilidad (lo minimo)

- \`<html lang="es">\` para que los lectores de pantalla usen el idioma correcto.
- Jerarquia de encabezados **sin saltos**: \`h1\` -> \`h2\` -> \`h3\` (no pases de \`h1\` a \`h3\`).
- Toda imagen con \`alt\` **descriptivo** (tu foto: \`alt="Foto de Ana Martinez"\`).
- Enlaces con texto que se entienda solo (no "clic aqui").

### Validacion (el corrector ortografico del HTML)

El **validador del W3C** (validator.w3.org) revisa que tu HTML este bien escrito: etiquetas cerradas,
anidacion correcta, atributos validos. Pega tu codigo ahi y corrige lo que marque.

> **Meta del proyecto:** que tu CV pase el validador **sin errores** y respete la jerarquia de titulos.
> Eso es HTML de nivel profesional.`,
      codeExample: {
        html: `<img src="foto.jpg" alt="Foto de Ana Martinez" width="120" />
<!-- alt descriptivo, no "imagen1" ni vacio -->`,
        css: ``,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html16-ej-01",
      type: "live-editor",
      difficulty: 1,
      xpReward: 15,
      order: 1,
      prompt:
        "Paso 1 - El esqueleto. Escribe la estructura base del documento: DOCTYPE, <html> con lang=\"es\", <head> con <title> 'CV de Ana Martinez', y un <body> vacio.",
      codeTemplate: { html: `<!-- Escribe aqui el esqueleto -->`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "!doctype",
          "html[lang=\"es\"]",
          "head > title",
          "body",
        ],
      },
      hint: "Empieza con <!DOCTYPE html> y recuerda el atributo lang en la etiqueta <html>.",
      explanation:
        "Todo documento parte del esqueleto: DOCTYPE, html (con lang), head (con title) y body.",
    },
    {
      id: "html16-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "Paso 2 - El encabezado. Dentro de un <header>, pon un <h1> con el nombre, un <p> con el titulo profesional, y el contacto: un enlace de correo con mailto: y uno de telefono con tel:.",
      codeTemplate: { html: `<header>\n  \n</header>`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "header > h1",
          "header > p",
          "header a[href^=\"mailto:\"]",
          "header a[href^=\"tel:\"]",
        ],
      },
      hint: "El correo va como <a href=\"mailto:tucorreo\">, el telefono como <a href=\"tel:+57...\">.",
      explanation:
        "El <header> agrupa la identidad: nombre (h1, uno solo), titulo, y contacto con enlaces mailto:/tel:.",
    },
    {
      id: "html16-ej-03",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Cada parte del CV va en su landmark. Arrastra cada contenido a la etiqueta semantica correcta:",
      dragItems: [
        { id: "d1", content: "Nombre, titulo y contacto", correctZone: "z1" },
        { id: "d2", content: "Perfil, Experiencia, Educacion y Habilidades", correctZone: "z2" },
        { id: "d3", content: "Aviso final / ano de actualizacion", correctZone: "z3" },
      ],
      dropZones: [
        { id: "z1", label: "<header>" },
        { id: "z2", label: "<main>" },
        { id: "z3", label: "<footer>" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3" } },
      hint: "header = identidad arriba, main = contenido principal, footer = cierre.",
      explanation:
        "Los landmarks dan significado: header (identidad), main (contenido principal) y footer (cierre).",
    },
    {
      id: "html16-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Paso 3 - Perfil. Dentro de un <main>, crea una <section> con un <h2> 'Perfil' y un <p> de presentacion.",
      codeTemplate: { html: `<main>\n  \n</main>`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "main > section > h2",
          "main > section > h2 :: Perfil",
          "main > section > p",
        ],
      },
      hint: "El contenido principal va en <main>; cada bloque tematico en su <section> con un <h2>.",
      explanation:
        "El <main> contiene el contenido principal; cada tema va en una <section> con su titulo <h2>.",
    },
    {
      id: "html16-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Paso 4 - Experiencia. Crea una <section> con <h2> 'Experiencia', un <h3> con el cargo y una lista <ul> con 2 logros.",
      codeTemplate: { html: `<section>\n  \n</section>`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "section > h2 :: Experiencia",
          "section h3",
          "section ul > li >> 2",
        ],
      },
      hint: "El cargo es un subtitulo (<h3>) dentro de la seccion; los logros van en <li> dentro de un <ul>.",
      explanation:
        "Cada experiencia usa un <h3> (subtitulo bajo el h2 de la seccion) y una lista <ul> de logros.",
    },
    {
      id: "html16-ej-06",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt:
        "Paso 5 - Habilidades en tabla. Crea una <table> con <thead> (columnas 'Habilidad' y 'Nivel' en <th>) y un <tbody> con al menos 2 filas (<tr> con <td>).",
      codeTemplate: { html: `<section>\n  <h2>Habilidades</h2>\n  \n</section>`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "table > thead th >> 2",
          "table > tbody > tr >> 2",
          "table > tbody > tr > td",
        ],
      },
      hint: "thead con los titulos de columna en <th>; tbody con filas <tr> y celdas <td>.",
      explanation:
        "Una tabla de habilidad/nivel es dato tabular: <thead> con <th> para los encabezados y <tbody> con <tr>/<td>.",
    },
    {
      id: "html16-ej-07",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt:
        "Paso 6 - Tu foto. Usa un <figure> con una <img> (con su atributo alt descriptivo) y un <figcaption>.",
      codeTemplate: { html: `<figure>\n  \n</figure>`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "figure > img[alt]",
          "figure > figcaption",
        ],
      },
      hint: "La <img> siempre con alt descriptivo (ej: alt=\"Foto de Ana Martinez\"); la leyenda en <figcaption>.",
      explanation:
        "<figure> agrupa la imagen y su leyenda <figcaption>. El alt describe la foto (nunca vacio ni 'imagen').",
    },
    {
      id: "html16-ej-08",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 8,
      prompt: "En tu CV pusiste el nombre en <h1> y luego los cargos en <h3>, saltandote el <h2>. ¿Por que esta mal?",
      options: [
        { id: "a", text: "Rompe la jerarquia de encabezados; debe ir h1 -> h2 -> h3 sin saltos (accesibilidad)", isCorrect: true },
        { id: "b", text: "No pasa nada, los numeros de h son solo tamano", isCorrect: false },
        { id: "c", text: "Porque solo se permite un <h3> por pagina", isCorrect: false },
        { id: "d", text: "Porque <h3> esta obsoleto en HTML5", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Los lectores de pantalla navegan por la jerarquia de titulos.",
      explanation:
        "La jerarquia de encabezados debe ser ordenada (h1->h2->h3) porque los lectores de pantalla la usan para navegar. Saltar niveles es un problema de accesibilidad, no de tamano.",
    },
    {
      id: "html16-ej-09",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 9,
      prompt:
        "Cierre integrador. Arma un CV MINIMO pero completo y valido: DOCTYPE + <html lang=\"es\"> + <head> con <title>; y en el <body> un <header> con <h1>, un <main> con al menos una <section> (con <h2>) y una <table>, una <img> con alt, y un <footer>.",
      codeTemplate: { html: `<!-- Tu CV completo aqui -->`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "!doctype",
          "html[lang=\"es\"]",
          "head > title",
          "body > header > h1",
          "body > main section > h2",
          "body > main table",
          "img[alt]",
          "body > footer",
        ],
      },
      hint: "Junta los pasos anteriores en un solo documento: esqueleto + header + main (con section y table) + img con alt + footer.",
      explanation:
        "Este es el CV base: estructura valida, landmarks semanticos, jerarquia de titulos, una tabla y una imagen accesible. Listo para vestir con CSS.",
    },
  ],
};
