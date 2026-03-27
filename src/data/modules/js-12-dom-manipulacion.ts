import type { ModuleData } from "@/types";

export const jsDomManipulacionModule: ModuleData = {
  slug: "js-dom-manipulacion",
  title: "Manipulacion del DOM",
  description:
    "Aprende a modificar el contenido, crear y eliminar elementos, clonar nodos y trabajar con atributos HTML desde JavaScript.",
  order: 112,
  dojo: "js",
  category: "js-intermediate",
  icon: "edit",
  lessons: [
    {
      id: "js12-leccion-01",
      title: "textContent e innerHTML",
      content: `## textContent e innerHTML

Una vez que seleccionas un elemento del DOM, puedes leer o modificar su contenido.

### textContent

Lee o establece el **texto plano** de un elemento (sin HTML).

\`\`\`javascript
const titulo = document.querySelector("h1");

// Leer
console.log(titulo.textContent); // "Hola Mundo"

// Escribir
titulo.textContent = "Nuevo titulo";
\`\`\`

### innerHTML

Lee o establece el **contenido HTML** de un elemento.

\`\`\`javascript
const contenedor = document.querySelector("#info");

// Leer
console.log(contenedor.innerHTML); // "<p>Hola</p>"

// Escribir
contenedor.innerHTML = "<strong>Texto en negrita</strong>";
\`\`\`

### Diferencias importantes

| Propiedad | Interpreta HTML? | Seguridad |
|-----------|------------------|-----------|
| \`textContent\` | No, muestra texto plano | Seguro |
| \`innerHTML\` | Si, renderiza etiquetas | Riesgo de XSS |

\`\`\`javascript
const div = document.querySelector("#demo");

div.textContent = "<b>Hola</b>";
// Muestra: <b>Hola</b> (como texto)

div.innerHTML = "<b>Hola</b>";
// Muestra: **Hola** (renderizado en negrita)
\`\`\`

> **Advertencia:** Nunca uses \`innerHTML\` con datos del usuario sin sanitizarlos. Puede causar ataques XSS.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3 id="titulo">Titulo original</h3>
  <div id="contenido">Contenido original</div>
  <div id="resultado"></div>
</div>
<script>
document.getElementById("titulo").textContent = "Titulo modificado!";
document.getElementById("contenido").innerHTML = "<em>Contenido con <strong>HTML</strong></em>";
document.getElementById("resultado").textContent = "Elementos modificados con exito";
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js12-leccion-02",
      title: "Crear y agregar elementos",
      content: `## Crear y agregar elementos

JavaScript permite crear nuevos elementos y agregarlos al DOM de forma dinamica.

### createElement

\`\`\`javascript
const nuevoP = document.createElement("p");
nuevoP.textContent = "Soy un parrafo nuevo";
nuevoP.className = "destacado";
\`\`\`

### appendChild

Agrega un elemento como **ultimo hijo** de otro:

\`\`\`javascript
const contenedor = document.querySelector("#contenedor");
contenedor.appendChild(nuevoP);
\`\`\`

### insertBefore

Inserta un elemento **antes** de otro:

\`\`\`javascript
const referencia = document.querySelector("#segundo");
const nuevo = document.createElement("p");
nuevo.textContent = "Insertado antes del segundo";

contenedor.insertBefore(nuevo, referencia);
\`\`\`

### append y prepend (modernos)

\`\`\`javascript
// append agrega al final (acepta texto y elementos)
contenedor.append(nuevoElemento, "texto tambien");

// prepend agrega al inicio
contenedor.prepend(otroElemento);
\`\`\`

### Crear multiples elementos

\`\`\`javascript
const frutas = ["Manzana", "Banana", "Naranja"];
const lista = document.querySelector("ul");

frutas.forEach(fruta => {
  const li = document.createElement("li");
  li.textContent = fruta;
  lista.appendChild(li);
});
\`\`\`

> **Tip:** Para agregar muchos elementos, usa \`DocumentFragment\` para mejorar el rendimiento.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <ul id="lista"></ul>
  <div id="resultado"></div>
</div>
<script>
const colores = ["Rojo", "Verde", "Azul", "Amarillo"];
const lista = document.getElementById("lista");
colores.forEach(color => {
  const li = document.createElement("li");
  li.textContent = color;
  lista.appendChild(li);
});
document.getElementById("resultado").textContent = "Se crearon " + colores.length + " elementos";
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js12-leccion-03",
      title: "Eliminar y clonar elementos",
      content: `## Eliminar y clonar elementos

### remove()

Elimina un elemento del DOM directamente:

\`\`\`javascript
const elemento = document.querySelector("#obsoleto");
elemento.remove();
\`\`\`

### removeChild()

Elimina un hijo desde el padre:

\`\`\`javascript
const lista = document.querySelector("ul");
const primerItem = lista.firstElementChild;
lista.removeChild(primerItem);
\`\`\`

### replaceChild()

Reemplaza un hijo por otro:

\`\`\`javascript
const nuevo = document.createElement("li");
nuevo.textContent = "Reemplazo";
lista.replaceChild(nuevo, lista.lastElementChild);
\`\`\`

### cloneNode()

Crea una copia de un elemento:

\`\`\`javascript
const original = document.querySelector(".tarjeta");

// Copia superficial (sin hijos)
const copiaSimple = original.cloneNode(false);

// Copia profunda (con hijos)
const copiaProfunda = original.cloneNode(true);

document.body.appendChild(copiaProfunda);
\`\`\`

> **Importante:** \`cloneNode(true)\` copia el elemento con todos sus hijos. \`cloneNode(false)\` solo copia el elemento sin contenido.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <ul id="lista">
    <li>Item 1</li>
    <li>Item 2</li>
    <li id="clonable">Item para clonar</li>
  </ul>
  <div id="resultado"></div>
</div>
<script>
const lista = document.getElementById("lista");
const clon = document.getElementById("clonable").cloneNode(true);
clon.textContent = "Item clonado!";
lista.appendChild(clon);
document.getElementById("resultado").textContent = "Items totales: " + lista.children.length;
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
    {
      id: "js12-leccion-04",
      title: "Atributos HTML",
      content: `## Atributos HTML

JavaScript permite leer, establecer y eliminar atributos HTML de cualquier elemento.

### getAttribute y setAttribute

\`\`\`javascript
const link = document.querySelector("a");

// Leer un atributo
const url = link.getAttribute("href");
console.log(url); // "https://ejemplo.com"

// Establecer un atributo
link.setAttribute("target", "_blank");
link.setAttribute("title", "Visitar ejemplo");
\`\`\`

### removeAttribute

\`\`\`javascript
link.removeAttribute("title");
\`\`\`

### hasAttribute

\`\`\`javascript
if (link.hasAttribute("target")) {
  console.log("Tiene target");
}
\`\`\`

### Atributos como propiedades

Muchos atributos HTML son accesibles directamente como propiedades:

\`\`\`javascript
const img = document.querySelector("img");
img.src = "nueva-imagen.jpg";     // Equivale a setAttribute("src", ...)
img.alt = "Descripcion";
img.id = "mi-imagen";

const input = document.querySelector("input");
input.value = "Nuevo valor";
input.disabled = true;
input.checked = true;  // Para checkboxes
\`\`\`

### data-* (atributos personalizados)

\`\`\`javascript
// HTML: <div data-usuario-id="42" data-rol="admin">
const div = document.querySelector("[data-usuario-id]");

// Leer con dataset
console.log(div.dataset.usuarioId); // "42"
console.log(div.dataset.rol);       // "admin"

// Escribir
div.dataset.nuevo = "valor";
\`\`\`

> **Nota:** Los atributos \`data-*\` con guiones se convierten a camelCase en \`dataset\`.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <a id="enlace" href="https://ejemplo.com">Visitar</a>
  <br><br>
  <div id="datos" data-color="azul" data-tamano="grande"></div>
  <div id="resultado"></div>
</div>
<script>
const enlace = document.getElementById("enlace");
enlace.setAttribute("target", "_blank");
const datos = document.getElementById("datos");
const color = datos.dataset.color;
const tamano = datos.dataset.tamano;
document.getElementById("resultado").textContent =
  "Link target: " + enlace.getAttribute("target") + " | Color: " + color + " | Tamano: " + tamano;
</script>`,
        css: "",
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js12-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Cual es la diferencia entre `textContent` e `innerHTML`?",
      options: [
        { id: "a", text: "textContent es mas rapido, innerHTML mas lento", isCorrect: false },
        { id: "b", text: "textContent muestra texto plano, innerHTML interpreta etiquetas HTML", isCorrect: true },
        { id: "c", text: "innerHTML solo funciona con divs", isCorrect: false },
        { id: "d", text: "No hay diferencia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en como maneja cada uno las etiquetas HTML.",
      explanation: "`textContent` trata todo como texto, `innerHTML` interpreta y renderiza HTML.",
    },
    {
      id: "js12-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Crea un nuevo parrafo con createElement y asignale texto.",
      codeTemplate: {
        html: "",
        cssPrefix: "const p = document.",
        cssSuffix: ';\np.textContent = "Hola mundo";\ndocument.body.appendChild(p);',
        blanks: ['createElement("p")'],
      },
      validation: { type: "regex", answer: 'createElement\\s*\\(\\s*["\']p["\']\\s*\\)' },
      hint: 'Usa document.createElement con el nombre de la etiqueta entre comillas.',
      explanation: '`document.createElement("p")` crea un nuevo elemento parrafo.',
    },
    {
      id: "js12-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Agrega el nuevo elemento como ultimo hijo del contenedor.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const contenedor = document.querySelector("#contenedor");\nconst nuevo = document.createElement("div");\nnuevo.textContent = "Nuevo";\ncontenedor.',
        cssSuffix: ";",
        blanks: ["appendChild(nuevo)"],
      },
      validation: { type: "regex", answer: "appendChild\\s*\\(\\s*nuevo\\s*\\)" },
      hint: "appendChild agrega un nodo como ultimo hijo.",
      explanation: "`contenedor.appendChild(nuevo)` agrega el elemento al final del contenedor.",
    },
    {
      id: "js12-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "¿Que hace `elemento.cloneNode(true)`?",
      options: [
        { id: "a", text: "Crea una copia del elemento sin sus hijos", isCorrect: false },
        { id: "b", text: "Crea una copia del elemento con todos sus hijos", isCorrect: true },
        { id: "c", text: "Mueve el elemento a otra posicion", isCorrect: false },
        { id: "d", text: "Elimina el elemento y retorna una copia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El parametro true indica copia profunda.",
      explanation: "`cloneNode(true)` crea una copia profunda: el elemento y todos sus hijos.",
    },
    {
      id: "js12-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Ordena los pasos para crear y agregar un elemento al DOM.",
      dragItems: [
        { id: "d1", content: "1. document.createElement('li')", correctZone: "paso1" },
        { id: "d2", content: "2. li.textContent = 'Nuevo item'", correctZone: "paso2" },
        { id: "d3", content: "3. li.className = 'item'", correctZone: "paso3" },
        { id: "d4", content: "4. lista.appendChild(li)", correctZone: "paso4" },
      ],
      dropZones: [
        { id: "paso1", label: "Paso 1: Crear el elemento" },
        { id: "paso2", label: "Paso 2: Asignar contenido" },
        { id: "paso3", label: "Paso 3: Agregar clases/estilos" },
        { id: "paso4", label: "Paso 4: Insertar en el DOM" },
      ],
      validation: { type: "exact", answer: { d1: "paso1", d2: "paso2", d3: "paso3", d4: "paso4" } },
      hint: "Primero creas, luego configuras y finalmente insertas.",
      explanation: "El flujo correcto es: crear -> configurar contenido -> agregar clases -> insertar en el DOM.",
    },
    {
      id: "js12-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Usa setAttribute para agregar el atributo `target` con valor `_blank` al enlace.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const enlace = document.querySelector("a");\nenlace.',
        cssSuffix: ";",
        blanks: ['setAttribute("target", "_blank")'],
      },
      validation: { type: "regex", answer: 'setAttribute\\s*\\(\\s*["\']target["\']\\s*,\\s*["\']_blank["\']\\s*\\)' },
      hint: "setAttribute recibe dos argumentos: el nombre del atributo y su valor.",
      explanation: '`setAttribute("target", "_blank")` establece el atributo target del enlace.',
    },
    {
      id: "js12-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Crea una lista de tareas dinamicamente: crea 3 elementos `li` con texto diferente y agregalos a la lista ul. Muestra el total en el div resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Lista de tareas</h3>
  <ul id="tareas"></ul>
  <div id="resultado"></div>
</div>
<script>
const tareas = ["Estudiar JavaScript", "Practicar DOM", "Hacer ejercicios"];
const lista = document.getElementById("tareas");

// Crea los elementos li y agregalos a la lista


// Muestra el total en el div resultado

</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "createElement" },
      hint: "Usa forEach para recorrer el array y createElement + appendChild para cada tarea.",
      explanation: "Recorre el array, crea un `li` por cada tarea con `createElement`, asigna el texto y agregalos con `appendChild`.",
    },
    {
      id: "js12-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt: "Lee el atributo data-precio de cada producto y calcula el total. Muestra el resultado en el div resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div class="producto" data-precio="150">Camiseta</div>
  <div class="producto" data-precio="300">Pantalon</div>
  <div class="producto" data-precio="200">Zapatos</div>
  <div id="resultado"></div>
</div>
<script>
// Selecciona todos los productos, lee data-precio y suma el total


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "dataset" },
      hint: "Usa querySelectorAll para seleccionar los productos y dataset.precio para leer el atributo.",
      explanation: "Selecciona los `.producto`, recorre con forEach y acumula `Number(el.dataset.precio)` para el total.",
    },
  ],
};
