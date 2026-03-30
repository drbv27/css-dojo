import type { ModuleData } from "@/types";

export const htmlEnlacesModule: ModuleData = {
  slug: "html-04-enlaces",
  title: "Enlaces en HTML",
  description:
    "Aprende a crear enlaces con la etiqueta <a>: enlaces externos, internos, de correo, telefono y las diferencias entre URLs absolutas y relativas.",
  order: 4,
  dojo: "html",
  category: "html-fundamentals",
  icon: "link",
  lessons: [
    {
      id: "html-04-leccion-01",
      title: "La etiqueta <a> y el atributo href",
      content: `## La etiqueta <a> y el atributo href

La etiqueta \`<a>\` (anchor, o ancla) crea **hipervinculos** que permiten navegar entre paginas, secciones o recursos. Es uno de los elementos fundamentales de la web.

### Estructura basica

\`\`\`html
<a href="https://ejemplo.com">Texto del enlace</a>
\`\`\`

- **\`href\`** (Hypertext Reference): especifica la URL de destino
- El texto entre las etiquetas es lo que el usuario ve y puede hacer clic

### El atributo target

El atributo \`target\` controla **donde se abre** el enlace:

- \`target="_self"\` — En la misma pestana (comportamiento por defecto)
- \`target="_blank"\` — En una **nueva pestana**

\`\`\`html
<a href="https://ejemplo.com" target="_blank">Abrir en nueva pestana</a>
\`\`\`

### Seguridad con rel="noopener"

Cuando usas \`target="_blank"\`, es importante agregar \`rel="noopener noreferrer"\` por seguridad:

\`\`\`html
<a href="https://ejemplo.com" target="_blank" rel="noopener noreferrer">
  Enlace seguro
</a>
\`\`\`

Esto evita que la pagina de destino tenga acceso a la ventana que la abrio.

> **Buena practica:** Siempre agrega \`rel="noopener noreferrer"\` cuando uses \`target="_blank"\`.`,
      codeExample: {
        html: `<h2>Tipos de enlaces</h2>\n<p><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs (nueva pestana)</a></p>\n<p><a href="https://ejemplo.com">Enlace normal (misma pestana)</a></p>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n}\n\na {\n  color: #3182ce;\n  text-decoration: none;\n  font-family: sans-serif;\n}\n\na:hover {\n  text-decoration: underline;\n  color: #2c5282;\n}\n\np {\n  margin: 8px 0;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-04-leccion-02",
      title: "Enlaces internos, mailto y tel",
      content: `## Enlaces internos, mailto y tel

### Enlaces internos (anclas)

Puedes crear enlaces que naveguen a **secciones dentro de la misma pagina** usando el atributo \`id\`:

\`\`\`html
<!-- Enlace que apunta a una seccion -->
<a href="#contacto">Ir a contacto</a>

<!-- Seccion de destino -->
<section id="contacto">
  <h2>Contacto</h2>
</section>
\`\`\`

El \`#\` seguido del id del elemento indica que es un enlace interno.

### Enlaces de correo electronico

Usa el esquema \`mailto:\` para abrir el cliente de correo del usuario:

\`\`\`html
<a href="mailto:info@ejemplo.com">Envianos un correo</a>
\`\`\`

Puedes incluir asunto y cuerpo:

\`\`\`html
<a href="mailto:info@ejemplo.com?subject=Hola&body=Quiero%20informacion">
  Correo con asunto
</a>
\`\`\`

### Enlaces de telefono

Usa el esquema \`tel:\` para iniciar una llamada (especialmente util en moviles):

\`\`\`html
<a href="tel:+34612345678">Llamanos: +34 612 345 678</a>
\`\`\`

> **Consejo:** Los enlaces \`mailto:\` y \`tel:\` mejoran mucho la experiencia del usuario en dispositivos moviles.`,
      codeExample: {
        html: `<nav>\n  <a href="#inicio">Inicio</a> |\n  <a href="#servicios">Servicios</a> |\n  <a href="#contacto">Contacto</a>\n</nav>\n\n<section id="inicio">\n  <h2>Bienvenido</h2>\n  <p>Esta es la seccion de inicio.</p>\n</section>\n\n<section id="servicios">\n  <h2>Servicios</h2>\n  <p>Nuestros servicios principales.</p>\n</section>\n\n<section id="contacto">\n  <h2>Contacto</h2>\n  <p><a href="mailto:info@ejemplo.com">info@ejemplo.com</a></p>\n  <p><a href="tel:+34612345678">+34 612 345 678</a></p>\n</section>`,
        css: `nav {\n  background-color: #edf2f7;\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n  font-family: sans-serif;\n}\n\nnav a {\n  color: #3182ce;\n  text-decoration: none;\n  margin: 0 4px;\n}\n\nsection {\n  margin: 16px 0;\n  padding: 12px;\n  border-left: 3px solid #4299e1;\n}\n\nh2 {\n  font-family: sans-serif;\n  color: #2d3748;\n  margin-top: 0;\n}\n\np, a {\n  font-family: sans-serif;\n  color: #4a5568;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-04-leccion-03",
      title: "URLs absolutas vs relativas",
      content: `## URLs absolutas vs relativas

### URLs absolutas

Una URL absoluta incluye el **protocolo y dominio completo**. Se usa para enlazar a sitios externos:

\`\`\`html
<a href="https://www.google.com">Google</a>
<a href="https://ejemplo.com/pagina/contacto">Contacto</a>
\`\`\`

### URLs relativas

Una URL relativa se basa en la **ubicacion del archivo actual**. Se usa para enlazar paginas dentro del mismo sitio:

\`\`\`html
<!-- Misma carpeta -->
<a href="contacto.html">Contacto</a>

<!-- Subcarpeta -->
<a href="blog/articulo.html">Articulo</a>

<!-- Carpeta superior -->
<a href="../index.html">Volver al inicio</a>
\`\`\`

### Comparacion

| Tipo | Ejemplo | Uso |
|------|---------|-----|
| Absoluta | \`https://ejemplo.com/pagina\` | Sitios externos |
| Relativa | \`pagina.html\` | Mismo sitio |
| Raiz | \`/pagina.html\` | Desde la raiz del sitio |

### Rutas especiales

- \`./\` — Carpeta actual
- \`../\` — Carpeta superior (padre)
- \`/\` — Raiz del sitio web

> **Buena practica:** Usa URLs relativas para enlaces dentro de tu propio sitio. Esto facilita mover el sitio a otro dominio sin romper enlaces.`,
      codeExample: {
        html: `<h2>Ejemplos de URLs</h2>\n\n<h3>URL absoluta:</h3>\n<p><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN (absoluta)</a></p>\n\n<h3>URL relativa:</h3>\n<p><a href="contacto.html">Contacto (relativa)</a></p>\n<p><a href="../index.html">Inicio (carpeta superior)</a></p>\n\n<h3>Enlace interno:</h3>\n<p><a href="#top">Volver arriba (ancla)</a></p>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n}\n\nh3 {\n  font-family: sans-serif;\n  color: #4a5568;\n  font-size: 14px;\n  margin-bottom: 4px;\n}\n\na {\n  color: #3182ce;\n  font-family: sans-serif;\n}\n\np {\n  margin: 4px 0;\n  font-family: sans-serif;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html-04-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que atributo de la etiqueta <a> especifica la URL de destino?",
      options: [
        { id: "a", text: "src", isCorrect: false },
        { id: "b", text: "link", isCorrect: false },
        { id: "c", text: "href", isCorrect: true },
        { id: "d", text: "url", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una abreviatura de 'Hypertext Reference'.",
      explanation:
        "El atributo href (Hypertext Reference) especifica la URL de destino del enlace.",
    },
    {
      id: "html-04-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa el enlace para que abra en una nueva pestana:",
      codeTemplate: {
        html: `<a href="https://ejemplo.com" _____="_blank" rel="noopener noreferrer">\n  Visitar ejemplo\n</a>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["target"],
      },
      validation: { type: "exact", answer: ["target"] },
      hint: "El atributo que controla donde se abre el enlace.",
      explanation:
        "El atributo target='_blank' hace que el enlace se abra en una nueva pestana del navegador.",
    },
    {
      id: "html-04-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Cual es la forma correcta de crear un enlace interno a una seccion con id='info'?",
      options: [
        { id: "a", text: "<a href='info'>Info</a>", isCorrect: false },
        { id: "b", text: "<a href='#info'>Info</a>", isCorrect: true },
        { id: "c", text: "<a href='@info'>Info</a>", isCorrect: false },
        { id: "d", text: "<a link='#info'>Info</a>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los enlaces internos usan un simbolo especial seguido del id.",
      explanation:
        "Para enlazar a una seccion dentro de la misma pagina, se usa # seguido del id del elemento destino: href='#info'.",
    },
    {
      id: "html-04-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Arrastra cada tipo de enlace a su esquema URL correcto:",
      dragItems: [
        { id: "d1", content: "Pagina web externa", correctZone: "z1" },
        { id: "d2", content: "Correo electronico", correctZone: "z2" },
        { id: "d3", content: "Numero de telefono", correctZone: "z3" },
        { id: "d4", content: "Seccion en la misma pagina", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "https://..." },
        { id: "z2", label: "mailto:..." },
        { id: "z3", label: "tel:..." },
        { id: "z4", label: "#..." },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" },
      },
      hint: "Cada tipo de enlace tiene su propio esquema de URL.",
      explanation:
        "Los enlaces web usan https://, los de correo mailto:, los de telefono tel:, y los internos #id.",
    },
    {
      id: "html-04-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea una lista de navegacion con 3 enlaces internos: 'Inicio' que apunte a #inicio, 'Servicios' que apunte a #servicios, y 'Contacto' que apunte a #contacto. Luego crea un enlace de correo a info@devdojo.com.",
      codeTemplate: {
        html: `<!-- Crea la navegacion y el enlace de correo -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<a", "href", "#inicio", "#servicios", "#contacto", "mailto:"],
      },
      hint: "Usa etiquetas <a> con href que empiecen con # para enlaces internos y mailto: para correo.",
      explanation:
        "Los enlaces internos usan #id en el href, y los enlaces de correo usan el esquema mailto: seguido de la direccion.",
    },
    {
      id: "html-04-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Completa el enlace de correo electronico:",
      codeTemplate: {
        html: `<a href="_____:contacto@miempresa.com">Escribenos</a>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["mailto"],
      },
      validation: { type: "exact", answer: ["mailto"] },
      hint: "Es un esquema de URL que abre el cliente de correo.",
      explanation:
        "El esquema mailto: en el href abre el cliente de correo electronico del usuario con la direccion predefinida.",
    },
    {
      id: "html-04-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt: "Por que es importante agregar rel='noopener noreferrer' cuando usas target='_blank'?",
      options: [
        { id: "a", text: "Para que el enlace cargue mas rapido", isCorrect: false },
        { id: "b", text: "Para mejorar el SEO de la pagina", isCorrect: false },
        { id: "c", text: "Por seguridad, evita que la pagina destino acceda a la ventana de origen", isCorrect: true },
        { id: "d", text: "Para que el enlace se abra en una ventana emergente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Tiene que ver con proteger tu pagina de posibles accesos no autorizados.",
      explanation:
        "Sin rel='noopener noreferrer', la pagina que se abre en nueva pestana podria acceder al objeto window.opener de tu pagina, lo cual es un riesgo de seguridad.",
    },
  ],
};
