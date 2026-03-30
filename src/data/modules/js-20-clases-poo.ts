import type { ModuleData } from "@/types";

export const jsClasesPooModule: ModuleData = {
  slug: "js-clases-poo",
  title: "Clases y POO",
  description:
    "Aprende programacion orientada a objetos en JavaScript: clases, herencia, encapsulamiento y polimorfismo.",
  order: 120,
  category: "js-advanced",
  icon: "Boxes",
  dojo: "js",
  lessons: [
    {
      id: "js20-leccion-01",
      title: "Clases en JavaScript",
      content: `## Clases

Las clases son "plantillas" para crear objetos con propiedades y metodos compartidos.

### Sintaxis
\`\`\`javascript
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
  }

  saludar() {
    return "Hola, soy " + this.nombre;
  }

  cumplirAnos() {
    this.edad++;
  }
}
\`\`\`

### Crear instancias
\`\`\`javascript
const ana = new Persona("Ana", 25);
ana.saludar();     // "Hola, soy Ana"
ana.cumplirAnos(); // ana.edad = 26
\`\`\`

### El constructor
- Se ejecuta automaticamente al crear una instancia con \`new\`
- Inicializa las propiedades del objeto
- \`this\` se refiere a la instancia actual

### Metodos
- Se definen sin la palabra \`function\`
- Se comparten entre todas las instancias
- Acceden a las propiedades con \`this\`

> Las clases en JavaScript son "azucar sintactica" sobre los prototipos. Internamente siguen usando el sistema de prototipos.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #a6e3a1; border-radius: 8px; white-space: pre-line; }',
        js: `function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}

Persona.prototype.saludar = function() {
  return "Hola, soy " + this.nombre + " y tengo " + this.edad + " anos";
};

Persona.prototype.cumplirAnos = function() {
  this.edad++;
  return this.nombre + " ahora tiene " + this.edad + " anos";
};

var ana = new Persona("Ana", 25);
var luis = new Persona("Luis", 30);

var salida = [];
salida.push(ana.saludar());
salida.push(luis.saludar());
salida.push(ana.cumplirAnos());
salida.push("Ana y Luis son Persona: " + (ana instanceof Persona) + ", " + (luis instanceof Persona));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js20-leccion-02",
      title: "Herencia",
      content: `## Herencia con extends

Una clase puede **heredar** de otra usando \`extends\`:

\`\`\`javascript
class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }
  hablar() {
    return this.nombre + " hace un sonido";
  }
}

class Perro extends Animal {
  constructor(nombre, raza) {
    super(nombre); // llama al constructor padre
    this.raza = raza;
  }
  hablar() {
    return this.nombre + " ladra: Guau!";
  }
}
\`\`\`

### super
- \`super()\` llama al constructor de la clase padre
- \`super.metodo()\` llama a un metodo del padre
- **Obligatorio** llamar \`super()\` antes de usar \`this\` en el constructor hijo

### instanceof
\`\`\`javascript
const rex = new Perro("Rex", "Pastor");
rex instanceof Perro;   // true
rex instanceof Animal;  // true
\`\`\`

> **Principio:** Prefiere la composicion sobre la herencia cuando sea posible. No crees jerarquias de mas de 2-3 niveles.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #89b4fa; border-radius: 8px; white-space: pre-line; }',
        js: `function Animal(nombre) {
  this.nombre = nombre;
}
Animal.prototype.hablar = function() {
  return this.nombre + " hace un sonido";
};

function Perro(nombre, raza) {
  Animal.call(this, nombre);
  this.raza = raza;
}
Perro.prototype = Object.create(Animal.prototype);
Perro.prototype.constructor = Perro;
Perro.prototype.hablar = function() {
  return this.nombre + " (" + this.raza + ") ladra: Guau!";
};

function Gato(nombre, color) {
  Animal.call(this, nombre);
  this.color = color;
}
Gato.prototype = Object.create(Animal.prototype);
Gato.prototype.constructor = Gato;
Gato.prototype.hablar = function() {
  return this.nombre + " (" + this.color + ") maulla: Miau!";
};

var rex = new Perro("Rex", "Pastor Aleman");
var michi = new Gato("Michi", "naranja");
var generico = new Animal("Criatura");

var salida = [];
salida.push(generico.hablar());
salida.push(rex.hablar());
salida.push(michi.hablar());
salida.push("rex es Perro: " + (rex instanceof Perro));
salida.push("rex es Animal: " + (rex instanceof Animal));

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js20-leccion-03",
      title: "Getters, setters y metodos estaticos",
      content: `## Getters y Setters

Permiten definir propiedades "computadas":

\`\`\`javascript
class Rectangulo {
  constructor(ancho, alto) {
    this.ancho = ancho;
    this.alto = alto;
  }
  get area() {
    return this.ancho * this.alto;
  }
  set dimensiones(valor) {
    [this.ancho, this.alto] = valor.split("x").map(Number);
  }
}
const r = new Rectangulo(5, 3);
r.area;              // 15 (se accede como propiedad, no metodo)
r.dimensiones = "10x4"; // setter
\`\`\`

## Metodos estaticos

Pertenecen a la **clase**, no a las instancias:

\`\`\`javascript
class MathHelper {
  static sumar(a, b) { return a + b; }
  static PI = 3.14159;
}
MathHelper.sumar(3, 5); // 8
MathHelper.PI;           // 3.14159
\`\`\`

## Propiedades privadas (#)

\`\`\`javascript
class CuentaBancaria {
  #saldo = 0;
  depositar(monto) { this.#saldo += monto; }
  get saldo() { return this.#saldo; }
}
\`\`\`

> Los campos privados con # son una caracteristica moderna. Solo la propia clase puede acceder a ellos.`,
      codeExample: {
        html: '<div id="resultado"></div>',
        css: '#resultado { font-family: monospace; padding: 16px; background: #1e1e2e; color: #f5c2e7; border-radius: 8px; white-space: pre-line; }',
        js: `// Simulando getters/setters y metodos estaticos
function Rectangulo(ancho, alto) {
  this.ancho = ancho;
  this.alto = alto;
}

Rectangulo.prototype.getArea = function() {
  return this.ancho * this.alto;
};

Rectangulo.prototype.getPerimetro = function() {
  return 2 * (this.ancho + this.alto);
};

Rectangulo.prototype.toString = function() {
  return this.ancho + "x" + this.alto;
};

// Metodo estatico
Rectangulo.crearCuadrado = function(lado) {
  return new Rectangulo(lado, lado);
};

var rect = new Rectangulo(10, 5);
var cuadrado = Rectangulo.crearCuadrado(7);

var salida = [];
salida.push("Rectangulo: " + rect.toString());
salida.push("  Area: " + rect.getArea());
salida.push("  Perimetro: " + rect.getPerimetro());
salida.push("Cuadrado: " + cuadrado.toString());
salida.push("  Area: " + cuadrado.getArea());

document.getElementById("resultado").textContent = salida.join("\\n");`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js20-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que palabra clave se usa para crear una instancia de una clase?",
      options: [
        { id: "a", text: "create", isCorrect: false },
        { id: "b", text: "new", isCorrect: true },
        { id: "c", text: "instance", isCorrect: false },
        { id: "d", text: "make", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "new = nuevo.",
      explanation: "La palabra clave new crea una nueva instancia de una clase, ejecutando su constructor.",
    },
    {
      id: "js20-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Que metodo se ejecuta automaticamente al crear una instancia con new?",
      options: [
        { id: "a", text: "init()", isCorrect: false },
        { id: "b", text: "create()", isCorrect: false },
        { id: "c", text: "constructor()", isCorrect: true },
        { id: "d", text: "build()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Su nombre indica que 'construye' el objeto.",
      explanation: "El metodo constructor() se ejecuta automaticamente cada vez que se crea una nueva instancia con new.",
    },
    {
      id: "js20-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que hace super() en el constructor de una clase hija?",
      options: [
        { id: "a", text: "Crea una nueva instancia del padre", isCorrect: false },
        { id: "b", text: "Llama al constructor de la clase padre", isCorrect: true },
        { id: "c", text: "Elimina la clase padre", isCorrect: false },
        { id: "d", text: "Define un metodo estatico", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "super hace referencia a la clase padre.",
      explanation: "super() llama al constructor de la clase padre, permitiendo inicializar las propiedades heredadas.",
    },
    {
      id: "js20-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "Que palabra clave se usa para heredar de otra clase?",
      options: [
        { id: "a", text: "inherits", isCorrect: false },
        { id: "b", text: "extends", isCorrect: true },
        { id: "c", text: "implements", isCorrect: false },
        { id: "d", text: "derives", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "extends = extiende.",
      explanation: "class Hijo extends Padre establece la herencia. La clase hija hereda propiedades y metodos del padre.",
    },
    {
      id: "js20-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 5,
      prompt: "Que son los metodos estaticos?",
      options: [
        { id: "a", text: "Metodos que no se pueden modificar", isCorrect: false },
        { id: "b", text: "Metodos que pertenecen a la clase, no a las instancias", isCorrect: true },
        { id: "c", text: "Metodos que se ejecutan automaticamente", isCorrect: false },
        { id: "d", text: "Metodos privados", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se llaman directamente en la clase: Clase.metodo().",
      explanation: "Los metodos estaticos pertenecen a la clase misma y se invocan sin crear una instancia: Clase.metodo().",
    },
    {
      id: "js20-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt: "Completa para que la clase Perro herede de Animal:",
      codeTemplate: {
        html: "",
        cssPrefix: "class Perro ",
        cssSuffix: " Animal { }",
        blanks: ["extends"],
      },
      validation: { type: "exact", answer: "extends" },
      hint: "La palabra clave para herencia de clases.",
      explanation: "class Perro extends Animal establece que Perro hereda de Animal.",
    },
  ],
};
