import type { ModuleData } from "@/types";

export const htmlSemanticaModule: ModuleData = {
  slug: "html-semantica",
  title: "HTML Semantico",
  description:
    "Aprende a usar etiquetas semanticas como header, nav, main, article, section y mas para crear paginas web mejor estructuradas, accesibles y optimizadas para SEO.",
  order: 10,
  category: "html-intermediate",
  icon: "bookmark",
  dojo: "html",
  lessons: [
    {
      id: "html10-leccion-01",
      title: "Que es HTML semantico?",
      content: `## Que es HTML semantico?

**HTML semantico** significa usar etiquetas que describen el **significado** del contenido, no solo su apariencia.

### Div soup vs HTML semantico

**Mal (div soup):**
\`\`\`html
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">...</div>
<div class="footer">...</div>
\`\`\`

**Bien (semantico):**
\`\`\`html
<header>
  <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
\`\`\`

### Por que importa?

1. **SEO:** Los motores de busqueda entienden mejor tu contenido
2. **Accesibilidad:** Los lectores de pantalla navegan por secciones semanticas
3. **Legibilidad:** El codigo es mas facil de leer y mantener
4. **Estandares:** Es la forma correcta de escribir HTML moderno

> **Regla de oro:** Si una etiqueta semantica describe tu contenido, usala en lugar de un \`<div>\`.`,
      codeExample: {
        html: `<!-- Estructura semantica basica -->
<header style="background:#6c5ce7;color:white;padding:16px;">
  <h1>Mi Sitio Web</h1>
  <nav>
    <a href="#" style="color:#dfe6e9;margin-right:12px;">Inicio</a>
    <a href="#" style="color:#dfe6e9;margin-right:12px;">Blog</a>
    <a href="#" style="color:#dfe6e9;">Contacto</a>
  </nav>
</header>

<main style="padding:16px;">
  <h2>Contenido principal</h2>
  <p>Este es el contenido principal de la pagina.</p>
</main>

<footer style="background:#2d3436;color:white;padding:16px;text-align:center;">
  <p>&copy; 2026 Mi Sitio Web</p>
</footer>`,
        css: `body {
  font-family: sans-serif;
  margin: 0;
}
a { text-decoration: none; }`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html10-leccion-02",
      title: "Etiquetas de estructura",
      content: `## Etiquetas de estructura

### header

Representa la cabecera de la pagina o de una seccion. Suele contener el logo, titulo y navegacion.

### nav

Contiene los enlaces de navegacion principales del sitio.

### main

El contenido principal de la pagina. **Solo debe haber un \`<main>\` por pagina.**

### section

Agrupa contenido tematico relacionado. Generalmente tiene un encabezado.

### article

Contenido independiente que tiene sentido por si solo (un post de blog, una noticia, un comentario).

### aside

Contenido complementario o lateral (barras laterales, publicidad, enlaces relacionados).

### footer

Pie de pagina del sitio o de una seccion. Contiene informacion de contacto, copyright, enlaces legales.

### Estructura tipica

\`\`\`html
<header>...</header>
<nav>...</nav>
<main>
  <section>
    <article>...</article>
    <article>...</article>
  </section>
  <aside>...</aside>
</main>
<footer>...</footer>
\`\`\``,
      codeExample: {
        html: `<header style="background:#0984e3;color:white;padding:12px 16px;">
  <h1 style="margin:0;font-size:20px;">Blog de Tecnologia</h1>
</header>

<div style="display:flex;gap:16px;padding:16px;">
  <main style="flex:3;">
    <section>
      <h2>Articulos recientes</h2>
      <article style="background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:12px;">
        <h3>Que es HTML semantico?</h3>
        <p>Una guia para principiantes sobre etiquetas con significado.</p>
        <time datetime="2026-03-15">15 de marzo, 2026</time>
      </article>
      <article style="background:#f8f9fa;padding:12px;border-radius:8px;">
        <h3>CSS Grid vs Flexbox</h3>
        <p>Cuando usar cada uno en tus proyectos.</p>
        <time datetime="2026-03-10">10 de marzo, 2026</time>
      </article>
    </section>
  </main>

  <aside style="flex:1;background:#dfe6e9;padding:12px;border-radius:8px;">
    <h3>Categorias</h3>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </aside>
</div>

<footer style="background:#2d3436;color:white;padding:12px;text-align:center;">
  <p>Blog de Tecnologia &copy; 2026</p>
</footer>`,
        css: `body { font-family: sans-serif; margin: 0; }
h2, h3 { margin-top: 0; }
ul { padding-left: 20px; }`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html10-leccion-03",
      title: "figure, details y summary",
      content: `## figure, details y summary

### figure y figcaption

\`<figure>\` envuelve contenido visual (imagenes, diagramas, codigo) con su leyenda \`<figcaption>\`.

\`\`\`html
<figure>
  <img src="foto.jpg" alt="Descripcion">
  <figcaption>Leyenda de la imagen</figcaption>
</figure>
\`\`\`

### details y summary

Crean un **widget desplegable** nativo sin JavaScript. El contenido dentro de \`<details>\` se oculta hasta que el usuario hace clic en \`<summary>\`.

\`\`\`html
<details>
  <summary>Haz clic para ver mas</summary>
  <p>Contenido oculto que aparece al hacer clic.</p>
</details>
\`\`\`

El atributo \`open\` hace que el contenido aparezca desplegado por defecto.

### time

Representa una fecha u hora en formato legible por humanos y maquinas:

\`\`\`html
<time datetime="2026-03-27">27 de marzo de 2026</time>
\`\`\`

### address

Informacion de contacto del autor o propietario del contenido:

\`\`\`html
<address>
  Contacto: <a href="mailto:info@ejemplo.com">info@ejemplo.com</a>
</address>
\`\`\``,
      codeExample: {
        html: `<figure style="margin:0;background:#f8f9fa;padding:12px;border-radius:8px;">
  <div style="background:#6c5ce7;color:white;padding:40px;text-align:center;border-radius:4px;">
    Imagen de ejemplo
  </div>
  <figcaption style="text-align:center;color:#636e72;margin-top:8px;">
    Fig 1: Ejemplo de figure con figcaption
  </figcaption>
</figure>

<br>

<details>
  <summary style="cursor:pointer;font-weight:bold;color:#0984e3;">
    Que es HTML semantico? (clic para expandir)
  </summary>
  <p style="padding:12px;background:#dfe6e9;border-radius:0 0 8px 8px;">
    HTML semantico usa etiquetas que describen el significado del contenido
    en lugar de solo su apariencia visual.
  </p>
</details>

<br>

<details open>
  <summary style="cursor:pointer;font-weight:bold;color:#00b894;">
    Este esta abierto por defecto
  </summary>
  <p style="padding:12px;background:#dfe6e9;border-radius:0 0 8px 8px;">
    Gracias al atributo <code>open</code> en el elemento details.
  </p>
</details>

<br>

<address style="font-style:italic;color:#636e72;">
  Escrito por Dev Dojo | Publicado el <time datetime="2026-03-27">27 de marzo, 2026</time>
</address>`,
        css: `body { font-family: sans-serif; padding: 16px; }`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "html10-leccion-04",
      title: "Buenas practicas de HTML semantico",
      content: `## Buenas practicas de HTML semantico

### 1. No abuses de div y span

Usa \`<div>\` solo cuando **ninguna etiqueta semantica** sea apropiada. Piensa siempre: "Existe una etiqueta que describa mejor este contenido?"

### 2. Un solo main por pagina

Solo debe existir **un elemento \`<main>\`** que contenga el contenido principal.

### 3. Los encabezados importan

Respeta la **jerarquia de encabezados**: no saltes de \`<h1>\` a \`<h4>\`. Cada seccion deberia tener su encabezado.

\`\`\`html
<!-- Correcto -->
<h1>Titulo principal</h1>
  <h2>Subtitulo</h2>
    <h3>Sub-subtitulo</h3>

<!-- Incorrecto -->
<h1>Titulo</h1>
  <h4>Salte niveles!</h4>
\`\`\`

### 4. article vs section

- **article:** Contenido que tiene sentido **independiente** (se podria publicar solo)
- **section:** Agrupa contenido **tematicamente relacionado** dentro de una pagina

### 5. nav para navegacion principal

No uses \`<nav>\` para cada grupo de enlaces. Reservalo para la **navegacion principal** del sitio.

### Checklist de semantica

- [ ] Usas header, main y footer?
- [ ] Tus articulos son independientes?
- [ ] Los encabezados siguen jerarquia?
- [ ] Usas figure para imagenes con leyenda?
- [ ] Evitas div donde hay alternativa semantica?`,
      codeExample: {
        html: `<!-- Pagina bien estructurada -->
<header>
  <h1>Dev Dojo</h1>
  <nav>
    <a href="#">Cursos</a> |
    <a href="#">Blog</a> |
    <a href="#">Contacto</a>
  </nav>
</header>

<main>
  <section>
    <h2>Cursos populares</h2>

    <article>
      <h3>HTML Semantico</h3>
      <p>Aprende a estructurar tus paginas correctamente.</p>
      <time datetime="2026-01">Enero 2026</time>
    </article>

    <article>
      <h3>CSS Grid</h3>
      <p>Domina el sistema de cuadricula de CSS.</p>
      <time datetime="2026-02">Febrero 2026</time>
    </article>
  </section>

  <aside>
    <h2>Recursos</h2>
    <ul>
      <li><a href="#">Documentacion MDN</a></li>
      <li><a href="#">W3C Validator</a></li>
    </ul>
  </aside>
</main>

<footer>
  <address>
    Contacto: <a href="mailto:hola@devdojo.com">hola@devdojo.com</a>
  </address>
  <p>&copy; 2026 Dev Dojo</p>
</footer>`,
        css: `body { font-family: sans-serif; margin: 0; }
header { background: #6c5ce7; color: white; padding: 16px; }
header a { color: #dfe6e9; text-decoration: none; }
main { padding: 16px; }
aside { background: #f8f9fa; padding: 12px; border-radius: 8px; margin-top: 16px; }
footer { background: #2d3436; color: white; padding: 16px; text-align: center; }
footer a { color: #74b9ff; }
article { background: #f0f0f0; padding: 12px; border-radius: 8px; margin-bottom: 12px; }`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "html10-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que etiqueta semantica representa el contenido principal de una pagina?",
      options: [
        { id: "a", text: "<content>", isCorrect: false },
        { id: "b", text: "<main>", isCorrect: true },
        { id: "c", text: "<section>", isCorrect: false },
        { id: "d", text: "<body>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Solo debe haber uno por pagina.",
      explanation:
        "<main> representa el contenido principal de la pagina. Solo debe existir un <main> por documento y no debe estar dentro de header, footer o nav.",
    },
    {
      id: "html10-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que etiqueta se usa para la navegacion principal de un sitio?",
      options: [
        { id: "a", text: "<menu>", isCorrect: false },
        { id: "b", text: "<links>", isCorrect: false },
        { id: "c", text: "<navigation>", isCorrect: false },
        { id: "d", text: "<nav>", isCorrect: true },
      ],
      validation: { type: "exact", answer: "d" },
      hint: "Es una abreviatura de 'navigation'.",
      explanation:
        "<nav> se usa para envolver la navegacion principal del sitio. Los lectores de pantalla la identifican automaticamente como zona de navegacion.",
    },
    {
      id: "html10-ej-03",
      type: "drag-drop",
      difficulty: 1,
      xpReward: 20,
      order: 3,
      prompt: "Clasifica cada etiqueta como semantica o no semantica:",
      dragItems: [
        { id: "drag-1", content: "<header>", correctZone: "zone-semantica" },
        { id: "drag-2", content: "<div>", correctZone: "zone-no-semantica" },
        { id: "drag-3", content: "<article>", correctZone: "zone-semantica" },
        { id: "drag-4", content: "<span>", correctZone: "zone-no-semantica" },
        { id: "drag-5", content: "<footer>", correctZone: "zone-semantica" },
      ],
      dropZones: [
        { id: "zone-semantica", label: "Semantica" },
        { id: "zone-no-semantica", label: "No semantica" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-semantica",
          "drag-2": "zone-no-semantica",
          "drag-3": "zone-semantica",
          "drag-4": "zone-no-semantica",
          "drag-5": "zone-semantica",
        },
      },
      hint: "Las etiquetas semanticas describen el significado del contenido.",
      explanation:
        "header, article y footer son semanticas porque describen el tipo de contenido. div y span son contenedores genericos sin significado semantico.",
    },
    {
      id: "html10-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 4,
      prompt: "Completa la etiqueta para crear un widget desplegable nativo en HTML:",
      codeTemplate: {
        html: "",
        cssPrefix: "<",
        cssSuffix: ">\n  <summary>Haz clic aqui</summary>\n  <p>Contenido oculto</p>\n</details>",
        blanks: ["details"],
      },
      validation: { type: "exact", answer: "details" },
      hint: "Es un elemento que muestra/oculta contenido al hacer clic.",
      explanation:
        "El elemento <details> crea un widget desplegable nativo. <summary> define el texto visible y el resto del contenido se oculta hasta hacer clic.",
    },
    {
      id: "html10-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Cual es la diferencia principal entre <article> y <section>?",
      options: [
        { id: "a", text: "No hay diferencia, son intercambiables", isCorrect: false },
        { id: "b", text: "article es para contenido independiente; section agrupa contenido tematico", isCorrect: true },
        { id: "c", text: "section va dentro de article, nunca al reves", isCorrect: false },
        { id: "d", text: "article es solo para blogs y section para todo lo demas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa si el contenido tendria sentido publicado por separado.",
      explanation:
        "Un <article> contiene contenido que tiene sentido por si solo (un post, una noticia). <section> agrupa contenido relacionado tematicamente dentro de la pagina.",
    },
    {
      id: "html10-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que elemento se usa para asociar una leyenda o descripcion a una imagen?",
      options: [
        { id: "a", text: "<caption>", isCorrect: false },
        { id: "b", text: "<legend>", isCorrect: false },
        { id: "c", text: "<figcaption> dentro de <figure>", isCorrect: true },
        { id: "d", text: "<label>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es un elemento hijo de <figure>.",
      explanation:
        "<figcaption> se coloca dentro de <figure> para dar una leyenda o descripcion. <caption> es para tablas y <legend> para fieldsets.",
    },
    {
      id: "html10-ej-07",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt: "Organiza las etiquetas segun donde van en la estructura tipica de una pagina:",
      dragItems: [
        { id: "drag-1", content: "<header>", correctZone: "zone-arriba" },
        { id: "drag-2", content: "<main>", correctZone: "zone-centro" },
        { id: "drag-3", content: "<footer>", correctZone: "zone-abajo" },
        { id: "drag-4", content: "<nav>", correctZone: "zone-arriba" },
      ],
      dropZones: [
        { id: "zone-arriba", label: "Parte superior" },
        { id: "zone-centro", label: "Contenido central" },
        { id: "zone-abajo", label: "Parte inferior" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-arriba",
          "drag-2": "zone-centro",
          "drag-3": "zone-abajo",
          "drag-4": "zone-arriba",
        },
      },
      hint: "Piensa en la posicion tipica de cada elemento en un sitio web.",
      explanation:
        "header y nav suelen ir arriba, main contiene el contenido central, y footer va al final de la pagina.",
    },
    {
      id: "html10-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "Cuantos elementos <main> deberia tener una pagina HTML bien estructurada?",
      options: [
        { id: "a", text: "Los que sean necesarios", isCorrect: false },
        { id: "b", text: "Exactamente uno", isCorrect: true },
        { id: "c", text: "Uno por cada seccion", isCorrect: false },
        { id: "d", text: "Ninguno, es opcional", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el contenido PRINCIPAL, no pueden haber varios principales.",
      explanation:
        "Segun la especificacion HTML, solo debe existir un elemento <main> por pagina. Representa el contenido principal y unico del documento.",
    },
  ],
};
