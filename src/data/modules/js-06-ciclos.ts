import type { ModuleData } from "@/types";

export const jsCiclosModule: ModuleData = {
  slug: "js-ciclos",
  title: "Ciclos (Loops)",
  description:
    "Aprende a repetir bloques de codigo con for, while, do...while y los metodos de iteracion modernos.",
  order: 106,
  category: "js-fundamentals",
  icon: "Repeat",
  dojo: "js",
  lessons: [
    {
      id: "js06-leccion-01",
      title: "Ciclo for",
      content: `## Ciclo for

El ciclo \`for\` repite un bloque de codigo un numero determinado de veces:

\`\`\`javascript
for (inicializacion; condicion; incremento) {
  // codigo a repetir
}
\`\`\`

### Las tres partes
1. **Inicializacion:** se ejecuta una vez antes del ciclo (\`let i = 0\`)
2. **Condicion:** se evalua antes de cada iteracion (\`i < 5\`)
3. **Incremento:** se ejecuta al final de cada iteracion (\`i++\`)

### Ejemplo clasico
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
\`\`\`

### Iterando hacia atras
\`\`\`javascript
for (let i = 10; i > 0; i--) {
  console.log(i); // 10, 9, 8, ..., 1
}
\`\`\`

> **Cuidado:** Si la condicion nunca se hace falsa, tendras un **ciclo infinito** que colgara tu navegador.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];
for (let i = 1; i <= 5; i++) {
  salida.push("Iteracion " + i + ": i = " + i);
}
salida.push("---");
// Tabla del 7
for (let i = 1; i <= 5; i++) {
  salida.push("7 x " + i + " = " + (7 * i));
}
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js06-leccion-02",
      title: "while y do...while",
      content: `## Ciclo while

Repite mientras la condicion sea verdadera. Util cuando **no sabes cuantas veces** se repetira:

\`\`\`javascript
while (condicion) {
  // codigo
}
\`\`\`

### Ejemplo
\`\`\`javascript
let contador = 0;
while (contador < 5) {
  console.log(contador);
  contador++;
}
\`\`\`

## Ciclo do...while

Similar a while, pero **siempre ejecuta al menos una vez**:

\`\`\`javascript
do {
  // codigo (se ejecuta al menos 1 vez)
} while (condicion);
\`\`\`

### Diferencia clave
- \`while\`: verifica **antes** de ejecutar
- \`do...while\`: ejecuta **antes** de verificar

> **Tip:** Usa \`for\` cuando sepas cuantas iteraciones necesitas. Usa \`while\` cuando dependas de una condicion.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];

// while
let num = 1;
salida.push("while - Potencias de 2:");
while (num <= 32) {
  salida.push("  " + num);
  num *= 2;
}

salida.push("---");

// do...while
let intento = 1;
salida.push("do...while - Intentos:");
do {
  salida.push("  Intento #" + intento);
  intento++;
} while (intento <= 3);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js06-leccion-03",
      title: "break y continue",
      content: `## Control de ciclos: break y continue

### break
Sale del ciclo inmediatamente:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}
\`\`\`

### continue
Salta a la siguiente iteracion:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i); // 1, 3, 5, 7, 9
}
\`\`\`

### for...of (moderno)

Itera sobre los elementos de un iterable (arrays, strings):

\`\`\`javascript
const frutas = ["manzana", "pera", "uva"];
for (const fruta of frutas) {
  console.log(fruta);
}
\`\`\`

### for...in

Itera sobre las **propiedades** de un objeto:

\`\`\`javascript
const persona = { nombre: "Ana", edad: 25 };
for (const clave in persona) {
  console.log(clave + ": " + persona[clave]);
}
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];

// break - buscar primer par
salida.push("break - Primer numero > 5:");
for (let i = 1; i <= 10; i++) {
  if (i > 5) {
    salida.push("  Encontrado: " + i);
    break;
  }
}

// continue - solo impares
salida.push("continue - Numeros impares:");
let impares = "  ";
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue;
  impares += i + " ";
}
salida.push(impares);

// for...of
const colores = ["rojo", "verde", "azul"];
salida.push("for...of - Colores:");
for (const color of colores) {
  salida.push("  " + color);
}

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
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
      prompt: "Cuantas veces se ejecuta el cuerpo de: for (let i = 0; i < 3; i++)?",
      options: [
        { id: "a", text: "2 veces", isCorrect: false },
        { id: "b", text: "3 veces", isCorrect: true },
        { id: "c", text: "4 veces", isCorrect: false },
        { id: "d", text: "Infinitas veces", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "i toma los valores 0, 1, 2.",
      explanation: "El ciclo se ejecuta para i = 0, 1, 2. Cuando i llega a 3, la condicion i < 3 es false y se detiene.",
    },
    {
      id: "js06-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Cual es la diferencia principal entre while y do...while?",
      options: [
        { id: "a", text: "while es mas rapido", isCorrect: false },
        { id: "b", text: "do...while siempre ejecuta al menos una vez", isCorrect: true },
        { id: "c", text: "while no puede usar break", isCorrect: false },
        { id: "d", text: "No hay diferencia", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "do...while verifica la condicion DESPUES de ejecutar.",
      explanation:
        "do...while ejecuta el bloque primero y luego verifica la condicion, garantizando al menos una ejecucion.",
    },
    {
      id: "js06-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa el ciclo for para iterar de 0 a 4:",
      codeTemplate: {
        html: "",
        cssPrefix: "for (let i = 0; i ",
        cssSuffix: " 5; i++) { }",
        blanks: ["<"],
      },
      validation: { type: "exact", answer: "<" },
      hint: "Necesitas un operador de comparacion que sea verdadero para 0,1,2,3,4.",
      explanation: "i < 5 es verdadero para i = 0, 1, 2, 3, 4, dando exactamente 5 iteraciones.",
    },
    {
      id: "js06-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que palabra clave salta a la siguiente iteracion sin ejecutar el resto del cuerpo del ciclo?",
      options: [
        { id: "a", text: "break", isCorrect: false },
        { id: "b", text: "continue", isCorrect: true },
        { id: "c", text: "skip", isCorrect: false },
        { id: "d", text: "next", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Su nombre indica 'continuar' con la siguiente iteracion.",
      explanation:
        "continue salta el resto del cuerpo del ciclo y pasa directamente a la siguiente iteracion.",
    },
    {
      id: "js06-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que ciclo es mas apropiado para recorrer los elementos de un array?",
      options: [
        { id: "a", text: "for...in", isCorrect: false },
        { id: "b", text: "for...of", isCorrect: true },
        { id: "c", text: "while", isCorrect: false },
        { id: "d", text: "do...while", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "for...of itera sobre los valores de un iterable.",
      explanation:
        "for...of es ideal para arrays porque itera directamente sobre los valores. for...in itera sobre las propiedades/indices y esta pensado para objetos.",
    },
    {
      id: "js06-ej-06",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 6,
      prompt: "Que problema causa un ciclo for sin condicion de parada correcta, como for (let i = 0; i >= 0; i++)?",
      options: [
        { id: "a", text: "Error de sintaxis", isCorrect: false },
        { id: "b", text: "No ejecuta ninguna iteracion", isCorrect: false },
        { id: "c", text: "Ciclo infinito", isCorrect: true },
        { id: "d", text: "Ejecuta solo una vez", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Si i siempre crece y la condicion es >= 0...",
      explanation:
        "Como i empieza en 0 y siempre incrementa, la condicion i >= 0 siempre sera true, creando un ciclo infinito.",
    },
  ],
};
