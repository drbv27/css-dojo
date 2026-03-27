import type { ModuleData } from "@/types";

export const jsMetodosArraysModule: ModuleData = {
  slug: "js-metodos-arrays",
  title: "Metodos de Arrays",
  description:
    "Domina los metodos mas poderosos de los arrays en JavaScript: map, filter, reduce, find, sort y mas. Aprende a transformar y manipular colecciones de datos de forma eficiente.",
  order: 109,
  dojo: "js",
  category: "js-intermediate",
  icon: "filter",
  lessons: [
    {
      id: "js09-leccion-01",
      title: "map y forEach",
      content: `## map y forEach

Los arrays en JavaScript tienen metodos incorporados que nos permiten iterar y transformar datos de forma elegante.

### forEach

\`forEach\` ejecuta una funcion por cada elemento del array. **No retorna un nuevo array**, solo ejecuta la funcion.

\`\`\`javascript
const numeros = [1, 2, 3, 4];
numeros.forEach((num, index) => {
  console.log(\`Indice \${index}: \${num}\`);
});
// Indice 0: 1
// Indice 1: 2
// ...
\`\`\`

### map

\`map\` crea un **nuevo array** aplicando una funcion a cada elemento. Es uno de los metodos mas usados.

\`\`\`javascript
const numeros = [1, 2, 3, 4];
const dobles = numeros.map(num => num * 2);
console.log(dobles); // [2, 4, 6, 8]
\`\`\`

### Diferencia clave

- \`forEach\`: para ejecutar efectos secundarios (imprimir, guardar, etc.)
- \`map\`: para **transformar** datos y obtener un nuevo array

\`\`\`javascript
const nombres = ["ana", "luis", "pedro"];
const mayusculas = nombres.map(n => n.toUpperCase());
console.log(mayusculas); // ["ANA", "LUIS", "PEDRO"]
\`\`\`

> **Importante:** \`map\` no modifica el array original, crea uno nuevo.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Resultado de map</h3>
  <div id="resultado"></div>
</div>
<script>
const precios = [10, 20, 30, 40];
const conImpuesto = precios.map(p => (p * 1.16).toFixed(2));
document.getElementById("resultado").textContent = conImpuesto.join(", ");
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js09-leccion-02",
      title: "filter y find",
      content: `## filter y find

### filter

\`filter\` crea un nuevo array con los elementos que cumplan una condicion.

\`\`\`javascript
const edades = [12, 18, 25, 14, 30, 16];
const mayoresDeEdad = edades.filter(edad => edad >= 18);
console.log(mayoresDeEdad); // [18, 25, 30]
\`\`\`

### find y findIndex

\`find\` retorna el **primer** elemento que cumple la condicion (o \`undefined\` si no hay ninguno). \`findIndex\` retorna el **indice** de ese elemento (o \`-1\`).

\`\`\`javascript
const usuarios = [
  { nombre: "Ana", edad: 25 },
  { nombre: "Luis", edad: 18 },
  { nombre: "Pedro", edad: 30 }
];

const luis = usuarios.find(u => u.nombre === "Luis");
console.log(luis); // { nombre: "Luis", edad: 18 }

const indice = usuarios.findIndex(u => u.nombre === "Pedro");
console.log(indice); // 2
\`\`\`

### Diferencia clave

| Metodo | Retorna | Cuantos elementos? |
|--------|---------|---------------------|
| \`filter\` | Array nuevo | Todos los que cumplan |
| \`find\` | Un elemento | Solo el primero |
| \`findIndex\` | Un numero | Indice del primero |

> **Tip:** Usa \`find\` cuando necesites un solo resultado, \`filter\` cuando necesites todos.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Filtrar numeros pares</h3>
  <div id="resultado"></div>
</div>
<script>
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pares = numeros.filter(n => n % 2 === 0);
document.getElementById("resultado").textContent = "Pares: " + pares.join(", ");
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js09-leccion-03",
      title: "reduce",
      content: `## reduce: el metodo mas poderoso

\`reduce\` recorre el array y **acumula** un valor. Puede servir para sumar, agrupar, aplanar y mucho mas.

### Sintaxis

\`\`\`javascript
array.reduce((acumulador, elementoActual) => {
  // logica de acumulacion
  return nuevoAcumulador;
}, valorInicial);
\`\`\`

### Sumar numeros

\`\`\`javascript
const numeros = [10, 20, 30, 40];
const total = numeros.reduce((acc, num) => acc + num, 0);
console.log(total); // 100
\`\`\`

### Contar ocurrencias

\`\`\`javascript
const frutas = ["manzana", "banana", "manzana", "naranja", "banana", "manzana"];
const conteo = frutas.reduce((acc, fruta) => {
  acc[fruta] = (acc[fruta] || 0) + 1;
  return acc;
}, {});
console.log(conteo);
// { manzana: 3, banana: 2, naranja: 1 }
\`\`\`

### Aplanar arrays

\`\`\`javascript
const anidado = [[1, 2], [3, 4], [5, 6]];
const plano = anidado.reduce((acc, arr) => acc.concat(arr), []);
console.log(plano); // [1, 2, 3, 4, 5, 6]
\`\`\`

> **Nota:** El valor inicial es muy importante. Si no lo proporcionas, se usa el primer elemento como acumulador.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Total de compras</h3>
  <div id="resultado"></div>
</div>
<script>
const compras = [
  { producto: "Laptop", precio: 15000 },
  { producto: "Mouse", precio: 350 },
  { producto: "Teclado", precio: 800 }
];
const total = compras.reduce((acc, c) => acc + c.precio, 0);
document.getElementById("resultado").textContent = "Total: $" + total.toLocaleString();
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
    {
      id: "js09-leccion-04",
      title: "some, every, sort y encadenamiento",
      content: `## some, every, sort y encadenamiento

### some y every

\`some\` retorna \`true\` si **al menos un** elemento cumple la condicion. \`every\` retorna \`true\` si **todos** la cumplen.

\`\`\`javascript
const notas = [7, 8, 5, 9, 6];
const hayReprobado = notas.some(n => n < 6);   // true
const todosAprobados = notas.every(n => n >= 6); // false
\`\`\`

### sort

\`sort\` ordena el array **in place** (modifica el original). Por defecto ordena como texto.

\`\`\`javascript
const numeros = [40, 1, 5, 200];
numeros.sort((a, b) => a - b); // orden ascendente
console.log(numeros); // [1, 5, 40, 200]

numeros.sort((a, b) => b - a); // orden descendente
console.log(numeros); // [200, 40, 5, 1]
\`\`\`

### Encadenamiento de metodos (chaining)

Puedes encadenar metodos porque \`map\`, \`filter\`, etc. retornan arrays nuevos:

\`\`\`javascript
const productos = [
  { nombre: "Laptop", precio: 15000, enStock: true },
  { nombre: "Mouse", precio: 350, enStock: false },
  { nombre: "Monitor", precio: 5000, enStock: true },
  { nombre: "Teclado", precio: 800, enStock: true }
];

const resultado = productos
  .filter(p => p.enStock)
  .map(p => p.nombre)
  .sort();

console.log(resultado); // ["Laptop", "Monitor", "Teclado"]
\`\`\`

> **Tip:** El encadenamiento hace que tu codigo sea mas legible y funcional.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Productos disponibles (ordenados por precio)</h3>
  <div id="resultado"></div>
</div>
<script>
const productos = [
  { nombre: "Laptop", precio: 15000, enStock: true },
  { nombre: "Mouse", precio: 350, enStock: false },
  { nombre: "Monitor", precio: 5000, enStock: true },
  { nombre: "Teclado", precio: 800, enStock: true }
];
const disponibles = productos
  .filter(p => p.enStock)
  .sort((a, b) => a.precio - b.precio)
  .map(p => p.nombre + " ($" + p.precio + ")");
document.getElementById("resultado").innerHTML = disponibles.join("<br>");
</script>`,
        css: "",
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js09-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Cual es la diferencia principal entre `map` y `forEach`?",
      options: [
        { id: "a", text: "map es mas rapido que forEach", isCorrect: false },
        { id: "b", text: "map retorna un nuevo array, forEach no retorna nada util", isCorrect: true },
        { id: "c", text: "forEach puede transformar datos, map no", isCorrect: false },
        { id: "d", text: "No hay ninguna diferencia, son lo mismo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que retorna cada uno.",
      explanation: "`map` siempre retorna un nuevo array con los resultados. `forEach` ejecuta la funcion pero retorna `undefined`.",
    },
    {
      id: "js09-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Usa `map` para crear un array con los precios duplicados.",
      codeTemplate: {
        html: "",
        cssPrefix: "const precios = [100, 200, 300];\nconst dobles = precios.",
        cssSuffix: ";\nconsole.log(dobles); // [200, 400, 600]",
        blanks: ["map(p => p * 2)"],
      },
      validation: { type: "regex", answer: "map\\s*\\(\\s*\\w+\\s*=>\\s*\\w+\\s*\\*\\s*2\\s*\\)" },
      hint: "Usa map con una arrow function que multiplique cada elemento por 2.",
      explanation: "`precios.map(p => p * 2)` crea un nuevo array con cada precio multiplicado por 2.",
    },
    {
      id: "js09-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "¿Que retorna `[3, 7, 2, 9].find(n => n > 5)`?",
      options: [
        { id: "a", text: "[7, 9]", isCorrect: false },
        { id: "b", text: "7", isCorrect: true },
        { id: "c", text: "9", isCorrect: false },
        { id: "d", text: "true", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "`find` retorna el primer elemento que cumple la condicion.",
      explanation: "`find` retorna el primer elemento mayor que 5, que es 7.",
    },
    {
      id: "js09-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Usa `filter` para obtener solo los numeros pares del array.",
      codeTemplate: {
        html: "",
        cssPrefix: "const numeros = [1, 2, 3, 4, 5, 6, 7, 8];\nconst pares = numeros.",
        cssSuffix: ";\nconsole.log(pares); // [2, 4, 6, 8]",
        blanks: ["filter(n => n % 2 === 0)"],
      },
      validation: { type: "regex", answer: "filter\\s*\\(\\s*\\w+\\s*=>\\s*\\w+\\s*%\\s*2\\s*===?\\s*0\\s*\\)" },
      hint: "Un numero es par cuando el residuo de dividirlo entre 2 es 0.",
      explanation: "`numeros.filter(n => n % 2 === 0)` filtra los elementos cuyo modulo 2 sea 0 (pares).",
    },
    {
      id: "js09-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Usa `reduce` para sumar todos los elementos del array.",
      codeTemplate: {
        html: "",
        cssPrefix: "const numeros = [10, 20, 30, 40];\nconst total = numeros.",
        cssSuffix: ";\nconsole.log(total); // 100",
        blanks: ["reduce((acc, n) => acc + n, 0)"],
      },
      validation: { type: "regex", answer: "reduce\\s*\\(\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*=>\\s*\\w+\\s*\\+\\s*\\w+\\s*,\\s*0\\s*\\)" },
      hint: "reduce recibe una funcion con acumulador y elemento, y un valor inicial (0).",
      explanation: "`reduce((acc, n) => acc + n, 0)` acumula la suma empezando desde 0.",
    },
    {
      id: "js09-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada metodo segun lo que retorna.",
      dragItems: [
        { id: "d1", content: "map()", correctZone: "array" },
        { id: "d2", content: "filter()", correctZone: "array" },
        { id: "d3", content: "find()", correctZone: "elemento" },
        { id: "d4", content: "reduce()", correctZone: "valor" },
        { id: "d5", content: "some()", correctZone: "booleano" },
        { id: "d6", content: "every()", correctZone: "booleano" },
      ],
      dropZones: [
        { id: "array", label: "Retorna un Array" },
        { id: "elemento", label: "Retorna un Elemento" },
        { id: "valor", label: "Retorna un Valor acumulado" },
        { id: "booleano", label: "Retorna un Booleano" },
      ],
      validation: { type: "exact", answer: { d1: "array", d2: "array", d3: "elemento", d4: "valor", d5: "booleano", d6: "booleano" } },
      hint: "Piensa en el tipo de dato que cada metodo retorna.",
      explanation: "map y filter retornan arrays, find retorna un elemento, reduce retorna un valor acumulado, some y every retornan booleanos.",
    },
    {
      id: "js09-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Usa encadenamiento de metodos: filtra los productos en stock, ordenalos por precio ascendente y muestra sus nombres en el div resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Productos disponibles</h3>
  <div id="resultado"></div>
</div>
<script>
const productos = [
  { nombre: "Laptop", precio: 15000, enStock: true },
  { nombre: "Mouse", precio: 350, enStock: false },
  { nombre: "Monitor", precio: 5000, enStock: true },
  { nombre: "Teclado", precio: 800, enStock: true }
];

// Filtra los que estan en stock, ordena por precio y muestra nombres
const resultado = productos

document.getElementById("resultado").textContent = resultado.join(", ");
</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: ".filter(" },
      hint: "Encadena .filter(), .sort() y .map() en ese orden.",
      explanation: "Primero filtra con `.filter(p => p.enStock)`, luego ordena con `.sort((a,b) => a.precio - b.precio)` y finalmente extrae nombres con `.map(p => p.nombre)`.",
    },
    {
      id: "js09-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "¿Que retorna `[1, 2, 3].reduce((acc, n) => acc + n, 10)`?",
      options: [
        { id: "a", text: "6", isCorrect: false },
        { id: "b", text: "16", isCorrect: true },
        { id: "c", text: "10", isCorrect: false },
        { id: "d", text: "[10, 1, 2, 3]", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El valor inicial es 10, luego se suman 1 + 2 + 3.",
      explanation: "El acumulador empieza en 10 y suma 1 + 2 + 3 = 6. Total: 10 + 6 = 16.",
    },
  ],
};
