import type { ModuleData } from "@/types";

export const jsArraysModule: ModuleData = {
  slug: "js-arrays",
  title: "Arrays",
  description:
    "Domina los arrays en JavaScript: crear, acceder, modificar, metodos como push/pop/slice/splice, el spread operator y la desestructuracion.",
  order: 108,
  dojo: "js",
  category: "js-fundamentals",
  icon: "list",
  lessons: [
    {
      id: "js08-leccion-01",
      title: "Crear y acceder a arrays",
      content: `## Que es un array?

Un **array** es una lista ordenada de valores. Puede contener cualquier tipo de dato y los elementos se acceden por su **indice** (posicion), que empieza en **0**.

### Crear arrays

\`\`\`javascript
// Forma literal (recomendada)
const frutas = ["manzana", "banana", "cereza"];
const numeros = [1, 2, 3, 4, 5];
const mixto = ["texto", 42, true, null];

// Array vacio
const vacio = [];
\`\`\`

### Acceder a elementos

\`\`\`javascript
const colores = ["rojo", "verde", "azul"];
console.log(colores[0]);    // "rojo" (primer elemento)
console.log(colores[1]);    // "verde"
console.log(colores[2]);    // "azul" (ultimo)
console.log(colores[3]);    // undefined (no existe)
console.log(colores.at(-1)); // "azul" (ultimo con at())
\`\`\`

### Propiedad length

\`\`\`javascript
const frutas = ["manzana", "banana", "cereza"];
console.log(frutas.length);  // 3

// Ultimo elemento
console.log(frutas[frutas.length - 1]);  // "cereza"
// O mas moderno:
console.log(frutas.at(-1));              // "cereza"
\`\`\`

### Modificar elementos

\`\`\`javascript
const colores = ["rojo", "verde", "azul"];
colores[1] = "amarillo";
console.log(colores);  // ["rojo", "amarillo", "azul"]
\`\`\`

### Verificar si es un array

\`\`\`javascript
Array.isArray([1, 2, 3]);  // true
Array.isArray("hola");     // false
typeof [1, 2, 3];          // "object" (no es util!)
\`\`\`

> **Importante:** Los arrays son de **base 0**: el primer elemento esta en el indice 0, no en el 1. Esto es comun en casi todos los lenguajes de programacion.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const lenguajes = ["JavaScript", "Python", "Rust", "Go"];\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Array: [" + lenguajes.join(", ") + "]</p>";\n  res.innerHTML += "<p>Primero: " + lenguajes[0] + "</p>";\n  res.innerHTML += "<p>Ultimo: " + lenguajes.at(-1) + "</p>";\n  res.innerHTML += "<p>Length: " + lenguajes.length + "</p>";\n  res.innerHTML += "<p>Es array? " + Array.isArray(lenguajes) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js08-leccion-02",
      title: "push, pop, shift, unshift",
      content: `## Agregar y eliminar elementos

JavaScript ofrece metodos para agregar y eliminar elementos desde **ambos extremos** del array:

### push — agregar al final

\`\`\`javascript
const frutas = ["manzana", "banana"];
frutas.push("cereza");
// ["manzana", "banana", "cereza"]

frutas.push("uva", "mango");  // Puede agregar varios
// ["manzana", "banana", "cereza", "uva", "mango"]
\`\`\`

### pop — eliminar del final

\`\`\`javascript
const frutas = ["manzana", "banana", "cereza"];
const eliminado = frutas.pop();
console.log(eliminado);  // "cereza"
console.log(frutas);     // ["manzana", "banana"]
\`\`\`

### unshift — agregar al inicio

\`\`\`javascript
const frutas = ["banana", "cereza"];
frutas.unshift("manzana");
// ["manzana", "banana", "cereza"]
\`\`\`

### shift — eliminar del inicio

\`\`\`javascript
const frutas = ["manzana", "banana", "cereza"];
const primero = frutas.shift();
console.log(primero);  // "manzana"
console.log(frutas);   // ["banana", "cereza"]
\`\`\`

### Resumen visual

\`\`\`
                    unshift →  [a, b, c]  ← push
                     shift ←  [a, b, c]  → pop
\`\`\`

| Metodo | Accion | Extremo | Devuelve |
|--------|--------|---------|----------|
| \`push\` | Agrega | Final | Nueva longitud |
| \`pop\` | Elimina | Final | Elemento eliminado |
| \`unshift\` | Agrega | Inicio | Nueva longitud |
| \`shift\` | Elimina | Inicio | Elemento eliminado |

> **Rendimiento:** \`push\` y \`pop\` son mas rapidos que \`unshift\` y \`shift\`, porque agregar/eliminar del inicio requiere reorganizar todos los indices.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const lista = ["B", "C"];\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Inicio: [" + lista.join(", ") + "]</p>";\n  lista.push("D");\n  res.innerHTML += "<p>push('D'): [" + lista.join(", ") + "]</p>";\n  lista.unshift("A");\n  res.innerHTML += "<p>unshift('A'): [" + lista.join(", ") + "]</p>";\n  const ultimo = lista.pop();\n  res.innerHTML += "<p>pop(): elimino '" + ultimo + "' → [" + lista.join(", ") + "]</p>";\n  const primero = lista.shift();\n  res.innerHTML += "<p>shift(): elimino '" + primero + "' → [" + lista.join(", ") + "]</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #b5cea8; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js08-leccion-03",
      title: "slice, splice e indexOf",
      content: `## slice — extraer sin modificar

\`slice(inicio, fin)\` devuelve una **copia parcial** del array sin modificar el original:

\`\`\`javascript
const nums = [0, 1, 2, 3, 4, 5];
console.log(nums.slice(1, 4));    // [1, 2, 3]
console.log(nums.slice(2));       // [2, 3, 4, 5]
console.log(nums.slice(-2));      // [4, 5]
console.log(nums);                // [0, 1, 2, 3, 4, 5] (sin cambios)
\`\`\`

## splice — modificar el array

\`splice(inicio, cantidad, ...nuevos)\` **modifica** el array: elimina, reemplaza o inserta elementos:

\`\`\`javascript
const frutas = ["manzana", "banana", "cereza", "durazno"];

// Eliminar 2 elementos desde el indice 1
const eliminados = frutas.splice(1, 2);
console.log(eliminados);  // ["banana", "cereza"]
console.log(frutas);      // ["manzana", "durazno"]

// Insertar sin eliminar (0 elementos eliminados)
frutas.splice(1, 0, "uva", "mango");
console.log(frutas);  // ["manzana", "uva", "mango", "durazno"]

// Reemplazar 1 elemento
frutas.splice(0, 1, "pera");
console.log(frutas);  // ["pera", "uva", "mango", "durazno"]
\`\`\`

## Buscar elementos

\`\`\`javascript
const colores = ["rojo", "verde", "azul", "verde"];

// indexOf — primera posicion
colores.indexOf("verde");      // 1
colores.indexOf("amarillo");   // -1 (no encontrado)

// includes — existe?
colores.includes("azul");      // true
colores.includes("amarillo");  // false

// find — primer elemento que cumple condicion
const nums = [1, 5, 12, 8, 3];
const mayor10 = nums.find(n => n > 10);  // 12

// findIndex — indice del primer elemento que cumple
const idx = nums.findIndex(n => n > 10);  // 2
\`\`\`

> **Regla:** Usa \`slice\` cuando quieras una copia sin afectar el original. Usa \`splice\` cuando necesites modificar el array directamente.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  const original = [10, 20, 30, 40, 50];\n  res.innerHTML = "<p>Original: [" + original.join(", ") + "]</p>";\n  \n  const porcion = original.slice(1, 4);\n  res.innerHTML += "<p>slice(1,4): [" + porcion.join(", ") + "]</p>";\n  res.innerHTML += "<p>Original sin cambios: [" + original.join(", ") + "]</p>";\n  \n  const copia = [...original];\n  copia.splice(2, 1, 99);\n  res.innerHTML += "<p>splice(2,1,99): [" + copia.join(", ") + "]</p>";\n  \n  res.innerHTML += "<p>indexOf(30): " + original.indexOf(30) + "</p>";\n  res.innerHTML += "<p>includes(40): " + original.includes(40) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #9cdcfe; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
    {
      id: "js08-leccion-04",
      title: "Spread operator y desestructuracion",
      content: `## Spread operator (...)

El operador **spread** (\`...\`) "expande" los elementos de un array:

### Copiar arrays

\`\`\`javascript
const original = [1, 2, 3];
const copia = [...original];
// [1, 2, 3] — copia independiente

copia.push(4);
console.log(original);  // [1, 2, 3] (no afectado)
console.log(copia);     // [1, 2, 3, 4]
\`\`\`

### Combinar arrays

\`\`\`javascript
const frutas = ["manzana", "banana"];
const verduras = ["zanahoria", "brocoli"];
const alimentos = [...frutas, ...verduras];
// ["manzana", "banana", "zanahoria", "brocoli"]

// Insertar en medio
const numeros = [1, 2, ...frutas, 3, 4];
\`\`\`

## Desestructuracion de arrays

Permite extraer valores de un array en variables individuales:

\`\`\`javascript
const colores = ["rojo", "verde", "azul"];

const [primero, segundo, tercero] = colores;
console.log(primero);   // "rojo"
console.log(segundo);   // "verde"
console.log(tercero);   // "azul"
\`\`\`

### Saltar elementos

\`\`\`javascript
const [primero, , tercero] = [10, 20, 30];
console.log(primero);   // 10
console.log(tercero);   // 30
\`\`\`

### Rest en desestructuracion

\`\`\`javascript
const [cabeza, ...resto] = [1, 2, 3, 4, 5];
console.log(cabeza);  // 1
console.log(resto);   // [2, 3, 4, 5]
\`\`\`

### Intercambiar variables

\`\`\`javascript
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a);  // 2
console.log(b);  // 1
\`\`\`

### Valores por defecto

\`\`\`javascript
const [x = 0, y = 0, z = 0] = [10, 20];
console.log(x);  // 10
console.log(y);  // 20
console.log(z);  // 0 (valor por defecto)
\`\`\`

> **Tip:** La desestructuracion y el spread son herramientas modernas de ES6 que hacen el codigo mas legible y expresivo. Usalas siempre que puedas.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  \n  // Spread: copiar y combinar\n  const a = [1, 2, 3];\n  const b = [4, 5, 6];\n  const combinado = [...a, ...b];\n  res.innerHTML = "<p>Spread: [" + combinado.join(", ") + "]</p>";\n  \n  // Desestructuracion\n  const [primero, segundo, ...resto] = combinado;\n  res.innerHTML += "<p>primero = " + primero + "</p>";\n  res.innerHTML += "<p>segundo = " + segundo + "</p>";\n  res.innerHTML += "<p>resto = [" + resto.join(", ") + "]</p>";\n  \n  // Intercambio\n  let x = "A", y = "B";\n  [x, y] = [y, x];\n  res.innerHTML += "<p>Swap: x=" + x + ", y=" + y + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #ce9178; border-radius: 8px; }`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js08-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cual es el indice del primer elemento de un array en JavaScript?",
      options: [
        { id: "a", text: "1", isCorrect: false },
        { id: "b", text: "0", isCorrect: true },
        { id: "c", text: "-1", isCorrect: false },
        { id: "d", text: "Depende del array", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los arrays en JavaScript (y la mayoria de lenguajes) son de base cero.",
      explanation: "Los arrays comienzan en el indice 0. El primer elemento es array[0], el segundo es array[1], etc.",
    },
    {
      id: "js08-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Agrega 'naranja' al final del array de frutas:",
      codeTemplate: {
        html: `<script>\n  const frutas = ["manzana", "banana"];\n  frutas.___(___); \n  // ["manzana", "banana", "naranja"]\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["push", "\"naranja\""],
      },
      validation: { type: "exact", answer: ["push", "\"naranja\""] },
      hint: "El metodo para agregar al final se llama 'push'.",
      explanation: "push() agrega uno o mas elementos al final del array.",
    },
    {
      id: "js08-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Cual es la diferencia entre slice y splice?",
      options: [
        { id: "a", text: "No hay diferencia, son lo mismo", isCorrect: false },
        { id: "b", text: "slice no modifica el array original, splice si lo modifica", isCorrect: true },
        { id: "c", text: "slice es para strings, splice para arrays", isCorrect: false },
        { id: "d", text: "splice no modifica el array original, slice si", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Uno es inmutable (crea copia) y el otro muta (modifica) el array.",
      explanation: "slice devuelve una nueva copia parcial sin modificar el original. splice modifica directamente el array original eliminando, reemplazando o insertando elementos.",
    },
    {
      id: "js08-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Crea un array 'numeros' con los valores [10, 20, 30, 40, 50]. Usa slice para extraer [20, 30, 40] y muestra en el div resultado: 'Porcion: 20, 30, 40'.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Porcion: 20, 30, 40" },
      hint: "Usa numeros.slice(1, 4) para extraer los elementos del indice 1 al 3.",
      explanation: "slice(1, 4) extrae desde el indice 1 hasta el 3 (sin incluir 4): [20, 30, 40].",
    },
    {
      id: "js08-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Usa el spread operator para combinar dos arrays:",
      codeTemplate: {
        html: `<script>\n  const a = [1, 2, 3];\n  const b = [4, 5, 6];\n  const combinado = [___a, ___b];\n  // [1, 2, 3, 4, 5, 6]\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["...", "..."],
      },
      validation: { type: "exact", answer: ["...", "..."] },
      hint: "El spread operator usa tres puntos antes del nombre del array.",
      explanation: "El spread operator (...) expande los elementos de un array. [...a, ...b] crea un nuevo array con todos los elementos de a seguidos de los de b.",
    },
    {
      id: "js08-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Crea un array con los numeros [5, 3, 8, 1, 9, 2]. Usa un ciclo for...of para encontrar el numero mayor y muestra en el div: 'Mayor: 9'.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Mayor: 9" },
      hint: "Declara let mayor = 0; y en el ciclo: if (num > mayor) mayor = num;",
      explanation: "Se recorre el array comparando cada numero con el mayor encontrado hasta el momento. El mayor valor es 9.",
    },
    {
      id: "js08-ej-07",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt: "Relaciona cada metodo de array con su funcion:",
      dragItems: [
        { id: "d1", content: "push()", correctZone: "z1" },
        { id: "d2", content: "pop()", correctZone: "z2" },
        { id: "d3", content: "shift()", correctZone: "z3" },
        { id: "d4", content: "unshift()", correctZone: "z4" },
        { id: "d5", content: "splice()", correctZone: "z5" },
        { id: "d6", content: "slice()", correctZone: "z6" },
      ],
      dropZones: [
        { id: "z1", label: "Agrega al final" },
        { id: "z2", label: "Elimina del final" },
        { id: "z3", label: "Elimina del inicio" },
        { id: "z4", label: "Agrega al inicio" },
        { id: "z5", label: "Modifica: elimina/inserta en cualquier posicion" },
        { id: "z6", label: "Copia una porcion sin modificar el original" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4", d5: "z5", d6: "z6" } },
      hint: "push/pop trabajan en el final, shift/unshift en el inicio. splice modifica, slice copia.",
      explanation: "push agrega al final, pop elimina del final, shift elimina del inicio, unshift agrega al inicio, splice modifica en cualquier posicion, slice copia sin modificar.",
    },
    {
      id: "js08-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 20,
      order: 8,
      prompt: "Usa desestructuracion para extraer el primer elemento y el resto del array:",
      codeTemplate: {
        html: `<script>\n  const numeros = [10, 20, 30, 40, 50];\n  const [primero, ___resto] = numeros;\n  console.log(primero); // 10\n  console.log(resto);   // [20, 30, 40, 50]\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["..."],
      },
      validation: { type: "exact", answer: ["..."] },
      hint: "El operador rest (...) en desestructuracion agrupa los elementos restantes.",
      explanation: "const [primero, ...resto] = numeros; asigna el primer elemento a 'primero' y el rest operator (...) agrupa los demas en el array 'resto'.",
    },
  ],
};
