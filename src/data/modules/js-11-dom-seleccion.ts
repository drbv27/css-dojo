import type { ModuleData } from "@/types";

export const jsDomSeleccionModule: ModuleData = {
  slug: "js-dom-seleccion",
  title: "DOM: Seleccion de Elementos",
  description:
    "Aprende a seleccionar elementos HTML desde JavaScript usando getElementById, querySelector y mas.",
  order: 111,
  category: "js-intermediate",
  icon: "MousePointer",
  dojo: "js",
  lessons: [
    {
      id: "js11-leccion-01",
      title: "Que es el DOM?",
      content: `## El DOM (Document Object Model)

El **DOM** es la representacion en forma de arbol de un documento HTML. JavaScript puede leer y modificar este arbol.

### Estructura del DOM

\`\`\`
document
  └── html
       ├── head
       │    └── title
       └── body
            ├── h1
            ├── p
            └── div
\`\`\`

### El objeto document

\`document\` es el punto de entrada al DOM. Desde el puedes acceder a cualquier elemento:

\`\`\`javascript
document.title         // titulo de la pagina
document.body          // elemento <body>
document.head          // elemento <head>
document.documentElement // elemento <html>
\`\`\`

### Por que es importante?

Sin el DOM, JavaScript no podria:
- Cambiar el contenido de la pagina
- Responder a clicks y otros eventos
- Crear elementos dinamicamente
- Modificar estilos

> El DOM es el puente entre HTML y JavaScript.`,
      codeExample: {
        html: '<h2 id="titulo">Hola DOM</h2>\n<p class="texto">Parrafo 1</p>\n<p class="texto">Parrafo 2</p>\n<div id="resultado"></div>',
        css: '#titulo { color: #cba6f7; } .texto { color: #a6adc8; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `const salida = [];
salida.push("Titulo del documento: " + document.title);
salida.push("Elemento h2: " + document.getElementById("titulo").textContent);
salida.push("Parrafos con clase 'texto': " + document.getElementsByClassName("texto").length);
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js11-leccion-02",
      title: "Metodos de seleccion",
      content: `## Metodos de seleccion de elementos

### getElementById()
Selecciona UN elemento por su atributo id:
\`\`\`javascript
const titulo = document.getElementById("titulo");
\`\`\`

### querySelector()
Selecciona el PRIMER elemento que coincida con un selector CSS:
\`\`\`javascript
const parrafo = document.querySelector("p");
const clase = document.querySelector(".mi-clase");
const id = document.querySelector("#mi-id");
\`\`\`

### querySelectorAll()
Selecciona TODOS los elementos que coincidan (devuelve NodeList):
\`\`\`javascript
const parrafos = document.querySelectorAll("p");
const items = document.querySelectorAll(".item");
\`\`\`

### getElementsByClassName() / getElementsByTagName()
Devuelven HTMLCollection (coleccion viva):
\`\`\`javascript
const clases = document.getElementsByClassName("item");
const divs = document.getElementsByTagName("div");
\`\`\`

> **Recomendacion:** Usa \`querySelector\` y \`querySelectorAll\` en codigo moderno. Son mas flexibles y aceptan cualquier selector CSS.`,
      codeExample: {
        html: '<ul id="lista">\n  <li class="item">Elemento 1</li>\n  <li class="item activo">Elemento 2</li>\n  <li class="item">Elemento 3</li>\n</ul>\n<div id="resultado"></div>',
        css: '.item { padding: 4px 0; color: #cdd6f4; } .activo { color: #a6e3a1; font-weight: bold; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `const salida = [];

// getElementById
const lista = document.getElementById("lista");
salida.push("Lista encontrada: " + (lista !== null));

// querySelector
const primerItem = document.querySelector(".item");
salida.push("Primer item: " + primerItem.textContent);

// querySelector con selector complejo
const activo = document.querySelector(".item.activo");
salida.push("Item activo: " + activo.textContent);

// querySelectorAll
const todosItems = document.querySelectorAll(".item");
salida.push("Total items: " + todosItems.length);

todosItems.forEach(function(item, i) {
  salida.push("  [" + i + "] " + item.textContent);
});

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js11-leccion-03",
      title: "Navegacion por el DOM",
      content: `## Navegacion por el DOM

Desde cualquier elemento puedes navegar a sus parientes:

### Nodos padre
\`\`\`javascript
elemento.parentNode      // nodo padre
elemento.parentElement   // elemento padre
\`\`\`

### Nodos hijos
\`\`\`javascript
elemento.children          // hijos (solo elementos)
elemento.childNodes        // hijos (incluye texto)
elemento.firstElementChild // primer hijo elemento
elemento.lastElementChild  // ultimo hijo elemento
\`\`\`

### Hermanos
\`\`\`javascript
elemento.nextElementSibling     // hermano siguiente
elemento.previousElementSibling // hermano anterior
\`\`\`

### Buscar dentro de un elemento
\`\`\`javascript
const contenedor = document.getElementById("app");
const btn = contenedor.querySelector("button"); // busca SOLO dentro del contenedor
\`\`\`

> **Tip:** Usa \`children\` en vez de \`childNodes\` para evitar nodos de texto vacios.`,
      codeExample: {
        html: '<div id="contenedor">\n  <h3>Titulo</h3>\n  <p id="parrafo">Texto del parrafo</p>\n  <span>Un span</span>\n</div>\n<div id="resultado"></div>',
        css: '#contenedor { padding: 8px; border: 1px solid #45475a; border-radius: 8px; color: #cdd6f4; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `const parrafo = document.getElementById("parrafo");
const contenedor = document.getElementById("contenedor");
const salida = [];

salida.push("Padre: " + parrafo.parentElement.id);
salida.push("Hermano anterior: " + parrafo.previousElementSibling.tagName);
salida.push("Hermano siguiente: " + parrafo.nextElementSibling.tagName);

salida.push("--- Hijos del contenedor ---");
var hijos = contenedor.children;
for (var i = 0; i < hijos.length; i++) {
  salida.push("  " + hijos[i].tagName + ": " + hijos[i].textContent);
}

salida.push("Primer hijo: " + contenedor.firstElementChild.tagName);
salida.push("Ultimo hijo: " + contenedor.lastElementChild.tagName);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js11-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que metodo selecciona un elemento por su atributo id?",
      options: [
        { id: "a", text: "document.querySelector()", isCorrect: false },
        { id: "b", text: "document.getElementById()", isCorrect: true },
        { id: "c", text: "document.getElement()", isCorrect: false },
        { id: "d", text: "document.findById()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre del metodo incluye 'ById'.",
      explanation: "document.getElementById() selecciona un unico elemento por su atributo id.",
    },
    {
      id: "js11-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo es recomendado para seleccionar elementos en codigo moderno?",
      options: [
        { id: "a", text: "getElementsByTagName()", isCorrect: false },
        { id: "b", text: "getElementsByClassName()", isCorrect: false },
        { id: "c", text: "querySelector() / querySelectorAll()", isCorrect: true },
        { id: "d", text: "getElementById() solamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Acepta cualquier selector CSS.",
      explanation: "querySelector y querySelectorAll son los metodos recomendados porque aceptan cualquier selector CSS valido.",
    },
    {
      id: "js11-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: 'Completa para seleccionar el primer elemento con clase "btn":',
      codeTemplate: {
        html: "",
        cssPrefix: "const boton = document.",
        cssSuffix: '(".btn");',
        blanks: ["querySelector"],
      },
      validation: { type: "exact", answer: "querySelector" },
      hint: "Selecciona el primer elemento que coincida con un selector CSS.",
      explanation: 'querySelector(".btn") selecciona el primer elemento con la clase btn.',
    },
    {
      id: "js11-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que devuelve querySelectorAll() si no encuentra ningun elemento?",
      options: [
        { id: "a", text: "null", isCorrect: false },
        { id: "b", text: "undefined", isCorrect: false },
        { id: "c", text: "Un NodeList vacio", isCorrect: true },
        { id: "d", text: "Un error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Siempre devuelve una lista, aunque este vacia.",
      explanation: "querySelectorAll() siempre devuelve un NodeList. Si no hay coincidencias, sera un NodeList vacio con length 0.",
    },
    {
      id: "js11-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que propiedad accede al elemento padre de un nodo?",
      options: [
        { id: "a", text: "parentElement", isCorrect: true },
        { id: "b", text: "parent", isCorrect: false },
        { id: "c", text: "father", isCorrect: false },
        { id: "d", text: "container", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "parent = padre, Element = elemento.",
      explanation: "parentElement devuelve el elemento padre del nodo actual.",
    },
    {
      id: "js11-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: 'Cual es la diferencia entre querySelector("#id") y getElementById("id")?',
      options: [
        { id: "a", text: "querySelector es mas rapido", isCorrect: false },
        { id: "b", text: "getElementById no acepta selectores CSS, querySelector si", isCorrect: true },
        { id: "c", text: "No hay diferencia", isCorrect: false },
        { id: "d", text: "getElementById devuelve un array", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "querySelector acepta cualquier selector CSS valido.",
      explanation: "querySelector acepta cualquier selector CSS (#id, .clase, div > p, etc.) mientras que getElementById solo acepta un id sin el #.",
    },
  ],
};
