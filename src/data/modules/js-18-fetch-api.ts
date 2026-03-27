import type { ModuleData } from "@/types";

export const jsFetchApiModule: ModuleData = {
  slug: "js-fetch-api",
  title: "Fetch API",
  description:
    "Aprende a comunicarte con servidores y APIs externas usando fetch(), manejar respuestas JSON, realizar peticiones GET y POST, y dominar async/await para codigo asincrono limpio.",
  order: 118,
  category: "js-advanced",
  icon: "globe",
  dojo: "js",
  lessons: [
    {
      id: "js-18-leccion-01",
      title: "Introduccion a Fetch y peticiones GET",
      content: `## Introduccion a Fetch API

### Que es Fetch?

**fetch()** es la forma moderna de hacer peticiones HTTP desde JavaScript. Reemplaza al antiguo \`XMLHttpRequest\` con una API basada en **Promesas**, mucho mas limpia y facil de usar.

### Tu primera peticion GET

\`\`\`javascript
// fetch() devuelve una Promesa
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
\`\`\`

### Como funciona fetch()

1. **fetch(url)** - Inicia la peticion HTTP
2. **response** - Recibimos un objeto Response (metadatos)
3. **response.json()** - Parseamos el body como JSON (tambien devuelve una Promesa)
4. **data** - Finalmente tenemos los datos

### El objeto Response

\`\`\`javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    console.log(response.status);     // 200
    console.log(response.ok);         // true (status 200-299)
    console.log(response.statusText); // "OK"
    console.log(response.headers);    // Headers del response
    return response.json();
  })
  .then(data => console.log(data));
\`\`\`

### Obtener listas de datos

\`\`\`javascript
// Obtener todos los posts
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(posts => {
    console.log('Total posts:', posts.length);
    posts.forEach(post => {
      console.log(post.title);
    });
  });
\`\`\`

### Otros metodos de Response

\`\`\`javascript
response.json();  // Parsea como JSON
response.text();  // Devuelve texto plano
response.blob();  // Para archivos binarios (imagenes, etc.)
\`\`\`

> **Nota:** JSONPlaceholder (jsonplaceholder.typicode.com) es una API gratuita de prueba perfecta para practicar.`,
      order: 1,
    },
    {
      id: "js-18-leccion-02",
      title: "Async/Await con Fetch",
      content: `## Async/Await con Fetch

### Por que async/await?

Las cadenas de \`.then()\` pueden volverse dificiles de leer. **async/await** nos permite escribir codigo asincrono que parece sincrono.

### Sintaxis basica

\`\`\`javascript
// Con .then()
fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(response => response.json())
  .then(user => console.log(user.name));

// Con async/await (equivalente, pero mas limpio)
async function obtenerUsuario() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  const user = await response.json();
  console.log(user.name);
}

obtenerUsuario();
\`\`\`

### Reglas de async/await

1. **async** se pone antes de la funcion
2. **await** solo se puede usar dentro de funciones async
3. **await** pausa la ejecucion hasta que la Promesa se resuelva

### Multiples peticiones secuenciales

\`\`\`javascript
async function obtenerPostYComentarios(postId) {
  // Primero obtenemos el post
  const resPost = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${postId}\`
  );
  const post = await resPost.json();

  // Luego obtenemos sus comentarios
  const resComentarios = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${postId}/comments\`
  );
  const comentarios = await resComentarios.json();

  return { post, comentarios };
}
\`\`\`

### Peticiones en paralelo con Promise.all

\`\`\`javascript
async function obtenerDatos() {
  const [usuarios, posts] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
    fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()),
  ]);

  console.log('Usuarios:', usuarios.length);
  console.log('Posts:', posts.length);
}
\`\`\`

> **Consejo:** Usa \`Promise.all\` cuando las peticiones no dependen una de la otra. Es mucho mas rapido que hacerlas secuencialmente.`,
      order: 2,
    },
    {
      id: "js-18-leccion-03",
      title: "Peticiones POST y otros metodos",
      content: `## Peticiones POST y otros metodos HTTP

### Metodos HTTP

- **GET** - Obtener datos (por defecto en fetch)
- **POST** - Crear datos nuevos
- **PUT** - Actualizar datos (reemplazo completo)
- **PATCH** - Actualizar datos (parcial)
- **DELETE** - Eliminar datos

### Peticion POST

\`\`\`javascript
async function crearPost() {
  const nuevoPost = {
    title: 'Mi nuevo post',
    body: 'Contenido del post',
    userId: 1,
  };

  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoPost),
  });

  const data = await response.json();
  console.log('Post creado:', data);
}
\`\`\`

### Opciones de fetch

\`\`\`javascript
fetch(url, {
  method: 'POST',              // Metodo HTTP
  headers: {                   // Cabeceras
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
  },
  body: JSON.stringify(datos), // Cuerpo de la peticion
});
\`\`\`

### Peticion PUT (actualizar)

\`\`\`javascript
async function actualizarPost(id) {
  const response = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${id}\`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        title: 'Titulo actualizado',
        body: 'Contenido actualizado',
        userId: 1,
      }),
    }
  );
  return await response.json();
}
\`\`\`

### Peticion DELETE

\`\`\`javascript
async function eliminarPost(id) {
  const response = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${id}\`,
    { method: 'DELETE' }
  );

  if (response.ok) {
    console.log('Post eliminado correctamente');
  }
}
\`\`\`

> **Importante:** \`body\` debe ser un string. Usa \`JSON.stringify()\` para convertir objetos a JSON.`,
      order: 3,
    },
    {
      id: "js-18-leccion-04",
      title: "Manejo de errores en Fetch",
      content: `## Manejo de errores en Fetch

### fetch() NO lanza error en 404 o 500

Un error muy comun: **fetch solo rechaza la promesa si hay un error de red** (sin conexion, DNS falla, etc.). Un status 404 o 500 NO causa un error automaticamente.

\`\`\`javascript
// CUIDADO: esto NO captura errores 404
fetch('https://jsonplaceholder.typicode.com/posts/99999')
  .then(response => response.json()) // Se ejecuta aunque sea 404!
  .then(data => console.log(data))
  .catch(error => console.log('Error de red:', error));
\`\`\`

### Verificar response.ok

\`\`\`javascript
async function obtenerPost(id) {
  const response = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${id}\`
  );

  if (!response.ok) {
    throw new Error(\`Error HTTP: \${response.status}\`);
  }

  return await response.json();
}
\`\`\`

### Patron completo con try/catch

\`\`\`javascript
async function fetchSeguro(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error en fetch:', error.message);
    return { data: null, error: error.message };
  }
}

// Uso
const { data, error } = await fetchSeguro(
  'https://jsonplaceholder.typicode.com/users'
);

if (error) {
  document.getElementById('app').textContent = 'Error al cargar datos';
} else {
  console.log('Usuarios:', data);
}
\`\`\`

### Estados de carga

\`\`\`javascript
async function cargarUsuarios() {
  const app = document.getElementById('app');
  app.textContent = 'Cargando...';

  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    );
    if (!response.ok) throw new Error('Error al cargar');

    const usuarios = await response.json();
    app.innerHTML = usuarios
      .map(u => \`<p>\${u.name} - \${u.email}</p>\`)
      .join('');
  } catch (error) {
    app.innerHTML = \`<p style="color:red">Error: \${error.message}</p>\`;
  }
}
\`\`\`

### Timeout con AbortController

\`\`\`javascript
async function fetchConTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La peticion tardo demasiado');
    }
    throw error;
  }
}
\`\`\`

> **Buena practica:** Siempre verifica \`response.ok\` y envuelve tus fetch en \`try/catch\` para manejar errores de red.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-18-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que devuelve fetch() al ser llamado?",
      options: [
        { id: "a", text: "Los datos JSON directamente", isCorrect: false },
        { id: "b", text: "Una Promesa que resuelve a un objeto Response", isCorrect: true },
        { id: "c", text: "Un string con el HTML de la pagina", isCorrect: false },
        { id: "d", text: "Un objeto XMLHttpRequest", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "fetch() es una funcion asincrona moderna basada en Promesas.",
      explanation: "fetch() devuelve una Promesa que se resuelve a un objeto Response. Para obtener los datos JSON, necesitas llamar a response.json().",
    },
    {
      id: "js-18-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa el codigo para obtener datos de una API y convertir la respuesta a JSON:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: "",
        blanks: ["fetch", "response.json()"],
      },
      validation: { type: "includes", answer: ["fetch", "response.json()"] },
      hint: "Usa fetch() para hacer la peticion y .json() para parsear la respuesta.",
      explanation: "fetch(url) inicia la peticion y response.json() convierte el body de la respuesta a un objeto JavaScript.",
    },
    {
      id: "js-18-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Que sucede cuando fetch recibe un status 404?",
      options: [
        { id: "a", text: "Lanza un error automaticamente", isCorrect: false },
        { id: "b", text: "La promesa se rechaza con un error", isCorrect: false },
        { id: "c", text: "La promesa se resuelve pero response.ok es false", isCorrect: true },
        { id: "d", text: "Devuelve null", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "fetch() solo rechaza la promesa ante errores de red, no errores HTTP.",
      explanation: "fetch() solo lanza un error si hay un problema de red. Un 404 o 500 resulta en una Response con ok: false y el status correspondiente.",
    },
    {
      id: "js-18-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Completa la funcion async/await para obtener un usuario de la API:",
      codeTemplate: {
        html: "",
        cssPrefix: "async function obtenerUsuario(id) {\n  const response = ",
        cssSuffix: "\n  const usuario = await response.json();\n  return usuario;\n}",
        blanks: ["await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)"],
      },
      validation: { type: "includes", answer: ["await", "fetch"] },
      hint: "Usa await antes de fetch() dentro de una funcion async.",
      explanation: "Dentro de una funcion async, usamos await fetch(url) para esperar la respuesta antes de continuar.",
    },
    {
      id: "js-18-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Cual es la forma correcta de enviar datos JSON en una peticion POST con fetch?",
      options: [
        { id: "a", text: "fetch(url, { method: 'POST', body: datos })", isCorrect: false },
        { id: "b", text: "fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })", isCorrect: true },
        { id: "c", text: "fetch(url, { type: 'POST', data: datos })", isCorrect: false },
        { id: "d", text: "fetch.post(url, datos)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Necesitas especificar el metodo, el Content-Type y convertir los datos a string.",
      explanation: "Para POST con JSON necesitas: method: 'POST', el header Content-Type: 'application/json', y body: JSON.stringify(datos) para serializar el objeto.",
    },
    {
      id: "js-18-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Completa el manejo de errores para verificar que la respuesta fue exitosa:",
      codeTemplate: {
        html: "",
        cssPrefix: "async function fetchSeguro(url) {\n  try {\n    const response = await fetch(url);\n    ",
        cssSuffix: "\n    return await response.json();\n  } catch (error) {\n    console.error('Error:', error.message);\n  }\n}",
        blanks: ["if (!response.ok) { throw new Error(`HTTP ${response.status}`); }"],
      },
      validation: { type: "includes", answer: ["response.ok", "throw"] },
      hint: "Verifica response.ok y lanza un error si es false.",
      explanation: "Debemos verificar response.ok y lanzar un error manualmente para que nuestro catch lo atrape, ya que fetch no lanza error en 404/500.",
    },
    {
      id: "js-18-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt: "Cual es la ventaja de usar Promise.all con multiples fetch?",
      options: [
        { id: "a", text: "Hace las peticiones una tras otra en orden", isCorrect: false },
        { id: "b", text: "Ejecuta todas las peticiones en paralelo, es mas rapido", isCorrect: true },
        { id: "c", text: "Reintenta automaticamente si una falla", isCorrect: false },
        { id: "d", text: "Cachea las respuestas automaticamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Promise.all ejecuta multiples promesas al mismo tiempo.",
      explanation: "Promise.all ejecuta todas las peticiones simultaneamente en lugar de esperar a que termine una para iniciar la siguiente, reduciendo el tiempo total.",
    },
    {
      id: "js-18-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt: "Completa la peticion POST para crear un nuevo post en la API:",
      codeTemplate: {
        html: "",
        cssPrefix: "async function crearPost(titulo, contenido) {\n  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {\n    ",
        cssSuffix: "\n  });\n  return await response.json();\n}",
        blanks: ["method: 'POST'", "headers: { 'Content-Type': 'application/json' }", "body: JSON.stringify({ title: titulo, body: contenido, userId: 1 })"],
      },
      validation: { type: "includes", answer: ["method", "POST", "headers", "Content-Type", "body", "JSON.stringify"] },
      hint: "Necesitas method, headers con Content-Type, y body con JSON.stringify.",
      explanation: "Una peticion POST necesita: method: 'POST' para indicar el tipo, headers con Content-Type para decir que enviamos JSON, y body con los datos serializados.",
    },
  ],
};
