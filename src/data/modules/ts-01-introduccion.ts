import type { ModuleData } from "@/types";

export const tsIntroModule: ModuleData = {
  slug: "ts-01-introduccion",
  title: "Introduccion a TypeScript",
  description:
    "Aprende que es TypeScript, por que usarlo y los tipos basicos: string, number, boolean y mas.",
  order: 126,
  category: "js-typescript",
  icon: "code",
  dojo: "js",
  lessons: [
    {
      id: "ts01-leccion-01",
      title: "Que es TypeScript",
      content: `## Que es TypeScript?

TypeScript es un **superset de JavaScript** creado por Microsoft que agrega **tipado estatico** al lenguaje.

### Por que TypeScript?

- **Detecta errores antes de ejecutar** — el compilador te avisa si algo no cuadra
- **Mejor autocompletado** en tu editor (VS Code)
- **Codigo mas legible** — los tipos documentan tu codigo
- **Estandar en la industria** — React, Angular, Vue, Next.js lo usan

### Tipos basicos

\`\`\`typescript
// Tipos primitivos
let nombre: string = "Diego";
let edad: number = 25;
let activo: boolean = true;

// Arrays
let notas: number[] = [90, 85, 100];
let nombres: string[] = ["Ana", "Luis"];

// any — evitalo cuando puedas
let dato: any = "hola";
dato = 42; // no da error, pero pierdes seguridad
\`\`\`

### Inferencia de tipos

TypeScript puede **inferir** el tipo sin que lo escribas:

\`\`\`typescript
let mensaje = "hola"; // TypeScript sabe que es string
mensaje = 42; // Error! No puedes asignar number a string
\`\`\`

> TypeScript no cambia como se ejecuta tu codigo — solo agrega verificacion en tiempo de desarrollo.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "ts01-leccion-02",
      title: "Funciones tipadas",
      content: `## Funciones con tipos

En TypeScript tipas los **parametros** y el **valor de retorno**:

\`\`\`typescript
function sumar(a: number, b: number): number {
  return a + b;
}

sumar(2, 3);    // OK -> 5
sumar("2", 3);  // Error! "2" no es number
\`\`\`

### Parametros opcionales

\`\`\`typescript
function saludar(nombre: string, titulo?: string): string {
  if (titulo) {
    return \`Hola, \${titulo} \${nombre}\`;
  }
  return \`Hola, \${nombre}\`;
}

saludar("Ana");           // "Hola, Ana"
saludar("Ana", "Dra.");   // "Hola, Dra. Ana"
\`\`\`

### Valores por defecto

\`\`\`typescript
function crearUsuario(nombre: string, rol: string = "estudiante") {
  return { nombre, rol };
}
\`\`\`

### Arrow functions tipadas

\`\`\`typescript
const multiplicar = (a: number, b: number): number => a * b;

const filtrarMayores = (nums: number[], min: number): number[] => {
  return nums.filter(n => n > min);
};
\`\`\`

> Tipar funciones es donde TypeScript brilla mas — evita bugs en las interfaces entre modulos.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "ts01-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que es TypeScript?",
      options: [
        { id: "a", text: "Un lenguaje completamente diferente a JavaScript", isCorrect: false },
        { id: "b", text: "Un superset de JavaScript con tipado estatico", isCorrect: true },
        { id: "c", text: "Una libreria de JavaScript", isCorrect: false },
        { id: "d", text: "Un framework para backend", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "TypeScript extiende JavaScript, no lo reemplaza.",
      explanation: "TypeScript es un superset de JavaScript que agrega tipado estatico. Todo codigo JS valido es tambien TS valido.",
    },
    {
      id: "ts01-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Completa la declaracion de tipo para que 'edad' solo acepte numeros:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["number"],
      },
      validation: { type: "exact", answer: "number" },
      hint: "El tipo para numeros enteros y decimales en TypeScript es...",
      explanation: "El tipo 'number' cubre enteros y decimales en TypeScript.",
    },
    {
      id: "ts01-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que pasa si intentas asignar un string a una variable tipada como number?",
      options: [
        { id: "a", text: "Se convierte automaticamente", isCorrect: false },
        { id: "b", text: "Da error en tiempo de ejecucion", isCorrect: false },
        { id: "c", text: "El compilador de TypeScript marca un error", isCorrect: true },
        { id: "d", text: "Se ignora el tipo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "TypeScript verifica tipos ANTES de ejecutar.",
      explanation: "TypeScript detecta errores de tipo en tiempo de compilacion, antes de que el codigo se ejecute.",
    },
    {
      id: "ts01-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que indica el signo ? despues de un parametro en TypeScript?",
      options: [
        { id: "a", text: "Que el parametro es de tipo any", isCorrect: false },
        { id: "b", text: "Que el parametro es opcional", isCorrect: true },
        { id: "c", text: "Que el parametro puede ser null", isCorrect: false },
        { id: "d", text: "Que el parametro es readonly", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "function saludar(nombre: string, titulo?: string)",
      explanation: "El ? marca un parametro como opcional — puede o no recibir un valor.",
    },
    {
      id: "ts01-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Asocia cada valor con su tipo en TypeScript:",
      dragItems: [
        { id: "drag-1", content: '"Hola mundo"', correctZone: "zone-string" },
        { id: "drag-2", content: "42", correctZone: "zone-number" },
        { id: "drag-3", content: "true", correctZone: "zone-boolean" },
        { id: "drag-4", content: '["a", "b"]', correctZone: "zone-array" },
      ],
      dropZones: [
        { id: "zone-string", label: "string" },
        { id: "zone-number", label: "number" },
        { id: "zone-boolean", label: "boolean" },
        { id: "zone-array", label: "string[]" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-string",
          "drag-2": "zone-number",
          "drag-3": "zone-boolean",
          "drag-4": "zone-array",
        },
      },
      hint: "Piensa en que tipo de dato es cada valor.",
      explanation: "Cada valor literal tiene un tipo correspondiente en TypeScript.",
    },
  ],
};
