import type { ModuleData } from "@/types";

export const jsEs6ModernoModule: ModuleData = {
  slug: "js-es6-moderno",
  title: "ES6+ Moderno",
  description:
    "Domina las caracteristicas modernas de JavaScript: destructuring avanzado, optional chaining, nullish coalescing, Map, Set, modulos import/export, Symbol e iteradores.",
  order: 119,
  category: "js-advanced",
  icon: "sparkles",
  dojo: "js",
  lessons: [
    {
      id: "js-19-leccion-01",
      title: "Destructuring avanzado y Spread/Rest",
      content: `## Destructuring avanzado y Spread/Rest

### Destructuring con valores por defecto y renombrado

\`\`\`javascript
// Renombrar variables al destructurar
const usuario = { nombre: 'Ana', edad: 25, pais: 'Mexico' };
const { nombre: nombreUsuario, edad: edadUsuario } = usuario;
console.log(nombreUsuario); // 'Ana'

// Valores por defecto
const { nombre, rol = 'usuario' } = usuario;
console.log(rol); // 'usuario' (no existe en el objeto)
\`\`\`

### Destructuring anidado

\`\`\`javascript
const empresa = {
  nombre: 'TechCorp',
  direccion: {
    ciudad: 'Madrid',
    coordenadas: { lat: 40.4, lng: -3.7 }
  }
};

const { direccion: { ciudad, coordenadas: { lat } } } = empresa;
console.log(ciudad); // 'Madrid'
console.log(lat);    // 40.4
\`\`\`

### Destructuring en parametros de funcion

\`\`\`javascript
function mostrarUsuario({ nombre, edad, rol = 'invitado' }) {
  console.log(\`\${nombre} (\${edad}) - \${rol}\`);
}

mostrarUsuario({ nombre: 'Luis', edad: 30 });
// "Luis (30) - invitado"
\`\`\`

### Spread avanzado

\`\`\`javascript
// Clonar y modificar objetos
const original = { a: 1, b: 2, c: 3 };
const modificado = { ...original, b: 20, d: 4 };
// { a: 1, b: 20, c: 3, d: 4 }

// Combinar arrays excluyendo duplicados
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];
const sinDuplicados = [...new Set([...arr1, ...arr2])];
// [1, 2, 3, 4, 5]
\`\`\`

### Rest avanzado

\`\`\`javascript
// Separar propiedades de un objeto
const { password, ...datosPublicos } = {
  nombre: 'Ana',
  email: 'ana@mail.com',
  password: '12345'
};
console.log(datosPublicos);
// { nombre: 'Ana', email: 'ana@mail.com' }

// Funcion con argumentos variables
function sumar(primero, ...resto) {
  return resto.reduce((acc, num) => acc + num, primero);
}
console.log(sumar(1, 2, 3, 4)); // 10
\`\`\``,
      order: 1,
    },
    {
      id: "js-19-leccion-02",
      title: "Optional Chaining y Nullish Coalescing",
      content: `## Optional Chaining (?.) y Nullish Coalescing (??)

### El problema de acceder a propiedades anidadas

\`\`\`javascript
const usuario = {
  nombre: 'Carlos',
  direccion: null
};

// Esto lanza un error!
// console.log(usuario.direccion.ciudad); // TypeError!

// Solucion antigua (fea)
const ciudad = usuario.direccion && usuario.direccion.ciudad;

// Solucion moderna: Optional Chaining
const ciudadSegura = usuario.direccion?.ciudad;
console.log(ciudadSegura); // undefined (sin error!)
\`\`\`

### Usos de Optional Chaining (?.)

\`\`\`javascript
const datos = {
  usuario: {
    perfil: {
      avatar: 'foto.jpg'
    },
    amigos: ['Ana', 'Luis']
  }
};

// Propiedades anidadas
datos.usuario?.perfil?.avatar;    // 'foto.jpg'
datos.usuario?.config?.tema;      // undefined

// Con arrays
datos.usuario?.amigos?.[0];       // 'Ana'
datos.usuario?.grupos?.[0];       // undefined

// Con metodos
datos.usuario?.getNombre?.();     // undefined (no lanza error)

// Con delete
delete datos.usuario?.temporal;   // No lanza error si no existe
\`\`\`

### Nullish Coalescing (??)

El operador \`??\` devuelve el lado derecho solo cuando el izquierdo es \`null\` o \`undefined\`.

\`\`\`javascript
// Diferencia entre || y ??
const cantidad = 0;
console.log(cantidad || 10);  // 10 (0 es falsy!)
console.log(cantidad ?? 10);  // 0 (0 NO es null/undefined)

const texto = '';
console.log(texto || 'default');  // 'default' ('' es falsy!)
console.log(texto ?? 'default');  // '' ('' NO es null/undefined)

const valor = null;
console.log(valor ?? 'default'); // 'default'

const otro = undefined;
console.log(otro ?? 'default');  // 'default'
\`\`\`

### Combinando ?. y ??

\`\`\`javascript
const config = {
  tema: null,
  idioma: undefined
};

const tema = config?.tema ?? 'claro';
const idioma = config?.idioma ?? 'es';
const fontSize = config?.fuente?.tamano ?? 16;

console.log(tema);     // 'claro'
console.log(idioma);   // 'es'
console.log(fontSize); // 16
\`\`\`

### Asignacion con ??=

\`\`\`javascript
let nombre = null;
nombre ??= 'Anonimo';
console.log(nombre); // 'Anonimo'

let edad = 0;
edad ??= 25;
console.log(edad); // 0 (no se reasigna porque no es null/undefined)
\`\`\`

> **Consejo:** Usa \`??\` en lugar de \`||\` cuando valores como \`0\`, \`''\` o \`false\` son validos.`,
      order: 2,
    },
    {
      id: "js-19-leccion-03",
      title: "Map y Set",
      content: `## Map y Set

### Set: coleccion de valores unicos

\`\`\`javascript
// Crear un Set
const numeros = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(numeros); // Set {1, 2, 3, 4, 5}

// Metodos principales
numeros.add(6);          // Agregar
numeros.delete(3);       // Eliminar
numeros.has(2);          // true - Verificar existencia
numeros.size;            // 5 - Tamano
numeros.clear();         // Vaciar todo

// Eliminar duplicados de un array
const conDuplicados = [1, 1, 2, 3, 3, 3, 4];
const unicos = [...new Set(conDuplicados)];
// [1, 2, 3, 4]
\`\`\`

### Iterar sobre Set

\`\`\`javascript
const frutas = new Set(['manzana', 'pera', 'uva']);

for (const fruta of frutas) {
  console.log(fruta);
}

frutas.forEach(fruta => console.log(fruta));

// Convertir a array
const arrayFrutas = Array.from(frutas);
\`\`\`

### Map: pares clave-valor mejorados

A diferencia de objetos, Map puede usar **cualquier tipo** como clave.

\`\`\`javascript
const mapa = new Map();

// Usar cualquier tipo como clave
mapa.set('nombre', 'Ana');
mapa.set(42, 'respuesta');
mapa.set(true, 'activo');

const objClave = { id: 1 };
mapa.set(objClave, 'datos del objeto');

// Acceder
console.log(mapa.get('nombre'));    // 'Ana'
console.log(mapa.get(42));          // 'respuesta'
console.log(mapa.get(objClave));    // 'datos del objeto'

// Metodos
mapa.has('nombre');  // true
mapa.delete(42);
mapa.size;           // 3
\`\`\`

### Iterar sobre Map

\`\`\`javascript
const capitales = new Map([
  ['Mexico', 'CDMX'],
  ['Espana', 'Madrid'],
  ['Argentina', 'Buenos Aires'],
]);

// for...of con destructuring
for (const [pais, capital] of capitales) {
  console.log(\`\${pais}: \${capital}\`);
}

// forEach
capitales.forEach((capital, pais) => {
  console.log(\`\${pais}: \${capital}\`);
});

// Obtener solo claves o valores
const paises = [...capitales.keys()];
const ciudades = [...capitales.values()];
\`\`\`

### Map vs Objeto

| Caracteristica | Objeto | Map |
|---------------|--------|-----|
| Tipo de clave | Solo string/Symbol | Cualquier tipo |
| Orden | No garantizado | Orden de insercion |
| Tamano | Object.keys(obj).length | map.size |
| Rendimiento | Bueno | Mejor para agregar/eliminar frecuente |`,
      order: 3,
    },
    {
      id: "js-19-leccion-04",
      title: "Modulos, Symbol e Iteradores",
      content: `## Modulos, Symbol e Iteradores

### Modulos ES6 (import/export)

Los modulos permiten dividir el codigo en archivos separados y reutilizables.

\`\`\`javascript
// === utils.js ===
// Exportacion nombrada
export function sumar(a, b) {
  return a + b;
}

export const PI = 3.14159;

// Exportacion por defecto
export default function saludar(nombre) {
  return \`Hola \${nombre}\`;
}
\`\`\`

\`\`\`javascript
// === app.js ===
// Importar exportacion por defecto
import saludar from './utils.js';

// Importar exportaciones nombradas
import { sumar, PI } from './utils.js';

// Importar todo
import * as utils from './utils.js';
utils.sumar(1, 2);

// Renombrar al importar
import { sumar as add } from './utils.js';
\`\`\`

### Re-exportar

\`\`\`javascript
// === index.js (barrel file) ===
export { sumar, restar } from './matematicas.js';
export { formatearFecha } from './fechas.js';
export { default as Calculadora } from './calculadora.js';
\`\`\`

### Symbol

Symbol crea un identificador unico e irrepetible.

\`\`\`javascript
const id = Symbol('id');
const otroId = Symbol('id');
console.log(id === otroId); // false (siempre unicos!)

// Uso principal: claves de propiedades unicas
const usuario = {
  nombre: 'Ana',
  [id]: 12345
};

console.log(usuario[id]); // 12345
// No aparece en for...in ni Object.keys()
\`\`\`

### Iteradores

Un iterador es un objeto con un metodo \`next()\` que devuelve \`{ value, done }\`.

\`\`\`javascript
// Crear un iterador manual
function crearRango(inicio, fin) {
  let actual = inicio;
  return {
    next() {
      if (actual <= fin) {
        return { value: actual++, done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

const rango = crearRango(1, 3);
rango.next(); // { value: 1, done: false }
rango.next(); // { value: 2, done: false }
rango.next(); // { value: 3, done: false }
rango.next(); // { value: undefined, done: true }
\`\`\`

### Objetos iterables con Symbol.iterator

\`\`\`javascript
const miRango = {
  desde: 1,
  hasta: 5,
  [Symbol.iterator]() {
    let actual = this.desde;
    const hasta = this.hasta;
    return {
      next() {
        if (actual <= hasta) {
          return { value: actual++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const num of miRango) {
  console.log(num); // 1, 2, 3, 4, 5
}

const numeros = [...miRango]; // [1, 2, 3, 4, 5]
\`\`\`

> **Dato:** Los arrays, strings, Map y Set ya implementan \`Symbol.iterator\`, por eso funcionan con \`for...of\` y spread.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-19-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que hace el destructuring anidado `const { direccion: { ciudad } } = usuario`?",
      options: [
        { id: "a", text: "Crea una variable 'direccion' y otra 'ciudad'", isCorrect: false },
        { id: "b", text: "Crea solo la variable 'ciudad' con el valor de usuario.direccion.ciudad", isCorrect: true },
        { id: "c", text: "Crea un objeto con la propiedad ciudad", isCorrect: false },
        { id: "d", text: "Lanza un error porque no se puede anidar", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En destructuring anidado, los niveles intermedios no crean variables.",
      explanation: "Al destructurar { direccion: { ciudad } }, 'direccion' es solo la ruta de acceso. Solo se crea la variable 'ciudad'.",
    },
    {
      id: "js-19-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Usa optional chaining para acceder de forma segura a la ciudad del usuario:",
      codeTemplate: {
        html: "",
        cssPrefix: "const usuario = { nombre: 'Ana', direccion: null };\nconst ciudad = ",
        cssSuffix: ";\nconsole.log(ciudad); // undefined (sin error)",
        blanks: ["usuario.direccion?.ciudad"],
      },
      validation: { type: "includes", answer: ["?."] },
      hint: "Usa ?. para acceder de forma segura a propiedades que podrian ser null.",
      explanation: "El operador ?. detiene la evaluacion y devuelve undefined si el valor anterior es null o undefined, evitando el TypeError.",
    },
    {
      id: "js-19-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Cual es la diferencia entre `||` y `??`?",
      options: [
        { id: "a", text: "No hay diferencia, son equivalentes", isCorrect: false },
        { id: "b", text: "|| verifica valores falsy, ?? solo verifica null y undefined", isCorrect: true },
        { id: "c", text: "?? es mas rapido que ||", isCorrect: false },
        { id: "d", text: "?? solo funciona con strings", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que pasa con valores como 0, '' o false.",
      explanation: "|| considera falsy a 0, '', false, null, undefined y NaN. ?? solo considera null y undefined, permitiendo que 0 y '' sean valores validos.",
    },
    {
      id: "js-19-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Elimina los duplicados del array usando Set:",
      codeTemplate: {
        html: "",
        cssPrefix: "const numeros = [1, 2, 2, 3, 3, 4, 5, 5];\nconst unicos = ",
        cssSuffix: ";\nconsole.log(unicos); // [1, 2, 3, 4, 5]",
        blanks: ["[...new Set(numeros)]"],
      },
      validation: { type: "includes", answer: ["new Set", "..."] },
      hint: "Crea un Set con el array y conviertelo de nuevo a array con spread.",
      explanation: "new Set(numeros) elimina duplicados y [...set] lo convierte de nuevo a array usando el operador spread.",
    },
    {
      id: "js-19-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Que tipo de claves puede tener un Map que un objeto normal NO puede?",
      options: [
        { id: "a", text: "Solo strings", isCorrect: false },
        { id: "b", text: "Solo numeros", isCorrect: false },
        { id: "c", text: "Cualquier tipo: objetos, funciones, numeros, etc.", isCorrect: true },
        { id: "d", text: "Solo Symbols", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Los objetos normales convierten las claves a string automaticamente.",
      explanation: "Map permite usar cualquier tipo como clave (objetos, funciones, numeros, etc.), mientras que los objetos solo permiten strings y Symbols.",
    },
    {
      id: "js-19-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Usa el operador rest para separar el password de los demas datos del usuario:",
      codeTemplate: {
        html: "",
        cssPrefix: "const usuario = { nombre: 'Ana', email: 'ana@mail.com', password: '123' };\nconst { password, ",
        cssSuffix: " } = usuario;\nconsole.log(datosPublicos); // { nombre: 'Ana', email: 'ana@mail.com' }",
        blanks: ["...datosPublicos"],
      },
      validation: { type: "includes", answer: ["...datosPublicos"] },
      hint: "El operador rest (...) recoge todas las propiedades restantes en un nuevo objeto.",
      explanation: "Al hacer { password, ...datosPublicos } = usuario, password se extrae y todas las demas propiedades se agrupan en datosPublicos.",
    },
    {
      id: "js-19-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt: "Que valor tiene `resultado` en: `const resultado = 0 ?? 42;`?",
      options: [
        { id: "a", text: "42", isCorrect: false },
        { id: "b", text: "0", isCorrect: true },
        { id: "c", text: "null", isCorrect: false },
        { id: "d", text: "undefined", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Recuerda: ?? solo actua con null y undefined, no con otros valores falsy.",
      explanation: "El operador ?? solo reemplaza null y undefined. Como 0 no es ninguno de los dos, el resultado es 0.",
    },
    {
      id: "js-19-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt: "Completa la exportacion e importacion de un modulo ES6:",
      codeTemplate: {
        html: "",
        cssPrefix: "// utils.js\n",
        cssSuffix: "\n\n// app.js\nimport { sumar } from './utils.js';\nconsole.log(sumar(2, 3)); // 5",
        blanks: ["export function sumar(a, b) { return a + b; }"],
      },
      validation: { type: "includes", answer: ["export", "function"] },
      hint: "Usa la palabra clave export antes de la declaracion de la funcion.",
      explanation: "Con export delante de la declaracion, la funcion se convierte en una exportacion nombrada que puede ser importada con { sumar } desde otro archivo.",
    },
  ],
};
