import type { ModuleData } from "@/types";

export const jsFuncionesModule: ModuleData = {
  slug: "js-funciones",
  title: "Funciones",
  description:
    "Aprende a crear y utilizar funciones en JavaScript: declaraciones, expresiones, arrow functions, parametros, return y scope.",
  order: 107,
  dojo: "js",
  category: "js-fundamentals",
  icon: "function-square",
  lessons: [
    {
      id: "js07-leccion-01",
      title: "Declaracion de funciones",
      content: `## Que es una funcion?

Una **funcion** es un bloque de codigo reutilizable que realiza una tarea especifica. Las funciones son el pilar fundamental de la programacion.

### Declaracion de funcion (function declaration)

\`\`\`javascript
function saludar(nombre) {
  console.log("Hola, " + nombre + "!");
}

saludar("Ana");    // "Hola, Ana!"
saludar("Carlos"); // "Hola, Carlos!"
\`\`\`

**Partes de una funcion:**
1. **function** — palabra clave
2. **saludar** — nombre de la funcion
3. **(nombre)** — parametros (datos de entrada)
4. **{ ... }** — cuerpo de la funcion

### return: devolver un valor

\`\`\`javascript
function sumar(a, b) {
  return a + b;
}

const resultado = sumar(3, 5);  // 8
console.log(resultado);
\`\`\`

**Puntos clave sobre return:**
- \`return\` termina la funcion inmediatamente
- El codigo despues de \`return\` no se ejecuta
- Si no hay \`return\`, la funcion devuelve \`undefined\`

\`\`\`javascript
function verificar(edad) {
  if (edad < 0) {
    return "Edad invalida";  // Sale aqui
  }
  return edad >= 18 ? "Mayor" : "Menor";
}
\`\`\`

### Hoisting

Las declaraciones de funcion se "elevan" al inicio del scope. Puedes llamarlas **antes de declararlas**:

\`\`\`javascript
saludo();  // Funciona!

function saludo() {
  console.log("Hola");
}
\`\`\`

> **Buena practica:** Una funcion debe hacer **una sola cosa** y hacerla bien. Si tu funcion hace muchas cosas, dividela en funciones mas pequenas.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  function calcularArea(base, altura) {\n    return base * altura;\n  }\n\n  function esPositivo(num) {\n    return num > 0;\n  }\n\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Area(5, 3) = " + calcularArea(5, 3) + "</p>";\n  res.innerHTML += "<p>Area(10, 7) = " + calcularArea(10, 7) + "</p>";\n  res.innerHTML += "<p>esPositivo(5) = " + esPositivo(5) + "</p>";\n  res.innerHTML += "<p>esPositivo(-3) = " + esPositivo(-3) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #dcdcaa; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js07-leccion-02",
      title: "Expresiones de funcion y arrow functions",
      content: `## Expresion de funcion (function expression)

Una funcion tambien puede asignarse a una variable:

\`\`\`javascript
const saludar = function(nombre) {
  return "Hola, " + nombre;
};

saludar("Pedro");  // "Hola, Pedro"
\`\`\`

**Diferencia con declaraciones:** Las expresiones de funcion **no tienen hoisting**. Debes declararlas antes de usarlas.

## Arrow functions (funciones flecha)

Las **arrow functions** son una forma mas concisa de escribir funciones, introducida en ES6:

\`\`\`javascript
// Forma completa
const sumar = (a, b) => {
  return a + b;
};

// Return implicito (una sola expresion)
const sumar = (a, b) => a + b;

// Un solo parametro: parentesis opcionales
const doble = n => n * 2;

// Sin parametros: parentesis obligatorios
const saludo = () => "Hola!";
\`\`\`

### Comparacion de sintaxis

\`\`\`javascript
// Declaracion clasica
function cuadrado1(n) { return n * n; }

// Expresion de funcion
const cuadrado2 = function(n) { return n * n; };

// Arrow function
const cuadrado3 = (n) => n * n;
\`\`\`

### Cuando usar cada forma?

| Forma | Uso recomendado |
|-------|----------------|
| Declaracion | Funciones principales, con hoisting |
| Expresion | Callbacks, funciones anonimas |
| Arrow | Callbacks cortos, funciones de una linea |

> **Regla moderna:** Usa **arrow functions** para callbacks y funciones cortas. Usa **declaraciones** para funciones principales de tu programa.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tres formas de escribir la misma funcion\n  function triple1(n) { return n * 3; }\n  const triple2 = function(n) { return n * 3; };\n  const triple3 = (n) => n * 3;\n\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Declaracion: triple1(4) = " + triple1(4) + "</p>";\n  res.innerHTML += "<p>Expresion: triple2(4) = " + triple2(4) + "</p>";\n  res.innerHTML += "<p>Arrow: triple3(4) = " + triple3(4) + "</p>";\n\n  // Arrow function con array\n  const numeros = [1, 2, 3, 4, 5];\n  const dobles = numeros.map(n => n * 2);\n  res.innerHTML += "<p>Dobles: [" + dobles.join(", ") + "]</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #4fc1ff; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js07-leccion-03",
      title: "Parametros y argumentos",
      content: `## Parametros y argumentos

### Parametros por defecto

Puedes asignar valores por defecto a los parametros:

\`\`\`javascript
function saludar(nombre = "Mundo") {
  return "Hola, " + nombre + "!";
}

saludar("Ana");   // "Hola, Ana!"
saludar();        // "Hola, Mundo!"
\`\`\`

### Parametros rest (...rest)

El operador **rest** agrupa los argumentos restantes en un array:

\`\`\`javascript
function sumarTodos(...numeros) {
  let total = 0;
  for (const num of numeros) {
    total += num;
  }
  return total;
}

sumarTodos(1, 2, 3);       // 6
sumarTodos(10, 20, 30, 40); // 100
\`\`\`

### Desestructuracion de parametros

Puedes desestructurar objetos directamente en los parametros:

\`\`\`javascript
function presentar({ nombre, edad, ciudad = "Desconocida" }) {
  return nombre + " tiene " + edad + " anos y vive en " + ciudad;
}

presentar({ nombre: "Ana", edad: 28 });
// "Ana tiene 28 anos y vive en Desconocida"
\`\`\`

### Funciones como argumentos (callbacks)

En JavaScript, las funciones son **valores**. Puedes pasarlas como argumentos:

\`\`\`javascript
function ejecutar(operacion, a, b) {
  return operacion(a, b);
}

const sumar = (a, b) => a + b;
const multiplicar = (a, b) => a * b;

ejecutar(sumar, 3, 5);        // 8
ejecutar(multiplicar, 3, 5);   // 15
\`\`\`

> **Concepto clave:** En JavaScript, las funciones son "ciudadanas de primera clase" (first-class citizens). Puedes asignarlas a variables, pasarlas como argumentos y devolverlas desde otras funciones.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  function crearSaludo(prefijo = "Hola") {\n    return (nombre) => prefijo + ", " + nombre + "!";\n  }\n\n  const saludar = crearSaludo();\n  const despedir = crearSaludo("Adios");\n\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>" + saludar("Ana") + "</p>";\n  res.innerHTML += "<p>" + despedir("Carlos") + "</p>";\n\n  function sumarTodos(...nums) { return nums.reduce((a, b) => a + b, 0); }\n  res.innerHTML += "<p>Suma(1,2,3,4,5) = " + sumarTodos(1,2,3,4,5) + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #dcdcaa; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
    {
      id: "js07-leccion-04",
      title: "Scope (alcance de variables)",
      content: `## Scope: donde viven las variables

El **scope** (alcance) determina donde una variable es accesible en tu codigo.

### Scope global

Variables declaradas fuera de cualquier funcion o bloque:

\`\`\`javascript
const global = "Soy global";

function ejemplo() {
  console.log(global);  // Accesible aqui
}

console.log(global);  // Y aqui tambien
\`\`\`

### Scope de funcion

Variables declaradas dentro de una funcion solo existen **dentro de ella**:

\`\`\`javascript
function ejemplo() {
  const local = "Soy local";
  console.log(local);  // OK
}

// console.log(local);  // Error! No existe fuera
\`\`\`

### Scope de bloque

\`let\` y \`const\` tienen **scope de bloque** (entre llaves \`{ }\`):

\`\`\`javascript
if (true) {
  let bloque = "Existo en el bloque";
  const tambien = "Yo tambien";
  console.log(bloque);  // OK
}
// console.log(bloque);  // Error!

// var NO tiene scope de bloque (por eso lo evitamos):
if (true) {
  var escape = "Me escapo del bloque";
}
console.log(escape);  // "Me escapo del bloque" (problematico!)
\`\`\`

### Closures (clausuras)

Una funcion interna puede acceder a variables de la funcion externa, incluso despues de que esta termine:

\`\`\`javascript
function crearContador() {
  let cuenta = 0;
  return function() {
    cuenta++;
    return cuenta;
  };
}

const contador = crearContador();
console.log(contador());  // 1
console.log(contador());  // 2
console.log(contador());  // 3
\`\`\`

La funcion interna "recuerda" la variable \`cuenta\` de su scope padre. Esto es un **closure**.

> **Regla:** Declara las variables en el scope mas reducido posible. Evita variables globales.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  function crearContador(nombre) {\n    let cuenta = 0;\n    return {\n      incrementar: () => ++cuenta,\n      obtener: () => nombre + ": " + cuenta\n    };\n  }\n\n  const clicks = crearContador("Clicks");\n  const visitas = crearContador("Visitas");\n  clicks.incrementar();\n  clicks.incrementar();\n  clicks.incrementar();\n  visitas.incrementar();\n\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>" + clicks.obtener() + "</p>";\n  res.innerHTML += "<p>" + visitas.obtener() + "</p>";\n  res.innerHTML += "<p>Cada contador es independiente (closure)</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #c586c0; border-radius: 8px; }`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js07-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que devuelve una funcion que no tiene la sentencia 'return'?",
      options: [
        { id: "a", text: "null", isCorrect: false },
        { id: "b", text: "0", isCorrect: false },
        { id: "c", text: "undefined", isCorrect: true },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es un valor que indica 'no se definio ningun valor'.",
      explanation: "Si una funcion no tiene return (o tiene return sin valor), devuelve undefined automaticamente.",
    },
    {
      id: "js07-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la funcion que calcula el doble de un numero:",
      codeTemplate: {
        html: `<script>\n  function doble(___) {\n    ___ numero * 2;\n  }\n  console.log(doble(5)); // 10\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["numero", "return"],
      },
      validation: { type: "exact", answer: ["numero", "return"] },
      hint: "La funcion necesita un parametro y devolver el resultado.",
      explanation: "El parametro 'numero' recibe el valor y 'return' devuelve el resultado de la operacion.",
    },
    {
      id: "js07-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Reescribe esta funcion como arrow function con return implicito:",
      codeTemplate: {
        html: `<script>\n  // function cuadrado(n) { return n * n; }\n  const cuadrado = (n) ___ n ___ n;\n  console.log(cuadrado(4)); // 16\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["=>", "*"],
      },
      validation: { type: "exact", answer: ["=>", "*"] },
      hint: "Las arrow functions usan => y el return implicito se usa cuando hay una sola expresion.",
      explanation: "const cuadrado = (n) => n * n; es la version arrow function con return implicito.",
    },
    {
      id: "js07-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Crea una funcion 'esPar' que reciba un numero y devuelva true si es par, false si no. Prueba con el numero 8 y muestra 'Es par: true' en el div resultado.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Es par: true" },
      hint: "Usa: function esPar(n) { return n % 2 === 0; } y muestra el resultado con textContent.",
      explanation: "La funcion usa el operador modulo: n % 2 === 0 es true cuando el numero es par.",
    },
    {
      id: "js07-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que es un 'closure' en JavaScript?",
      options: [
        { id: "a", text: "Una funcion que se llama a si misma", isCorrect: false },
        { id: "b", text: "Una funcion que recuerda las variables del scope donde fue creada", isCorrect: true },
        { id: "c", text: "Una funcion sin parametros", isCorrect: false },
        { id: "d", text: "Una funcion que no tiene return", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en una funcion interna que 'recuerda' el entorno de la funcion externa.",
      explanation: "Un closure es una funcion que tiene acceso a las variables de su scope externo, incluso despues de que la funcion externa haya terminado de ejecutarse.",
    },
    {
      id: "js07-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Crea una arrow function 'saludar' que reciba un nombre (con valor por defecto 'Mundo') y devuelva 'Hola, [nombre]!'. Muestra el resultado de saludar('JavaScript') en el div: 'Hola, JavaScript!'",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Hola, JavaScript!" },
      hint: "Usa: const saludar = (nombre = 'Mundo') => `Hola, ${nombre}!`;",
      explanation: "Arrow function con parametro por defecto y template literal para crear el mensaje.",
    },
    {
      id: "js07-ej-07",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt: "Relaciona cada tipo de funcion con su caracteristica principal:",
      dragItems: [
        { id: "d1", content: "function declaration", correctZone: "z1" },
        { id: "d2", content: "function expression", correctZone: "z2" },
        { id: "d3", content: "arrow function", correctZone: "z3" },
        { id: "d4", content: "parametro rest (...)", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Tiene hoisting (se puede usar antes de declararla)" },
        { id: "z2", label: "Se asigna a una variable, sin hoisting" },
        { id: "z3", label: "Sintaxis concisa con => y return implicito" },
        { id: "z4", label: "Agrupa argumentos restantes en un array" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" } },
      hint: "Solo las declaraciones (function nombre() {}) tienen hoisting.",
      explanation: "Las declaraciones tienen hoisting, las expresiones se asignan a variables, las arrow son concisas con =>, y rest (...) agrupa argumentos en un array.",
    },
    {
      id: "js07-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "Que imprime este codigo?\n\nlet x = 10;\nfunction cambiar() { let x = 20; }\ncambiar();\nconsole.log(x);",
      options: [
        { id: "a", text: "20", isCorrect: false },
        { id: "b", text: "10", isCorrect: true },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "La variable x dentro de la funcion es una variable LOCAL, diferente de la global.",
      explanation: "La funcion cambiar() declara una variable x local con let. Esta x es diferente de la x global. La x global nunca cambia, sigue siendo 10.",
    },
  ],
};
