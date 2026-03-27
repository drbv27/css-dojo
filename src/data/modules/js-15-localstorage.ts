import type { ModuleData } from "@/types";

export const jsLocalStorageModule: ModuleData = {
  slug: "js-localstorage",
  title: "LocalStorage",
  description:
    "Aprende a persistir datos en el navegador con localStorage: guardar, leer, eliminar datos y trabajar con JSON para almacenar objetos y arrays.",
  order: 115,
  dojo: "js",
  category: "js-intermediate",
  icon: "database",
  lessons: [
    {
      id: "js15-leccion-01",
      title: "Introduccion a localStorage",
      content: `## Introduccion a localStorage

**localStorage** es una API del navegador que permite almacenar datos de forma **persistente** en el dispositivo del usuario. Los datos se mantienen incluso al cerrar el navegador.

### Caracteristicas

- Almacena datos como **pares clave-valor** (ambos son strings)
- Capacidad de ~5MB por dominio
- Los datos **persisten** hasta que se borran explicitamente
- Solo accesible desde el **mismo dominio** (misma politica de origen)
- Es **sincrono** (bloquea el hilo principal)

### setItem - Guardar datos

\`\`\`javascript
localStorage.setItem("nombre", "Ana");
localStorage.setItem("edad", "28");
localStorage.setItem("tema", "oscuro");
\`\`\`

### getItem - Leer datos

\`\`\`javascript
const nombre = localStorage.getItem("nombre");
console.log(nombre); // "Ana"

const inexistente = localStorage.getItem("clave-que-no-existe");
console.log(inexistente); // null
\`\`\`

### removeItem - Eliminar un dato

\`\`\`javascript
localStorage.removeItem("edad");
\`\`\`

### clear - Eliminar todo

\`\`\`javascript
localStorage.clear(); // Borra TODOS los datos del dominio
\`\`\`

### length y key

\`\`\`javascript
console.log(localStorage.length); // Cantidad de items
console.log(localStorage.key(0)); // Nombre de la primera clave
\`\`\`

> **Importante:** localStorage SOLO almacena strings. Si guardas un numero, se convierte a string.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <input id="nombre" type="text" placeholder="Tu nombre" style="padding: 8px; font-size: 16px;">
  <button id="guardar" style="padding: 8px 16px; cursor: pointer;">Guardar</button>
  <button id="cargar" style="padding: 8px 16px; cursor: pointer;">Cargar</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
document.getElementById("guardar").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  localStorage.setItem("demo-nombre", nombre);
  document.getElementById("resultado").textContent = "Guardado: " + nombre;
});
document.getElementById("cargar").addEventListener("click", () => {
  const nombre = localStorage.getItem("demo-nombre");
  document.getElementById("resultado").textContent = nombre ? "Cargado: " + nombre : "No hay datos guardados";
});
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js15-leccion-02",
      title: "JSON.stringify y JSON.parse",
      content: `## JSON.stringify y JSON.parse

Como localStorage solo almacena strings, necesitamos **convertir** objetos y arrays a texto (y viceversa) con JSON.

### JSON.stringify - Convertir a string

\`\`\`javascript
const usuario = { nombre: "Luis", edad: 25, activo: true };
const texto = JSON.stringify(usuario);
console.log(texto);
// '{"nombre":"Luis","edad":25,"activo":true}'

localStorage.setItem("usuario", texto);
\`\`\`

### JSON.parse - Convertir de string a objeto

\`\`\`javascript
const texto = localStorage.getItem("usuario");
const usuario = JSON.parse(texto);
console.log(usuario.nombre); // "Luis"
console.log(usuario.edad);   // 25 (numero, no string!)
\`\`\`

### Guardar arrays

\`\`\`javascript
const tareas = ["Estudiar", "Ejercicio", "Cocinar"];
localStorage.setItem("tareas", JSON.stringify(tareas));

// Recuperar
const tareasGuardadas = JSON.parse(localStorage.getItem("tareas"));
console.log(tareasGuardadas); // ["Estudiar", "Ejercicio", "Cocinar"]
\`\`\`

### Patron seguro de lectura

\`\`\`javascript
function obtenerDatos(clave, valorPorDefecto) {
  const datos = localStorage.getItem(clave);
  if (datos === null) return valorPorDefecto;
  try {
    return JSON.parse(datos);
  } catch {
    return valorPorDefecto;
  }
}

const tareas = obtenerDatos("tareas", []);
const config = obtenerDatos("config", { tema: "claro" });
\`\`\`

> **Cuidado:** Si \`getItem\` retorna \`null\` y haces \`JSON.parse(null)\`, el resultado es \`null\` (no da error). Pero si el string no es JSON valido, \`JSON.parse\` lanza un error.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Lista de compras persistente</h3>
  <div id="lista"></div>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
const compras = ["Leche", "Pan", "Huevos", "Frutas"];
localStorage.setItem("demo-compras", JSON.stringify(compras));
const guardadas = JSON.parse(localStorage.getItem("demo-compras"));
document.getElementById("lista").innerHTML = guardadas.map(c => "<li>" + c + "</li>").join("");
document.getElementById("resultado").textContent = "Items guardados: " + guardadas.length;
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js15-leccion-03",
      title: "Patrones practicos con localStorage",
      content: `## Patrones practicos con localStorage

### Guardar preferencias del usuario

\`\`\`javascript
function guardarPreferencias(prefs) {
  localStorage.setItem("preferencias", JSON.stringify(prefs));
}

function cargarPreferencias() {
  const datos = localStorage.getItem("preferencias");
  return datos ? JSON.parse(datos) : { tema: "claro", idioma: "es", fontSize: 16 };
}

// Uso
guardarPreferencias({ tema: "oscuro", idioma: "es", fontSize: 18 });
const prefs = cargarPreferencias();
\`\`\`

### Lista de tareas persistente

\`\`\`javascript
function obtenerTareas() {
  return JSON.parse(localStorage.getItem("tareas") || "[]");
}

function agregarTarea(texto) {
  const tareas = obtenerTareas();
  tareas.push({ id: Date.now(), texto, completada: false });
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function eliminarTarea(id) {
  const tareas = obtenerTareas().filter(t => t.id !== id);
  localStorage.setItem("tareas", JSON.stringify(tareas));
}
\`\`\`

### sessionStorage vs localStorage

| Caracteristica | localStorage | sessionStorage |
|---------------|-------------|---------------|
| Persistencia | Permanente | Solo la sesion (pestana) |
| Se comparte entre pestanas | Si | No |
| API | Identica | Identica |

\`\`\`javascript
sessionStorage.setItem("temp", "dato temporal");
// Se borra al cerrar la pestana
\`\`\`

### Limitaciones importantes

- **No guardes datos sensibles** (contrasenas, tokens de larga duracion)
- Es sincrono: no guardes datos muy grandes
- El usuario puede borrar los datos en cualquier momento
- No es una base de datos: para datos complejos usa IndexedDB

> **Tip:** localStorage es ideal para preferencias, borradores, carritos de compra y datos que mejoren la experiencia del usuario.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Contador persistente</h3>
  <p>Este contador recuerda su valor entre recargas:</p>
  <div style="font-size: 32px; font-weight: bold;" id="contador">0</div>
  <button id="incrementar" style="padding: 8px 16px; cursor: pointer; margin: 4px;">+1</button>
  <button id="resetear" style="padding: 8px 16px; cursor: pointer; margin: 4px;">Resetear</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
let cuenta = Number(localStorage.getItem("demo-contador") || 0);
const contadorEl = document.getElementById("contador");
const resultadoEl = document.getElementById("resultado");
contadorEl.textContent = cuenta;
document.getElementById("incrementar").addEventListener("click", () => {
  cuenta++;
  contadorEl.textContent = cuenta;
  localStorage.setItem("demo-contador", cuenta);
  resultadoEl.textContent = "Guardado en localStorage";
});
document.getElementById("resetear").addEventListener("click", () => {
  cuenta = 0;
  contadorEl.textContent = cuenta;
  localStorage.removeItem("demo-contador");
  resultadoEl.textContent = "Contador reseteado";
});
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js15-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Que tipo de datos puede almacenar localStorage directamente?",
      options: [
        { id: "a", text: "Numeros, strings y booleanos", isCorrect: false },
        { id: "b", text: "Solo strings", isCorrect: true },
        { id: "c", text: "Objetos y arrays", isCorrect: false },
        { id: "d", text: "Cualquier tipo de dato", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "localStorage guarda todo como texto.",
      explanation: "localStorage solo almacena strings. Para guardar otros tipos hay que usar JSON.stringify.",
    },
    {
      id: "js15-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: 'Guarda el nombre "Carlos" en localStorage con la clave "usuario".',
      codeTemplate: {
        html: "",
        cssPrefix: "localStorage.",
        cssSuffix: ";",
        blanks: ['setItem("usuario", "Carlos")'],
      },
      validation: { type: "regex", answer: "setItem\\s*\\(\\s*[\"']usuario[\"']\\s*,\\s*[\"']Carlos[\"']\\s*\\)" },
      hint: "setItem recibe la clave y el valor como argumentos.",
      explanation: '`localStorage.setItem("usuario", "Carlos")` guarda el dato con la clave "usuario".',
    },
    {
      id: "js15-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Guarda el array de colores en localStorage usando JSON.stringify.",
      codeTemplate: {
        html: "",
        cssPrefix: 'const colores = ["rojo", "verde", "azul"];\nlocalStorage.setItem("colores", ',
        cssSuffix: ");",
        blanks: ["JSON.stringify(colores)"],
      },
      validation: { type: "regex", answer: "JSON\\.stringify\\s*\\(\\s*colores\\s*\\)" },
      hint: "JSON.stringify convierte el array en un string JSON.",
      explanation: "`JSON.stringify(colores)` convierte el array a texto para poder guardarlo en localStorage.",
    },
    {
      id: "js15-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: 'Recupera y parsea los datos guardados con clave "config" de localStorage.',
      codeTemplate: {
        html: "",
        cssPrefix: "const config = JSON.parse(",
        cssSuffix: ');\nconsole.log(config);',
        blanks: ['localStorage.getItem("config")'],
      },
      validation: { type: "regex", answer: "localStorage\\.getItem\\s*\\(\\s*[\"']config[\"']\\s*\\)" },
      hint: "Primero getItem para leer el string, luego JSON.parse para convertir a objeto.",
      explanation: '`JSON.parse(localStorage.getItem("config"))` lee el string y lo convierte a objeto/array.',
    },
    {
      id: "js15-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Relaciona cada metodo de localStorage con su funcion.",
      dragItems: [
        { id: "d1", content: "setItem(clave, valor)", correctZone: "guardar" },
        { id: "d2", content: "getItem(clave)", correctZone: "leer" },
        { id: "d3", content: "removeItem(clave)", correctZone: "eliminar" },
        { id: "d4", content: "clear()", correctZone: "borrar" },
      ],
      dropZones: [
        { id: "guardar", label: "Guardar un dato" },
        { id: "leer", label: "Leer un dato" },
        { id: "eliminar", label: "Eliminar un dato especifico" },
        { id: "borrar", label: "Borrar todos los datos" },
      ],
      validation: { type: "exact", answer: { d1: "guardar", d2: "leer", d3: "eliminar", d4: "borrar" } },
      hint: "Los nombres de los metodos son descriptivos en ingles.",
      explanation: "setItem guarda, getItem lee, removeItem elimina uno y clear borra todo.",
    },
    {
      id: "js15-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "¿Que retorna `localStorage.getItem('clave-inexistente')`?",
      options: [
        { id: "a", text: "undefined", isCorrect: false },
        { id: "b", text: '""  (string vacio)', isCorrect: false },
        { id: "c", text: "null", isCorrect: true },
        { id: "d", text: "Lanza un error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "No lanza un error, pero tampoco retorna un string.",
      explanation: "`getItem` retorna `null` cuando la clave no existe en localStorage.",
    },
    {
      id: "js15-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Crea un sistema de notas: al escribir en el textarea y hacer clic en guardar, almacena el texto en localStorage. Al cargar la pagina, muestra la nota guardada.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <h3>Bloc de notas</h3>
  <textarea id="nota" rows="4" style="width: 100%; box-sizing: border-box; padding: 8px; font-size: 14px;" placeholder="Escribe tu nota..."></textarea>
  <br>
  <button id="guardar" style="padding: 8px 16px; cursor: pointer; margin-top: 8px;">Guardar nota</button>
  <button id="borrar" style="padding: 8px 16px; cursor: pointer; margin-top: 8px;">Borrar nota</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
// Carga la nota guardada al iniciar

// Guarda la nota al hacer clic en el boton

// Borra la nota al hacer clic en borrar

</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "localStorage" },
      hint: "Usa getItem al cargar para rellenar el textarea y setItem en el evento click para guardar.",
      explanation: "Carga con `getItem` al inicio, guarda con `setItem` en el click y borra con `removeItem`.",
    },
  ],
};
