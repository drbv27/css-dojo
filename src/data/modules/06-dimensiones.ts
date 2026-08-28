import type { ModuleData } from "@/types";

export const dimensionesModule: ModuleData = {
  slug: "dimensiones",
  title: "Dimensiones y espaciado",
  description:
    "Controla el tamaño de los elementos y el espacio que los rodea con width, height, padding y margin.",
  order: 6,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-caja",
  icon: "Ruler",
  lessons: [
    {
      id: "05-leccion-01",
      title: "Ancho y alto",
      content: `## Ancho y alto

Las propiedades \`width\` y \`height\` definen el **ancho** y **alto** de un elemento.

### Sintaxis

\`\`\`css
.caja {
  width: 300px;
  height: 200px;
}
\`\`\`

### Unidades comunes

| Unidad | Descripción | Ejemplo |
|--------|------------|---------|
| \`px\` | Píxeles (valor fijo) | \`width: 300px\` |
| \`%\` | Porcentaje del elemento padre | \`width: 50%\` |
| \`vw\` / \`vh\` | Porcentaje del viewport | \`width: 100vw\` |
| \`em\` / \`rem\` | Relativa a la fuente | \`width: 20rem\` |

### El valor auto

El valor \`auto\` deja que el navegador **calcule la dimensión** automáticamente:

\`\`\`css
.imagen {
  width: 100%;    /* Ocupa todo el ancho disponible */
  height: auto;   /* Mantiene la proporcion */
}
\`\`\`

### Comportamiento por defecto

- Los elementos **de bloque** (div, p, h1...) tienen \`width: auto\` (ocupan todo el ancho disponible) y \`height: auto\` (se ajustan al contenido)
- Los elementos **en línea** (span, a, strong...) **ignoran** width y height

### Por que width no siempre mide lo que crees

En el modulo anterior viste el box model: contenido, padding, border y margin. Aca es donde eso importa de verdad.

Por defecto, \`width\` y \`height\` miden **solo el contenido**. El padding y el border se suman por fuera. Así que esto:

\`\`\`css
.caja {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
}
\`\`\`

...no ocupa 300px. Ocupa **350px**: 300 de contenido + 20 de padding a cada lado + 5 de borde a cada lado. Y el dia que le cambies el padding, el ancho total cambia con el.

### La solución: box-sizing

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

Con \`border-box\`, \`width: 300px\` significa **300px totales**: el padding y el borde se descuentan del contenido en vez de sumarse por fuera. La caja del ejemplo mide 300px, y si le agregas padding el contenido se encoge pero la caja no se mueve.

> **Buena práctica:** ponelo en todos tus proyectos, en el selector universal, antes que cualquier otra regla. Es el ajuste que más dolores de cabeza evita en CSS -- sin el, cada padding que agregues te corre el layout.`,
      codeExample: {
        html: `<div class="caja-fija">Caja fija: 300px x 150px</div>\n<div class="caja-porcentaje">Caja flexible: 80% del padre</div>\n<div class="caja-auto">Caja auto: se ajusta al contenido</div>`,
        css: `.caja-fija {\n  width: 300px;\n  height: 150px;\n  background-color: lightblue;\n  margin-bottom: 10px;\n}\n.caja-porcentaje {\n  width: 80%;\n  height: 100px;\n  background-color: lightcoral;\n  margin-bottom: 10px;\n}\n.caja-auto {\n  width: auto;\n  height: auto;\n  background-color: lightgreen;\n  padding: 10px;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "05-leccion-02",
      title: "Límites: max y min",
      content: `## Límites: max-width, min-width, max-height, min-height

Estas propiedades establecen **límites** para las dimensiones de un elemento, permitiendo que sea flexible dentro de un rango.

### max-width

Define el **ancho máximo** que puede tener un elemento. Es clave para el **diseño responsivo**:

\`\`\`css
.contenedor {
  width: 100%;       /* Se adapta al padre */
  max-width: 800px;  /* Pero nunca supera 800px */
}
\`\`\`

Esto crea un contenedor que ocupa todo el ancho en pantallas pequeñas pero no crece más de 800px en pantallas grandes.

### min-width

Define el **ancho mínimo**. El elemento nunca sera más estrecho que este valor:

\`\`\`css
.boton {
  min-width: 120px;  /* Nunca menor a 120px */
}
\`\`\`

### max-height y min-height

Funcionan igual pero para el **alto**:

\`\`\`css
.tarjeta {
  min-height: 200px;  /* Al menos 200px de alto */
  max-height: 500px;  /* Maximo 500px de alto */
  overflow: auto;      /* Scroll si el contenido excede */
}
\`\`\`

### Patrón común: contenedor centrado

Este es uno de los patrones más usados en CSS:

\`\`\`css
.contenedor {
  max-width: 1200px;
  margin: 0 auto;    /* Centra horizontalmente */
  padding: 0 20px;   /* Espacio en los lados */
}
\`\`\`

> **Consejo:** Prefiere \`max-width\` sobre \`width\` fijo para crear diseños que se adapten a diferentes tamaños de pantalla.`,
      codeExample: {
        html: `<div class="contenedor">\n  <h2>Contenedor responsivo</h2>\n  <p>Este contenedor tiene un max-width de 600px y esta centrado con margin auto.</p>\n</div>`,
        css: `.contenedor {\n  max-width: 600px;\n  min-height: 150px;\n  margin: 0 auto;\n  padding: 20px;\n  background-color: #f0f0f0;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "05-leccion-03",
      title: "Padding: espacio interior",
      content: `## Padding: espacio interior

El \`padding\` es el **espacio entre el contenido** de un elemento y **su borde**. Es el "relleno" interior.

### Propiedades individuales

\`\`\`css
.caja {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
}
\`\`\`

### Propiedad abreviada (shorthand)

Puedes escribir padding con 1, 2, 3 o 4 valores:

#### 1 valor: aplica a los 4 lados
\`\`\`css
.caja { padding: 20px; }
/* top=20px, right=20px, bottom=20px, left=20px */
\`\`\`

#### 2 valores: vertical | horizontal
\`\`\`css
.caja { padding: 10px 20px; }
/* top=10px, right=20px, bottom=10px, left=20px */
\`\`\`

#### 3 valores: top | horizontal | bottom
\`\`\`css
.caja { padding: 10px 20px 30px; }
/* top=10px, right=20px, bottom=30px, left=20px */
\`\`\`

#### 4 valores: top | right | bottom | left (sentido del reloj)
\`\`\`css
.caja { padding: 10px 20px 30px 40px; }
/* top=10px, right=20px, bottom=30px, left=40px */
\`\`\`

### Regla mnemotecnica

Los 4 valores van en **sentido del reloj** empezando por arriba: **T**op, **R**ight, **B**ottom, **L**eft. Recuerda: **TR**ou**BL**e (problema en ingles).

> **Importante:** El padding NUNCA puede ser negativo. Si necesitas valores negativos, usa margin.`,
      codeExample: {
        html: `<div class="sin-padding">Sin padding</div>\n<div class="con-padding">Con padding: 20px</div>\n<div class="padding-mixto">Padding: 10px arriba/abajo, 40px lados</div>`,
        css: `.sin-padding {\n  background-color: tomato;\n  color: white;\n  margin-bottom: 8px;\n}\n.con-padding {\n  background-color: steelblue;\n  color: white;\n  padding: 20px;\n  margin-bottom: 8px;\n}\n.padding-mixto {\n  background-color: seagreen;\n  color: white;\n  padding: 10px 40px;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "05-leccion-04",
      title: "Margin: espacio exterior",
      content: `## Margin: espacio exterior

El \`margin\` es el **espacio fuera del borde** de un elemento. Crea separación entre un elemento y sus vecinos.

### Sintaxis

Funciona igual que padding (1-4 valores, sentido del reloj):

\`\`\`css
.caja {
  margin: 20px;           /* 20px en todos los lados */
  margin: 10px 20px;      /* 10px vertical, 20px horizontal */
  margin: 10px 20px 30px 40px; /* top right bottom left */
}
\`\`\`

### Centrar con margin auto

Uno de los trucos más clasicos de CSS. Para centrar un elemento horizontalmente:

\`\`\`css
.centrado {
  width: 600px;       /* Debe tener un ancho definido */
  margin: 0 auto;     /* 0 vertical, auto horizontal */
}
\`\`\`

El valor \`auto\` reparte el espacio restante **equitativamente** a ambos lados, centrando el elemento.

### Márgenes negativos

A diferencia del padding, los márgenes **si pueden ser negativos**:

\`\`\`css
.superpuesto {
  margin-top: -20px; /* Se superpone 20px sobre el elemento anterior */
}
\`\`\`

### Colapso de márgenes (margin collapse)

Cuando dos márgenes verticales se tocan, **no se suman sino que se fusionan**: gana el mayor.

\`\`\`css
.parrafo1 { margin-bottom: 30px; }
.parrafo2 { margin-top: 20px; }
/* El espacio real entre ellos es 30px, NO 50px */
\`\`\`

Este comportamiento solo ocurre con **márgenes verticales** (top/bottom), nunca con horizontales.

> **Atención:** El colapso de márgenes es una de las fuentes de confusión más comunes en CSS. Recuerda: márgenes verticales adyacentes se fusionan, los horizontales no.`,
      codeExample: {
        html: `<div class="caja-1">Caja 1 (margin-bottom: 30px)</div>\n<div class="caja-2">Caja 2 (margin-top: 20px)</div>\n<div class="centrada">Caja centrada con margin: 20px auto</div>`,
        css: `.caja-1 {\n  background-color: lightcoral;\n  padding: 15px;\n  margin-bottom: 30px;\n}\n.caja-2 {\n  background-color: lightblue;\n  padding: 15px;\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.centrada {\n  width: 300px;\n  margin: 20px auto;\n  background-color: lightgreen;\n  padding: 15px;\n  text-align: center;\n  border-radius: 8px;\n}`,
        editable: true,
      },
      order: 4,
    },
    {
      id: "05-leccion-05",
      title: "Proporción: aspect-ratio",
      content: `## Proporción: aspect-ratio

Ya sabés fijar el ancho y el alto por separado. Pero hay un caso muy común donde eso no alcanza: **cuando querés que la caja mantenga una proporción**.

### El problema

Pensá en la miniatura de un video. Tiene que ser rectangular 16:9. Si el ancho depende del espacio disponible, ¿cuánto mide el alto?

Con \`width\` y \`height\` sueltos no se puede: cada vez que el ancho cambia, habría que recalcular el alto a mano.

\`\`\`css
/* Esto NO se adapta: si el contenedor cambia, la proporción se rompe */
.miniatura {
  width: 320px;
  height: 180px;
}
\`\`\`

### La solución

\`aspect-ratio\` declara la proporción y deja que el navegador calcule la dimensión que falta.

\`\`\`css
.miniatura {
  width: 100%;
  aspect-ratio: 16 / 9;  /* el alto sale solo */
}
\`\`\`

Ahora el ancho puede ser lo que sea — 320px, 800px, el 100% de lo que haya — y el alto **siempre** va a ser la novena parte del ancho multiplicada por 9. La proporción no se rompe nunca.

### Cómo se escribe

\`\`\`css
aspect-ratio: 1 / 1;    /* cuadrado */
aspect-ratio: 16 / 9;   /* pantalla ancha */
aspect-ratio: 4 / 3;    /* foto clásica */
aspect-ratio: 3 / 4;    /* vertical, tipo retrato */
aspect-ratio: 1.5;      /* un solo número también vale: equivale a 3 / 2 */
\`\`\`

Se lee **ancho / alto**. En \`16 / 9\` el ancho es 16 partes y el alto 9, así que queda apaisado. Si lo invertís a \`9 / 16\`, queda vertical como la pantalla de un teléfono.

### La regla para no equivocarse

> \`aspect-ratio\` calcula la dimensión que **no** declaraste. Si declarás las dos, no tiene nada que calcular y se ignora.

| Declarás | \`aspect-ratio\` calcula |
|---|---|
| solo \`width\` | el alto |
| solo \`height\` | el ancho |
| ambos | nada, gana lo que escribiste |

Y se combina bien con lo que ya viste: \`max-width\` limita cuánto puede crecer, y \`aspect-ratio\` se encarga de que el alto acompañe.

> **Para qué sirve de verdad:** avatares perfectamente cuadrados, miniaturas de video que no se deforman, y tarjetas que mantienen su forma sin importar el ancho de la pantalla.`,
      codeExample: {
        html: `<div class="avatar">1 / 1</div>\n<div class="video">16 / 9</div>\n<div class="retrato">3 / 4</div>`,
        css: `.avatar {\n  width: 100px;\n  aspect-ratio: 1 / 1;\n  background-color: lightcoral;\n}\n.video {\n  width: 240px;\n  aspect-ratio: 16 / 9;\n  background-color: lightblue;\n}\n.retrato {\n  width: 120px;\n  aspect-ratio: 3 / 4;\n  background-color: lightgreen;\n}`,
        editable: true,
      },
      order: 5,
    },
  ],
  exercises: [
    {
      id: "05-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué propiedad define el espacio entre el contenido y el borde de un elemento?",
      options: [
        { id: "a", text: "margin", isCorrect: false },
        { id: "b", text: "padding", isCorrect: true },
        { id: "c", text: "spacing", isCorrect: false },
        { id: "d", text: "gap", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el espacio INTERIOR, entre el contenido y el borde. No el espacio exterior.",
      explanation:
        "El 'padding' es el espacio interior entre el contenido y el borde del elemento. El 'margin' es el espacio exterior, fuera del borde. 'spacing' no existe en CSS y 'gap' se usa en Flexbox/Grid.",
    },
    {
      id: "05-ej-02",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt:
        "Completa la propiedad para limitar el ancho máximo del contenedor a 800px, permitiendo que sea más pequeño en pantallas chicas:",
      codeTemplate: {
        html: `<div class="contenedor">Contenido del contenedor</div>`,
        cssPrefix: ".contenedor {\n  ",
        cssSuffix: ": 800px;\n  width: 100%;\n}",
        blanks: ["max-width"],
      },
      validation: { type: "exact", answer: "max-width" },
      hint: "Es una propiedad que establece el Máximo ancho que un elemento puede tener. Dos palabras unidas con guion.",
      explanation:
        "La propiedad 'max-width' limita el ancho máximo de un elemento. Combinada con 'width: 100%', crea un contenedor que es flexible en pantallas pequeñas pero no crece más de 800px.",
    },
    {
      id: "05-ej-03",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Crea una caja con la clase 'caja' que tenga: ancho de 300px, alto de 200px, padding de 20px y margin de 10px. Agrega background-color: lightblue para visualizarla.",
      codeTemplate: {
        html: `<div class="caja">Contenido de la caja</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".caja {\n  width: 300px;\n  height: 200px;\n  padding: 20px;\n  margin: 10px;\n  background-color: lightblue;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas 5 propiedades: width, height, padding, margin y background-color.",
      explanation:
        "La caja se define con width: 300px para el ancho, height: 200px para el alto, padding: 20px para el espacio interior, margin: 10px para el espacio exterior y background-color para visualizarla.",
    },
    {
      id: "05-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada forma de escribir padding a lo que representa:",
      dragItems: [
        {
          id: "drag-1",
          content: "padding: 20px;",
          correctZone: "zone-todos",
        },
        {
          id: "drag-2",
          content: "padding: 10px 20px;",
          correctZone: "zone-vertical-horizontal",
        },
        {
          id: "drag-3",
          content: "padding: 10px 20px 30px 40px;",
          correctZone: "zone-individual",
        },
      ],
      dropZones: [
        {
          id: "zone-todos",
          label: "Mismo valor en los 4 lados",
        },
        {
          id: "zone-vertical-horizontal",
          label: "Vertical y horizontal",
        },
        {
          id: "zone-individual",
          label: "Top, right, bottom, left (individual)",
        },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-todos",
          "drag-2": "zone-vertical-horizontal",
          "drag-3": "zone-individual",
        },
      },
      hint: "1 valor = todos iguales. 2 valores = vertical y horizontal. 4 valores = cada lado individual en sentido del reloj.",
      explanation:
        "Con 1 valor se aplica a los 4 lados. Con 2 valores, el primero es vertical (top/bottom) y el segundo horizontal (left/right). Con 4 valores, se asignan en sentido del reloj: top, right, bottom, left.",
    },
    {
      id: "05-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "En la declaración `padding: 10px 20px 30px;`, ¿qué valor tiene padding-left?",
      options: [
        { id: "a", text: "10px", isCorrect: false },
        { id: "b", text: "20px", isCorrect: true },
        { id: "c", text: "30px", isCorrect: false },
        { id: "d", text: "0px", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Con 3 valores: el primero es top, el segundo es right e izquierdo (horizontal), y el tercero es bottom.",
      explanation:
        "Con 3 valores (10px 20px 30px): top=10px, right=20px, bottom=30px, left=20px. Cuando hay 3 valores, el segundo se usa tanto para right como para left.",
    },
    {
      id: "05-ej-06",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Completa el valor de margin para centrar horizontalmente este contenedor de 600px de ancho:",
      codeTemplate: {
        html: `<div class="centrado">Contenido centrado</div>`,
        cssPrefix: ".centrado {\n  margin: ",
        cssSuffix: " auto;\n  width: 600px;\n}",
        blanks: ["0"],
      },
      validation: { type: "exact", answer: "0" },
      hint: "Necesitas 0 de margen vertical y auto para horizontal. El primer valor es para arriba y abajo.",
      explanation:
        "La declaración 'margin: 0 auto' usa 0 para los márgenes verticales (top/bottom) y 'auto' para los horizontales (left/right). El valor 'auto' reparte el espacio equitativamente, centrando el elemento.",
    },
    {
      id: "05-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Reproduce el diseño objetivo: una caja centrada horizontalmente con ancho de 500px, padding de 30px, margin de 20px auto, borde de 1px solid #ccc y border-radius de 8px. Agrega background-color: white.",
      codeTemplate: {
        html: `<div class="tarjeta">\n  <h2>Tarjeta centrada</h2>\n  <p>Esta tarjeta esta centrada y tiene espaciado correcto.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  width: 500px;\n  padding: 30px;\n  margin: 20px auto;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  background-color: white;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Necesitas: width, padding, margin con auto para centrar, border, border-radius y background-color.",
      explanation:
        "La tarjeta combina width: 500px para el ancho, padding: 30px para espacio interior, margin: 20px auto para centrado horizontal, border para el borde, border-radius para esquinas redondeadas y background-color: white.",
    },
    {
      id: "05-ej-08",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 8,
      prompt:
        "Centra horizontalmente un div con clase 'centrado' de 400px de ancho usando margin auto. Agrega background-color: lightyellow y padding: 20px para visualizarlo.",
      codeTemplate: {
        html: `<div class="centrado">\n  <p>Este contenido debe estar centrado en la pagina.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".centrado {\n  width: 400px;\n  margin: 0 auto;\n  background-color: lightyellow;\n  padding: 20px;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Para centrar un elemento necesitas dos cosas: un ancho definido (width) y margin: 0 auto.",
      explanation:
        "Para centrar horizontalmente se necesita: 1) Un ancho definido (width: 400px) para que haya espacio sobrante, y 2) margin: 0 auto que reparte ese espacio equitativamente a ambos lados.",
    },
    {
      id: "05-ej-09",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 9,
      prompt:
        "Escribis .caja { width: 400px; height: 100px; aspect-ratio: 1 / 1; }. ¿Qué forma termina teniendo la caja?",
      options: [
        { id: "a", text: "Un cuadrado de 400x400", isCorrect: false },
        { id: "b", text: "Un cuadrado de 100x100", isCorrect: false },
        { id: "c", text: "Un rectangulo de 400x100", isCorrect: true },
        { id: "d", text: "La caja no se muestra", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "aspect-ratio calcula la dimensión que NO declaraste. Aca declaraste las dos.",
      explanation:
        "aspect-ratio solo calcula la dimensión que falta. Al declarar width y height a la vez no queda nada por calcular, así que se ignora y la caja mide 400x100. Para que la proporción funcione hay que declarar una sola de las dos.",
    },
    {
      id: "05-ej-10",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 10,
      prompt:
        "Arma dos piezas con proporción fija. A la clase 'avatar' dale width: 80px, aspect-ratio: 1 / 1 y background-color: lightcoral. A la clase 'miniatura' dale width: 240px, aspect-ratio: 16 / 9 y background-color: lightblue. No declares height en ninguna.",
      codeTemplate: {
        html: `<div class="avatar"></div>\n<div class="miniatura"></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".avatar {\n  width: 80px;\n  aspect-ratio: 1 / 1;\n  background-color: lightcoral;\n}\n.miniatura {\n  width: 240px;\n  aspect-ratio: 16 / 9;\n  background-color: lightblue;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "La proporción se escribe ancho / alto. Un cuadrado es 1 / 1 y una pantalla ancha es 16 / 9. Nada de height.",
      explanation:
        "Declarando solo el ancho, aspect-ratio calcula el alto: el avatar queda de 80x80 y la miniatura de 240x135. Si el ancho cambiara, el alto acompana y la proporción se mantiene.",
    },
    {
      /** EL RETO INTEGRADOR del modulo. Ver src/lib/calificar.ts. */
      id: "05-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 11,
      prompt:
        "Reto integrador. Una caja que se adapta pero no se desborda: los límites y la proporción son lo que la mantienen usable en cualquier pantalla.",
      retoPasos: [
        {
          instruccion:
            "Dale a .panel un ancho de 100% para que acompañe a su contenedor.",
          esperado: ".panel { width: 100%; }",
        },
        {
          instruccion:
            "Ponele un techo de 600px con max-width, para que en una pantalla grande no se estire sin control.",
          esperado: ".panel { max-width: 600px; }",
        },
        {
          instruccion:
            "Ponele un piso de 120px con min-height, para que no colapse cuando tiene poco contenido.",
          esperado: ".panel { min-height: 120px; }",
        },
        {
          instruccion:
            "Separa su contenido del borde con 24px de padding, y separalo de sus vecinos con 16px de margin.",
          esperado: ".panel { padding: 24px; margin: 16px; }",
        },
        {
          instruccion:
            "Dale una proporcion de 16/9 con aspect-ratio. Es la unica forma de fijar la relacion entre ancho y alto sin calcular ninguno de los dos.",
          esperado: ".panel { aspect-ratio: 16 / 9; }",
        },
      ],
      codeTemplate: {
        html: `<div class="panel">\n  <p>Un panel que respeta sus límites.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "css-rules",
      },
      referenceSolution:
        ".panel {\n  width: 100%;\n  max-width: 600px;\n  min-height: 120px;\n  padding: 24px;\n  margin: 16px;\n  aspect-ratio: 16 / 9;\n}",
      hint: "`width: 100%` y `max-width` no se pelean: el ancho manda mientras haya lugar, y el máximo lo frena cuando se pasa.",
      explanation:
        "`width` dice cuanto quiere medir el elemento; `max-width` y `min-height` dicen hasta donde se le permite. Los límites son lo que convierte un ancho fijo en un diseño que aguanta pantallas distintas. El padding y el margin siguen siendo lo de siempre: uno adentro de la caja, el otro afuera. Y `aspect-ratio` es el que ata el alto al ancho, asi que la caja mantiene su forma sin que haya que calcular el alto a mano.",
    },
  ],
};
