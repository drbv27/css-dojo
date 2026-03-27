import type { ModuleData } from "@/types";

export const jsVariablesTiposModule: ModuleData = {
  slug: "js-variables-tipos",
  title: "Variables y tipos de datos",
  description:
    "Aprende a declarar variables con let, const y var, y conoce los tipos de datos primitivos de JavaScript: string, number, boolean, null y undefined.",
  order: 102,
  dojo: "js",
  category: "js-fundamentals",
  icon: "box",
  lessons: [
    {
      id: "js02-leccion-01",
      title: "Declaracion de variables: let, const y var",
      content: `## Variables en JavaScript

Una **variable** es un contenedor con nombre que almacena un valor. En JavaScript hay tres formas de declarar variables:

### \`let\` — variable reasignable

\`\`\`javascript
let nombre = "Carlos";
nombre = "Maria";  // Se puede reasignar
\`\`\`

### \`const\` — constante (no reasignable)

\`\`\`javascript
const PI = 3.14159;
// PI = 3;  // Error! No se puede reasignar
\`\`\`

### \`var\` — la forma antigua (evitar)

\`\`\`javascript
var edad = 25;  // Funciona, pero tiene problemas de scope
\`\`\`

### Diferencias clave

| Caracteristica | \`let\` | \`const\` | \`var\` |
|---------------|--------|---------|--------|
| Reasignable | Si | No | Si |
| Scope | Bloque | Bloque | Funcion |
| Hoisting | No accesible antes | No accesible antes | undefined antes |

### Regla de oro

> **Usa \`const\` por defecto.** Solo usa \`let\` cuando necesites reasignar el valor. **Nunca uses \`var\`** en codigo moderno.

### Nombres de variables

- Pueden contener letras, numeros, \`_\` y \`$\`
- No pueden empezar con un numero
- Son **case-sensitive** (\`nombre\` y \`Nombre\` son diferentes)
- Usa **camelCase**: \`miVariable\`, \`nombreCompleto\`, \`edadUsuario\``,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const nombre = "Ana";\n  let edad = 28;\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Nombre: " + nombre + "</p>";\n  res.innerHTML += "<p>Edad: " + edad + "</p>";\n  edad = 29;\n  res.innerHTML += "<p>Edad actualizada: " + edad + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js02-leccion-02",
      title: "Tipos de datos: string y number",
      content: `## Strings (cadenas de texto)

Un **string** es una secuencia de caracteres encerrada entre comillas:

\`\`\`javascript
const simple = 'Hola';           // comillas simples
const doble = "Mundo";           // comillas dobles
const backtick = \\\`Hola Mundo\\\`; // template literal (backticks)
\`\`\`

Las tres formas son validas, pero los **template literals** (backticks) permiten interpolar variables:

\`\`\`javascript
const nombre = "Ana";
const saludo = \\\`Hola, \\\${nombre}!\\\`;  // "Hola, Ana!"
\`\`\`

## Numbers (numeros)

JavaScript usa un **unico tipo numerico** para enteros y decimales:

\`\`\`javascript
const entero = 42;
const decimal = 3.14;
const negativo = -10;
const notacion = 2.5e6;  // 2,500,000
\`\`\`

### Valores especiales

- \`Infinity\` — resultado de dividir por cero positivo
- \`-Infinity\` — resultado de dividir por cero negativo
- \`NaN\` — "Not a Number", resultado de operaciones invalidas

\`\`\`javascript
console.log(10 / 0);       // Infinity
console.log("hola" * 2);   // NaN
console.log(typeof NaN);   // "number" (ironico!)
\`\`\`

> **Cuidado:** \`NaN\` es de tipo "number" aunque signifique "no es un numero". Usa \`Number.isNaN()\` para verificar.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const nombre = "JavaScript";\n  const version = 2024;\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Lenguaje: " + nombre + " (tipo: " + typeof nombre + ")</p>";\n  res.innerHTML += "<p>Version: " + version + " (tipo: " + typeof version + ")</p>";\n  res.innerHTML += "<p>10 / 0 = " + (10 / 0) + "</p>";\n  res.innerHTML += "<p>'hola' * 2 = " + ("hola" * 2) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #ce9178; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js02-leccion-03",
      title: "Tipos de datos: boolean, null y undefined",
      content: `## Boolean

Un **boolean** solo puede tener dos valores: \`true\` o \`false\`.

\`\`\`javascript
const esMayor = true;
const estaLloviendo = false;
const resultado = 10 > 5;  // true
\`\`\`

Los booleanos son fundamentales para las **condiciones** y la **logica** de tu programa.

## null

\`null\` representa la **ausencia intencional** de un valor. Lo asignas tu explicitamente:

\`\`\`javascript
let usuario = null;  // "No hay usuario todavia"
usuario = { nombre: "Ana" };  // Ahora si hay usuario
\`\`\`

## undefined

\`undefined\` significa que una variable **fue declarada pero no tiene valor asignado**:

\`\`\`javascript
let x;
console.log(x);  // undefined
\`\`\`

### Diferencia entre null y undefined

| | \`null\` | \`undefined\` |
|---|------|-----------|
| Significado | "Vacio a proposito" | "Sin valor asignado" |
| Quien lo asigna | El programador | JavaScript automaticamente |
| typeof | "object" (bug historico) | "undefined" |

\`\`\`javascript
console.log(typeof null);       // "object"  (error historico de JS)
console.log(typeof undefined);  // "undefined"
console.log(null == undefined); // true  (igualdad debil)
console.log(null === undefined); // false (igualdad estricta)
\`\`\`

> **Tip:** Usa \`null\` cuando quieras indicar "no hay valor". Deja que JavaScript use \`undefined\` automaticamente.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const activo = true;\n  const usuario = null;\n  let direccion;\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>activo: " + activo + " (tipo: " + typeof activo + ")</p>";\n  res.innerHTML += "<p>usuario: " + usuario + " (tipo: " + typeof usuario + ")</p>";\n  res.innerHTML += "<p>direccion: " + direccion + " (tipo: " + typeof direccion + ")</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #569cd6; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
    {
      id: "js02-leccion-04",
      title: "El operador typeof",
      content: `## El operador typeof

\`typeof\` es un operador que devuelve una **cadena de texto** indicando el tipo de un valor:

\`\`\`javascript
typeof "Hola"      // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  (bug historico!)
typeof {}          // "object"
typeof []          // "object"  (los arrays son objetos)
typeof function(){} // "function"
\`\`\`

### Uso practico

\`typeof\` es util para **verificar tipos** antes de operar con un valor:

\`\`\`javascript
function saluda(nombre) {
  if (typeof nombre !== "string") {
    console.error("Se esperaba un string");
    return;
  }
  console.log("Hola, " + nombre);
}
\`\`\`

### Conversion de tipos

JavaScript convierte tipos automaticamente en algunos contextos (**coercion**):

\`\`\`javascript
console.log("5" + 3);    // "53"  (concatenacion, no suma)
console.log("5" - 3);    // 2     (conversion a numero)
console.log("5" * "2");  // 10    (conversion a numero)
console.log(true + 1);   // 2     (true se convierte a 1)
\`\`\`

### Conversion explicita

Es mejor convertir tipos **explicitamente**:

\`\`\`javascript
const texto = "42";
const numero = Number(texto);    // 42
const cadena = String(123);      // "123"
const booleano = Boolean(1);     // true
\`\`\`

> **Regla:** No confies en la coercion automatica. Convierte tipos explicitamente con \`Number()\`, \`String()\` y \`Boolean()\`.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>typeof 'Hola' = " + typeof "Hola" + "</p>";\n  res.innerHTML += "<p>typeof 42 = " + typeof 42 + "</p>";\n  res.innerHTML += "<p>typeof true = " + typeof true + "</p>";\n  res.innerHTML += "<p>typeof null = " + typeof null + " (bug!)</p>";\n  res.innerHTML += "<p>'5' + 3 = " + ("5" + 3) + "</p>";\n  res.innerHTML += "<p>'5' - 3 = " + ("5" - 3) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #dcdcaa; border-radius: 8px; }`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js02-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la diferencia principal entre 'let' y 'const'?",
      options: [
        { id: "a", text: "let es mas rapido que const", isCorrect: false },
        { id: "b", text: "const no permite reasignar el valor, let si", isCorrect: true },
        { id: "c", text: "let solo acepta numeros, const acepta cualquier tipo", isCorrect: false },
        { id: "d", text: "No hay diferencia, son identicos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que significa 'constante'.",
      explanation: "const declara una constante cuyo valor no puede ser reasignado despues de la inicializacion. let permite reasignar.",
    },
    {
      id: "js02-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Declara una constante llamada 'nombre' con el valor 'Ana':",
      codeTemplate: {
        html: `<script>\n  ___ nombre = ___;\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["const", "\"Ana\""],
      },
      validation: { type: "exact", answer: ["const", "\"Ana\""] },
      hint: "Usa 'const' para valores que no cambian y pon el string entre comillas.",
      explanation: "const nombre = \"Ana\" declara una constante con el valor de texto 'Ana'.",
    },
    {
      id: "js02-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Que devuelve typeof 'Hola Mundo'?",
      options: [
        { id: "a", text: "\"text\"", isCorrect: false },
        { id: "b", text: "\"string\"", isCorrect: true },
        { id: "c", text: "\"String\"", isCorrect: false },
        { id: "d", text: "\"char\"", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los tipos se devuelven en minusculas.",
      explanation: "typeof devuelve 'string' (en minusculas) para cualquier cadena de texto.",
    },
    {
      id: "js02-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual es la diferencia entre null y undefined?",
      options: [
        { id: "a", text: "Son exactamente lo mismo", isCorrect: false },
        { id: "b", text: "null es un error, undefined es intencional", isCorrect: false },
        { id: "c", text: "null es ausencia intencional de valor, undefined significa que no se asigno valor", isCorrect: true },
        { id: "d", text: "null es para numeros, undefined para textos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Piensa en quien asigna cada valor: el programador o JavaScript.",
      explanation: "null lo asigna el programador intencionalmente para indicar 'vacio'. undefined lo asigna JavaScript cuando una variable no tiene valor.",
    },
    {
      id: "js02-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Declara una variable 'edad' con valor 25 y una constante 'nombre' con valor 'Carlos'. Muestra en el div resultado el texto: 'Carlos tiene 25 anos'. Usa template literals.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Carlos tiene 25 anos" },
      hint: "Usa const nombre = 'Carlos'; let edad = 25; y template literals con backticks para el texto.",
      explanation: "Los template literals permiten interpolar variables con ${variable} dentro de backticks.",
    },
    {
      id: "js02-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Relaciona cada valor con su tipo de dato en JavaScript:",
      dragItems: [
        { id: "d1", content: "\"Hola\"", correctZone: "z1" },
        { id: "d2", content: "42", correctZone: "z2" },
        { id: "d3", content: "true", correctZone: "z3" },
        { id: "d4", content: "undefined", correctZone: "z4" },
        { id: "d5", content: "null", correctZone: "z5" },
      ],
      dropZones: [
        { id: "z1", label: "string" },
        { id: "z2", label: "number" },
        { id: "z3", label: "boolean" },
        { id: "z4", label: "undefined" },
        { id: "z5", label: "null (object)" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4", d5: "z5" } },
      hint: "Recuerda: texto entre comillas es string, numeros sin comillas son number.",
      explanation: "JavaScript tiene tipos primitivos: string para texto, number para numeros, boolean para true/false, null para vacio intencional y undefined para sin valor.",
    },
    {
      id: "js02-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 7,
      prompt: "Que resultado da la expresion: '5' + 3?",
      options: [
        { id: "a", text: "8", isCorrect: false },
        { id: "b", text: "\"53\"", isCorrect: true },
        { id: "c", text: "NaN", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El operador + con un string concatena en vez de sumar.",
      explanation: "Cuando uno de los operandos de + es un string, JavaScript convierte el otro a string y los concatena: '5' + 3 = '53'.",
    },
    {
      id: "js02-ej-08",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 8,
      prompt: "Convierte la variable 'texto' a numero y guarda el resultado en 'num':",
      codeTemplate: {
        html: `<script>\n  const texto = "100";\n  const num = ___(texto);\n  console.log(typeof num); // "number"\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["Number"],
      },
      validation: { type: "exact", answer: ["Number"] },
      hint: "Hay una funcion global que convierte valores a tipo numerico.",
      explanation: "Number() es la funcion global que convierte un valor a tipo number. Number('100') devuelve 100.",
    },
  ],
};
