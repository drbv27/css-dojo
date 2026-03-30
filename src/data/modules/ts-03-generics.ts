import type { ModuleData } from "@/types";

export const tsGenericsModule: ModuleData = {
  slug: "ts-03-generics",
  title: "Generics y Utility Types",
  description: "Funciones genericas, interfaces genericas y utility types como Partial, Omit y Pick.",
  order: 128,
  category: "js-typescript",
  icon: "code",
  dojo: "js",
  lessons: [
    {
      id: "ts03-leccion-01",
      title: "Generics",
      content: `## Generics

Los generics permiten crear funciones y tipos **reutilizables** que trabajan con cualquier tipo:

\`\`\`typescript
// Sin generics — poco flexible
function primerElemento(arr: number[]): number {
  return arr[0];
}

// Con generics — funciona con cualquier tipo
function primerElemento<T>(arr: T[]): T {
  return arr[0];
}

primerElemento([1, 2, 3]);       // T es number
primerElemento(["a", "b", "c"]); // T es string
\`\`\`

### Interfaces genericas

\`\`\`typescript
interface Respuesta<T> {
  data: T;
  error: string | null;
  status: number;
}

const resUsuario: Respuesta<{ nombre: string }> = {
  data: { nombre: "Ana" },
  error: null,
  status: 200,
};

const resLista: Respuesta<string[]> = {
  data: ["item1", "item2"],
  error: null,
  status: 200,
};
\`\`\`

### Restricciones con extends

\`\`\`typescript
function obtenerNombre<T extends { nombre: string }>(obj: T): string {
  return obj.nombre;
}

obtenerNombre({ nombre: "Ana", edad: 25 }); // OK
obtenerNombre({ id: 1 }); // Error! no tiene 'nombre'
\`\`\`

> Los generics son la base de casi toda libreria TypeScript moderna.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #3b82f6; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "ts03-leccion-02",
      title: "Utility Types",
      content: `## Utility Types

TypeScript incluye tipos utilitarios para transformar otros tipos:

### Partial<T> — todas las propiedades opcionales

\`\`\`typescript
interface Usuario { nombre: string; email: string; edad: number; }

type UsuarioParcial = Partial<Usuario>;
// { nombre?: string; email?: string; edad?: number }

function actualizar(id: string, datos: Partial<Usuario>) {
  // puede recibir solo algunas propiedades
}
actualizar("1", { nombre: "Ana" }); // OK
\`\`\`

### Pick<T, K> — selecciona propiedades

\`\`\`typescript
type LoginData = Pick<Usuario, "email" | "nombre">;
// { email: string; nombre: string }
\`\`\`

### Omit<T, K> — excluye propiedades

\`\`\`typescript
type SinEmail = Omit<Usuario, "email">;
// { nombre: string; edad: number }
\`\`\`

### Record<K, V> — objeto con claves y valores tipados

\`\`\`typescript
type Roles = "admin" | "editor" | "viewer";
type Permisos = Record<Roles, string[]>;

const permisos: Permisos = {
  admin: ["leer", "escribir", "borrar"],
  editor: ["leer", "escribir"],
  viewer: ["leer"],
};
\`\`\`

### Required<T> — todas las propiedades obligatorias

\`\`\`typescript
type Config = { tema?: string; idioma?: string };
type ConfigCompleta = Required<Config>;
// { tema: string; idioma: string } — ya no son opcionales
\`\`\`

> Estos utility types evitan duplicar interfaces — transformas las existentes.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "ts03-ej-01",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 1,
      prompt: "Que permite hacer un generic en TypeScript?",
      options: [
        { id: "a", text: "Crear variables globales", isCorrect: false },
        { id: "b", text: "Crear funciones/tipos reutilizables que trabajan con cualquier tipo", isCorrect: true },
        { id: "c", text: "Importar modulos automaticamente", isCorrect: false },
        { id: "d", text: "Compilar mas rapido", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Generic = generico, funciona con cualquier tipo.",
      explanation: "Los generics permiten crear codigo flexible que mantiene la seguridad de tipos.",
    },
    {
      id: "ts03-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 2,
      prompt: "Que hace Partial<Usuario>?",
      options: [
        { id: "a", text: "Elimina todas las propiedades", isCorrect: false },
        { id: "b", text: "Hace todas las propiedades opcionales", isCorrect: true },
        { id: "c", text: "Hace todas las propiedades readonly", isCorrect: false },
        { id: "d", text: "Duplica la interface", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Partial = parcial, no necesitas enviar todo.",
      explanation: "Partial<T> convierte todas las propiedades de T en opcionales (?), util para actualizaciones parciales.",
    },
    {
      id: "ts03-ej-03",
      type: "drag-drop",
      difficulty: 3,
      xpReward: 20,
      order: 3,
      prompt: "Asocia cada utility type con lo que hace:",
      dragItems: [
        { id: "drag-1", content: "Partial<T>", correctZone: "zone-parcial" },
        { id: "drag-2", content: "Pick<T, K>", correctZone: "zone-pick" },
        { id: "drag-3", content: "Omit<T, K>", correctZone: "zone-omit" },
      ],
      dropZones: [
        { id: "zone-parcial", label: "Todas las propiedades opcionales" },
        { id: "zone-pick", label: "Selecciona solo ciertas propiedades" },
        { id: "zone-omit", label: "Excluye ciertas propiedades" },
      ],
      validation: {
        type: "exact",
        answer: { "drag-1": "zone-parcial", "drag-2": "zone-pick", "drag-3": "zone-omit" },
      },
      hint: "Pick = elegir, Omit = omitir, Partial = parcial.",
      explanation: "Partial hace todo opcional, Pick selecciona propiedades, Omit las excluye.",
    },
    {
      id: "ts03-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que hace 'extends' en un generic como <T extends { id: number }>?",
      options: [
        { id: "a", text: "Hereda de una clase", isCorrect: false },
        { id: "b", text: "Restringe T a tipos que tengan la propiedad id: number", isCorrect: true },
        { id: "c", text: "Extiende el tipo con nuevas propiedades", isCorrect: false },
        { id: "d", text: "Convierte T en un array", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "extends en generics funciona como una restriccion.",
      explanation: "En generics, extends restringe que tipos puede aceptar T — debe cumplir la condicion.",
    },
    {
      id: "ts03-ej-05",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 5,
      prompt: 'Dado type Roles = "admin" | "user"; — que tipo crea Record<Roles, boolean>?',
      options: [
        { id: "a", text: '{ admin: boolean; user: boolean }', isCorrect: true },
        { id: "b", text: "boolean[]", isCorrect: false },
        { id: "c", text: '{ roles: boolean }', isCorrect: false },
        { id: "d", text: 'Map<Roles, boolean>', isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Record crea un objeto con las claves del primer tipo.",
      explanation: "Record<K, V> crea un objeto donde cada clave de K tiene valor de tipo V.",
    },
  ],
};
