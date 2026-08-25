import type { ModuleData } from "@/types";

export const transformsModule: ModuleData = {
  slug: "transforms",
  title: "Transformaciones",
  description:
    "Mové, girá, agrandá e inclina cajas sin tocar el layout: las funciones de transform, el punto de origen, el orden en que se combinan y un vistazo a la tercera dimensión.",
  order: 22,
  dojo: "css" as const,
  nivel: "profundizacion",
  category: "css-visual",
  icon: "Move3d",
  lessons: [
    {
      id: "30-leccion-01",
      title: "Una propiedad que recibe funciones",
      content: `## transform no se parece a las demás

\`padding: 10px\` recibe un valor y termina. \`transform\` recibe **funciones**, y cada una hace algo distinto con la caja del elemento.

\`\`\`css
.tarjeta {
  transform: translate(20px, -10px);
}
\`\`\`

Eso mueve la tarjeta 20 píxeles a la derecha y 10 hacia arriba. Y hay una versión por eje para cuando solo te interesa uno: \`translateX(20px)\` y \`translateY(-10px)\`.

### El detalle de translate que sorprende a todo el mundo

Cuando el valor va en porcentaje, **el porcentaje se calcula sobre el tamaño del elemento mismo**, no sobre el del padre.

\`\`\`css
.medio-paso {
  transform: translateX(50%);
}
\`\`\`

Si esa caja mide 200 píxeles de ancho, se mueve 100. Si mide 40, se mueve 20. Es al revés de lo que hacen \`width\` o \`padding\` en porcentaje, que miran al padre.

Eso lo vuelve la herramienta exacta para centrar algo cuya medida no conocés: \`translateX(-50%)\` lo corre exactamente media caja hacia la izquierda, sea del tamaño que sea.

### rotate: girar

\`\`\`css
.sello {
  transform: rotate(-4deg);
}
\`\`\`

La unidad natural es \`deg\`, de grados. Positivo gira en el sentido de las agujas del reloj, negativo al contrario. También existen \`turn\` (una vuelta completa es \`1turn\`) y \`rad\`, aunque en la práctica vas a escribir grados casi siempre.

### scale: agrandar y encoger

\`\`\`css
.foto {
  transform: scale(1.08);
}
\`\`\`

\`1\` es el tamaño original, \`1.08\` es un 8% más grande, \`0.9\` es un 10% más chico. Con dos valores separás los ejes: \`scale(1.5, 1)\` estira solo a lo ancho. Y hay una trampa que conviene conocer: con \`scale\` **el contenido se agranda también**, texto incluido. Si el texto se ve borroso después de un \`scale\`, es porque lo estás ampliando como si fuera una imagen.

### skew: inclinar

\`\`\`css
.banda {
  transform: skewY(-3deg);
}
\`\`\`

\`skew\` corta la caja en diagonal, como si la empujaras de un costado. Es la menos usada de las cuatro, y sirve casi siempre para lo mismo: una banda diagonal de fondo, o un efecto de cursiva sobre algo que no es texto.

## Y acá está lo importante de todo el módulo

Ninguna de estas cuatro funciones **mueve el layout**.

Cuando corrés una caja con \`transform: translateY(-8px)\`, los elementos de alrededor no se enteran. El hueco original sigue ocupado. La caja se dibuja en otro lugar, pero para el resto de la página sigue estando donde estaba.

Compará eso con \`margin-top: -8px\`, que empuja a todos los vecinos, o con \`width\`, que puede reacomodar media página. Esa diferencia parece un detalle y no lo es: es la razón de todo lo que viene después, y volvemos sobre ella en la última lección.`,
      codeExample: {
        html: `<div class="fila">\n  <div class="caja">Quieta</div>\n  <div class="caja movida">Movida con transform</div>\n  <div class="caja">Quieta</div>\n</div>\n<div class="fila">\n  <div class="caja">Quieta</div>\n  <div class="caja empujada">Movida con margin</div>\n  <div class="caja">Quieta</div>\n</div>`,
        css: `.fila {\n  display: flex;\n  justify-content: flex-start;\n  padding: 12px;\n}\n\n.caja {\n  background-color: #ede9fe;\n  border: 1px solid #7c3aed;\n  padding: 14px;\n  max-width: 160px;\n  text-align: center;\n  line-height: 1.4;\n}\n\n.movida {\n  transform: translateX(30px);\n  background-color: #ddd6fe;\n}\n\n.empujada {\n  margin-left: 30px;\n  background-color: #fecaca;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "30-leccion-02",
      title: "transform-origin: el punto desde el que se transforma",
      content: `## Toda transformación necesita un ancla

Cuando girás una caja, gira **alrededor de algo**. Ese algo es el \`transform-origin\`, y por defecto está en el centro exacto:

\`\`\`css
.tarjeta {
  transform-origin: 50% 50%;
}
\`\`\`

Ese es el valor que tenés sin escribir nada. Y cambiarlo cambia por completo el resultado de la misma rotación.

### Las palabras clave, que son la forma habitual de escribirlo

\`\`\`css
.puerta {
  transform-origin: left center;
  transform: rotate(12deg);
}
\`\`\`

Con el origen en el borde izquierdo, la caja gira **como una puerta**: ese borde queda clavado y el resto se abre. Con el origen por defecto giraría como una hélice.

Las combinaciones que vas a usar:

| Valor | Dónde queda el ancla |
|-------|----------------------|
| \`center\` | El centro, lo mismo que \`50% 50%\` |
| \`top left\` | La esquina de arriba a la izquierda |
| \`bottom center\` | El medio del borde de abajo |
| \`left center\` | El medio del borde izquierdo |

También acepta medidas: \`transform-origin: 0 100%\` es la esquina de abajo a la izquierda, y \`transform-origin: 20px 40px\` cuenta desde la esquina de arriba a la izquierda.

### Dónde se nota más

Con \`rotate\` la diferencia es obvia. Con \`scale\` es más sutil y más útil: si el origen está en \`bottom center\`, la caja **crece hacia arriba** y su borde de abajo no se mueve. Eso es exactamente lo que querés para una barra de un gráfico, o para una tarjeta que se levanta de una lista sin despegarse.

\`\`\`css
.barra {
  transform-origin: bottom center;
  transform: scaleY(1.4);
}
\`\`\`

Con el origen por defecto, la misma barra crecería para los dos lados y se saldría del piso.

### Un tercer valor, para cuando llegue el 3D

\`transform-origin\` acepta un tercer número, que es la profundidad. Solo tiene efecto cuando hay transformaciones en tres dimensiones, y de eso hablamos en la última lección. Por ahora quedate con los dos primeros.`,
      codeExample: {
        html: `<div class="fila">\n  <div class="hoja centro">origen: center</div>\n  <div class="hoja puerta">origen: left center</div>\n  <div class="hoja esquina">origen: top left</div>\n</div>`,
        css: `.fila {\n  display: flex;\n  justify-content: space-around;\n  padding: 40px 12px;\n}\n\n.hoja {\n  background-color: #f5f0ff;\n  border: 1px solid #7c3aed;\n  padding: 16px;\n  max-width: 140px;\n  text-align: center;\n  line-height: 1.4;\n  transform: rotate(20deg);\n}\n\n.centro {\n  transform-origin: center;\n}\n\n.puerta {\n  transform-origin: left center;\n}\n\n.esquina {\n  transform-origin: top left;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "30-leccion-03",
      title: "Combinar transformaciones, y por qué el orden importa",
      content: `## Varias funciones en la misma declaración

Van una detrás de la otra, separadas por espacios:

\`\`\`css
.destacada {
  transform: translateY(-6px) scale(1.04) rotate(-2deg);
}
\`\`\`

Se lee como una lista de pasos, y eso es literalmente lo que es.

### Cuidado: una segunda declaración NO suma, reemplaza

Este es el error que más tiempo hace perder:

\`\`\`css
.mal {
  transform: translateY(-6px);
  transform: rotate(-2deg);
}
\`\`\`

Acá el \`translateY\` **no existe**. La segunda declaración de \`transform\` pisa a la primera, igual que pasaría con dos \`color\` seguidos. Si querés las dos cosas, van juntas en la misma declaración.

## El orden cambia el resultado

Estas dos reglas no hacen lo mismo, aunque tengan las mismas funciones:

\`\`\`css
.primera {
  transform: translateX(120px) rotate(45deg);
}

.segunda {
  transform: rotate(45deg) translateX(120px);
}
\`\`\`

La primera corre la caja 120 píxeles a la derecha y **después** la gira ahí donde quedó. Termina 120 píxeles a la derecha, girada.

La segunda gira primero, y con eso gira **el sistema de coordenadas**. El \`translateX\` que viene después ya no se mueve por la horizontal de la pantalla: se mueve por la horizontal de la caja girada, que ahora apunta en diagonal. Termina abajo y a la derecha.

### La regla para acordarse

Cada función se aplica sobre el sistema de coordenadas que dejó la anterior. Si querés que un desplazamiento sea horizontal de verdad, ponelo **antes** de cualquier rotación.

Y al revés: si querés que algo gire quedándose donde está, la rotación va al final.

### El caso práctico que aparece siempre

Centrar algo y girarlo:

\`\`\`css
.sello {
  transform: translate(-50%, -50%) rotate(-8deg);
}
\`\`\`

El \`translate\` va primero para que el corrimiento de media caja sea sobre los ejes reales. Si lo pusieras después de la rotación, el sello quedaría corrido en diagonal y el centrado se arruinaría por 8 grados que nadie sabría de dónde salieron.

## Lo que conviene que te lleves

1. Todas las funciones van en **una sola** declaración de \`transform\`.
2. Los desplazamientos van antes de las rotaciones.
3. Si algo terminó en un lugar raro, lo primero que hay que mirar es el orden, y lo segundo el \`transform-origin\`.`,
      codeExample: {
        html: `<div class="escena">\n  <div class="ref">Sin transformar</div>\n  <div class="primera">mover y girar</div>\n  <div class="segunda">girar y mover</div>\n</div>`,
        css: `.escena {\n  padding: 30px;\n  max-width: 480px;\n}\n\n.ref,\n.primera,\n.segunda {\n  background-color: #f5f0ff;\n  border: 1px solid #7c3aed;\n  padding: 10px;\n  max-width: 150px;\n  text-align: center;\n  line-height: 1.4;\n  margin-bottom: 8px;\n}\n\n.primera {\n  transform: translateX(120px) rotate(45deg);\n  background-color: #ddd6fe;\n}\n\n.segunda {\n  transform: rotate(45deg) translateX(120px);\n  background-color: #fde68a;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "30-leccion-04",
      title: "Un vistazo al 3D, y por qué esto es barato de animar",
      content: `## perspective: la caja que se va para atrás

Hasta acá todo pasó en el plano. Con \`rotateY\` la caja gira sobre un eje vertical, o sea que un costado se acerca y el otro se aleja. Pero si lo escribís solo, se ve como un simple achatamiento:

\`\`\`css
.carta {
  transform: rotateY(40deg);
}
\`\`\`

Falta decirle al navegador **desde qué distancia estamos mirando**. Eso va en el padre:

\`\`\`css
.escena {
  perspective: 800px;
}
\`\`\`

Ese número es la distancia entre el ojo y el plano de la pantalla. Cuanto **más chico**, más exagerado el efecto: 300 píxeles deforma muchísimo, 1500 se parece a mirar de lejos y casi no se nota. Un valor entre 600 y 1000 es lo razonable para una tarjeta.

Los tres giros del espacio son \`rotateX\` (como asentir con la cabeza), \`rotateY\` (como negar) y \`rotateZ\`, que es el \`rotate\` de siempre. Y hay un \`translateZ\` que acerca o aleja la caja, que solo hace algo si hay perspectiva.

No vamos más lejos que esto. El 3D en CSS tiene bastante más tela, y lo poco que acabás de ver ya cubre el 90% de lo que se usa de verdad.

## Por qué transform y opacity son las dos propiedades baratas de animar

Esto es lo más importante que te llevás del módulo, y es la base de lo que viene inmediatamente después.

Para poner algo en pantalla, el navegador pasa por tres etapas, en este orden:

1. **Layout**: calcular cuánto mide cada caja y en qué lugar va.
2. **Paint**: dibujar los píxeles de cada caja, con sus colores, sus bordes y su texto.
3. **Composite**: pegar las capas ya dibujadas, una sobre otra, para armar el cuadro final.

Ahora fijate qué toca cada propiedad.

Si cambiás \`width\`, \`margin\`, \`padding\`, \`top\` o \`font-size\`, cambiaste el **tamaño o el lugar** de una caja. El navegador tiene que rehacer el layout, y como el layout es en cascada, mover una caja puede obligar a recalcular a todos sus vecinos y a sus hijos. Y después de rehacer el layout hay que volver a pintar, y después a componer. Las tres etapas, para cada cuadro.

Si cambiás \`background-color\` o \`color\`, el layout se salva: nada cambió de tamaño ni de lugar. Pero hay que volver a pintar. Dos etapas.

Si cambiás \`transform\` o \`opacity\`, no cambió ni el tamaño, ni el lugar, ni un solo píxel del dibujo. La caja **ya está pintada**. Lo único que cambia es dónde se pega esa capa ya dibujada, o con cuánta transparencia. Una sola etapa, la última, y encima es una que la placa de video hace muy bien.

### Y por eso el módulo que sigue existe

Recordá lo de la primera lección: \`transform\` no mueve el layout. Ahora ya sabés que eso no era una curiosidad, era el motivo.

Cuando algo tiene que cambiar 60 veces por segundo, la diferencia entre rehacer tres etapas y rehacer una es la diferencia entre un movimiento fluido y uno que se traba. Por eso, cuando en el módulo que viene armemos movimiento de verdad, casi todo lo que pongamos en juego va a ser \`transform\` y \`opacity\`, y casi nada va a ser \`width\`, \`top\` o \`margin\`.

Cuando veas un menú que se abre corriéndose con \`translateX\` en lugar de con \`left\`, o una tarjeta que aparece con \`opacity\` y \`scale\` en lugar de con \`height\`, ya sabés que no es capricho de estilo. Es la etapa que se están ahorrando.

## Lo que conviene que te lleves

1. \`transform\` recibe funciones, todas en una sola declaración.
2. El orden de las funciones cambia el resultado.
3. \`transform-origin\` decide el ancla, y por defecto es el centro.
4. \`transform\` no mueve el layout, y esa es la razón de que sea barato.
5. Junto con \`opacity\`, son las dos que conviene mover cuando algo tiene que cambiar muchas veces por segundo.`,
      codeExample: {
        html: `<div class="escena">\n  <div class="carta">\n    <h3>Ana Ríos</h3>\n    <p>Desarrolladora front-end</p>\n  </div>\n</div>\n<div class="escena cerca">\n  <div class="carta">\n    <h3>Ana Ríos</h3>\n    <p>La misma carta, mirada de mucho más cerca</p>\n  </div>\n</div>`,
        css: `.escena {\n  perspective: 900px;\n  padding: 24px;\n  max-width: 420px;\n}\n\n.cerca {\n  perspective: 320px;\n}\n\n.carta {\n  background-color: #f5f0ff;\n  border: 1px solid #7c3aed;\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);\n  padding: 20px;\n  line-height: 1.5;\n  transform: rotateY(32deg);\n  transform-origin: left center;\n}\n\n.carta h3 {\n  margin: 0 0 6px;\n}\n\n.carta p {\n  margin: 0;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "30-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Una caja mide 300px de ancho y le aplicás transform: translateX(50%). ¿Cuánto se mueve?",
      options: [
        {
          id: "a",
          text: "150px, porque en translate el porcentaje se calcula sobre el tamaño del elemento mismo",
          isCorrect: true,
        },
        { id: "b", text: "50px, porque el porcentaje se lee como píxeles", isCorrect: false },
        {
          id: "c",
          text: "La mitad del ancho del elemento padre, igual que un width en porcentaje",
          isCorrect: false,
        },
        { id: "d", text: "Nada, porque translateX no acepta porcentajes", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Es al revés de lo que hacen width o padding en porcentaje. La referencia no es el padre.",
      explanation:
        "En translate el porcentaje mide contra el propio elemento: la mitad de 300px son 150px. Eso lo vuelve la forma exacta de centrar algo cuya medida no conocés, porque translateX(-50%) siempre corre media caja, sea del tamaño que sea.",
    },
    {
      id: "30-ej-02",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt: "Arrastrá cada función de transform a lo que le hace a la caja:",
      dragItems: [
        { id: "drag-1", content: "translate", correctZone: "zone-mover" },
        { id: "drag-2", content: "rotate", correctZone: "zone-girar" },
        { id: "drag-3", content: "scale", correctZone: "zone-tamano" },
        { id: "drag-4", content: "skew", correctZone: "zone-inclinar" },
        { id: "drag-5", content: "transform-origin", correctZone: "zone-ancla" },
      ],
      dropZones: [
        { id: "zone-mover", label: "La corre de lugar sobre los dos ejes" },
        { id: "zone-girar", label: "La hace girar una cantidad de grados" },
        { id: "zone-tamano", label: "La agranda o la encoge" },
        { id: "zone-inclinar", label: "La corta en diagonal, como empujándola de un costado" },
        { id: "zone-ancla", label: "No transforma nada: decide el punto desde el que se transforma" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-mover",
          "drag-2": "zone-girar",
          "drag-3": "zone-tamano",
          "drag-4": "zone-inclinar",
          "drag-5": "zone-ancla",
        },
      },
      hint: "Cuatro de los cinco son funciones que van adentro de transform. El que sobra es una propiedad aparte.",
      explanation:
        "translate, rotate, scale y skew son funciones y van adentro del valor de transform. transform-origin es una propiedad distinta y no transforma nada por su cuenta: define el ancla que usan las otras cuatro.",
    },
    {
      id: "30-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Corrés una tarjeta hacia arriba con transform: translateY(-10px) y las tarjetas de al lado no se mueven ni un poco. ¿Por qué?",
      options: [
        {
          id: "a",
          text: "Porque translateY solo afecta al texto de adentro y no a la caja",
          isCorrect: false,
        },
        { id: "b", text: "Porque el valor es negativo y los negativos se ignoran", isCorrect: false },
        {
          id: "c",
          text: "Porque transform no toca el layout: la caja se dibuja en otro lugar pero su hueco original sigue ocupado, así que los vecinos no se enteran",
          isCorrect: true,
        },
        {
          id: "d",
          text: "Porque las tarjetas vecinas necesitarían su propio transform para acomodarse",
          isCorrect: false,
        },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Compará con lo que haría un margin-top negativo, que sí empuja a todo el mundo.",
      explanation:
        "El layout ya se calculó y transform no lo vuelve a tocar: reserva el hueco original y solo cambia dónde se dibuja la caja. Un margin negativo, en cambio, recalcula el layout y arrastra a los vecinos. Esa diferencia es la que después hace que transform sea barato de animar.",
    },
    {
      id: "30-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Hacé que la barra crezca hacia arriba sin despegarse del piso. Escribí '.barra' con transform-origin: bottom center y transform: scaleY(1.4); y '.grafico' con padding: 20px y max-width: 320px.",
      codeTemplate: {
        html: `<div class="grafico">\n  <div class="barra">HTML</div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".barra {\n  transform-origin: bottom center;\n  transform: scaleY(1.4);\n}\n\n.grafico {\n  padding: 20px;\n  max-width: 320px;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "El origen tiene que estar en el borde de abajo para que ese borde quede clavado y la barra crezca solo hacia arriba.",
      explanation:
        "Con el origen por defecto en el centro, la barra crecería para los dos lados y se saldría del piso. Con bottom center el borde inferior queda fijo y todo el crecimiento va hacia arriba, que es lo que espera cualquiera que mire un gráfico de barras.",
    },
    {
      id: "30-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Escribís dos declaraciones seguidas en la misma regla: transform: translateY(-6px) y abajo transform: rotate(-2deg). ¿Qué pasa?",
      options: [
        { id: "a", text: "Las dos se aplican, porque transform acumula declaraciones", isCorrect: false },
        {
          id: "b",
          text: "Solo se aplica la rotación: la segunda declaración pisa a la primera, igual que pasaría con dos color seguidos",
          isCorrect: true,
        },
        { id: "c", text: "Ninguna se aplica, porque la regla queda inválida", isCorrect: false },
        {
          id: "d",
          text: "Se aplican en orden inverso, primero la rotación y después el desplazamiento",
          isCorrect: false,
        },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "transform es una propiedad como cualquier otra, y dos declaraciones de la misma propiedad en la misma regla no conviven.",
      explanation:
        "No hay acumulación: la segunda declaración reemplaza a la primera y el translateY desaparece sin dejar rastro. Para tener las dos transformaciones van juntas en un solo valor, separadas por un espacio.",
    },
    {
      id: "30-ej-06",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 6,
      prompt:
        "Mostrá que el orden importa. Escribí '.primera' con transform: translateX(120px) rotate(45deg); y '.segunda' con transform: rotate(45deg) translateX(120px).",
      codeTemplate: {
        html: `<div class="primera">mover y girar</div>\n<div class="segunda">girar y mover</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".primera {\n  transform: translateX(120px) rotate(45deg);\n}\n\n.segunda {\n  transform: rotate(45deg) translateX(120px);\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Las mismas dos funciones en las dos reglas, en orden distinto. Escribilas tal cual, sin reordenarlas.",
      explanation:
        "La primera se corre 120px sobre la horizontal real y después gira ahí donde quedó. La segunda gira el sistema de coordenadas y recién entonces se corre, así que ese translateX viaja por la horizontal ya girada y la caja termina en diagonal. Cada función se aplica sobre el sistema que dejó la anterior.",
    },
    {
      id: "30-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "¿Por qué transform y opacity son las dos propiedades baratas de mover cuando algo tiene que cambiar muchas veces por segundo?",
      options: [
        {
          id: "a",
          text: "Porque el navegador les da prioridad sobre las demás propiedades",
          isCorrect: false,
        },
        { id: "b", text: "Porque aceptan valores en porcentaje y eso se calcula más rápido", isCorrect: false },
        {
          id: "c",
          text: "Porque son propiedades más nuevas y están mejor optimizadas que las viejas",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Porque no cambian ni el tamaño ni el lugar de ninguna caja ni un píxel del dibujo: la caja ya está pintada y solo cambia cómo se pega esa capa, así que se saltean el layout y el paint",
          isCorrect: true,
        },
      ],
      validation: { type: "exact", answer: "d" },
      hint: "Pensá en las tres etapas por las que pasa el navegador para armar un cuadro, y en cuántas se saltean estas dos.",
      explanation:
        "El navegador hace layout, después paint y después composite. Cambiar width o top rehace las tres, y en cascada sobre los vecinos. Cambiar background-color se salva el layout pero hay que repintar. transform y opacity no cambian medidas ni dibujo: solo tocan la última etapa, la de pegar capas ya pintadas, que además es la que mejor hace la placa de video. Una etapa contra tres, sesenta veces por segundo.",
    },
    {
      id: "30-ej-08",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Reproducí la carta del CV girada en el espacio. Escribí '.escena' con perspective: 900px; y '.carta' con transform: rotateY(32deg) y transform-origin: left center.",
      codeTemplate: {
        html: `<div class="escena">\n  <div class="carta">\n    <h3>Ana Rios</h3>\n    <p>Desarrolladora front-end</p>\n  </div>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".escena {\n  perspective: 900px;\n}\n\n.carta {\n  transform: rotateY(32deg);\n  transform-origin: left center;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "La perspectiva va en el padre y el giro en el hijo. Si ponés las dos cosas en la misma caja, el efecto no aparece.",
      explanation:
        "perspective va en el contenedor porque describe desde qué distancia mira el ojo a toda la escena, no a una caja. Sin ella un rotateY se ve como un simple achatamiento, porque no hay profundidad que proyectar. Y el origen en left center hace que el giro se vea como una puerta que se abre en lugar de una hélice.",
    },
  ],
};
