import type { ModuleData } from "@/types";

export const jsObjetosModule: ModuleData = {
  slug: "js-objetos",
  title: "Objetos en JavaScript",
  description:
    "Aprende a crear y manipular objetos: acceso a propiedades, destructuring, spread operator, Object.keys/values/entries y objetos anidados.",
  order: 110,
  dojo: "js",
  category: "js-intermediate",
  icon: "braces",
  lessons: [
    {
      id: "js10-leccion-01",
      title: "Crear y acceder a objetos",
      content: `## Crear y acceder a objetos

Un **objeto** en JavaScript es una coleccion de pares **clave-valor**. Es la estructura de datos mas importante del lenguaje.

### Crear un objeto

\`\`\`javascript
const persona = {
  nombre: "Ana",
  edad: 28,
  profesion: "Desarrolladora"
};
\`\`\`

### Acceso con punto (dot notation)

\`\`\`javascript
console.log(persona.nombre);    // "Ana"
console.log(persona.edad);      // 28
\`\`\`

### Acceso con corchetes (bracket notation)

\`\`\`javascript
console.log(persona["nombre"]); // "Ana"

// Util cuando la clave es dinamica
const clave = "profesion";
console.log(persona[clave]);    // "Desarrolladora"
\`\`\`

### Modificar y agregar propiedades

\`\`\`javascript
persona.edad = 29;              // Modificar
persona.ciudad = "CDMX";       // Agregar nueva propiedad
delete persona.profesion;       // Eliminar propiedad
\`\`\`

### Verificar si una propiedad existe

\`\`\`javascript
console.log("nombre" in persona);         // true
console.log(persona.hasOwnProperty("edad")); // true
\`\`\`

> **Nota:** Usa bracket notation cuando la clave tiene espacios, caracteres especiales o es una variable.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Datos de la persona</h3>
  <div id="resultado"></div>
</div>
<script>
const persona = { nombre: "Ana", edad: 28, profesion: "Desarrolladora" };
const info = Object.entries(persona)
  .map(([k, v]) => k + ": " + v)
  .join(" | ");
document.getElementById("resultado").textContent = info;
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js10-leccion-02",
      title: "Destructuring de objetos",
      content: `## Destructuring de objetos

El **destructuring** permite extraer propiedades de un objeto en variables individuales de forma elegante.

### Sintaxis basica

\`\`\`javascript
const persona = { nombre: "Luis", edad: 25, ciudad: "Madrid" };

const { nombre, edad, ciudad } = persona;
console.log(nombre); // "Luis"
console.log(edad);   // 25
\`\`\`

### Renombrar variables

\`\`\`javascript
const { nombre: nombreCompleto, edad: anos } = persona;
console.log(nombreCompleto); // "Luis"
console.log(anos);           // 25
\`\`\`

### Valores por defecto

\`\`\`javascript
const { nombre, pais = "Desconocido" } = persona;
console.log(pais); // "Desconocido" (no existe en el objeto)
\`\`\`

### Destructuring en parametros de funcion

\`\`\`javascript
function saludar({ nombre, edad }) {
  return \`Hola, soy \${nombre} y tengo \${edad} anos\`;
}

console.log(saludar(persona)); // "Hola, soy Luis y tengo 25 anos"
\`\`\`

### Rest en destructuring

\`\`\`javascript
const { nombre, ...resto } = persona;
console.log(resto); // { edad: 25, ciudad: "Madrid" }
\`\`\`

> **Tip:** El destructuring es muy comun en React y en funciones que reciben objetos de configuracion.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Destructuring</h3>
  <div id="resultado"></div>
</div>
<script>
const config = { tema: "oscuro", idioma: "es", fontSize: 16 };
const { tema, idioma, fontSize } = config;
document.getElementById("resultado").textContent =
  "Tema: " + tema + " | Idioma: " + idioma + " | Fuente: " + fontSize + "px";
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js10-leccion-03",
      title: "Spread operator y copia de objetos",
      content: `## Spread operator y copia de objetos

El operador **spread** (\`...\`) permite copiar y combinar objetos facilmente.

### Copiar un objeto

\`\`\`javascript
const original = { a: 1, b: 2 };
const copia = { ...original };
console.log(copia); // { a: 1, b: 2 }
\`\`\`

### Combinar objetos

\`\`\`javascript
const datosBase = { nombre: "Ana", edad: 28 };
const datosExtra = { ciudad: "Lima", profesion: "Dev" };
const completo = { ...datosBase, ...datosExtra };
console.log(completo);
// { nombre: "Ana", edad: 28, ciudad: "Lima", profesion: "Dev" }
\`\`\`

### Sobrescribir propiedades

\`\`\`javascript
const config = { tema: "claro", idioma: "en" };
const miConfig = { ...config, idioma: "es" };
console.log(miConfig); // { tema: "claro", idioma: "es" }
\`\`\`

### Cuidado: copia superficial

\`\`\`javascript
const obj = { datos: { x: 1 } };
const copia = { ...obj };
copia.datos.x = 999;
console.log(obj.datos.x); // 999 (se modifico el original!)
\`\`\`

El spread solo copia el **primer nivel**. Los objetos anidados siguen siendo referencias.

> **Para copias profundas** puedes usar \`structuredClone(obj)\` o \`JSON.parse(JSON.stringify(obj))\`.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Combinar objetos con spread</h3>
  <div id="resultado"></div>
</div>
<script>
const base = { nombre: "Carlos", rol: "usuario" };
const admin = { ...base, rol: "admin", permisos: ["leer", "escribir"] };
document.getElementById("resultado").textContent = JSON.stringify(admin, null, 2);
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
    {
      id: "js10-leccion-04",
      title: "Object.keys, values, entries y objetos anidados",
      content: `## Object.keys, values, entries y objetos anidados

### Metodos estaticos de Object

\`\`\`javascript
const producto = { nombre: "Laptop", precio: 15000, marca: "Dell" };

Object.keys(producto);    // ["nombre", "precio", "marca"]
Object.values(producto);  // ["Laptop", 15000, "Dell"]
Object.entries(producto); // [["nombre","Laptop"], ["precio",15000], ["marca","Dell"]]
\`\`\`

### Iterar sobre un objeto

\`\`\`javascript
for (const [clave, valor] of Object.entries(producto)) {
  console.log(\`\${clave}: \${valor}\`);
}
\`\`\`

### Objetos anidados

\`\`\`javascript
const empresa = {
  nombre: "TechCorp",
  direccion: {
    calle: "Av. Reforma 100",
    ciudad: "CDMX",
    pais: "Mexico"
  },
  empleados: [
    { nombre: "Ana", puesto: "Dev" },
    { nombre: "Luis", puesto: "Diseno" }
  ]
};

// Acceder a datos anidados
console.log(empresa.direccion.ciudad); // "CDMX"
console.log(empresa.empleados[0].nombre); // "Ana"
\`\`\`

### Optional chaining (?.)

\`\`\`javascript
// Evita errores si una propiedad no existe
console.log(empresa.contacto?.telefono); // undefined (sin error)
\`\`\`

> **Tip:** \`Object.entries\` es ideal para transformar objetos en arrays y viceversa con \`Object.fromEntries\`.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Propiedades del objeto</h3>
  <div id="resultado"></div>
</div>
<script>
const coche = { marca: "Toyota", modelo: "Corolla", anio: 2023, color: "Rojo" };
const lista = Object.entries(coche)
  .map(([k, v]) => "<b>" + k + "</b>: " + v)
  .join("<br>");
document.getElementById("resultado").innerHTML = lista;
</script>`,
        css: "",
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js10-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Cual es la forma correcta de acceder a una propiedad de un objeto cuando la clave esta en una variable?",
      options: [
        { id: "a", text: "objeto.variable", isCorrect: false },
        { id: "b", text: "objeto[variable]", isCorrect: true },
        { id: "c", text: "objeto{variable}", isCorrect: false },
        { id: "d", text: "objeto->variable", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Usa la notacion que acepta expresiones dentro de simbolos.",
      explanation: "Cuando la clave esta en una variable, se usa bracket notation: `objeto[variable]`.",
    },
    {
      id: "js10-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Usa destructuring para extraer nombre y edad del objeto persona.",
      codeTemplate: {
        html: "",
        cssPrefix: "const persona = { nombre: \"Ana\", edad: 28, ciudad: \"Lima\" };\n",
        cssSuffix: "\nconsole.log(nombre); // \"Ana\"\nconsole.log(edad);   // 28",
        blanks: ["const { nombre, edad } = persona;"],
      },
      validation: { type: "regex", answer: "const\\s*\\{\\s*nombre\\s*,\\s*edad\\s*\\}\\s*=\\s*persona" },
      hint: "La sintaxis de destructuring usa llaves a la izquierda del =.",
      explanation: "`const { nombre, edad } = persona;` extrae esas dos propiedades en variables.",
    },
    {
      id: "js10-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "¿Que retorna `Object.keys({ a: 1, b: 2, c: 3 })`?",
      options: [
        { id: "a", text: "[1, 2, 3]", isCorrect: false },
        { id: "b", text: '["a", "b", "c"]', isCorrect: true },
        { id: "c", text: '[["a", 1], ["b", 2], ["c", 3]]', isCorrect: false },
        { id: "d", text: "{ a: 1, b: 2, c: 3 }", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "keys significa llaves/claves en ingles.",
      explanation: "`Object.keys` retorna un array con las claves del objeto: [\"a\", \"b\", \"c\"].",
    },
    {
      id: "js10-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Usa el spread operator para crear una copia del objeto `config` y cambiar el `tema` a \"oscuro\".",
      codeTemplate: {
        html: "",
        cssPrefix: "const config = { tema: \"claro\", idioma: \"es\", fontSize: 14 };\nconst nuevaConfig = { ",
        cssSuffix: " };\nconsole.log(nuevaConfig.tema); // \"oscuro\"",
        blanks: ["...config, tema: \"oscuro\""],
      },
      validation: { type: "regex", answer: "\\.\\.\\.config\\s*,\\s*tema\\s*:\\s*[\"']oscuro[\"']" },
      hint: "Primero copia todas las propiedades con spread y luego sobrescribe tema.",
      explanation: "`{ ...config, tema: \"oscuro\" }` copia todo y sobrescribe la propiedad tema.",
    },
    {
      id: "js10-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada metodo de Object segun lo que retorna.",
      dragItems: [
        { id: "d1", content: "Object.keys(obj)", correctZone: "claves" },
        { id: "d2", content: "Object.values(obj)", correctZone: "valores" },
        { id: "d3", content: "Object.entries(obj)", correctZone: "pares" },
      ],
      dropZones: [
        { id: "claves", label: "Array de claves (strings)" },
        { id: "valores", label: "Array de valores" },
        { id: "pares", label: "Array de pares [clave, valor]" },
      ],
      validation: { type: "exact", answer: { d1: "claves", d2: "valores", d3: "pares" } },
      hint: "Piensa en que parte del objeto extrae cada metodo.",
      explanation: "keys retorna las claves, values los valores y entries pares [clave, valor].",
    },
    {
      id: "js10-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Accede a la ciudad dentro del objeto anidado empresa.",
      codeTemplate: {
        html: "",
        cssPrefix: "const empresa = {\n  nombre: \"TechCorp\",\n  direccion: { calle: \"Reforma 100\", ciudad: \"CDMX\" }\n};\nconst ciudad = ",
        cssSuffix: ";\nconsole.log(ciudad); // \"CDMX\"",
        blanks: ["empresa.direccion.ciudad"],
      },
      validation: { type: "regex", answer: "empresa\\.direccion\\.ciudad" },
      hint: "Encadena el acceso con punto para llegar a la propiedad anidada.",
      explanation: "`empresa.direccion.ciudad` accede paso a paso: empresa -> direccion -> ciudad.",
    },
    {
      id: "js10-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Crea un objeto `estudiante` con nombre, edad y materias (array). Luego muestra toda la informacion en el div resultado usando Object.entries.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Datos del estudiante</h3>
  <div id="resultado"></div>
</div>
<script>
// Crea el objeto estudiante con nombre, edad y materias (array)


// Muestra la informacion en el div resultado

</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "Object.entries" },
      hint: "Crea el objeto y usa Object.entries para iterar sus propiedades.",
      explanation: "Crea el objeto y recorre con Object.entries para mostrar cada clave y valor.",
    },
    {
      id: "js10-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 8,
      prompt: "¿Que imprime este codigo?\n```javascript\nconst a = { x: 1, y: 2 };\nconst b = { ...a, y: 5, z: 3 };\nconsole.log(b.y);\n```",
      options: [
        { id: "a", text: "2", isCorrect: false },
        { id: "b", text: "5", isCorrect: true },
        { id: "c", text: "undefined", isCorrect: false },
        { id: "d", text: "Error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las propiedades que vienen despues del spread sobrescriben las anteriores.",
      explanation: "El spread copia y: 2, pero luego y: 5 lo sobrescribe. Resultado: 5.",
    },
  ],
};
