import type { ModuleData } from "@/types";

export const jsDomEstilosModule: ModuleData = {
  slug: "js-dom-estilos",
  title: "DOM: Estilos Dinamicos",
  description:
    "Aprende a modificar estilos CSS desde JavaScript: style, classList, CSS variables y animaciones.",
  order: 114,
  category: "js-intermediate",
  icon: "Palette",
  dojo: "js",
  lessons: [
    {
      id: "js14-leccion-01",
      title: "Propiedad style",
      content: `## Modificar estilos con JavaScript

### La propiedad style

Permite cambiar estilos en linea de un elemento:

\`\`\`javascript
elemento.style.color = "red";
elemento.style.backgroundColor = "#333"; // camelCase!
elemento.style.fontSize = "20px";
elemento.style.display = "none";
\`\`\`

### Reglas de nombres
Las propiedades CSS con guiones se convierten a **camelCase**:
- \`background-color\` → \`backgroundColor\`
- \`font-size\` → \`fontSize\`
- \`border-radius\` → \`borderRadius\`
- \`z-index\` → \`zIndex\`

### Leer estilos computados

\`style\` solo lee estilos en linea. Para leer estilos aplicados por CSS:

\`\`\`javascript
const estilos = window.getComputedStyle(elemento);
estilos.color       // "rgb(255, 0, 0)"
estilos.fontSize    // "16px"
\`\`\`

> **Tip:** Prefiere usar classList para agregar/quitar clases en vez de modificar estilos directamente. Es mas mantenible.`,
      codeExample: {
        html: '<div id="caja">Caja con estilos dinamicos</div>\n<button id="btn">Cambiar estilos</button>\n<div id="resultado"></div>',
        css: '#caja { padding: 20px; background: #313244; color: #cdd6f4; border-radius: 8px; text-align: center; transition: all 0.3s; } #btn { margin: 8px 0; padding: 6px 12px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `var caja = document.getElementById("caja");
var btn = document.getElementById("btn");
var toggle = false;

btn.addEventListener("click", function() {
  toggle = !toggle;
  if (toggle) {
    caja.style.backgroundColor = "#a6e3a1";
    caja.style.color = "#1e1e2e";
    caja.style.borderRadius = "50px";
    caja.style.fontSize = "20px";
  } else {
    caja.style.backgroundColor = "#313244";
    caja.style.color = "#cdd6f4";
    caja.style.borderRadius = "8px";
    caja.style.fontSize = "16px";
  }

  var computado = window.getComputedStyle(caja);
  document.getElementById("resultado").textContent = "Background: " + computado.backgroundColor + "\\nBorder-radius: " + computado.borderRadius;
});`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js14-leccion-02",
      title: "CSS Variables desde JavaScript",
      content: `## CSS Variables (Custom Properties)

Puedes leer y modificar variables CSS desde JavaScript:

### Definir en CSS
\`\`\`css
:root {
  --color-primario: #89b4fa;
  --tamano: 16px;
}
\`\`\`

### Leer desde JavaScript
\`\`\`javascript
const root = document.documentElement;
const valor = getComputedStyle(root)
  .getPropertyValue("--color-primario");
\`\`\`

### Modificar desde JavaScript
\`\`\`javascript
root.style.setProperty("--color-primario", "#f38ba8");
root.style.setProperty("--tamano", "20px");
\`\`\`

### Ventajas
- Cambias UN valor y afecta a TODOS los elementos que lo usen
- Ideal para temas (dark/light mode)
- Mas mantenible que cambiar estilos individuales

> Las CSS variables son el puente perfecto entre CSS y JavaScript para temas dinamicos.`,
      codeExample: {
        html: '<div id="demo">\n  <h3>CSS Variables + JS</h3>\n  <p>El color y tamano cambian con variables CSS.</p>\n</div>\n<button id="tema1">Tema Azul</button>\n<button id="tema2">Tema Rosa</button>\n<div id="resultado"></div>',
        css: '#demo { --color-tema: #89b4fa; --bg-tema: #1e1e2e; padding: 16px; background: var(--bg-tema); color: var(--color-tema); border-radius: 8px; border: 2px solid var(--color-tema); transition: all 0.3s; } button { margin: 4px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; } #tema1 { background: #89b4fa; color: #1e1e2e; } #tema2 { background: #f5c2e7; color: #1e1e2e; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var demo = document.getElementById("demo");

document.getElementById("tema1").addEventListener("click", function() {
  demo.style.setProperty("--color-tema", "#89b4fa");
  demo.style.setProperty("--bg-tema", "#1e1e2e");
  mostrarInfo();
});

document.getElementById("tema2").addEventListener("click", function() {
  demo.style.setProperty("--color-tema", "#f5c2e7");
  demo.style.setProperty("--bg-tema", "#2a2040");
  mostrarInfo();
});

function mostrarInfo() {
  var estilos = getComputedStyle(demo);
  document.getElementById("resultado").textContent =
    "--color-tema: " + estilos.getPropertyValue("--color-tema").trim() +
    "\\n--bg-tema: " + estilos.getPropertyValue("--bg-tema").trim();
}
mostrarInfo();`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js14-leccion-03",
      title: "Clases CSS dinamicas",
      content: `## Patrones comunes con classList

### Toggle de clases (mostrar/ocultar)
\`\`\`javascript
boton.addEventListener("click", function() {
  menu.classList.toggle("abierto");
});
\`\`\`

### Tabs activos
\`\`\`javascript
tabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    // Quitar activo de todos
    tabs.forEach(function(t) { t.classList.remove("activo"); });
    // Agregar al clickeado
    tab.classList.add("activo");
  });
});
\`\`\`

### Dark/Light mode
\`\`\`javascript
toggle.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
});
\`\`\`

### Agregar clases con condiciones
\`\`\`javascript
if (valor > 0) {
  elemento.classList.add("positivo");
  elemento.classList.remove("negativo");
} else {
  elemento.classList.add("negativo");
  elemento.classList.remove("positivo");
}
\`\`\`

> **Patron:** Define estilos en CSS con clases y usa JS solo para agregar/quitar esas clases. Separacion de responsabilidades.`,
      codeExample: {
        html: '<div class="tabs">\n  <button class="tab activo" data-tab="1">Tab 1</button>\n  <button class="tab" data-tab="2">Tab 2</button>\n  <button class="tab" data-tab="3">Tab 3</button>\n</div>\n<div id="contenido">Contenido del Tab 1</div>\n<div id="resultado"></div>',
        css: '.tabs { display: flex; gap: 4px; } .tab { padding: 8px 16px; border: none; background: #313244; color: #a6adc8; border-radius: 4px 4px 0 0; cursor: pointer; } .tab.activo { background: #89b4fa; color: #1e1e2e; } #contenido { padding: 16px; background: #313244; color: #cdd6f4; border-radius: 0 8px 8px 8px; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `var tabs = document.querySelectorAll(".tab");
var contenido = document.getElementById("contenido");
var textos = {
  "1": "Contenido del Tab 1: Introduccion",
  "2": "Contenido del Tab 2: Desarrollo",
  "3": "Contenido del Tab 3: Conclusion"
};

tabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    tabs.forEach(function(t) { t.classList.remove("activo"); });
    tab.classList.add("activo");
    var numTab = tab.dataset.tab;
    contenido.textContent = textos[numTab];
    document.getElementById("resultado").textContent = "Tab activo: " + numTab + "\\nClases del boton: " + tab.className;
  });
});`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js14-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Como se escribe la propiedad CSS 'background-color' en JavaScript?",
      options: [
        { id: "a", text: "background-color", isCorrect: false },
        { id: "b", text: "backgroundColor", isCorrect: true },
        { id: "c", text: "BackgroundColor", isCorrect: false },
        { id: "d", text: "backgroundcolor", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las propiedades CSS con guion se convierten a camelCase.",
      explanation: "En JavaScript, background-color se escribe como backgroundColor (camelCase, quitando el guion).",
    },
    {
      id: "js14-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo se usa para leer los estilos computados de un elemento?",
      options: [
        { id: "a", text: "elemento.style", isCorrect: false },
        { id: "b", text: "elemento.getStyles()", isCorrect: false },
        { id: "c", text: "window.getComputedStyle(elemento)", isCorrect: true },
        { id: "d", text: "elemento.computedStyle", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es un metodo de window, no del elemento.",
      explanation: "getComputedStyle() devuelve todos los estilos aplicados al elemento, incluyendo los de las hojas de estilo.",
    },
    {
      id: "js14-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa para cambiar el color de fondo de un elemento:",
      codeTemplate: {
        html: "",
        cssPrefix: "elemento.style.",
        cssSuffix: ' = "#ff0000";',
        blanks: ["backgroundColor"],
      },
      validation: { type: "exact", answer: "backgroundColor" },
      hint: "background-color en camelCase.",
      explanation: "elemento.style.backgroundColor cambia el color de fondo del elemento.",
    },
    {
      id: "js14-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Como modificas una CSS variable desde JavaScript?",
      options: [
        { id: "a", text: 'element.style.setVariable("--color", "red")', isCorrect: false },
        { id: "b", text: 'element.style.setProperty("--color", "red")', isCorrect: true },
        { id: "c", text: 'element.setCSSVar("--color", "red")', isCorrect: false },
        { id: "d", text: 'element.style["--color"] = "red"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El metodo usa 'set' y 'Property'.",
      explanation: "setProperty() permite establecer cualquier propiedad CSS, incluyendo custom properties (variables CSS).",
    },
    {
      id: "js14-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que es mejor practica: modificar estilos directamente o usar classList?",
      options: [
        { id: "a", text: "Modificar estilos directamente con style", isCorrect: false },
        { id: "b", text: "Usar classList para agregar/quitar clases CSS", isCorrect: true },
        { id: "c", text: "Usar innerHTML para cambiar estilos", isCorrect: false },
        { id: "d", text: "No hay diferencia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Separacion de responsabilidades: CSS para estilos, JS para logica.",
      explanation: "Usar classList mantiene la separacion de responsabilidades. Los estilos se definen en CSS y JS solo controla que clases se aplican.",
    },
    {
      id: "js14-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Que devuelve elemento.style.color si el color fue definido en una hoja de estilos externa?",
      options: [
        { id: "a", text: "El color definido en CSS", isCorrect: false },
        { id: "b", text: 'Un string vacio ""', isCorrect: true },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "null", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "element.style solo lee estilos en linea.",
      explanation: 'element.style solo lee estilos en linea (inline). Para leer estilos de CSS externo, usa getComputedStyle().',
    },
  ],
};
