import type { ModuleData } from "@/types";

export const htmlQueEsModule: ModuleData = {
  slug: "html-01-que-es-html",
  title: "Que es HTML?",
  description:
    "Descubre que es HTML, su historia, como los navegadores renderizan paginas y la estructura basica de un documento HTML.",
  order: 1,
  dojo: "html",
  category: "html-fundamentals",
  icon: "file-code",
  lessons: [
    {
      id: "html-01-leccion-01",
      title: "Que es HTML?",
      content: `## Que es HTML?

**HTML** significa **HyperText Markup Language** (Lenguaje de Marcado de Hipertexto). Es el lenguaje estandar que se utiliza para **crear y estructurar** el contenido de las paginas web.

HTML no es un lenguaje de programacion: es un **lenguaje de marcado**. Esto significa que usa **etiquetas** para indicar al navegador como mostrar el contenido.

### Para que sirve HTML?

- Definir la **estructura** de una pagina web
- Organizar el **contenido** (texto, imagenes, videos, enlaces)
- Crear **formularios** para recopilar datos
- Establecer la **jerarquia** de la informacion

### Un poco de historia

HTML fue creado por **Tim Berners-Lee** en 1991 como parte del proyecto World Wide Web en el CERN. Desde entonces ha evolucionado:

- **HTML 1.0** (1991) — Version original muy basica
- **HTML 2.0** (1995) — Primer estandar oficial
- **HTML 4.01** (1999) — Version madura y ampliamente usada
- **HTML5** (2014) — Version actual con soporte multimedia nativo

> **Dato curioso:** La primera pagina web de la historia todavia esta en linea. Fue creada por Tim Berners-Lee en 1991.`,
      codeExample: {
        html: `<h1>Mi primera pagina web</h1>\n<p>Esto es HTML en accion.</p>\n<p>Cada elemento esta definido por etiquetas.</p>`,
        css: `h1 {\n  color: #2d3748;\n  font-family: sans-serif;\n}\n\np {\n  color: #4a5568;\n  font-size: 16px;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "html-01-leccion-02",
      title: "Como funcionan los navegadores",
      content: `## Como renderizan los navegadores

Cuando escribes una URL en tu navegador y presionas Enter, ocurre un proceso fascinante:

### 1. Solicitud al servidor
El navegador envia una **solicitud HTTP** al servidor donde esta alojada la pagina.

### 2. Respuesta del servidor
El servidor responde enviando los archivos necesarios: **HTML**, CSS, JavaScript, imagenes, etc.

### 3. Parsing (Analisis)
El navegador lee el HTML y construye el **DOM** (Document Object Model), que es una representacion en forma de arbol de todos los elementos de la pagina.

### 4. Renderizado
El navegador combina el DOM con los estilos CSS para **pintar** la pagina en tu pantalla.

### El DOM: Arbol de elementos

\`\`\`
documento
  └── html
       ├── head
       │    └── title
       └── body
            ├── h1
            └── p
\`\`\`

Cada **etiqueta HTML** se convierte en un **nodo** del arbol DOM. El navegador usa esta estructura para saber que mostrar y donde.

> **Importante:** El navegador lee el HTML de arriba hacia abajo, en orden. Por eso el orden de los elementos importa.`,
      codeExample: {
        html: `<!-- El navegador lee esto y lo convierte en el DOM -->\n<h1>Titulo principal</h1>\n<p>Primer parrafo del documento.</p>\n<p>Segundo parrafo del documento.</p>`,
        css: `h1 {\n  color: #2b6cb0;\n  border-bottom: 2px solid #bee3f8;\n  padding-bottom: 8px;\n}\n\np {\n  color: #4a5568;\n  line-height: 1.6;\n}`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "html-01-leccion-03",
      title: "Estructura basica de un documento HTML",
      content: `## Estructura basica de un documento HTML

Todo documento HTML tiene una estructura fundamental que siempre debes respetar:

### 1. DOCTYPE
La declaracion \`<!DOCTYPE html>\` le dice al navegador que estamos usando **HTML5**. Siempre va en la primera linea.

### 2. Etiqueta \`<html>\`
Es el **elemento raiz** que contiene todo el documento. Se recomienda agregar el atributo \`lang\` para indicar el idioma.

### 3. Etiqueta \`<head>\`
Contiene **metadatos** del documento: titulo, codificacion de caracteres, enlaces a hojas de estilo, etc. **No se muestra en la pagina.**

### 4. Etiqueta \`<body>\`
Contiene **todo el contenido visible** de la pagina: texto, imagenes, enlaces, formularios, etc.

### Plantilla minima

\`\`\`html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Mi pagina</title>
  </head>
  <body>
    <h1>Hola mundo!</h1>
  </body>
</html>
\`\`\`

> **Regla de oro:** Siempre empieza tus documentos HTML con \`<!DOCTYPE html>\`. Sin esta declaracion, el navegador puede entrar en "modo quirks" y comportarse de forma impredecible.`,
      codeExample: {
        html: `<!DOCTYPE html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8">\n    <title>Mi primera pagina</title>\n  </head>\n  <body>\n    <h1>Hola mundo!</h1>\n    <p>Esta es mi primera pagina HTML.</p>\n  </body>\n</html>`,
        css: `h1 {\n  color: #2d3748;\n  font-family: sans-serif;\n}\n\np {\n  color: #718096;\n}`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html-01-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que significa HTML?",
      options: [
        { id: "a", text: "HyperText Markup Language", isCorrect: true },
        { id: "b", text: "High Tech Modern Language", isCorrect: false },
        { id: "c", text: "Home Tool Markup Language", isCorrect: false },
        { id: "d", text: "HyperText Machine Language", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Piensa en 'Lenguaje de Marcado de Hipertexto'.",
      explanation:
        "HTML significa HyperText Markup Language, o Lenguaje de Marcado de Hipertexto en espanol.",
    },
    {
      id: "html-01-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Quien creo HTML y en que ano?",
      options: [
        { id: "a", text: "Steve Jobs en 1995", isCorrect: false },
        { id: "b", text: "Tim Berners-Lee en 1991", isCorrect: true },
        { id: "c", text: "Bill Gates en 1989", isCorrect: false },
        { id: "d", text: "Brendan Eich en 1993", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Fue creado en el CERN, el laboratorio europeo de fisica de particulas.",
      explanation:
        "Tim Berners-Lee creo HTML en 1991 como parte del proyecto World Wide Web en el CERN.",
    },
    {
      id: "html-01-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa la declaracion que le indica al navegador que usamos HTML5:",
      codeTemplate: {
        html: `_____ html>\n<html lang="es">\n  <head>\n    <title>Mi pagina</title>\n  </head>\n  <body>\n    <p>Hola!</p>\n  </body>\n</html>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["<!DOCTYPE"],
      },
      validation: { type: "exact", answer: ["<!DOCTYPE"] },
      hint: "Es una declaracion que empieza con <! y la palabra DOCTYPE.",
      explanation:
        "La declaracion <!DOCTYPE html> le indica al navegador que el documento esta escrito en HTML5.",
    },
    {
      id: "html-01-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada parte de la estructura HTML a la zona correcta segun su funcion:",
      dragItems: [
        { id: "d1", content: "<!DOCTYPE html>", correctZone: "z1" },
        { id: "d2", content: "<head>", correctZone: "z2" },
        { id: "d3", content: "<body>", correctZone: "z3" },
        { id: "d4", content: "<html>", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Declaracion del tipo de documento" },
        { id: "z2", label: "Metadatos no visibles" },
        { id: "z3", label: "Contenido visible de la pagina" },
        { id: "z4", label: "Elemento raiz del documento" },
      ],
      validation: {
        type: "exact",
        answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" },
      },
      hint: "Recuerda: head contiene metadatos, body contiene lo visible.",
      explanation:
        "DOCTYPE declara la version, html es la raiz, head contiene metadatos y body el contenido visible.",
    },
    {
      id: "html-01-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Escribe la estructura basica de un documento HTML5 con un titulo 'Mi Web' en el head y un encabezado h1 que diga 'Bienvenido' en el body.",
      codeTemplate: {
        html: `<!-- Escribe tu codigo HTML aqui -->`,
        cssPrefix: "",
        cssSuffix: "",
      },
      validation: {
        type: "includes",
        answer: ["<!DOCTYPE html>", "<html", "<head>", "<title>", "</title>", "</head>", "<body>", "<h1>", "</h1>", "</body>", "</html>"],
      },
      hint: "Recuerda empezar con <!DOCTYPE html> y luego la etiqueta <html> con head y body dentro.",
      explanation:
        "Un documento HTML5 basico necesita DOCTYPE, html, head con title, y body con el contenido visible.",
    },
    {
      id: "html-01-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Que sucede si omites la declaracion <!DOCTYPE html> en tu documento?",
      options: [
        { id: "a", text: "La pagina no se muestra en absoluto", isCorrect: false },
        { id: "b", text: "El navegador puede entrar en 'modo quirks' y comportarse de forma impredecible", isCorrect: true },
        { id: "c", text: "Los estilos CSS no se aplican", isCorrect: false },
        { id: "d", text: "No pasa nada, es completamente opcional", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El navegador intenta ser compatible con paginas antiguas si no sabe la version.",
      explanation:
        "Sin DOCTYPE, el navegador entra en 'modo quirks', un modo de compatibilidad que puede causar comportamientos inesperados en el renderizado.",
    },
  ],
};
