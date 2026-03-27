import type { ModuleData } from "@/types";

export const jsPatronesModule: ModuleData = {
  slug: "js-patrones",
  title: "Patrones de JavaScript",
  description:
    "Domina patrones avanzados de JavaScript: closures, funciones de orden superior, IIFE, patron modulo, debounce/throttle, memoizacion, callbacks y funciones puras.",
  order: 122,
  category: "js-advanced",
  icon: "puzzle",
  dojo: "js",
  lessons: [
    {
      id: "js-22-leccion-01",
      title: "Closures y scope lexico",
      content: `## Closures y scope lexico

### Que es un Closure?

Un **closure** es una funcion que "recuerda" las variables del scope donde fue creada, incluso despues de que ese scope haya terminado.

\`\`\`javascript
function crearSaludo(saludo) {
  // La funcion interna "recuerda" la variable saludo
  return function(nombre) {
    return \`\${saludo}, \${nombre}!\`;
  };
}

const saludoFormal = crearSaludo('Buenos dias');
const saludoInformal = crearSaludo('Hola');

saludoFormal('Doctor Garcia');  // "Buenos dias, Doctor Garcia!"
saludoInformal('Ana');          // "Hola, Ana!"
\`\`\`

### Closure como estado privado

\`\`\`javascript
function crearContador() {
  let cuenta = 0; // Variable "privada"

  return {
    incrementar() { cuenta++; },
    decrementar() { cuenta--; },
    obtenerValor() { return cuenta; }
  };
}

const contador = crearContador();
contador.incrementar();
contador.incrementar();
contador.incrementar();
console.log(contador.obtenerValor()); // 3

// No hay forma de acceder directamente a 'cuenta'
// console.log(cuenta); // ReferenceError
\`\`\`

### Closures en bucles

\`\`\`javascript
// Problema clasico con var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Imprime: 3, 3, 3 (no 0, 1, 2!)

// Solucion 1: usar let (crea nuevo scope por iteracion)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Imprime: 0, 1, 2

// Solucion 2: closure con IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Imprime: 0, 1, 2
\`\`\`

### Uso practico: fabricas de funciones

\`\`\`javascript
function crearMultiplicador(factor) {
  return function(numero) {
    return numero * factor;
  };
}

const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);

doble(5);   // 10
triple(5);  // 15

// Util en map
[1, 2, 3, 4].map(doble);  // [2, 4, 6, 8]
\`\`\`

> **Concepto clave:** Un closure no copia las variables, mantiene una *referencia* al scope original. Si la variable cambia, el closure ve el cambio.`,
      order: 1,
    },
    {
      id: "js-22-leccion-02",
      title: "Funciones de orden superior y IIFE",
      content: `## Funciones de orden superior y IIFE

### Funciones de orden superior

Una **funcion de orden superior** es una funcion que recibe otra funcion como argumento o devuelve una funcion.

\`\`\`javascript
// Recibe una funcion como argumento
function aplicarOperacion(numeros, operacion) {
  return numeros.map(operacion);
}

const dobles = aplicarOperacion([1, 2, 3], n => n * 2);    // [2, 4, 6]
const cuadrados = aplicarOperacion([1, 2, 3], n => n ** 2); // [1, 4, 9]
\`\`\`

### Crear funciones que retornan funciones

\`\`\`javascript
function crearFiltro(campo, valor) {
  return function(item) {
    return item[campo] === valor;
  };
}

const productos = [
  { nombre: 'Laptop', categoria: 'tech', precio: 999 },
  { nombre: 'Camisa', categoria: 'ropa', precio: 29 },
  { nombre: 'Mouse', categoria: 'tech', precio: 25 },
];

const esTech = crearFiltro('categoria', 'tech');
const productosTech = productos.filter(esTech);
// [{ nombre: 'Laptop'... }, { nombre: 'Mouse'... }]
\`\`\`

### Composicion de funciones

\`\`\`javascript
function componer(...funciones) {
  return function(valor) {
    return funciones.reduceRight(
      (resultado, fn) => fn(resultado),
      valor
    );
  };
}

const minusculas = str => str.toLowerCase();
const sinEspacios = str => str.trim();
const sinTildes = str => str.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');

const limpiarTexto = componer(sinEspacios, minusculas, sinTildes);
limpiarTexto('  Hola Mundo  '); // "hola mundo"
\`\`\`

### IIFE (Immediately Invoked Function Expression)

Una funcion que se ejecuta inmediatamente al ser definida.

\`\`\`javascript
// Sintaxis clasica
(function() {
  const secreto = 'no soy accesible afuera';
  console.log('Ejecutada inmediatamente!');
})();

// Con arrow function
(() => {
  console.log('IIFE con arrow!');
})();

// Con parametros
(function(nombre) {
  console.log(\`Hola \${nombre}\`);
})('Ana');
\`\`\`

### Usos de IIFE

\`\`\`javascript
// 1. Evitar contaminar el scope global
const app = (function() {
  const config = { debug: false };
  const version = '1.0.0';

  function init() {
    console.log(\`App v\${version} iniciada\`);
  }

  return { init, version };
})();

app.init();
// config no es accesible desde afuera

// 2. Ejecutar codigo async al nivel superior
(async () => {
  const datos = await fetch('/api/datos');
  const json = await datos.json();
  console.log(json);
})();
\`\`\`

> **Nota:** Con ES6 modules, las IIFE son menos necesarias ya que cada modulo tiene su propio scope. Pero siguen siendo utiles en ciertos contextos.`,
      order: 2,
    },
    {
      id: "js-22-leccion-03",
      title: "Debounce, Throttle y Memoizacion",
      content: `## Debounce, Throttle y Memoizacion

### Debounce

Ejecuta una funcion solo despues de que el usuario **deje de hacer** algo durante un tiempo determinado.

\`\`\`javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Ejemplo: busqueda mientras el usuario escribe
const buscar = debounce(function(texto) {
  console.log('Buscando:', texto);
  // fetch(\`/api/buscar?q=\${texto}\`)
}, 300);

// Si el usuario escribe rapido, solo se ejecuta
// 300ms despues de la ultima tecla
input.addEventListener('input', (e) => buscar(e.target.value));
\`\`\`

### Throttle

Ejecuta una funcion **como maximo** una vez cada X milisegundos, sin importar cuantas veces se invoque.

\`\`\`javascript
function throttle(fn, limit) {
  let enEspera = false;
  return function(...args) {
    if (!enEspera) {
      fn.apply(this, args);
      enEspera = true;
      setTimeout(() => { enEspera = false; }, limit);
    }
  };
}

// Ejemplo: manejar scroll sin sobrecargar
const manejarScroll = throttle(function() {
  console.log('Scroll position:', window.scrollY);
}, 200);

// Se ejecuta maximo cada 200ms, aunque el scroll sea continuo
window.addEventListener('scroll', manejarScroll);
\`\`\`

### Cuando usar cada uno?

| Patron | Uso ideal | Ejemplo |
|--------|-----------|---------|
| Debounce | Esperar que el usuario termine | Busqueda en input, resize |
| Throttle | Limitar frecuencia de ejecucion | Scroll, mousemove, juegos |

### Memoizacion

Cachear resultados de funciones costosas para evitar recalcular con los mismos argumentos.

\`\`\`javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const clave = JSON.stringify(args);
    if (cache.has(clave)) {
      console.log('Desde cache');
      return cache.get(clave);
    }
    const resultado = fn.apply(this, args);
    cache.set(clave, resultado);
    return resultado;
  };
}

// Ejemplo: funcion costosa memoizada
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(40); // Calcula (tarda un poco la primera vez)
fibonacci(40); // Instantaneo (desde cache)
\`\`\`

### Memoizacion con limite de cache

\`\`\`javascript
function memoizeConLimite(fn, maxEntradas = 100) {
  const cache = new Map();
  return function(...args) {
    const clave = JSON.stringify(args);
    if (cache.has(clave)) {
      return cache.get(clave);
    }
    const resultado = fn.apply(this, args);
    cache.set(clave, resultado);

    // Eliminar entrada mas antigua si excede el limite
    if (cache.size > maxEntradas) {
      const primeraKey = cache.keys().next().value;
      cache.delete(primeraKey);
    }

    return resultado;
  };
}
\`\`\`

> **Consejo:** Solo memoiza funciones **puras** (mismo input = mismo output). No memoices funciones que dependen de estado externo.`,
      order: 3,
    },
    {
      id: "js-22-leccion-04",
      title: "Patron Modulo y funciones puras",
      content: `## Patron Modulo y funciones puras

### Patron Modulo

El **patron modulo** usa closures para crear modulos con estado privado y una interfaz publica.

\`\`\`javascript
const CarritoModule = (function() {
  // Estado privado
  let items = [];

  // Funciones privadas
  function calcularTotal() {
    return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  // Interfaz publica
  return {
    agregar(producto, cantidad = 1) {
      const existente = items.find(i => i.id === producto.id);
      if (existente) {
        existente.cantidad += cantidad;
      } else {
        items.push({ ...producto, cantidad });
      }
    },

    eliminar(id) {
      items = items.filter(i => i.id !== id);
    },

    obtenerTotal() {
      return calcularTotal();
    },

    obtenerItems() {
      return [...items]; // Copia para no exponer el array interno
    },

    vaciar() {
      items = [];
    }
  };
})();

CarritoModule.agregar({ id: 1, nombre: 'Laptop', precio: 999 });
CarritoModule.agregar({ id: 2, nombre: 'Mouse', precio: 25 }, 2);
console.log(CarritoModule.obtenerTotal()); // 1049
// items no es accesible directamente
\`\`\`

### Patron Modulo revelador

Variante donde defines todo como privado y revelas solo lo necesario.

\`\`\`javascript
const Validador = (function() {
  function esEmail(valor) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(valor);
  }

  function esNumero(valor) {
    return !isNaN(valor) && valor.toString().trim() !== '';
  }

  function tieneMinimo(valor, min) {
    return valor.length >= min;
  }

  function validarFormulario(datos) {
    const errores = [];
    if (!esEmail(datos.email)) errores.push('Email invalido');
    if (!tieneMinimo(datos.password, 8)) errores.push('Password muy corto');
    if (!tieneMinimo(datos.nombre, 2)) errores.push('Nombre muy corto');
    return { valido: errores.length === 0, errores };
  }

  // Solo revelamos lo necesario
  return { validarFormulario, esEmail, esNumero };
})();
\`\`\`

### Funciones puras

Una **funcion pura** cumple dos reglas:
1. Dado el mismo input, siempre devuelve el mismo output
2. No tiene **efectos secundarios** (no modifica nada externo)

\`\`\`javascript
// PURA: mismo input = mismo output, sin efectos secundarios
function sumar(a, b) {
  return a + b;
}

function formatearNombre(nombre) {
  return nombre.trim().toLowerCase();
}

function filtrarActivos(usuarios) {
  return usuarios.filter(u => u.activo);
}

// IMPURA: modifica estado externo
let total = 0;
function agregarAlTotal(monto) {
  total += monto; // Efecto secundario!
  return total;
}

// IMPURA: resultado no predecible
function obtenerFecha() {
  return new Date(); // Diferente cada vez
}

// IMPURA: modifica el argumento
function agregarPropiedad(objeto) {
  objeto.modificado = true; // Muta el argumento!
  return objeto;
}
\`\`\`

### Ventajas de las funciones puras

\`\`\`javascript
// 1. Faciles de testear
const resultado = sumar(2, 3);
console.assert(resultado === 5, 'sumar debe devolver 5');

// 2. Predecibles y reutilizables
// 3. Se pueden memoizar
// 4. Se pueden ejecutar en paralelo

// Patron: transformar datos sin mutar
function actualizarUsuario(usuario, cambios) {
  return { ...usuario, ...cambios, modificadoEn: new Date() };
}

const original = { nombre: 'Ana', edad: 25 };
const actualizado = actualizarUsuario(original, { edad: 26 });
// original no cambio, actualizado es un nuevo objeto
\`\`\`

### Patron Callback

\`\`\`javascript
// Las funciones como callbacks son un patron fundamental
function procesarDatos(datos, onExito, onError) {
  try {
    const resultado = datos.map(d => d.valor * 2);
    onExito(resultado);
  } catch (error) {
    onError(error);
  }
}

procesarDatos(
  [{ valor: 1 }, { valor: 2 }],
  resultado => console.log('Exito:', resultado),
  error => console.error('Error:', error)
);
\`\`\`

> **Resumen:** Prefiere funciones puras siempre que sea posible. Aisla los efectos secundarios (DOM, fetch, storage) en funciones especificas y separadas.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-22-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que es un closure en JavaScript?",
      options: [
        { id: "a", text: "Una forma de cerrar el navegador con JavaScript", isCorrect: false },
        { id: "b", text: "Una funcion que recuerda las variables del scope donde fue creada", isCorrect: true },
        { id: "c", text: "Un metodo para encriptar variables", isCorrect: false },
        { id: "d", text: "Un tipo especial de objeto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en una funcion que mantiene acceso a su entorno original.",
      explanation: "Un closure es una funcion que mantiene una referencia a las variables de su scope lexico, incluso despues de que la funcion externa haya terminado de ejecutarse.",
    },
    {
      id: "js-22-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la funcion que usa un closure para crear un contador:",
      codeTemplate: {
        html: "",
        cssPrefix: "function crearContador() {\n  let cuenta = 0;\n  return {\n    incrementar() { ",
        cssSuffix: " },\n    obtenerValor() { return cuenta; }\n  };\n}\n\nconst c = crearContador();\nc.incrementar();\nconsole.log(c.obtenerValor()); // 1",
        blanks: ["cuenta++"],
      },
      validation: { type: "includes", answer: ["cuenta++"] },
      hint: "La funcion interna puede modificar la variable del scope externo.",
      explanation: "El closure permite que incrementar() acceda y modifique la variable 'cuenta' que vive en el scope de crearContador, actuando como estado privado.",
    },
    {
      id: "js-22-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Cual es la diferencia entre debounce y throttle?",
      options: [
        { id: "a", text: "Debounce es mas rapido que throttle", isCorrect: false },
        { id: "b", text: "Debounce espera a que se deje de invocar; throttle limita la frecuencia de ejecucion", isCorrect: true },
        { id: "c", text: "Throttle cancela la funcion; debounce la retrasa", isCorrect: false },
        { id: "d", text: "No hay diferencia, son sinonimos", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en busqueda vs scroll.",
      explanation: "Debounce espera X ms despues de la ultima invocacion para ejecutar (ideal para busqueda). Throttle ejecuta como maximo una vez cada X ms (ideal para scroll).",
    },
    {
      id: "js-22-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Completa la funcion de orden superior que crea un multiplicador:",
      codeTemplate: {
        html: "",
        cssPrefix: "function crearMultiplicador(factor) {\n  ",
        cssSuffix: "\n}\n\nconst doble = crearMultiplicador(2);\nconst triple = crearMultiplicador(3);\nconsole.log(doble(5));  // 10\nconsole.log(triple(5)); // 15",
        blanks: ["return function(numero) { return numero * factor; };"],
      },
      validation: { type: "includes", answer: ["return", "function", "factor"] },
      hint: "Devuelve una funcion que usa el parametro 'factor' del scope externo.",
      explanation: "crearMultiplicador retorna una funcion que forma un closure sobre 'factor'. Cada vez que se llama a doble o triple, la funcion interna recuerda el factor original.",
    },
    {
      id: "js-22-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Cual de estas funciones es PURA?",
      options: [
        { id: "a", text: "function f() { return Math.random(); }", isCorrect: false },
        { id: "b", text: "function f(arr) { arr.push(1); return arr; }", isCorrect: false },
        { id: "c", text: "function f(a, b) { return a + b; }", isCorrect: true },
        { id: "d", text: "function f() { return new Date(); }", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Una funcion pura siempre devuelve lo mismo con los mismos argumentos y no tiene efectos secundarios.",
      explanation: "f(a, b) { return a + b } es pura: mismo input = mismo output, sin efectos secundarios. Las otras dependen de estado externo (random, Date) o mutan argumentos (push).",
    },
    {
      id: "js-22-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Completa la IIFE que crea un modulo con estado privado:",
      codeTemplate: {
        html: "",
        cssPrefix: "const MiModulo = ",
        cssSuffix: "() {\n  let datos = [];\n\n  return {\n    agregar(item) { datos.push(item); },\n    obtener() { return [...datos]; }\n  };\n})();",
        blanks: ["(function"],
      },
      validation: { type: "includes", answer: ["(function"] },
      hint: "Una IIFE se escribe como (function() { ... })() con parentesis extra.",
      explanation: "La IIFE (function() { ... })() se ejecuta inmediatamente y crea un scope privado. La variable 'datos' no es accesible desde fuera, solo a traves de los metodos expuestos.",
    },
    {
      id: "js-22-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt: "Que imprime este codigo? `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }`",
      options: [
        { id: "a", text: "0, 1, 2", isCorrect: false },
        { id: "b", text: "3, 3, 3", isCorrect: true },
        { id: "c", text: "undefined, undefined, undefined", isCorrect: false },
        { id: "d", text: "0, 0, 0", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "var no crea un scope por iteracion del bucle.",
      explanation: "Con var, hay una sola variable 'i' compartida. Cuando los setTimeout se ejecutan, el bucle ya termino y i vale 3. Con let se imprimiria 0, 1, 2.",
    },
    {
      id: "js-22-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt: "Completa la funcion de memoizacion basica:",
      codeTemplate: {
        html: "",
        cssPrefix: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const clave = JSON.stringify(args);\n    ",
        cssSuffix: "\n    const resultado = fn.apply(this, args);\n    cache.set(clave, resultado);\n    return resultado;\n  };\n}",
        blanks: ["if (cache.has(clave)) { return cache.get(clave); }"],
      },
      validation: { type: "includes", answer: ["cache.has", "cache.get"] },
      hint: "Primero verifica si el resultado ya esta en cache antes de calcularlo.",
      explanation: "La memoizacion verifica si ya tenemos el resultado en cache (cache.has). Si existe, lo devuelve directamente (cache.get) sin ejecutar la funcion de nuevo.",
    },
  ],
};
