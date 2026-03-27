import type { ModuleData } from "@/types";

export const jsAsincronismoModule: ModuleData = {
  slug: "js-asincronismo",
  title: "Asincronismo en JavaScript",
  description:
    "Comprende la programacion asincrona: callbacks, setTimeout/setInterval, Promises, async/await y Promise.all para manejar operaciones que toman tiempo.",
  order: 117,
  dojo: "js",
  category: "js-advanced",
  icon: "clock",
  lessons: [
    {
      id: "js17-leccion-01",
      title: "Sincrono vs Asincrono",
      content: `## Sincrono vs Asincrono

### Codigo sincrono

En codigo sincrono, cada linea se ejecuta **una despues de otra**. La siguiente linea espera a que la anterior termine.

\`\`\`javascript
console.log("Primero");
console.log("Segundo");
console.log("Tercero");
// Primero -> Segundo -> Tercero (en orden)
\`\`\`

### Codigo asincrono

El codigo asincrono permite que ciertas operaciones se ejecuten **sin bloquear** el resto del programa.

\`\`\`javascript
console.log("Primero");
setTimeout(() => {
  console.log("Segundo (despues de 2 segundos)");
}, 2000);
console.log("Tercero");
// Primero -> Tercero -> Segundo
\`\`\`

### ¿Por que necesitamos asincronismo?

Operaciones que **toman tiempo** y no deben bloquear la pagina:
- Peticiones HTTP (fetch de datos de un servidor)
- Lectura de archivos
- Temporizadores (setTimeout, setInterval)
- Animaciones complejas
- Acceso a bases de datos

### Callbacks

Un **callback** es una funcion que se pasa como argumento y se ejecuta despues:

\`\`\`javascript
function saludarDespues(nombre, callback) {
  setTimeout(() => {
    const saludo = "Hola, " + nombre;
    callback(saludo);
  }, 1000);
}

saludarDespues("Ana", (mensaje) => {
  console.log(mensaje); // "Hola, Ana" (despues de 1 segundo)
});
\`\`\`

> **Problema:** Cuando encadenas muchos callbacks, el codigo se vuelve dificil de leer. Esto se conoce como **callback hell**.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <button id="btn" style="padding: 8px 16px; cursor: pointer;">Iniciar secuencia</button>
  <div id="resultado" style="margin-top: 12px; white-space: pre-line;"></div>
</div>
<script>
document.getElementById("btn").addEventListener("click", () => {
  const resultado = document.getElementById("resultado");
  resultado.textContent = "Paso 1: Inicio\\n";
  setTimeout(() => {
    resultado.textContent += "Paso 2: Despues de 1 segundo\\n";
    setTimeout(() => {
      resultado.textContent += "Paso 3: Despues de 2 segundos\\n";
    }, 1000);
  }, 1000);
  resultado.textContent += "Paso 4: Esto se ejecuta inmediatamente\\n";
});
</script>`,
        css: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "js17-leccion-02",
      title: "setTimeout y setInterval",
      content: `## setTimeout y setInterval

### setTimeout

Ejecuta una funcion **una sola vez** despues de un tiempo determinado (en milisegundos):

\`\`\`javascript
const id = setTimeout(() => {
  console.log("Esto se ejecuta despues de 3 segundos");
}, 3000);

// Cancelar antes de que se ejecute
clearTimeout(id);
\`\`\`

### setInterval

Ejecuta una funcion **repetidamente** en intervalos regulares:

\`\`\`javascript
let contador = 0;
const id = setInterval(() => {
  contador++;
  console.log("Tick:", contador);

  if (contador >= 5) {
    clearInterval(id); // Detener despues de 5 veces
  }
}, 1000);
\`\`\`

### Casos de uso comunes

\`\`\`javascript
// Reloj digital
setInterval(() => {
  const ahora = new Date();
  document.querySelector("#reloj").textContent =
    ahora.toLocaleTimeString();
}, 1000);

// Debounce (esperar a que el usuario deje de escribir)
let timeoutId;
input.addEventListener("input", (e) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    buscar(e.target.value);
  }, 300);
});

// Cuenta regresiva
function cuentaRegresiva(segundos) {
  let restante = segundos;
  const id = setInterval(() => {
    console.log(restante);
    restante--;
    if (restante < 0) {
      clearInterval(id);
      console.log("Tiempo!");
    }
  }, 1000);
}
\`\`\`

> **Importante:** Siempre guarda el ID que retorna \`setTimeout\`/\`setInterval\` para poder cancelarlos con \`clearTimeout\`/\`clearInterval\`.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <div id="reloj" style="font-size: 32px; font-weight: bold; font-family: monospace;"></div>
  <button id="iniciar" style="padding: 8px 16px; cursor: pointer; margin: 4px;">Iniciar</button>
  <button id="detener" style="padding: 8px 16px; cursor: pointer; margin: 4px;">Detener</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
let intervaloId = null;
let segundos = 0;
const reloj = document.getElementById("reloj");
reloj.textContent = "00:00";

document.getElementById("iniciar").addEventListener("click", () => {
  if (intervaloId) return;
  intervaloId = setInterval(() => {
    segundos++;
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const seg = String(segundos % 60).padStart(2, "0");
    reloj.textContent = min + ":" + seg;
  }, 1000);
  document.getElementById("resultado").textContent = "Cronometro iniciado";
});

document.getElementById("detener").addEventListener("click", () => {
  clearInterval(intervaloId);
  intervaloId = null;
  document.getElementById("resultado").textContent = "Cronometro detenido en " + reloj.textContent;
});
</script>`,
        css: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "js17-leccion-03",
      title: "Promises",
      content: `## Promises (Promesas)

Una **Promise** (promesa) representa un valor que puede estar disponible ahora, en el futuro o nunca. Es la forma moderna de manejar operaciones asincronas.

### Estados de una Promise

1. **Pending** (pendiente): estado inicial
2. **Fulfilled** (cumplida): la operacion se completo exitosamente
3. **Rejected** (rechazada): la operacion fallo

### Crear una Promise

\`\`\`javascript
const miPromesa = new Promise((resolve, reject) => {
  const exito = true;

  if (exito) {
    resolve("Operacion exitosa!");  // Cumplida
  } else {
    reject("Algo salio mal");       // Rechazada
  }
});
\`\`\`

### Consumir una Promise: then, catch, finally

\`\`\`javascript
miPromesa
  .then(resultado => {
    console.log(resultado); // "Operacion exitosa!"
  })
  .catch(error => {
    console.error(error);   // Si fue rechazada
  })
  .finally(() => {
    console.log("Siempre se ejecuta"); // Exito o error
  });
\`\`\`

### Ejemplo practico: simular una peticion

\`\`\`javascript
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, nombre: "Usuario " + id });
      } else {
        reject("ID invalido");
      }
    }, 1000);
  });
}

obtenerUsuario(1)
  .then(usuario => console.log(usuario))
  .catch(error => console.error(error));
\`\`\`

### Encadenar Promises

\`\`\`javascript
obtenerUsuario(1)
  .then(usuario => {
    console.log(usuario);
    return obtenerPosts(usuario.id); // Retorna otra Promise
  })
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error("Error:", error);
  });
\`\`\`

> **Ventaja:** Las Promises evitan el callback hell y hacen el codigo mas legible.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <button id="cargar" style="padding: 8px 16px; cursor: pointer;">Cargar usuario</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, nombre: "Ana Garcia", email: "ana@correo.com" });
      else reject("ID invalido");
    }, 1500);
  });
}

document.getElementById("cargar").addEventListener("click", () => {
  const resultado = document.getElementById("resultado");
  resultado.textContent = "Cargando...";
  obtenerUsuario(1)
    .then(usuario => {
      resultado.textContent = "Usuario: " + usuario.nombre + " (" + usuario.email + ")";
    })
    .catch(error => {
      resultado.textContent = "Error: " + error;
    });
});
</script>`,
        css: "",
        editable: false,
      },
      order: 3,
    },
    {
      id: "js17-leccion-04",
      title: "async/await y Promise.all",
      content: `## async/await y Promise.all

### async/await

Es una sintaxis mas limpia para trabajar con Promises. Hace que el codigo asincrono **se lea como sincrono**.

\`\`\`javascript
async function cargarDatos() {
  try {
    const usuario = await obtenerUsuario(1);
    console.log(usuario);

    const posts = await obtenerPosts(usuario.id);
    console.log(posts);
  } catch (error) {
    console.error("Error:", error);
  }
}

cargarDatos();
\`\`\`

### Reglas de async/await

1. \`await\` solo puede usarse dentro de una funcion \`async\`
2. \`await\` pausa la ejecucion hasta que la Promise se resuelva
3. Si la Promise es rechazada, \`await\` lanza un error (usar try/catch)

### async siempre retorna una Promise

\`\`\`javascript
async function saludo() {
  return "Hola";
}

saludo().then(msg => console.log(msg)); // "Hola"
\`\`\`

### Promise.all - Ejecutar en paralelo

Ejecuta multiples Promises al mismo tiempo y espera a que **todas** terminen:

\`\`\`javascript
async function cargarTodo() {
  try {
    const [usuario, posts, comentarios] = await Promise.all([
      obtenerUsuario(1),
      obtenerPosts(1),
      obtenerComentarios(1)
    ]);

    console.log(usuario, posts, comentarios);
  } catch (error) {
    console.error("Al menos una fallo:", error);
  }
}
\`\`\`

### Promise.race

Retorna el resultado de la Promise que termine **primero**:

\`\`\`javascript
const resultado = await Promise.race([
  fetch("/api/datos"),
  new Promise((_, reject) =>
    setTimeout(() => reject("Timeout"), 5000)
  )
]);
\`\`\`

### Comparacion de estilos

\`\`\`javascript
// Con .then()
obtenerUsuario(1)
  .then(u => obtenerPosts(u.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// Con async/await
async function cargar() {
  try {
    const u = await obtenerUsuario(1);
    const posts = await obtenerPosts(u.id);
    console.log(posts);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

> **Recomendacion:** Usa \`async/await\` para la mayoria de los casos. Usa \`Promise.all\` cuando tengas operaciones independientes que pueden ejecutarse en paralelo.`,
      codeExample: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <button id="cargar" style="padding: 8px 16px; cursor: pointer;">Cargar datos en paralelo</button>
  <div id="resultado" style="margin-top: 12px; white-space: pre-line;"></div>
</div>
<script>
function simularPeticion(nombre, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(nombre + " cargado"), ms);
  });
}

