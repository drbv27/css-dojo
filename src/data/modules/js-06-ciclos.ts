import type { ModuleData } from "@/types";

export const jsCiclosModule: ModuleData = {
  slug: "js-ciclos",
  title: "Ciclos (Loops)",
  description:
    "Domina los ciclos en JavaScript: for, while, do-while, for...of, for...in, y las sentencias break y continue.",
  order: 106,
  dojo: "js",
  category: "js-fundamentals",
  icon: "repeat",
  lessons: [
    {
      id: "js06-leccion-01",
      title: "for y while",
      content: `## Ciclos: repetir acciones

Los **ciclos** (loops) permiten ejecutar un bloque de codigo **multiples veces**. Son fundamentales para procesar listas, generar datos y automatizar tareas repetitivas.

### El ciclo for

Es el ciclo mas comun. Tiene tres partes: **inicializacion**, **condicion** e **incremento**:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Iteracion:", i);
}
// Iteracion: 0, 1, 2, 3, 4
\`\`\`

**Desglose:**
1. \`let i = 0\` — se ejecuta una vez al inicio
2. \`i < 5\` — se evalua antes de cada iteracion
3. \`i++\` — se ejecuta al final de cada iteracion

### El ciclo while

Repite mientras una condicion sea verdadera. Util cuando **no sabes cuantas iteraciones** necesitas:

\`\`\`javascript
let contador = 0;
while (contador < 5) {
  console.log("Contador:", contador);
  contador++;
}
\`\`\`

### Cuidado con ciclos infinitos!

Si la condicion nunca se vuelve falsa, el ciclo **nunca termina** y congela tu programa:

\`\`\`javascript
// NUNCA hagas esto:
// while (true) { console.log("Infinito!"); }
\`\`\`

### Cuando usar cada uno?

| Ciclo | Mejor para |
|-------|-----------|
| \`for\` | Cuando sabes cuantas iteraciones necesitas |
| \`while\` | Cuando la condicion de parada depende de algo que cambia |

> **Tip:** Si puedes expresar el ciclo con \`for\`, prefierelo. Es mas explicito y menos propenso a errores.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p><strong>Ciclo for:</strong></p>";\n  for (let i = 1; i <= 5; i++) {\n    res.innerHTML += "<p>  " + i + " x 3 = " + (i * 3) + "</p>";\n  }\n  res.innerHTML += "<p><strong>Ciclo while:</strong></p>";\n  let n = 1;\n  while (n <= 32) {\n    res.innerHTML += "<p>  2^? = " + n + "</p>";\n    n *= 2;\n  }\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #b5cea8; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js06-leccion-02",
      title: "do-while, for...of y for...in",
      content: `## do-while

\`do-while\` es como \`while\`, pero **siempre ejecuta el bloque al menos una vez** antes de evaluar la condicion:

\`\`\`javascript
let numero = 10;
do {
  console.log(numero);  // Se imprime 10
  numero++;
} while (numero < 5);
// El bloque se ejecuto una vez aunque 10 > 5
\`\`\`

### for...of (recorrer valores)

Ideal para recorrer **arrays** y otros iterables. Te da directamente cada **valor**:

\`\`\`javascript
const frutas = ["manzana", "banana", "cereza"];

for (const fruta of frutas) {
  console.log(fruta);
}
// manzana, banana, cereza
\`\`\`

Tambien funciona con strings:

\`\`\`javascript
for (const letra of "Hola") {
  console.log(letra);
}
// H, o, l, a
\`\`\`

### for...in (recorrer propiedades)

Recorre las **propiedades enumerables** de un objeto. Te da las **claves** (keys):

\`\`\`javascript
const persona = { nombre: "Ana", edad: 28, ciudad: "Madrid" };

for (const clave in persona) {
  console.log(clave + ": " + persona[clave]);
}
// nombre: Ana, edad: 28, ciudad: Madrid
\`\`\`

### Resumen comparativo

| Ciclo | Itera sobre | Da acceso a |
|-------|------------|-------------|
| \`for...of\` | Arrays, strings, iterables | **Valores** |
| \`for...in\` | Objetos | **Claves (keys)** |

> **Importante:** No uses \`for...in\` con arrays. El orden no esta garantizado y puede incluir propiedades heredadas. Usa \`for...of\` para arrays.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  const colores = ["rojo", "verde", "azul"];\n  res.innerHTML = "<p><strong>for...of (array):</strong></p>";\n  for (const color of colores) {\n    res.innerHTML += "<p>  Color: " + color + "</p>";\n  }\n  const auto = { marca: "Toyota", modelo: "Corolla", ano: 2024 };\n  res.innerHTML += "<p><strong>for...in (objeto):</strong></p>";\n  for (const prop in auto) {\n    res.innerHTML += "<p>  " + prop + ": " + auto[prop] + "</p>";\n  }\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #9cdcfe; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js06-leccion-03",
      title: "break y continue",
      content: `## Controlando ciclos: break y continue

### break — salir del ciclo

\`break\` **termina el ciclo completamente** y continua con el codigo que sigue:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break;  // Sale del ciclo cuando i llega a 5
  }
  console.log(i);
}
// Imprime: 0, 1, 2, 3, 4
\`\`\`

### continue — saltar una iteracion

\`continue\` **salta el resto de la iteracion actual** y pasa a la siguiente:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 !== 0) {
    continue;  // Salta los numeros impares
  }
  console.log(i);
}
// Imprime: 0, 2, 4, 6, 8
\`\`\`

### Ejemplo practico: buscar un elemento

\`\`\`javascript
const nombres = ["Ana", "Carlos", "Maria", "Pedro"];
let encontrado = false;

for (const nombre of nombres) {
  if (nombre === "Maria") {
    encontrado = true;
    break;  // No necesitamos seguir buscando
  }
}

console.log("Maria encontrada:", encontrado);  // true
\`\`\`

### Ejemplo practico: filtrar valores

\`\`\`javascript
const numeros = [1, -2, 3, -4, 5, -6];
let suma = 0;

for (const num of numeros) {
  if (num < 0) continue;  // Ignora negativos
  suma += num;
}

console.log("Suma de positivos:", suma);  // 9
\`\`\`

### Cuando usarlos?

- **break**: Cuando encontraste lo que buscabas o se cumplio una condicion de parada
- **continue**: Cuando quieres ignorar ciertos valores pero seguir iterando

> **Tip:** Usa \`break\` y \`continue\` con moderacion. En muchos casos, los metodos de array como \`.find()\` o \`.filter()\` son mas legibles.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p><strong>break (parar en 5):</strong></p>";\n  let textoBreak = "";\n  for (let i = 0; i < 10; i++) {\n    if (i === 5) break;\n    textoBreak += i + " ";\n  }\n  res.innerHTML += "<p>  " + textoBreak + "</p>";\n\n  res.innerHTML += "<p><strong>continue (solo pares):</strong></p>";\n  let textoContinue = "";\n  for (let i = 0; i < 10; i++) {\n    if (i % 2 !== 0) continue;\n    textoContinue += i + " ";\n  }\n  res.innerHTML += "<p>  " + textoContinue + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #dcdcaa; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js06-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cuantas veces se ejecuta el cuerpo de este ciclo?\n\nfor (let i = 0; i < 3; i++) { console.log(i); }",
      options: [
        { id: "a", text: "2 veces", isCorrect: false },
        { id: "b", text: "3 veces", isCorrect: true },
        { id: "c", text: "4 veces", isCorrect: false },
        { id: "d", text: "Infinitas veces", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "i toma los valores 0, 1 y 2. Cuando i = 3, la condicion i < 3 es false.",
      explanation: "El ciclo ejecuta con i = 0, 1 y 2 (tres iteraciones). Cuando i llega a 3, la condicion i < 3 es false y el ciclo termina.",
    },
    {
      id: "js06-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa el ciclo for para contar del 1 al 5:",
      codeTemplate: {
        html: `<script>\n  for (let i = ___; i <= ___; i++) {\n    console.log(i);\n  }\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["1", "5"],
      },
      validation: { type: "exact", answer: ["1", "5"] },
      hint: "Necesitas empezar en 1 y terminar cuando i sea igual a 5.",
      explanation: "for (let i = 1; i <= 5; i++) cuenta desde 1 hasta 5 inclusive.",
    },
    {
      id: "js06-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Usa un ciclo for para calcular la suma de los numeros del 1 al 10 y muestra 'Suma: 55' en el div resultado.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Suma: 55" },
      hint: "Declara let suma = 0; y en cada iteracion haz suma += i;",
      explanation: "La suma de 1+2+3+...+10 = 55. Se calcula acumulando cada numero en una variable con un ciclo for.",
    },
    {
      id: "js06-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual es la diferencia entre for...of y for...in?",
      options: [
        { id: "a", text: "for...of itera sobre valores, for...in sobre claves/propiedades", isCorrect: true },
        { id: "b", text: "for...of es mas rapido que for...in", isCorrect: false },
        { id: "c", text: "for...in es para arrays, for...of para objetos", isCorrect: false },
        { id: "d", text: "No hay diferencia, son identicos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Piensa: 'of' = valores, 'in' = propiedades (indices/claves).",
      explanation: "for...of recorre los valores de un iterable (array, string). for...in recorre las claves/propiedades enumerables de un objeto.",
    },
    {
      id: "js06-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Usa for...of para recorrer el array de frutas:",
      codeTemplate: {
        html: `<script>\n  const frutas = ["manzana", "banana", "cereza"];\n  for (___ fruta ___ frutas) {\n    console.log(fruta);\n  }\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["const", "of"],
      },
      validation: { type: "exact", answer: ["const", "of"] },
      hint: "for...of usa la palabra 'of' y declara la variable con const.",
      explanation: "for (const fruta of frutas) recorre cada elemento del array, asignando el valor a la variable 'fruta'.",
    },
    {
      id: "js06-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Usa un ciclo for y continue para mostrar solo los numeros pares del 1 al 10 en el div resultado. El texto debe ser: 'Pares: 2 4 6 8 10'.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Pares: 2 4 6 8 10" },
      hint: "Usa if (i % 2 !== 0) continue; para saltar los impares.",
      explanation: "Con continue saltamos las iteraciones donde i es impar (i % 2 !== 0), acumulando solo los pares.",
    },
    {
      id: "js06-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 7,
      prompt: "Que hace 'break' dentro de un ciclo?",
      options: [
        { id: "a", text: "Salta a la siguiente iteracion", isCorrect: false },
        { id: "b", text: "Pausa el ciclo temporalmente", isCorrect: false },
        { id: "c", text: "Termina el ciclo completamente", isCorrect: true },
        { id: "d", text: "Reinicia el ciclo desde cero", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "La palabra 'break' significa 'romper'.",
      explanation: "break sale completamente del ciclo. La ejecucion continua con la siguiente instruccion despues del ciclo.",
    },
    {
      id: "js06-ej-08",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 8,
      prompt: "Ordena los pasos de ejecucion de un ciclo for (let i = 0; i < 3; i++):",
      dragItems: [
        { id: "d1", content: "1. Inicializacion: let i = 0", correctZone: "z1" },
        { id: "d2", content: "2. Evaluar condicion: i < 3", correctZone: "z2" },
        { id: "d3", content: "3. Ejecutar cuerpo del ciclo", correctZone: "z3" },
        { id: "d4", content: "4. Incremento: i++", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Paso 1 (una sola vez)" },
        { id: "z2", label: "Paso 2 (cada iteracion)" },
        { id: "z3", label: "Paso 3 (si condicion es true)" },
        { id: "z4", label: "Paso 4 (despues del cuerpo)" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" } },
      hint: "Primero se inicializa, luego se verifica la condicion, se ejecuta el cuerpo y finalmente se incrementa.",
      explanation: "El ciclo for sigue este orden: inicializacion (una vez), condicion (antes de cada iteracion), cuerpo (si la condicion es true), incremento (despues del cuerpo).",
    },
  ],
};
