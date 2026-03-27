import type { ModuleData } from "@/types";

export const jsOperadoresModule: ModuleData = {
  slug: "js-operadores",
  title: "Operadores",
  description:
    "Domina los operadores aritmeticos, de comparacion, logicos, el operador ternario y el nullish coalescing de JavaScript.",
  order: 103,
  dojo: "js",
  category: "js-fundamentals",
  icon: "calculator",
  lessons: [
    {
      id: "js03-leccion-01",
      title: "Operadores aritmeticos",
      content: `## Operadores aritmeticos

Los operadores aritmeticos realizan **operaciones matematicas** con numeros:

| Operador | Nombre | Ejemplo | Resultado |
|----------|--------|---------|-----------|
| \`+\` | Suma | \`5 + 3\` | \`8\` |
| \`-\` | Resta | \`10 - 4\` | \`6\` |
| \`*\` | Multiplicacion | \`3 * 7\` | \`21\` |
| \`/\` | Division | \`15 / 4\` | \`3.75\` |
| \`%\` | Modulo (resto) | \`10 % 3\` | \`1\` |
| \`**\` | Potencia | \`2 ** 3\` | \`8\` |

### El operador modulo (%)

El **modulo** devuelve el **resto** de una division. Es muy util para:

- Saber si un numero es **par o impar**: \`n % 2 === 0\` (par)
- Crear **ciclos**: \`i % longitud\` (vuelve al inicio)
- Extraer **digitos**: \`123 % 10\` da \`3\` (ultimo digito)

### Operadores de asignacion compuesta

\`\`\`javascript
let x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x %= 4;   // x = x % 4  → 2
\`\`\`

### Incremento y decremento

\`\`\`javascript
let contador = 0;
contador++;  // contador = 1 (post-incremento)
contador--;  // contador = 0 (post-decremento)
++contador;  // contador = 1 (pre-incremento)
\`\`\`

> **Tip:** El operador \`%\` es una herramienta poderosa. Usalo para verificar divisibilidad y crear patrones ciclicos.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>5 + 3 = " + (5 + 3) + "</p>";\n  res.innerHTML += "<p>10 - 4 = " + (10 - 4) + "</p>";\n  res.innerHTML += "<p>3 * 7 = " + (3 * 7) + "</p>";\n  res.innerHTML += "<p>15 / 4 = " + (15 / 4) + "</p>";\n  res.innerHTML += "<p>10 % 3 = " + (10 % 3) + "</p>";\n  res.innerHTML += "<p>2 ** 3 = " + (2 ** 3) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #b5cea8; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js03-leccion-02",
      title: "Operadores de comparacion",
      content: `## Operadores de comparacion

Los operadores de comparacion **comparan dos valores** y devuelven un booleano (\`true\` o \`false\`):

| Operador | Nombre | Ejemplo | Resultado |
|----------|--------|---------|-----------|
| \`==\` | Igualdad debil | \`5 == "5"\` | \`true\` |
| \`===\` | Igualdad estricta | \`5 === "5"\` | \`false\` |
| \`!=\` | Desigualdad debil | \`5 != "5"\` | \`false\` |
| \`!==\` | Desigualdad estricta | \`5 !== "5"\` | \`true\` |
| \`>\` | Mayor que | \`10 > 5\` | \`true\` |
| \`<\` | Menor que | \`3 < 8\` | \`true\` |
| \`>=\` | Mayor o igual | \`5 >= 5\` | \`true\` |
| \`<=\` | Menor o igual | \`4 <= 3\` | \`false\` |

### == vs === (MUY IMPORTANTE)

La diferencia mas critica en JavaScript:

- \`==\` (igualdad debil): convierte los tipos antes de comparar (**coercion**)
- \`===\` (igualdad estricta): compara **valor Y tipo** sin conversion

\`\`\`javascript
5 == "5"     // true  (convierte "5" a 5)
5 === "5"    // false (number !== string)

0 == false   // true  (false se convierte a 0)
0 === false  // false (number !== boolean)

null == undefined  // true
null === undefined // false
\`\`\`

### Regla de oro

> **SIEMPRE usa \`===\` y \`!==\`**. La igualdad debil (\`==\`) tiene reglas de coercion confusas y es fuente de bugs. El unico caso aceptable de \`==\` es comparar con \`null\` (\`valor == null\` verifica null Y undefined).`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>5 == '5' → " + (5 == "5") + "</p>";\n  res.innerHTML += "<p>5 === '5' → " + (5 === "5") + "</p>";\n  res.innerHTML += "<p>0 == false → " + (0 == false) + "</p>";\n  res.innerHTML += "<p>0 === false → " + (0 === false) + "</p>";\n  res.innerHTML += "<p>null == undefined → " + (null == undefined) + "</p>";\n  res.innerHTML += "<p>null === undefined → " + (null === undefined) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #c586c0; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js03-leccion-03",
      title: "Operadores logicos, ternario y nullish coalescing",
      content: `## Operadores logicos

Los operadores logicos trabajan con valores **booleanos** (o que se evaluan como tales):

| Operador | Nombre | Descripcion |
|----------|--------|-------------|
| \`&&\` | AND (Y) | \`true\` si **ambos** son true |
| \`\\|\\|\` | OR (O) | \`true\` si **al menos uno** es true |
| \`!\` | NOT (NO) | Invierte el valor booleano |

\`\`\`javascript
true && true     // true
true && false    // false
false || true    // true
false || false   // false
!true            // false
!false           // true
\`\`\`

### Evaluacion en cortocircuito

- \`&&\` devuelve el primer valor **falsy** o el ultimo valor si todos son truthy
- \`||\` devuelve el primer valor **truthy** o el ultimo valor si todos son falsy

\`\`\`javascript
const nombre = "" || "Anonimo";  // "Anonimo" (string vacio es falsy)
const config = null && "valor";  // null
\`\`\`

## Operador ternario

El operador ternario es un **if/else en una linea**:

\`\`\`javascript
const edad = 20;
const mensaje = edad >= 18 ? "Mayor de edad" : "Menor de edad";
// sintaxis: condicion ? valorSiTrue : valorSiFalse
\`\`\`

## Nullish Coalescing (??)

El operador \`??\` devuelve el operando derecho **solo si el izquierdo es \`null\` o \`undefined\`**:

\`\`\`javascript
const valor1 = null ?? "default";    // "default"
const valor2 = undefined ?? "default"; // "default"
const valor3 = 0 ?? "default";       // 0  (0 NO es null/undefined)
const valor4 = "" ?? "default";      // "" (string vacio NO es null/undefined)
\`\`\`

### Diferencia entre || y ??

- \`||\` trata como falsy: \`0\`, \`""\`, \`false\`, \`null\`, \`undefined\`, \`NaN\`
- \`??\` solo trata como nulish: \`null\`, \`undefined\`

> **Usa \`??\` cuando 0, "" o false sean valores validos** que no quieres reemplazar.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  const edad = 20;\n  const estado = edad >= 18 ? "Mayor de edad" : "Menor de edad";\n  res.innerHTML = "<p>Ternario: " + estado + "</p>";\n\n  const nombre = null ?? "Anonimo";\n  res.innerHTML += "<p>?? con null: " + nombre + "</p>";\n\n  const puntaje = 0 ?? "Sin puntaje";\n  res.innerHTML += "<p>?? con 0: " + puntaje + "</p>";\n\n  const puntaje2 = 0 || "Sin puntaje";\n  res.innerHTML += "<p>|| con 0: " + puntaje2 + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #dcdcaa; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js03-ej-01",
      type: "quiz",
      difficulty: 1,
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
      explanation: "10 dividido entre 3 es 3 con resto 1. El operador modulo (%) devuelve ese resto: 1.",
    },
    {
      id: "js03-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: "Que devuelve la expresion 5 === '5'?",
      options: [
        { id: "a", text: "true", isCorrect: false },
        { id: "b", text: "false", isCorrect: true },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El operador === compara tanto valor como tipo.",
      explanation: "=== es igualdad estricta: compara valor Y tipo. 5 es number y '5' es string, por lo tanto son diferentes: false.",
    },
    {
      id: "js03-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Usa el operador ternario para asignar 'Par' o 'Impar' segun el valor de 'numero':",
      codeTemplate: {
        html: `<script>\n  const numero = 7;\n  const tipo = numero % 2 ___ 0 ? "Par" ___ "Impar";\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["===", ":"],
      },
      validation: { type: "exact", answer: ["===", ":"] },
      hint: "El ternario tiene la forma: condicion ? valorTrue : valorFalse",
      explanation: "numero % 2 === 0 verifica si es par. El ternario usa ? para el caso true y : para el caso false.",
    },
    {
      id: "js03-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual es la diferencia entre || y ?? (nullish coalescing)?",
      options: [
        { id: "a", text: "No hay diferencia, son identicos", isCorrect: false },
        { id: "b", text: "|| considera falsy a 0, '', false, null, undefined; ?? solo a null y undefined", isCorrect: true },
        { id: "c", text: "?? es mas rapido que ||", isCorrect: false },
        { id: "d", text: "|| solo funciona con booleanos, ?? con cualquier tipo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que valores 'activan' cada operador.",
      explanation: "|| devuelve el lado derecho si el izquierdo es falsy (0, '', false, null, undefined). ?? solo lo hace si es null o undefined, respetando 0 y '' como valores validos.",
    },
    {
      id: "js03-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Crea un programa que calcule el area de un rectangulo (base=8, altura=5) y muestre en el div resultado: 'El area es: 40'.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "El area es: 40" },
      hint: "Declara base y altura como constantes, multiplicalas y muestra el resultado con textContent.",
      explanation: "El area de un rectangulo es base * altura. Con base=8 y altura=5, el area es 40.",
    },
    {
      id: "js03-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Clasifica cada operador en su categoria correcta:",
      dragItems: [
        { id: "d1", content: "+, -, *, /", correctZone: "z1" },
        { id: "d2", content: "===, !==, >, <", correctZone: "z2" },
        { id: "d3", content: "&&, ||, !", correctZone: "z3" },
        { id: "d4", content: "? :", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Aritmeticos" },
        { id: "z2", label: "Comparacion" },
        { id: "z3", label: "Logicos" },
        { id: "z4", label: "Ternario" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" } },
      hint: "Los aritmeticos hacen calculos, los de comparacion devuelven true/false, los logicos combinan booleanos.",
      explanation: "Los operadores se clasifican segun su funcion: aritmeticos (matematicas), comparacion (igualdad/orden), logicos (AND/OR/NOT) y ternario (condicional en linea).",
    },
    {
      id: "js03-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 7,
      prompt: "Que devuelve la expresion: true && false || true?",
      options: [
        { id: "a", text: "true", isCorrect: true },
        { id: "b", text: "false", isCorrect: false },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "&& tiene mayor precedencia que ||. Evalua && primero.",
      explanation: "Primero se evalua true && false = false. Luego false || true = true. El operador && tiene mayor precedencia que ||.",
    },
    {
      id: "js03-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 20,
      order: 8,
      prompt: "Usa el operador nullish coalescing para asignar un valor por defecto cuando la variable es null:",
      codeTemplate: {
        html: `<script>\n  const config = null;\n  const valor = config ___ "valor por defecto";\n  console.log(valor); // "valor por defecto"\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["??"],
      },
      validation: { type: "exact", answer: ["??"] },
      hint: "El operador tiene dos signos de interrogacion.",
      explanation: "El operador ?? (nullish coalescing) devuelve el operando derecho cuando el izquierdo es null o undefined.",
    },
  ],
};
