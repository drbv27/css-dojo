import type { ModuleData } from "@/types";

export const jsEs6ModernoModule: ModuleData = {
  slug: "js-es6-moderno",
  title: "ES6+ JavaScript Moderno",
  description:
    "Domina las caracteristicas modernas de JavaScript: desestructuracion, spread, optional chaining, modulos y mas.",
  order: 119,
  category: "js-advanced",
  icon: "Sparkles",
  dojo: "js",
  lessons: [
    {
      id: "js19-leccion-01",
      title: "Desestructuracion y spread avanzados",
      content: `## Desestructuracion avanzada

### Desestructuracion anidada
\`\`\`javascript
const usuario = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid", pais: "Espana" }
};
const { direccion: { ciudad } } = usuario;
// ciudad = "Madrid"
\`\`\`

### Rest en desestructuracion
\`\`\`javascript
const { nombre, ...resto } = usuario;
// resto = { direccion: { ciudad: "Madrid", pais: "Espana" } }

const [primero, ...demas] = [1, 2, 3, 4];
// primero = 1, demas = [2, 3, 4]
\`\`\`

### Spread avanzado
\`\`\`javascript
// Copiar y modificar objetos
const actualizado = { ...usuario, nombre: "Carlos" };

// Fusionar objetos
const config = { ...defaultConfig, ...userConfig };

// Copiar arrays sin referencia
const copia = [...original];
\`\`\`

### Parametros desestructurados
\`\`\`javascript
function crearUsuario({ nombre, edad, rol = "usuario" }) {
  return { nombre, edad, rol };
}
\`\`\`

> El spread operator es fundamental en React y frameworks modernos para inmutabilidad.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `var usuario = {
  nombre: "Ana",
  edad: 25,
  direccion: { ciudad: "Madrid", pais: "Espana" }
};

var salida = [];

// Desestructuracion anidada
var ciudad = usuario.direccion.ciudad;
salida.push("Ciudad: " + ciudad);

// Spread - copiar y modificar
var actualizado = Object.assign({}, usuario, { nombre: "Carlos", edad: 30 });
salida.push("Original: " + usuario.nombre + ", " + usuario.edad);
salida.push("Actualizado: " + actualizado.nombre + ", " + actualizado.edad);

// Rest con arrays
var numeros = [1, 2, 3, 4, 5];
var primero = numeros[0];
var demas = numeros.slice(1);
salida.push("Primero: " + primero);
salida.push("Demas: " + demas.join(", "));

// Fusion de objetos
var defaults = { tema: "claro", idioma: "es", tamano: 16 };
var prefs = { tema: "oscuro", tamano: 18 };
var config = Object.assign({}, defaults, prefs);
salida.push("Config: " + JSON.stringify(config));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js19-leccion-02",
      title: "Optional chaining y nullish coalescing",
      content: `## Optional Chaining (?.)

Accede a propiedades anidadas de forma segura, sin error si un valor intermedio es null/undefined:

\`\`\`javascript
const ciudad = usuario?.direccion?.ciudad;
// Si usuario o direccion es null/undefined, devuelve undefined en vez de error

const resultado = arr?.[0];           // acceso a arrays
const valor = objeto?.metodo?.();     // llamada a metodos
\`\`\`

## Nullish Coalescing (??)

Devuelve el valor derecho SOLO si el izquierdo es \`null\` o \`undefined\`:

\`\`\`javascript
const nombre = usuario.nombre ?? "Anonimo";
// Diferencia con ||:
0 || "default"    // "default" (0 es falsy)
0 ?? "default"    // 0 (0 no es null/undefined)
"" || "default"   // "default"
"" ?? "default"   // ""
\`\`\`

## Asignacion logica

\`\`\`javascript
x ??= valor;  // x = x ?? valor
x ||= valor;  // x = x || valor
x &&= valor;  // x = x && valor
\`\`\`

> \`??\` es mas preciso que \`||\` porque solo reacciona a null/undefined, no a todos los valores falsy.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `var salida = [];

// Optional chaining
var usuario = { nombre: "Ana", direccion: { ciudad: "Madrid" } };
var sinDireccion = { nombre: "Luis" };

salida.push("Ciudad de Ana: " + (usuario.direccion ? usuario.direccion.ciudad : undefined));
salida.push("Ciudad de Luis: " + (sinDireccion.direccion ? sinDireccion.direccion.ciudad : undefined));

// Nullish coalescing vs OR
var valor0 = 0;
var valorVacio = "";
var valorNull = null;

salida.push("--- || vs ?? ---");
salida.push("0 || 'default': " + (valor0 || "default"));
salida.push("0 ?? 'default': " + (valor0 != null ? valor0 : "default"));
salida.push('"" || "default": ' + (valorVacio || "default"));
salida.push('"" ?? "default": ' + (valorVacio != null ? valorVacio : "default"));
salida.push("null || 'default': " + (valorNull || "default"));
salida.push("null ?? 'default': " + (valorNull != null ? valorNull : "default"));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js19-leccion-03",
      title: "Map, Set y otras utilidades",
      content: `## Map

Un **Map** es como un objeto pero con ventajas:
- Las claves pueden ser de **cualquier tipo**
- Mantiene el **orden de insercion**
- Tiene metodo \`.size\`

\`\`\`javascript
const mapa = new Map();
mapa.set("nombre", "Ana");
mapa.set(42, "un numero");
mapa.get("nombre"); // "Ana"
mapa.has(42);       // true
mapa.size;          // 2
\`\`\`

## Set

Un **Set** es una coleccion de valores **unicos**:

\`\`\`javascript
const conjunto = new Set([1, 2, 2, 3, 3, 3]);
// Set {1, 2, 3}
conjunto.add(4);
conjunto.has(2);    // true
conjunto.size;      // 4

// Eliminar duplicados de un array
const unicos = [...new Set(array)];
\`\`\`

## Otras utilidades ES6+

### Object shorthand
\`\`\`javascript
const nombre = "Ana";
const edad = 25;
const persona = { nombre, edad };
// equivale a { nombre: nombre, edad: edad }
\`\`\`

### Computed property names
\`\`\`javascript
const campo = "email";
const obj = { [campo]: "ana@email.com" };
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `var salida = [];

// Set - valores unicos
var numeros = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
var unicos = [];
var visto = {};
numeros.forEach(function(n) {
  if (!visto[n]) {
    visto[n] = true;
    unicos.push(n);
  }
});
salida.push("Original: " + numeros.join(", "));
salida.push("Unicos: " + unicos.join(", "));

// Map
var mapa = new Map();
mapa.set("js", "JavaScript");
mapa.set("py", "Python");
mapa.set("ts", "TypeScript");

salida.push("\\nMap de lenguajes:");
mapa.forEach(function(valor, clave) {
  salida.push("  " + clave + " -> " + valor);
});
salida.push("Tamano: " + mapa.size);
salida.push("Tiene 'js': " + mapa.has("js"));

// Object shorthand
var nombre = "Ana";
var edad = 25;
var persona = { nombre: nombre, edad: edad };
salida.push("\\nPersona: " + JSON.stringify(persona));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js19-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que hace el operador spread (...)?",
      options: [
        { id: "a", text: "Compara dos valores", isCorrect: false },
        { id: "b", text: "Expande un iterable en elementos individuales", isCorrect: true },
        { id: "c", text: "Crea un nuevo tipo de dato", isCorrect: false },
        { id: "d", text: "Declara una variable global", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Spread = expandir/esparcir.",
      explanation: "El operador spread (...) expande arrays u objetos en sus elementos individuales.",
    },
    {
      id: "js19-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: 'Que devuelve 0 ?? "default"?',
      options: [
        { id: "a", text: '"default"', isCorrect: false },
        { id: "b", text: "0", isCorrect: true },
        { id: "c", text: "null", isCorrect: false },
        { id: "d", text: "undefined", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "?? solo actua con null o undefined, no con 0.",
      explanation: "?? (nullish coalescing) devuelve el lado derecho solo si el izquierdo es null/undefined. 0 no es null ni undefined.",
    },
    {
      id: "js19-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que estructura de datos garantiza que no haya elementos duplicados?",
      options: [
        { id: "a", text: "Array", isCorrect: false },
        { id: "b", text: "Object", isCorrect: false },
        { id: "c", text: "Set", isCorrect: true },
        { id: "d", text: "Map", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Set = conjunto (sin repeticiones).",
      explanation: "Un Set solo almacena valores unicos. Si intentas agregar un duplicado, lo ignora.",
    },
    {
      id: "js19-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que ventaja tiene Map sobre un objeto regular?",
      options: [
        { id: "a", text: "Es mas rapido", isCorrect: false },
        { id: "b", text: "Las claves pueden ser de cualquier tipo", isCorrect: true },
        { id: "c", text: "Usa menos memoria", isCorrect: false },
        { id: "d", text: "Es inmutable", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En un objeto regular las claves solo pueden ser strings o symbols.",
      explanation: "En un Map las claves pueden ser de cualquier tipo (objetos, funciones, numeros), no solo strings.",
    },
    {
      id: "js19-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que hace el optional chaining (?.) cuando encuentra un valor null en la cadena?",
      options: [
        { id: "a", text: "Lanza un error", isCorrect: false },
        { id: "b", text: "Devuelve null", isCorrect: false },
        { id: "c", text: "Devuelve undefined", isCorrect: true },
        { id: "d", text: "Devuelve false", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Cortocircuita y devuelve un valor por defecto.",
      explanation: "Si alguna parte de la cadena es null o undefined, el optional chaining devuelve undefined sin lanzar error.",
    },
    {
      id: "js19-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Completa para eliminar duplicados de un array usando Set:",
      codeTemplate: {
        html: "",
        cssPrefix: "const unicos = [...new ",
        cssSuffix: "(miArray)];",
        blanks: ["Set"],
      },
      validation: { type: "exact", answer: "Set" },
      hint: "La estructura que no permite duplicados.",
      explanation: "[...new Set(array)] crea un Set (sin duplicados) y lo convierte de vuelta a array con spread.",
    },
  ],
};
