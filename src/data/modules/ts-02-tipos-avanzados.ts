import type { ModuleData } from "@/types";

export const tsTiposAvanzadosModule: ModuleData = {
  slug: "ts-02-tipos-avanzados",
  title: "Tipos Avanzados",
  description:
    "Interfaces, type aliases, union types e intersection types para modelar datos complejos.",
  order: 127,
  category: "js-typescript",
  icon: "code",
  dojo: "js",
  lessons: [
    {
      id: "ts02-leccion-01",
      title: "Interfaces y Type Aliases",
      content: `## Interfaces

Definen la **forma** de un objeto:

\`\`\`typescript
interface Usuario {
  nombre: string;
  edad: number;
  email: string;
  activo?: boolean; // opcional
}

const user: Usuario = {
  nombre: "Ana",
  edad: 25,
  email: "ana@mail.com",
};
\`\`\`

### Type Aliases

Crean un nombre para cualquier tipo:

\`\`\`typescript
type ID = string | number;
type Coordenada = [number, number];
type Callback = (dato: string) => void;

let userId: ID = "abc123";
userId = 42; // tambien valido
\`\`\`

### Interface vs Type

| Característica | Interface | Type |
|---------------|-----------|------|
| Objetos | Si | Si |
| Extender | extends | & (intersection) |
| Union types | No | Si |
| Reabrir/mergear | Si | No |

\`\`\`typescript
// Extender interface
interface Animal { nombre: string; }
interface Perro extends Animal { raza: string; }

// Extender type
type Animal2 = { nombre: string };
type Perro2 = Animal2 & { raza: string };
\`\`\`

> Usá **interface** para objetos y **type** para uniones, tuplas y tipos complejos.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #3b82f6; border-radius: 8px; white-space: pre-line; }',
        // El sandbox corre JavaScript: las interfaces y los type aliases se
        // borran al compilar y no dejan NADA en el bundle. Lo que sigue es el
        // objeto que sobrevive, sin su contrato.
        js: `// interface Usuario { id: number; nombre: string; email?: string }
// Compilado, la interface desaparece por completo. Queda el objeto solo:
var usuario = { id: 1, nombre: "Ana", email: "ana@mail.com" };
var sinEmail = { id: 2, nombre: "Beto" };

var salida = [];
salida.push("usuario:  " + JSON.stringify(usuario));
salida.push("sinEmail: " + JSON.stringify(sinEmail));
salida.push("");
salida.push("El email es opcional, asi que esto es undefined y no un error:");
salida.push("  sinEmail.email -> " + sinEmail.email);
salida.push("");
salida.push("Pero nada impide escribir una propiedad que la interface no declara,");
salida.push("porque en runtime la interface ya no existe:");
sinEmail.telefno = "555-0000";   // el typo que TypeScript habria marcado
salida.push("  " + JSON.stringify(sinEmail) + "   <- 'telefno', con el typo");

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "ts02-leccion-02",
      title: "Union e Intersection Types",
      content: `## Union Types ( | )

Un valor puede ser **uno de varios tipos**:

\`\`\`typescript
type Resultado = "exito" | "error" | "pendiente";
type Valor = string | number;

function mostrar(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // TypeScript sabe que es string
  } else {
    console.log(id.toFixed(2)); // TypeScript sabe que es number
  }
}
\`\`\`

### Literal Types

\`\`\`typescript
type Direccion = "norte" | "sur" | "este" | "oeste";
type DadoValor = 1 | 2 | 3 | 4 | 5 | 6;

let rumbo: Direccion = "norte"; // OK
rumbo = "diagonal"; // Error!
\`\`\`

### Intersection Types ( & )

Combina múltiples tipos en uno:

\`\`\`typescript
type ConNombre = { nombre: string };
type ConEdad = { edad: number };
type Persona = ConNombre & ConEdad;

const p: Persona = { nombre: "Luis", edad: 30 };
\`\`\`

### Narrowing (estrechamiento)

TypeScript estrecha el tipo dentro de condicionales:

\`\`\`typescript
function procesar(valor: string | number | boolean) {
  if (typeof valor === "string") {
    // aqui TypeScript sabe que es string
    return valor.trim();
  }
  if (typeof valor === "number") {
    return valor * 2;
  }
  return !valor; // aqui solo queda boolean
}
\`\`\`

> Union types + narrowing es una de las combinaciones más poderosas de TypeScript.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cba6f7; border-radius: 8px; white-space: pre-line; }',
        js: `// type Estado = "cargando" | "listo" | "error";  <- union de literales.
// En runtime no queda nada de eso, asi que el chequeo lo escribis vos:
var ESTADOS = ["cargando", "listo", "error"];

function describir(estado) {
  switch (estado) {
    case "cargando": return "Buscando datos...";
    case "listo":    return "Todo en orden";
    case "error":    return "Algo se rompio";
    default:         return "estado desconocido: " + estado;
  }
}

var salida = [];
ESTADOS.forEach(function (e) { salida.push(e + " -> " + describir(e)); });

salida.push("");
salida.push("La union de TypeScript habria rechazado esto en el editor;");
salida.push("aca cae en el default y nadie se entera hasta que pasa:");
salida.push("  " + describir("lsito"));

// Intersection: A & B es, en runtime, un solo objeto con todo junto.
var persona = { nombre: "Ana" };
var empleada = { legajo: 42 };
var ambas = Object.assign({}, persona, empleada);
salida.push("");
salida.push("Persona & Empleada -> " + JSON.stringify(ambas));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "ts02-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "¿Qué define una interface en TypeScript?",
      options: [
        { id: "a", text: "Una función reutilizable", isCorrect: false },
        { id: "b", text: "La forma/estructura de un objeto", isCorrect: true },
        { id: "c", text: "Una clase abstracta", isCorrect: false },
        { id: "d", text: "Un módulo importable", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las interfaces describen que propiedades tiene un objeto.",
      explanation: "Una interface define la estructura esperada de un objeto: sus propiedades y sus tipos.",
    },
    {
      id: "ts02-ej-02",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: '¿Qué tipo describe un valor que puede ser "exito", "error" o "pendiente"?',
      options: [
        { id: "a", text: "enum", isCorrect: false },
        { id: "b", text: "Union de literal types", isCorrect: true },
        { id: "c", text: "Intersection type", isCorrect: false },
        { id: "d", text: "Generic type", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se usa el operador | con valores literales.",
      explanation: 'type Resultado = "exito" | "error" | "pendiente" es una union de literal types.',
    },
    {
      id: "ts02-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Completá el tipo para que acepte string O number:",
      codeTemplate: {
        html: "",
        cssPrefix: "type ID = string ",
        cssSuffix: " number;",
        blanks: ["|"],
      },
      validation: { type: "exact", answer: "|" },
      hint: "El operador de union en TypeScript es...",
      explanation: "El operador | crea un union type que acepta cualquiera de los tipos listados.",
    },
    {
      id: "ts02-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "¿Qué hace el operador & en TypeScript?",
      options: [
        { id: "a", text: "Crea un union type", isCorrect: false },
        { id: "b", text: "Compara dos tipos", isCorrect: false },
        { id: "c", text: "Combina múltiples tipos en uno (intersection)", isCorrect: true },
        { id: "d", text: "Excluye propiedades de un tipo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "& combina tipos, | los separa.",
      explanation: "El operador & crea un intersection type que tiene TODAS las propiedades de ambos tipos.",
    },
    {
      id: "ts02-ej-05",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 5,
      prompt: "Asocia cada concepto con su uso:",
      dragItems: [
        { id: "drag-1", content: "interface", correctZone: "zone-obj" },
        { id: "drag-2", content: "union ( | )", correctZone: "zone-union" },
        { id: "drag-3", content: "intersection ( & )", correctZone: "zone-inter" },
      ],
      dropZones: [
        { id: "zone-obj", label: "Definir forma de un objeto" },
        { id: "zone-union", label: "Un valor puede ser tipo A o tipo B" },
        { id: "zone-inter", label: "Combinar propiedades de A y B" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-obj", "drag-2": "zone-union", "drag-3": "zone-inter" },
      },
      hint: "interface = objetos, | = o, & = y.",
      explanation: "interface define objetos, | permite múltiples opciones, & combina todos los tipos.",
    },
  ],
};
