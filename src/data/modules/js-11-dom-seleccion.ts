import type { ModuleData } from "@/types";

export const jsDomSeleccionModule: ModuleData = {
  slug: "js-dom-seleccion",
  title: "Seleccion de Elementos del DOM",
  description:
    "Aprende a seleccionar elementos del DOM con getElementById, querySelector, querySelectorAll y a navegar entre nodos padres, hijos y hermanos.",
  order: 111,
  dojo: "js",
  category: "js-intermediate",
  icon: "search",
  lessons: [
    {
      id: "js11-leccion-01",
      title: "¿Que es el DOM?",
      content: `## ¿Que es el DOM?

El **DOM** (Document Object Model) es la representacion en forma de arbol de todo el documento HTML. JavaScript puede leer y modificar este arbol para hacer paginas interactivas.

### La estructura del arbol

\`\`\`
document
  └── html
      ├── head
      │   └── title
      └── body
          ├── h1
          ├── p
          └── div
              └── span
\`\`\`

Cada etiqueta HTML se convierte en un **nodo** del arbol. JavaScript accede a estos nodos a traves del objeto \`document\`.

### getElementById

Selecciona un elemento por su atributo \`id\`. Retorna **un solo elemento** o \`null\`.

\`\`\`javascript
const titulo = document.getElementById("titulo-principal");
console.log(titulo.textContent); // El texto del elemento
\`\`\`

### getElementsByClassName

Retorna una **coleccion viva** (HTMLCollection) de todos los elementos con esa clase.

\`\`\`javascript
const items = document.getElementsByClassName("item");
console.log(items.length); // Cantidad de elementos con clase "item"
\`\`\`

> **Nota:** Las HTMLCollections no tienen metodos de array como \`forEach\`. Puedes convertirlas con \`Array.from()\`.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3 id="titulo">Seleccion del DOM</h3>
  <p class="info">Primer parrafo</p>
  <p class="info">Segundo parrafo</p>
  <div id="resultado"></div>
</div>
<script>
const titulo = document.getElementById("titulo");
const infos = document.getElementsByClassName("info");
document.getElementById("resultado").textContent =
  "Titulo: " + titulo.textContent + " | Parrafos: " + infos.length;
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js11-leccion-02",
      title: "querySelector y querySelectorAll",
      content: `## querySelector y querySelectorAll

Estos son los metodos mas modernos y versatiles para seleccionar elementos.

### querySelector

Retorna el **primer** elemento que coincide con el selector CSS.

\`\`\`javascript
// Por ID
const titulo = document.querySelector("#titulo");

// Por clase
const primerItem = document.querySelector(".item");

// Por etiqueta
const primerP = document.querySelector("p");

// Selectores complejos
const link = document.querySelector("nav a.activo");
\`\`\`

### querySelectorAll

Retorna una **NodeList** con todos los elementos que coinciden. A diferencia de HTMLCollection, NodeList **si tiene forEach**.

\`\`\`javascript
const items = document.querySelectorAll(".item");
items.forEach(item => {
  console.log(item.textContent);
});
\`\`\`

### querySelector vs getElementById

| Caracteristica | getElementById | querySelector |
|---------------|---------------|--------------|
| Sintaxis | Solo ID | Cualquier selector CSS |
| Retorna | Elemento o null | Elemento o null |
| Velocidad | Ligeramente mas rapido | Muy flexible |

\`\`\`javascript
// Equivalentes
document.getElementById("titulo");
document.querySelector("#titulo");
\`\`\`

> **Recomendacion:** Usa \`querySelector\` y \`querySelectorAll\` en la mayoria de los casos por su flexibilidad.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <ul id="lista">
    <li class="item">Manzana</li>
    <li class="item destacado">Banana</li>
    <li class="item">Naranja</li>
  </ul>
  <div id="resultado"></div>
</div>
<script>
const destacado = document.querySelector(".item.destacado");
const todos = document.querySelectorAll(".item");
document.getElementById("resultado").textContent =
  "Destacado: " + destacado.textContent + " | Total items: " + todos.length;
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js11-leccion-03",
      title: "Navegacion por el DOM",
      content: `## Navegacion por el DOM

Una vez que tienes un elemento, puedes navegar a sus parientes: padres, hijos y hermanos.

### Propiedades de navegacion

\`\`\`javascript
const lista = document.querySelector("ul");

// Hijos
lista.children;              // HTMLCollection de hijos elemento
lista.firstElementChild;     // Primer hijo elemento
lista.lastElementChild;      // Ultimo hijo elemento
lista.childElementCount;     // Cantidad de hijos

// Padre
lista.parentElement;         // Elemento padre

// Hermanos
const item = document.querySelector("li");
item.nextElementSibling;     // Siguiente hermano elemento
item.previousElementSibling; // Hermano anterior elemento
\`\`\`

### closest()

Busca el ancestro mas cercano que coincida con un selector (incluyendo el propio elemento):

\`\`\`javascript
const span = document.querySelector("span");
const contenedor = span.closest(".contenedor");
// Sube por el arbol hasta encontrar un elemento con clase "contenedor"
\`\`\`

### Ejemplo practico

\`\`\`javascript
const items = document.querySelectorAll("li");
items.forEach(item => {
  console.log("Texto:", item.textContent);
  console.log("Padre:", item.parentElement.tagName);
  console.log("Siguiente:", item.nextElementSibling?.textContent);
});
\`\`\`

> **Tip:** Usa \`?.\` (optional chaining) al navegar porque el hermano o padre podria no existir.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div id="contenedor">
    <p id="primero">Parrafo 1</p>
    <p id="segundo">Parrafo 2</p>
    <p id="tercero">Parrafo 3</p>
  </div>
  <div id="resultado"></div>
</div>
<script>
const segundo = document.getElementById("segundo");
const padre = segundo.parentElement.id;
const anterior = segundo.previousElementSibling.textContent;
const siguiente = segundo.nextElementSibling.textContent;
document.getElementById("resultado").textContent =
  "Padre: " + padre + " | Anterior: " + anterior + " | Siguiente: " + siguiente;
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js11-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Que metodo selecciona un solo elemento por su atributo ID?",
      options: [
        { id: "a", text: "document.querySelector()", isCorrect: false },
        { id: "b", text: "document.getElementById()", isCorrect: true },
        { id: "c", text: "document.querySelectorAll()", isCorrect: false },
        { id: "d", text: "document.getElementsByClassName()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre del metodo indica que busca por Id.",
      explanation: "`getElementById` selecciona un elemento unico por su atributo id.",
    },
    {
      id: "js11-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Selecciona el elemento con id \"titulo\" usando querySelector.",
      codeTemplate: {
        html: "",
        cssPrefix: "const titulo = document.",
        cssSuffix: ";\nconsole.log(titulo.textContent);",
        blanks: ['querySelector("#titulo")'],
      },
      validation: { type: "regex", answer: "querySelector\\s*\\(\\s*[\"']#titulo[\"']\\s*\\)" },
      hint: "querySelector usa selectores CSS, y en CSS el id se indica con #.",
      explanation: '`document.querySelector("#titulo")` selecciona el elemento con id="titulo".',
    },
    {
      id: "js11-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "¿Que diferencia hay entre `querySelector` y `querySelectorAll`?",
      options: [
        { id: "a", text: "querySelector retorna el primer elemento, querySelectorAll retorna todos los que coinciden", isCorrect: true },
        { id: "b", text: "querySelector es mas rapido pero menos preciso", isCorrect: false },
        { id: "c", text: "querySelectorAll solo funciona con clases", isCorrect: false },
        { id: "d", text: "No hay diferencia, son alias", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Piensa en el significado de 'All' en el nombre.",
      explanation: "`querySelector` retorna el primer match, `querySelectorAll` retorna una NodeList con todos.",
    },
    {
      id: "js11-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Selecciona todos los elementos con la clase \"item\" y recorrelos con forEach.",
      codeTemplate: {
        html: "",
        cssPrefix: "const items = document.",
        cssSuffix: ";\nitems.forEach(item => console.log(item.textContent));",
        blanks: ['querySelectorAll(".item")'],
      },
      validation: { type: "regex", answer: "querySelectorAll\\s*\\(\\s*[\"']\\.item[\"']\\s*\\)" },
      hint: "Usa querySelectorAll con el selector CSS de clase (punto).",
      explanation: '`querySelectorAll(".item")` selecciona todos los elementos con class="item".',
    },
    {
      id: "js11-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Relaciona cada propiedad de navegacion con lo que retorna.",
      dragItems: [
        { id: "d1", content: "parentElement", correctZone: "padre" },
        { id: "d2", content: "children", correctZone: "hijos" },
        { id: "d3", content: "nextElementSibling", correctZone: "hermano" },
        { id: "d4", content: "firstElementChild", correctZone: "primerhijo" },
      ],
      dropZones: [
        { id: "padre", label: "El elemento padre" },
        { id: "hijos", label: "Coleccion de hijos" },
        { id: "hermano", label: "Siguiente hermano" },
        { id: "primerhijo", label: "Primer hijo" },
      ],
      validation: { type: "exact", answer: { d1: "padre", d2: "hijos", d3: "hermano", d4: "primerhijo" } },
      hint: "Los nombres en ingles describen exactamente lo que retornan.",
      explanation: "parentElement sube, children lista hijos, nextElementSibling es el hermano siguiente, firstElementChild es el primer hijo.",
    },
    {
      id: "js11-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 6,
      prompt: "Selecciona todos los elementos `li` de la lista y muestra la cantidad en el div resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <ul id="mi-lista">
    <li>Elemento 1</li>
    <li>Elemento 2</li>
    <li>Elemento 3</li>
    <li>Elemento 4</li>
  </ul>
  <div id="resultado"></div>
</div>
<script>
// Selecciona todos los li y muestra la cantidad en #resultado


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "querySelectorAll" },
      hint: "Usa querySelectorAll para seleccionar todos los li y luego .length para contar.",
      explanation: 'Usa `document.querySelectorAll("li")` y muestra `.length` en el div resultado.',
    },
    {
      id: "js11-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Navega el DOM: selecciona el segundo parrafo por su id, y muestra en el div resultado el texto de su hermano anterior y su hermano siguiente.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div id="contenedor">
    <p>Primer parrafo</p>
    <p id="medio">Segundo parrafo</p>
    <p>Tercer parrafo</p>
  </div>
  <div id="resultado"></div>
</div>
<script>
// Selecciona el parrafo del medio y muestra los textos de sus hermanos


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "Sibling" },
      hint: "Usa previousElementSibling y nextElementSibling para acceder a los hermanos.",
      explanation: "Con `previousElementSibling.textContent` y `nextElementSibling.textContent` accedes a los textos de los hermanos.",
    },
  ],
};
