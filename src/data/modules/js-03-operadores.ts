import type { ModuleData } from "@/types";

export const jsOperadoresModule: ModuleData = {
  slug: "js-operadores",
  title: "Operadores",
  description:
    "Domina los operadores aritmeticos, de comparacion, logicos y de asignacion en JavaScript.",
  order: 103,
  category: "js-fundamentals",
  icon: "Calculator",
  dojo: "js",
  lessons: [
    {
      id: "js03-leccion-01",
      title: "Operadores aritmeticos",
      content: `## Operadores aritmeticos

Los operadores aritmeticos permiten realizar **calculos matematicos**:

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| \`+\` | Suma | \`5 + 3\` → \`8\` |
| \`-\` | Resta | \`5 - 3\` → \`2\` |
| \`*\` | Multiplicacion | \`5 * 3\` → \`15\` |
| \`/\` | Division | \`10 / 3\` → \`3.33\` |
| \`%\` | Modulo (resto) | \`10 % 3\` → \`1\` |
| \`**\` | Potencia | \`2 ** 3\` → \`8\` |

### Incremento y decremento

\`\`\`javascript
let x = 5;
x++;  // x ahora es 6
x--;  // x vuelve a ser 5
\`\`\`

### Orden de operaciones

JavaScript sigue las reglas matematicas: primero \`**\`, luego \`*\`, \`/\`, \`%\`, y por ultimo \`+\` y \`-\`. Usa parentesis para cambiar el orden.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];
salida.push("5 + 3 = " + (5 + 3));
salida.push("10 - 4 = " + (10 - 4));
salida.push("6 * 7 = " + (6 * 7));
salida.push("10 / 3 = " + (10 / 3).toFixed(2));
salida.push("10 % 3 = " + (10 % 3));
salida.push("2 ** 8 = " + (2 ** 8));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js03-leccion-02",
      title: "Operadores de comparacion",
      content: `## Operadores de comparacion

Comparan dos valores y devuelven un **booleano** (\`true\` o \`false\`):

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| \`==\` | Igualdad (con coercion) | \`"5" == 5\` → \`true\` |
| \`===\` | Igualdad estricta | \`"5" === 5\` → \`false\` |
| \`!=\` | Desigualdad | \`5 != 3\` → \`true\` |
| \`!==\` | Desigualdad estricta | \`"5" !== 5\` → \`true\` |
| \`>\` | Mayor que | \`5 > 3\` → \`true\` |
| \`<\` | Menor que | \`5 < 3\` → \`false\` |
| \`>=\` | Mayor o igual | \`5 >= 5\` → \`true\` |
| \`<=\` | Menor o igual | \`3 <= 5\` → \`true\` |

### == vs ===

Siempre usa \`===\` (igualdad estricta). El \`==\` hace conversion de tipos y puede dar resultados inesperados:

\`\`\`javascript
0 == ""    // true  (ambos se convierten)
0 === ""   // false (tipos diferentes)
\`\`\`

> **Regla:** Siempre usa \`===\` y \`!==\`. Evita \`==\` y \`!=\`.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];
salida.push('5 === 5: ' + (5 === 5));
salida.push('"5" === 5: ' + ("5" === 5));
salida.push('"5" == 5: ' + ("5" == 5));
salida.push("10 > 5: " + (10 > 5));
salida.push("3 >= 3: " + (3 >= 3));
salida.push("0 === false: " + (0 === false));
salida.push("0 == false: " + (0 == false));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js03-leccion-03",
      title: "Operadores logicos",
      content: `## Operadores logicos

Combinan expresiones booleanas:

| Operador | Nombre | Descripcion |
|----------|--------|-------------|
| \`&&\` | AND | Verdadero si **ambos** son verdaderos |
| \`\\|\\|\` | OR | Verdadero si **al menos uno** es verdadero |
| \`!\` | NOT | Invierte el valor booleano |

### Ejemplos

\`\`\`javascript
true && true    // true
true && false   // false
true || false   // true
false || false  // false
!true           // false
!false          // true
\`\`\`

### Evaluacion de cortocircuito

- \`&&\` devuelve el primer valor falsy, o el ultimo si todos son truthy
- \`||\` devuelve el primer valor truthy, o el ultimo si todos son falsy

\`\`\`javascript
"hola" && "mundo"  // "mundo"
"" || "default"    // "default"
\`\`\`

Esto es muy util para **valores por defecto** y **ejecucion condicional**.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `const edad = 20;
const tieneID = true;

const salida = [];
salida.push("edad >= 18 && tieneID: " + (edad >= 18 && tieneID));
salida.push("edad < 18 || tieneID: " + (edad < 18 || tieneID));
salida.push("!tieneID: " + !tieneID);
salida.push('"" || "default": ' + ("" || "default"));
salida.push('"hola" && "mundo": ' + ("hola" && "mundo"));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js03-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cual es el resultado de 10 % 3?",
      options: [
        { id: "a", text: "3.33", isCorrect: false },
        { id: "b", text: "3", isCorrect: false },
        { id: "c", text: "1", isCorrect: true },
        { id: "d", text: "0", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El operador % devuelve el resto de la division.",
      explanation: "10 % 3 = 1 porque 10 dividido entre 3 es 3 con resto 1.",
    },
    {
      id: "js03-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: 'Cual es el resultado de "5" === 5?',
      options: [
        { id: "a", text: "true", isCorrect: false },
        { id: "b", text: "false", isCorrect: true },
        { id: "c", text: "Error", isCorrect: false },
        { id: "d", text: "undefined", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "=== compara valor Y tipo.",
      explanation:
        '"5" === 5 es false porque === (igualdad estricta) compara tanto el valor como el tipo. "5" es string y 5 es number.',
    },
    {
      id: "js03-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Cual es el resultado de true && false || true?",
      options: [
        { id: "a", text: "true", isCorrect: true },
        { id: "b", text: "false", isCorrect: false },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "&& se evalua antes que ||.",
      explanation:
        "Primero se evalua true && false = false. Luego false || true = true. El operador && tiene mayor precedencia que ||.",
    },
    {
      id: "js03-ej-04",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 4,
      prompt: "Completa el operador para verificar igualdad estricta entre dos valores:",
      codeTemplate: {
        html: "",
        cssPrefix: "const resultado = 5 ",
        cssSuffix: ' 5; // true',
        blanks: ["==="],
      },
      validation: { type: "exact", answer: "===" },
      hint: "Usa tres signos de igual para comparacion estricta.",
      explanation:
        "=== es el operador de igualdad estricta. Compara tanto el valor como el tipo de dato.",
    },
    {
      id: "js03-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: 'Que devuelve "" || "valor por defecto"?',
      options: [
        { id: "a", text: '""', isCorrect: false },
        { id: "b", text: '"valor por defecto"', isCorrect: true },
        { id: "c", text: "true", isCorrect: false },
        { id: "d", text: "false", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El string vacio es falsy, entonces || busca el primer valor truthy.",
      explanation:
        'Como "" es falsy, el operador || devuelve el segundo operando: "valor por defecto". Este patron se usa mucho para asignar valores por defecto.',
    },
    {
      id: "js03-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Cual es el resultado de 2 ** 3?",
      options: [
        { id: "a", text: "6", isCorrect: false },
        { id: "b", text: "8", isCorrect: true },
        { id: "c", text: "5", isCorrect: false },
        { id: "d", text: "9", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "** es el operador de potencia: base elevada al exponente.",
      explanation: "2 ** 3 = 2^3 = 8. El operador ** calcula la potencia.",
    },
  ],
};
