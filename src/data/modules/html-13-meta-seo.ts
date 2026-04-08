import type { ModuleData } from "@/types";

export const htmlMetaSeoModule: ModuleData = {
  slug: "html-meta-seo",
  title: "Meta Tags y SEO",
  description:
    "Aprende a optimizar tus paginas para motores de busqueda y redes sociales con meta tags, Open Graph, Twitter Cards y datos estructurados.",
  order: 13,
  category: "html-advanced",
  icon: "search",
  dojo: "html",
  lessons: [
    {
      id: "html13-leccion-01",
      title: "Meta tags esenciales",
      content: `## Meta tags esenciales

Las **meta tags** son etiquetas dentro del \`<head>\` que proporcionan informacion sobre la pagina a los navegadores y motores de busqueda.

### Meta tags basicas

\`\`\`html
<!-- Codificacion de caracteres -->
<meta charset="UTF-8">

<!-- Responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Descripcion para buscadores -->
<meta name="description" content="Aprende HTML desde cero con ejercicios practicos">

<!-- Autor -->
<meta name="author" content="Dev Dojo">

<!-- Robots: controla la indexacion -->
<meta name="robots" content="index, follow">
\`\`\`

### La meta viewport

Es **obligatoria** para sitios responsive. Sin ella, los moviles mostraran la version de escritorio reducida.

### Meta description

Es el texto que aparece en los resultados de Google debajo del titulo. Debe tener entre **120-160 caracteres** y ser descriptivo.

### Meta robots

Controla como los motores de busqueda tratan tu pagina:

| Valor | Efecto |
|-------|--------|
| \`index, follow\` | Indexar pagina y seguir enlaces (por defecto) |
| \`noindex\` | No indexar la pagina |
| \`nofollow\` | No seguir los enlaces |
| \`noindex, nofollow\` | Ni indexar ni seguir |

> **Tip:** La meta \`keywords\` ya no es relevante para Google. Enfocate en \`description\` y contenido de calidad.`,
      codeExample: {
        html: `<!-- Ejemplo de <head> completo -->
<div style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:14px;white-space:pre;overflow-x:auto;">&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport"
    content="width=device-width, initial-scale=1.0"&gt;
  &lt;meta name="description"
    content="Aprende desarrollo web con ejercicios
    interactivos y proyectos practicos"&gt;
  &lt;meta name="author" content="Dev Dojo"&gt;
  &lt;meta name="robots" content="index, follow"&gt;
  &lt;title&gt;Dev Dojo - Aprende Desarrollo Web&lt;/title&gt;
  &lt;link rel="icon" href="/favicon.ico"&gt;
&lt;/head&gt;</div>

<br>

<div style="background:#f8f9fa;padding:16px;border-radius:8px;">
  <h3>Asi se veria en Google:</h3>
  <div style="max-width:600px;">
    <p style="color:#1a0dab;font-size:18px;margin:0;">Dev Dojo - Aprende Desarrollo Web</p>
    <p style="color:#006621;font-size:14px;margin:4px 0;">https://devdojo.com</p>
    <p style="color:#545454;font-size:14px;margin:0;">Aprende desarrollo web con ejercicios interactivos y proyectos practicos</p>
  </div>
</div>`,
        css: `body { font-family: sans-serif; padding: 16px; }`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html13-leccion-02",
      title: "Open Graph y Twitter Cards",
      content: `## Open Graph y Twitter Cards

Cuando compartes un enlace en redes sociales, las **meta tags de Open Graph** controlan como se ve la vista previa.

### Open Graph (Facebook, LinkedIn, WhatsApp)

\`\`\`html
<meta property="og:title" content="Dev Dojo - Aprende Web">
<meta property="og:description" content="Cursos interactivos de HTML, CSS y JS">
<meta property="og:image" content="https://devdojo.com/preview.jpg">
<meta property="og:url" content="https://devdojo.com">
<meta property="og:type" content="website">
\`\`\`

### Twitter Cards

\`\`\`html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Dev Dojo">
<meta name="twitter:description" content="Aprende desarrollo web">
<meta name="twitter:image" content="https://devdojo.com/preview.jpg">
\`\`\`

### Tipos de Twitter Card

| Tipo | Descripcion |
|------|-------------|
| \`summary\` | Tarjeta pequena con imagen cuadrada |
| \`summary_large_image\` | Tarjeta con imagen grande horizontal |

### Favicon y canonical

\`\`\`html
<!-- Favicon (icono de pestana) -->
<link rel="icon" type="image/png" href="/favicon.png">

<!-- URL canonica (evita contenido duplicado) -->
<link rel="canonical" href="https://devdojo.com/cursos/html">
\`\`\`

> **Tip:** Usa herramientas como "Open Graph Debugger" de Facebook para verificar como se ven tus previews.`,
      codeExample: {
        html: `<div style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;white-space:pre;overflow-x:auto;margin-bottom:16px;">&lt;!-- Open Graph --&gt;
&lt;meta property="og:title" content="Dev Dojo"&gt;
&lt;meta property="og:description"
  content="Aprende desarrollo web"&gt;
&lt;meta property="og:image"
  content="https://devdojo.com/og.jpg"&gt;
&lt;meta property="og:url"
  content="https://devdojo.com"&gt;

&lt;!-- Twitter Card --&gt;
&lt;meta name="twitter:card"
  content="summary_large_image"&gt;
&lt;meta name="twitter:title" content="Dev Dojo"&gt;</div>

<h3>Asi se veria al compartir en redes sociales:</h3>
<div style="max-width:500px;border:1px solid #ddd;border-radius:12px;overflow:hidden;">
  <div style="background:#6c5ce7;color:white;padding:60px;text-align:center;font-size:24px;">
    og:image
  </div>
  <div style="padding:12px;">
    <p style="color:#1877f2;font-size:12px;margin:0;">devdojo.com</p>
    <p style="font-weight:bold;font-size:16px;margin:4px 0;">Dev Dojo - Aprende Desarrollo Web</p>
    <p style="color:#65676b;font-size:14px;margin:0;">Aprende desarrollo web con ejercicios interactivos y proyectos practicos.</p>
  </div>
</div>`,
        css: `body { font-family: sans-serif; padding: 16px; }`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html13-leccion-03",
      title: "Datos estructurados y SEO avanzado",
      content: `## Datos estructurados y SEO avanzado

### Datos estructurados (Schema.org)

Los **datos estructurados** ayudan a Google a entender mejor tu contenido y mostrar resultados enriquecidos (rich snippets).

Se escriben en formato **JSON-LD** dentro de una etiqueta script:

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Guia de HTML Semantico",
  "author": {
    "@type": "Person",
    "name": "Dev Dojo"
  },
  "datePublished": "2026-03-27"
}
</script>
\`\`\`

### Resultados enriquecidos comunes

- **Recetas:** con tiempo de preparacion, ingredientes
- **Resenas:** estrellas de calificacion
- **FAQ:** preguntas y respuestas desplegables
- **Breadcrumbs:** ruta de navegacion

### Otras meta tags utiles

\`\`\`html
<!-- Preconectar a un dominio externo -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Prefetch de una pagina que el usuario probablemente visite -->
<link rel="prefetch" href="/siguiente-pagina.html">

<!-- Theme color (barra del navegador en moviles) -->
<meta name="theme-color" content="#6c5ce7">
\`\`\`

### Checklist de SEO basico

- [ ] Titulo unico y descriptivo (50-60 caracteres)
- [ ] Meta description (120-160 caracteres)
- [ ] Meta viewport para responsive
- [ ] Open Graph tags para redes sociales
- [ ] URL canonica
- [ ] Datos estructurados si aplica
- [ ] Favicon configurado`,
      codeExample: {
        html: `<div style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;white-space:pre;overflow-x:auto;margin-bottom:16px;">&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "HTML Avanzado",
  "description": "Aprende HTML avanzado",
  "provider": {
    "@type": "Organization",
    "name": "Dev Dojo"
  }
}
&lt;/script&gt;</div>

<h3>Resultado enriquecido en Google:</h3>
<div style="background:#f8f9fa;padding:16px;border-radius:8px;max-width:600px;">
  <p style="color:#1a0dab;font-size:18px;margin:0;">HTML Avanzado - Dev Dojo</p>
  <p style="color:#006621;font-size:14px;margin:4px 0;">
    https://devdojo.com &rsaquo; cursos &rsaquo; html
  </p>
  <div style="color:#70757a;font-size:14px;margin:4px 0;">
    ⭐⭐⭐⭐⭐ Calificacion: 4.8 - 1,234 resenas
  </div>
  <p style="color:#545454;font-size:14px;margin:0;">
    Aprende HTML avanzado con ejercicios interactivos. Curso en espanol con certificado.
  </p>
</div>

<br>
<h3>Breadcrumbs enriquecidos:</h3>
<div style="background:#f8f9fa;padding:12px;border-radius:8px;">
  <span style="color:#006621;font-size:14px;">
    Dev Dojo &rsaquo; Cursos &rsaquo; HTML &rsaquo; <strong>HTML Avanzado</strong>
  </span>
</div>`,
        css: `body { font-family: sans-serif; padding: 16px; }`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html13-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que meta tag es esencial para que un sitio se vea correctamente en moviles?",
      options: [
        { id: "a", text: '<meta name="mobile">',  isCorrect: false },
        { id: "b", text: '<meta name="viewport">',  isCorrect: true },
        { id: "c", text: '<meta name="responsive">',  isCorrect: false },
        { id: "d", text: '<meta name="screen">',  isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Tiene que ver con la 'ventana de vision' del dispositivo.",
      explanation:
        "La meta viewport con content='width=device-width, initial-scale=1.0' es esencial para el diseno responsive. Sin ella, los moviles muestran la version de escritorio reducida.",
    },
    {
      id: "html13-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que meta tag controla el texto que aparece en los resultados de Google?",
      options: [
        { id: "a", text: '<meta name="title">',  isCorrect: false },
        { id: "b", text: '<meta name="google-text">',  isCorrect: false },
        { id: "c", text: '<meta name="description">',  isCorrect: true },
        { id: "d", text: '<meta name="summary">',  isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una 'descripcion' de la pagina para los buscadores.",
      explanation:
        "La meta description aparece como el fragmento de texto bajo el titulo en los resultados de busqueda. Debe tener entre 120-160 caracteres.",
    },
    {
      id: "html13-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa la meta tag para definir el titulo que se muestra al compartir en Facebook:",
      codeTemplate: {
        html: "",
        cssPrefix: '<meta property="',
        cssSuffix: '" content="Mi Sitio Web">',
        blanks: ["og:title"],
      },
      validation: { type: "exact", answer: "og:title" },
      hint: "Open Graph usa el prefijo 'og:' seguido del nombre de la propiedad.",
      explanation:
        'og:title es la meta tag de Open Graph que define el titulo que aparece cuando se comparte un enlace en redes sociales como Facebook, WhatsApp o LinkedIn.',
    },
    {
      id: "html13-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que valor de meta robots evita que Google indexe una pagina?",
      options: [
        { id: "a", text: 'content="noindex"',  isCorrect: true },
        { id: "b", text: 'content="hidden"',  isCorrect: false },
        { id: "c", text: 'content="private"',  isCorrect: false },
        { id: "d", text: 'content="nofollow"',  isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Es lo opuesto a 'index'.",
      explanation:
        'noindex indica a los motores de busqueda que no indexen la pagina. nofollow solo evita que sigan los enlaces, pero no impide la indexacion.',
    },
    {
      id: "html13-ej-05",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada meta tag segun su proposito:",
      dragItems: [
        { id: "drag-1", content: "og:title", correctZone: "zone-social" },
        { id: "drag-2", content: "meta description", correctZone: "zone-seo" },
        { id: "drag-3", content: "twitter:card", correctZone: "zone-social" },
        { id: "drag-4", content: "meta robots", correctZone: "zone-seo" },
        { id: "drag-5", content: "og:image", correctZone: "zone-social" },
      ],
      dropZones: [
        { id: "zone-seo", label: "SEO / Buscadores" },
        { id: "zone-social", label: "Redes sociales" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-social",
          "drag-2": "zone-seo",
          "drag-3": "zone-social",
          "drag-4": "zone-seo",
          "drag-5": "zone-social",
        },
      },
      hint: "Las tags con 'og:' y 'twitter:' son para redes sociales.",
      explanation:
        "Open Graph (og:) y Twitter Cards son para controlar como se ven los enlaces en redes sociales. Meta description y robots son para motores de busqueda.",
    },
    {
      id: "html13-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Para que sirve la etiqueta <link rel='canonical'>?",
      options: [
        { id: "a", text: "Para definir el estilo principal de la pagina", isCorrect: false },
        { id: "b", text: "Para indicar la URL preferida y evitar contenido duplicado", isCorrect: true },
        { id: "c", text: "Para enlazar el favicon del sitio", isCorrect: false },
        { id: "d", text: "Para cargar fuentes externas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Resuelve el problema de cuando una misma pagina puede accederse desde varias URLs.",
      explanation:
        "La etiqueta canonical indica a los motores de busqueda cual es la URL 'oficial' de una pagina, evitando penalizaciones por contenido duplicado.",
    },
    {
      id: "html13-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Que formato se usa para escribir datos estructurados (Schema.org) recomendado por Google?",
      options: [
        { id: "a", text: "XML", isCorrect: false },
        { id: "b", text: "JSON-LD", isCorrect: true },
        { id: "c", text: "CSV", isCorrect: false },
        { id: "d", text: "YAML", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un formato basado en JavaScript Object Notation.",
      explanation:
        'JSON-LD (JavaScript Object Notation for Linked Data) es el formato recomendado por Google para datos estructurados. Se coloca dentro de <script type="application/ld+json">.',
    },
  ],
};
