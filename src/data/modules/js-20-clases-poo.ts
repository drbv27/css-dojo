import type { ModuleData } from "@/types";

export const jsClasesPooModule: ModuleData = {
  slug: "js-clases-poo",
  title: "Clases y POO",
  description:
    "Aprende Programacion Orientada a Objetos en JavaScript: clases, constructores, metodos, herencia con extends/super, propiedades estaticas, getters/setters y campos privados.",
  order: 120,
  category: "js-advanced",
  icon: "blocks",
  dojo: "js",
  lessons: [
    {
      id: "js-20-leccion-01",
      title: "Clases, constructores y metodos",
      content: `## Clases, constructores y metodos

### Que es una clase?

Una **clase** es un plano o plantilla para crear objetos con propiedades y comportamientos comunes.

\`\`\`javascript
class Animal {
  // El constructor se ejecuta al crear una instancia
  constructor(nombre, tipo) {
    this.nombre = nombre;
    this.tipo = tipo;
  }

  // Metodo de la clase
  describir() {
    return \`\${this.nombre} es un \${this.tipo}\`;
  }
}

// Crear instancias
const gato = new Animal('Luna', 'gato');
const perro = new Animal('Max', 'perro');

console.log(gato.describir()); // "Luna es un gato"
console.log(perro.nombre);     // "Max"
\`\`\`

### El constructor

- Se ejecuta automaticamente al usar \`new\`
- Inicializa las propiedades del objeto
- Solo puede haber **uno** por clase

\`\`\`javascript
class Producto {
  constructor(nombre, precio, stock = 0) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.fechaCreacion = new Date();
  }
}

const laptop = new Producto('Laptop', 999, 50);
\`\`\`

### Metodos

\`\`\`javascript
class Calculadora {
  constructor() {
    this.historial = [];
  }

  sumar(a, b) {
    const resultado = a + b;
    this.historial.push(\`\${a} + \${b} = \${resultado}\`);
    return resultado;
  }

  restar(a, b) {
    const resultado = a - b;
    this.historial.push(\`\${a} - \${b} = \${resultado}\`);
    return resultado;
  }

  verHistorial() {
    return this.historial.join('\\n');
  }
}

const calc = new Calculadora();
calc.sumar(5, 3);   // 8
calc.restar(10, 4);  // 6
console.log(calc.verHistorial());
// "5 + 3 = 8"
// "10 - 4 = 6"
\`\`\`

### this en clases

La palabra clave \`this\` se refiere a la instancia actual del objeto.

\`\`\`javascript
class Contador {
  constructor() {
    this.cuenta = 0;
  }

  incrementar() {
    this.cuenta++;
    return this; // Permite encadenar metodos
  }

  obtenerValor() {
    return this.cuenta;
  }
}

const c = new Contador();
c.incrementar().incrementar().incrementar();
console.log(c.obtenerValor()); // 3
\`\`\``,
      order: 1,
    },
    {
      id: "js-20-leccion-02",
      title: "Herencia con extends y super",
      content: `## Herencia con extends y super

### Que es la herencia?

La herencia permite crear una clase **hija** que recibe todas las propiedades y metodos de una clase **padre**, y puede agregar o modificar comportamientos.

\`\`\`javascript
// Clase padre
class Animal {
  constructor(nombre, sonido) {
    this.nombre = nombre;
    this.sonido = sonido;
  }

  hablar() {
    return \`\${this.nombre} dice \${this.sonido}\`;
  }

  describir() {
    return \`Soy \${this.nombre}\`;
  }
}

// Clase hija
class Perro extends Animal {
  constructor(nombre, raza) {
    super(nombre, 'guau');  // Llama al constructor del padre
    this.raza = raza;       // Propiedad adicional
  }

  // Metodo nuevo (solo de Perro)
  buscarPelota() {
    return \`\${this.nombre} busca la pelota!\`;
  }
}

const rex = new Perro('Rex', 'Labrador');
rex.hablar();       // "Rex dice guau" (heredado)
rex.buscarPelota(); // "Rex busca la pelota!" (propio)
rex.raza;           // "Labrador"
\`\`\`

### super()

- **Obligatorio** en el constructor de la clase hija si hay constructor
- Debe llamarse **antes** de usar \`this\`
- Llama al constructor de la clase padre

### Sobrescribir metodos (Override)

\`\`\`javascript
class Gato extends Animal {
  constructor(nombre) {
    super(nombre, 'miau');
  }

  // Sobrescribir metodo del padre
  describir() {
    return \`Soy \${this.nombre}, un gato independiente\`;
  }
}

const luna = new Gato('Luna');
luna.describir(); // "Soy Luna, un gato independiente"
luna.hablar();    // "Luna dice miau"
\`\`\`

### Llamar al metodo padre con super

\`\`\`javascript
class Mascota extends Animal {
  constructor(nombre, sonido, dueno) {
    super(nombre, sonido);
    this.dueno = dueno;
  }

  describir() {
    // Reutilizar la logica del padre
    const base = super.describir();
    return \`\${base} y mi dueno es \${this.dueno}\`;
  }
}

const michi = new Mascota('Michi', 'miau', 'Ana');
michi.describir();
// "Soy Michi y mi dueno es Ana"
\`\`\`

### Cadena de herencia

\`\`\`javascript
class SerVivo {
  respirar() { return 'Respirando...'; }
}

class Animal2 extends SerVivo {
  moverse() { return 'Moviendose...'; }
}

class Perro2 extends Animal2 {
  ladrar() { return 'Guau!'; }
}

const fido = new Perro2();
fido.ladrar();   // "Guau!" (propio)
fido.moverse();  // "Moviendose..." (de Animal2)
fido.respirar(); // "Respirando..." (de SerVivo)
\`\`\`

> **Consejo:** No abuses de la herencia. Si tienes mas de 3 niveles, considera usar **composicion** en lugar de herencia.`,
      order: 2,
    },
    {
      id: "js-20-leccion-03",
      title: "Metodos y propiedades estaticas",
      content: `## Metodos y propiedades estaticas

### Que es static?

Los miembros **estaticos** pertenecen a la **clase misma**, no a las instancias. Se usan para funcionalidad utilitaria relacionada con la clase.

\`\`\`javascript
class Matematicas {
  static PI = 3.14159;

  static sumar(a, b) {
    return a + b;
  }

  static espar(num) {
    return num % 2 === 0;
  }

  static aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Se llaman directamente en la clase, NO en instancias
console.log(Matematicas.PI);         // 3.14159
console.log(Matematicas.sumar(2, 3)); // 5
console.log(Matematicas.espar(4));    // true

// Esto NO funciona:
// const m = new Matematicas();
// m.sumar(2, 3); // Error!
\`\`\`

### Patron fabrica con metodos estaticos

\`\`\`javascript
class Usuario {
  constructor(nombre, email, rol) {
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
    this.creadoEn = new Date();
  }

  // Fabricas: formas alternativas de crear instancias
  static crearAdmin(nombre, email) {
    return new Usuario(nombre, email, 'admin');
  }

  static crearInvitado() {
    return new Usuario('Invitado', 'invitado@temp.com', 'invitado');
  }

  static desdeJSON(json) {
    const datos = JSON.parse(json);
    return new Usuario(datos.nombre, datos.email, datos.rol);
  }
}

const admin = Usuario.crearAdmin('Ana', 'ana@mail.com');
const invitado = Usuario.crearInvitado();
\`\`\`

### Contador de instancias con static

\`\`\`javascript
class Producto {
  static contador = 0;

  constructor(nombre, precio) {
    Producto.contador++;
    this.id = Producto.contador;
    this.nombre = nombre;
    this.precio = precio;
  }

  static totalCreados() {
    return Producto.contador;
  }
}

new Producto('Laptop', 999);
new Producto('Mouse', 29);
new Producto('Teclado', 59);

console.log(Producto.totalCreados()); // 3
\`\`\`

### Getters y Setters

Permiten definir propiedades computadas con logica personalizada.

\`\`\`javascript
class Circulo {
  constructor(radio) {
    this._radio = radio;
  }

  // Getter: acceder como propiedad
  get area() {
    return Math.PI * this._radio ** 2;
  }

  get diametro() {
    return this._radio * 2;
  }

  // Setter: asignar con validacion
  set radio(valor) {
    if (valor <= 0) {
      throw new Error('El radio debe ser positivo');
    }
    this._radio = valor;
  }

  get radio() {
    return this._radio;
  }
}

const c = new Circulo(5);
console.log(c.area);      // 78.54 (se accede como propiedad, sin ())
console.log(c.diametro);  // 10

c.radio = 10;             // Usa el setter
// c.radio = -1;          // Error: El radio debe ser positivo
\`\`\`

> **Consejo:** Usa getters para propiedades calculadas y setters para validar datos antes de asignarlos.`,
      order: 3,
    },
    {
      id: "js-20-leccion-04",
      title: "Campos privados y encapsulacion",
      content: `## Campos privados y encapsulacion

### Que es encapsulacion?

La **encapsulacion** significa ocultar los detalles internos de un objeto y exponer solo lo necesario. Protege los datos de modificaciones accidentales.

### Campos privados con #

JavaScript soporta campos verdaderamente privados usando el prefijo \`#\`.

\`\`\`javascript
class CuentaBancaria {
  #saldo;        // Campo privado
  #historial;    // Campo privado

  constructor(titular, saldoInicial) {
    this.titular = titular;     // Publico
    this.#saldo = saldoInicial; // Privado
    this.#historial = [];       // Privado
  }

  // Metodo publico para depositar
  depositar(monto) {
    if (monto <= 0) throw new Error('Monto invalido');
    this.#saldo += monto;
    this.#registrar(\`Deposito: +\$\${monto}\`);
    return this;
  }

  // Metodo publico para retirar
  retirar(monto) {
    if (monto > this.#saldo) throw new Error('Fondos insuficientes');
    this.#saldo -= monto;
    this.#registrar(\`Retiro: -\$\${monto}\`);
    return this;
  }

  // Metodo privado
  #registrar(operacion) {
    this.#historial.push({
      operacion,
      fecha: new Date(),
      saldo: this.#saldo
    });
  }

  // Getters para acceder de forma controlada
  get saldo() {
    return this.#saldo;
  }

  get ultimasOperaciones() {
    return [...this.#historial].slice(-5);
  }
}

const cuenta = new CuentaBancaria('Ana', 1000);
cuenta.depositar(500).retirar(200);
console.log(cuenta.saldo);  // 1300

// Esto lanza error:
// cuenta.#saldo = 99999;   // SyntaxError
// cuenta.#registrar('hack'); // SyntaxError
\`\`\`

### Metodos privados

\`\`\`javascript
class Validador {
  #reglas;

  constructor() {
    this.#reglas = [];
  }

  agregarRegla(nombre, fn) {
    this.#reglas.push({ nombre, fn });
    return this;
  }

  // Metodo privado de utilidad
  #ejecutarReglas(valor) {
    return this.#reglas.map(regla => ({
      regla: regla.nombre,
      valido: regla.fn(valor)
    }));
  }

  validar(valor) {
    const resultados = this.#ejecutarReglas(valor);
    const errores = resultados.filter(r => !r.valido);
    return {
      valido: errores.length === 0,
      errores: errores.map(e => e.regla)
    };
  }
}

const v = new Validador();
v.agregarRegla('minimo 3 caracteres', val => val.length >= 3);
v.agregarRegla('sin espacios', val => !val.includes(' '));

console.log(v.validar('ab'));     // { valido: false, errores: ['minimo 3 caracteres'] }
console.log(v.validar('hola'));   // { valido: true, errores: [] }
\`\`\`

### Ejemplo completo: clase con encapsulacion

\`\`\`javascript
class Carrito {
  #items = [];
  #descuento = 0;

  agregar(producto, cantidad = 1) {
    const existente = this.#items.find(i => i.producto.id === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.#items.push({ producto, cantidad });
    }
  }

  aplicarDescuento(porcentaje) {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('Descuento invalido');
    }
    this.#descuento = porcentaje;
  }

  get subtotal() {
    return this.#items.reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad, 0
    );
  }

  get total() {
    return this.subtotal * (1 - this.#descuento / 100);
  }

  get cantidadItems() {
    return this.#items.reduce((sum, item) => sum + item.cantidad, 0);
  }
}
\`\`\`

> **Regla de oro:** Haz privado todo lo que puedas. Solo expone lo que el codigo externo realmente necesita.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-20-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que metodo especial se ejecuta automaticamente al crear una instancia con `new`?",
      options: [
        { id: "a", text: "init()", isCorrect: false },
        { id: "b", text: "constructor()", isCorrect: true },
        { id: "c", text: "create()", isCorrect: false },
        { id: "d", text: "new()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es un metodo especial que inicializa las propiedades del objeto.",
      explanation: "El metodo constructor() se ejecuta automaticamente cada vez que se crea una nueva instancia con 'new'. Inicializa las propiedades del objeto.",
    },
    {
      id: "js-20-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la clase Persona con un constructor y un metodo saludar:",
      codeTemplate: {
        html: "",
        cssPrefix: "class Persona {\n  ",
        cssSuffix: "\n\n  saludar() {\n    return `Hola, soy ${this.nombre}`;\n  }\n}\n\nconst p = new Persona('Ana', 25);",
        blanks: ["constructor(nombre, edad) { this.nombre = nombre; this.edad = edad; }"],
      },
      validation: { type: "includes", answer: ["constructor", "this.nombre", "this.edad"] },
      hint: "El constructor recibe los parametros y los asigna a this.",
      explanation: "El constructor recibe nombre y edad como parametros y los asigna como propiedades de la instancia usando this.",
    },
    {
      id: "js-20-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 3,
      prompt: "Para que sirve `super()` en el constructor de una clase hija?",
      options: [
        { id: "a", text: "Para crear una nueva instancia de la clase padre", isCorrect: false },
        { id: "b", text: "Para llamar al constructor de la clase padre e inicializar sus propiedades", isCorrect: true },
        { id: "c", text: "Para acceder a metodos privados del padre", isCorrect: false },
        { id: "d", text: "Es opcional y solo mejora el rendimiento", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "super() es obligatorio en clases hijas que tienen constructor.",
      explanation: "super() llama al constructor de la clase padre, asegurandose de que las propiedades heredadas se inicialicen correctamente. Es obligatorio antes de usar 'this'.",
    },
    {
      id: "js-20-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Completa la clase Estudiante que hereda de Persona:",
      codeTemplate: {
        html: "",
        cssPrefix: "class Persona {\n  constructor(nombre) { this.nombre = nombre; }\n  saludar() { return `Hola, soy ${this.nombre}`; }\n}\n\nclass Estudiante ",
        cssSuffix: " {\n  constructor(nombre, carrera) {\n    super(nombre);\n    this.carrera = carrera;\n  }\n}",
        blanks: ["extends Persona"],
      },
      validation: { type: "includes", answer: ["extends Persona"] },
      hint: "Usa la palabra clave extends para heredar de otra clase.",
      explanation: "La palabra clave extends indica que Estudiante hereda de Persona, recibiendo todos sus metodos y propiedades.",
    },
    {
      id: "js-20-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Como se accede a un metodo estatico de una clase?",
      options: [
        { id: "a", text: "Creando una instancia y llamando al metodo", isCorrect: false },
        { id: "b", text: "Directamente en la clase: NombreClase.metodo()", isCorrect: true },
        { id: "c", text: "Usando this.metodo() dentro de otro metodo", isCorrect: false },
        { id: "d", text: "Importandolo como funcion independiente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Los metodos estaticos pertenecen a la clase, no a las instancias.",
      explanation: "Los metodos estaticos se llaman directamente en la clase (ej: Math.random()) y no estan disponibles en las instancias.",
    },
    {
      id: "js-20-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt: "Crea un getter 'area' para la clase Rectangulo:",
      codeTemplate: {
        html: "",
        cssPrefix: "class Rectangulo {\n  constructor(ancho, alto) {\n    this.ancho = ancho;\n    this.alto = alto;\n  }\n\n  ",
        cssSuffix: "\n}\n\nconst r = new Rectangulo(5, 3);\nconsole.log(r.area); // 15",
        blanks: ["get area() { return this.ancho * this.alto; }"],
      },
      validation: { type: "includes", answer: ["get", "area", "this.ancho", "this.alto"] },
      hint: "Un getter se define con la palabra clave 'get' antes del nombre.",
      explanation: "El getter 'get area()' permite acceder a r.area como si fuera una propiedad normal, pero internamente ejecuta un calculo.",
    },
    {
      id: "js-20-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt: "Que sucede si intentas acceder a un campo privado (#) desde fuera de la clase?",
      options: [
        { id: "a", text: "Devuelve undefined", isCorrect: false },
        { id: "b", text: "Devuelve null", isCorrect: false },
        { id: "c", text: "Lanza un SyntaxError", isCorrect: true },
        { id: "d", text: "Funciona normalmente sin restricciones", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Los campos con # son verdaderamente privados en JavaScript.",
      explanation: "Los campos privados con # son inaccesibles fuera de la clase. Intentar acceder a ellos lanza un SyntaxError, a diferencia de la convencion _nombre que es solo visual.",
    },
    {
      id: "js-20-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt: "Completa la clase con un campo privado #saldo y un getter para acceder a el:",
      codeTemplate: {
        html: "",
        cssPrefix: "class CuentaBancaria {\n  ",
        cssSuffix: "\n\n  constructor(saldoInicial) {\n    this.#saldo = saldoInicial;\n  }\n\n  depositar(monto) {\n    this.#saldo += monto;\n  }\n\n  get saldo() {\n    return this.#saldo;\n  }\n}",
        blanks: ["#saldo"],
      },
      validation: { type: "includes", answer: ["#saldo"] },
      hint: "Los campos privados se declaran con # al inicio del cuerpo de la clase.",
      explanation: "Los campos privados se declaran con # fuera del constructor. Luego se inicializan en el constructor y solo son accesibles dentro de la clase.",
    },
  ],
};