document.getElementById("cargar").addEventListener("click", async () => {
  const resultado = document.getElementById("resultado");
  resultado.textContent = "Cargando todo en paralelo...";
  const inicio = Date.now();
  try {
    const [usuarios, posts, comentarios] = await Promise.all([
      simularPeticion("Usuarios", 1000),
      simularPeticion("Posts", 1500),
      simularPeticion("Comentarios", 800)
    ]);
    const tiempo = Date.now() - inicio;
    resultado.textContent = usuarios + "\\n" + posts + "\\n" + comentarios +
      "\\n\\nTiempo total: " + tiempo + "ms (en paralelo, no 3300ms)";
  } catch (error) {
    resultado.textContent = "Error: " + error;
  }
});
</script>`,
        css: "",
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js17-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Que imprime este codigo?\n```javascript\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nconsole.log('C');\n```",
      options: [
        { id: "a", text: "A, B, C", isCorrect: false },
        { id: "b", text: "A, C, B", isCorrect: true },
        { id: "c", text: "B, A, C", isCorrect: false },
        { id: "d", text: "A, C (B nunca se ejecuta)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "setTimeout siempre se ejecuta despues del codigo sincrono, incluso con 0ms.",
      explanation: "setTimeout va a la cola de tareas asincronas. Primero se ejecuta todo el codigo sincrono (A, C), luego el callback (B).",
    },
    {
      id: "js17-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "¿Cuales son los tres estados posibles de una Promise?",
      options: [
        { id: "a", text: "start, running, done", isCorrect: false },
        { id: "b", text: "pending, fulfilled, rejected", isCorrect: true },
        { id: "c", text: "waiting, success, failure", isCorrect: false },
        { id: "d", text: "open, closed, error", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los estados originales estan en ingles: pendiente, cumplida, rechazada.",
      explanation: "Una Promise puede estar pending (pendiente), fulfilled (cumplida) o rejected (rechazada).",
    },
    {
      id: "js17-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Crea un setTimeout que imprima 'Hola' despues de 2 segundos.",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: "",
        blanks: ['setTimeout(() => { console.log("Hola") }, 2000)'],
      },
      validation: { type: "regex", answer: "setTimeout\\s*\\(" },
      hint: "setTimeout recibe una funcion callback y el tiempo en milisegundos.",
      explanation: "`setTimeout(callback, 2000)` ejecuta el callback una vez despues de 2000ms (2 segundos).",
    },
    {
      id: "js17-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Completa la Promise para que se resuelva con el mensaje 'Exito!' despues de 1 segundo.",
      codeTemplate: {
        html: "",
        cssPrefix: "const miPromesa = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    ",
        cssSuffix: "\n  }, 1000);\n});",
        blanks: ['resolve("Exito!");'],
      },
      validation: { type: "regex", answer: "resolve\\s*\\(\\s*[\"']Exito![\"']\\s*\\)" },
      hint: "Usa resolve() para cumplir la Promise con un valor.",
      explanation: '`resolve("Exito!")` cumple la Promise y pasa el valor a `.then()`.',
    },
    {
      id: "js17-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Relaciona cada concepto asincrono con su descripcion.",
      dragItems: [
        { id: "d1", content: "callback", correctZone: "funcion" },
        { id: "d2", content: "Promise", correctZone: "objeto" },
        { id: "d3", content: "async/await", correctZone: "sintaxis" },
        { id: "d4", content: "Promise.all", correctZone: "paralelo" },
      ],
      dropZones: [
        { id: "funcion", label: "Funcion pasada como argumento para ejecutar despues" },
        { id: "objeto", label: "Objeto que representa un valor futuro" },
        { id: "sintaxis", label: "Sintaxis moderna para escribir codigo asincrono legible" },
        { id: "paralelo", label: "Ejecuta multiples operaciones en paralelo" },
      ],
      validation: { type: "exact", answer: { d1: "funcion", d2: "objeto", d3: "sintaxis", d4: "paralelo" } },
      hint: "Piensa en que es cada concepto: una funcion, un objeto, una sintaxis o una utilidad.",
      explanation: "Callback es una funcion, Promise un objeto, async/await es azucar sintactica, Promise.all ejecuta en paralelo.",
    },
    {
      id: "js17-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Consume la promesa usando async/await con manejo de errores.",
      codeTemplate: {
        html: "",
        cssPrefix: "async function cargarDatos() {\n  ",
        cssSuffix: " {\n    const datos = await obtenerDatos();\n    console.log(datos);\n  } catch (error) {\n    console.error(error);\n  }\n}",
        blanks: ["try"],
      },
      validation: { type: "exact", answer: "try" },
      hint: "Con async/await, los errores se manejan con un bloque que empieza con...",
      explanation: "`try/catch` es la forma de manejar errores con async/await.",
    },
    {
      id: "js17-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt: "Crea una funcion que simule cargar datos con una Promise (1 segundo de espera). Al hacer clic en el boton, muestra 'Cargando...' y luego el resultado.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <button id="cargar" style="padding: 8px 16px; cursor: pointer;">Cargar datos</button>
  <div id="resultado" style="margin-top: 12px;"></div>
</div>
<script>
// Crea una funcion que retorne una Promise que se resuelve despues de 1 segundo


// Al hacer clic, muestra "Cargando..." y luego el resultado de la Promise


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "Promise" },
      hint: "Crea una funcion que retorne new Promise con setTimeout dentro, y usa .then() o await.",
      explanation: "Retorna `new Promise(resolve => setTimeout(() => resolve(datos), 1000))` y consume con .then() o async/await.",
    },
    {
      id: "js17-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt: "Usa Promise.all para ejecutar 3 peticiones simuladas en paralelo y muestra los resultados cuando todas terminen. Muestra el tiempo total.",
      codeTemplate: {
        html: `<div style="font-family: system-ui; padding: 16px;">
  <button id="cargar" style="padding: 8px 16px; cursor: pointer;">Cargar en paralelo</button>
  <div id="resultado" style="margin-top: 12px; white-space: pre-line;"></div>
</div>
<script>
function simularPeticion(nombre, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(nombre + " listo"), ms);
  });
}

// Usa Promise.all para ejecutar las 3 peticiones en paralelo
// Mide el tiempo con Date.now()


</script>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: { type: "includes", answer: "Promise.all" },
      hint: "Usa Promise.all([...]) con await o .then() y Date.now() para medir el tiempo.",
      explanation: "`Promise.all` espera a que todas las Promises se resuelvan, ejecutandolas en paralelo.",
    },
  ],
};
