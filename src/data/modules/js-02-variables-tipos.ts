import type { ModuleData } from "@/types";

export const jsVariablesTiposModule: ModuleData = {
  slug: "js-variables-tipos",
  title: "Variables y Tipos de Datos",
  description:
    "Aprende a declarar variables con var, let y const, y conoce los tipos de datos primitivos de JavaScript.",
  order: 102,
  category: "js-fundamentals",
  icon: "Variable",
  dojo: "js",
  lessons: [
    {
      id: "js02-leccion-01",
      title: "Declaracion de variables",
      content: `## Declaracion de variables

Una **variable** es un contenedor con nombre para almacenar datos. En JavaScript hay tres formas de declarar variables:

### var (antigua)
\`\`\`javascript
var nombre = "Ana";
\`\`\`
Es la forma clasica. Tiene **alcance de funcion** y permite redeclaracion. **No se recomienda** en codigo moderno.

### let (moderna)
\`\`\`javascript
let edad = 25;
edad = 26; // Se puede reasignar
\`\`\`
Tiene **alcance de bloque** y no permite redeclaracion en el mismo ambito.

### const (constante)
\`\`\`javascript
const PI = 3.14159;
// PI = 3; // Error! No se puede reasignar
\`\`\`
Igual que let pero **no se puede reasignar**. Usala siempre que el valor no cambie.

> **Regla de oro:** Usa \`const\` por defecto. Solo usa \`let\` si necesitas reasignar. Nunca uses \`var\`.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const nombre = "Ana";
let edad = 25;
edad = 26;

const mensaje = "Nombre: " + nombre + "\\nEdad: " + edad;
document.getElementById("resultado").textContent = mensaje;`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js02-leccion-02",
      title: "Tipos de datos primitivos",
      content: `## Tipos de datos primitivos

JavaScript tiene **7 tipos primitivos**. Los mas comunes son:

### String (texto)
Cadenas de texto entre comillas simples, dobles o backticks:
\`\`\`javascript
const saludo = "Hola";
const nombre = 'Mundo';
\`\`\`

### Number (numero)
Enteros y decimales, sin distincion:
\`\`\`javascript
const entero = 42;
const decimal = 3.14;
\`\`\`

### Boolean (verdadero/falso)
Solo dos valores posibles:
\`\`\`javascript
const activo = true;
const eliminado = false;
\`\`\`

### undefined y null
- \`undefined\`: variable declarada pero sin valor asignado
- \`null\`: valor intencionalmente vacio

### typeof
El operador \`typeof\` te dice el tipo de un valor:
\`\`\`javascript
typeof "Hola"  // "string"
typeof 42      // "number"
typeof true    // "boolean"
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cdd6f4; border-radius: 8px; white-space: pre-line; }',
        js: `const texto = "Hola Mundo";
const numero = 42;
const decimal = 3.14;
const booleano = true;
let sinValor;

const salida = [];
salida.push("texto: " + typeof texto);
salida.push("numero: " + typeof numero);
salida.push("decimal: " + typeof decimal);
salida.push("booleano: " + typeof booleano);
salida.push("sinValor: " + typeof sinValor);
salida.push("null: " + typeof null);
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js02-leccion-03",
      title: "Conversion de tipos",
      content: `## Conversion de tipos

JavaScript puede convertir valores de un tipo a otro de forma **implicita** (automatica) o **explicita** (manual).

### Conversion explicita

\`\`\`javascript
String(42)       // "42"
Number("42")     // 42
Boolean(1)       // true
Boolean(0)       // false
Boolean("")      // false
Boolean("hola")  // true
\`\`\`

### Conversion implicita (coercion)

JavaScript intenta convertir automaticamente cuando mezclas tipos:

\`\`\`javascript
"5" + 3    // "53" (concatena como string)
"5" - 3    // 2 (convierte a numero)
"5" * 2    // 10
\`\`\`

### Valores falsy

Estos valores se convierten a \`false\`:
\`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`, \`false\`

Todo lo demas es **truthy** (se convierte a \`true\`).

> **Cuidado:** La coercion implicita es fuente comun de bugs. Prefiere las conversiones explicitas.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];
salida.push('"5" + 3 = ' + ("5" + 3));
salida.push('"5" - 3 = ' + ("5" - 3));
salida.push('Number("42") = ' + Number("42"));
salida.push('String(42) = ' + String(42));
salida.push('Boolean(0) = ' + Boolean(0));
salida.push('Boolean("hola") = ' + Boolean("hola"));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js02-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la forma recomendada de declarar una variable que no cambiara de valor?",
      options: [
        { id: "a", text: "var", isCorrect: false },
        { id: "b", text: "let", isCorrect: false },
        { id: "c", text: "const", isCorrect: true },
        { id: "d", text: "define", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Su nombre viene de 'constante'.",
      explanation:
        "const se usa para valores que no se reasignan. Es la opcion por defecto en codigo moderno.",
    },
    {
      id: "js02-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: 'Que devuelve typeof "Hola"?',
      options: [
        { id: "a", text: '"text"', isCorrect: false },
        { id: "b", text: '"string"', isCorrect: true },
        { id: "c", text: '"String"', isCorrect: false },
        { id: "d", text: '"char"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El tipo para cadenas de texto en JavaScript es...",
      explanation:
        'typeof "Hola" devuelve "string". En JavaScript, todo texto es de tipo string, sin importar su longitud.',
    },
    {
      id: "js02-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Declara una constante llamada 'edad' con el valor 25:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: " edad = 25;",
        blanks: ["const"],
      },
      validation: { type: "exact", answer: "const" },
      hint: "Usa la palabra clave para declarar una variable que no cambia.",
      explanation: "const edad = 25; declara una constante que no puede ser reasignada.",
    },
    {
      id: "js02-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: 'Cual es el resultado de "5" + 3 en JavaScript?',
      options: [
        { id: "a", text: "8", isCorrect: false },
        { id: "b", text: '"53"', isCorrect: true },
        { id: "c", text: "Error", isCorrect: false },
        { id: "d", text: '"8"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El operador + con un string concatena en vez de sumar.",
      explanation:
        'Cuando uno de los operandos del + es un string, JavaScript convierte el otro a string y los concatena: "5" + 3 = "53".',
    },
    {
      id: "js02-ej-05",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada valor segun su tipo de dato en JavaScript:",
      dragItems: [
        { id: "drag-1", content: '"Hola"', correctZone: "zone-string" },
        { id: "drag-2", content: "42", correctZone: "zone-number" },
        { id: "drag-3", content: "true", correctZone: "zone-boolean" },
      ],
      dropZones: [
        { id: "zone-string", label: "String" },
        { id: "zone-number", label: "Number" },
        { id: "zone-boolean", label: "Boolean" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-string",
          "drag-2": "zone-number",
          "drag-3": "zone-boolean",
        },
      },
      hint: "Texto entre comillas, numeros sin comillas, y valores de verdadero/falso.",
      explanation:
        '"Hola" es un string (texto), 42 es un number (numero) y true es un boolean (booleano).',
    },
    {
      id: "js02-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Cual de estos es un valor 'falsy' en JavaScript?",
      options: [
        { id: "a", text: '"false"', isCorrect: false },
        { id: "b", text: "1", isCorrect: false },
        { id: "c", text: '""', isCorrect: true },
        { id: "d", text: '"0"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Un string vacio se convierte a false.",
      explanation:
        'Un string vacio "" es falsy. Pero "false" y "0" son strings no vacios, por lo tanto son truthy.',
    },
  ],
};
