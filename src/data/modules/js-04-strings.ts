import type { ModuleData } from "@/types";

export const jsStringsModule: ModuleData = {
  slug: "js-strings",
  title: "Strings (Cadenas de Texto)",
  description:
    "Aprende a trabajar con cadenas de texto: metodos, template literals y manipulacion de strings.",
  order: 104,
  category: "js-fundamentals",
  icon: "Type",
  dojo: "js",
  lessons: [
    {
      id: "js04-leccion-01",
      title: "Creacion y propiedades",
      content: `## Strings en JavaScript

Un **string** es una secuencia de caracteres. Se puede crear con comillas simples, dobles o backticks:

\`\`\`javascript
const simple = 'Hola';
const doble = "Mundo";
\`\`\`

### Propiedad length

Devuelve la cantidad de caracteres:

\`\`\`javascript
"Hola".length  // 4
\`\`\`

### Acceso a caracteres

Los strings son como arrays de caracteres (indice desde 0):

\`\`\`javascript
const texto = "JavaScript";
texto[0]       // "J"
texto[4]       // "S"
texto.charAt(0) // "J"
\`\`\`

### Inmutabilidad

Los strings son **inmutables**: no puedes cambiar un caracter directamente. Debes crear un nuevo string.

> **Nota:** Los indices empiezan en 0, no en 1.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const texto = "JavaScript";
const salida = [];
salida.push("Texto: " + texto);
salida.push("Longitud: " + texto.length);
salida.push("Primer caracter: " + texto[0]);
salida.push("Ultimo caracter: " + texto[texto.length - 1]);
salida.push("charAt(4): " + texto.charAt(4));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js04-leccion-02",
      title: "Metodos de strings",
      content: `## Metodos comunes de strings

### Busqueda
- \`includes(texto)\` — devuelve true/false si contiene el texto
- \`indexOf(texto)\` — devuelve la posicion (o -1 si no existe)
- \`startsWith(texto)\` / \`endsWith(texto)\`

### Transformacion
- \`toUpperCase()\` — convierte a mayusculas
- \`toLowerCase()\` — convierte a minusculas
- \`trim()\` — elimina espacios al inicio y final
- \`replace(buscar, reemplazar)\` — reemplaza la primera coincidencia
- \`replaceAll(buscar, reemplazar)\` — reemplaza todas

### Extraccion
- \`slice(inicio, fin)\` — extrae una porcion del string
- \`substring(inicio, fin)\` — similar a slice
- \`split(separador)\` — divide el string en un array

> **Recuerda:** Todos los metodos devuelven un **nuevo string** sin modificar el original.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `const frase = "  Hola Mundo JavaScript  ";
const salida = [];
salida.push("Original: '" + frase + "'");
salida.push("trim(): '" + frase.trim() + "'");
salida.push("toUpperCase(): " + frase.trim().toUpperCase());
salida.push("toLowerCase(): " + frase.trim().toLowerCase());
salida.push('includes("Mundo"): ' + frase.includes("Mundo"));
salida.push('indexOf("Mundo"): ' + frase.indexOf("Mundo"));
salida.push("slice(2, 6): '" + frase.slice(2, 6) + "'");
salida.push('replace("Mundo", "JS"): ' + frase.trim().replace("Mundo", "JS"));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js04-leccion-03",
      title: "Template literals",
      content: `## Template Literals

Los **template literals** usan backticks y permiten:

### 1. Interpolacion de variables

En lugar de concatenar con +, puedes insertar variables directamente:

\`\`\`javascript
const nombre = "Ana";
const edad = 25;
// Concatenacion clasica
"Me llamo " + nombre + " y tengo " + edad + " anos"
// Template literal
\\\`Me llamo \${nombre} y tengo \${edad} anos\\\`
\`\`\`

### 2. Strings multilinea

\`\`\`javascript
const poema = \\\`Primera linea
Segunda linea
Tercera linea\\\`;
\`\`\`

### 3. Expresiones dentro de \${}

Puedes poner cualquier expresion JavaScript:

\`\`\`javascript
\\\`El doble de 5 es \${5 * 2}\\\`
\\\`Es mayor de edad: \${edad >= 18 ? "Si" : "No"}\\\`
\`\`\`

> **Tip:** Los template literals son la forma preferida de crear strings complejos en JavaScript moderno.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `const nombre = "Carlos";
const edad = 30;
const lenguaje = "JavaScript";

const mensaje = "Me llamo " + nombre + "\\nTengo " + edad + " anos\\nEstoy aprendiendo " + lenguaje + "\\nEl doble de mi edad es " + (edad * 2) + "\\nSoy mayor de edad: " + (edad >= 18 ? "Si" : "No");
document.getElementById("resultado").textContent = mensaje;`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js04-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: 'Que devuelve "JavaScript".length?',
      options: [
        { id: "a", text: "9", isCorrect: false },
        { id: "b", text: "10", isCorrect: true },
        { id: "c", text: "11", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Cuenta cada caracter, incluyendo mayusculas.",
      explanation:
        '"JavaScript" tiene 10 caracteres: J-a-v-a-S-c-r-i-p-t.',
    },
    {
      id: "js04-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: 'Que devuelve "Hola"[0]?',
      options: [
        { id: "a", text: '"Hola"', isCorrect: false },
        { id: "b", text: '"H"', isCorrect: true },
        { id: "c", text: '"o"', isCorrect: false },
        { id: "d", text: "undefined", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los indices empiezan en 0.",
      explanation:
        'El indice 0 es el primer caracter. "Hola"[0] devuelve "H".',
    },
    {
      id: "js04-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa el metodo para convertir el texto a mayusculas:",
      codeTemplate: {
        html: "",
        cssPrefix: 'const resultado = "hola".to',
        cssSuffix: "();",
        blanks: ["UpperCase"],
      },
      validation: { type: "exact", answer: "UpperCase" },
      hint: "El metodo tiene Upper y Case con la primera letra en mayuscula.",
      explanation:
        'toUpperCase() convierte todo el string a mayusculas: "hola".toUpperCase() = "HOLA".',
    },
    {
      id: "js04-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: 'Que metodo usarias para verificar si un string contiene la palabra "mundo"?',
      options: [
        { id: "a", text: "contains()", isCorrect: false },
        { id: "b", text: "has()", isCorrect: false },
        { id: "c", text: "includes()", isCorrect: true },
        { id: "d", text: "find()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El nombre del metodo significa 'incluye' en ingles.",
      explanation:
        'includes() devuelve true si el string contiene el texto buscado: "Hola mundo".includes("mundo") = true.',
    },
    {
      id: "js04-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: 'Que devuelve "Hola Mundo".split(" ")?',
      options: [
        { id: "a", text: '"Hola Mundo"', isCorrect: false },
        { id: "b", text: '["Hola", "Mundo"]', isCorrect: true },
        { id: "c", text: '["H","o","l","a"," ","M","u","n","d","o"]', isCorrect: false },
        { id: "d", text: "2", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "split divide el string en un array usando el separador dado.",
      explanation:
        'split(" ") divide el string por cada espacio y devuelve un array: ["Hola", "Mundo"].',
    },
    {
      id: "js04-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: 'Que devuelve "  Hola  ".trim()?',
      options: [
        { id: "a", text: '"Hola"', isCorrect: true },
        { id: "b", text: '"  Hola  "', isCorrect: false },
        { id: "c", text: '"Hola  "', isCorrect: false },
        { id: "d", text: '"  Hola"', isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "trim elimina espacios de ambos extremos.",
      explanation:
        'trim() elimina espacios en blanco al inicio y al final del string, resultando en "Hola".',
    },
  ],
};
