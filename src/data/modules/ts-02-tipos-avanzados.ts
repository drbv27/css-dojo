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

| Caracteristica | Interface | Type |
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

> Usa **interface** para objetos y **type** para uniones, tuplas y tipos complejos.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #3b82f6; border-radius: 8px; white-space: pre-line; }',
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

Combina multiples tipos en uno:

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

> Union types + narrowing es una de las combinaciones mas poderosas de TypeScript.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cba6f7; border-radius: 8px; white-space: pre-line; }',
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
      prompt: "Que define una interface en TypeScript?",
      options: [
        { id: "a", text: "Una funcion reutilizable", isCorrect: false },
        { id: "b", text: "La forma/estructura de un objeto", isCorrect: true },
        { id: "c", text: "Una clase abstracta", isCorrect: false },
        { id: "d", text: "Un modulo importable", isCorrect: false },
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
      prompt: 'Que tipo describe un valor que puede ser "exito", "error" o "pendiente"?',
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
      prompt: "Completa el tipo para que acepte string O number:",
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
      prompt: "Que hace el operador & en TypeScript?",
      options: [
        { id: "a", text: "Crea un union type", isCorrect: false },
        { id: "b", text: "Compara dos tipos", isCorrect: false },
        { id: "c", text: "Combina multiples tipos en uno (intersection)", isCorrect: true },
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
      explanation: "interface define objetos, | permite multiples opciones, & combina todos los tipos.",
    },
  ],
};
