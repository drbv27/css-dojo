import type { ModuleData } from "@/types";

export const jsStringsModule: ModuleData = {
  slug: "js-strings",
  title: "Strings (Cadenas de texto)",
  description:
    "Aprende a trabajar con cadenas de texto en JavaScript: template literals, metodos como toUpperCase, includes, slice, split, trim y replace.",
  order: 104,
  dojo: "js",
  category: "js-fundamentals",
  icon: "text",
  lessons: [
    {
      id: "js04-leccion-01",
      title: "Template literals y concatenacion",
      content: `## Creando strings

En JavaScript hay tres formas de crear cadenas de texto:

\`\`\`javascript
const simple = 'Comillas simples';
const doble = "Comillas dobles";
const backtick = \\\`Template literal\\\`;
\`\`\`

### Concatenacion clasica

Puedes unir strings con el operador \`+\`:

\`\`\`javascript
const nombre = "Maria";
const saludo = "Hola, " + nombre + "!";  // "Hola, Maria!"
\`\`\`

### Template literals (la forma moderna)

Los **template literals** usan backticks (\\\`) y permiten:

#### 1. Interpolar variables y expresiones

\`\`\`javascript
const nombre = "Carlos";
const edad = 30;
const mensaje = \\\`\\\${nombre} tiene \\\${edad} anos\\\`;
// "Carlos tiene 30 anos"

const calculo = \\\`2 + 2 = \\\${2 + 2}\\\`;
// "2 + 2 = 4"
\`\`\`

#### 2. Strings multilinea

\`\`\`javascript
const poema = \\\`Roses are red,
Violets are blue,
JavaScript is awesome,
And so are you.\\\`;
\`\`\`

Con comillas normales necesitarias \`\\n\` para cada salto de linea.

### Caracteres de escape

\`\`\`javascript
const comilla = "El dijo \\"Hola\\"";
const salto = "Linea 1\\nLinea 2";
const tab = "Col1\\tCol2";
const barra = "C:\\\\Users\\\\archivo";
\`\`\`

> **Recomendacion:** Usa template literals (\\\`...\\\`) como tu opcion predeterminada. Son mas legibles y versatiles.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const nombre = "Ana";\n  const edad = 25;\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Concatenacion: " + "Hola, " + nombre + "!</p>";\n  res.innerHTML += "<p>Template: " + \`\${nombre} tiene \${edad} anos\` + "</p>";\n  res.innerHTML += "<p>Expresion: " + \`2 + 3 = \${2 + 3}\` + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #ce9178; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js04-leccion-02",
      title: "Propiedades y metodos basicos de strings",
      content: `## Propiedades y metodos de strings

Los strings en JavaScript son **inmutables**: los metodos no modifican el string original, sino que devuelven uno nuevo.

### Propiedad length

\`\`\`javascript
const texto = "JavaScript";
console.log(texto.length);  // 10
\`\`\`

### Acceder a caracteres

\`\`\`javascript
const texto = "Hola";
console.log(texto[0]);        // "H"
console.log(texto[3]);        // "a"
console.log(texto.charAt(1)); // "o"
console.log(texto.at(-1));    // "a" (desde el final)
\`\`\`

### Cambiar mayusculas/minusculas

\`\`\`javascript
const texto = "Hola Mundo";
console.log(texto.toUpperCase());  // "HOLA MUNDO"
console.log(texto.toLowerCase());  // "hola mundo"
\`\`\`

### Buscar dentro de un string

\`\`\`javascript
const frase = "Aprender JavaScript es divertido";

frase.includes("JavaScript");   // true
frase.includes("Python");       // false

frase.startsWith("Aprender");   // true
frase.endsWith("divertido");    // true

frase.indexOf("JavaScript");    // 9 (posicion)
frase.indexOf("Python");        // -1 (no encontrado)
\`\`\`

### Eliminar espacios con trim

\`\`\`javascript
const input = "   hola mundo   ";
console.log(input.trim());       // "hola mundo"
console.log(input.trimStart());  // "hola mundo   "
console.log(input.trimEnd());    // "   hola mundo"
\`\`\`

> **Tip:** \`trim()\` es esencial al procesar datos de formularios donde el usuario puede agregar espacios accidentalmente.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const texto = "  JavaScript es genial  ";\n  const res = document.getElementById("resultado");\n  res.innerHTML = "<p>Original: '" + texto + "'</p>";\n  res.innerHTML += "<p>length: " + texto.length + "</p>";\n  res.innerHTML += "<p>trim(): '" + texto.trim() + "'</p>";\n  res.innerHTML += "<p>toUpperCase(): '" + texto.trim().toUpperCase() + "'</p>";\n  res.innerHTML += "<p>includes('genial'): " + texto.includes("genial") + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #9cdcfe; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js04-leccion-03",
      title: "slice, split y replace",
      content: `## Extraer partes de un string: slice

\`slice(inicio, fin)\` extrae una porcion del string (sin incluir el indice final):

\`\`\`javascript
const texto = "JavaScript";
console.log(texto.slice(0, 4));   // "Java"
console.log(texto.slice(4));      // "Script"
console.log(texto.slice(-6));     // "Script" (desde el final)
console.log(texto.slice(0, -6));  // "Java"
\`\`\`

### Reemplazar texto: replace

\`\`\`javascript
const frase = "Hola Mundo";
console.log(frase.replace("Mundo", "JavaScript"));
// "Hola JavaScript"

// replace solo cambia la PRIMERA ocurrencia:
const texto = "hola hola hola";
console.log(texto.replace("hola", "chao"));
// "chao hola hola"

// replaceAll cambia TODAS:
console.log(texto.replaceAll("hola", "chao"));
// "chao chao chao"
\`\`\`

### Dividir un string: split

\`split(separador)\` divide un string en un **array**:

\`\`\`javascript
const csv = "manzana,banana,cereza";
const frutas = csv.split(",");
// ["manzana", "banana", "cereza"]

const palabras = "Hola Mundo JS".split(" ");
// ["Hola", "Mundo", "JS"]

const letras = "ABC".split("");
// ["A", "B", "C"]
\`\`\`

### Combinar metodos (method chaining)

Puedes encadenar metodos porque cada uno devuelve un nuevo string:

\`\`\`javascript
const email = "  Usuario@Email.COM  ";
const limpio = email.trim().toLowerCase();
// "usuario@email.com"

const nombre = "juan pedro garcia";
const capitalizado = nombre.split(" ")
  .map(p => p[0].toUpperCase() + p.slice(1))
  .join(" ");
// "Juan Pedro Garcia"
\`\`\`

> **Recuerda:** Los strings son inmutables. Cada metodo devuelve un **nuevo string** sin modificar el original.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  const texto = "Aprender JavaScript";\n  res.innerHTML = "<p>slice(0, 8): " + texto.slice(0, 8) + "</p>";\n  res.innerHTML += "<p>slice(9): " + texto.slice(9) + "</p>";\n  res.innerHTML += "<p>replace: " + texto.replace("JavaScript", "JS") + "</p>";\n  const csv = "rojo,verde,azul";\n  res.innerHTML += "<p>split(','): [" + csv.split(",").join(", ") + "]</p>";\n  const email = "  User@Mail.COM  ";\n  res.innerHTML += "<p>trim + lower: " + email.trim().toLowerCase() + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #ce9178; border-radius: 8px; }`,
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js04-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la ventaja principal de los template literals sobre la concatenacion con +?",
      options: [
        { id: "a", text: "Son mas rapidos", isCorrect: false },
        { id: "b", text: "Permiten interpolar variables con ${} y crear strings multilinea", isCorrect: true },
        { id: "c", text: "Solo funcionan con numeros", isCorrect: false },
        { id: "d", text: "No necesitan comillas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en las dos funcionalidades que los hacen especiales.",
      explanation: "Los template literals permiten insertar variables/expresiones con ${} y escribir texto en multiples lineas sin necesidad de \\n.",
    },
    {
      id: "js04-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Convierte el texto a mayusculas usando el metodo correcto:",
      codeTemplate: {
        html: `<script>\n  const texto = "hola mundo";\n  const mayusculas = texto.___();\n  // resultado: "HOLA MUNDO"\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["toUpperCase"],
      },
      validation: { type: "exact", answer: ["toUpperCase"] },
      hint: "El metodo convierte a 'upper case' (mayusculas).",
      explanation: "toUpperCase() devuelve una nueva cadena con todos los caracteres convertidos a mayusculas.",
    },
    {
      id: "js04-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "Que devuelve 'JavaScript'.slice(0, 4)?",
      options: [
        { id: "a", text: "\"Java\"", isCorrect: true },
        { id: "b", text: "\"JavaS\"", isCorrect: false },
        { id: "c", text: "\"avaS\"", isCorrect: false },
        { id: "d", text: "\"Scri\"", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "slice(inicio, fin) no incluye el caracter en la posicion 'fin'.",
      explanation: "slice(0, 4) extrae desde el indice 0 hasta el 3 (no incluye el 4): 'J'(0) + 'a'(1) + 'v'(2) + 'a'(3) = 'Java'.",
    },
    {
      id: "js04-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Dado el string '  javascript es divertido  ', elimina los espacios extra con trim(), convierte a mayusculas y muestra el resultado en el div. El texto final debe ser: 'JAVASCRIPT ES DIVERTIDO'.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  const texto = "  javascript es divertido  ";\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "JAVASCRIPT ES DIVERTIDO" },
      hint: "Encadena .trim().toUpperCase() y asigna el resultado al textContent del div.",
      explanation: "Puedes encadenar metodos: texto.trim().toUpperCase() primero elimina espacios y luego convierte a mayusculas.",
    },
    {
      id: "js04-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Divide la cadena de frutas por comas para obtener un array:",
      codeTemplate: {
        html: `<script>\n  const csv = "manzana,banana,cereza";\n  const frutas = csv.___(___); \n  // resultado: ["manzana", "banana", "cereza"]\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["split", "\",\""],
      },
      validation: { type: "exact", answer: ["split", "\",\""] },
      hint: "El metodo divide un string por un separador. El separador es una coma.",
      explanation: "split(',') divide el string en cada coma, creando un array con las partes.",
    },
    {
      id: "js04-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que devuelve 'Hola Mundo'.includes('mundo')?",
      options: [
        { id: "a", text: "true", isCorrect: false },
        { id: "b", text: "false", isCorrect: true },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "0", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "JavaScript distingue entre mayusculas y minusculas.",
      explanation: "includes() es case-sensitive: 'Mundo' (con M mayuscula) no es igual a 'mundo' (con m minuscula), por lo que devuelve false.",
    },
    {
      id: "js04-ej-07",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt: "Relaciona cada metodo de string con lo que hace:",
      dragItems: [
        { id: "d1", content: ".trim()", correctZone: "z1" },
        { id: "d2", content: ".split()", correctZone: "z2" },
        { id: "d3", content: ".replace()", correctZone: "z3" },
        { id: "d4", content: ".slice()", correctZone: "z4" },
        { id: "d5", content: ".includes()", correctZone: "z5" },
      ],
      dropZones: [
        { id: "z1", label: "Elimina espacios al inicio y final" },
        { id: "z2", label: "Divide el string en un array" },
        { id: "z3", label: "Sustituye texto por otro" },
        { id: "z4", label: "Extrae una porcion del string" },
        { id: "z5", label: "Verifica si contiene un texto" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4", d5: "z5" } },
      hint: "trim = recortar, split = dividir, replace = reemplazar, slice = rebanar.",
      explanation: "Cada metodo tiene una funcion especifica: trim elimina espacios, split divide, replace sustituye, slice extrae y includes verifica presencia.",
    },
  ],
};
