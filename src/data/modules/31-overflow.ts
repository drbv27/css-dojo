import type { ModuleData } from "@/types";

export const overflowModule: ModuleData = {
  slug: "overflow",
  title: "Overflow: cuando el contenido no entra",
  description:
    "Qué hace el navegador cuando el contenido es más grande que su caja, y cómo elegís vos qué pasa: recortarlo, dejarlo salir o darle scroll propio.",
  order: 7,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-caja",
  icon: "ArrowDownUp",
  lessons: [
    {
      id: "31-leccion-01",
      title: "El contenido no entra: los cuatro valores",
      content: `## El problema que resuelve

En el módulo de dimensiones le pusiste una altura fija a una caja y el texto se salió por abajo. No fue un error tuyo: es lo que el navegador hace **por defecto**.

\`\`\`css
.tarjeta {
  height: 100px;
}
\`\`\`

Si adentro hay 300px de texto, los 200px sobrantes **se dibujan igual**, encima de lo que venga después. La caja mide 100px; el contenido, no.

## Los cuatro valores

\`\`\`css
.caja { overflow: visible; }  /* el default: se sale y se ve */
.caja { overflow: hidden; }   /* se recorta, no hay forma de llegar a el */
.caja { overflow: scroll; }   /* barras SIEMPRE, entre o no entre */
.caja { overflow: auto; }     /* barras SOLO si hace falta */
\`\`\`

## Cuál usar

**\`auto\` es el que querés casi siempre.** Da scroll cuando hace falta y no ocupa lugar cuando no.

\`scroll\` se ve prolijo en la maqueta y molesto en la realidad: te deja una barra gris muerta en cajas que entran perfecto.

Y \`hidden\` tiene una trampa que hay que decir de entrada: **lo que recortás deja de existir para el usuario**. Sin barra y sin teclado, no hay forma de llegar a ese contenido. Es correcto para una decoración que se pasa del borde, y es un error para texto.

## Lo que se ve

Con una caja de 100px y texto de sobra:

| Valor | Qué pasa |
|---|---|
| \`visible\` | el texto pisa lo de abajo |
| \`hidden\` | el texto se corta a la mitad de un renglón |
| \`scroll\` | aparece una barra, y otra vacía a la derecha |
| \`auto\` | aparece una barra, y sólo la que hace falta |

En las lecciones que siguen vas a separar los dos ejes, hacer un panel con scroll propio, y ver la trampa que hace que un \`position: sticky\` deje de funcionar sin que nadie lo haya tocado.`,
      order: 1,
    },
    {
      id: "31-leccion-02",
      title: "Los dos ejes por separado",
      content: `## overflow es un atajo de dos

Cuando escribís \`overflow: auto\` estás escribiendo dos propiedades de una sola vez:

\`\`\`css
.caja { overflow-x: auto; overflow-y: auto; }
\`\`\`

Y muchas veces no querés lo mismo en los dos ejes.

## El caso típico: una tabla ancha

Una tabla de ocho columnas no entra en un celular. Lo que querés es que se pueda arrastrar **de costado**, no que aparezca una barra vertical inútil:

\`\`\`css
.tabla-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}
\`\`\`

## La trampa de mezclar visible con otra cosa

Acá hay una regla rara y hay que saberla, porque cuando te pasa parece un bug del navegador:

**Si un eje tiene \`visible\` y el otro tiene cualquier otra cosa, el \`visible\` se convierte en \`auto\` solo.**

\`\`\`css
.caja {
  overflow-x: visible;   /* pediste visible... */
  overflow-y: hidden;    /* ...pero esto lo convierte en auto */
}
\`\`\`

No es un capricho: recortar en un eje y dejar salir en el otro no se puede dibujar. El navegador necesita un rectángulo donde recortar, y un rectángulo tiene los cuatro lados.

Si de verdad querés recortar sólo uno, la salida es otra: usar \`clip\` o repensar la caja.

## Lo práctico

En el día a día vas a escribir \`overflow: auto\` casi siempre, y a separar los ejes sólo cuando tengas un caso concreto: la tabla ancha, un carrusel horizontal, una barra de pestañas que no entra.`,
      order: 2,
    },
    {
      id: "31-leccion-03",
      title: "Un panel con scroll propio",
      content: `## El patrón

Una lista de comentarios que puede crecer sin límite, adentro de una página que no querés que crezca con ella. La lista tiene que tener **su propia barra**.

\`\`\`css
.comentarios {
  max-height: 300px;
  overflow-y: auto;
}
\`\`\`

## Por qué max-height y no height

Con \`height: 300px\` el panel mide 300px **siempre**, aunque haya un solo comentario: te queda un hueco vacío abajo.

Con \`max-height: 300px\` el panel mide lo que necesita **hasta** 300px, y recién ahí aparece la barra. Es la diferencia entre "medí esto" y "no pases de esto".

## El detalle que se olvida: el aire de la barra

Cuando aparece la barra, se come ancho del contenido. Si tu panel tiene \`padding\` justo, el texto queda pegado a la barra.

\`\`\`css
.comentarios {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 12px;
}
\`\`\`

## Y uno de accesibilidad que casi nadie sabe

Un div con scroll **no recibe foco de teclado por defecto**. Alguien que navega con Tab llega hasta el panel y no puede desplazarlo, porque el foco nunca entra.

La solución es una línea:

\`\`\`css
.comentarios { tabindex: 0; }  /* NO: tabindex es HTML, no CSS */
\`\`\`

Va en el HTML: \`<div class="comentarios" tabindex="0">\`. Lo nombramos acá porque el problema **lo crea el CSS** y quien lo escribió sos vos.`,
      order: 3,
    },
    {
      id: "31-leccion-04",
      title: "El sticky que dejó de andar",
      content: `## La escena

Tenías un menú lateral pegajoso y funcionaba:

\`\`\`css
.menu-lateral {
  position: sticky;
  top: 1rem;
}
\`\`\`

Alguien —tal vez vos, la semana pasada— agregó un \`overflow: hidden\` a un contenedor de más arriba para arreglar otra cosa. Y el sticky **dejó de pegarse**. Sin error. Sin advertencia. Sin que nadie tocara el menú.

## Cómo se depura

No busques el bug en el sticky: el sticky está bien. **Subí por los ancestros** con el inspector, uno por uno, mirando la propiedad \`overflow\` de cada uno.

En DevTools, con el elemento seleccionado, andá al panel Computed y filtrá por \`overflow\`. Después hacé lo mismo con el padre. Y con el abuelo.

El culpable es el primero que tenga \`overflow\` en algo distinto de \`visible\`.

## Por qué pasa

\`position: sticky\` se pega **dentro de su contenedor de scroll más cercano**. Mientras nadie declara \`overflow\`, ese contenedor es la página entera, y el elemento se pega respecto de la ventana: lo que vos querías.

En cuanto un ancestro declara \`overflow: hidden\`, \`auto\` o \`scroll\`, **ese ancestro pasa a ser el contenedor de scroll**. El sticky sigue funcionando perfecto... adentro de una caja que no scrollea. Y una caja que no scrollea nunca dispara el pegado.

## Cómo se arregla

Casi nunca tocando el sticky. Se arregla en el ancestro:

1. **Sacarle el \`overflow\`** si estaba puesto para algo que ya no hace falta. Es lo más común: \`overflow: hidden\` se escribe mucho como parche para contener floats, y eso hoy se resuelve de otras maneras.
2. **Mover el sticky afuera** de ese contenedor.
3. **Darle altura al ancestro** para que scrollee de verdad, si ese scroll interno era lo que querías.

## La lección que queda

Esta es la primera vez que ves una propiedad que **rompe otra a distancia**, sin tocarla. Van a aparecer más. La forma de encararlas es siempre la misma: cuando algo deja de andar y su propio CSS está bien, **el problema está arriba**.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "31-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Tenés una caja con altura fija y más texto del que entra. ¿Qué hace el navegador si no escribís ningún overflow?",
      options: [
        { id: "a", text: "Achica la letra hasta que el texto entre en la caja", isCorrect: false },
        { id: "b", text: "Dibuja el texto igual, saliéndose de la caja y encima de lo que venga después", isCorrect: true },
        { id: "c", text: "Agrega una barra de scroll automáticamente", isCorrect: false },
        { id: "d", text: "Recorta el texto en el borde de la caja", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El valor por defecto se llama visible, y el nombre te dice exactamente qué hace con lo que sobra.",
      explanation:
        "El default es overflow: visible. La caja mide lo que vos dijiste, pero el contenido se sigue dibujando entero, aunque quede fuera. Por eso el texto se monta sobre lo de abajo: no es un bug, es la regla, y las otras tres opciones son justamente lo que tenés que pedir a mano.",
    },
    {
      id: "31-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "La clase 'panel' tiene altura fija y le sobra texto. Dale height: 120px y overflow: auto para que el texto quede adentro con su propia barra. Agregale también border: 1px solid #cccccc y padding: 12px.",
      codeTemplate: {
        html: `<div class="panel">Un texto largo que no entra en 120px de alto y por eso necesita su propia barra de scroll en lugar de salirse de la caja y pisar lo que venga después.</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".panel {\n  height: 120px;\n  overflow: auto;\n  border: 1px solid #cccccc;\n  padding: 12px;\n}",
      validation: { type: "css-rules" },
      hint: "auto y scroll parecen lo mismo hasta que el texto entra: scroll deja la barra igual, auto la muestra solo cuando hace falta.",
      explanation:
        "Con height fija y overflow: auto el texto que sobra queda accesible dentro del panel. Con scroll funcionaría igual acá, pero dejaría una barra muerta el día que el texto entre; con hidden el final del texto sería inalcanzable para el usuario.",
    },
    {
      id: "31-ej-03",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 3,
      prompt:
        "Escribís overflow-x: visible junto con overflow-y: hidden. ¿Qué hace el navegador con el eje horizontal?",
      options: [
        { id: "a", text: "Lo deja en visible, porque cada eje es independiente del otro", isCorrect: false },
        { id: "b", text: "Lo convierte en auto, porque no se puede recortar en un eje y dejar salir en el otro", isCorrect: true },
        { id: "c", text: "Ignora la regla entera y deja los dos ejes en visible", isCorrect: false },
        { id: "d", text: "Lo convierte en hidden, para que coincida con el otro eje", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Pensá en la forma del recorte: el navegador necesita un rectángulo, y un rectángulo tiene cuatro lados.",
      explanation:
        "Recortar en un eje y dejar salir en el otro no se puede dibujar. Por eso, si un eje pide visible y el otro pide cualquier otra cosa, el visible se convierte en auto. No es un capricho del navegador, es una consecuencia de que el recorte es un rectángulo.",
    },
    {
      id: "31-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "La tabla no entra a lo ancho. Dale a la clase 'tabla-scroll' overflow-x: auto y overflow-y: hidden, más max-width: 100%, para que se arrastre de costado sin barra vertical inútil.",
      codeTemplate: {
        html: `<div class="tabla-scroll"><table><tr><td>Enero</td><td>Febrero</td><td>Marzo</td><td>Abril</td><td>Mayo</td><td>Junio</td></tr></table></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tabla-scroll {\n  overflow-x: auto;\n  overflow-y: hidden;\n  max-width: 100%;\n}",
      validation: { type: "css-rules" },
      hint: "Son dos propiedades distintas, una por eje. El atajo overflow las escribe iguales, y acá las querés distintas.",
      explanation:
        "overflow-x: auto da la barra horizontal sólo cuando la tabla no entra, y overflow-y: hidden evita la vertical que no hace falta. Es el patrón estándar para una tabla ancha en un celular.",
    },
    {
      id: "31-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Querés un panel de comentarios que crezca hasta 300px y recién ahí tenga barra. ¿Por qué max-height y no height?",
      options: [
        { id: "a", text: "Porque height no admite valores en píxeles cuando hay overflow", isCorrect: false },
        { id: "b", text: "Porque height obliga al panel a medir 300px siempre, dejando un hueco vacío si hay poco contenido", isCorrect: true },
        { id: "c", text: "Porque max-height es la única que hace aparecer la barra de scroll", isCorrect: false },
        { id: "d", text: "Porque height no funciona junto con overflow-y", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una de las dos dice \"medí esto\" y la otra dice \"no pases de esto\". Pensá qué se ve con un solo comentario.",
      explanation:
        "height fija la altura pase lo que pase: con un solo comentario te quedan 250px de vacío. max-height deja que el panel mida lo que necesita hasta el tope, y la barra aparece únicamente cuando el contenido lo supera.",
    },
    {
      id: "31-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Armá el panel de comentarios: dale a la clase 'comentarios' max-height: 300px, overflow-y: auto y padding-right: 12px para que el texto no quede pegado a la barra.",
      codeTemplate: {
        html: `<div class="comentarios"><p>Muy claro el modulo.</p><p>Me trabe con el ultimo ejercicio.</p><p>El ejemplo del sticky me salvo.</p><p>Buenisimo, gracias.</p><p>Lo lei tres veces y recien ahi cayo.</p></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".comentarios {\n  max-height: 300px;\n  overflow-y: auto;\n  padding-right: 12px;\n}",
      validation: { type: "css-rules" },
      hint: "El padding de la derecha no es decorativo: la barra se come ancho del contenido y sin ese aire el texto queda tocándola.",
      explanation:
        "max-height más overflow-y: auto es el patrón del panel con scroll propio. El padding-right es el detalle que separa un panel prolijo de uno que se ve apretado en cuanto aparece la barra.",
    },
    {
      id: "31-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt:
        "Un position: sticky que funcionaba dejó de pegarse, y nadie tocó su CSS. ¿Dónde buscás el problema?",
      options: [
        { id: "a", text: "En el propio sticky: le falta un valor de top o quedó mal escrito", isCorrect: false },
        { id: "b", text: "En un elemento hermano que le está ganando por especificidad", isCorrect: false },
        { id: "c", text: "En sus ancestros, buscando el primero que tenga overflow en algo distinto de visible", isCorrect: true },
        { id: "d", text: "En el z-index, porque el sticky quedó tapado por otro elemento", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "El sticky se pega dentro de su contenedor de scroll más cercano. Preguntate quién se convirtió en ese contenedor sin que te dieras cuenta.",
      explanation:
        "En cuanto un ancestro declara overflow hidden, auto o scroll, pasa a ser el contenedor de scroll del sticky. El sticky sigue funcionando, pero adentro de una caja que no scrollea, y una caja que no scrollea nunca dispara el pegado. Se depura subiendo por los ancestros con el panel Computed filtrado por overflow.",
    },
    {
      id: "31-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "El menú de la clase 'lateral' tiene que pegarse a 1rem del borde de arriba. Y el contenedor 'envoltorio' tiene un overflow: hidden que lo rompe: cambiáselo a visible. Dale además a 'lateral' un background-color: #f0e6ff.",
      codeTemplate: {
        html: `<div class="envoltorio"><nav class="lateral">Menu</nav><p>Contenido largo de la pagina.</p></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".envoltorio {\n  overflow: visible;\n}\n.lateral {\n  position: sticky;\n  top: 1rem;\n  background-color: #f0e6ff;\n}",
      validation: { type: "css-rules" },
      hint: "El arreglo no está en el sticky, que está bien escrito. Está en el ancestro que se convirtió en contenedor de scroll sin que nadie lo pidiera.",
      explanation:
        "Esta es la forma real del arreglo: el sticky no se toca, se le saca el overflow al ancestro. Es la primera vez que ves una propiedad que rompe otra a distancia, y no va a ser la última: cuando algo deja de andar y su propio CSS está bien, el problema está arriba.",
    },
    {
      /**
       * EL RETO INTEGRADOR del modulo. Cierra `overflow` haciendo que el alumno
       * use en UNA sola tarea las cuatro cosas que las lecciones ensenaron por
       * separado: elegir el valor correcto, separar los ejes, armar un panel con
       * scroll propio, y no romper un sticky con el overflow del ancestro.
       *
       * No declara `targetCSS`: se deriva de `retoPasos` con `cssEsperadoDe`.
       */
      id: "31-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 9,
      prompt:
        "Mini reto. Armá el tablero cumpliendo los cuatro pasos. Ojo con el paso 4: el menú tiene que seguir pegándose, así que fijate qué le estás poniendo al contenedor de arriba.",
      retoPasos: [
        {
          instruccion:
            "Hacé que .lista mida como mucho 200px de alto y tenga su propia barra vertical cuando el contenido la supere.",
          esperado: ".lista { max-height: 200px; overflow-y: auto; }",
        },
        {
          instruccion:
            "Dale a .lista 12px de padding a la derecha, para que el texto no quede pegado a la barra.",
          esperado: ".lista { padding-right: 12px; }",
        },
        {
          instruccion:
            "La fila de etiquetas .etiquetas no entra a lo ancho: dale scroll horizontal y sacale el vertical.",
          esperado: ".etiquetas { overflow-x: auto; overflow-y: hidden; }",
        },
        {
          instruccion:
            "El menú .lateral tiene que pegarse a 1rem de arriba, y el contenedor .tablero NO tiene que romperlo: dejale el overflow en visible.",
          esperado:
            ".lateral { position: sticky; top: 1rem; } .tablero { overflow: visible; }",
        },
      ],
      codeTemplate: {
        html: `<div class="tablero"><nav class="lateral">Menu</nav><ul class="lista"><li>Uno</li><li>Dos</li><li>Tres</li><li>Cuatro</li><li>Cinco</li><li>Seis</li><li>Siete</li><li>Ocho</li></ul><div class="etiquetas"><span>CSS</span><span>Overflow</span><span>Scroll</span><span>Sticky</span><span>Ejes</span><span>Paneles</span></div></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      referenceSolution:
        ".lista {\n  max-height: 200px;\n  overflow-y: auto;\n  padding-right: 12px;\n}\n.etiquetas {\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n.lateral {\n  position: sticky;\n  top: 1rem;\n}\n.tablero {\n  overflow: visible;\n}",
      validation: { type: "css-rules" },
      hint: "Los cuatro pasos son independientes: podés resolverlos en cualquier orden. El único que engancha con otro es el último, porque el overflow del contenedor decide si el sticky vive o muere.",
      explanation:
        "El reto junta las cuatro ideas del módulo. Y el paso 4 es el que más vale: el arreglo del sticky nunca está en el sticky, está en el ancestro que se convirtió en contenedor de scroll.",
    },
  ],
};
