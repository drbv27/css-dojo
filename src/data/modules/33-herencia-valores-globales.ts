import type { ModuleData } from "@/types";

export const herenciaValoresGlobalesModule: ModuleData = {
  slug: "herencia-valores-globales",
  title: "Herencia y valores globales",
  description:
    "Qué propiedades pasan solas de padre a hijo y cuáles no, y las cuatro palabras que te dejan decidirlo a mano: inherit, initial, unset y revert.",
  order: 17,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-selectores",
  icon: "Network",
  lessons: [
    {
      id: "33-leccion-01",
      title: "Por qué el enlace no toma el color de su padre",
      content: `## La pregunta que ya te hiciste

Escribiste esto:

\`\`\`css
.tarjeta {
  color: #6d4aac;
}
\`\`\`

Y todo el texto de la tarjeta se puso morado... **menos el enlace**, que sigue azul y subrayado. No le pusiste ninguna regla al enlace. No hay especificidad peleando. Y sin embargo no obedeció.

No es un bug. Son dos cosas distintas pasando a la vez.

## Primera: algunas propiedades se heredan y otras no

\`color\` **se hereda**: si no se lo decís al hijo, toma el del padre. Por eso el resto del texto se puso morado sin que lo tocaras.

\`border\` **no se hereda**: ponerle un borde a la tarjeta no le pone un borde a cada párrafo de adentro. Y menos mal.

La regla de fondo no es una lista para memorizar: **se hereda lo que tiene que ver con el texto** —\`color\`, \`font-family\`, \`font-size\`, \`line-height\`, \`text-align\`— y no se hereda lo que tiene que ver con la caja —\`border\`, \`padding\`, \`margin\`, \`background\`, \`width\`—.

Tiene sentido: querés que el texto se vea parejo, y no querés que cada hijo repita el borde del padre.

## Segunda: el enlace SÍ tiene una regla, y no la escribiste vos

Y acá conviene nombrar la etiqueta, porque la vas a googlear así: la pregunta "por qué un \`<a>\` no hereda el color de su padre" es una de las más buscadas de CSS, y esta es la respuesta.

El navegador trae su propia hoja de estilos. Ahí adentro dice, más o menos:

\`\`\`css
a:-webkit-any-link {
  color: -webkit-link;
  text-decoration: underline;
}
\`\`\`

Y acá está el punto que hay que entender: **una regla directa, por débil que sea, le gana siempre a la herencia**. No compiten en la misma cancha. La herencia es lo que pasa **cuando no hay ninguna regla**; en cuanto hay una, aunque venga del navegador, la herencia no participa.

Por eso el enlace no se puso morado: tenía una regla propia.

## Y por eso existen las cuatro palabras

Si querés que el enlace tome el color de su padre, tenés que **pedirlo**:

\`\`\`css
.tarjeta a {
  color: inherit;
}
\`\`\`

\`inherit\` es la primera de las cuatro. Las otras tres —\`initial\`, \`unset\` y \`revert\`— resuelven las variantes de la misma pregunta, y son las lecciones que siguen.

## Dónde encaja esto

Especificidad te explicó **cuál de dos reglas gana**. Herencia te explica **qué pasa cuando no hay ninguna**. Son las dos mitades de la misma pregunta: cómo decide el navegador.`,
      order: 1,
    },
    {
      id: "33-leccion-02",
      title: "inherit e initial: pedir el del padre, o volver a cero",
      content: `## inherit: dame el de mi papá

\`\`\`css
.aviso a { color: inherit; }
\`\`\`

Sirve para dos cosas distintas, y conviene separarlas:

**1. Recuperar una herencia que una regla tapó.** Es el caso del enlace: la hoja del navegador le puso un color, y vos querés el del contenedor.

**2. Forzar una herencia que no existe.** \`border\` no se hereda nunca, pero podés pedirla:

\`\`\`css
.hijo { border: inherit; }
\`\`\`

Se usa poco, y cuando se usa suele ser mejor idea repensar el marcado.

## Lo bueno de inherit: no repite el valor

\`\`\`css
.aviso { color: #6d4aac; }
.aviso a { color: inherit; }     /* no dice cual color */
.aviso a { color: #6d4aac; }     /* lo repite, y se va a desincronizar */
\`\`\`

Las dos se ven igual hoy. La diferencia aparece el día que cambiás el color del contenedor: con \`inherit\` el enlace lo sigue solo; con el valor repetido, alguien se olvida y quedan de colores distintos.

## initial: el valor de fábrica de la propiedad

\`initial\` **no vuelve al valor del padre ni al de tu hoja**: vuelve al valor que la especificación de CSS le da a esa propiedad, antes de que nadie la tocara.

Y ahí hay una sorpresa que muerde:

\`\`\`css
.hijo { color: initial; }
\`\`\`

El valor inicial de \`color\` es **negro**. No el del padre, no el del navegador: negro. Si tu página es oscura, acabás de escribir texto negro sobre fondo negro.

## El resumen de las dos

| Palabra | A dónde vuelve |
|---|---|
| \`inherit\` | al valor que tiene el padre, sea cual sea |
| \`initial\` | al valor de fábrica de la propiedad, ignorando a todos |

\`inherit\` lo vas a usar seguido. \`initial\` es más raro, y casi siempre lo que en realidad querías era la palabra de la lección que sigue.`,
      order: 2,
    },
    {
      id: "33-leccion-03",
      title: "unset y revert: las dos que casi nadie distingue",
      content: `## unset es un camaleón

\`unset\` hace **una de dos cosas, según la propiedad**:

- Si la propiedad **se hereda** —\`color\`, \`font-family\`—, se comporta como \`inherit\`.
- Si **no se hereda** —\`border\`, \`padding\`—, se comporta como \`initial\`.

O sea: *"sacá lo que yo escribí y dejá que pase lo que tenía que pasar"*.

\`\`\`css
.hijo {
  color: unset;    /* = inherit, porque color se hereda */
  border: unset;   /* = initial, porque border no se hereda */
}
\`\`\`

## all: unset, el borrón

\`all\` es una propiedad que representa **a todas las demás a la vez**:

\`\`\`css
.limpio { all: unset; }
\`\`\`

Eso saca de un plumazo todo lo que tu CSS le puso al elemento. Se usa sobre todo para desarmar un botón:

\`\`\`css
.boton-texto {
  all: unset;
  cursor: pointer;
  color: #6d4aac;
}
\`\`\`

Un \`<button>\` viene con borde, fondo gris, padding y fuente propia del navegador. \`all: unset\` los borra todos juntos en vez de pelear con seis declaraciones.

**Y el precio, que hay que decir:** también borra cosas que servían. Un botón con \`all: unset\` pierde el foco visible, y alguien que navega con teclado deja de saber dónde está. Si lo usás, devolvé el \`:focus-visible\` a mano.

## revert: volver a lo que decía el navegador

\`revert\` es la más nueva y la más precisa de las cuatro. Vuelve al valor que tendría la propiedad **si tu hoja no existiera** — o sea, al de la hoja del navegador.

La diferencia con \`initial\` se ve clarísima en un título:

\`\`\`css
h1 { font-size: initial; }   /* 16px: el valor de fabrica de font-size */
h1 { font-size: revert; }    /* 32px: lo que el navegador le da a un h1 */
\`\`\`

\`initial\` te deja un \`h1\` del tamaño de un párrafo. \`revert\` te deja un \`h1\` con cara de \`h1\`.

## Las cuatro, juntas

| Palabra | Vuelve a |
|---|---|
| \`inherit\` | el valor del padre |
| \`initial\` | el valor de fábrica de la propiedad |
| \`unset\` | inherit si se hereda, initial si no |
| \`revert\` | lo que diría el navegador sin tu hoja |

Si tuvieras que quedarte con dos: **\`inherit\`** para pedir el del padre, y **\`revert\`** para deshacer lo que escribiste.`,
      order: 3,
    },
    {
      id: "33-leccion-04",
      title: "Herencia y especificidad: las dos mitades",
      content: `## La pregunta completa

Cuando el navegador tiene que decidir qué color pintar en un elemento, sigue este orden:

**1. ¿Hay alguna regla que apunte a este elemento para esta propiedad?**

Si hay varias, gana la de mayor especificidad, y si empatan gana la última. Eso ya lo sabés: es el módulo anterior.

**2. Si no hay ninguna, ¿la propiedad se hereda?**

Si se hereda, toma la del padre. Si no, toma su valor inicial.

**Y el punto que ordena todo: el paso 2 sólo corre si el paso 1 no encontró nada.** Una regla, por débil que sea, gana siempre contra la herencia. No compiten: se turnan.

## Por eso el enlace no obedecía

Vos pensaste "mi regla \`.aviso\` tiene más peso que lo que sea que tenga el enlace". Y era verdad, pero irrelevante: la regla del navegador sobre el enlace **existe**, así que la herencia ni se consultó. No había competencia que ganar.

## Y por eso !important tampoco lo arreglaba

Alguien, llegado a este punto, prueba:

\`\`\`css
.aviso { color: #6d4aac !important; }
\`\`\`

Y el enlace **sigue azul**. Porque \`!important\` sube el peso de esa regla... sobre \`.aviso\`, que es el contenedor. El enlace nunca estuvo compitiendo por esa regla: estaba obedeciendo la suya.

Es un buen momento para ver que \`!important\` no es "hacé que funcione": es "subile el peso a esta regla", y si la regla apunta al elemento equivocado no hace nada.

## La regla para depurar

Cuando un elemento no toma un valor que "debería":

1. Abrí el inspector y mirá si hay **alguna regla tachada o vigente** para esa propiedad en ESE elemento.
2. Si la hay, es un problema de **especificidad**: el módulo anterior.
3. Si no hay ninguna, es un problema de **herencia**: o la propiedad no se hereda, o el padre tampoco la tiene.

Dos preguntas, y cubren casi todo lo que te va a pasar con CSS el resto de tu carrera.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "33-ej-01",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 1,
      prompt:
        "Le ponés color a un contenedor y todo su texto lo toma, menos el enlace de adentro, al que no le escribiste ninguna regla. ¿Por qué?",
      options: [
        { id: "a", text: "Porque el enlace ya tiene una regla propia, la de la hoja del navegador, y una regla directa le gana a la herencia", isCorrect: true },
        { id: "b", text: "Porque la propiedad color no se hereda hacia elementos en línea", isCorrect: false },
        { id: "c", text: "Porque el selector del contenedor tiene menos especificidad que el enlace", isCorrect: false },
        { id: "d", text: "Porque la herencia sólo funciona hacia hijos directos y el enlace es un nieto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "La herencia es lo que pasa cuando NO hay ninguna regla para esa propiedad. Preguntate si el enlace de verdad no tiene ninguna.",
      explanation:
        "El navegador trae su propia hoja de estilos y ahí el enlace ya tiene color y subrayado. La herencia no compite con las reglas: actúa sólo cuando no hay una. Por eso la solución no es subir la especificidad del contenedor, sino pedir la herencia explícitamente con color: inherit en el enlace.",
    },
    {
      id: "33-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "El enlace de adentro no toma el color de su contenedor. Dale a la clase 'aviso' color: #6d4aac y padding: 16px, y hacé que el enlace de adentro herede ese color escribiendo una regla para 'aviso a' con color: inherit.",
      codeTemplate: {
        html: `<div class="aviso">Leé nuestra <a href="#">política de privacidad</a> antes de seguir.</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".aviso {\n  color: #6d4aac;\n  padding: 16px;\n}\n.aviso a {\n  color: inherit;\n}",
      validation: { type: "css-rules" },
      hint: "No hace falta repetir el color en el enlace: hay una palabra que significa exactamente lo que toma de su padre.",
      explanation:
        "El enlace ya tenia una regla propia, la del navegador, y una regla directa le gana a la herencia. inherit es pedir la herencia de vuelta, y tiene la ventaja de que si mañana cambiás el color del contenedor el enlace lo sigue solo.",
    },
    {
      id: "33-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Escribís color: initial en un elemento. ¿Qué color queda?",
      options: [
        { id: "a", text: "El del elemento padre", isCorrect: false },
        { id: "b", text: "Negro, que es el valor de fábrica de la propiedad color", isCorrect: true },
        { id: "c", text: "El que le da la hoja de estilos del navegador a ese elemento", isCorrect: false },
        { id: "d", text: "Transparente, porque initial borra el valor", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "initial no mira al padre ni al navegador: mira la especificación de CSS. Preguntate qué dice la especificación que vale color cuando nadie la tocó.",
      explanation:
        "initial vuelve al valor que la especificación le da a la propiedad, y para color ese valor es negro. En una página de fondo oscuro eso es texto negro sobre negro. Lo que casi siempre se quería en su lugar era unset o revert.",
    },
    {
      id: "33-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "¿Qué hace unset en una propiedad que NO se hereda, como border?",
      options: [
        { id: "a", text: "Se comporta como inherit y toma el borde del padre", isCorrect: false },
        { id: "b", text: "No hace nada, porque unset sólo aplica a propiedades heredables", isCorrect: false },
        { id: "c", text: "Se comporta como initial y vuelve al valor de fábrica", isCorrect: true },
        { id: "d", text: "Vuelve al valor que le da la hoja del navegador", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "unset es un camaleón: hace una de dos cosas según la propiedad. La pregunta es cuál de las dos le toca a una que no se hereda.",
      explanation:
        "unset significa sacá lo que yo escribí y dejá que pase lo que tenía que pasar. En una propiedad heredable eso es inherit; en una que no se hereda, initial. border no se hereda, así que unset la manda a su valor de fábrica.",
    },
    {
      id: "33-ej-05",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 5,
      prompt:
        "Escribís h1 { font-size: initial } y el título queda del tamaño de un párrafo. ¿Qué palabra usabas para que quede con tamaño de h1?",
      options: [
        { id: "a", text: "revert, que vuelve al valor que le daría la hoja del navegador", isCorrect: true },
        { id: "b", text: "inherit, que toma el tamaño del contenedor", isCorrect: false },
        { id: "c", text: "unset, que en font-size se comporta como initial", isCorrect: false },
        { id: "d", text: "auto, que deja que el navegador decida", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "El h1 es grande porque la hoja del navegador lo hace grande, no porque font-size valga eso de fábrica. Necesitás la palabra que vuelve a la hoja del navegador.",
      explanation:
        "El valor de fábrica de font-size es el tamaño normal del texto, así que initial deja el h1 como un párrafo. revert vuelve a lo que la propiedad tendría si tu hoja no existiera, que en un h1 es el tamaño grande que le da el navegador. unset aquí también daría initial, porque font-size sí se hereda pero el h1 tiene regla propia del navegador.",
    },
    {
      id: "33-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Desarmá el botón: a la clase `.boton-texto` dale all: unset para sacarle el aspecto que trae el navegador, y devolvele cursor: pointer, color: #6d4aac y font-weight: bold.",
      codeTemplate: {
        html: `<button class="boton-texto">Ver mas</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".boton-texto {\n  all: unset;\n  cursor: pointer;\n  color: #6d4aac;\n  font-weight: bold;\n}",
      validation: { type: "css-rules" },
      hint: "all representa a todas las propiedades a la vez. Va primero, porque lo que escribas después tiene que sobrevivir al borrón.",
      explanation:
        "all: unset borra de un plumazo el borde, el fondo gris, el padding y la fuente que el navegador le pone a un button. Y borra también el foco visible: si usás esto en producción, devolvé el :focus-visible a mano o alguien que navega con teclado deja de saber dónde está parado.",
    },
    {
      id: "33-ej-07",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt:
        "En la clase 'tarjeta' poné color: #2c2c2c y font-family: Georgia, serif. Y hacé que el enlace de adentro tome los dos del contenedor, con una regla para 'tarjeta a' que use color: inherit y font-family: inherit.",
      codeTemplate: {
        html: `<div class="tarjeta">Escribile a <a href="#">soporte</a> si algo no anda.</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  color: #2c2c2c;\n  font-family: Georgia, serif;\n}\n.tarjeta a {\n  color: inherit;\n  font-family: inherit;\n}",
      validation: { type: "css-rules" },
      hint: "No repitas los valores en el enlace: hay una palabra que significa exactamente lo que tenga el padre, y que sigue funcionando si mañana cambiás el padre.",
      explanation:
        "font-family sí se hereda, así que el enlace ya la tenía; color no llegaba porque el enlace tiene regla propia del navegador. Escribir inherit en los dos deja el bloque parejo y, sobre todo, no repite valores que después se desincronizan.",
    },
    {
      id: "33-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Le ponés !important al color del contenedor y el enlace de adentro SIGUE azul. ¿Por qué?",
      options: [
        { id: "a", text: "Porque !important no funciona sobre propiedades que se heredan", isCorrect: false },
        { id: "b", text: "Porque el enlace tiene su propia regla y !important sólo subió el peso de la del contenedor, que nunca competía por ese elemento", isCorrect: true },
        { id: "c", text: "Porque la hoja del navegador también usa !important y gana por ser más antigua", isCorrect: false },
        { id: "d", text: "Porque !important necesita ir acompañado de inherit para propagarse", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Preguntate a qué elemento apunta la regla que reforzaste, y a qué elemento apunta la que gana.",
      explanation:
        "!important no es hacé que funcione: es subile el peso a esta regla. La regla reforzada apunta al contenedor, y el enlace nunca estuvo compitiendo por ella, estaba obedeciendo la suya. Por eso el arreglo es escribir una regla PARA el enlace, con inherit.",
    },
    {
      /**
       * EL RETO INTEGRADOR del modulo. Cierra `herencia-valores-globales`
       * haciendo que el alumno use en UNA sola tarea las cuatro palabras y la
       * distincion que las ordena: cuando hay regla manda la regla, y la
       * herencia solo actua cuando no hay ninguna.
       *
       * No declara `targetCSS`: se deriva de `retoPasos` con `cssEsperadoDe`.
       */
      id: "33-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 9,
      prompt:
        "Mini reto. Arreglá la ficha cumpliendo los cuatro pasos. Ojo con el paso 4: initial y revert NO dan lo mismo en un título, y acá querés que siga pareciendo un título.",
      retoPasos: [
        {
          instruccion:
            "Dale a .ficha color #2c2c2c y font-family Georgia, serif, que son los que el resto va a heredar.",
          esperado: ".ficha { color: #2c2c2c; font-family: Georgia, serif; }",
        },
        {
          instruccion:
            "El enlace no toma ese color porque tiene regla propia del navegador: escribí .ficha a con color inherit.",
          esperado: ".ficha a { color: inherit; }",
        },
        {
          instruccion:
            "Desarmá el botón .ficha-boton con all unset, y devolvele cursor pointer y color #6d4aac.",
          esperado:
            ".ficha-boton { all: unset; cursor: pointer; color: #6d4aac; }",
        },
        {
          instruccion:
            "El .ficha-titulo quedó chico porque alguien le escribió un font-size: devolvele el tamaño que le daría el navegador con revert.",
          esperado: ".ficha-titulo { font-size: revert; }",
        },
      ],
      codeTemplate: {
        html: `<div class="ficha"><h2 class="ficha-titulo">Tu cuenta</h2><p>Escribile a <a href="#">soporte</a> si algo no anda.</p><button class="ficha-boton">Ver detalle</button></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      referenceSolution:
        ".ficha {\n  color: #2c2c2c;\n  font-family: Georgia, serif;\n}\n.ficha a {\n  color: inherit;\n}\n.ficha-boton {\n  all: unset;\n  cursor: pointer;\n  color: #6d4aac;\n}\n.ficha-titulo {\n  font-size: revert;\n}",
      validation: { type: "css-rules" },
      hint: "Los cuatro pasos son la misma idea vista de cuatro maneras: cuando hay una regla manda la regla, y la herencia sólo actúa cuando no hay ninguna.",
      explanation:
        "El reto junta las cuatro palabras. Y el paso 4 es el que separa entender de memorizar: initial te dejaba un título del tamaño de un párrafo, porque vuelve al valor de fábrica de font-size; revert vuelve a lo que diría el navegador, que para un h2 es un título.",
    },
  ],
};
