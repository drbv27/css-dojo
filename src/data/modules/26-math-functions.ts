import type { ModuleData } from "@/types";

export const mathFunctionsModule: ModuleData = {
  slug: "math-functions",
  title: "Funciones matemáticas",
  description:
    "Deja que el navegador haga la cuenta con calc(), min(), max() y clamp(): medidas que se adaptan sin escribir tres reglas distintas.",
  order: 7,
  dojo: "css" as const,
  category: "css-caja",
  icon: "Calculator",
  lessons: [
    {
      id: "26-leccion-01",
      title: "calc(): mezclar unidades en una sola cuenta",
      content: `## El problema que resuelve

Ya sabés escribir \`width: 100%\` y \`width: 300px\`. Pero, ¿cómo escribís "todo el ancho **menos** 2rem de aire a cada lado"?

Con lo visto hasta acá, no podés. \`100%\` y \`rem\` son dos mundos distintos: el porcentaje lo resuelve el navegador cuando ya sabe cuánto mide el padre, y el \`rem\` depende del tamaño de fuente. Vos, escribiendo el CSS, no conocés ninguno de los dos.

\`calc()\` es la puerta: te deja **mezclar unidades en una sola operación** y el navegador hace la cuenta cuando ya tiene los datos.

\`\`\`css
.contenido {
  width: calc(100% - 4rem);
}
\`\`\`

Eso se lee: el ancho es todo el disponible, menos 4rem. No hay ningún número mágico. Si el padre cambia de tamaño, la cuenta se vuelve a hacer sola.

### Los cuatro operadores

| Operador | Ejemplo | Nota |
|----------|---------|------|
| \`+\` | \`calc(100% + 20px)\` | Espacios **obligatorios** |
| \`-\` | \`calc(100vh - 80px)\` | Espacios **obligatorios** |
| \`*\` | \`calc(2rem * 1.5)\` | Un lado tiene que ser un número sin unidad |
| \`/\` | \`calc(100% / 3)\` | El divisor tiene que ser un número sin unidad |

### La trampa de los espacios

Esta es la que hace perder media hora la primera vez:

\`\`\`css
.mal  { width: calc(100%-4rem); }   /* NO funciona */
.bien { width: calc(100% - 4rem); } /* Sí funciona */
\`\`\`

Sin los espacios, el navegador **no lee una resta**: lee \`4rem\` como parte del primer valor, con signo. Es la misma razón por la que \`-4rem\` es un número negativo válido y por eso no puede adivinar qué quisiste decir. Con \`*\` y \`/\` los espacios no son obligatorios, pero conviene poner los cuatro iguales y no pensarlo más.

### Dónde se usa de verdad

El caso clásico: una sección que tiene que ocupar la pantalla entera menos la barra de arriba.

\`\`\`css
.principal {
  min-height: calc(100vh - 80px);
}
\`\`\`

Antes de \`calc()\` esto se resolvía con JavaScript midiendo la barra. Hoy es una línea de CSS.`,
      codeExample: {
        html: `<div class="marco">\n  <div class="contenido">Ancho: 100% menos 4rem de aire</div>\n</div>`,
        css: `.marco {\n  background-color: #e0e0e0;\n  padding: 10px;\n}\n\n.contenido {\n  width: calc(100% - 4rem);\n  background-color: #8b5cf6;\n  color: white;\n  padding: 16px;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "26-leccion-02",
      title: "min() y max(): el navegador elige",
      content: `## Dos funciones con nombres que engañan

\`min()\` y \`max()\` reciben varios valores y se quedan con uno. La parte contraintuitiva es **cuál**.

\`\`\`css
.caja {
  width: min(600px, 100%);
}
\`\`\`

\`min()\` elige el valor **más chico de los dos, en cada momento**. Si la pantalla es ancha, \`100%\` es más grande que 600px, entonces gana 600px. Si la pantalla es angosta, \`100%\` es más chico y gana \`100%\`.

O sea: **\`min()\` funciona como un techo.** Le pusiste un límite máximo de 600px.

Y al revés:

\`\`\`css
.caja {
  width: max(300px, 50%);
}
\`\`\`

\`max()\` elige el **más grande**, así que en la práctica es un **piso**: nunca baja de 300px.

### La regla para no confundirse

No pienses en el nombre de la función, pensá en el resultado:

| Escribís | El navegador elige | En la práctica es un |
|----------|-------------------|---------------------|
| \`min(600px, 100%)\` | el más chico | máximo de 600px |
| \`max(300px, 50%)\` | el más grande | mínimo de 300px |

Sí, los nombres están al revés de lo que uno esperaría. Le pasa a todo el mundo.

### ¿Y esto no lo hacía max-width?

Buena pregunta, y la respuesta importa. Esto:

\`\`\`css
.caja { width: 100%; max-width: 600px; }
\`\`\`

hace lo mismo que esto:

\`\`\`css
.caja { width: min(600px, 100%); }
\`\`\`

Dos propiedades contra una. La ventaja real de \`min()\` aparece cuando el límite lo necesitás **adentro de otra propiedad**, donde no existe una versión "max-" para poner:

\`\`\`css
.contenido {
  padding: min(5vw, 32px);
}
\`\`\`

Ahí el aire crece con la pantalla pero nunca pasa de 32px. No hay ninguna propiedad \`max-padding\` que haga eso.

### Aceptan más de dos valores

\`\`\`css
.caja {
  width: min(600px, 100%, 80vw);
}
\`\`\`

Y adentro podés hacer cuentas, porque \`calc()\` está implícito:

\`\`\`css
.caja {
  width: min(100% - 2rem, 600px);
}
\`\`\``,
      codeExample: {
        html: `<div class="techo">min(400px, 100%): nunca más ancho que 400px</div>\n<div class="piso">max(200px, 30%): nunca más angosto que 200px</div>`,
        css: `.techo {\n  width: min(400px, 100%);\n  background-color: #8b5cf6;\n  color: white;\n  padding: 12px;\n  margin-bottom: 12px;\n}\n\n.piso {\n  width: max(200px, 30%);\n  background-color: #27ae60;\n  color: white;\n  padding: 12px;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "26-leccion-03",
      title: "clamp(): mínimo, ideal y máximo",
      content: `## Tres valores, una línea

\`clamp()\` recibe tres valores, **siempre en este orden**:

\`\`\`css
.titulo {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
\`\`\`

Se lee: nunca menos de 1.5rem, idealmente 4vw, nunca más de 3rem.

| Posición | Qué es | En el ejemplo |
|----------|--------|---------------|
| 1º | El mínimo, el piso | \`1.5rem\` |
| 2º | El valor ideal, el que crece | \`4vw\` |
| 3º | El máximo, el techo | \`3rem\` |

El del medio es el único que **tiene que ser relativo a algo que cambie** (\`vw\`, \`%\`, \`vh\`). Si le pusieras un valor fijo, \`clamp()\` no tendría nada que ajustar y devolvería siempre lo mismo.

### Por qué esto cambia las cosas

Un título que se lee bien en un teléfono y en un monitor grande siempre necesitó al menos dos reglas: una para chico y otra para grande, cada una con su punto de corte elegido a dedo. Con \`clamp()\` es una línea, y el cambio es **continuo**: no hay un salto brusco en un ancho puntual, el título crece parejo.

Las media queries siguen existiendo y las vas a aprender más adelante, porque hay cosas que sí necesitan un corte: reordenar un layout, esconder un menú. Pero para **una medida que crece**, \`clamp()\` es la herramienta correcta y las media queries son el martillo equivocado.

### El equivalente largo

\`clamp(A, B, C)\` es exactamente lo mismo que \`max(A, min(B, C))\`. Si alguna vez te trabás con el orden, esa igualdad te lo aclara: primero el techo, después el piso.

### También sirve para el aire

No es solo para texto. El espaciado fluido es igual de útil:

\`\`\`css
.seccion {
  padding: clamp(1rem, 5vw, 4rem);
}
\`\`\`

En un teléfono, 1rem de aire. En un monitor, 4rem. En el medio, lo que corresponda.`,
      codeExample: {
        html: `<h2 class="titulo-fluido">Este título crece con la ventana</h2>\n<p class="nota">Cambiá el ancho de la vista previa y mirá qué pasa.</p>`,
        css: `.titulo-fluido {\n  font-size: clamp(1.25rem, 5vw, 2.5rem);\n  color: #8b5cf6;\n  margin-bottom: 8px;\n}\n\n.nota {\n  font-size: clamp(0.875rem, 2vw, 1rem);\n  color: #555;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "26-leccion-04",
      title: "Las cuatro funciones en el CV de Ana",
      content: `## Del ejemplo al producto

Vamos al CV de Ana Martínez, el proyecto que cierra este track. Tiene un encabezado, un contenido y unas secciones. Sin estas funciones, el CV se ve bien en la pantalla donde lo hiciste y raro en las demás.

### El contenido no se pega a los bordes ni se estira sin fin

\`\`\`css
.contenido {
  width: min(760px, 100% - 3rem);
  margin: 0 auto;
}
\`\`\`

Una línea y dos problemas resueltos: en un monitor grande el texto no cruza medio metro de pantalla, y en un teléfono queda 1.5rem de aire a cada lado. Fijate que el segundo valor es una cuenta, y no hizo falta escribir \`calc()\`: adentro de \`min()\` está implícito.

### El nombre crece, pero con límites

\`\`\`css
.nombre {
  font-size: clamp(1.75rem, 6vw, 3.5rem);
}
\`\`\`

### El aire acompaña al ancho

\`\`\`css
.encabezado {
  padding: clamp(1.5rem, 5vw, 3rem);
}
\`\`\`

### La foto no se deforma

\`\`\`css
.foto {
  width: min(180px, 40%);
}
\`\`\`

## Cómo elegir cuál usar

Esta es la parte que vale la pena que te lleves, más que la sintaxis:

| Si necesitás | Usá |
|--------------|-----|
| Mezclar unidades en una cuenta | \`calc()\` |
| Poner un techo a una medida | \`min()\` |
| Poner un piso a una medida | \`max()\` |
| Piso, crecimiento y techo a la vez | \`clamp()\` |

Y la pregunta previa a todas: ¿esta medida tiene que **cambiar**? Si la respuesta es no, un valor fijo está perfecto. Estas funciones no son mejores por ser más nuevas; son mejores cuando hay algo que de verdad se adapta.`,
      codeExample: {
        html: `<header class="encabezado">\n  <h1 class="nombre">Ana Martínez</h1>\n  <p class="titulo-profesional">Desarrolladora Front End</p>\n</header>\n<main class="contenido">\n  <p>Redimensioná la vista previa: el nombre y el aire cambian solos.</p>\n</main>`,
        css: `.encabezado {\n  padding: clamp(1rem, 5vw, 3rem);\n  background-color: #8b5cf6;\n  color: white;\n}\n\n.nombre {\n  font-size: clamp(1.5rem, 6vw, 3rem);\n  margin: 0;\n}\n\n.titulo-profesional {\n  font-size: clamp(0.875rem, 2.5vw, 1.125rem);\n  margin: 4px 0 0;\n}\n\n.contenido {\n  width: min(760px, 100% - 3rem);\n  margin: 0 auto;\n  padding: 24px 0;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "26-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué puede hacer calc() que un valor suelto como 300px o 100% no puede?",
      options: [
        { id: "a", text: "Aplicar un estilo solo en pantallas chicas", isCorrect: false },
        {
          id: "b",
          text: "Combinar unidades distintas en una misma operación, como 100% menos 4rem",
          isCorrect: true,
        },
        { id: "c", text: "Repetir una medida en varias reglas sin escribirla dos veces", isCorrect: false },
        { id: "d", text: "Redondear una medida al píxel más cercano", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Pensá en el problema del que salió: querés todo el ancho disponible menos una cantidad fija de aire, y no sabés cuánto mide el padre.",
      explanation:
        "calc() deja mezclar unidades que se resuelven en momentos distintos: el porcentaje lo calcula el navegador cuando ya sabe cuánto mide el padre, y el rem depende del tamaño de fuente. Escribiendo el CSS no conocés ninguno de los dos, así que la cuenta la tiene que hacer el navegador.",
    },
    {
      id: "26-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt:
        "Completá el nombre de la función que permite restar 80px a la altura total de la ventana:",
      codeTemplate: {
        html: `<section class="principal">Ocupa la pantalla menos la barra</section>`,
        cssPrefix: ".principal {\n  min-height: ",
        cssSuffix: "(100vh - 80px);\n}",
        blanks: ["calc"],
      },
      validation: { type: "exact", answer: "calc" },
      hint: "Cuatro letras, y viene de la palabra calcular. Se escribe en minúsculas.",
      explanation:
        "calc() es la función que hace la cuenta. El caso de 100vh menos la altura de una barra fija es el más común de todos: antes de que existiera se resolvía midiendo la barra con JavaScript.",
    },
    {
      id: "26-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Dale a la clase 'contenido' un ancho igual a todo el disponible menos 4rem, usando calc(). Agregá también padding: 16px y background-color: lightblue.",
      codeTemplate: {
        html: `<div class="contenido">Todo el ancho menos 4rem</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".contenido {\n  width: calc(100% - 4rem);\n  padding: 16px;\n  background-color: lightblue;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Ojo con los espacios: calc(100% - 4rem) lleva un espacio antes y después del guion. Sin ellos el navegador no lee una resta y la medida no se aplica.",
      explanation:
        "El ancho se escribe calc(100% - 4rem). Los espacios alrededor del guion son obligatorios, porque sin ellos el navegador interpreta -4rem como un número negativo pegado al primer valor en lugar de una resta.",
    },
    {
      id: "26-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Una caja tiene width: min(600px, 100%). ¿Cuánto mide dentro de un padre de 1200px?",
      options: [
        { id: "a", text: "600px, porque min() se queda con el valor más chico de los dos", isCorrect: true },
        { id: "b", text: "1200px, porque 100% del padre es el valor más grande", isCorrect: false },
        { id: "c", text: "900px, porque promedia los dos valores", isCorrect: false },
        { id: "d", text: "No se aplica ninguna medida: min() necesita tres valores", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "En un padre de 1200px, 100% son 1200px. De 600px y 1200px, ¿cuál es el más chico?",
      explanation:
        "min() elige el más chico en cada momento. Con un padre de 1200px los candidatos son 600px y 1200px, así que gana 600px. Por eso min() funciona en la práctica como un techo, aunque el nombre sugiera lo contrario: le pusiste un máximo de 600px.",
    },
    {
      id: "26-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Arrastrá cada función a lo que hace en la práctica:",
      dragItems: [
        { id: "drag-1", content: "calc(100% - 2rem)", correctZone: "zone-cuenta" },
        { id: "drag-2", content: "min(600px, 100%)", correctZone: "zone-techo" },
        { id: "drag-3", content: "max(300px, 50%)", correctZone: "zone-piso" },
        { id: "drag-4", content: "clamp(1rem, 4vw, 3rem)", correctZone: "zone-los-tres" },
      ],
      dropZones: [
        { id: "zone-cuenta", label: "Mezcla dos unidades en una operación" },
        { id: "zone-techo", label: "Pone un techo: no pasa de ahí" },
        { id: "zone-piso", label: "Pone un piso: no baja de ahí" },
        { id: "zone-los-tres", label: "Piso, crecimiento y techo a la vez" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-cuenta",
          "drag-2": "zone-techo",
          "drag-3": "zone-piso",
          "drag-4": "zone-los-tres",
        },
      },
      hint: "No te guíes por el nombre de la función, guiate por el resultado: min() elige el más chico, y eso en la práctica es un límite máximo.",
      explanation:
        "calc() hace la cuenta. min() se queda con el más chico, así que actúa como techo. max() se queda con el más grande, así que actúa como piso. clamp() junta las tres cosas en una línea: mínimo, valor ideal y máximo.",
    },
    {
      id: "26-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Hacé que el título de la clase 'nombre' tenga un tamaño fluido con clamp(): nunca menos de 1.5rem, ideal 6vw, nunca más de 3rem. Agregá también color: #8b5cf6.",
      codeTemplate: {
        html: `<h1 class="nombre">Ana Martínez</h1>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: ".nombre {\n  font-size: clamp(1.5rem, 6vw, 3rem);\n  color: #8b5cf6;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "El orden de los tres valores es siempre mínimo, ideal, máximo, separados por comas. El del medio es el que crece.",
      explanation:
        "clamp(1.5rem, 6vw, 3rem) da un piso de 1.5rem, un crecimiento de 6vw y un techo de 3rem. El valor del medio es el único que tiene que ser relativo a algo que cambie: con un valor fijo no habría nada que ajustar.",
    },
    {
      id: "26-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Reproducí el diseño objetivo del encabezado del CV: la clase 'encabezado' con padding fluido clamp(1rem, 5vw, 3rem) y background-color: #8b5cf6; y la clase 'contenido' con un ancho de min(760px, 100% - 3rem) y margin: 0 auto.",
      codeTemplate: {
        html: `<header class="encabezado">\n  <h1>Ana Martínez</h1>\n</header>\n<main class="contenido">\n  <p>Perfil profesional y experiencia.</p>\n</main>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".encabezado {\n  padding: clamp(1rem, 5vw, 3rem);\n  background-color: #8b5cf6;\n}\n\n.contenido {\n  width: min(760px, 100% - 3rem);\n  margin: 0 auto;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Son dos reglas. Adentro de min() podés escribir una cuenta sin envolverla en calc(): ahí ya está implícito.",
      explanation:
        "El encabezado usa clamp() para que el aire crezca con la pantalla entre 1rem y 3rem. El contenido usa min(760px, 100% - 3rem): en un monitor grande queda limitado a 760px, y en un teléfono deja 1.5rem de aire a cada lado. Dentro de min() la cuenta no necesita calc().",
    },
    {
      id: "26-ej-08",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 8,
      prompt: "¿Cuál de estas cuatro declaraciones está mal escrita y no va a funcionar?",
      options: [
        { id: "a", text: "width: calc(100% - 4rem);", isCorrect: false },
        { id: "b", text: "padding: min(5vw, 32px);", isCorrect: false },
        { id: "c", text: "width: calc(100%-4rem);", isCorrect: true },
        { id: "d", text: "font-size: clamp(1rem, 3vw, 2rem);", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Mirá con cuidado los espacios alrededor del guion en las dos declaraciones que usan calc().",
      explanation:
        "calc(100%-4rem) no funciona: sin espacios alrededor del guion, el navegador lee -4rem como un número negativo pegado al primer valor en lugar de una resta. Los espacios son obligatorios con + y con -. Las otras tres declaraciones están bien escritas.",
    },
  ],
};
