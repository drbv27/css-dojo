import type { ModuleData } from "@/types";

export const jsErroresModule: ModuleData = {
  slug: "js-errores",
  title: "Manejo de Errores y Debugging",
  description:
    "Domina el manejo de errores con try/catch/finally, crea clases de error personalizadas, conoce los tipos de error y aprende tecnicas de debugging con DevTools y la consola.",
  order: 121,
  category: "js-advanced",
  icon: "alert-triangle",
  dojo: "js",
  lessons: [
    {
      id: "js-21-leccion-01",
      title: "Try, Catch y Finally",
      content: `## Try, Catch y Finally

### El problema de los errores

Cuando JavaScript encuentra un error, **detiene la ejecucion** de todo el programa. Eso es un problema en aplicaciones reales.

\`\`\`javascript
// Sin manejo de errores: el programa se detiene
const datos = JSON.parse('esto no es JSON'); // Error!
console.log('Esto nunca se ejecuta');
\`\`\`

### try/catch al rescate

\`\`\`javascript
try {
  // Codigo que podria fallar
  const datos = JSON.parse('esto no es JSON');
  console.log(datos);
} catch (error) {
  // Se ejecuta si hay un error
  console.log('Ocurrio un error:', error.message);
}

// El programa continua normalmente
console.log('El programa sigue funcionando!');
\`\`\`

### El objeto Error

\`\`\`javascript
try {
  null.propiedad;
} catch (error) {
  console.log(error.name);    // "TypeError"
  console.log(error.message); // "Cannot read properties of null"
  console.log(error.stack);   // Traza completa del error
}
\`\`\`

### finally: siempre se ejecuta

\`\`\`javascript
function leerArchivo() {
  let conexion = null;
  try {
    conexion = abrirConexion();
    const datos = conexion.leer();
    return datos;
  } catch (error) {
    console.error('Error al leer:', error.message);
    return null;
  } finally {
    // SIEMPRE se ejecuta, haya o no error
    if (conexion) {
      conexion.cerrar();
    }
    console.log('Limpieza completada');
  }
}
\`\`\`

### throw: lanzar errores propios

\`\`\`javascript
function dividir(a, b) {
  if (b === 0) {
    throw new Error('No se puede dividir por cero');
  }
  return a / b;
}

try {
  const resultado = dividir(10, 0);
} catch (error) {
  console.log(error.message); // "No se puede dividir por cero"
}
\`\`\`

### Validacion con throw

\`\`\`javascript
function crearUsuario(nombre, edad) {
  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre es obligatorio');
  }
  if (typeof edad !== 'number' || edad < 0) {
    throw new Error('La edad debe ser un numero positivo');
  }
  if (edad < 18) {
    throw new Error('Debe ser mayor de edad');
  }
  return { nombre, edad, creadoEn: new Date() };
}

try {
  const usuario = crearUsuario('', 15);
} catch (error) {
  console.log(error.message); // "El nombre es obligatorio"
}
\`\`\`

> **Regla:** Usa try/catch solo donde realmente puedas manejar el error. No envuelvas TODO tu codigo en un try/catch gigante.`,
      order: 1,
    },
    {
      id: "js-21-leccion-02",
      title: "Tipos de Error y errores personalizados",
      content: `## Tipos de Error y errores personalizados

### Tipos de Error nativos

JavaScript tiene varios tipos de error incorporados:

\`\`\`javascript
// TypeError: operacion en tipo incorrecto
try {
  null.toString();
} catch (e) {
  console.log(e.name); // "TypeError"
}

// ReferenceError: variable no definida
try {
  console.log(variableInexistente);
} catch (e) {
  console.log(e.name); // "ReferenceError"
}

// SyntaxError: codigo mal formado (en eval/JSON.parse)
try {
  JSON.parse('{invalido}');
} catch (e) {
  console.log(e.name); // "SyntaxError"
}

// RangeError: valor fuera de rango
try {
  const arr = new Array(-1);
} catch (e) {
  console.log(e.name); // "RangeError"
}
\`\`\`

### Diferenciar tipos de error

\`\`\`javascript
try {
  // Codigo que puede lanzar diferentes errores
  const datos = JSON.parse(input);
  procesarDatos(datos);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log('JSON mal formado:', error.message);
  } else if (error instanceof TypeError) {
    console.log('Datos con formato incorrecto:', error.message);
  } else if (error instanceof ReferenceError) {
    console.log('Variable no encontrada:', error.message);
  } else {
    console.log('Error desconocido:', error.message);
    throw error; // Re-lanzar si no sabemos manejarlo
  }
}
\`\`\`

### Crear errores personalizados

\`\`\`javascript
class ValidacionError extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.campo = campo;
  }
}

class NoEncontradoError extends Error {
  constructor(recurso, id) {
    super(\`\${recurso} con id \${id} no encontrado\`);
    this.name = 'NoEncontradoError';
    this.recurso = recurso;
    this.id = id;
  }
}

class AuthError extends Error {
  constructor(mensaje = 'No autorizado') {
    super(mensaje);
    this.name = 'AuthError';
    this.status = 401;
  }
}
\`\`\`

### Usar errores personalizados

\`\`\`javascript
function registrarUsuario(datos) {
  if (!datos.email) {
    throw new ValidacionError('email', 'El email es obligatorio');
  }
  if (!datos.email.includes('@')) {
    throw new ValidacionError('email', 'Email invalido');
  }
  if (datos.password.length < 8) {
    throw new ValidacionError('password', 'Minimo 8 caracteres');
  }
  return { ...datos, id: Date.now() };
}

try {
  registrarUsuario({ email: 'malo', password: '123' });
} catch (error) {
  if (error instanceof ValidacionError) {
    console.log(\`Error en campo "\${error.campo}": \${error.message}\`);
    // "Error en campo "email": Email invalido"
  }
}
\`\`\`

> **Buena practica:** Crea errores personalizados para tu aplicacion. Facilita identificar y manejar problemas especificos.`,
      order: 2,
    },
    {
      id: "js-21-leccion-03",
      title: "Debugging y metodos de consola",
      content: `## Debugging y metodos de consola

### Mas alla de console.log

La consola de JavaScript tiene muchos metodos utiles para depurar:

\`\`\`javascript
// console.log - El clasico
console.log('Mensaje normal');

// console.error - Errores (aparece en rojo)
console.error('Algo salio mal!');

// console.warn - Advertencias (aparece en amarillo)
console.warn('Cuidado con este valor');

// console.info - Informacion
console.info('Servidor iniciado en puerto 3000');
\`\`\`

### console.table: visualizar datos

\`\`\`javascript
const usuarios = [
  { nombre: 'Ana', edad: 25, ciudad: 'Madrid' },
  { nombre: 'Luis', edad: 30, ciudad: 'CDMX' },
  { nombre: 'Maria', edad: 28, ciudad: 'Buenos Aires' },
];

// Muestra los datos en una tabla bonita!
console.table(usuarios);
console.table(usuarios, ['nombre', 'ciudad']); // Solo columnas especificas
\`\`\`

### console.group: organizar mensajes

\`\`\`javascript
console.group('Datos del usuario');
console.log('Nombre: Ana');
console.log('Email: ana@mail.com');

  console.group('Permisos');
  console.log('Lectura: si');
  console.log('Escritura: no');
  console.groupEnd();

console.groupEnd();
\`\`\`

### console.time: medir rendimiento

\`\`\`javascript
console.time('busqueda');

const resultado = datos.filter(item => item.activo);

console.timeEnd('busqueda');
// "busqueda: 2.45ms"
\`\`\`

### console.count: contar ejecuciones

\`\`\`javascript
function procesarItem(item) {
  console.count('procesarItem llamado');
  // ... logica
}

procesarItem('a'); // "procesarItem llamado: 1"
procesarItem('b'); // "procesarItem llamado: 2"
procesarItem('c'); // "procesarItem llamado: 3"
\`\`\`

### console.assert: validar condiciones

\`\`\`javascript
const edad = 15;
console.assert(edad >= 18, 'El usuario debe ser mayor de edad');
// Solo imprime si la condicion es FALSE

const lista = [1, 2, 3];
console.assert(lista.length > 0, 'La lista no deberia estar vacia');
// No imprime nada (condicion es true)
\`\`\`

### Debugging con DevTools

### Breakpoints
1. Abre DevTools (F12)
2. Ve a la pestana **Sources**
3. Haz clic en el numero de linea para agregar un **breakpoint**
4. El codigo se detendrá ahi y podras inspeccionar variables

### debugger statement

\`\`\`javascript
function calcularTotal(items) {
  let total = 0;
  for (const item of items) {
    debugger; // El navegador se detendrá aqui si DevTools esta abierto
    total += item.precio * item.cantidad;
  }
  return total;
}
\`\`\`

### Tecnicas de debugging

\`\`\`javascript
// 1. Verificar tipos
console.log(typeof variable, variable);

// 2. Verificar estructura de objetos
console.dir(objetoComplejo);

// 3. Copiar al portapapeles en DevTools
// copy(JSON.stringify(datos, null, 2));

// 4. Traza de llamadas
console.trace('Como llegamos aqui?');
\`\`\`

> **Consejo:** No dejes console.log en codigo de produccion. Usa una funcion logger que puedas activar/desactivar.`,
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js-21-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que bloque se ejecuta SIEMPRE, haya o no un error?",
      options: [
        { id: "a", text: "try", isCorrect: false },
        { id: "b", text: "catch", isCorrect: false },
        { id: "c", text: "finally", isCorrect: true },
        { id: "d", text: "throw", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es el bloque que se ejecuta independientemente del resultado.",
      explanation: "El bloque finally siempre se ejecuta, ya sea que el try haya tenido exito o que se haya capturado un error en catch. Es ideal para tareas de limpieza.",
    },
    {
      id: "js-21-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa el try/catch para manejar un error de JSON.parse:",
      codeTemplate: {
        html: "",
        cssPrefix: "",
        cssSuffix: " {\n  const datos = JSON.parse('{invalido}');\n  console.log(datos);\n} catch (error) {\n  console.log('Error:', error.message);\n}",
        blanks: ["try"],
      },
      validation: { type: "includes", answer: ["try"] },
      hint: "El bloque que contiene el codigo que podria fallar.",
      explanation: "El bloque try envuelve el codigo que podria lanzar un error. Si ocurre un error dentro del try, la ejecucion salta al catch.",
    },
    {
      id: "js-21-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Que tipo de error se produce al intentar acceder a una variable que no existe?",
      options: [
        { id: "a", text: "TypeError", isCorrect: false },
        { id: "b", text: "SyntaxError", isCorrect: false },
        { id: "c", text: "ReferenceError", isCorrect: true },
        { id: "d", text: "RangeError", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El error tiene que ver con una referencia que no se puede encontrar.",
      explanation: "ReferenceError ocurre cuando intentas usar una variable que no ha sido declarada. TypeError es para operaciones invalidas sobre un tipo.",
    },
    {
      id: "js-21-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Completa la funcion para que lance un error si la edad es negativa:",
      codeTemplate: {
        html: "",
        cssPrefix: "function validarEdad(edad) {\n  if (edad < 0) {\n    ",
        cssSuffix: "\n  }\n  return true;\n}",
        blanks: ["throw new Error('La edad no puede ser negativa');"],
      },
      validation: { type: "includes", answer: ["throw", "new Error"] },
      hint: "Usa throw con new Error() para lanzar un error personalizado.",
      explanation: "throw new Error('mensaje') crea y lanza un nuevo error que puede ser capturado por un try/catch en el codigo que llama a esta funcion.",
    },
    {
      id: "js-21-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Cual es la diferencia entre console.log y console.error?",
      options: [
        { id: "a", text: "No hay diferencia, son identicos", isCorrect: false },
        { id: "b", text: "console.error detiene la ejecucion del programa", isCorrect: false },
        { id: "c", text: "console.error muestra el mensaje en rojo y con traza de error", isCorrect: true },
        { id: "d", text: "console.error solo funciona en produccion", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "console.error tiene un estilo visual diferente en DevTools.",
      explanation: "console.error muestra el mensaje con estilo de error (rojo) en la consola e incluye una traza del stack. No detiene la ejecucion del programa.",
    },
    {
      id: "js-21-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Completa la clase de error personalizada que extiende Error:",
      codeTemplate: {
        html: "",
        cssPrefix: "class ValidacionError ",
        cssSuffix: " {\n  constructor(campo, mensaje) {\n    super(mensaje);\n    this.name = 'ValidacionError';\n    this.campo = campo;\n  }\n}",
        blanks: ["extends Error"],
      },
      validation: { type: "includes", answer: ["extends Error"] },
      hint: "Los errores personalizados heredan de la clase Error nativa.",
      explanation: "Al extender Error con 'extends Error', nuestra clase personalizada hereda todas las propiedades de Error (message, stack) y podemos agregar propiedades propias.",
    },
    {
      id: "js-21-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt: "Que metodo de consola muestra datos en formato de tabla?",
      options: [
        { id: "a", text: "console.log()", isCorrect: false },
        { id: "b", text: "console.table()", isCorrect: true },
        { id: "c", text: "console.dir()", isCorrect: false },
        { id: "d", text: "console.grid()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El nombre del metodo describe literalmente el formato de salida.",
      explanation: "console.table() muestra arrays y objetos en formato de tabla visual en la consola, lo que facilita mucho la lectura de datos estructurados.",
    },
  ],
};
