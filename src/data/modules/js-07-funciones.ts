import type { ModuleData } from "@/types";

export const jsFuncionesModule: ModuleData = {
  slug: "js-funciones",
  title: "Funciones",
  description:
    "Aprende a crear y usar funciones: declaraciones, expresiones, arrow functions y parametros.",
  order: 107,
  category: "js-fundamentals",
  icon: "Braces",
  dojo: "js",
  lessons: [
    {
      id: "js07-leccion-01",
      title: "Declaracion de funciones",
      content: `## Funciones en JavaScript

Una **funcion** es un bloque de codigo reutilizable que realiza una tarea especifica.

### Declaracion de funcion

\`\`\`javascript
function saludar(nombre) {
  return "Hola, " + nombre + "!";
}
\`\`\`

### Partes de una funcion
1. **Nombre:** identificador de la funcion (\`saludar\`)
2. **Parametros:** valores de entrada entre parentesis (\`nombre\`)
3. **Cuerpo:** codigo entre llaves
4. **return:** valor que devuelve la funcion

### Invocar una funcion

\`\`\`javascript
const resultado = saludar("Ana"); // "Hola, Ana!"
\`\`\`

### Parametros por defecto

\`\`\`javascript
function saludar(nombre = "Mundo") {
  return "Hola, " + nombre + "!";
}
saludar();      // "Hola, Mundo!"
saludar("Ana"); // "Hola, Ana!"
\`\`\`

> **Tip:** Las funciones deben hacer UNA sola cosa y hacerla bien. Si hace demasiado, dividela en funciones mas pequenas.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `function sumar(a, b) {
  return a + b;
}

function saludar(nombre) {
  return "Hola, " + nombre + "!";
}

function calcularArea(base, altura) {
  return (base * altura) / 2;
}

const salida = [];
salida.push("sumar(3, 5) = " + sumar(3, 5));
salida.push(saludar("Estudiante"));
salida.push("Area triangulo (6, 4) = " + calcularArea(6, 4));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js07-leccion-02",
      title: "Arrow functions",
      content: `## Arrow Functions (funciones flecha)

Las arrow functions son una sintaxis mas corta para escribir funciones:

### Sintaxis basica
\`\`\`javascript
const sumar = (a, b) => {
  return a + b;
};
\`\`\`

### Retorno implicito (una linea)
Si el cuerpo es una sola expresion, puedes omitir las llaves y el return:
\`\`\`javascript
const sumar = (a, b) => a + b;
\`\`\`

### Un solo parametro
Con un parametro, puedes omitir los parentesis:
\`\`\`javascript
const doble = x => x * 2;
\`\`\`

### Sin parametros
\`\`\`javascript
const saludar = () => "Hola!";
\`\`\`

### Cuando usar cada una?
- **Funciones normales:** cuando necesitas hoisting o this propio
- **Arrow functions:** para callbacks, funciones cortas y metodos de arrays

> **Hoisting:** Las funciones declaradas con \`function\` se pueden usar antes de declararlas. Las arrow functions NO.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `// Arrow functions
const doble = x => x * 2;
const sumar = (a, b) => a + b;
const saludar = () => "Hola desde arrow function!";

const salida = [];
salida.push(saludar());
salida.push("doble(7) = " + doble(7));
salida.push("sumar(10, 20) = " + sumar(10, 20));

// Con arrays
const numeros = [1, 2, 3, 4, 5];
const dobles = numeros.map(n => n * 2);
salida.push("Dobles: " + dobles.join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js07-leccion-03",
      title: "Scope y closures",
      content: `## Scope (alcance)

El **scope** determina donde una variable es accesible.

### Scope global
Variables declaradas fuera de cualquier funcion:
\`\`\`javascript
const global = "soy global";
\`\`\`

### Scope de funcion
Variables declaradas dentro de una funcion (solo con var):
\`\`\`javascript
function ejemplo() {
  var local = "solo aqui";
}
\`\`\`

### Scope de bloque
Variables con let/const dentro de llaves:
\`\`\`javascript
if (true) {
  let bloque = "solo en este bloque";
  const otro = "tambien solo aqui";
}
\`\`\`

## Closures

Un **closure** es una funcion que recuerda las variables del scope donde fue creada:

\`\`\`javascript
function crearContador() {
  let cuenta = 0;
  return function() {
    cuenta++;
    return cuenta;
  };
}
const contador = crearContador();
contador(); // 1
contador(); // 2
\`\`\`

> **Closure** es uno de los conceptos mas poderosos de JavaScript. Permite crear datos privados y fabricas de funciones.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        js: `// Closure: contador
function crearContador() {
  let cuenta = 0;
  return function() {
    cuenta++;
    return cuenta;
  };
}

const contador = crearContador();
const salida = [];
salida.push("Contador: " + contador());
salida.push("Contador: " + contador());
salida.push("Contador: " + contador());

// Closure: multiplicador
function crearMultiplicador(factor) {
  return function(numero) {
    return numero * factor;
  };
}

const triple = crearMultiplicador(3);
const decuple = crearMultiplicador(10);
salida.push("triple(5) = " + triple(5));
salida.push("decuple(5) = " + decuple(5));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js07-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que palabra clave se usa para que una funcion devuelva un valor?",
      options: [
        { id: "a", text: "output", isCorrect: false },
        { id: "b", text: "return", isCorrect: true },
        { id: "c", text: "yield", isCorrect: false },
        { id: "d", text: "send", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En ingles significa 'devolver' o 'retornar'.",
      explanation: "return devuelve un valor desde la funcion y termina su ejecucion.",
    },
    {
      id: "js07-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Completa la arrow function que duplica un numero:",
      codeTemplate: {
        html: "",
        cssPrefix: "const doble = x ",
        cssSuffix: " x * 2;",
        blanks: ["=>"],
      },
      validation: { type: "exact", answer: "=>" },
      hint: "La flecha de una arrow function se escribe con = y >.",
      explanation: "=> es la sintaxis de las arrow functions. const doble = x => x * 2;",
    },
    {
      id: "js07-ej-03",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Que devuelve una funcion si no tiene return?",
      options: [
        { id: "a", text: "null", isCorrect: false },
        { id: "b", text: "0", isCorrect: false },
        { id: "c", text: "undefined", isCorrect: true },
        { id: "d", text: '""', isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es el valor por defecto cuando algo no tiene valor asignado.",
      explanation: "Si una funcion no tiene return o tiene return sin valor, devuelve undefined.",
    },
    {
      id: "js07-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Cual de estas es una arrow function valida?",
      options: [
        { id: "a", text: "const f = => x * 2;", isCorrect: false },
        { id: "b", text: "const f = x => x * 2;", isCorrect: true },
        { id: "c", text: "const f = x -> x * 2;", isCorrect: false },
        { id: "d", text: "const f = function => x * 2;", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Con un solo parametro, no necesitas parentesis.",
      explanation: "const f = x => x * 2 es la sintaxis correcta. Con un parametro los parentesis son opcionales.",
    },
    {
      id: "js07-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que es un closure en JavaScript?",
      options: [
        { id: "a", text: "Una funcion que se ejecuta inmediatamente", isCorrect: false },
        { id: "b", text: "Una funcion que recuerda las variables de su scope de creacion", isCorrect: true },
        { id: "c", text: "Una funcion sin parametros", isCorrect: false },
        { id: "d", text: "Una funcion que no devuelve nada", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El closure 'encierra' las variables del entorno donde fue creado.",
      explanation:
        "Un closure es una funcion que mantiene acceso a las variables del scope en el que fue definida, incluso despues de que ese scope haya terminado.",
    },
    {
      id: "js07-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada tipo de funcion:",
      dragItems: [
        { id: "drag-1", content: "function sumar(a, b) { }", correctZone: "zone-declaracion" },
        { id: "drag-2", content: "const f = function() { }", correctZone: "zone-expresion" },
        { id: "drag-3", content: "const f = () => { }", correctZone: "zone-arrow" },
      ],
      dropZones: [
        { id: "zone-declaracion", label: "Declaracion de funcion" },
        { id: "zone-expresion", label: "Expresion de funcion" },
        { id: "zone-arrow", label: "Arrow function" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-declaracion",
          "drag-2": "zone-expresion",
          "drag-3": "zone-arrow",
        },
      },
      hint: "La declaracion usa function como primera palabra, la expresion la asigna a una variable, y la arrow usa =>.",
      explanation:
        "Las tres formas de crear funciones: declaracion (function nombre), expresion (asignada a variable), y arrow function (usa =>).",
    },
  ],
};
