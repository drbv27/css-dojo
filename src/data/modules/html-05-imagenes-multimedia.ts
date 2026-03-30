import type { ModuleData } from "@/types";

export const htmlImagenesModule: ModuleData = {
  slug: "html-05-imagenes-multimedia",
  title: "Imagenes y multimedia",
  description:
    "Aprende a insertar imagenes, video y audio en HTML. Domina los atributos esenciales, figure/figcaption y el elemento picture para imagenes responsivas.",
  order: 5,
  dojo: "html",
  category: "html-fundamentals",
  icon: "image",
  lessons: [
    {
      id: "html-05-leccion-01",
      title: "La etiqueta img",
      content: `## La etiqueta img

La etiqueta \`<img>\` inserta una **imagen** en la pagina. Es una etiqueta **auto-cerrada** (no tiene etiqueta de cierre).

### Atributos esenciales

#### \`src\` (source)
Especifica la **ruta o URL** de la imagen:

\`\`\`html
<img src="foto.jpg">
<img src="https://ejemplo.com/imagen.png">
\`\`\`

#### \`alt\` (texto alternativo)
Describe la imagen con texto. Es **obligatorio** por accesibilidad:

\`\`\`html
<img src="gato.jpg" alt="Un gato naranja durmiendo en un sofa">
\`\`\`

El atributo \`alt\` sirve para:
- **Lectores de pantalla**: describen la imagen a usuarios con discapacidad visual
- **SEO**: los buscadores leen el alt para entender la imagen
- **Respaldo**: si la imagen no carga, se muestra el texto alternativo

#### \`width\` y \`height\`
Definen las **dimensiones** de la imagen en pixeles. Ayudan al navegador a reservar espacio antes de que la imagen cargue:

\`\`\`html
<img src="foto.jpg" alt="Descripcion" width="400" height="300">
\`\`\`

> **Buena practica:** Siempre incluye el atributo \`alt\`. Si la imagen es decorativa, usa \`alt=""\` (alt vacio), pero nunca lo omitas.`,
      codeExample: {
        html: `<h2>Ejemplo de imagen</h2>\n<img src="https://picsum.photos/400/200" alt="Imagen de ejemplo aleatoria" width="400" height="200">\n<p>Esta imagen tiene src, alt, width y height definidos.</p>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n}\n\nimg {\n  border-radius: 8px;\n  display: block;\n  margin: 12px 0;\n}\n\np {\n  font-family: sans-serif;\n  color: #718096;\n  font-size: 14px;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-05-leccion-02",
      title: "figure, figcaption y picture",
      content: `## figure, figcaption y picture

### \`<figure>\` y \`<figcaption>\`

La etiqueta \`<figure>\` agrupa una imagen (u otro contenido) con su **descripcion o leyenda**. \`<figcaption>\` proporciona el texto descriptivo.

\`\`\`html
<figure>
  <img src="grafico.png" alt="Ventas del trimestre">
  <figcaption>Figura 1: Ventas del primer trimestre 2026</figcaption>
</figure>
\`\`\`

### \`<picture>\` — Imagenes responsivas

La etiqueta \`<picture>\` permite definir **multiples fuentes** de imagen para diferentes situaciones:

\`\`\`html
<picture>
  <source media="(min-width: 800px)" srcset="grande.jpg">
  <source media="(min-width: 400px)" srcset="mediana.jpg">
  <img src="pequena.jpg" alt="Paisaje">
</picture>
\`\`\`

El navegador elige la primera \`<source>\` cuya condicion se cumpla. El \`<img>\` al final es el **respaldo** obligatorio.

### Usos de \`<picture>\`

- **Diferentes tamanos** segun el ancho de pantalla
- **Diferentes formatos** (WebP con respaldo a JPG):

\`\`\`html
<picture>
  <source type="image/webp" srcset="foto.webp">
  <source type="image/jpeg" srcset="foto.jpg">
  <img src="foto.jpg" alt="Foto de respaldo">
</picture>
\`\`\`

> **Tip:** Usa formatos modernos como WebP o AVIF con \`<picture>\` para mejorar el rendimiento, manteniendo JPG/PNG como respaldo.`,
      codeExample: {
        html: `<figure>\n  <img src="https://picsum.photos/400/250" alt="Paisaje aleatorio" width="400" height="250">\n  <figcaption>Figura 1: Un hermoso paisaje de ejemplo.</figcaption>\n</figure>\n\n<picture>\n  <source media="(min-width: 600px)" srcset="https://picsum.photos/400/200">\n  <img src="https://picsum.photos/200/100" alt="Imagen responsiva" width="200" height="100">\n</picture>`,
        css: `figure {\n  margin: 0;\n  padding: 12px;\n  background-color: #f7fafc;\n  border-radius: 8px;\n  display: inline-block;\n}\n\nfigure img {\n  border-radius: 6px;\n  display: block;\n}\n\nfigcaption {\n  font-family: sans-serif;\n  color: #718096;\n  font-size: 13px;\n  margin-top: 8px;\n  text-align: center;\n}\n\npicture img {\n  border-radius: 8px;\n  margin-top: 12px;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-05-leccion-03",
      title: "Video y audio en HTML",
      content: `## Video y audio en HTML

HTML5 permite insertar **video y audio** de forma nativa, sin necesidad de plugins externos.

### La etiqueta \`<video>\`

\`\`\`html
<video src="video.mp4" controls width="640" height="360">
  Tu navegador no soporta video HTML5.
</video>
\`\`\`

#### Atributos de video:

- **\`controls\`** — Muestra los controles de reproduccion (play, pausa, volumen)
- **\`autoplay\`** — Inicia la reproduccion automaticamente
- **\`muted\`** — Inicia sin sonido (necesario para que autoplay funcione en la mayoria de navegadores)
- **\`loop\`** — Repite el video al terminar
- **\`poster\`** — Imagen de portada antes de reproducir

\`\`\`html
<video controls autoplay muted loop poster="portada.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Tu navegador no soporta video.
</video>
\`\`\`

### La etiqueta \`<audio>\`

Funciona de manera similar a video:

\`\`\`html
<audio controls>
  <source src="cancion.mp3" type="audio/mpeg">
  <source src="cancion.ogg" type="audio/ogg">
  Tu navegador no soporta audio.
</audio>
\`\`\`

### Multiples fuentes

Usando \`<source>\` dentro de \`<video>\` o \`<audio>\`, puedes ofrecer **multiples formatos**. El navegador usara el primero que soporte.

> **Importante:** La mayoria de navegadores modernos bloquean el autoplay con sonido. Si necesitas autoplay, anade tambien el atributo \`muted\`.`,
      codeExample: {
        html: `<h2>Reproductor de video</h2>\n<video controls width="400" poster="https://picsum.photos/400/225">\n  <source src="video.mp4" type="video/mp4">\n  Tu navegador no soporta video HTML5.\n</video>\n\n<h2>Reproductor de audio</h2>\n<audio controls>\n  <source src="audio.mp3" type="audio/mpeg">\n  Tu navegador no soporta audio HTML5.\n</audio>`,
        css: `h2 {\n  font-family: sans-serif;\n  color: #2d3748;\n  margin-top: 16px;\n}\n\nvideo {\n  border-radius: 8px;\n  display: block;\n}\n\naudio {\n  width: 100%;\n  margin-top: 8px;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html-05-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que atributo de la etiqueta <img> es obligatorio por accesibilidad?",
      options: [
        { id: "a", text: "src", isCorrect: false },
        { id: "b", text: "title", isCorrect: false },
        { id: "c", text: "alt", isCorrect: true },
        { id: "d", text: "width", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Proporciona una descripcion textual de la imagen.",
      explanation:
        "El atributo alt proporciona texto alternativo que describe la imagen. Es esencial para lectores de pantalla y cuando la imagen no carga.",
    },
    {
      id: "html-05-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la etiqueta para insertar una imagen:",
      codeTemplate: {
        html: `<_____ src="logo.png" _____="Logo de la empresa" width="200" height="100">`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["img", "alt"],
      },
      validation: { type: "exact", answer: ["img", "alt"] },
      hint: "La etiqueta de imagen y el atributo de texto alternativo.",
      explanation:
        "La etiqueta <img> con el atributo alt crea una imagen accesible. Ambos son fundamentales en cualquier imagen.",
    },
    {
      id: "html-05-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Que etiqueta se usa para agregar una leyenda o descripcion a una imagen?",
      options: [
        { id: "a", text: "<caption>", isCorrect: false },
        { id: "b", text: "<figcaption>", isCorrect: true },
        { id: "c", text: "<legend>", isCorrect: false },
        { id: "d", text: "<label>", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Va dentro de un <figure> y combina las palabras 'figure' y 'caption'.",
      explanation:
        "La etiqueta <figcaption> se usa dentro de <figure> para proporcionar una leyenda descriptiva de la imagen o contenido.",
    },
    {
      id: "html-05-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Arrastra cada atributo de video a su funcion correcta:",
      dragItems: [
        { id: "d1", content: "controls", correctZone: "z1" },
        { id: "d2", content: "autoplay", correctZone: "z2" },
        { id: "d3", content: "muted", correctZone: "z3" },
        { id: "d4", content: "poster", correctZone: "z4" },
        { id: "d5", content: "loop", correctZone: "z5" },
      ],
      dropZones: [
        { id: "z1", label: "Muestra botones de reproduccion" },
        { id: "z2", label: "Inicia reproduccion automatica" },
        { id: "z3", label: "Sin sonido al iniciar" },
        { id: "z4", label: "Imagen de portada" },
        { id: "z5", label: "Repite al terminar" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4", d5: "z5" },
      },
      hint: "Piensa en que hace cada atributo por su nombre en ingles.",
      explanation:
        "controls muestra los controles, autoplay inicia automaticamente, muted silencia, poster define la imagen previa, y loop repite el video.",
    },
    {
      id: "html-05-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Crea un elemento <figure> que contenga una imagen con src='foto.jpg', alt='Paisaje de montana', width='400' y height='300'. Agrega un <figcaption> que diga 'Vista panoramica de los Andes'.",
      codeTemplate: {
        html: `<!-- Crea el figure con imagen y figcaption -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<figure>", "<img", "src=", "alt=", "<figcaption>", "</figcaption>", "</figure>"],
      },
      hint: "Estructura: figure > img + figcaption.",
      explanation:
        "Un <figure> envuelve la imagen y el <figcaption> proporciona la descripcion visible de la misma.",
    },
    {
      id: "html-05-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Completa la etiqueta de video para que muestre controles y se reproduzca sin sonido:",
      codeTemplate: {
        html: `<video src="clip.mp4" _____ _____ width="640">\n  Tu navegador no soporta video.\n</video>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["controls", "muted"],
      },
      validation: { type: "exact", answer: ["controls", "muted"] },
      hint: "Un atributo muestra los botones y otro silencia el audio.",
      explanation:
        "El atributo controls muestra los controles de reproduccion y muted inicia el video sin sonido.",
    },
    {
      id: "html-05-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt: "Para que sirve la etiqueta <picture> en HTML?",
      options: [
        { id: "a", text: "Para aplicar filtros a una imagen", isCorrect: false },
        { id: "b", text: "Para crear una galeria de fotos", isCorrect: false },
        { id: "c", text: "Para ofrecer multiples fuentes de imagen segun el dispositivo o formato soportado", isCorrect: true },
        { id: "d", text: "Para agregar un borde decorativo a una imagen", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Permite definir diferentes imagenes para diferentes condiciones.",
      explanation:
        "La etiqueta <picture> con elementos <source> permite servir diferentes imagenes segun el tamano de pantalla o formato soportado por el navegador.",
    },
  ],
};
