import type { ModuleData } from "@/types";

export const jsFuncionesModule: ModuleData = {
  slug: "js-funciones",
  title: "Funciones",
  description:
    "Domina las funciones en JavaScript: declaraciones, expresiones, arrow functions, parámetros avanzados, scope y closures.",
  order: 107,
  category: "js-fundamentals",
  icon: "Braces",
  dojo: "js",
  lessons: [
    {
      id: "js07-leccion-01",
      title: "Declaración de funciones",
      content: `## Funciones en JavaScript

Una **función** es un bloque de código reutilizable que realiza una tarea específica. Las funciones son la base de la programación: nos permiten **escribir código una vez y usarlo muchas veces**.

### Sin funciones (código duplicado)

\`\`\`javascript
console.log("Hola Ana, bienvenida!");
console.log("Hola Luis, bienvenido!");
console.log("Hola Marta, bienvenida!");
\`\`\`

### Con funciones (reusable)

\`\`\`javascript
function saludar(nombre) {
  console.log("Hola " + nombre + ", bienvenido/a!");
}

saludar("Ana");
saludar("Luis");
saludar("Marta");
\`\`\`

### Anatomia de una función

\`\`\`javascript
function saludar(nombre) {       // <- declaracion
//       \\____/  \\____/
//       nombre   parametro
  return "Hola, " + nombre;     // <- cuerpo + return
}
\`\`\`

1. **Palabra clave** \`function\`
2. **Nombre:** identifica la función (\`saludar\`)
3. **Parámetros:** valores de entrada entre paréntesis (\`nombre\`)
4. **Cuerpo:** código entre llaves \`{ }\`
5. **return:** valor que devuelve (opcional)

### Parámetros vs argumentos

Confusión clasica. **No son lo mismo:**

\`\`\`javascript
function sumar(a, b) {  // a y b son PARAMETROS (en la definicion)
  return a + b;
}

sumar(5, 3);            // 5 y 3 son ARGUMENTOS (en la llamada)
\`\`\`

| Término | Donde aparece | Que es |
|---------|---------------|--------|
| **Parámetro** | En la definición | Variable que recibe el valor |
| **Argumento** | En la llamada | Valor concreto que se pasa |

### Función sin return

Si una función no tiene \`return\`, devuelve **\`undefined\`** automáticamente:

\`\`\`javascript
function saludar(nombre) {
  console.log("Hola " + nombre);
  // sin return
}

const resultado = saludar("Ana");  // imprime "Hola Ana"
console.log(resultado);             // undefined
\`\`\`

> **Importante:** \`console.log\` IMPRIME en pantalla. \`return\` DEVUELVE un valor que puedes guardar y usar después. No son lo mismo.

### Argumentos faltantes

Si pasas menos argumentos de los que espera, los faltantes son \`undefined\`:

\`\`\`javascript
function presentarse(nombre, edad) {
  return nombre + " tiene " + edad + " anos";
}

presentarse("Ana");  // "Ana tiene undefined anos"
\`\`\`

> **Tip:** Una función bien hecha tiene **una sola responsabilidad**. Si hace demasiado, dividela en funciones más pequeñas.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `function sumar(a, b) {
  return a + b;
}

function saludar(nombre) {
  return "Hola, " + nombre + "!";
}

function calcularArea(base, altura) {
  return (base * altura) / 2;
}

// Funcion sin return: devuelve undefined
function imprimir(texto) {
  console.log(texto);
}

const salida = [];
salida.push("sumar(3, 5) = " + sumar(3, 5));
salida.push(saludar("Estudiante"));
salida.push("Area triangulo (6, 4) = " + calcularArea(6, 4));
salida.push("imprimir() devuelve: " + imprimir("test"));
document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js07-leccion-02",
      title: "Expresión de funciones",
      content: `## Expresión de funciones (Function Expressión)

Una **expresión de función** es una función que se **asigna a una variable**. La función en si misma no tiene nombre (es **anonima**), pero la variable la guarda.

### Sintaxis

\`\`\`javascript
const saludar = function(nombre) {
  return "Hola, " + nombre + "!";
};
\`\`\`

> Notar: la función no tiene nombre después de \`function\`. Es **anonima**. La identificamos por la variable.

### Comparación lado a lado

\`\`\`javascript
// Declaracion (function declaration)
function saludar1(nombre) {
  return "Hola " + nombre;
}

// Expresion (function expression)
const saludar2 = function(nombre) {
  return "Hola " + nombre;
};

// Las dos se llaman igual
saludar1("Ana");
saludar2("Ana");
\`\`\`

### Diferencia clave: hoisting

Las **declaraciones** se "mueven" al inicio del archivo (hoisting). Las **expresiones** NO.

\`\`\`javascript
// FUNCIONA (declaracion se hoistea)
saludar1("Ana");
function saludar1(nombre) {
  return "Hola " + nombre;
}
\`\`\`

\`\`\`javascript
// ERROR (expresion no se hoistea)
saludar2("Ana");  // ReferenceError
const saludar2 = function(nombre) {
  return "Hola " + nombre;
};
\`\`\`

### ¿Por que usar const?

Al asignar la función a \`const\`, **proteges** la función de ser sobrescrita:

\`\`\`javascript
const calcular = function(a, b) {
  return a + b;
};

calcular = function() { return 0; };  // Error: Assignment to constant
\`\`\`

Con una declaración normal, otro código podria redefinir tu función accidentalmente.

### ¿Cuándo usar expresión de funciones?

1. Cuando quieres ser **explícito** sobre el orden de definición (no quieres hoisting).
2. Cuando vas a **pasar la función como argumento** a otra función (callbacks).
3. Cuando creas funciones **condicionalmente**:

\`\`\`javascript
let operacion;
if (modo === "suma") {
  operacion = function(a, b) { return a + b; };
} else {
  operacion = function(a, b) { return a - b; };
}
\`\`\`

### Expresión de función nombrada (raro pero útil)

También puedes darle nombre a la función Después de \`function\`:

\`\`\`javascript
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);  // se llama a si misma con su nombre interno
};
\`\`\`

> El nombre interno (\`fact\`) solo es visible dentro de la propia función. Es útil para recursión y debugging.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #cba6f7; border-radius: 8px; white-space: pre-line; }',
        js: `// Expresion de funcion (anonima, asignada a const)
const cuadrado = function(x) {
  return x * x;
};

const saludar = function(nombre) {
  return "Hola " + nombre + " desde una expresion!";
};

// Expresion de funcion nombrada (recursiva)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
};

const salida = [];
salida.push("cuadrado(7) = " + cuadrado(7));
salida.push(saludar("Estudiante"));
salida.push("factorial(5) = " + factorial(5));
salida.push("factorial(6) = " + factorial(6));

// Asignar funciones segun condicion
const modo = "suma";
let operacion;
if (modo === "suma") {
  operacion = function(a, b) { return a + b; };
} else {
  operacion = function(a, b) { return a - b; };
}
salida.push("operacion(10, 3) = " + operacion(10, 3));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js07-leccion-03",
      title: "Arrow functions",
      content: `## Arrow Functions (funciones flecha)

Las arrow functions son una sintaxis **más corta y moderna** para escribir funciones. Son las MÁS USADAS en el código JavaScript actual (React, Vue, etc.).

### Sintaxis básica

\`\`\`javascript
const sumar = (a, b) => {
  return a + b;
};
\`\`\`

> Quitamos \`function\` y agregamos \`=>\` después de los parámetros.

### Retorno implícito (una línea)

Si el cuerpo es UNA SOLA EXPRESIÓN, puedes omitir las llaves Y el \`return\`:

\`\`\`javascript
// Forma larga
const sumar = (a, b) => {
  return a + b;
};

// Forma corta (return implicito)
const sumar = (a, b) => a + b;
\`\`\`

### Variantes según parámetros

\`\`\`javascript
// Sin parametros: parentesis vacios obligatorios
const saludar = () => "Hola!";

// Un parametro: parentesis OPCIONALES
const doble = x => x * 2;
const doble2 = (x) => x * 2;  // tambien valido

// Dos o mas parametros: parentesis obligatorios
const sumar = (a, b) => a + b;
\`\`\`

### Múltiples líneas: llaves obligatorias

Cuando hay más de UNA expresión, necesitas llaves Y \`return\` explícito:

\`\`\`javascript
const procesar = texto => {
  const limpio = texto.trim();
  const minusculas = limpio.toLowerCase();
  return minusculas;
};
\`\`\`

### Trampa: devolver un objeto literal

Si quieres devolver un objeto directo, **envuelvelo en paréntesis**:

\`\`\`javascript
// MAL: las llaves se interpretan como bloque de codigo
const crear = nombre => { nombre: nombre };  // undefined

// BIEN: envolver en parentesis
const crear = nombre => ({ nombre: nombre });
\`\`\`

### Diferencia con funciones normales: \`this\`

Las arrow functions **NO tienen su propio \`this\`**. Heredan el del contexto donde se crearon.

\`\`\`javascript
const objeto = {
  nombre: "Ana",

  // Funcion normal: this = objeto
  saludarNormal: function() {
    console.log(this.nombre);  // "Ana"
  },

  // Arrow: this = el contexto exterior
  saludarArrow: () => {
    console.log(this.nombre);  // undefined
  }
};
\`\`\`

> **Por eso:** NO uses arrow functions como **métodos de objetos** ni en **constructores**. Si para callbacks y funciones cortas.

### Arrow functions con métodos de array

Donde brillan: callbacks cortos en métodos de arrays.

\`\`\`javascript
const numeros = [1, 2, 3, 4, 5];
const dobles = numeros.map(n => n * 2);  // [2, 4, 6, 8, 10]
const pares = numeros.filter(n => n % 2 === 0);  // [2, 4]
\`\`\`

> Esto lo veremos en detalle en el modulo de **métodos de arrays**.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `// Arrow functions - todas las variantes
const saludar = () => "Hola desde arrow function!";
const doble = x => x * 2;
const sumar = (a, b) => a + b;
const promedio = (a, b, c) => (a + b + c) / 3;

// Multiples lineas
const procesar = texto => {
  const limpio = texto.trim();
  const minusculas = limpio.toLowerCase();
  return minusculas;
};

// Devolver objeto: parentesis necesarios
const crearUsuario = (nombre, edad) => ({ nombre: nombre, edad: edad });

const salida = [];
salida.push(saludar());
salida.push("doble(7) = " + doble(7));
salida.push("sumar(10, 20) = " + sumar(10, 20));
salida.push("promedio(8, 9, 10) = " + promedio(8, 9, 10));
salida.push("procesar('  HOLA  ') = '" + procesar("  HOLA  ") + "'");
salida.push("crearUsuario: " + JSON.stringify(crearUsuario("Ana", 25)));

// Arrow + array methods (preview)
const numeros = [1, 2, 3, 4, 5];
const dobles = numeros.map(n => n * 2);
salida.push("Dobles: " + dobles.join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "js07-leccion-04",
      title: "Hoisting y comparación de las 3 formas",
      content: `## Las 3 formas de declarar funciones

JavaScript ofrece **tres maneras** de crear funciones. Todas hacen lo mismo, pero tienen diferencias importantes.

### Tabla comparativa

| Caracteristica | Declaración | Expresión | Arrow |
|----------------|-------------|-----------|-------|
| Sintaxis | \`function f() {}\` | \`const f = function() {}\` | \`const f = () => {}\` |
| Hoisting | Si | No | No |
| Tiene nombre | Si | No (anonima) | No (anonima) |
| Return implícito | No | No | Si (si una línea) |
| \`this\` propio | Si | Si | No (heredado) |
| Mejor para | Código viejo | Asignación condicional | Callbacks, código moderno |

### ¿Qué es Hoisting?

JavaScript **"levanta"** las declaraciones al inicio de su scope antes de ejecutar el código. Esto solo aplica a **declaraciones de función**.

### Hoisting en acción

\`\`\`javascript
// 1. Declaracion: SI funciona antes de declararse
saludar1();  // "Hola" ✓

function saludar1() {
  console.log("Hola");
}

// 2. Expresion: NO funciona antes de declararse
saludar2();  // ReferenceError ✗

const saludar2 = function() {
  console.log("Hola");
};

// 3. Arrow: tampoco funciona antes
saludar3();  // ReferenceError ✗

const saludar3 = () => console.log("Hola");
\`\`\`

### ¿Por que pasa esto?

JavaScript procesa el código en dos fases:

1. **Fase de creación:** registra todas las declaraciones (\`function\`, \`var\`, \`let\`, \`const\`).
2. **Fase de ejecución:** ejecuta línea por línea.

Las declaraciones de función se procesan **completas** en la fase 1 (por eso se pueden usar antes). Las expresiones solo se procesan en la fase 2 (cuando se asignan).

### Temporal Dead Zone (TDZ)

Las variables \`const\` y \`let\` existen desde el inicio del bloque, pero **no se pueden usar** hasta que se declaran. Esto es la **TDZ**.

\`\`\`javascript
console.log(x);  // ReferenceError (TDZ)
const x = 10;
\`\`\`

### Mismo ejemplo, las 3 formas

\`\`\`javascript
// 1. Declaracion
function multiplicar(a, b) {
  return a * b;
}

// 2. Expresion
const multiplicar = function(a, b) {
  return a * b;
};

// 3. Arrow
const multiplicar = (a, b) => a * b;
\`\`\`

### ¿Cuál usar?

**Regla pragmatica para principiantes:**

- **Por defecto:** Arrow functions. Son cortas, modernas y son lo que vas a ver en cualquier codebase actual (React, Vue, Node moderno).
- **Si necesitas hoisting** (poder usar la función antes de declararla): declaración tradicional.
- **Si trabajas con \`this\` o eres método de un objeto:** declaración o expresión (NO arrow).
- **Si pasas la función como callback:** arrow function (corta y limpia).

> **En entrevistas:** te van a preguntar la diferencia entre las 3 formas. Memoricen la tabla.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f9e2af; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];

// Hoisting demo
salida.push("Llamando declarada antes de definirla:");
salida.push("  saludar1() = " + saludar1());

function saludar1() {
  return "Hola desde declaracion (hoisted)";
}

// Misma funcion en 3 formas
function multiplicar1(a, b) { return a * b; }
const multiplicar2 = function(a, b) { return a * b; };
const multiplicar3 = (a, b) => a * b;

salida.push("---");
salida.push("3 formas, mismo resultado:");
salida.push("  declarada: " + multiplicar1(4, 5));
salida.push("  expresion: " + multiplicar2(4, 5));
salida.push("  arrow:     " + multiplicar3(4, 5));

// Arrow function moderna con callbacks
const numeros = [1, 2, 3, 4, 5];
salida.push("---");
salida.push("Arrow en callback (moderno):");
salida.push("  cuadrados: " + numeros.map(n => n * n).join(", "));
salida.push("  pares:     " + numeros.filter(n => n % 2 === 0).join(", "));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 4,
    },
    {
      id: "js07-leccion-05",
      title: "Parámetros avanzados: default, rest y spread",
      content: `## Parámetros por defecto

Permiten dar un **valor inicial** a un parámetro si no se pasa argumento.

### Sintaxis

\`\`\`javascript
const saludar = (nombre = "amigo") => {
  return "Hola " + nombre + "!";
};

saludar();          // "Hola amigo!"
saludar("Ana");     // "Hola Ana!"
\`\`\`

### Detalle importante: solo activa con \`undefined\`

El valor por defecto **solo se usa cuando el parámetro es \`undefined\`** (osea cuando NO se paso). Si pasas \`null\`, \`0\`, \`""\` o \`false\`, usa ESE valor (no el default).

\`\`\`javascript
const saludar = (nombre = "amigo") => "Hola " + nombre;

saludar();           // "Hola amigo"  (undefined → usa default)
saludar(undefined);  // "Hola amigo"  (undefined explicito → usa default)
saludar(null);       // "Hola null"   (null NO activa default)
saludar("");         // "Hola "       (string vacio NO activa default)
\`\`\`

### Múltiples parámetros con default

\`\`\`javascript
const calcular = (precio, descuento = 0, iva = 0.19) => {
  const conDescuento = precio - precio * descuento;
  return conDescuento * (1 + iva);
};

calcular(100);              // sin descuento, 19% IVA
calcular(100, 0.1);         // 10% descuento, 19% IVA
calcular(100, 0.1, 0.05);   // 10% descuento, 5% IVA
\`\`\`

> **Regla:** Los parámetros con default deben ir **al final**, sino se rompe la posición.

## Rest parameters (...args)

Permite que una función reciba un **número variable** de argumentos. Los agrupa en un array.

### Sintaxis

\`\`\`javascript
const sumarTodo = (...numeros) => {
  let total = 0;
  for (const n of numeros) {
    total += n;
  }
  return total;
};

sumarTodo(1, 2);             // 3
sumarTodo(1, 2, 3, 4, 5);    // 15
sumarTodo();                  // 0
\`\`\`

> El \`...numeros\` AGRUPA todos los argumentos en un array. La función ya no necesita saber cuantos argumentos vienen.

### Combinar con parámetros normales

\`\`\`javascript
const presentar = (saludo, ...nombres) => {
  return nombres.map(n => saludo + ", " + n).join(" | ");
};

presentar("Hola", "Ana", "Luis", "Carlos");
// "Hola, Ana | Hola, Luis | Hola, Carlos"
\`\`\`

> **Reglas:** Solo puede haber UN \`...rest\` y debe ir **al final**.

## Spread operator (...arr)

Misma sintaxis (\`...\`) pero hace lo **OPUESTO**: toma un array y lo "extiende" en valores individuales.

### En llamadas a funciones

\`\`\`javascript
const numeros = [3, 7, 1, 9, 2];

// Sin spread (no funciona como esperamos)
Math.max(numeros);     // NaN

// Con spread
Math.max(...numeros);  // 9
\`\`\`

### En arrays

\`\`\`javascript
// Combinar arrays
const a = [1, 2, 3];
const b = [4, 5, 6];
const todo = [...a, ...b];  // [1, 2, 3, 4, 5, 6]

// Copiar array (sin afectar original)
const original = [1, 2, 3];
const copia = [...original];
copia.push(4);
// original = [1, 2, 3] intacto
// copia = [1, 2, 3, 4]
\`\`\`

### En objetos

\`\`\`javascript
const usuario = { nombre: "Ana", edad: 25 };
const actualizado = { ...usuario, edad: 26 };
// { nombre: "Ana", edad: 26 }
\`\`\`

### Resumen mental

| Sintaxis | Donde | Que hace |
|----------|-------|----------|
| \`(...args)\` | En **parámetros** | Agrupa argumentos en array (rest) |
| \`func(...arr)\` | En **llamada** | Expande array en argumentos sueltos (spread) |
| \`[...arr]\` | En **array literal** | Copia/combina arrays (spread) |
| \`{...obj}\` | En **objeto literal** | Copia/combina objetos (spread) |

> La sintaxis es la misma, el **contexto** define el significado.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #fab387; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];

// Parametros por defecto
const saludar = (nombre = "amigo", saludo = "Hola") => saludo + " " + nombre + "!";
salida.push("saludar() = " + saludar());
salida.push("saludar('Ana') = " + saludar("Ana"));
salida.push("saludar('Luis', 'Buenos dias') = " + saludar("Luis", "Buenos dias"));

// Rest parameters
const sumarTodo = function(...nums) {
  let total = 0;
  for (var i = 0; i < nums.length; i++) total += nums[i];
  return total;
};
salida.push("---");
salida.push("sumarTodo(1, 2, 3) = " + sumarTodo(1, 2, 3));
salida.push("sumarTodo(1..10) = " + sumarTodo(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));

// Spread en llamadas
const numeros = [3, 7, 1, 9, 2, 8];
salida.push("---");
salida.push("Math.max(...numeros) = " + Math.max.apply(null, numeros));
salida.push("Math.min(...numeros) = " + Math.min.apply(null, numeros));

// Spread en arrays
const a = [1, 2, 3];
const b = [4, 5, 6];
const todo = a.concat(b);
salida.push("Combinar: [" + todo.join(", ") + "]");

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 5,
    },
    {
      id: "js07-leccion-06",
      title: "Scope, Closures y funciones como valores",
      content: `## Scope (alcance)

El **scope** determina **donde una variable es accesible**.

### Scope global

Variables declaradas FUERA de cualquier función. Visibles en todo el archivo.

\`\`\`javascript
const global = "soy global";

function ejemplo() {
  console.log(global);  // "soy global" ✓
}
\`\`\`

### Scope de función

Variables declaradas DENTRO de una función. Solo visibles ahi.

\`\`\`javascript
function calcular() {
  const resultado = 42;  // local
}

calcular();
console.log(resultado);  // ReferenceError ✗
\`\`\`

### Scope de bloque (let/const)

Las variables \`let\` y \`const\` solo viven dentro del **bloque \`{ }\`** donde se declaran.

\`\`\`javascript
if (true) {
  let bloque = "solo aqui";
  const otro = "yo tambien";
}

console.log(bloque);  // ReferenceError ✗
\`\`\`

> **Importante:** \`var\` NO respeta el scope de bloque (solo el de función). Otra razón más para usar \`const\` y \`let\`.

### Acceso jerarquico

Las funciones pueden ver variables de scopes "arriba", pero no al reves:

\`\`\`javascript
const externa = "padre";

function nivel1() {
  const interna = "hijo";

  function nivel2() {
    console.log(externa);  // "padre" ✓
    console.log(interna);  // "hijo" ✓
  }

  nivel2();
}
\`\`\`

## Closures

Un **closure** es una función que **recuerda** las variables del scope donde fue creada, **incluso después** de que ese scope haya terminado.

### Ejemplo clasico: contador privado

\`\`\`javascript
function crearContador() {
  let cuenta = 0;  // variable "privada"

  return function() {
    cuenta++;      // sigue accediendo a cuenta
    return cuenta;
  };
}

const contar = crearContador();
contar();  // 1
contar();  // 2
contar();  // 3

console.log(cuenta);  // ReferenceError (cuenta es privada)
\`\`\`

> **Magia:** \`crearContador\` ya término, pero la función devuelta sigue **viendo** la variable \`cuenta\`. Eso es un closure.

### Fabrica de funciones

\`\`\`javascript
function multiplicarPor(factor) {
  return function(numero) {
    return numero * factor;
  };
}

const triple = multiplicarPor(3);
const decuple = multiplicarPor(10);

triple(5);    // 15
decuple(5);   // 50
\`\`\`

> Cada llamada a \`multiplicarPor\` crea un closure DIFERENTE con su propio \`factor\`.

### ¿Por que importan los closures?

1. **Encapsulamiento:** crear datos privados (no accesibles desde afuera).
2. **Fabricas de funciones:** generar funciones especializadas.
3. **Callbacks con estado:** funciones que recuerdan información entre llamadas.

## Funciones como valores (callbacks)

En JavaScript, las funciones son **valores**: se pueden guardar en variables, pasar como argumentos y devolverlas desde otras funciones.

### Pasar función como argumento

\`\`\`javascript
function ejecutarOperacion(a, b, operacion) {
  return operacion(a, b);
}

const sumar = (x, y) => x + y;
const restar = (x, y) => x - y;

ejecutarOperacion(10, 5, sumar);   // 15
ejecutarOperacion(10, 5, restar);  // 5
\`\`\`

> Esa función que pasamos como argumento se llama **callback**. La "llamamos de vuelta" cuando la función principal lo necesita.

### Callback inline (arrow)

Lo más común:

\`\`\`javascript
ejecutarOperacion(10, 5, (a, b) => a * b);  // 50
\`\`\`

### ¿Por que importan los callbacks?

Son la base de:
- **Métodos de array:** \`.map(callback)\`, \`.filter(callback)\`, \`.forEach(callback)\`
- **Eventos:** \`boton.addEventListener("click", callback)\`
- **Asincronía:** \`setTimeout(callback, 1000)\`, fetch, promesas

> Lo veremos a fondo en los modulos de **Arrays**, **DOM/Eventos** y **Asincronismo**.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `const salida = [];

// Closure: contador
function crearContador() {
  let cuenta = 0;
  return function() {
    cuenta++;
    return cuenta;
  };
}

const contar = crearContador();
salida.push("Closure - Contador:");
salida.push("  " + contar());
salida.push("  " + contar());
salida.push("  " + contar());

// Closure: fabrica de funciones
function multiplicarPor(factor) {
  return function(numero) {
    return numero * factor;
  };
}

const triple = multiplicarPor(3);
const decuple = multiplicarPor(10);
salida.push("---");
salida.push("Fabrica de funciones:");
salida.push("  triple(5) = " + triple(5));
salida.push("  decuple(5) = " + decuple(5));

// Funciones como valores (callback)
function ejecutar(a, b, op) {
  return op(a, b);
}

const sumar = (x, y) => x + y;
const multiplicar = (x, y) => x * y;

salida.push("---");
salida.push("Callbacks:");
salida.push("  ejecutar(4, 5, sumar) = " + ejecutar(4, 5, sumar));
salida.push("  ejecutar(4, 5, multiplicar) = " + ejecutar(4, 5, multiplicar));
salida.push("  ejecutar(4, 5, (a,b) => a-b) = " + ejecutar(4, 5, (a, b) => a - b));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 6,
    },
    {
      id: "js07-leccion-07",
      title: "Recursividad",
      content: `## Funciones recursivas

Una **función recursiva** es una función que **se llama a si misma**. Es una herramienta poderosa para resolver problemas que se pueden dividir en sub-problemas más pequeños del mismo tipo.

### Anatomia de una función recursiva

Toda función recursiva necesita **dos partes**:

1. **Caso base:** la condición para DETENER la recursión (sino sera infinita).
2. **Caso recursivo:** la función se llama a si misma con un problema más pequeño.

\`\`\`javascript
function recursiva(parametro) {
  // 1. Caso base
  if (condicionDeParada) {
    return valorFinal;
  }

  // 2. Caso recursivo
  return recursiva(parametroMasChico);
}
\`\`\`

### Ejemplo clasico: factorial

El factorial de N (escrito \`N!\`) es la multiplicación de todos los números del 1 al N.

\`\`\`
5! = 5 * 4 * 3 * 2 * 1 = 120
\`\`\`

Pero también podemos escribirlo así:

\`\`\`
5! = 5 * 4!
4! = 4 * 3!
3! = 3 * 2!
2! = 2 * 1!
1! = 1   <- caso base
\`\`\`

Código:

\`\`\`javascript
function factorial(n) {
  // Caso base
  if (n <= 1) return 1;

  // Caso recursivo
  return n * factorial(n - 1);
}

factorial(5);  // 120
\`\`\`

### Trazado paso a paso

\`\`\`
factorial(5)
  → 5 * factorial(4)
        → 4 * factorial(3)
              → 3 * factorial(2)
                    → 2 * factorial(1)
                          → 1                  ← caso base
                    → 2 * 1 = 2
              → 3 * 2 = 6
        → 4 * 6 = 24
  → 5 * 24 = 120
\`\`\`

### Otro ejemplo: suma de un array

\`\`\`javascript
function sumarArray(numeros) {
  if (numeros.length === 0) return 0;       // caso base
  return numeros[0] + sumarArray(numeros.slice(1));
}

sumarArray([1, 2, 3, 4]);  // 10
\`\`\`

### Cuidado: stack overflow

Si **olvidas el caso base**, la función se llama a si misma infinitamente y el navegador colapsa con \`Maximum call stack size exceeded\`.

\`\`\`javascript
// MAL: sin caso base
function infinita(n) {
  return infinita(n - 1);  // nunca para
}
\`\`\`

### Recursión vs ciclos

La recursión **siempre se puede reescribir como un ciclo**. La elección depende del problema:

| Situación | Mejor opción |
|-----------|--------------|
| Iteración simple sobre números o arrays | Ciclo (\`for\`, \`while\`) |
| Estructuras anidadas (árboles, JSON profundo) | Recursión |
| Problemas matematicos definidos recursivamente (factorial, fibonacci) | Recursión |
| Cuando importa el rendimiento | Ciclo (es más rápido) |

> **¿Tip:** Antes de usar recursión, pregunta: "Puedo resolverlo con un ciclo?". Si la respuesta es si, **el ciclo es más eficiente**. Usa recursión cuando aporte claridad.

### Número de Fibonacci (otro clasico)

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;  // caso base
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(8);  // 21 (secuencia: 0,1,1,2,3,5,8,13,21)
\`\`\``,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #94e2d5; border-radius: 8px; white-space: pre-line; }',
        js: `// Factorial recursivo
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Fibonacci recursivo
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Suma recursiva de array
function sumarArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumarArray(arr.slice(1));
}

// Cuenta regresiva
function cuentaRegresiva(n) {
  if (n < 0) return "Despegue!";
  return n + " -> " + cuentaRegresiva(n - 1);
}

const salida = [];
salida.push("factorial(5) = " + factorial(5));
salida.push("factorial(7) = " + factorial(7));
salida.push("fibonacci(10) = " + fibonacci(10));
salida.push("sumarArray([1,2,3,4,5]) = " + sumarArray([1, 2, 3, 4, 5]));
salida.push("cuentaRegresiva(5):");
salida.push("  " + cuentaRegresiva(5));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 7,
    },
    {
      id: "js07-leccion-08",
      title: "Funciones como métodos de objetos",
      content: `## ¿Qué es un método?

Un **método** es simplemente una **función que es propiedad de un objeto**. No hay nada especial: es una función guardada en un objeto.

\`\`\`javascript
const persona = {
  nombre: "Ana",
  edad: 25,
  saludar: function() {              // <- metodo
    return "Hola, soy " + this.nombre;
  }
};

persona.saludar();  // "Hola, soy Ana"
\`\`\`

> **Mensaje clave:** una **propiedad** guarda un valor (string, número, array...). Un **método** guarda una función. Internamente son lo mismo.

### Llamar un método

Se usa la **notación de punto** del objeto:

\`\`\`javascript
objeto.nombreDelMetodo(argumentos);
\`\`\`

### Sintaxis corta (ES6)

JavaScript moderno permite escribir métodos sin la palabra \`function\`:

\`\`\`javascript
// Forma larga (tradicional)
const calculadora = {
  sumar: function(a, b) {
    return a + b;
  }
};

// Forma corta (ES6) - PREFERIDA
const calculadora = {
  sumar(a, b) {
    return a + b;
  }
};
\`\`\`

> Las dos hacen exactamente lo mismo. Usa la corta en código moderno.

## La palabra clave \`this\`

Dentro de un método, \`this\` se refiere al **objeto que llamo al método**.

\`\`\`javascript
const persona = {
  nombre: "Ana",
  edad: 25,
  presentarse() {
    return "Soy " + this.nombre + " y tengo " + this.edad + " anos";
  }
};

persona.presentarse();  // "Soy Ana y tengo 25 anos"
\`\`\`

> Sin \`this\`, el método no podria acceder a las otras propiedades del objeto.

### \`this\` apunta al objeto a la IZQUIERDA del punto

\`\`\`javascript
const ana = { nombre: "Ana", saludar() { return "Hola " + this.nombre; } };
const luis = { nombre: "Luis", saludar: ana.saludar };

ana.saludar();   // "Hola Ana"   (this = ana)
luis.saludar();  // "Hola Luis"  (this = luis)
\`\`\`

> El **mismo método** devuelve cosas distintas dependiendo de quien lo llame.

## Trampa: arrow functions como métodos

Las arrow functions **NO tienen su propio \`this\`**. Heredan el del contexto exterior. Por eso **fallan como métodos**:

\`\`\`javascript
const persona = {
  nombre: "Ana",

  saludarBien: function() {       // ✓ funciona
    return "Hola " + this.nombre;
  },

  saludarMal: () => {             // ✗ falla
    return "Hola " + this.nombre;  // this no es persona
  }
};

persona.saludarBien();  // "Hola Ana"
persona.saludarMal();   // "Hola undefined"
\`\`\`

> **Regla de oro:** Para definir métodos, usa **función tradicional** o **sintaxis corta ES6**. NO uses arrow functions.

## Métodos que modifican el propio objeto

\`\`\`javascript
const contador = {
  cuenta: 0,
  incrementar() {
    this.cuenta++;       // modifica la propiedad del objeto
    return this.cuenta;
  },
  resetear() {
    this.cuenta = 0;
  }
};

contador.incrementar();  // 1
contador.incrementar();  // 2
contador.incrementar();  // 3
contador.resetear();
contador.cuenta;         // 0
\`\`\`

## Encadenamiento de métodos

Si un método devuelve \`this\`, puedes encadenar llamadas:

\`\`\`javascript
const lista = {
  items: [],
  agregar(x) {
    this.items.push(x);
    return this;            // <- devuelve el objeto
  },
  mostrar() {
    console.log(this.items);
    return this;
  }
};

lista.agregar("a").agregar("b").agregar("c").mostrar();
// ["a", "b", "c"]
\`\`\`

> Patrón muy común en jQuery, lodash, Express, etc.

### Mira esto: ya conoces métodos

\`\`\`javascript
"hola".toUpperCase();        // metodo de string
[1, 2, 3].push(4);           // metodo de array
Math.random();                // metodo de Math
console.log("hi");            // metodo de console
\`\`\`

> Todos los \`.algo()\` que has usado son métodos. Strings, arrays, Math, console... todos son objetos con métodos.

> **Nota:** Veremos más a fondo objetos y métodos en el modulo **Objetos**. Aquí solo establecimos la base: un método es una función dentro de un objeto.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f38ba8; border-radius: 8px; white-space: pre-line; }',
        js: `// Objeto con metodos (sintaxis corta ES6)
const persona = {
  nombre: "Ana",
  edad: 25,
  saludar() {
    return "Hola, soy " + this.nombre;
  },
  presentarse() {
    return "Soy " + this.nombre + " y tengo " + this.edad + " anos";
  },
  cumplirAnos() {
    this.edad++;
    return this;
  }
};

const salida = [];
salida.push(persona.saludar());
salida.push(persona.presentarse());

persona.cumplirAnos();
salida.push("Despues de cumplir: " + persona.presentarse());

// Demostracion: this depende de QUIEN llama
const luis = { nombre: "Luis", saludar: persona.saludar };
salida.push("---");
salida.push("Mismo metodo, distinto this:");
salida.push("  " + persona.saludar());
salida.push("  " + luis.saludar());

// Encadenamiento de metodos
const lista = {
  items: [],
  agregar(x) { this.items.push(x); return this; },
  mostrar() { return this.items.join(", "); }
};

const resultado = lista.agregar("a").agregar("b").agregar("c").mostrar();
salida.push("---");
salida.push("Encadenamiento: " + resultado);

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 8,
    },
  ],
  exercises: [
    {
      id: "js07-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "¿Qué palabra clave se usa para que una función devuelva un valor?",
      options: [
        { id: "a", text: "output", isCorrect: false },
        { id: "b", text: "return", isCorrect: true },
        { id: "c", text: "yield", isCorrect: false },
        { id: "d", text: "send", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En ingles significa 'devolver' o 'retornar'.",
      explanation: "return devuelve un valor desde la función y termina su ejecución.",
    },
    {
      id: "js07-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "¿Qué devuelve una función si no tiene return?",
      options: [
        { id: "a", text: "null", isCorrect: false },
        { id: "b", text: "0", isCorrect: false },
        { id: "c", text: "undefined", isCorrect: true },
        { id: "d", text: '""', isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es el valor por defecto cuando algo no tiene valor asignado.",
      explanation: "Si una función no tiene return o tiene return sin valor, devuelve undefined automáticamente.",
    },
    {
      id: "js07-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt: "¿Cuál es la diferencia entre un parámetro y un argumento?",
      options: [
        { id: "a", text: "Son sinonimos, no hay diferencia", isCorrect: false },
        { id: "b", text: "El parámetro va en la definición de la función, el argumento en la llamada", isCorrect: true },
        { id: "c", text: "El argumento es lo mismo que el return", isCorrect: false },
        { id: "d", text: "El parámetro es opcional, el argumento obligatorio", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en una función: la cosa entre paréntesis al definirla vs al llamarla.",
      explanation:
        "Parámetro es la variable que aparece en la definición: function f(a, b). ARGUMENTO es el valor concreto que se pasa al llamarla: f(5, 3).",
    },
    {
      id: "js07-ej-04",
      type: "code-completion",
      difficulty: 1,
      xpReward: 10,
      order: 4,
      prompt: "Completa la arrow function que duplica un número:",
      codeTemplate: {
        html: "",
        cssPrefix: "const doble = x ",
        cssSuffix: " x * 2;",
        blanks: ["=>"],
      },
      validation: { type: "exact", answer: "=>" },
      hint: "La flecha de una arrow function se escribe con = y >.",
      explanation: "=> es la sintaxis de las arrow functions. const doble = x => x * 2;",
    },
    {
      id: "js07-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "¿Cuál de estas es una EXPRESIÓN DE FUNCIÓN valida?",
      options: [
        { id: "a", text: "function calcular() { return 42; }", isCorrect: false },
        { id: "b", text: "const calcular = function() { return 42; };", isCorrect: true },
        { id: "c", text: "function = calcular() { return 42; };", isCorrect: false },
        { id: "d", text: "calcular: function() { return 42; }", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una expresión de función se ASIGNA a una variable.",
      explanation:
        "Una expresión de función es una función (generalmente anonima) asignada a una variable. La opción A es una declaración, no una expresión.",
    },
    {
      id: "js07-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "¿Cuál de estas es una arrow function valida?",
      options: [
        { id: "a", text: "const f = => x * 2;", isCorrect: false },
        { id: "b", text: "const f = x => x * 2;", isCorrect: true },
        { id: "c", text: "const f = x -> x * 2;", isCorrect: false },
        { id: "d", text: "const f = function => x * 2;", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Con un solo parámetro, no necesitas paréntesis.",
      explanation: "const f = x => x * 2 es la sintaxis correcta. Con un parámetro los paréntesis son opcionales.",
    },
    {
      id: "js07-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt: "¿Cuál de las 3 formas de declarar funciones SE PUEDE usar antes de declararla (hoisting)?",
      options: [
        { id: "a", text: "Las tres formas", isCorrect: false },
        { id: "b", text: "Declaración (function nombre)", isCorrect: true },
        { id: "c", text: "Expresión (const f = function)", isCorrect: false },
        { id: "d", text: "Arrow function (const f = () =>)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Solo una forma se 'levanta' al inicio del archivo.",
      explanation:
        "Solo las DECLARACIONES de función se hoistean (se mueven al inicio). Las expresiones y arrow functions NO, porque dependen de la asignación a una variable.",
    },
    {
      id: "js07-ej-08",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 8,
      prompt: "Cuando se aplica el valor por defecto en: const saludar = (n = 'amigo') => 'Hola ' + n;",
      options: [
        { id: "a", text: "Cuando se pasa null", isCorrect: false },
        { id: "b", text: "Cuando se pasa string vacío ''", isCorrect: false },
        { id: "c", text: "Solo cuando NO se pasa argumento (undefined)", isCorrect: true },
        { id: "d", text: "Cuando se pasa 0", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El default solo se activa con un valor específico.",
      explanation:
        "El valor por defecto SOLO se aplica cuando el argumento es undefined (no se pasa). null, 0, '' o false NO activan el default.",
    },
    {
      id: "js07-ej-09",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 9,
      prompt: "Que hace la sintaxis ...números en: function sumar(...números) { ... }",
      options: [
        { id: "a", text: "Es un error de sintaxis", isCorrect: false },
        { id: "b", text: "Agrupa todos los argumentos en un array llamado números", isCorrect: true },
        { id: "c", text: "Multiplica los argumentos", isCorrect: false },
        { id: "d", text: "Convierte los argumentos a strings", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se llama 'rest parameters'.",
      explanation:
        "Los rest parameters (...números) agrupan TODOS los argumentos pasados en un array. Permite recibir cantidad variable de argumentos.",
    },
    {
      id: "js07-ej-10",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 10,
      prompt: "¿Qué devuelve Math.max(...[3, 7, 1, 9, 2])?",
      options: [
        { id: "a", text: "Error: Math.max no acepta arrays", isCorrect: false },
        { id: "b", text: "[3, 7, 1, 9, 2]", isCorrect: false },
        { id: "c", text: "9", isCorrect: true },
        { id: "d", text: "22", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El ... extiende el array como argumentos sueltos.",
      explanation:
        "El spread operator (...) extiende el array, así Math.max recibe (3, 7, 1, 9, 2) como argumentos individuales y devuelve el mayor: 9.",
    },
    {
      id: "js07-ej-11",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 11,
      prompt: "¿Qué es un closure en JavaScript?",
      options: [
        { id: "a", text: "Una función que se ejecuta inmediatamente", isCorrect: false },
        { id: "b", text: "Una función que recuerda las variables de su scope de creación", isCorrect: true },
        { id: "c", text: "Una función sin parámetros", isCorrect: false },
        { id: "d", text: "Una función que no devuelve nada", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El closure 'encierra' las variables del entorno donde fue creado.",
      explanation:
        "Un closure es una función que mantiene acceso a las variables del scope en el que fue definida, incluso después de que ese scope haya terminado.",
    },
    {
      id: "js07-ej-12",
      type: "drag-drop",
      difficulty: 3,
      xpReward: 30,
      order: 12,
      prompt: "Clasifica cada tipo de función:",
      dragItems: [
        { id: "drag-1", content: "function sumar(a, b) { }", correctZone: "zone-declaracion" },
        { id: "drag-2", content: "const f = function() { }", correctZone: "zone-expresion" },
        { id: "drag-3", content: "const f = () => { }", correctZone: "zone-arrow" },
      ],
      dropZones: [
        { id: "zone-declaracion", label: "Declaración de función" },
        { id: "zone-expresion", label: "Expresión de función" },
        { id: "zone-arrow", label: "Arrow function" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-declaracion",
          "drag-2": "zone-expresion",
          "drag-3": "zone-arrow",
        },
      },
      hint: "La declaración usa function como primera palabra, la expresión la asigna a una variable, y la arrow usa =>.",
      explanation:
        "Las tres formas de crear funciones: declaración (function nombre), expresión (asignada a variable), y arrow function (usa =>).",
    },
    {
      id: "js07-ej-13",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 13,
      prompt: "¿Qué parte es OBLIGATORIA en una función recursiva para evitar un ciclo infinito?",
      options: [
        { id: "a", text: "Un parámetro tipo string", isCorrect: false },
        { id: "b", text: "Un caso base que detenga la recursión", isCorrect: true },
        { id: "c", text: "Un return undefined", isCorrect: false },
        { id: "d", text: "Una variable global", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Sin esta parte la función se llama a si misma para siempre.",
      explanation:
        "El caso base es la condición que detiene la recursión. Sin caso base la función se llama indefinidamente y produce un 'Maximum call stack size exceeded'.",
    },
    {
      id: "js07-ej-14",
      type: "code-completion",
      difficulty: 3,
      xpReward: 30,
      order: 14,
      prompt: "Completa el caso base del factorial recursivo:",
      codeTemplate: {
        html: "",
        cssPrefix: "function factorial(n) { if (n ",
        cssSuffix: " 1) return 1; return n * factorial(n - 1); }",
        blanks: ["<="],
      },
      validation: { type: "exact", answer: "<=" },
      hint: "El caso base se activa cuando n es 1 o menor (incluido 0).",
      explanation:
        "if (n <= 1) return 1 es el caso base: detiene la recursión cuando n llega a 1 (o menos), devolviendo 1.",
    },
    {
      id: "js07-ej-15",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 15,
      prompt: "¿Qué es un método en JavaScript?",
      options: [
        { id: "a", text: "Un tipo especial de variable", isCorrect: false },
        { id: "b", text: "Una función que es propiedad de un objeto", isCorrect: true },
        { id: "c", text: "Una función que se ejecuta automáticamente", isCorrect: false },
        { id: "d", text: "Una función que no devuelve nada", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en 'array.push()' o 'string.toUpperCase()'.",
      explanation:
        "Un método es una función guardada como propiedad de un objeto. Por eso podemos llamarlos con notación de punto: objeto.método().",
    },
    {
      id: "js07-ej-16",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 16,
      prompt: "¿Por que NO es buena idea usar arrow functions como métodos de un objeto?",
      options: [
        { id: "a", text: "Porque son más lentas que las funciones normales", isCorrect: false },
        { id: "b", text: "Porque las arrow functions no tienen su propio 'this' y no pueden acceder a las propiedades del objeto", isCorrect: true },
        { id: "c", text: "Porque siempre devuelven undefined", isCorrect: false },
        { id: "d", text: "Porque no pueden tener parámetros", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Tiene que ver con la palabra clave 'this'.",
      explanation:
        "Las arrow functions heredan 'this' del contexto exterior, por lo que dentro de un método arrow, 'this' NO apunta al objeto. Por eso se usan funciones tradicionales o sintaxis corta ES6 para métodos.",
    },
  ],
};
