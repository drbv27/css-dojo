import type { ModuleData } from "@/types";

export const jsEventosModule: ModuleData = {
  slug: "js-eventos",
  title: "Eventos en JavaScript",
  description:
    "Domina el sistema de eventos: addEventListener, click, submit, teclado, el objeto event, preventDefault, stopPropagation y delegacion de eventos.",
  order: 113,
  dojo: "js",
  category: "js-intermediate",
  icon: "mouse-pointer",
  lessons: [
    {
      id: "js13-leccion-01",
      title: "addEventListener y eventos basicos",
      content: `## addEventListener y eventos basicos

Los **eventos** son acciones que ocurren en la pagina: clicks, teclas presionadas, envio de formularios, etc. JavaScript puede reaccionar a estos eventos.

### addEventListener

Es la forma moderna de escuchar eventos:

\`\`\`javascript
const boton = document.querySelector("#mi-boton");

boton.addEventListener("click", function() {
  console.log("Boton clickeado!");
});
\`\`\`

### Con arrow function

\`\`\`javascript
boton.addEventListener("click", () => {
  console.log("Click con arrow function!");
});
\`\`\`

### Eventos comunes

| Evento | Se dispara cuando... |
|--------|---------------------|
| \`click\` | Se hace clic en un elemento |
| \`dblclick\` | Se hace doble clic |
| \`mouseover\` | El mouse pasa sobre el elemento |
| \`mouseout\` | El mouse sale del elemento |
| \`keydown\` | Se presiona una tecla |
| \`keyup\` | Se suelta una tecla |
| \`submit\` | Se envia un formulario |
| \`input\` | Cambia el valor de un input |
| \`change\` | Un input pierde el foco tras cambiar |
| \`load\` | La pagina termina de cargar |

### Remover un evento

\`\`\`javascript
function manejarClick() {
  console.log("Click!");
}

boton.addEventListener("click", manejarClick);
boton.removeEventListener("click", manejarClick);
\`\`\`

> **Nota:** Para remover un evento, necesitas pasar la misma referencia de funcion. Las funciones anonimas no se pueden remover.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <button id="boton" style="padding: 8px 16px; font-size: 16px; cursor: pointer;">Haz clic aqui</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
let clicks = 0;
document.getElementById("boton").addEventListener("click", () => {
  clicks++;
  document.getElementById("resultado").textContent = "Clicks: " + clicks;
});
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js13-leccion-02",
      title: "El objeto Event",
      content: `## El objeto Event

Cuando ocurre un evento, JavaScript crea un **objeto Event** con informacion sobre lo que sucedio.

### Acceder al objeto event

\`\`\`javascript
boton.addEventListener("click", function(event) {
  console.log(event.type);     // "click"
  console.log(event.target);   // El elemento que recibio el click
  console.log(event.clientX);  // Posicion X del mouse
  console.log(event.clientY);  // Posicion Y del mouse
});
\`\`\`

### Propiedades comunes del evento

| Propiedad | Descripcion |
|-----------|-------------|
| \`event.type\` | Tipo de evento ("click", "keydown", etc.) |
| \`event.target\` | Elemento que disparo el evento |
| \`event.currentTarget\` | Elemento que tiene el listener |
| \`event.clientX / clientY\` | Posicion del mouse en la ventana |
| \`event.key\` | Tecla presionada (en eventos de teclado) |
| \`event.timeStamp\` | Momento en que ocurrio |

### Eventos de teclado

\`\`\`javascript
document.addEventListener("keydown", (e) => {
  console.log("Tecla:", e.key);       // "a", "Enter", "ArrowUp"
  console.log("Codigo:", e.code);     // "KeyA", "Enter", "ArrowUp"

  if (e.key === "Escape") {
    console.log("Presionaste Escape!");
  }

  if (e.ctrlKey && e.key === "s") {
    console.log("Ctrl + S presionado!");
  }
});
\`\`\`

### Eventos de input

\`\`\`javascript
const input = document.querySelector("input");
input.addEventListener("input", (e) => {
  console.log("Valor actual:", e.target.value);
});
\`\`\`

> **Tip:** \`event.target\` es especialmente util en delegacion de eventos, como veremos mas adelante.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <input id="entrada" type="text" placeholder="Escribe algo..." style="padding: 8px; font-size: 16px; width: 100%; box-sizing: border-box;">
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("entrada").addEventListener("input", (e) => {
  document.getElementById("resultado").textContent = "Escribiste: " + e.target.value;
});
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js13-leccion-03",
      title: "preventDefault y stopPropagation",
      content: `## preventDefault y stopPropagation

### preventDefault

Evita el comportamiento **por defecto** del navegador:

\`\`\`javascript
// Evitar que un enlace navegue
const link = document.querySelector("a");
link.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Enlace clickeado pero no navega");
});

// Evitar que un formulario se envie
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Formulario NO enviado, procesamos con JS");
});
\`\`\`

### Propagacion de eventos (bubbling)

Cuando haces clic en un elemento, el evento **sube** por el arbol DOM:

\`\`\`
click en <button>
  -> sube a <div>
    -> sube a <body>
      -> sube a <html>
        -> sube a document
\`\`\`

\`\`\`javascript
document.querySelector("div").addEventListener("click", () => {
  console.log("Click en el div");
});

document.querySelector("button").addEventListener("click", () => {
  console.log("Click en el boton");
});

// Al hacer clic en el boton, se imprimen AMBOS mensajes
\`\`\`

### stopPropagation

Detiene la propagacion del evento:

\`\`\`javascript
document.querySelector("button").addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("Solo se ejecuta esto");
});
\`\`\`

> **Consejo:** Usa \`preventDefault\` para evitar comportamientos del navegador y \`stopPropagation\` para evitar que el evento suba al padre.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <form id="mi-form">
    <input type="text" id="nombre" placeholder="Tu nombre" style="padding: 8px; margin-right: 8px;">
    <button type="submit" style="padding: 8px 16px; cursor: pointer;">Enviar</button>
  </form>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("mi-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  document.getElementById("resultado").textContent = nombre
    ? "Hola, " + nombre + "! (formulario no se envio)"
    : "Escribe tu nombre primero";
});
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
    {
      id: "js13-leccion-04",
      title: "Delegacion de eventos",
      content: `## Delegacion de eventos

La **delegacion de eventos** es un patron donde colocas un solo listener en el **padre** en lugar de uno en cada hijo. Esto es eficiente y funciona con elementos dinamicos.

### El problema

\`\`\`javascript
// Incorrecto: un listener por cada boton
const botones = document.querySelectorAll(".btn");
botones.forEach(btn => {
  btn.addEventListener("click", () => {
    console.log("Click en: " + btn.textContent);
  });
});
// No funciona con botones agregados despues!
\`\`\`

### La solucion: delegacion

\`\`\`javascript
const contenedor = document.querySelector("#contenedor");
contenedor.addEventListener("click", (e) => {
  // Verificar si el clic fue en un boton
  if (e.target.matches(".btn")) {
    console.log("Click en: " + e.target.textContent);
  }
});
\`\`\`

### Ventajas de la delegacion

1. **Un solo listener** en lugar de muchos (mejor rendimiento)
2. **Funciona con elementos dinamicos** (agregados despues)
3. **Menos codigo** y mas facil de mantener

### closest() para delegacion precisa

\`\`\`javascript
document.querySelector("#lista").addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (item) {
    console.log("Clic en item:", item.textContent);
  }
});
\`\`\`

> **Patron comun:** Usa delegacion siempre que tengas una lista de elementos con el mismo comportamiento.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div id="botones">
    <button class="color-btn" data-color="red" style="padding: 8px; margin: 4px; cursor: pointer;">Rojo</button>
    <button class="color-btn" data-color="blue" style="padding: 8px; margin: 4px; cursor: pointer;">Azul</button>
    <button class="color-btn" data-color="green" style="padding: 8px; margin: 4px; cursor: pointer;">Verde</button>
  </div>
  <div id="resultado" style="margin-top: 12px; padding: 12px;"></div>
</div>
<script>
document.getElementById("botones").addEventListener("click", (e) => {
  if (e.target.matches(".color-btn")) {
    const color = e.target.dataset.color;
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Color seleccionado: " + color;
    resultado.style.backgroundColor = color;
    resultado.style.color = "white";
  }
});
</script>`,
        css: "",
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js13-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Cual es la forma moderna de escuchar un evento en JavaScript?",
      options: [
        { id: "a", text: 'element.onclick = function() {}', isCorrect: false },
        { id: "b", text: 'element.addEventListener("click", callback)', isCorrect: true },
        { id: "c", text: '<button onclick="funcion()">', isCorrect: false },
        { id: "d", text: 'element.on("click", callback)', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un metodo del elemento que recibe el tipo de evento y una funcion.",
      explanation: "`addEventListener` es la forma moderna y recomendada para escuchar eventos.",
    },
    {
      id: "js13-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Agrega un evento click al boton que muestre una alerta.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const boton = document.querySelector("#btn");\nboton.',
        cssSuffix: ";",
        blanks: ['addEventListener("click", () => { alert("Hola!") })'],
      },
      validation: { type: "regex", answer: 'addEventListener\\s*\\(\\s*["\']click["\']' },
      hint: 'Usa addEventListener con el evento "click" y una funcion callback.',
      explanation: '`addEventListener("click", callback)` escucha clicks en el boton.',
    },
    {
      id: "js13-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "¿Que hace `event.preventDefault()`?",
      options: [
        { id: "a", text: "Detiene la propagacion del evento al padre", isCorrect: false },
        { id: "b", text: "Elimina el evento del elemento", isCorrect: false },
        { id: "c", text: "Evita el comportamiento por defecto del navegador", isCorrect: true },
        { id: "d", text: "Previene que se ejecute el callback", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Piensa en que hace el navegador por defecto con un enlace o formulario.",
      explanation: "`preventDefault()` evita acciones por defecto como navegar (enlaces) o enviar (formularios).",
    },
    {
      id: "js13-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Previene el envio del formulario y obtiene el valor del input.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const form = document.querySelector("form");\nform.addEventListener("submit", (e) => {\n  ',
        cssSuffix: '\n  const valor = document.querySelector("#nombre").value;\n  console.log(valor);\n});',
        blanks: ["e.preventDefault();"],
      },
      validation: { type: "regex", answer: "e\\.preventDefault\\s*\\(\\s*\\)" },
      hint: "Llama al metodo preventDefault del objeto event para evitar el envio.",
      explanation: "`e.preventDefault()` dentro del handler de submit evita que la pagina se recargue.",
    },
    {
      id: "js13-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Relaciona cada evento con la accion que lo dispara.",
      dragItems: [
        { id: "d1", content: "click", correctZone: "clic" },
        { id: "d2", content: "submit", correctZone: "envio" },
        { id: "d3", content: "keydown", correctZone: "tecla" },
        { id: "d4", content: "input", correctZone: "escribir" },
        { id: "d5", content: "mouseover", correctZone: "mouse" },
      ],
      dropZones: [
        { id: "clic", label: "Hacer clic en un elemento" },
        { id: "envio", label: "Enviar un formulario" },
        { id: "tecla", label: "Presionar una tecla" },
        { id: "escribir", label: "Escribir en un campo de texto" },
        { id: "mouse", label: "Pasar el mouse sobre un elemento" },
      ],
      validation: { type: "exact", answer: { d1: "clic", d2: "envio", d3: "tecla", d4: "escribir", d5: "mouse" } },
      hint: "Los nombres de los eventos describen la accion en ingles.",
      explanation: "click = clic, submit = envio, keydown = tecla, input = escribir, mouseover = mouse encima.",
    },
    {
      id: "js13-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "¿Que es la delegacion de eventos?",
      options: [
        { id: "a", text: "Pasar un evento de un elemento a otro manualmente", isCorrect: false },
        { id: "b", text: "Colocar un listener en el padre y usar event.target para detectar clicks en los hijos", isCorrect: true },
        { id: "c", text: "Delegar la creacion de eventos al navegador", isCorrect: false },
        { id: "d", text: "Usar setTimeout para ejecutar eventos despues", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un patron que aprovecha la propagacion (bubbling) de eventos.",
      explanation: "La delegacion usa un listener en el padre y `event.target` para saber cual hijo recibio el evento.",
    },
    {
      id: "js13-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Usa delegacion de eventos: agrega un solo listener al contenedor de botones que detecte clicks y muestre el texto del boton clickeado en el div resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div id="contenedor">
    <button class="opcion">Opcion A</button>
    <button class="opcion">Opcion B</button>
    <button class="opcion">Opcion C</button>
  </div>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
// Usa delegacion: un solo listener en #contenedor


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "e.target" },
      hint: "Agrega addEventListener al contenedor y usa e.target.matches('.opcion') para verificar.",
      explanation: "Un listener en el contenedor con `e.target.matches('.opcion')` detecta clicks en cualquier boton hijo.",
    },
    {
      id: "js13-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt: "Crea un input que en tiempo real muestre cuantos caracteres se han escrito, usando el evento 'input'.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <input id="texto" type="text" placeholder="Escribe algo..." style="padding: 8px; font-size: 16px; width: 100%; box-sizing: border-box;">
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
// Escucha el evento input y muestra la cantidad de caracteres


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "addEventListener" },
      hint: "Usa el evento 'input' y e.target.value.length para contar caracteres.",
      explanation: "Con `addEventListener('input', ...)` y `e.target.value.length` muestras el conteo en tiempo real.",
    },
  ],
};
