import type { ModuleData } from "@/types";

export const jsCondicionalesModule: ModuleData = {
  slug: "js-condicionales",
  title: "Condicionales",
  description:
    "Aprende a controlar el flujo de tu programa con if/else, else if, switch, el operador ternario y los valores truthy/falsy.",
  order: 105,
  dojo: "js",
  category: "js-fundamentals",
  icon: "git-branch",
  lessons: [
    {
      id: "js05-leccion-01",
      title: "if, else y else if",
      content: `## Condicionales: if / else

Las condicionales permiten que tu programa **tome decisiones** basandose en condiciones.

### if

Ejecuta un bloque de codigo **solo si** la condicion es verdadera:

\`\`\`javascript
const edad = 20;

if (edad >= 18) {
  console.log("Eres mayor de edad");
}
\`\`\`

### if / else

Agrega un camino alternativo cuando la condicion es falsa:

\`\`\`javascript
const hora = 14;

if (hora < 12) {
  console.log("Buenos dias");
} else {
  console.log("Buenas tardes");
}
\`\`\`

### else if

Para multiples condiciones encadenadas:

\`\`\`javascript
const nota = 85;

if (nota >= 90) {
  console.log("Excelente");
} else if (nota >= 80) {
  console.log("Muy bien");
} else if (nota >= 70) {
  console.log("Bien");
} else if (nota >= 60) {
  console.log("Suficiente");
} else {
  console.log("Reprobado");
}
\`\`\`

### Condiciones compuestas

Puedes combinar condiciones con operadores logicos:

\`\`\`javascript
const edad = 25;
const tieneLicencia = true;

if (edad >= 18 && tieneLicencia) {
  console.log("Puede conducir");
}

const dia = "sabado";
if (dia === "sabado" || dia === "domingo") {
  console.log("Es fin de semana!");
}
\`\`\`

> **Buena practica:** Evita anidar mas de 2-3 niveles de if. Si necesitas mas, considera usar \`switch\` o funciones auxiliares.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const hora = new Date().getHours();\n  const res = document.getElementById("resultado");\n  let saludo;\n  if (hora < 12) {\n    saludo = "Buenos dias";\n  } else if (hora < 18) {\n    saludo = "Buenas tardes";\n  } else {\n    saludo = "Buenas noches";\n  }\n  res.innerHTML = "<p>" + saludo + " (son las " + hora + ":00)</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; }`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "js05-leccion-02",
      title: "switch",
      content: `## La sentencia switch

\`switch\` es util cuando necesitas comparar **una variable contra multiples valores exactos**:

\`\`\`javascript
const dia = "martes";

switch (dia) {
  case "lunes":
    console.log("Inicio de semana");
    break;
  case "martes":
  case "miercoles":
  case "jueves":
    console.log("Mitad de semana");
    break;
  case "viernes":
    console.log("Casi fin de semana!");
    break;
  case "sabado":
  case "domingo":
    console.log("Fin de semana!");
    break;
  default:
    console.log("Dia no valido");
}
\`\`\`

### Puntos clave

1. **break** es obligatorio al final de cada caso. Sin el, la ejecucion "cae" al siguiente caso (fall-through).
2. **default** es opcional y se ejecuta cuando ningun caso coincide (como el \`else\` final).
3. La comparacion usa **igualdad estricta** (\`===\`).

### Cuando usar switch vs if/else?

| Situacion | Mejor opcion |
|-----------|-------------|
| Comparar una variable contra valores fijos | \`switch\` |
| Condiciones con rangos (>, <, >=) | \`if/else\` |
| Condiciones complejas (&&, \\|\\|) | \`if/else\` |
| 2-3 condiciones simples | \`if/else\` |
| 4+ valores posibles de una variable | \`switch\` |

### Fall-through intencional

A veces se omite \`break\` a proposito para agrupar casos:

\`\`\`javascript
case "sabado":
case "domingo":
  console.log("Fin de semana!");
  break;
\`\`\`

> **Regla:** Siempre incluye \`break\` en cada caso y \`default\` al final. Si omites \`break\` intencionalmente, agrega un comentario explicando por que.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const dia = new Date().getDay();\n  const dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];\n  const res = document.getElementById("resultado");\n  let tipo;\n  switch (dia) {\n    case 0: case 6:\n      tipo = "Fin de semana";\n      break;\n    case 1: case 5:\n      tipo = "Cerca del fin de semana";\n      break;\n    default:\n      tipo = "Mitad de semana";\n  }\n  res.innerHTML = "<p>Hoy es " + dias[dia] + ": " + tipo + "</p>";\n</script>`,
        css: `#resultado { background: #1e1e1e; color: #c586c0; border-radius: 8px; }`,
        editable: false,
      },
      order: 2,
    },
    {
      id: "js05-leccion-03",
      title: "Truthy, falsy y el operador ternario",
      content: `## Valores truthy y falsy

En JavaScript, **cualquier valor** puede evaluarse como booleano en un contexto condicional.

### Valores falsy (se evaluan como false)

Hay exactamente **7 valores falsy**:

\`\`\`javascript
false       // el booleano false
0           // el numero cero
-0          // cero negativo
""          // string vacio
null        // ausencia de valor
undefined   // sin valor asignado
NaN         // Not a Number
\`\`\`

### Valores truthy (se evaluan como true)

**Todo lo demas** es truthy:

\`\`\`javascript
true         // booleano
42           // cualquier numero distinto de 0
"hola"       // cualquier string no vacio
" "          // string con espacio (no vacio!)
[]           // array vacio (truthy!)
{}           // objeto vacio (truthy!)
"0"          // string "0" (no vacio!)
"false"      // string "false" (no vacio!)
\`\`\`

### Aplicacion practica

\`\`\`javascript
const nombre = "";
if (nombre) {
  console.log("Tiene nombre: " + nombre);
} else {
  console.log("No tiene nombre");  // Se ejecuta esto
}

const lista = [];
if (lista.length) {
  console.log("Lista con elementos");
} else {
  console.log("Lista vacia");  // Se ejecuta esto
}
\`\`\`

### El operador ternario (recordatorio)

\`\`\`javascript
const edad = 17;
const acceso = edad >= 18 ? "Permitido" : "Denegado";

// Equivale a:
let acceso2;
if (edad >= 18) {
  acceso2 = "Permitido";
} else {
  acceso2 = "Denegado";
}
\`\`\`

> **Cuidado:** \`[]\` (array vacio) y \`{}\` (objeto vacio) son **truthy**. Para verificar si un array esta vacio, usa \`array.length === 0\`.`,
      codeExample: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  const res = document.getElementById("resultado");\n  const valores = [false, 0, "", null, undefined, NaN, true, 42, "hola", [], {}];\n  const etiquetas = ['false','0','""','null','undefined','NaN','true','42','"hola"','[]','{}'];\n  valores.forEach((v, i) => {\n    const esTruthy = v ? "truthy" : "falsy";\n    const color = v ? "#4ec9b0" : "#f44747";\n    res.innerHTML += "<p style='color:" + color + "'>" + etiquetas[i] + " → " + esTruthy + "</p>";\n  });\n</script>`,
        css: `#resultado { background: #1e1e1e; border-radius: 8px; }`,
        editable: false,
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
      prompt: "Que se imprime si edad = 15?\n\nif (edad >= 18) { console.log('A'); } else { console.log('B'); }",
      options: [
        { id: "a", text: "A", isCorrect: false },
        { id: "b", text: "B", isCorrect: true },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "15 no es mayor o igual a 18.",
      explanation: "Como 15 < 18, la condicion es false y se ejecuta el bloque else, imprimiendo 'B'.",
    },
    {
      id: "js05-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la condicion para verificar si el numero es positivo:",
      codeTemplate: {
        html: `<script>\n  const numero = 10;\n  ___ (numero ___ 0) {\n    console.log("Es positivo");\n  }\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["if", ">"],
      },
      validation: { type: "exact", answer: ["if", ">"] },
      hint: "Necesitas la palabra clave para una condicion y el operador 'mayor que'.",
      explanation: "if (numero > 0) verifica si el numero es mayor que cero, es decir, positivo.",
    },
    {
      id: "js05-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Escribe un programa que declare una variable 'nota' con valor 75. Usa if/else if/else para mostrar en el div resultado: 'Aprobado' si nota >= 60, o 'Reprobado' si es menor.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Aprobado" },
      hint: "Declara const nota = 75; y usa if (nota >= 60) para mostrar el mensaje.",
      explanation: "Con nota = 75, la condicion nota >= 60 es true, por lo que se muestra 'Aprobado'.",
    },
    {
      id: "js05-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Cual de estos valores es truthy en JavaScript?",
      options: [
        { id: "a", text: "0", isCorrect: false },
        { id: "b", text: "\"\"", isCorrect: false },
        { id: "c", text: "null", isCorrect: false },
        { id: "d", text: "\"0\"", isCorrect: true },
      ],
      validation: { type: "exact", answer: "d" },
      hint: "Un string no vacio siempre es truthy, sin importar su contenido.",
      explanation: "\"0\" es un string no vacio, por lo tanto es truthy. No importa que su contenido sea '0'; lo que importa es que tiene al menos un caracter.",
    },
    {
      id: "js05-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa el switch para que 'lunes' muestre 'Inicio de semana':",
      codeTemplate: {
        html: `<script>\n  const dia = "lunes";\n  ___(dia) {\n    ___ "lunes":\n      console.log("Inicio de semana");\n      break;\n    default:\n      console.log("Otro dia");\n  }\n</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["switch", "case"],
      },
      validation: { type: "exact", answer: ["switch", "case"] },
      hint: "La sentencia que evalua multiples casos se llama 'switch' y cada opcion usa 'case'.",
      explanation: "switch evalua la variable y case define cada posible valor a comparar.",
    },
    {
      id: "js05-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Declara una variable 'hora' con valor 10. Usa el operador ternario para mostrar 'Buenos dias' si hora < 12, o 'Buenas tardes' en caso contrario. Muestra el resultado en el div.",
      codeTemplate: {
        html: `<div id="resultado" style="font-family: monospace; padding: 16px;"></div>\n<script>\n  // Tu codigo aqui\n  \n</script>`,
        cssPrefix: "#resultado { background: #1e1e1e; color: #4ec9b0; border-radius: 8px; min-height: 40px; }",
        cssSuffix: "",
      },
      validation: { type: "includes", answer: "Buenos dias" },
      hint: "Usa: const saludo = hora < 12 ? 'Buenos dias' : 'Buenas tardes';",
      explanation: "El operador ternario condicion ? valorTrue : valorFalse es perfecto para asignaciones simples basadas en una condicion.",
    },
    {
      id: "js05-ej-07",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 15,
      order: 7,
      prompt: "Clasifica cada valor como truthy o falsy:",
      dragItems: [
        { id: "d1", content: "0", correctZone: "z1" },
        { id: "d2", content: "\"hello\"", correctZone: "z2" },
        { id: "d3", content: "null", correctZone: "z1" },
        { id: "d4", content: "[]", correctZone: "z2" },
        { id: "d5", content: "\"\"", correctZone: "z1" },
        { id: "d6", content: "42", correctZone: "z2" },
      ],
      dropZones: [
        { id: "z1", label: "Falsy" },
        { id: "z2", label: "Truthy" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z1", d4: "z2", d5: "z1", d6: "z2" } },
      hint: "Recuerda: 0, '', null, undefined, NaN y false son falsy. Todo lo demas es truthy, incluyendo arrays vacios.",
      explanation: "Los valores falsy son: 0, '', null, undefined, NaN y false. Un array vacio [] y cualquier string/numero no vacio son truthy.",
    },
    {
      id: "js05-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "Que pasa si olvidas poner 'break' en un caso de switch?",
      options: [
        { id: "a", text: "Da un error de sintaxis", isCorrect: false },
        { id: "b", text: "Solo ejecuta ese caso y se detiene", isCorrect: false },
        { id: "c", text: "La ejecucion 'cae' al siguiente caso y ejecuta su codigo tambien (fall-through)", isCorrect: true },
        { id: "d", text: "Se ejecuta el bloque default", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Se llama 'fall-through' y es un comportamiento intencional del lenguaje.",
      explanation: "Sin break, el switch sigue ejecutando el codigo de los siguientes cases hasta encontrar un break o llegar al final del switch. Esto se llama fall-through.",
    },
  ],
};
