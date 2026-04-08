import type { ModuleData } from "@/types";

export const jsObjetosModule: ModuleData = {
  slug: "js-objetos",
  title: "Objetos",
  description:
    "Aprende a crear y manipular objetos: propiedades, metodos, desestructuracion y Object methods.",
  order: 110,
  category: "js-intermediate",
  icon: "Box",
  dojo: "js",
  lessons: [
    {
      id: "js10-leccion-01",
      title: "Crear y acceder a objetos",
      content: `## Objetos en JavaScript

Un **objeto** es una coleccion de pares **clave-valor**:

\`\`\`javascript
const persona = {
  nombre: "Ana",
  edad: 25,
  activa: true
};
\`\`\`

### Acceder a propiedades

Dos formas:
\`\`\`javascript
persona.nombre      // notacion de punto
persona["nombre"]   // notacion de corchetes
\`\`\`

Usa corchetes cuando la clave es dinamica o tiene caracteres especiales.

### Modificar y agregar
\`\`\`javascript
persona.edad = 26;          // modificar
persona.email = "a@b.com";  // agregar nueva propiedad
delete persona.activa;       // eliminar propiedad
\`\`\`

### Verificar si existe una propiedad
\`\`\`javascript
"nombre" in persona           // true
persona.hasOwnProperty("edad") // true
\`\`\`

> **Nota:** Los objetos son por referencia. Al asignar un objeto a otra variable, ambas apuntan al mismo objeto.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const persona = {
  nombre: "Ana",
  edad: 25,
  ciudad: "Madrid"
};

const salida = [];
salida.push("Nombre: " + persona.nombre);
salida.push("Edad: " + persona["edad"]);

persona.email = "ana@email.com";
salida.push("Email agregado: " + persona.email);

salida.push("Tiene 'ciudad': " + ("ciudad" in persona));

// Recorrer propiedades
salida.push("--- Todas las propiedades ---");
for (var clave in persona) {
  salida.push("  " + clave + ": " + persona[clave]);
}

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js10-leccion-02",
      title: "Metodos y desestructuracion",
      content: `## Metodos del objeto

Un metodo es una funcion dentro de un objeto:

\`\`\`javascript
const calculadora = {
  sumar: function(a, b) { return a + b; },
  restar(a, b) { return a - b; } // sintaxis corta
};
\`\`\`

## Desestructuracion de objetos

Extrae propiedades en variables:

\`\`\`javascript
const { nombre, edad } = persona;
// nombre = "Ana", edad = 25
\`\`\`

Con renombrado:
\`\`\`javascript
const { nombre: n, edad: e } = persona;
\`\`\`

Con valor por defecto:
\`\`\`javascript
const { pais = "Desconocido" } = persona;
\`\`\`

## Spread operator con objetos

\`\`\`javascript
const copia = { ...persona };
const actualizado = { ...persona, edad: 26 };
const fusionado = { ...obj1, ...obj2 };
\`\`\`

> **Tip:** Spread crea una copia superficial (shallow copy). Los objetos anidados siguen siendo por referencia.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `const persona = {
  nombre: "Carlos",
  edad: 30,
  saludar: function() {
    return "Hola, soy " + this.nombre;
  }
};

const salida = [];
salida.push(persona.saludar());

// Desestructuracion
var nombre = persona.nombre;
var edad = persona.edad;
salida.push("Desestructurado: " + nombre + ", " + edad);

// Spread - copia y modificacion
var actualizado = Object.assign({}, persona, { edad: 31, ciudad: "Lima" });
delete actualizado.saludar;
salida.push("Actualizado edad: " + actualizado.edad);
salida.push("Ciudad: " + actualizado.ciudad);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js10-leccion-03",
      title: "Object methods",
      content: `## Metodos estaticos de Object

### Object.keys() — array de claves
\`\`\`javascript
const obj = { a: 1, b: 2, c: 3 };
Object.keys(obj) // ["a", "b", "c"]
\`\`\`

### Object.values() — array de valores
\`\`\`javascript
Object.values(obj) // [1, 2, 3]
\`\`\`

### Object.entries() — array de pares [clave, valor]
\`\`\`javascript
Object.entries(obj) // [["a", 1], ["b", 2], ["c", 3]]
\`\`\`

### Object.assign() — copiar/fusionar objetos
\`\`\`javascript
const copia = Object.assign({}, obj);
const fusionado = Object.assign({}, obj1, obj2);
\`\`\`

### Object.freeze() — hacer inmutable
\`\`\`javascript
const config = Object.freeze({ debug: false });
config.debug = true; // No tiene efecto
\`\`\`

> Estos metodos son muy utiles para transformar objetos en arrays y viceversa.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `const producto = {
  nombre: "Laptop",
  precio: 999,
  stock: 15,
  categoria: "Tecnologia"
};

const salida = [];
salida.push("Keys: " + Object.keys(producto).join(", "));
salida.push("Values: " + Object.values(producto).join(", "));

salida.push("--- Entries ---");
Object.entries(producto).forEach(function(par) {
  salida.push("  " + par[0] + " -> " + par[1]);
});

// Contar propiedades
salida.push("Total propiedades: " + Object.keys(producto).length);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js10-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cual es la forma correcta de acceder a la propiedad 'nombre' de un objeto 'persona'?",
      options: [
        { id: "a", text: "persona->nombre", isCorrect: false },
        { id: "b", text: "persona.nombre", isCorrect: true },
        { id: "c", text: "persona::nombre", isCorrect: false },
        { id: "d", text: "persona@nombre", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se usa un punto entre el objeto y la propiedad.",
      explanation: "persona.nombre es la notacion de punto, la forma mas comun de acceder a propiedades.",
    },
    {
      id: "js10-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: 'Que devuelve Object.keys({a: 1, b: 2, c: 3})?',
      options: [
        { id: "a", text: "[1, 2, 3]", isCorrect: false },
        { id: "b", text: '["a", "b", "c"]', isCorrect: true },
        { id: "c", text: '{a: 1, b: 2, c: 3}', isCorrect: false },
        { id: "d", text: "3", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "keys significa 'claves' en ingles.",
      explanation: 'Object.keys() devuelve un array con las claves del objeto: ["a", "b", "c"].',
    },
    {
      id: "js10-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa para acceder a la propiedad 'edad' usando notacion de corchetes:",
      codeTemplate: {
        html: "",
        cssPrefix: 'const edad = persona[',
        cssSuffix: "];",
        blanks: ['"edad"'],
      },
      validation: { type: "exact", answer: '"edad"' },
      hint: "La clave debe ir como string entre comillas.",
      explanation: 'persona["edad"] accede a la propiedad edad usando notacion de corchetes.',
    },
    {
      id: "js10-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Que operador verifica si una propiedad existe en un objeto?",
      options: [
        { id: "a", text: "exists", isCorrect: false },
        { id: "b", text: "has", isCorrect: false },
        { id: "c", text: "in", isCorrect: true },
        { id: "d", text: "of", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: 'La sintaxis es "propiedad" in objeto.',
      explanation: '"nombre" in persona devuelve true si la propiedad existe en el objeto.',
    },
    {
      id: "js10-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que hace Object.freeze()?",
      options: [
        { id: "a", text: "Elimina todas las propiedades", isCorrect: false },
        { id: "b", text: "Hace el objeto inmutable", isCorrect: true },
        { id: "c", text: "Convierte el objeto a string", isCorrect: false },
        { id: "d", text: "Crea una copia del objeto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "'Congelar' un objeto impide que se modifique.",
      explanation: "Object.freeze() hace el objeto inmutable: no se pueden agregar, modificar ni eliminar propiedades.",
    },
    {
      id: "js10-ej-06",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Clasifica cada metodo de Object segun lo que devuelve:",
      dragItems: [
        { id: "drag-1", content: "Object.keys()", correctZone: "zone-claves" },
        { id: "drag-2", content: "Object.values()", correctZone: "zone-valores" },
        { id: "drag-3", content: "Object.entries()", correctZone: "zone-pares" },
      ],
      dropZones: [
        { id: "zone-claves", label: "Array de claves" },
        { id: "zone-valores", label: "Array de valores" },
        { id: "zone-pares", label: "Array de pares [clave, valor]" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-claves",
          "drag-2": "zone-valores",
          "drag-3": "zone-pares",
        },
      },
      hint: "keys = claves, values = valores, entries = entradas (pares).",
      explanation: "Object.keys() devuelve claves, Object.values() valores, y Object.entries() pares [clave, valor].",
    },
  ],
};
