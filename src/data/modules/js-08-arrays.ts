import type { ModuleData } from "@/types";

export const jsArraysModule: ModuleData = {
  slug: "js-arrays",
  title: "Arrays (Arreglos)",
  description:
    "Aprende a crear, acceder y manipular arrays: el tipo de dato fundamental para colecciones en JavaScript.",
  order: 108,
  category: "js-fundamentals",
  icon: "List",
  dojo: "js",
  lessons: [
    {
      id: "js08-leccion-01",
      title: "Creacion y acceso",
      content: `## Arrays en JavaScript

Un **array** es una lista ordenada de elementos. Puede contener cualquier tipo de dato.

### Crear un array
\`\`\`javascript
const frutas = ["manzana", "pera", "uva"];
const numeros = [1, 2, 3, 4, 5];
const mixto = ["texto", 42, true, null];
const vacio = [];
\`\`\`

### Acceder a elementos
Los indices comienzan en **0**:
\`\`\`javascript
frutas[0]  // "manzana"
frutas[1]  // "pera"
frutas[2]  // "uva"
\`\`\`

### Propiedades utiles
- \`length\` — cantidad de elementos
- Ultimo elemento: \`array[array.length - 1]\`

### Modificar elementos
\`\`\`javascript
frutas[1] = "banana"; // reemplaza "pera"
\`\`\`

> **Nota:** A diferencia de los strings, los arrays SI son mutables. Puedes cambiar sus elementos.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const frutas = ["manzana", "pera", "uva", "naranja"];
const salida = [];
salida.push("Array: " + frutas.join(", "));
salida.push("Longitud: " + frutas.length);
salida.push("Primero: " + frutas[0]);
salida.push("Ultimo: " + frutas[frutas.length - 1]);

frutas[1] = "banana";
salida.push("Despues de cambiar [1]: " + frutas.join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js08-leccion-02",
      title: "Metodos basicos",
      content: `## Metodos basicos de arrays

### Agregar y quitar elementos

| Metodo | Accion | Retorna |
|--------|--------|---------|
| \`push(elem)\` | Agrega al **final** | Nueva longitud |
| \`pop()\` | Quita del **final** | Elemento quitado |
| \`unshift(elem)\` | Agrega al **inicio** | Nueva longitud |
| \`shift()\` | Quita del **inicio** | Elemento quitado |

### Busqueda

| Metodo | Descripcion |
|--------|-------------|
| \`indexOf(elem)\` | Indice del elemento (-1 si no existe) |
| \`includes(elem)\` | true/false si existe |
| \`find(fn)\` | Primer elemento que cumple condicion |
| \`findIndex(fn)\` | Indice del primer elemento que cumple |

### Otros metodos utiles
- \`splice(indice, cantidad)\` — elimina o inserta elementos
- \`slice(inicio, fin)\` — extrae una copia parcial
- \`concat(otro)\` — une dos arrays
- \`join(separador)\` — convierte a string
- \`reverse()\` — invierte el orden`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `const colores = ["rojo", "verde"];
const salida = [];

colores.push("azul");
salida.push("push('azul'): " + colores.join(", "));

colores.unshift("amarillo");
salida.push("unshift('amarillo'): " + colores.join(", "));

const ultimo = colores.pop();
salida.push("pop(): removio '" + ultimo + "' -> " + colores.join(", "));

salida.push("includes('verde'): " + colores.includes("verde"));
salida.push("indexOf('verde'): " + colores.indexOf("verde"));

const copia = colores.slice(1, 3);
salida.push("slice(1,3): " + copia.join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js08-leccion-03",
      title: "Recorrer arrays",
      content: `## Recorrer arrays

### for clasico
\`\`\`javascript
const nums = [10, 20, 30];
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}
\`\`\`

### for...of
\`\`\`javascript
for (const num of nums) {
  console.log(num);
}
\`\`\`

### forEach
\`\`\`javascript
nums.forEach(function(num, indice) {
  console.log(indice + ": " + num);
});
\`\`\`

### Desestructuracion de arrays

Puedes extraer valores en variables individuales:

\`\`\`javascript
const [primero, segundo, ...resto] = [1, 2, 3, 4, 5];
// primero = 1, segundo = 2, resto = [3, 4, 5]
\`\`\`

### Spread operator

Expande un array en elementos individuales:

\`\`\`javascript
const a = [1, 2];
const b = [3, 4];
const c = [...a, ...b]; // [1, 2, 3, 4]
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `const numeros = [10, 20, 30, 40, 50];
const salida = [];

// forEach
salida.push("forEach:");
numeros.forEach(function(num, i) {
  salida.push("  [" + i + "] = " + num);
});

// Desestructuracion
const [primero, segundo] = numeros;
salida.push("Primero: " + primero + ", Segundo: " + segundo);

// Spread
const masNumeros = [0, ...numeros, 60];
salida.push("Spread: " + masNumeros.join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js08-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: 'Que devuelve ["a", "b", "c"][1]?',
      options: [
        { id: "a", text: '"a"', isCorrect: false },
        { id: "b", text: '"b"', isCorrect: true },
        { id: "c", text: '"c"', isCorrect: false },
        { id: "d", text: "1", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los indices empiezan en 0.",
      explanation: 'El indice 1 corresponde al segundo elemento: "b".',
    },
    {
      id: "js08-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo agrega un elemento al final de un array?",
      options: [
        { id: "a", text: "add()", isCorrect: false },
        { id: "b", text: "append()", isCorrect: false },
        { id: "c", text: "push()", isCorrect: true },
        { id: "d", text: "insert()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Piensa en 'empujar' un elemento al final.",
      explanation: "push() agrega uno o mas elementos al final del array y devuelve la nueva longitud.",
    },
    {
      id: "js08-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa el metodo para obtener la cantidad de elementos del array:",
      codeTemplate: {
        html: "",
        cssPrefix: 'const arr = [1, 2, 3];\nconst cantidad = arr.',
        cssSuffix: ";",
        blanks: ["length"],
      },
      validation: { type: "exact", answer: "length" },
      hint: "Es una propiedad, no un metodo (sin parentesis).",
      explanation: "length es la propiedad que devuelve la cantidad de elementos de un array.",
    },
    {
      id: "js08-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que metodo remueve y devuelve el ultimo elemento de un array?",
      options: [
        { id: "a", text: "shift()", isCorrect: false },
        { id: "b", text: "pop()", isCorrect: true },
        { id: "c", text: "remove()", isCorrect: false },
        { id: "d", text: "delete()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es lo opuesto de push().",
      explanation: "pop() remueve el ultimo elemento del array y lo devuelve. Es el inverso de push().",
    },
    {
      id: "js08-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que devuelve [1, 2, 3].includes(4)?",
      options: [
        { id: "a", text: "true", isCorrect: false },
        { id: "b", text: "false", isCorrect: true },
        { id: "c", text: "-1", isCorrect: false },
        { id: "d", text: "undefined", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "includes devuelve un booleano.",
      explanation: "includes() devuelve false porque el numero 4 no existe en el array [1, 2, 3].",
    },
    {
      id: "js08-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada metodo de array segun donde opera:",
      dragItems: [
        { id: "drag-1", content: "push()", correctZone: "zone-final" },
        { id: "drag-2", content: "shift()", correctZone: "zone-inicio" },
        { id: "drag-3", content: "pop()", correctZone: "zone-final" },
      ],
      dropZones: [
        { id: "zone-inicio", label: "Opera al inicio" },
        { id: "zone-final", label: "Opera al final" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-final",
          "drag-2": "zone-inicio",
          "drag-3": "zone-final",
        },
      },
      hint: "push/pop trabajan al final, shift/unshift al inicio.",
      explanation: "push() y pop() operan al final del array. shift() y unshift() operan al inicio.",
    },
  ],
};
