import type { ModuleData } from "@/types";

export const jsMetodosArraysModule: ModuleData = {
  slug: "js-metodos-arrays",
  title: "Metodos Avanzados de Arrays",
  description:
    "Domina map, filter, reduce, sort y otros metodos funcionales para transformar y procesar arrays.",
  order: 109,
  category: "js-intermediate",
  icon: "ListFilter",
  dojo: "js",
  lessons: [
    {
      id: "js09-leccion-01",
      title: "map y filter",
      content: `## map() — Transformar elementos

\`map()\` crea un **nuevo array** aplicando una funcion a cada elemento:

\`\`\`javascript
const nums = [1, 2, 3, 4];
const dobles = nums.map(n => n * 2);
// [2, 4, 6, 8]
\`\`\`

### Caracteristicas de map
- **No modifica** el array original
- Devuelve un array de la **misma longitud**
- Cada elemento se transforma con la funcion dada

## filter() — Filtrar elementos

\`filter()\` crea un nuevo array con los elementos que **cumplen una condicion**:

\`\`\`javascript
const nums = [1, 2, 3, 4, 5, 6];
const pares = nums.filter(n => n % 2 === 0);
// [2, 4, 6]
\`\`\`

### Caracteristicas de filter
- Devuelve un array con **igual o menos** elementos
- La funcion debe devolver **true** o **false**
- No modifica el array original

> **Tip:** Puedes encadenar map y filter: \`array.filter(...).map(...)\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const salida = [];

const dobles = numeros.map(function(n) { return n * 2; });
salida.push("Dobles: " + dobles.join(", "));

const pares = numeros.filter(function(n) { return n % 2 === 0; });
salida.push("Pares: " + pares.join(", "));

// Encadenado: pares al cuadrado
const paresCuadrado = numeros
  .filter(function(n) { return n % 2 === 0; })
  .map(function(n) { return n * n; });
salida.push("Pares al cuadrado: " + paresCuadrado.join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js09-leccion-02",
      title: "reduce",
      content: `## reduce() — Acumular valores

\`reduce()\` recorre el array y **acumula** un resultado:

\`\`\`javascript
const nums = [1, 2, 3, 4];
const suma = nums.reduce((acumulador, actual) => {
  return acumulador + actual;
}, 0);
// 10
\`\`\`

### Parametros
1. **Callback** con (acumulador, elementoActual, indice, array)
2. **Valor inicial** del acumulador

### Ejemplo paso a paso
\`\`\`
[1, 2, 3, 4].reduce((acc, val) => acc + val, 0)
Paso 1: acc=0, val=1 → 1
Paso 2: acc=1, val=2 → 3
Paso 3: acc=3, val=3 → 6
Paso 4: acc=6, val=4 → 10
\`\`\`

### Usos comunes
- Sumar valores
- Encontrar maximo/minimo
- Agrupar elementos
- Aplanar arrays
- Contar ocurrencias

> **Importante:** Siempre proporciona un valor inicial para evitar errores con arrays vacios.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `const numeros = [10, 20, 30, 40, 50];
const salida = [];

// Suma total
const suma = numeros.reduce(function(acc, n) { return acc + n; }, 0);
salida.push("Suma: " + suma);

// Maximo
const maximo = numeros.reduce(function(acc, n) { return n > acc ? n : acc; }, numeros[0]);
salida.push("Maximo: " + maximo);

// Contar letras
const palabra = "programacion";
const conteo = palabra.split("").reduce(function(acc, letra) {
  acc[letra] = (acc[letra] || 0) + 1;
  return acc;
}, {});
salida.push("Letras en 'programacion':");
for (var key in conteo) {
  salida.push("  " + key + ": " + conteo[key]);
}

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js09-leccion-03",
      title: "sort, find y every/some",
      content: `## sort() — Ordenar

\`sort()\` ordena el array **en su lugar** (muta el original):

\`\`\`javascript
// Para numeros, necesitas una funcion de comparacion
const nums = [3, 1, 4, 1, 5];
nums.sort((a, b) => a - b); // ascendente
nums.sort((a, b) => b - a); // descendente
\`\`\`

> **Cuidado:** Sin funcion, sort convierte a string y ordena alfabeticamente. \`[10, 2, 1].sort()\` da \`[1, 10, 2]\`.

## find() y findIndex()

\`\`\`javascript
const usuarios = [{nombre: "Ana", edad: 25}, {nombre: "Luis", edad: 30}];
const usuario = usuarios.find(u => u.edad > 26);
// {nombre: "Luis", edad: 30}
\`\`\`

## every() y some()

- \`every()\` — devuelve true si **todos** cumplen la condicion
- \`some()\` — devuelve true si **al menos uno** cumple

\`\`\`javascript
const nums = [2, 4, 6, 8];
nums.every(n => n % 2 === 0); // true (todos son pares)
nums.some(n => n > 5);        // true (6 y 8 son > 5)
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        js: `const numeros = [42, 8, 15, 23, 4, 16];
const salida = [];

// sort
var ordenados = numeros.slice().sort(function(a, b) { return a - b; });
salida.push("Ordenados (asc): " + ordenados.join(", "));

ordenados = numeros.slice().sort(function(a, b) { return b - a; });
salida.push("Ordenados (desc): " + ordenados.join(", "));

// find
var mayor20 = numeros.find(function(n) { return n > 20; });
salida.push("Primer > 20: " + mayor20);

// every / some
var todosMayor0 = numeros.every(function(n) { return n > 0; });
salida.push("Todos > 0: " + todosMayor0);

var algunMayor30 = numeros.some(function(n) { return n > 30; });
salida.push("Algun > 30: " + algunMayor30);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js09-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que metodo de array crea un nuevo array transformando cada elemento?",
      options: [
        { id: "a", text: "filter()", isCorrect: false },
        { id: "b", text: "map()", isCorrect: true },
        { id: "c", text: "reduce()", isCorrect: false },
        { id: "d", text: "forEach()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Su nombre significa 'mapear' o 'transformar'.",
      explanation: "map() crea un nuevo array aplicando una funcion a cada elemento del array original.",
    },
    {
      id: "js09-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que devuelve [1,2,3].filter(n => n > 1)?",
      options: [
        { id: "a", text: "[2, 3]", isCorrect: true },
        { id: "b", text: "[1]", isCorrect: false },
        { id: "c", text: "[true, true]", isCorrect: false },
        { id: "d", text: "2", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "filter mantiene los elementos donde la funcion devuelve true.",
      explanation: "filter(n => n > 1) mantiene solo los elementos mayores a 1: [2, 3].",
    },
    {
      id: "js09-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que devuelve [1,2,3,4].reduce((acc, n) => acc + n, 0)?",
      options: [
        { id: "a", text: "[1, 2, 3, 4]", isCorrect: false },
        { id: "b", text: "10", isCorrect: true },
        { id: "c", text: "24", isCorrect: false },
        { id: "d", text: "4", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Suma todos los elementos empezando desde 0.",
      explanation: "reduce acumula: 0+1=1, 1+2=3, 3+3=6, 6+4=10. El resultado es 10.",
    },
    {
      id: "js09-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Por que [10, 2, 1].sort() devuelve [1, 10, 2] en vez de [1, 2, 10]?",
      options: [
        { id: "a", text: "Es un bug de JavaScript", isCorrect: false },
        { id: "b", text: "sort() sin argumento ordena como strings", isCorrect: true },
        { id: "c", text: "sort() ordena aleatoriamente", isCorrect: false },
        { id: "d", text: "Ordena por longitud del numero", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Sin funcion de comparacion, sort convierte los elementos a texto.",
      explanation: 'Sin funcion de comparacion, sort() convierte a string: "1" < "10" < "2" (comparacion alfabetica).',
    },
    {
      id: "js09-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa el metodo para verificar si TODOS los elementos cumplen la condicion:",
      codeTemplate: {
        html: "",
        cssPrefix: "const todosPares = [2, 4, 6].",
        cssSuffix: "(n => n % 2 === 0);",
        blanks: ["every"],
      },
      validation: { type: "exact", answer: "every" },
      hint: "En ingles significa 'cada uno' o 'todos'.",
      explanation: "every() devuelve true solo si TODOS los elementos cumplen la condicion.",
    },
    {
      id: "js09-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Cual es la diferencia principal entre map() y forEach()?",
      options: [
        { id: "a", text: "forEach es mas rapido", isCorrect: false },
        { id: "b", text: "map devuelve un nuevo array, forEach no devuelve nada", isCorrect: true },
        { id: "c", text: "map modifica el array original", isCorrect: false },
        { id: "d", text: "No hay diferencia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Uno devuelve un nuevo array y el otro no.",
      explanation: "map() devuelve un nuevo array con los resultados. forEach() ejecuta la funcion pero devuelve undefined.",
    },
    {
      id: "js09-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Que devuelve [1,2,3].map(n => n * 2).filter(n => n > 3)?",
      options: [
        { id: "a", text: "[4, 6]", isCorrect: true },
        { id: "b", text: "[2, 4, 6]", isCorrect: false },
        { id: "c", text: "[6]", isCorrect: false },
        { id: "d", text: "[2, 3]", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Primero duplica (2,4,6), luego filtra los mayores a 3.",
      explanation: "map duplica: [2,4,6]. Luego filter mantiene > 3: [4,6].",
    },
  ],
};
