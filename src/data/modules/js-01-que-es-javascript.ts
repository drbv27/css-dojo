import type { ModuleData } from "@/types";

export const jsQueEsModule: ModuleData = {
  slug: "js-que-es-javascript",
  title: "Que es JavaScript?",
  description:
    "Descubre que es JavaScript, donde se ejecuta, como incluirlo en tus paginas web y como usar console.log para depurar tu codigo.",
  order: 101,
  dojo: "js",
  category: "js-fundamentals",
  icon: "terminal",
  lessons: [
    {
      id: "js01-leccion-01",
      title: "Que es JavaScript?",
      content: `## Que es JavaScript?

**JavaScript** (abreviado **JS**) es el **lenguaje de programacion de la web**. Es el unico lenguaje que los navegadores entienden de forma nativa para dar **interactividad** a las paginas.

Si HTML es la estructura y CSS es el estilo, **JavaScript es el comportamiento**: lo que hace que los botones respondan, que los formularios se validen y que las paginas se actualicen sin recargar.

### Caracteristicas principales

- **Interpretado**: no necesita compilacion, el navegador lo ejecuta directamente.
- **Dinamico**: las variables no necesitan un tipo fijo.
- **Multi-paradigma**: soporta programacion orientada a objetos, funcional e imperativa.
- **Event-driven**: responde a eventos como clics, teclas y scroll.

### Un poco de historia

JavaScript fue creado por **Brendan Eich** en 1995 en solo **10 dias** mientras trabajaba en Netscape. A pesar de su nombre, **no tiene relacion directa con Java**; el nombre fue una estrategia de marketing.

> **Dato curioso:** Originalmente se llamaba "Mocha", luego "LiveScript", y finalmente "JavaScript".`,
      codeExample: {
        html: `<h1>Hola JavaScript!</h1>\n<p id="demo">Este texto cambiara...</p>\n<button onclick="document.getElementById('demo').textContent = 'JavaScript funciona!'">Haz clic</button>`,
        css: `h1 { color: #f0db4f; }\nbutton { padding: 8px 16px; cursor: pointer; background: #323330; color: #f0db4f; border: none; border-radius: 4px; font-size: 14px; }\nbutton:hover { background: #1a1a1a; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js01-leccion-02",
      title: "Donde se ejecuta JavaScript?",
      content: `## Donde se ejecuta JavaScript?

JavaScript puede ejecutarse en **dos entornos principales**:

### 1. En el navegador (Frontend)

Todos los navegadores modernos incluyen un **motor de JavaScript**:

| Navegador | Motor |
|-----------|-------|
| Chrome / Edge | **V8** |
| Firefox | **SpiderMonkey** |
| Safari | **JavaScriptCore** |

En el navegador, JS puede manipular el **DOM** (Document Object Model), escuchar eventos y comunicarse con servidores.

### 2. En el servidor (Backend) con Node.js

**Node.js** es un entorno que usa el motor V8 de Chrome para ejecutar JavaScript **fuera del navegador**. Con Node.js puedes crear servidores web, APIs, herramientas de linea de comandos y mucho mas.

### La consola del navegador

Puedes abrir la **consola del desarrollador** en cualquier navegador:

- **Windows/Linux**: \`Ctrl + Shift + J\` o \`F12\`
- **Mac**: \`Cmd + Option + J\`

La consola es tu mejor amiga para **probar codigo rapido** y depurar errores.

> **Tip:** Escribe \`console.log("Hola")\` en la consola de tu navegador para probarlo ahora mismo.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const resultado = document.getElementById("resultado");\n  resultado.innerHTML = "<p>Motor del navegador: " + navigator.userAgent.split(" ").pop() + "</p>";\n  resultado.innerHTML += "<p>Plataforma: " + navigator.platform + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js01-leccion-03",
      title: "La etiqueta script y console.log",
      content: `## La etiqueta script y console.log

### La etiqueta \`<script>\`

Para incluir JavaScript en una pagina HTML usamos la etiqueta \`<script>\`:

\`\`\`html
<!-- JavaScript interno -->
<script>
  console.log("Hola desde JS!");
</script>

<!-- JavaScript externo (recomendado) -->
<script src="mi-archivo.js"></script>
\`\`\`

### El atributo \`defer\`

Cuando enlazas un archivo JS externo, es recomendable usar el atributo **defer**:

\`\`\`html
<script src="app.js" defer></script>
\`\`\`

**defer** le dice al navegador: "Descarga el archivo en paralelo, pero **ejecutalo despues** de que el HTML termine de cargarse". Esto evita errores cuando tu JS intenta acceder a elementos que aun no existen en la pagina.

### console.log()

\`console.log()\` es la funcion mas basica para **mostrar mensajes** en la consola del navegador. Es esencial para depurar tu codigo:

\`\`\`javascript
console.log("Hola Mundo");          // texto
console.log(42);                     // numero
console.log(true);                   // booleano
console.log("Edad:", 25);            // multiples valores
\`\`\`

Otras funciones utiles de la consola:

- \`console.warn()\` — muestra una advertencia (amarillo)
- \`console.error()\` — muestra un error (rojo)
- \`console.table()\` — muestra datos en formato tabla

> **Importante:** \`console.log()\` es solo para desarrollo. En produccion, elimina o minimiza los logs.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  res.innerHTML += "<p>> console.log('Hola Mundo');</p>";\n  res.innerHTML += "<p style='color:#4ec9b0'>Hola Mundo</p>";\n  res.innerHTML += "<p>> console.log(2 + 2);</p>";\n  res.innerHTML += "<p style='color:#4ec9b0'>4</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #d4d4d4; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js01-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que es JavaScript?",
      options: [
        { id: "a", text: "Un lenguaje de estilos para paginas web", isCorrect: false },
        { id: "b", text: "Un lenguaje de programacion que agrega interactividad a las paginas web", isCorrect: true },
        { id: "c", text: "Un framework de CSS", isCorrect: false },
        { id: "d", text: "Una version moderna de Java", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en lo que hace que un boton responda al hacer clic.",
      explanation: "JavaScript es el lenguaje de programacion que agrega comportamiento e interactividad a las paginas web.",
    },
    {
      id: "js01-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cual es la funcion que usamos para mostrar mensajes en la consola del navegador?",
      options: [
        { id: "a", text: "print()", isCorrect: false },
        { id: "b", text: "echo()", isCorrect: false },
        { id: "c", text: "console.log()", isCorrect: true },
        { id: "d", text: "alert()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es una funcion del objeto console.",
      explanation: "console.log() es la funcion estandar para imprimir mensajes en la consola del navegador. alert() muestra un cuadro de dialogo, no escribe en la consola.",
    },
    {
      id: "js01-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa el codigo para mostrar 'Hola Mundo' en la consola:",
      codeTemplate: {
        html: `<script>\n  ___.___(\"Hola Mundo\");\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["console", "log"],
      },
      validation: { type: "exact", answer: ["console", "log"] },
      hint: "Necesitas el objeto 'console' y su metodo 'log'.",
      explanation: "console.log() es la forma estandar de imprimir mensajes. 'console' es el objeto y 'log' es el metodo.",
    },
    {
      id: "js01-ej-04",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 4,
      prompt: "Para que sirve el atributo 'defer' en la etiqueta <script>?",
      options: [
        { id: "a", text: "Hace que el script se ejecute inmediatamente", isCorrect: false },
        { id: "b", text: "Retrasa la ejecucion del script hasta que el HTML termine de cargarse", isCorrect: true },
        { id: "c", text: "Impide que el script se ejecute", isCorrect: false },
        { id: "d", text: "Hace que el script se ejecute dos veces", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "La palabra 'defer' en ingles significa 'diferir' o 'aplazar'.",
      explanation: "El atributo defer indica al navegador que descargue el script en paralelo pero lo ejecute despues de que el DOM este completamente cargado.",
    },
    {
      id: "js01-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Escribe codigo JavaScript que muestre el texto 'JavaScript es genial!' dentro del div con id 'resultado'. Usa document.getElementById y textContent.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "JavaScript es genial!" },
      hint: "Usa document.getElementById('resultado').textContent = 'JavaScript es genial!';",
      explanation: "document.getElementById() selecciona un elemento por su id. La propiedad textContent permite cambiar el texto de un elemento.",
    },
    {
      id: "js01-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Relaciona cada concepto con su descripcion correcta:",
      dragItems: [
        { id: "d1", content: "console.log()", correctZone: "z1" },
        { id: "d2", content: "defer", correctZone: "z2" },
        { id: "d3", content: "Node.js", correctZone: "z3" },
        { id: "d4", content: "V8", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Muestra mensajes en la consola" },
        { id: "z2", label: "Ejecuta el script despues de cargar el HTML" },
        { id: "z3", label: "Entorno para ejecutar JS fuera del navegador" },
        { id: "z4", label: "Motor de JavaScript de Chrome" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" } },
      hint: "Piensa en donde se usa cada termino: navegador, servidor o consola.",
      explanation: "console.log() imprime en la consola, defer controla cuando se ejecuta un script, Node.js permite JS en el servidor, y V8 es el motor de Chrome.",
    },
  ],
};
