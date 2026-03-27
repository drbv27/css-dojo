import type { ModuleData } from "@/types";

export const jsDomEstilosModule: ModuleData = {
  slug: "js-dom-estilos",
  title: "Estilos y Clases desde JS",
  description:
    "Aprende a manipular estilos CSS desde JavaScript: element.style, classList, getComputedStyle, variables CSS y tematizacion dinamica.",
  order: 114,
  dojo: "js",
  category: "js-intermediate",
  icon: "paintbrush",
  lessons: [
    {
      id: "js14-leccion-01",
      title: "element.style y estilos en linea",
      content: `## element.style y estilos en linea

La propiedad \`style\` de un elemento permite leer y establecer estilos en linea directamente desde JavaScript.

### Establecer estilos

\`\`\`javascript
const caja = document.querySelector(".caja");

caja.style.backgroundColor = "steelblue";
caja.style.color = "white";
caja.style.padding = "20px";
caja.style.borderRadius = "8px";
\`\`\`

### Nombres en camelCase

Las propiedades CSS con guion se escriben en **camelCase** en JavaScript:

| CSS | JavaScript |
|-----|-----------|
| \`background-color\` | \`backgroundColor\` |
| \`font-size\` | \`fontSize\` |
| \`border-radius\` | \`borderRadius\` |
| \`z-index\` | \`zIndex\` |

### Leer estilos en linea

\`\`\`javascript
console.log(caja.style.backgroundColor); // "steelblue"
\`\`\`

### Establecer multiples estilos con cssText

\`\`\`javascript
caja.style.cssText = "background: red; color: white; padding: 10px;";
\`\`\`

> **Importante:** \`element.style\` solo lee estilos en linea. No lee estilos aplicados via clases CSS o hojas de estilo externas.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div id="caja" style="padding: 20px; border: 2px solid #ccc;">Caja de ejemplo</div>
  <button id="btn" style="margin-top: 12px; padding: 8px 16px; cursor: pointer;">Cambiar estilos</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("btn").addEventListener("click", () => {
  const caja = document.getElementById("caja");
  caja.style.backgroundColor = "steelblue";
  caja.style.color = "white";
  caja.style.borderRadius = "12px";
  caja.style.padding = "24px";
  document.getElementById("resultado").textContent = "Estilos aplicados!";
});
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js14-leccion-02",
      title: "classList: agregar, quitar y alternar clases",
      content: `## classList: agregar, quitar y alternar clases

En lugar de manipular estilos en linea, lo ideal es **usar clases CSS** y alternarlas desde JavaScript.

### classList.add

\`\`\`javascript
const boton = document.querySelector(".btn");
boton.classList.add("activo");
boton.classList.add("grande", "destacado"); // Multiples clases
\`\`\`

### classList.remove

\`\`\`javascript
boton.classList.remove("activo");
boton.classList.remove("grande", "destacado");
\`\`\`

### classList.toggle

Agrega la clase si no existe, la quita si ya existe:

\`\`\`javascript
boton.classList.toggle("activo");
// Si tenia "activo", la quita. Si no la tenia, la agrega.
\`\`\`

### classList.contains

Verifica si un elemento tiene una clase:

\`\`\`javascript
if (boton.classList.contains("activo")) {
  console.log("El boton esta activo");
}
\`\`\`

### classList.replace

Reemplaza una clase por otra:

\`\`\`javascript
boton.classList.replace("viejo", "nuevo");
\`\`\`

### ¿Por que classList es mejor que style?

1. **Separacion de responsabilidades**: los estilos van en CSS, la logica en JS
2. **Reutilizable**: las clases se aplican a multiples elementos
3. **Rendimiento**: el navegador optimiza mejor los cambios de clase
4. **Facil de mantener**: cambiar estilos en CSS sin tocar JS

> **Regla de oro:** Usa \`classList\` siempre que puedas. Usa \`style\` solo para valores dinamicos calculados.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <style>
    .tarjeta { padding: 20px; border: 2px solid #ddd; border-radius: 8px; transition: all 0.3s; }
    .tarjeta.activa { background-color: #4CAF50; color: white; border-color: #388E3C; }
  </style>
  <div id="tarjeta" class="tarjeta">Haz clic en el boton</div>
  <button id="btn" style="margin-top: 12px; padding: 8px 16px; cursor: pointer;">Toggle Activa</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("btn").addEventListener("click", () => {
  const tarjeta = document.getElementById("tarjeta");
  tarjeta.classList.toggle("activa");
  const estado = tarjeta.classList.contains("activa") ? "activa" : "inactiva";
  document.getElementById("resultado").textContent = "Estado: " + estado;
});
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js14-leccion-03",
      title: "getComputedStyle, variables CSS y tematizacion",
      content: `## getComputedStyle, variables CSS y tematizacion

### getComputedStyle

Lee los estilos **reales** computados de un elemento (incluyendo los de hojas de estilo):

\`\`\`javascript
const caja = document.querySelector(".caja");
const estilos = getComputedStyle(caja);
console.log(estilos.backgroundColor); // "rgb(70, 130, 180)"
console.log(estilos.fontSize);        // "16px"
\`\`\`

### Variables CSS desde JavaScript

Puedes leer y modificar variables CSS (\`--custom-properties\`) desde JS:

\`\`\`javascript
// Leer una variable CSS del root
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue("--color-primario");

// Cambiar una variable CSS
root.style.setProperty("--color-primario", "#ff5722");
\`\`\`

### Tematizacion dinamica

\`\`\`css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --primary: #4CAF50;
}
\`\`\`

\`\`\`javascript
function cambiarTema(oscuro) {
  const root = document.documentElement;
  if (oscuro) {
    root.style.setProperty("--bg-color", "#1a1a1a");
    root.style.setProperty("--text-color", "#f0f0f0");
    root.style.setProperty("--primary", "#66BB6A");
  } else {
    root.style.setProperty("--bg-color", "#ffffff");
    root.style.setProperty("--text-color", "#333333");
    root.style.setProperty("--primary", "#4CAF50");
  }
}
\`\`\`

> **Tip:** Las variables CSS son la base de la tematizacion moderna. Cambiar unas pocas variables puede transformar toda la apariencia de tu sitio.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <style>
    #demo {
      --mi-bg: #f0f0f0;
      --mi-color: #333;
      background: var(--mi-bg);
      color: var(--mi-color);
      padding: 20px;
      border-radius: 8px;
      transition: all 0.3s;
    }
  </style>
  <div id="demo">Contenido tematizado</div>
  <button id="toggle-tema" style="margin-top: 12px; padding: 8px 16px; cursor: pointer;">Cambiar tema</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
let oscuro = false;
document.getElementById("toggle-tema").addEventListener("click", () => {
  oscuro = !oscuro;
  const demo = document.getElementById("demo");
  demo.style.setProperty("--mi-bg", oscuro ? "#1a1a2e" : "#f0f0f0");
  demo.style.setProperty("--mi-color", oscuro ? "#eee" : "#333");
  document.getElementById("resultado").textContent = "Tema: " + (oscuro ? "oscuro" : "claro");
});
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js14-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Como se escribe la propiedad CSS `background-color` en JavaScript?",
      options: [
        { id: "a", text: 'element.style["background-color"]', isCorrect: false },
        { id: "b", text: "element.style.backgroundColor", isCorrect: true },
        { id: "c", text: "element.style.background_color", isCorrect: false },
        { id: "d", text: "element.css.backgroundColor", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En JavaScript las propiedades CSS con guion se convierten a camelCase.",
      explanation: "`background-color` se convierte a `backgroundColor` en JavaScript (camelCase).",
    },
    {
      id: "js14-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Agrega la clase 'activo' al elemento usando classList.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const elem = document.querySelector(".tarjeta");\nelem.classList.',
        cssSuffix: ";",
        blanks: ['add("activo")'],
      },
      validation: { type: "regex", answer: "add\\s*\\(\\s*[\"']activo[\"']\\s*\\)" },
      hint: "classList tiene un metodo para agregar clases.",
      explanation: '`classList.add("activo")` agrega la clase al elemento.',
    },
    {
      id: "js14-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "¿Que hace `classList.toggle('visible')`?",
      options: [
        { id: "a", text: "Siempre agrega la clase 'visible'", isCorrect: false },
        { id: "b", text: "Siempre elimina la clase 'visible'", isCorrect: false },
        { id: "c", text: "Agrega la clase si no existe, la quita si ya existe", isCorrect: true },
        { id: "d", text: "Verifica si la clase existe y retorna true/false", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Toggle en ingles significa alternar.",
      explanation: "`toggle` alterna la clase: la agrega si no esta, la quita si ya esta.",
    },
    {
      id: "js14-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Lee el valor computado del font-size del elemento.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const elem = document.querySelector(".texto");\nconst estilos = ',
        cssSuffix: ";\nconsole.log(estilos.fontSize);",
        blanks: ["getComputedStyle(elem)"],
      },
      validation: { type: "regex", answer: "getComputedStyle\\s*\\(\\s*elem\\s*\\)" },
      hint: "getComputedStyle recibe un elemento y retorna sus estilos calculados.",
      explanation: "`getComputedStyle(elem)` retorna todos los estilos computados del elemento.",
    },
    {
      id: "js14-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Relaciona cada metodo de classList con su funcion.",
      dragItems: [
        { id: "d1", content: "classList.add()", correctZone: "agregar" },
        { id: "d2", content: "classList.remove()", correctZone: "quitar" },
        { id: "d3", content: "classList.toggle()", correctZone: "alternar" },
        { id: "d4", content: "classList.contains()", correctZone: "verificar" },
      ],
      dropZones: [
        { id: "agregar", label: "Agregar una clase" },
        { id: "quitar", label: "Quitar una clase" },
        { id: "alternar", label: "Alternar una clase" },
        { id: "verificar", label: "Verificar si tiene una clase" },
      ],
      validation: { type: "exact", answer: { d1: "agregar", d2: "quitar", d3: "alternar", d4: "verificar" } },
      hint: "Los nombres de los metodos son descriptivos en ingles.",
      explanation: "add agrega, remove quita, toggle alterna, contains verifica si existe.",
    },
    {
      id: "js14-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Cambia la variable CSS `--color-primario` a rojo desde JavaScript.",
      codeTemplate: {
        html: "",
        cssPrefix: "const root = document.documentElement;\nroot.style.",
        cssSuffix: ";",
        blanks: ['setProperty("--color-primario", "red")'],
      },
      validation: { type: "regex", answer: "setProperty\\s*\\(\\s*[\"']--color-primario[\"']\\s*,\\s*[\"']red[\"']\\s*\\)" },
      hint: "Usa setProperty con el nombre de la variable CSS y el nuevo valor.",
      explanation: '`style.setProperty("--color-primario", "red")` cambia la variable CSS dinamicamente.',
    },
    {
      id: "js14-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Crea un boton que alterne entre tema claro y oscuro cambiando variables CSS del contenedor. Muestra el tema actual en el div resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <style>
    #contenedor {
      --bg: #f5f5f5;
      --texto: #333;
      background: var(--bg);
      color: var(--texto);
      padding: 20px;
      border-radius: 8px;
      transition: all 0.3s;
    }
  </style>
  <div id="contenedor">
    <p>Este contenido cambia de tema</p>
    <button id="btn-tema" style="padding: 8px 16px; cursor: pointer;">Cambiar tema</button>
  </div>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
// Implementa el toggle de tema usando variables CSS


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "setProperty" },
      hint: "Usa un flag booleano y setProperty para cambiar --bg y --texto.",
      explanation: "Alterna las variables CSS con setProperty al hacer clic, cambiando colores de fondo y texto.",
    },
  ],
};
