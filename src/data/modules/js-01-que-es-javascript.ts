import type { ModuleData } from "@/types";

export const jsQueEsModule: ModuleData = {
  slug: "js-que-es-javascript",
  title: "¿Qué es JavaScript?",
  description:
    "Descubre que es JavaScript, para que se usa y como ejecutar tu primer programa en el navegador.",
  order: 101,
  category: "js-fundamentals",
  icon: "Code",
  dojo: "js",
  lessons: [
    {
      id: "js01-leccion-01",
      title: "¿Qué es JavaScript?",
      content: `## ¿Qué es JavaScript?

**JavaScript** es el lenguaje de programación de la web. Es el único lenguaje que los navegadores ejecutan de forma nativa, y hoy en dia se usa tanto en el **frontend** como en el **backend**.

### ¿Para que sirve?

- **Interactividad:** hacer que botones, formularios y menus respondan al usuario
- **Manipular el DOM:** cambiar el contenido y estilos de una página sin recargarla
- **Comunicación con servidores:** enviar y recibir datos (AJAX, Fetch API)
- **Aplicaciones completas:** desde juegos hasta editores de texto en el navegador

### Un poco de historia

JavaScript fue creado por **Brendan Eich** en solo 10 dias en 1995 para el navegador Netscape. A pesar de su nombre, **no tiene relación con Java**. Hoy es mantenido bajo el estándar **ECMAScript**.

> **Dato curioso:** JavaScript se llamo originalmente "Mocha", luego "LiveScript", y finalmente "JavaScript" como estrategia de marketing.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; font-size: 18px; }',
        js: 'document.getElementById("resultado").textContent = "Hola Mundo desde JavaScript!";',
        editable: true,
      },
      order: 1,
    },
    {
      id: "js01-leccion-02",
      title: "La consola del navegador",
      content: `## La consola del navegador

La **consola** es la herramienta principal para probar código JavaScript. Puedes abrirla en cualquier navegador con **F12** o **Ctrl+Shift+J**.

### console.log()

El método mas usado para mostrar mensajes en la consola:

\`\`\`javascript
console.log("Hola desde la consola");
console.log(42);
console.log(true);
\`\`\`

### Otros métodos útiles

- \`console.warn()\` — muestra una advertencia (amarillo)
- \`console.error()\` — muestra un error (rojo)
- \`console.table()\` — muestra datos en formato tabla

### ¿Por que es importante?

La consola es tu mejor amiga para **depurar** (encontrar errores). Siempre que algo no funcione, usa \`console.log()\` para inspeccionar valores.

> **Tip:** En este dojo, usaremos un div de resultado para mostrar la salida, pero en la práctica usaras mucho la consola.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cdd6f4; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];
salida.push("console.log() muestra mensajes");
salida.push("Numero: " + 42);
salida.push("Booleano: " + true);
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js01-leccion-03",
      title: "Tu primer programa",
      content: `## Tu primer programa

Vamos a escribir un programa simple que combine lo aprendido. En JavaScript, las instrucciones se ejecutan **de arriba a abajo**, una por una.

### Comentarios

Los comentarios permiten documentar tu código sin que el navegador los ejecute:

\`\`\`javascript
// Esto es un comentario de una linea

/* Esto es un comentario
   de multiples lineas */
\`\`\`

### Punto y coma

En JavaScript, el punto y coma (\`;\`) al final de cada instrucción es **opcional** pero recomendado. Ayuda a evitar errores inesperados.

### Buenas prácticas desde el inicio

1. Escribe código **legible** y bien indentado
2. Usa **nombres descriptivos** para tus variables
3. Comenta el código cuando sea necesario
4. Prueba tu código frecuentemente

> **Recuerda:** Aprender a programar es como aprender un idioma nuevo. La práctica constante es la clave.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `// Mi primer programa en JavaScript
var nombre = "Estudiante";
var curso = "Dev Dojo - JavaScript";

// Mostrar un saludo personalizado
var mensaje = "Bienvenido, " + nombre + "!\\nCurso: " + curso;
document.getElementById("resultado").textContent = mensaje;`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js01-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Quién creo JavaScript y en que año?",
      options: [
        { id: "a", text: "Brendan Eich en 1995", isCorrect: true },
        { id: "b", text: "Tim Berners-Lee en 1991", isCorrect: false },
        { id: "c", text: "James Gosling en 1995", isCorrect: false },
        { id: "d", text: "Guido van Rossum en 1993", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Fue creado para el navegador Netscape en muy poco tiempo.",
      explanation:
        "Brendan Eich creo JavaScript en 1995 en solo 10 dias para el navegador Netscape Navigator.",
    },
    {
      id: "js01-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "¿Qué método se usa para mostrar mensajes en la consola del navegador?",
      options: [
        { id: "a", text: "print()", isCorrect: false },
        { id: "b", text: "console.log()", isCorrect: true },
        { id: "c", text: "echo()", isCorrect: false },
        { id: "d", text: "alert()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un método del objeto console.",
      explanation:
        "console.log() es el método estándar para imprimir mensajes en la consola del navegador. alert() muestra un popup, no escribe en consola.",
    },
    {
      id: "js01-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "¿JavaScript tiene relación directa con el lenguaje Java?",
      options: [
        { id: "a", text: "Si, JavaScript es una versión ligera de Java", isCorrect: false },
        { id: "b", text: "No, son lenguajes completamente diferentes", isCorrect: true },
        { id: "c", text: "Si, ambos fueron creados por la misma empresa", isCorrect: false },
        { id: "d", text: "Si, comparten el mismo motor de ejecución", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre fue una estrategia de marketing.",
      explanation:
        "JavaScript y Java son lenguajes completamente diferentes. El nombre 'JavaScript' fue elegido como estrategia de marketing cuando Java era muy popular.",
    },
    {
      id: "js01-ej-04",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 4,
      prompt: 'Completa el código para mostrar "Hola Mundo" en la consola:',
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: '("Hola Mundo");',
        blanks: ["console.log"],
      },
      validation: { type: "exact", answer: "console.log" },
      hint: "Usa el objeto console y su método para imprimir.",
      explanation:
        'console.log("Hola Mundo") imprime el texto "Hola Mundo" en la consola del navegador.',
    },
    {
      id: "js01-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "¿Cuál es la forma correcta de escribir un comentario de una línea en JavaScript?",
      options: [
        { id: "a", text: "<!-- comentario -->", isCorrect: false },
        { id: "b", text: "# comentario", isCorrect: false },
        { id: "c", text: "// comentario", isCorrect: true },
        { id: "d", text: "** comentario **", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Usa dos caracteres iguales al inicio de la línea.",
      explanation:
        "En JavaScript, los comentarios de una línea comienzan con //. Los comentarios de múltiples líneas usan /* */. <!-- --> es para HTML y # es para Python.",
    },
    {
      id: "js01-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada tecnologia web según su función principal:",
      dragItems: [
        { id: "drag-1", content: "HTML", correctZone: "zone-estructura" },
        { id: "drag-2", content: "CSS", correctZone: "zone-estilos" },
        { id: "drag-3", content: "JavaScript", correctZone: "zone-interactividad" },
      ],
      dropZones: [
        { id: "zone-estructura", label: "Estructura" },
        { id: "zone-estilos", label: "Estilos" },
        { id: "zone-interactividad", label: "Interactividad" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-estructura",
          "drag-2": "zone-estilos",
          "drag-3": "zone-interactividad",
        },
      },
      hint: "Cada tecnologia tiene un rol específico en la web.",
      explanation:
        "HTML define la estructura del contenido, CSS controla la presentación visual y JavaScript añade interactividad y lógica de programación.",
    },
  ],
};
