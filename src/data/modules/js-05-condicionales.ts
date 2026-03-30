import type { ModuleData } from "@/types";

export const jsCondicionalesModule: ModuleData = {
  slug: "js-condicionales",
  title: "Condicionales",
  description:
    "Aprende a tomar decisiones en tu codigo con if, else, else if, switch y el operador ternario.",
  order: 105,
  category: "js-fundamentals",
  icon: "GitBranch",
  dojo: "js",
  lessons: [
    {
      id: "js05-leccion-01",
      title: "if, else if y else",
      content: `## Condicionales: if / else

Las estructuras condicionales permiten ejecutar codigo **solo si se cumple una condicion**.

### if
\`\`\`javascript
if (condicion) {
  // codigo si es verdadero
}
\`\`\`

### if...else
\`\`\`javascript
if (condicion) {
  // si es verdadero
} else {
  // si es falso
}
\`\`\`

### if...else if...else
\`\`\`javascript
if (nota >= 90) {
  calificacion = "A";
} else if (nota >= 80) {
  calificacion = "B";
} else if (nota >= 70) {
  calificacion = "C";
} else {
  calificacion = "F";
}
\`\`\`

> **Importante:** La condicion se evalua como booleano. Recuerda los valores falsy y truthy.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `const nota = 85;
let calificacion;

if (nota >= 90) {
  calificacion = "A - Excelente";
} else if (nota >= 80) {
  calificacion = "B - Muy bien";
} else if (nota >= 70) {
  calificacion = "C - Bien";
} else {
  calificacion = "F - Reprobado";
}

document.getElementById("resultado").textContent = "Nota: " + nota + "\\nCalificacion: " + calificacion;`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js05-leccion-02",
      title: "Operador ternario y switch",
      content: `## Operador ternario

Es una forma compacta de if/else en una sola linea:

\`\`\`javascript
const resultado = condicion ? valorSiTrue : valorSiFalse;
\`\`\`

Ejemplo:
\`\`\`javascript
const edad = 20;
const acceso = edad >= 18 ? "Permitido" : "Denegado";
\`\`\`

## Switch

Ideal cuando comparas una variable contra **multiples valores exactos**:

\`\`\`javascript
switch (dia) {
  case "lunes":
    mensaje = "Inicio de semana";
    break;
  case "viernes":
    mensaje = "Casi fin de semana!";
    break;
  default:
    mensaje = "Dia normal";
}
\`\`\`

### Importante sobre switch
- Cada \`case\` necesita un \`break\` para evitar que siga ejecutando los siguientes casos
- \`default\` es como el \`else\` — se ejecuta si ningun case coincide
- Usa switch cuando tengas 3 o mas comparaciones con el mismo valor`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        js: `const dia = "miercoles";
let tipo;

switch (dia) {
  case "lunes":
  case "martes":
  case "miercoles":
  case "jueves":
  case "viernes":
    tipo = "Dia laboral";
    break;
  case "sabado":
  case "domingo":
    tipo = "Fin de semana!";
    break;
  default:
    tipo = "Dia no valido";
}

const edad = 20;
const acceso = edad >= 18 ? "Permitido" : "Denegado";

const salida = [];
salida.push("Dia: " + dia + " -> " + tipo);
salida.push("Edad: " + edad + " -> Acceso: " + acceso);
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js05-leccion-03",
      title: "Condiciones compuestas",
      content: `## Condiciones compuestas

Puedes combinar multiples condiciones usando operadores logicos:

### AND (&&) — Ambas deben ser verdaderas
\`\`\`javascript
if (edad >= 18 && tieneID) {
  // entra solo si ambas son true
}
\`\`\`

### OR (||) — Al menos una debe ser verdadera
\`\`\`javascript
if (esEstudiante || esMayor65) {
  // entra si al menos una es true
}
\`\`\`

### Negacion (!)
\`\`\`javascript
if (!estaLloviendo) {
  // entra si NO esta lloviendo
}
\`\`\`

### Anidacion de condicionales

Puedes poner un if dentro de otro, pero no abuses:

\`\`\`javascript
if (usuario) {
  if (usuario.esAdmin) {
    // es admin
  }
}
// Mejor asi:
if (usuario && usuario.esAdmin) {
  // es admin
}
\`\`\`

> **Tip:** Evita anidar mas de 2-3 niveles. Refactoriza usando funciones o early returns.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cdd6f4; border-radius: 8px; white-space: pre-line; }',
        js: `const edad = 22;
const tieneID = true;
const esEstudiante = true;

const salida = [];

if (edad >= 18 && tieneID) {
  salida.push("Acceso permitido (mayor de edad con ID)");
}

if (esEstudiante || edad >= 65) {
  salida.push("Tiene descuento (estudiante o mayor de 65)");
}

if (!tieneID) {
  salida.push("Necesita identificacion");
} else {
  salida.push("Identificacion verificada");
}

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js05-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que se ejecuta si la condicion de un if es false y hay un bloque else?",
      options: [
        { id: "a", text: "El bloque if", isCorrect: false },
        { id: "b", text: "El bloque else", isCorrect: true },
        { id: "c", text: "Ambos bloques", isCorrect: false },
        { id: "d", text: "Ninguno", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "else se ejecuta cuando la condicion NO se cumple.",
      explanation: "Si la condicion es false, se salta el bloque if y se ejecuta el bloque else.",
    },
    {
      id: "js05-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: 'Cual es el resultado de: 10 > 5 ? "mayor" : "menor"?',
      options: [
        { id: "a", text: '"mayor"', isCorrect: true },
        { id: "b", text: '"menor"', isCorrect: false },
        { id: "c", text: "true", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "10 > 5 es true, asi que se devuelve el valor antes de los dos puntos.",
      explanation:
        'Como 10 > 5 es true, el operador ternario devuelve "mayor" (el valor antes de :).',
    },
    {
      id: "js05-ej-03",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 3,
      prompt: "Completa la estructura condicional para manejar el caso en que la condicion sea falsa:",
      codeTemplate: {
        html: "",
        cssPrefix: 'if (edad >= 18) {\n  acceso = "Si";\n} ',
        cssSuffix: ' {\n  acceso = "No";\n}',
        blanks: ["else"],
      },
      validation: { type: "exact", answer: "else" },
      hint: "La palabra clave para el caso contrario del if...",
      explanation: "else define el bloque que se ejecuta cuando la condicion del if es false.",
    },
    {
      id: "js05-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "En un switch, que sucede si olvidas poner break en un case?",
      options: [
        { id: "a", text: "Da un error de sintaxis", isCorrect: false },
        { id: "b", text: "Solo ejecuta ese case", isCorrect: false },
        { id: "c", text: "Sigue ejecutando los cases siguientes (fall-through)", isCorrect: true },
        { id: "d", text: "Salta al default", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Sin break, la ejecucion 'cae' al siguiente case.",
      explanation:
        "Sin break, JavaScript ejecuta el codigo del case actual y continua con los siguientes cases (fall-through) hasta encontrar un break o el final del switch.",
    },
    {
      id: "js05-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Cual es la forma correcta de verificar si una variable x esta entre 10 y 20 (inclusive)?",
      options: [
        { id: "a", text: "if (10 <= x <= 20)", isCorrect: false },
        { id: "b", text: "if (x >= 10 && x <= 20)", isCorrect: true },
        { id: "c", text: "if (x >= 10 || x <= 20)", isCorrect: false },
        { id: "d", text: "if (x between 10 and 20)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Necesitas que ambas condiciones sean verdaderas al mismo tiempo.",
      explanation:
        "Se usa && porque x debe cumplir AMBAS condiciones: ser >= 10 Y <= 20. Con || cualquier numero seria valido.",
    },
    {
      id: "js05-ej-06",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Ordena las partes de una estructura if/else if/else:",
      dragItems: [
        { id: "drag-1", content: "if (x > 10)", correctZone: "zone-1" },
        { id: "drag-2", content: "else if (x > 5)", correctZone: "zone-2" },
        { id: "drag-3", content: "else", correctZone: "zone-3" },
      ],
      dropZones: [
        { id: "zone-1", label: "Primera condicion" },
        { id: "zone-2", label: "Segunda condicion" },
        { id: "zone-3", label: "Caso por defecto" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-1",
          "drag-2": "zone-2",
          "drag-3": "zone-3",
        },
      },
      hint: "Primero if, luego else if, y al final else.",
      explanation:
        "La estructura correcta es: if (primera condicion) -> else if (segunda condicion) -> else (caso por defecto).",
    },
  ],
};
