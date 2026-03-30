import type { ModuleData } from "@/types";

export const jsEventosModule: ModuleData = {
  slug: "js-eventos",
  title: "Eventos",
  description:
    "Aprende a manejar eventos del navegador: clicks, teclado, formularios y delegacion de eventos.",
  order: 113,
  category: "js-intermediate",
  icon: "Zap",
  dojo: "js",
  lessons: [
    {
      id: "js13-leccion-01",
      title: "addEventListener",
      content: `## Eventos en JavaScript

Un **evento** es una accion que ocurre en el navegador: un click, una tecla presionada, el mouse moviéndose, etc.

### addEventListener()

La forma moderna de escuchar eventos:

\`\`\`javascript
elemento.addEventListener("click", function(evento) {
  // codigo a ejecutar
});
\`\`\`

### Eventos comunes

| Evento | Se dispara cuando... |
|--------|---------------------|
| \`click\` | Se hace click |
| \`dblclick\` | Doble click |
| \`mouseover\` | Mouse entra al elemento |
| \`mouseout\` | Mouse sale del elemento |
| \`keydown\` | Se presiona una tecla |
| \`keyup\` | Se suelta una tecla |
| \`submit\` | Se envia un formulario |
| \`input\` | Cambia el valor de un input |
| \`load\` | La pagina termina de cargar |

### El objeto evento (event)

Cada handler recibe un objeto con informacion del evento:
\`\`\`javascript
boton.addEventListener("click", function(e) {
  e.target    // elemento que disparo el evento
  e.type      // tipo de evento ("click")
  e.preventDefault() // prevenir comportamiento por defecto
});
\`\`\``,
      codeExample: {
        html: '<button id="btn">Haz click aqui</button>\n<span id="contador">0</span> clicks\n<div id="resultado"></div>',
        css: '#btn { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; } #btn:hover { background: #74c7ec; } #contador { font-weight: bold; color: #a6e3a1; font-size: 18px; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cdd6f4; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var clicks = 0;
var btn = document.getElementById("btn");
var contadorEl = document.getElementById("contador");
var resultado = document.getElementById("resultado");

btn.addEventListener("click", function(e) {
  clicks++;
  contadorEl.textContent = clicks;
  resultado.textContent = "Ultimo click:\\n  Tipo: " + e.type + "\\n  Target: " + e.target.tagName + "\\n  Clicks totales: " + clicks;
});`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js13-leccion-02",
      title: "Eventos de teclado y mouse",
      content: `## Eventos de teclado

\`\`\`javascript
document.addEventListener("keydown", function(e) {
  console.log(e.key);   // "a", "Enter", "ArrowUp"
  console.log(e.code);  // "KeyA", "Enter", "ArrowUp"
  console.log(e.ctrlKey); // true si Ctrl esta presionado
  console.log(e.shiftKey);
});
\`\`\`

### Teclas especiales
- \`e.key\` — valor de la tecla ("a", "Enter", " ")
- \`e.code\` — codigo fisico de la tecla
- \`e.ctrlKey\`, \`e.shiftKey\`, \`e.altKey\` — teclas modificadoras

## Eventos de mouse

\`\`\`javascript
elemento.addEventListener("mousemove", function(e) {
  console.log(e.clientX, e.clientY); // posicion en la ventana
  console.log(e.offsetX, e.offsetY); // posicion relativa al elemento
});
\`\`\`

## removeEventListener()

Para quitar un listener, necesitas pasar la misma funcion:

\`\`\`javascript
function handler() { /* ... */ }
btn.addEventListener("click", handler);
btn.removeEventListener("click", handler);
\`\`\`

> **Nota:** Con funciones anonimas no puedes usar removeEventListener. Usa funciones con nombre.`,
      codeExample: {
        html: '<div id="zona" style="height:80px;display:flex;align-items:center;justify-content:center;">Mueve el mouse aqui</div>\n<div id="resultado"></div>',
        css: '#zona { background: #313244; color: #cdd6f4; border-radius: 8px; cursor: crosshair; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var zona = document.getElementById("zona");
var resultado = document.getElementById("resultado");

zona.addEventListener("mousemove", function(e) {
  resultado.textContent = "Mouse en zona:\\n  X: " + e.offsetX + "\\n  Y: " + e.offsetY;
});

zona.addEventListener("click", function(e) {
  zona.style.background = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
  resultado.textContent = "Click! Color cambiado\\n  clientX: " + e.clientX + "\\n  clientY: " + e.clientY;
});`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js13-leccion-03",
      title: "Delegacion de eventos",
      content: `## Delegacion de eventos

En lugar de agregar un listener a cada elemento hijo, agregas UNO al padre:

\`\`\`javascript
lista.addEventListener("click", function(e) {
  if (e.target.tagName === "LI") {
    // manejar click en el <li>
  }
});
\`\`\`

### Ventajas
1. **Rendimiento:** un solo listener vs. muchos
2. **Elementos dinamicos:** funciona con elementos agregados despues
3. **Menos memoria:** menos listeners = menos uso de memoria

### Event bubbling

Los eventos "burbujean" desde el elemento hijo hasta el padre:

\`\`\`
click en <li>
  → sube a <ul>
    → sube a <body>
      → sube a <html>
        → sube a document
\`\`\`

### Detener la propagacion

\`\`\`javascript
e.stopPropagation();   // detiene el bubbling
e.preventDefault();     // previene la accion por defecto
\`\`\`

> La delegacion aprovecha el bubbling para capturar eventos en el padre.`,
      codeExample: {
        html: '<ul id="lista">\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>\n<button id="agregar">Agregar item</button>\n<div id="resultado"></div>',
        css: '#lista { list-style: none; padding: 0; } #lista li { padding: 8px; margin: 2px 0; background: #313244; color: #cdd6f4; border-radius: 4px; cursor: pointer; } #lista li:hover { background: #45475a; } #agregar { margin: 8px 0; padding: 6px 12px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `var lista = document.getElementById("lista");
var resultado = document.getElementById("resultado");
var contador = 3;

// Delegacion: UN listener en el padre
lista.addEventListener("click", function(e) {
  if (e.target.tagName === "LI") {
    resultado.textContent = "Clickeaste: " + e.target.textContent + "\\n(Delegacion de eventos)";
    e.target.style.color = "#a6e3a1";
  }
});

// Agregar items dinamicamente
document.getElementById("agregar").addEventListener("click", function() {
  contador++;
  var li = document.createElement("li");
  li.textContent = "Item " + contador + " (nuevo)";
  lista.appendChild(li);
  resultado.textContent = "Item " + contador + " agregado.\\nEl click funcionara sin agregar un nuevo listener!";
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js13-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la forma moderna de escuchar un evento en JavaScript?",
      options: [
        { id: "a", text: 'onclick = "funcion()"', isCorrect: false },
        { id: "b", text: 'addEventListener("click", funcion)', isCorrect: true },
        { id: "c", text: "onEvent(funcion)", isCorrect: false },
        { id: "d", text: "listen(evento, funcion)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El metodo tiene 'add', 'Event' y 'Listener' en su nombre.",
      explanation: "addEventListener es la forma moderna y recomendada. Los atributos onclick en HTML son un anti-patron.",
    },
    {
      id: "js13-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que propiedad del objeto evento indica que elemento disparo el evento?",
      options: [
        { id: "a", text: "e.element", isCorrect: false },
        { id: "b", text: "e.source", isCorrect: false },
        { id: "c", text: "e.target", isCorrect: true },
        { id: "d", text: "e.origin", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Target significa 'objetivo' en ingles.",
      explanation: "e.target es el elemento que origino el evento (por ejemplo, el boton que fue clickeado).",
    },
    {
      id: "js13-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa para escuchar el evento click en un boton:",
      codeTemplate: {
        html: "",
        cssPrefix: 'boton.addEventListener("',
        cssSuffix: '", function() { });',
        blanks: ["click"],
      },
      validation: { type: "exact", answer: "click" },
      hint: "El nombre del evento para cuando se hace click.",
      explanation: '"click" es el nombre del evento que se dispara al hacer click sobre un elemento.',
    },
    {
      id: "js13-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que metodo previene el comportamiento por defecto de un evento?",
      options: [
        { id: "a", text: "e.stop()", isCorrect: false },
        { id: "b", text: "e.cancel()", isCorrect: false },
        { id: "c", text: "e.preventDefault()", isCorrect: true },
        { id: "d", text: "e.prevent()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "prevent = prevenir, Default = por defecto.",
      explanation: "preventDefault() evita la accion por defecto del navegador, como enviar un formulario o seguir un enlace.",
    },
    {
      id: "js13-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que es la delegacion de eventos?",
      options: [
        { id: "a", text: "Agregar multiples listeners al mismo elemento", isCorrect: false },
        { id: "b", text: "Escuchar eventos en el padre para manejar clicks en los hijos", isCorrect: true },
        { id: "c", text: "Prevenir que los eventos se propaguen", isCorrect: false },
        { id: "d", text: "Crear eventos personalizados", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se aprovecha el bubbling para capturar eventos en un ancestro.",
      explanation: "La delegacion usa un listener en el padre que maneja eventos de los hijos, aprovechando el event bubbling.",
    },
    {
      id: "js13-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que propiedad del evento keydown devuelve el valor de la tecla presionada?",
      options: [
        { id: "a", text: "e.char", isCorrect: false },
        { id: "b", text: "e.keyCode", isCorrect: false },
        { id: "c", text: "e.key", isCorrect: true },
        { id: "d", text: "e.value", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es la propiedad moderna para obtener la tecla.",
      explanation: 'e.key devuelve el valor de la tecla ("a", "Enter", "ArrowUp"). keyCode esta deprecado.',
    },
  ],
};
