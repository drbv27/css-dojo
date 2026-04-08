import type { ModuleData } from "@/types";

export const jsDomManipulacionModule: ModuleData = {
  slug: "js-dom-manipulacion",
  title: "DOM: Manipulacion",
  description:
    "Aprende a crear, modificar y eliminar elementos del DOM: textContent, innerHTML, atributos y mas.",
  order: 112,
  category: "js-intermediate",
  icon: "PenTool",
  dojo: "js",
  lessons: [
    {
      id: "js12-leccion-01",
      title: "Modificar contenido",
      content: `## Modificar contenido de elementos

### textContent
Cambia el texto de un elemento (solo texto plano):
\`\`\`javascript
elemento.textContent = "Nuevo texto";
\`\`\`

### innerHTML
Cambia el contenido HTML de un elemento:
\`\`\`javascript
elemento.innerHTML = "<strong>Texto en negrita</strong>";
\`\`\`

### innerText
Similar a textContent pero respeta los estilos CSS (no muestra contenido oculto):
\`\`\`javascript
elemento.innerText = "Texto visible";
\`\`\`

### Diferencias
| Propiedad | HTML | Rendimiento |
|-----------|------|-------------|
| textContent | No interpreta | Rapido |
| innerHTML | Si interpreta | Mas lento |
| innerText | No interpreta | Mas lento (recalcula estilos) |

> **Seguridad:** Evita usar innerHTML con datos del usuario. Puede causar ataques XSS. Prefiere textContent.`,
      codeExample: {
        html: '<h3 id="titulo">Titulo original</h3>\n<div id="contenido">Contenido original</div>\n<div id="resultado"></div>',
        css: '#titulo { color: #cba6f7; } #contenido { padding: 8px; border: 1px solid #45475a; border-radius: 4px; color: #cdd6f4; margin: 8px 0; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const titulo = document.getElementById("titulo");
const contenido = document.getElementById("contenido");

// Cambiar texto
titulo.textContent = "Titulo modificado con JS!";

// Cambiar HTML
contenido.innerHTML = "<em>Contenido</em> modificado con <strong>innerHTML</strong>";

const salida = [];
salida.push("textContent del titulo: " + titulo.textContent);
salida.push("innerHTML del contenido: " + contenido.innerHTML);
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js12-leccion-02",
      title: "Crear y eliminar elementos",
      content: `## Crear elementos

### document.createElement()
\`\`\`javascript
const nuevoDiv = document.createElement("div");
nuevoDiv.textContent = "Soy nuevo!";
nuevoDiv.className = "mi-clase";
\`\`\`

### Agregar al DOM
\`\`\`javascript
padre.appendChild(hijo);        // al final
padre.prepend(hijo);            // al inicio
padre.insertBefore(nuevo, ref); // antes de otro elemento
padre.append(hijo1, hijo2);     // multiples al final
\`\`\`

### Eliminar elementos
\`\`\`javascript
elemento.remove();             // se elimina a si mismo
padre.removeChild(hijo);       // el padre elimina al hijo
\`\`\`

### Reemplazar elementos
\`\`\`javascript
padre.replaceChild(nuevo, viejo);
viejo.replaceWith(nuevo);
\`\`\`

### Clonar elementos
\`\`\`javascript
const clon = elemento.cloneNode(true); // true = copia profunda
\`\`\`

> **Performance:** Si necesitas agregar muchos elementos, usa \`DocumentFragment\` para evitar multiples re-renders.`,
      codeExample: {
        html: '<ul id="lista"></ul>\n<div id="resultado"></div>',
        css: '#lista { list-style: none; padding: 0; } #lista li { padding: 4px 8px; margin: 2px 0; background: #313244; color: #cdd6f4; border-radius: 4px; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `const lista = document.getElementById("lista");
const frutas = ["Manzana", "Pera", "Uva", "Naranja", "Banana"];

// Crear elementos dinamicamente
frutas.forEach(function(fruta, i) {
  var li = document.createElement("li");
  li.textContent = (i + 1) + ". " + fruta;
  lista.appendChild(li);
});

// Agregar uno al inicio
var primero = document.createElement("li");
primero.textContent = "0. Fresa (agregada al inicio)";
primero.style.color = "#a6e3a1";
lista.prepend(primero);

document.getElementById("resultado").textContent = "Se crearon " + lista.children.length + " elementos en la lista.";`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js12-leccion-03",
      title: "Atributos",
      content: `## Manipular atributos

### getAttribute / setAttribute
\`\`\`javascript
elemento.getAttribute("href");
elemento.setAttribute("href", "https://ejemplo.com");
\`\`\`

### Propiedades directas
Muchos atributos son accesibles como propiedades:
\`\`\`javascript
imagen.src = "foto.jpg";
enlace.href = "https://ejemplo.com";
input.value = "nuevo valor";
input.disabled = true;
\`\`\`

### classList — Manipular clases
\`\`\`javascript
elemento.classList.add("nueva-clase");
elemento.classList.remove("vieja-clase");
elemento.classList.toggle("activo");      // agrega/quita
elemento.classList.contains("activo");    // true/false
elemento.classList.replace("vieja", "nueva");
\`\`\`

### dataset — Atributos data-*
\`\`\`html
<div data-user-id="123" data-role="admin">
\`\`\`
\`\`\`javascript
elemento.dataset.userId  // "123"
elemento.dataset.role    // "admin"
\`\`\`

> **classList** es la forma moderna y segura de manipular clases. Evita usar \`className\` directamente ya que sobreescribe todas las clases.`,
      codeExample: {
        html: '<button id="btn" class="boton" data-action="saludar">Click me</button>\n<div id="resultado"></div>',
        css: '.boton { padding: 8px 16px; border: none; border-radius: 4px; background: #89b4fa; color: #1e1e2e; cursor: pointer; font-size: 14px; } .boton.activo { background: #a6e3a1; } #resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; margin-top: 8px; }',
        js: `const btn = document.getElementById("btn");
const salida = [];

// Leer atributos
salida.push("Clase: " + btn.className);
salida.push("data-action: " + btn.dataset.action);

// Modificar clases
btn.classList.add("activo");
salida.push("Tiene 'activo': " + btn.classList.contains("activo"));
salida.push("Clases actuales: " + btn.className);

// Cambiar atributos
btn.setAttribute("data-count", "1");
salida.push("data-count: " + btn.dataset.count);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js12-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que propiedad se usa para cambiar el texto de un elemento de forma segura?",
      options: [
        { id: "a", text: "innerHTML", isCorrect: false },
        { id: "b", text: "textContent", isCorrect: true },
        { id: "c", text: "text", isCorrect: false },
        { id: "d", text: "value", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "No interpreta HTML, solo texto plano.",
      explanation: "textContent es la forma segura de cambiar texto. innerHTML puede ser vulnerable a ataques XSS.",
    },
    {
      id: "js12-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo crea un nuevo elemento HTML?",
      options: [
        { id: "a", text: 'document.createElement("div")', isCorrect: true },
        { id: "b", text: 'document.newElement("div")', isCorrect: false },
        { id: "c", text: 'document.create("div")', isCorrect: false },
        { id: "d", text: 'new Element("div")', isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "El metodo tiene 'create' y 'Element' en su nombre.",
      explanation: "document.createElement() crea un nuevo elemento HTML del tipo especificado.",
    },
    {
      id: "js12-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa para agregar un elemento hijo al final del padre:",
      codeTemplate: {
        html: "",
        cssPrefix: "padre.",
        cssSuffix: "(hijo);",
        blanks: ["appendChild"],
      },
      validation: { type: "exact", answer: "appendChild" },
      hint: "append + Child = agregar hijo.",
      explanation: "appendChild() agrega un nodo al final de los hijos del elemento padre.",
    },
    {
      id: "js12-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que metodo de classList agrega una clase si no existe y la quita si ya existe?",
      options: [
        { id: "a", text: "classList.add()", isCorrect: false },
        { id: "b", text: "classList.switch()", isCorrect: false },
        { id: "c", text: "classList.toggle()", isCorrect: true },
        { id: "d", text: "classList.flip()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Toggle significa alternar.",
      explanation: "classList.toggle() agrega la clase si no existe y la quita si ya existe.",
    },
    {
      id: "js12-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Como accedes a un atributo data-user-id desde JavaScript?",
      options: [
        { id: "a", text: 'elemento.data["user-id"]', isCorrect: false },
        { id: "b", text: "elemento.dataset.userId", isCorrect: true },
        { id: "c", text: "elemento.dataUserId", isCorrect: false },
        { id: "d", text: 'elemento.getAttribute("userId")', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los data-* se acceden via dataset y los guiones se convierten a camelCase.",
      explanation: "Los atributos data-* se acceden via dataset. data-user-id se convierte a dataset.userId (camelCase).",
    },
    {
      id: "js12-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Cual es el metodo mas simple para eliminar un elemento del DOM?",
      options: [
        { id: "a", text: "elemento.delete()", isCorrect: false },
        { id: "b", text: "elemento.destroy()", isCorrect: false },
        { id: "c", text: "elemento.remove()", isCorrect: true },
        { id: "d", text: "document.removeElement(elemento)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El elemento se remueve a si mismo.",
      explanation: "elemento.remove() es la forma mas sencilla y moderna de eliminar un elemento del DOM.",
    },
  ],
};
