import type { ModuleData } from "@/types";

export const sassAvanzadoModule: ModuleData = {
  slug: "sass-avanzado",
  title: "Sass Avanzado",
  description:
    "Lleva tu Sass al siguiente nivel con herencia, condicionales, bucles, mapas, listas y patrones de arquitectura profesional como el patron 7-1 y BEM.",
  order: 22,
  dojo: "css" as const,
  category: "preprocessors",
  icon: "paintbrush",
  lessons: [
    {
      id: "22-leccion-01",
      title: "Herencia con @extend",
      content: `## Herencia con @extend

### Que es @extend?

\`@extend\` permite que un selector **herede** todos los estilos de otro selector. Es util cuando varios elementos comparten una base comun:

\`\`\`scss
.mensaje {
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 500;
}

.mensaje-exito {
  @extend .mensaje;
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.mensaje-error {
  @extend .mensaje;
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.mensaje-info {
  @extend .mensaje;
  background: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}
\`\`\`

CSS generado:

\`\`\`css
.mensaje, .mensaje-exito, .mensaje-error, .mensaje-info {
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 500;
}

.mensaje-exito {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}
/* ... etc */
\`\`\`

### Placeholder selectors con %

Los placeholders son selectores que **solo existen para ser extendidos**. No generan CSS por si mismos:

\`\`\`scss
// El % indica que es un placeholder
%boton-base {
  display: inline-block;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primario {
  @extend %boton-base;
  background: #3498db;
  color: white;
}

.btn-secundario {
  @extend %boton-base;
  background: #95a5a6;
  color: white;
}
\`\`\`

> **Ventaja de %:** Si nadie hace @extend del placeholder, no se genera ningun CSS. Con clases normales (.mensaje), siempre se genera el CSS base aunque nadie lo use.

### Cuando usar @extend vs @mixin

| Caracteristica | @extend | @mixin |
|---------------|---------|--------|
| Parametros | No acepta | Si acepta |
| CSS generado | Agrupa selectores (menos codigo) | Duplica declaraciones |
| Dentro de media queries | No funciona bien | Funciona perfectamente |
| Uso ideal | Estilos identicos sin variacion | Estilos con parametros variables |

\`\`\`scss
// MEJOR con @extend: estilos identicos
%visualmente-oculto {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

// MEJOR con @mixin: necesitas parametros
@mixin sombra($nivel: 1) {
  @if $nivel == 1 {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  } @else if $nivel == 2 {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  } @else {
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
  }
}
\`\`\`

> **Regla practica:** Si necesitas parametros, usa @mixin. Si todos los selectores comparten exactamente los mismos estilos base, usa @extend con %.`,
      codeExample: {
        html: `<div class="extend-demo">\n  <div class="msg msg-exito">Operacion exitosa</div>\n  <div class="msg msg-error">Ha ocurrido un error</div>\n  <div class="msg msg-info">Informacion importante</div>\n</div>`,
        css: `.extend-demo {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 16px;\n}\n\n.msg {\n  padding: 12px 20px;\n  border-radius: 8px;\n  border: 1px solid transparent;\n  font-weight: 500;\n}\n\n.msg-exito {\n  background: #d4edda;\n  border-color: #c3e6cb;\n  color: #155724;\n}\n\n.msg-error {\n  background: #f8d7da;\n  border-color: #f5c6cb;\n  color: #721c24;\n}\n\n.msg-info {\n  background: #d1ecf1;\n  border-color: #bee5eb;\n  color: #0c5460;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "22-leccion-02",
      title: "Condicionales y Bucles",
      content: `## Condicionales y Bucles

### Condicionales con @if / @else

Sass permite logica condicional dentro de los estilos:

\`\`\`scss
@mixin tema($modo) {
  @if $modo == 'oscuro' {
    background: #1a1a2e;
    color: #ecf0f1;
  } @else if $modo == 'claro' {
    background: #ffffff;
    color: #333333;
  } @else {
    background: #f5f5f5;
    color: #555555;
  }
}

.pagina-oscura {
  @include tema('oscuro');
}

.pagina-clara {
  @include tema('claro');
}
\`\`\`

### Bucle @for

Genera CSS repetitivo con un contador:

\`\`\`scss
// @for $i from 1 through 5 -> incluye el 5
// @for $i from 1 to 5 -> NO incluye el 5

@for $i from 1 through 5 {
  .col-#{$i} {
    width: percentage($i / 12);
  }
}

// Genera:
// .col-1 { width: 8.33333%; }
// .col-2 { width: 16.66667%; }
// .col-3 { width: 25%; }
// .col-4 { width: 33.33333%; }
// .col-5 { width: 41.66667%; }
\`\`\`

### Bucle @each

Itera sobre una lista o mapa:

\`\`\`scss
// Iterar sobre una lista
$tamanios: small, medium, large;

@each $tamanio in $tamanios {
  .texto-#{$tamanio} {
    @if $tamanio == small { font-size: 0.875rem; }
    @else if $tamanio == medium { font-size: 1rem; }
    @else { font-size: 1.25rem; }
  }
}

// Iterar sobre un mapa
$colores-sociales: (
  'facebook': #1877f2,
  'twitter': #1da1f2,
  'instagram': #e4405f,
  'whatsapp': #25d366,
);

@each $red, $color in $colores-sociales {
  .btn-#{$red} {
    background-color: $color;
    color: white;

    &:hover {
      background-color: darken($color, 10%);
    }
  }
}
\`\`\`

### Bucle @while

Repite mientras una condicion sea verdadera (menos usado):

\`\`\`scss
$columnas: 12;
$i: 1;

@while $i <= $columnas {
  .grid-#{$i} {
    width: percentage($i / $columnas);
  }
  $i: $i + 1;
}
\`\`\`

### Generacion de clases utilitarias

Los bucles son perfectos para generar clases utilitarias al estilo de Tailwind o Bootstrap:

\`\`\`scss
// Spacing utilities
$espaciados: (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16);

@each $valor in $espaciados {
  .m-#{$valor} { margin: #{$valor * 4}px; }
  .mt-#{$valor} { margin-top: #{$valor * 4}px; }
  .mb-#{$valor} { margin-bottom: #{$valor * 4}px; }
  .p-#{$valor} { padding: #{$valor * 4}px; }
  .pt-#{$valor} { padding-top: #{$valor * 4}px; }
  .pb-#{$valor} { padding-bottom: #{$valor * 4}px; }
}
\`\`\`

> **Nota:** \`#{}\` es la interpolacion de Sass. Permite insertar variables dentro de selectores, nombres de propiedades y valores de cadena.`,
      codeExample: {
        html: `<div class="bucles-demo">\n  <div class="barra" style="--ancho: 8.33%">1/12</div>\n  <div class="barra" style="--ancho: 25%">3/12</div>\n  <div class="barra" style="--ancho: 50%">6/12</div>\n  <div class="barra" style="--ancho: 75%">9/12</div>\n  <div class="barra" style="--ancho: 100%">12/12</div>\n</div>`,
        css: `.bucles-demo {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 16px;\n}\n\n.barra {\n  width: var(--ancho);\n  background: linear-gradient(90deg, #3498db, #8e44ad);\n  color: white;\n  padding: 8px 12px;\n  border-radius: 6px;\n  font-size: 0.85rem;\n  font-weight: bold;\n  transition: width 0.3s;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "22-leccion-03",
      title: "Mapas y Listas",
      content: `## Mapas y Listas

### Listas

Las listas en Sass son secuencias de valores separados por comas o espacios:

\`\`\`scss
// Listas separadas por comas
$fuentes: 'Roboto', 'Arial', sans-serif;

// Listas separadas por espacios
$margenes: 10px 20px 30px 40px;

// Lista de colores
$paleta: #e74c3c, #3498db, #2ecc71, #f39c12, #9b59b6;
\`\`\`

### Funciones de listas

\`\`\`scss
$colores: rojo, azul, verde, amarillo;

length($colores);          // 4
nth($colores, 2);          // azul (indice empieza en 1)
index($colores, verde);    // 3
append($colores, morado);  // rojo, azul, verde, amarillo, morado
join($colores, (negro, blanco)); // Combina ambas listas

// Iterar
@each $color in $colores {
  .text-#{$color} { /* ... */ }
}
\`\`\`

### Mapas (diccionarios)

Los mapas son pares clave-valor, perfectos para organizar datos relacionados:

\`\`\`scss
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
);

$colores-tema: (
  'primario': #3498db,
  'secundario': #2ecc71,
  'peligro': #e74c3c,
  'advertencia': #f39c12,
  'info': #17a2b8,
);
\`\`\`

### Funciones de mapas

\`\`\`scss
$tema: (
  'primario': #3498db,
  'secundario': #2ecc71,
  'fondo': #1a1a2e,
  'texto': #ecf0f1,
);

map-get($tema, 'primario');     // #3498db
map-has-key($tema, 'peligro');  // false
map-keys($tema);                // 'primario', 'secundario', 'fondo', 'texto'
map-values($tema);              // #3498db, #2ecc71, #1a1a2e, #ecf0f1
map-merge($tema, ('peligro': #e74c3c)); // Agrega nuevo par
map-remove($tema, 'fondo');     // Elimina el par 'fondo'
\`\`\`

### Mapas para sistema de colores

Ejemplo practico: generar clases de colores automaticamente:

\`\`\`scss
$colores: (
  'primario': #3498db,
  'exito': #2ecc71,
  'peligro': #e74c3c,
  'advertencia': #f39c12,
);

@each $nombre, $color in $colores {
  .bg-#{$nombre} {
    background-color: $color;
  }

  .text-#{$nombre} {
    color: $color;
  }

  .border-#{$nombre} {
    border-color: $color;
  }

  .btn-#{$nombre} {
    background-color: $color;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;

    &:hover {
      background-color: darken($color, 10%);
    }
  }
}
\`\`\`

### Mapas anidados para temas

\`\`\`scss
$temas: (
  'claro': (
    'fondo': #ffffff,
    'texto': #333333,
    'borde': #dddddd,
    'primario': #3498db,
  ),
  'oscuro': (
    'fondo': #1a1a2e,
    'texto': #ecf0f1,
    'borde': #333355,
    'primario': #5dade2,
  ),
);

@each $nombre-tema, $propiedades in $temas {
  .tema-#{$nombre-tema} {
    background-color: map-get($propiedades, 'fondo');
    color: map-get($propiedades, 'texto');
    border-color: map-get($propiedades, 'borde');
  }
}
\`\`\`

> **Consejo:** Los mapas son la base para crear sistemas de diseno escalables en Sass. Combinados con @each, permiten generar cientos de clases utilitarias con pocas lineas de codigo.`,
      codeExample: {
        html: `<div class="mapas-demo">\n  <span class="chip chip-primario">Primario</span>\n  <span class="chip chip-exito">Exito</span>\n  <span class="chip chip-peligro">Peligro</span>\n  <span class="chip chip-advertencia">Advertencia</span>\n</div>`,
        css: `.mapas-demo {\n  display: flex;\n  gap: 10px;\n  padding: 20px;\n  flex-wrap: wrap;\n}\n\n.chip {\n  padding: 8px 16px;\n  border-radius: 20px;\n  color: white;\n  font-weight: bold;\n  font-size: 0.85rem;\n}\n\n.chip-primario { background: #3498db; }\n.chip-exito { background: #2ecc71; }\n.chip-peligro { background: #e74c3c; }\n.chip-advertencia { background: #f39c12; }`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "22-leccion-04",
      title: "Arquitectura con Sass",
      content: `## Arquitectura con Sass

### El patron 7-1

El patron 7-1 es la arquitectura mas popular para proyectos Sass grandes. Organiza los archivos en 7 carpetas y 1 archivo principal:

\`\`\`
sass/
|-- abstracts/           # Herramientas y helpers
|   |-- _variables.scss    # Variables globales
|   |-- _mixins.scss       # Mixins
|   |-- _funciones.scss    # Funciones personalizadas
|   |-- _index.scss        # @forward de todo
|
|-- base/                # Estilos base
|   |-- _reset.scss        # Reset o Normalize
|   |-- _tipografia.scss   # Reglas tipograficas base
|   |-- _base.scss         # html, body, estilos generales
|   |-- _index.scss
|
|-- componentes/         # Componentes reutilizables
|   |-- _botones.scss
|   |-- _tarjetas.scss
|   |-- _formularios.scss
|   |-- _modales.scss
|   |-- _index.scss
|
|-- layout/              # Estructura de pagina
|   |-- _header.scss
|   |-- _footer.scss
|   |-- _sidebar.scss
|   |-- _grid.scss
|   |-- _index.scss
|
|-- paginas/             # Estilos especificos de pagina
|   |-- _inicio.scss
|   |-- _contacto.scss
|   |-- _sobre-nosotros.scss
|   |-- _index.scss
|
|-- temas/               # Temas (claro, oscuro, etc.)
|   |-- _tema-claro.scss
|   |-- _tema-oscuro.scss
|   |-- _index.scss
|
|-- vendors/             # Terceros (Bootstrap, etc.)
|   |-- _bootstrap.scss
|   |-- _index.scss
|
|-- main.scss            # Archivo raiz
\`\`\`

### El archivo main.scss

\`\`\`scss
// main.scss - Importa todo en orden correcto
@use 'abstracts';
@use 'vendors';
@use 'base';
@use 'layout';
@use 'componentes';
@use 'paginas';
@use 'temas';
\`\`\`

### BEM + Sass

La metodologia BEM (Block, Element, Modifier) combina perfectamente con el nesting de Sass:

\`\`\`scss
// Bloque
.tarjeta {
  background: white;
  border-radius: 12px;
  overflow: hidden;

  // Elemento (tarjeta__imagen)
  &__imagen {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &__contenido {
    padding: 16px;
  }

  &__titulo {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__texto {
    color: #666;
    line-height: 1.5;
  }

  // Modificador (tarjeta--destacada)
  &--destacada {
    border: 2px solid #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  }

  &--horizontal {
    display: flex;

    .tarjeta__imagen {
      width: 200px;
      height: auto;
    }
  }
}
\`\`\`

### Buenas practicas

1. **Maximo 3-4 niveles de nesting:**
\`\`\`scss
// MAL - demasiado anidamiento
.pagina {
  .contenido {
    .articulo {
      .parrafo {
        .enlace { // 5 niveles!
          color: blue;
        }
      }
    }
  }
}

// BIEN - selectores planos con BEM
.articulo__enlace {
  color: blue;
}
\`\`\`

2. **Variables para todo valor magico:**
\`\`\`scss
// MAL
.elemento { margin-top: 37px; }

// BIEN
$espaciado-seccion: 37px;
.elemento { margin-top: $espaciado-seccion; }
\`\`\`

3. **Un componente por archivo:**
Cada componente debe tener su propio partial: \`_botones.scss\`, \`_tarjetas.scss\`, \`_modal.scss\`.

4. **Orden de propiedades consistente:**
\`\`\`scss
.componente {
  // 1. Posicionamiento
  position: relative;
  top: 0;

  // 2. Box model
  display: flex;
  width: 100%;
  padding: 16px;
  margin: 0;

  // 3. Tipografia
  font-size: 1rem;
  color: #333;

  // 4. Visual
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;

  // 5. Misc
  transition: all 0.3s;
  cursor: pointer;
}
\`\`\`

> **Consejo:** No necesitas seguir el patron 7-1 al pie de la letra. Adapta la estructura a tu proyecto. Para proyectos pequenos, 3-4 carpetas pueden ser suficientes.`,
      codeExample: {
        html: `<div class="arq-demo">\n  <div class="card">\n    <div class="card__header">Tarjeta BEM</div>\n    <div class="card__body">\n      <p class="card__text">Estructura Block__Element--Modifier</p>\n    </div>\n    <div class="card__footer">\n      <button class="card__btn card__btn--primary">Aceptar</button>\n      <button class="card__btn card__btn--secondary">Cancelar</button>\n    </div>\n  </div>\n</div>`,
        css: `.arq-demo {\n  padding: 20px;\n}\n\n.card {\n  background: white;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  max-width: 320px;\n}\n\n.card__header {\n  background: #3498db;\n  color: white;\n  padding: 16px;\n  font-weight: bold;\n  font-size: 1.1rem;\n}\n\n.card__body {\n  padding: 16px;\n}\n\n.card__text {\n  color: #555;\n  line-height: 1.5;\n}\n\n.card__footer {\n  padding: 12px 16px;\n  display: flex;\n  gap: 8px;\n  border-top: 1px solid #eee;\n}\n\n.card__btn {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n\n.card__btn--primary {\n  background: #3498db;\n  color: white;\n}\n\n.card__btn--secondary {\n  background: #ecf0f1;\n  color: #333;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "22-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "Que hace la directiva @extend en Sass?",
      options: [
        { id: "a", text: "Crea una variable global", isCorrect: false },
        { id: "b", text: "Hace que un selector herede todos los estilos de otro selector", isCorrect: true },
        { id: "c", text: "Importa un archivo externo", isCorrect: false },
        { id: "d", text: "Define una funcion personalizada", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en herencia: un selector recibe los estilos de otro.",
      explanation:
        "@extend permite que un selector herede todas las declaraciones de otro. Sass agrupa los selectores en el CSS generado, evitando duplicacion de codigo.",
    },
    {
      id: "22-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa el simbolo para crear un placeholder selector en Sass (selector que solo existe para ser extendido):",
      codeTemplate: {
        html: `<!-- SCSS -->`,
        cssPrefix: "",
        cssSuffix: "boton-base {\n  display: inline-block;\n  padding: 10px 24px;\n  border: none;\n  border-radius: 6px;\n}\n\n.btn-primario {\n  @extend %boton-base;\n  background: #3498db;\n}",
        blanks: ["%"],
      },
      validation: { type: "exact", answer: "%" },
      hint: "Es un simbolo que parece un porcentaje. Los placeholders no generan CSS a menos que alguien los extienda.",
      explanation:
        "El simbolo % define un placeholder selector en Sass. A diferencia de las clases normales, los placeholders solo generan CSS cuando alguien los extiende con @extend.",
    },
    {
      id: "22-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Cual es la diferencia entre '@for $i from 1 through 5' y '@for $i from 1 to 5'?",
      options: [
        { id: "a", text: "No hay diferencia", isCorrect: false },
        { id: "b", text: "'through' incluye el 5, 'to' no incluye el 5", isCorrect: true },
        { id: "c", text: "'to' incluye el 5, 'through' no incluye el 5", isCorrect: false },
        { id: "d", text: "'through' cuenta de 2 en 2", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en 'through' como 'a traves de' (incluyendo) y 'to' como 'hasta' (sin incluir).",
      explanation:
        "@for $i from 1 through 5 itera de 1 a 5 incluyendo el 5 (1,2,3,4,5). @for $i from 1 to 5 itera de 1 a 4, excluyendo el 5 (1,2,3,4).",
    },
    {
      id: "22-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Completa la directiva del bucle Sass para iterar sobre cada color de la lista:",
      codeTemplate: {
        html: `<!-- SCSS -->`,
        cssPrefix: "$colores: rojo, azul, verde;\n\n",
        cssSuffix: " $color in $colores {\n  .text-#{$color} {\n    color: $color;\n  }\n}",
        blanks: ["@each"],
      },
      validation: { type: "exact", answer: "@each" },
      hint: "Es la directiva que itera sobre cada elemento de una lista o mapa.",
      explanation:
        "@each es el bucle de Sass para iterar sobre listas y mapas. Con @each $color in $colores, la variable $color toma cada valor de la lista en cada iteracion.",
    },
    {
      id: "22-ej-05",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Arrastra cada funcion de mapa Sass a lo que retorna:",
      dragItems: [
        { id: "drag-1", content: "map-get($mapa, 'clave')", correctZone: "zone-valor" },
        { id: "drag-2", content: "map-keys($mapa)", correctZone: "zone-claves" },
        { id: "drag-3", content: "map-has-key($mapa, 'x')", correctZone: "zone-bool" },
        { id: "drag-4", content: "map-merge($m1, $m2)", correctZone: "zone-merge" },
      ],
      dropZones: [
        { id: "zone-valor", label: "Retorna el valor asociado a una clave" },
        { id: "zone-claves", label: "Retorna la lista de todas las claves" },
        { id: "zone-bool", label: "Retorna true o false si la clave existe" },
        { id: "zone-merge", label: "Combina dos mapas en uno nuevo" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-valor",
          "drag-2": "zone-claves",
          "drag-3": "zone-bool",
          "drag-4": "zone-merge",
        },
      },
      hint: "get obtiene valores, keys obtiene claves, has-key verifica existencia, merge combina.",
      explanation:
        "map-get obtiene el valor de una clave. map-keys retorna todas las claves del mapa. map-has-key verifica si una clave existe. map-merge combina dos mapas, donde el segundo sobreescribe claves duplicadas.",
    },
    {
      id: "22-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "En la metodologia BEM con Sass, como se escribe el selector para el elemento 'titulo' del bloque 'tarjeta'?",
      options: [
        { id: "a", text: ".tarjeta { .titulo { } }", isCorrect: false },
        { id: "b", text: ".tarjeta { &__titulo { } }", isCorrect: true },
        { id: "c", text: ".tarjeta { &--titulo { } }", isCorrect: false },
        { id: "d", text: ".tarjeta { &.titulo { } }", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En BEM, los elementos se separan con doble guion bajo (__) y el & referencia al bloque padre.",
      explanation:
        "En BEM, los elementos usan doble guion bajo: .tarjeta__titulo. Con Sass, dentro de .tarjeta usamos &__titulo donde & se reemplaza por '.tarjeta', generando .tarjeta__titulo.",
    },
    {
      id: "22-ej-07",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Completa la funcion de mapa para obtener el valor de la clave 'primario' del mapa $colores:",
      codeTemplate: {
        html: `<!-- SCSS -->`,
        cssPrefix: "$colores: (\n  'primario': #3498db,\n  'secundario': #2ecc71,\n);\n\n.boton {\n  background: ",
        cssSuffix: "($colores, 'primario');\n}",
        blanks: ["map-get"],
      },
      validation: { type: "exact", answer: "map-get" },
      hint: "Es la funcion que 'obtiene' (get) un valor de un mapa usando su clave.",
      explanation:
        "map-get($mapa, 'clave') retorna el valor asociado a esa clave en el mapa. En este caso, map-get($colores, 'primario') retorna #3498db.",
    },
    {
      id: "22-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "En el patron de arquitectura 7-1, donde se colocan las variables globales y los mixins?",
      options: [
        { id: "a", text: "En la carpeta 'base/'", isCorrect: false },
        { id: "b", text: "En la carpeta 'componentes/'", isCorrect: false },
        { id: "c", text: "En la carpeta 'abstracts/'", isCorrect: true },
        { id: "d", text: "En el archivo main.scss directamente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Las variables y mixins son herramientas 'abstractas' que no generan CSS por si mismas.",
      explanation:
        "En el patron 7-1, la carpeta 'abstracts/' (o 'utils/') contiene variables, mixins, funciones y placeholders. Son herramientas abstractas que no generan CSS directamente sino que se usan desde otros archivos.",
    },
  ],
};
