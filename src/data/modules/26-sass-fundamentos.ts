import type { ModuleData } from "@/types";

export const sassFundamentosModule: ModuleData = {
  slug: "sass-fundamentos",
  title: "Sass Fundamentos",
  description:
    "Aprende las bases del preprocesador CSS más popular: variables, nesting, mixins, funciones, partials y la organización de archivos con Sass/SCSS.",
  order: 26,
  dojo: "css" as const,
  category: "css-herramientas",
  icon: "paintbrush",
  lessons: [
    {
      id: "21-leccion-01",
      title: "¿Qué es Sass?",
      content: `## ¿Qué es Sass?

**Sass** (Syntactically Awesome Style Sheets) es un **preprocesador CSS** que extiende el lenguaje CSS con caracteristicas como variables, nesting, mixins, funciones y más. El código Sass se **compila** a CSS estándar que los navegadores pueden interpretar.

### ¿Por que usar Sass?

CSS es poderoso, pero a medida que los proyectos crecen, mantener hojas de estilo grandes se vuelve complejo. Sass resuelve esto ofreciendo:

- **Variables** para reutilizar valores (colores, fuentes, tamanios)
- **Nesting** para anidar selectores siguiendo la estructura HTML
- **Mixins** para reutilizar bloques de código
- **Funciones** para calcular valores dinamicamente
- **Partials** para dividir el CSS en archivos modulares
- **Herencia** para compartir estilos entre selectores

### SCSS vs Sass (sintaxis indentada)

Existen dos sintaxis:

\`\`\`scss
// SCSS (extension .scss) - La mas popular
// Usa llaves y punto y coma, similar a CSS
.contenedor {
  width: 100%;
  .titulo {
    color: #333;
    font-size: 1.5rem;
  }
}
\`\`\`

\`\`\`sass
// Sass indentado (extension .sass)
// Usa indentacion, sin llaves ni punto y coma
.contenedor
  width: 100%
  .titulo
    color: #333
    font-size: 1.5rem
\`\`\`

> **Recomendación:** SCSS es la sintaxis más usada porque cualquier CSS valido ya es SCSS valido, facilitando la migración.

### Compilación

El navegador **no entiende Sass**. Necesitas compilarlo a CSS:

\`\`\`bash
# Instalar Sass globalmente
npm install -g sass

# Compilar un archivo
sass estilos.scss estilos.css

# Compilar con observacion de cambios
sass --watch estilos.scss:estilos.css

# Compilar toda una carpeta
sass --watch scss/:css/
\`\`\`

También puedes usar herramientas como **Vite**, **Webpack** o **Parcel** que compilan Sass automáticamente en tu proyecto.

### CSS generado

\`\`\`scss
// SCSS que escribes
$color-primario: #3498db;

.boton {
  background: $color-primario;
  padding: 10px 20px;
  &:hover {
    background: darken($color-primario, 10%);
  }
}
\`\`\`

\`\`\`css
/* CSS que genera el compilador */
.boton {
  background: #3498db;
  padding: 10px 20px;
}
.boton:hover {
  background: #217dbb;
}
\`\`\`

> **Dato:** Sass fue creado en 2006 y sigue siendo el preprocesador más usado. Alternativas como Less y Stylus existen pero Sass domina el mercado.`,
      codeExample: {
        html: `<div class="sass-demo">\n  <h2>Sass se compila a CSS</h2>\n  <div class="comparacion">\n    <div class="bloque scss">\n      <h3>SCSS</h3>\n      <code>$color: #3498db;</code>\n      <code>.btn { background: $color; }</code>\n    </div>\n    <div class="flecha">→</div>\n    <div class="bloque css">\n      <h3>CSS</h3>\n      <code>.btn { background: #3498db; }</code>\n    </div>\n  </div>\n</div>`,
        css: `.sass-demo {\n  font-family: sans-serif;\n  color: #333;\n}\n.sass-demo h2 {\n  text-align: center;\n  margin-bottom: 20px;\n  color: #cf649a;\n}\n.comparacion {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 20px;\n}\n.bloque {\n  background: #1e1e2e;\n  padding: 20px;\n  border-radius: 10px;\n  color: #cdd6f4;\n}\n.bloque h3 {\n  margin-bottom: 10px;\n  color: #cf649a;\n}\n.bloque code {\n  display: block;\n  font-size: 0.85rem;\n  margin: 4px 0;\n}\n.flecha {\n  font-size: 2rem;\n  color: #cf649a;\n}`,
        editable: false,
      },
      order: 1,
    },
    {
      id: "21-leccion-02",
      title: "Variables y Nesting",
      content: `## Variables y Nesting

### Variables con $

Las variables en Sass se declaran con el signo \`$\` y permiten almacenar valores reutilizables:

\`\`\`scss
// Declarar variables
$color-primario: #3498db;
$color-secundario: #2ecc71;
$fuente-principal: 'Roboto', sans-serif;
$espaciado-base: 16px;
$radio-borde: 8px;

// Usar variables
.boton {
  background-color: $color-primario;
  font-family: $fuente-principal;
  padding: $espaciado-base;
  border-radius: $radio-borde;
}

.alerta {
  border-left: 4px solid $color-secundario;
  padding: $espaciado-base;
}
\`\`\`

### Scope de variables

Las variables declaradas dentro de un bloque son **locales**:

\`\`\`scss
$color: red; // Variable global

.componente {
  $color: blue; // Variable local, solo existe aqui
  color: $color; // blue
}

.otro {
  color: $color; // red (usa la global)
}
\`\`\`

### Nesting (anidamiento) de selectores

El nesting permite anidar selectores hijos dentro de sus padres, reflejando la estructura HTML:

\`\`\`scss
// SCSS
.navegacion {
  background: #333;
  padding: 10px;

  ul {
    list-style: none;
    display: flex;
    gap: 20px;
  }

  li {
    display: inline-block;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
}
\`\`\`

Esto genera:

\`\`\`css
.navegacion { background: #333; padding: 10px; }
.navegacion ul { list-style: none; display: flex; gap: 20px; }
.navegacion li { display: inline-block; }
.navegacion a { color: white; text-decoration: none; font-weight: bold; }
\`\`\`

### El selector padre &

El \`&\` referencia al selector padre actual. Es esencial para pseudo-clases, pseudo-elementos y modificadores:

\`\`\`scss
.boton {
  background: #3498db;
  color: white;
  transition: background 0.3s;

  // &:hover genera .boton:hover
  &:hover {
    background: #2980b9;
  }

  // &::before genera .boton::before
  &::before {
    content: '→ ';
  }

  // &.activo genera .boton.activo
  &.activo {
    background: #27ae60;
  }

  // &--grande genera .boton--grande (BEM)
  &--grande {
    padding: 16px 32px;
    font-size: 1.2rem;
  }
}
\`\`\`

### Nesting de propiedades

Sass permite anidar propiedades con el mismo prefijo:

\`\`\`scss
.texto {
  font: {
    family: Arial, sans-serif;
    size: 1.2rem;
    weight: bold;
  }
  // Genera: font-family, font-size, font-weight
}
\`\`\`

> **Cuidado:** No anides más de 3-4 niveles. El nesting excesivo genera selectores largos y especificidad innecesaria. Mantelo simple.`,
      codeExample: {
        html: `<nav class="nav-demo">\n  <ul>\n    <li><a href="#" class="activo">Inicio</a></li>\n    <li><a href="#">Cursos</a></li>\n    <li><a href="#">Blog</a></li>\n  </ul>\n</nav>`,
        css: `.nav-demo {\n  background: #2c3e50;\n  padding: 12px 20px;\n  border-radius: 10px;\n}\n.nav-demo ul {\n  list-style: none;\n  display: flex;\n  gap: 16px;\n  margin: 0;\n  padding: 0;\n}\n.nav-demo a {\n  color: #ecf0f1;\n  text-decoration: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  transition: background 0.3s;\n}\n.nav-demo a:hover {\n  background: rgba(255,255,255,0.1);\n}\n.nav-demo a.activo {\n  background: #3498db;\n  color: white;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "21-leccion-03",
      title: "Mixins y Funciones",
      content: `## Mixins y Funciones

### Mixins con @mixin y @include

Los mixins son bloques reutilizables de CSS. Los defines una vez y los incluyes donde quieras:

\`\`\`scss
// Definir un mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Usar el mixin
.contenedor {
  @include flex-center;
  height: 100vh;
}

.tarjeta {
  @include flex-center;
  gap: 10px;
}
\`\`\`

### Mixins con parámetros

Los mixins pueden recibir argumentos para ser más flexibles:

\`\`\`scss
@mixin boton($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.85;
  }
}

.btn-primario {
  @include boton(#3498db);
}

.btn-peligro {
  @include boton(#e74c3c);
}

.btn-claro {
  @include boton(#ecf0f1, #333);
}
\`\`\`

### Mixin para media queries

Uno de los usos más populares de mixins:

\`\`\`scss
@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 576px) { @content; }
  } @else if $breakpoint == tablet {
    @media (max-width: 768px) { @content; }
  } @else if $breakpoint == desktop {
    @media (max-width: 1024px) { @content; }
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @include responsive(tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include responsive(mobile) {
    grid-template-columns: 1fr;
  }
}
\`\`\`

### Funciones con @function

Las funciones calculan y **retornan un valor**. A diferencia de los mixins (que generan bloques CSS), las funciones devuelven un solo valor:

\`\`\`scss
@function rem($px) {
  @return calc($px / 16) * 1rem;
}

@function color-opaco($color, $opacidad: 0.5) {
  @return rgba($color, $opacidad);
}

.titulo {
  font-size: rem(24);        // 1.5rem
  margin-bottom: rem(16);    // 1rem
  color: color-opaco(#3498db, 0.8);
}
\`\`\`

### Funciones incorporadas de Sass

Sass incluye muchas funciones útiles:

\`\`\`scss
$color: #3498db;

// Funciones de color
color.adjust($color, $lightness: -10%);  // Oscurecer
color.adjust($color, $lightness: 10%);   // Aclarar
mix($color, white, 70%);                 // Mezclar con blanco
complement($color);                      // Color complementario

// Funciones de cadenas
to-upper-case("hola");  // "HOLA"
str-length("sass");     // 4

// Funciones numericas
percentage(0.5);  // 50%
round(4.6);       // 5
ceil(4.1);        // 5
floor(4.9);       // 4
\`\`\`

> **Regla general:** Usa **mixins** cuando necesitas generar múltiples declaraciones CSS. Usa **funciones** cuando necesitas calcular y retornar un solo valor.`,
      codeExample: {
        html: `<div class="mixin-demo">\n  <button class="btn-p">Primario</button>\n  <button class="btn-s">Secundario</button>\n  <button class="btn-d">Peligro</button>\n</div>`,
        css: `.mixin-demo {\n  display: flex;\n  gap: 12px;\n  padding: 20px;\n}\n\n.mixin-demo button {\n  padding: 10px 24px;\n  border: none;\n  border-radius: 8px;\n  color: white;\n  font-weight: bold;\n  cursor: pointer;\n  transition: opacity 0.3s, transform 0.2s;\n}\n.mixin-demo button:hover {\n  opacity: 0.85;\n  transform: translateY(-2px);\n}\n.btn-p { background: #3498db; }\n.btn-s { background: #2ecc71; }\n.btn-d { background: #e74c3c; }`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "21-leccion-04",
      title: "Partials e Imports",
      content: `## Partials e Imports

### Archivos parciales (Partials)

Los partials son archivos Sass que empiezan con guion bajo \`_\` y contienen fragmentos de CSS. No se compilan por separado; se importan en otros archivos:

\`\`\`
scss/
  _variables.scss     ← Partial (no genera CSS propio)
  _mixins.scss        ← Partial
  _botones.scss       ← Partial
  estilos.scss        ← Archivo principal (se compila a estilos.css)
\`\`\`

### @use (moderno, recomendado)

\`@use\` carga un partial como un **modulo con namespace**:

\`\`\`scss
// _variables.scss
$color-primario: #3498db;
$color-texto: #333;

// _mixins.scss
@use 'variables' as vars;

@mixin boton-primario {
  background: vars.$color-primario;
  color: white;
}
\`\`\`

\`\`\`scss
// estilos.scss
@use 'variables' as v;
@use 'mixins' as m;

.boton {
  @include m.boton-primario;
  padding: 12px 24px;
}

body {
  color: v.$color-texto;
}
\`\`\`

### @forward

\`@forward\` permite que un archivo reexporte los miembros de otro. Ideal para crear archivos "índice":

\`\`\`scss
// abstracts/_index.scss
@forward 'variables';
@forward 'mixins';
@forward 'funciones';

// estilos.scss - Importa todo desde un solo lugar
@use 'abstracts' as *;
\`\`\`

### Patrón de organización tipico

\`\`\`
scss/
  abstracts/
    _variables.scss    // Variables globales
    _mixins.scss       // Mixins reutilizables
    _funciones.scss    // Funciones personalizadas
    _index.scss        // @forward de todo
  base/
    _reset.scss        // Reset/Normalize
    _tipografia.scss   // Estilos base de texto
    _index.scss
  componentes/
    _boton.scss        // Estilos del boton
    _tarjeta.scss      // Estilos de tarjeta
    _navegacion.scss   // Navbar
    _index.scss
  layout/
    _header.scss
    _footer.scss
    _grid.scss
    _index.scss
  paginas/
    _inicio.scss
    _contacto.scss
    _index.scss
  main.scss            // Archivo raiz que importa todo
\`\`\`

\`\`\`scss
// main.scss
@use 'abstracts';
@use 'base';
@use 'layout';
@use 'componentes';
@use 'paginas';
\`\`\`

### @import (deprecado)

\`@import\` fue la forma original pero está siendo reemplazado por \`@use\`:

\`\`\`scss
// EVITAR - Forma antigua
@import 'variables';
@import 'mixins';

// USAR - Forma moderna
@use 'variables';
@use 'mixins';
\`\`\`

Diferencias clave:
| @import | @use |
|---------|------|
| Todo es global | Usa namespaces |
| Puede duplicar código | Carga cada archivo una sola vez |
| Deprecado | Recomendado |

> **Consejo:** Siempre usa \`@use\` y \`@forward\` en proyectos nuevos. \`@import\` sera eliminado en futuras versiones de Sass.`,
      codeExample: {
        html: `<div class="partials-demo">\n  <div class="estructura">\n    <div class="carpeta">scss/</div>\n    <div class="archivo partial">  _variables.scss</div>\n    <div class="archivo partial">  _mixins.scss</div>\n    <div class="archivo partial">  _botones.scss</div>\n    <div class="archivo main">  main.scss</div>\n    <div class="resultado">→ main.css</div>\n  </div>\n</div>`,
        css: `.partials-demo {\n  font-family: 'Courier New', monospace;\n  background: #1e1e2e;\n  padding: 20px;\n  border-radius: 12px;\n}\n.estructura {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.carpeta {\n  color: #f9e2af;\n  font-weight: bold;\n  font-size: 1.1rem;\n}\n.archivo {\n  color: #cdd6f4;\n  padding: 4px 8px;\n  border-radius: 4px;\n}\n.archivo.partial {\n  color: #a6adc8;\n}\n.archivo.main {\n  color: #89b4fa;\n  font-weight: bold;\n}\n.resultado {\n  color: #a6e3a1;\n  font-weight: bold;\n  margin-top: 8px;\n  padding-top: 8px;\n  border-top: 1px dashed #45475a;\n}`,
        editable: false,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "21-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué es Sass?",
      options: [
        { id: "a", text: "Un lenguaje de programación independiente de CSS", isCorrect: false },
        { id: "b", text: "Un preprocesador que extiende CSS y se compila a CSS estándar", isCorrect: true },
        { id: "c", text: "Una libreria JavaScript para animar CSS", isCorrect: false },
        { id: "d", text: "Un framework CSS como Bootstrap", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Sass agrega funcionalidades a CSS pero necesita un paso de compilación.",
      explanation:
        "Sass es un preprocesador CSS que extiende el lenguaje con variables, nesting, mixins y más. El código Sass se compila a CSS estándar que los navegadores pueden interpretar.",
    },
    {
      id: "21-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "¿Cuál es la diferencia principal entre la sintaxis SCSS y Sass indentado?",
      options: [
        { id: "a", text: "SCSS usa llaves y punto y coma; Sass indentado usa indentación sin llaves", isCorrect: true },
        { id: "b", text: "Sass indentado es más nuevo que SCSS", isCorrect: false },
        { id: "c", text: "SCSS no soporta variables, solo Sass indentado", isCorrect: false },
        { id: "d", text: "No hay diferencia, son exactamente iguales", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Piensa en cómo se delimitan los bloques de código en cada sintaxis.",
      explanation:
        "SCSS (.scss) usa llaves {} y punto y coma ;, similar a CSS normal. Sass indentado (.sass) elimina llaves y punto y coma, usando indentación para definir la estructura. SCSS es la sintaxis más popular.",
    },
    {
      id: "21-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt:
        "Completa la declaración de la variable Sass para definir un color primario. Recuerda que las variables Sass usan un simbolo especial:",
      codeTemplate: {
        html: `<!-- SCSS -->\n<!-- Declaracion de variable Sass -->`,
        cssPrefix: "",
        cssSuffix: "color-primario: #3498db;\n\n.boton {\n  background: $color-primario;\n}",
        blanks: ["$"],
      },
      validation: { type: "exact", answer: "$" },
      hint: "Las variables en Sass empiezan con un simbolo de dolar.",
      explanation:
        "En Sass, las variables se declaran con el signo $ seguido del nombre: $color-primario: #3498db;. Luego se usan con el mismo prefijo $.",
    },
    {
      id: "21-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Completa el selector padre de Sass para generar '.botón:hover':",
      codeTemplate: {
        html: `<!-- SCSS -->`,
        cssPrefix: ".boton {\n  background: #3498db;\n  color: white;\n\n  ",
        cssSuffix: ":hover {\n    background: #2980b9;\n  }\n}",
        blanks: ["&"],
      },
      validation: { type: "exact", answer: "&" },
      hint: "Es un simbolo que referencia al selector padre actual en Sass.",
      explanation:
        "El simbolo & en Sass referencia al selector padre. Dentro de .botón, &:hover se compila a .botón:hover. Es fundamental para pseudo-clases, pseudo-elementos y variaciones BEM.",
    },
    {
      id: "21-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "¿Cuál es la diferencia entre un @mixin y una @function en Sass?",
      options: [
        { id: "a", text: "No hay diferencia, son sinonimos", isCorrect: false },
        { id: "b", text: "Los mixins generan bloques de CSS; las funciones retornan un solo valor", isCorrect: true },
        { id: "c", text: "Las funciones son más rápidas que los mixins", isCorrect: false },
        { id: "d", text: "Los mixins solo funcionan con colores", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que produce cada uno: un mixin genera declaraciones CSS, una función calcula algo.",
      explanation:
        "Los @mixin generan bloques completos de declaraciones CSS y se usan con @include. Las @function calculan y retornan un solo valor con @return, y se usan como valor de una propiedad.",
    },
    {
      id: "21-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Completa la directiva para incluir (usar) un mixin llamado 'flex-center' dentro de un selector:",
      codeTemplate: {
        html: `<!-- SCSS -->`,
        cssPrefix: "@mixin flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.contenedor {\n  ",
        cssSuffix: " flex-center;\n  height: 100vh;\n}",
        blanks: ["@include"],
      },
      validation: { type: "exact", answer: "@include" },
      hint: "Los mixins se definen con @mixin y se usan con otra directiva que empieza con @.",
      explanation:
        "Para usar un mixin se usa la directiva @include seguida del nombre del mixin. En este caso, @include flex-center; inserta las declaraciones display: flex, justify-content: center y align-items: center.",
    },
    {
      id: "21-ej-07",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 7,
      prompt:
        "Arrastra cada caracteristica de Sass a su descripción correcta:",
      dragItems: [
        { id: "drag-1", content: "$variable", correctZone: "zone-var" },
        { id: "drag-2", content: "@mixin / @include", correctZone: "zone-mixin" },
        { id: "drag-3", content: "& (ampersand)", correctZone: "zone-parent" },
        { id: "drag-4", content: "_partial.scss", correctZone: "zone-partial" },
      ],
      dropZones: [
        { id: "zone-var", label: "Almacena valores reutilizables como colores o tamanios" },
        { id: "zone-mixin", label: "Bloque reutilizable de declaraciones CSS" },
        { id: "zone-parent", label: "Referencia al selector padre en nesting" },
        { id: "zone-partial", label: "Archivo que se importa pero no genera CSS propio" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-var",
          "drag-2": "zone-mixin",
          "drag-3": "zone-parent",
          "drag-4": "zone-partial",
        },
      },
      hint: "Las variables almacenan valores, los mixins son bloques reutilizables, & es el padre, y los partials empiezan con _.",
      explanation:
        "Las variables ($) almacenan valores reutilizables. Los mixins (@mixin/@include) son bloques de CSS reutilizables. El & referencia al selector padre para pseudo-clases y variantes. Los partials (_archivo.scss) son fragmentos que se importan sin generar CSS propio.",
    },
    {
      id: "21-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "En Sass moderno, ¿cuál es la forma recomendada de importar archivos parciales?",
      options: [
        { id: "a", text: "@import 'variables';", isCorrect: false },
        { id: "b", text: "@use 'variables';", isCorrect: true },
        { id: "c", text: "require('variables');", isCorrect: false },
        { id: "d", text: "@load 'variables';", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "La directiva moderna usa namespaces y carga cada archivo una sola vez.",
      explanation:
        "@use es la forma moderna y recomendada de importar partials en Sass. A diferencia de @import (deprecado), @use crea namespaces, evita duplicación de código y carga cada archivo una sola vez.",
    },
    {
      id: "21-ej-09",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 9,
      prompt:
        "Este Sass usa nesting y el selector padre. Escribí el CSS que produce al compilar:\n\n.tarjeta {\n  padding: 16px;\n  .titulo { font-size: 20px; }\n  &:hover { background-color: whitesmoke; }\n}\n\nSon tres reglas planas: .tarjeta, .tarjeta .titulo y .tarjeta:hover.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <h3 class="titulo">Pasá el mouse por encima</h3>\n  <p>El nesting no existe en CSS: el navegador solo ve reglas planas.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  padding: 16px;\n}\n.tarjeta .titulo {\n  font-size: 20px;\n}\n.tarjeta:hover {\n  background-color: whitesmoke;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "El nesting concatena con un espacio: .tarjeta más .titulo da '.tarjeta .titulo'. El & se reemplaza por el selector padre SIN espacio, así que &:hover da '.tarjeta:hover'.",
      explanation:
        "Sass no agrega nada al navegador: todo el nesting se aplana al compilar. El anidamiento normal inserta un espacio (selector descendiente), mientras que & pega el selector padre sin espacio, que es la única forma de generar .tarjeta:hover. Entender esta traducción es lo que evita anidar seis niveles y producir selectores imposibles de sobrescribir.",
    },
    {
      id: "21-ej-10",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 10,
      prompt:
        "Este Sass combina variables y un mixin. Escribí el CSS compilado:\n\n$azul: #3498db;\n$radio: 6px;\n\n@mixin btn($fondo) {\n  background-color: $fondo;\n  border-radius: $radio;\n  padding: 10px 20px;\n}\n\n.btn-primario { @include btn($azul); color: white; }\n\nOjo: las variables desaparecen y el mixin se expande donde se lo incluye.",
      codeTemplate: {
        html: `<button class="btn-primario">Enviar</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".btn-primario {\n  background-color: #3498db;\n  border-radius: 6px;\n  padding: 10px 20px;\n  color: white;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "El mixin aporta tres declaraciones y la regla agrega una cuarta. Las variables se reemplazan por su valor: $azul es #3498db y $radio es 6px.",
      explanation:
        "En el CSS compilado no queda rastro de $azul, $radio ni del mixin: quedan las cuatro declaraciones dentro de una sola regla. Por eso un mixin incluido en veinte lugares duplica su contenido veinte veces en el archivo final -- es la diferencia con @extend, que agrupa selectores en lugar de copiar declaraciones.",
    },
    {
      id: "21-ej-11",
      type: "visual-match",
      difficulty: 3,
      xpReward: 25,
      order: 11,
      prompt:
        "El objetivo es lo que produce este Sass al compilar. Reproducilo escribiendo el CSS plano:\n\n$borde: #e74c3c;\n\n.aviso {\n  border-left: 4px solid $borde;\n  padding: 12px;\n  background-color: #fdf2f0;\n  .titulo { color: $borde; font-weight: bold; }\n}",
      codeTemplate: {
        html: `<div class="aviso">\n  <p class="titulo">Atención</p>\n  <p>El nesting se aplana y la variable se reemplaza por su valor.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".aviso {\n  border-left: 4px solid #e74c3c;\n  padding: 12px;\n  background-color: #fdf2f0;\n}\n.aviso .titulo {\n  color: #e74c3c;\n  font-weight: bold;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Dos reglas: .aviso con tres declaraciones y .aviso .titulo con dos. La misma variable $borde aparece en dos lugares distintos, y en el CSS compilado queda el valor repetido.",
      explanation:
        "Acá se ve la ventaja concreta de una variable: el color aparece dos veces en el CSS final, pero en el Sass se escribe una sola vez. Cambiar $borde cambia el borde y el título a la vez, lo que en CSS plano exigiría dos ediciones y la posibilidad de olvidarse una.",
    },
  ],
};
