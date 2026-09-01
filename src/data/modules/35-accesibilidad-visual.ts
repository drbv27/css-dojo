import type { ModuleData } from "@/types";

export const accesibilidadVisualModule: ModuleData = {
  slug: "accesibilidad-visual",
  title: "Accesibilidad visual",
  description:
    "Cuatro decisiones de CSS que deciden si tu página se puede usar. Ninguna es difícil; todas se olvidan.",
  order: 29,
  dojo: "css" as const,
  nivel: "profundizacion",
  category: "css-visual",
  icon: "Eye",
  lessons: [
    {
      id: "35-leccion-01",
      order: 1,
      title: "El foco que borraste",
      content: `## La línea que todo el mundo saca

Armás un formulario, hacés clic en un input y aparece un anillo azul alrededor. Te parece feo. Buscás cómo sacarlo, encontrás esto en el primer resultado, y lo pegás:

\`\`\`css
* {
  outline: none;
}
\`\`\`

Listo. Se fue.

Y con él se fue la única forma que tiene alguien de saber **dónde está parado** si navega con el teclado.

## Qué es el foco, en serio

El foco es el elemento que va a recibir lo que escribas o el Enter que apretés. Con mouse no importa mucho: apuntás y hacés clic. Con teclado es **todo**: apretás Tab, el foco salta al siguiente elemento, y si no lo ves, estás navegando a ciegas.

No es un caso raro. Navega con teclado:

- quien tiene una lesión que le impide usar el mouse,
- quien usa un lector de pantalla,
- y vos, cuando llenás un formulario largo y no querés soltar el teclado.

## outline no es border

Antes de reemplazarlo conviene saber por qué el navegador eligió \`outline\` y no \`border\`:

| | \`border\` | \`outline\` |
|---|---|---|
| Ocupa espacio | **sí**, empuja el layout | **no**, se dibuja encima |
| Sigue la forma del \`border-radius\` | sí | sí, en navegadores modernos |
| Se puede separar del elemento | no | sí, con \`outline-offset\` |

Que **no ocupe espacio** es la razón: un \`border\` que aparece al enfocar movería todo lo que está alrededor. El \`outline\` se dibuja encima y no mueve nada.

## Si no te gusta el default, reemplazalo

La regla es simple: **sacar el foco está bien; dejarlo invisible no.**

\`\`\`css
.boton:focus {
  outline: 3px solid #7c3aed;
  outline-offset: 2px;
}
\`\`\`

\`outline-offset\` separa la línea del elemento, y con eso el anillo se lee incluso sobre un fondo del mismo color.

## Lo que hay que ver, no leer

Abrí el ejemplo, hacé clic en cualquier parte vacía de la página y apretá **Tab** varias veces. Vas a ver el foco saltando de un botón al otro. Ahora imaginate esa misma página con \`outline: none\`: los saltos siguen pasando, no los ves.`,
      codeExample: {
        html: `<div class="barra">
  <button class="boton">Guardar</button>
  <button class="boton">Cancelar</button>
  <button class="boton">Ayuda</button>
</div>`,
        css: `.barra {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #1e1e2e;
}

.boton {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #313244;
  color: #cdd6f4;
  font-size: 15px;
  cursor: pointer;
}

.boton:focus {
  outline: 3px solid #a78bfa;
  outline-offset: 2px;
}`,
        editable: true,
      },
    },
    {
      id: "35-leccion-02",
      order: 2,
      title: ":focus-visible, o cómo tener las dos cosas",
      content: `## La queja legítima

"Pero el anillo aparece también cuando hago clic con el mouse, y ahí sí es feo."

Es verdad, y es la razón real por la que tanta gente termina escribiendo \`outline: none\`. No querían romper nada: querían que el anillo apareciera con el teclado y no con el mouse.

Eso hoy tiene su propia pseudo-clase.

## :focus contra :focus-visible

\`\`\`css
/* se activa SIEMPRE que el elemento tiene el foco */
.boton:focus { }

/* se activa solo cuando el navegador cree que hace falta MOSTRARLO */
.boton:focus-visible { }
\`\`\`

La diferencia está en quién decide. Con \`:focus-visible\` el navegador aplica su propia heurística: si llegaste con Tab, muestra el anillo; si llegaste con un clic del mouse, no.

\`\`\`css
.boton:focus {
  outline: none;
}

.boton:focus-visible {
  outline: 3px solid #a78bfa;
  outline-offset: 2px;
}
\`\`\`

Esas dos reglas juntas son la respuesta completa: **sin anillo al hacer clic, con anillo al tabular.** Es exactamente lo que quería la persona que escribió \`outline: none\`, y le costaba dos líneas más.

## Por qué el orden importa acá

Las dos reglas tienen la misma especificidad -una clase más una pseudo-clase-, así que gana la última. Si las escribís al revés, \`:focus\` con \`outline: none\` pisa a \`:focus-visible\` y volvés al problema original sin darte cuenta.

Es el mismo mecanismo que ya viste en especificidad: cuando dos reglas empatan, decide el orden. Acá ese empate tiene consecuencias que no se ven mirando la pantalla con el mouse en la mano.

## Un cuidado

\`:focus-visible\` decide por vos. En un \`<input>\` de texto muestra el anillo **siempre**, incluso con clic, porque ahí el foco importa aunque hayas apuntado: vas a escribir, y necesitás ver dónde.`,
      codeExample: {
        html: `<div class="barra">
  <button class="boton">Probá con el mouse</button>
  <button class="boton">Ahora con Tab</button>
  <input class="campo" type="text" placeholder="Y probá acá también" />
</div>`,
        css: `.barra {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #1e1e2e;
  align-items: center;
}

.boton,
.campo {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #313244;
  color: #cdd6f4;
  font-size: 15px;
}

.boton:focus,
.campo:focus {
  outline: none;
}

.boton:focus-visible,
.campo:focus-visible {
  outline: 3px solid #a78bfa;
  outline-offset: 2px;
}`,
        editable: true,
      },
    },
    {
      id: "35-leccion-03",
      order: 3,
      title: "Contraste: el número que decide si se lee",
      content: `## Gris claro sobre blanco

Es la decisión de diseño más repetida del mundo, y casi siempre está mal:

\`\`\`css
.ayuda {
  color: #999999;
  background: #ffffff;
}
\`\`\`

En tu monitor, en una habitación con buena luz, se lee. En un celular al sol, no. Para alguien con baja visión, tampoco. Y "se lee" no es una opinión: hay un número.

## La razón de contraste

El contraste entre dos colores se mide como una **razón**, de \`1:1\` -el mismo color, invisible- a \`21:1\` -negro puro sobre blanco puro-.

| Texto | Mínimo aceptable |
|---|---|
| Normal (menos de 18px) | **4.5:1** |
| Grande (18px o más, o 14px en negrita) | **3:1** |
| Íconos y bordes que comunican algo | **3:1** |

\`#999999\` sobre blanco da **2.85:1**. Está por debajo del mínimo para cualquier tamaño. \`#767676\` sobre blanco da **4.54:1**, y es el gris más claro que pasa para texto normal.

La diferencia entre los dos es casi invisible cuando los ponés al lado. Esa es justamente la trampa: el ojo que ya lee bien no distingue el caso que falla.

## Cómo se mide sin adivinar

No lo calcules a mano. El navegador ya lo hace: inspeccionás el texto, abrís el selector de color de la propiedad \`color\`, y te muestra la razón de contraste con una marca de si pasa o no.

Es una de esas cosas que **no se aprenden leyendo un número, se aprenden viéndolo cambiar** mientras movés el color.

## Y el error que el número no atrapa

\`\`\`css
.error { color: #dc2626; }
.exito { color: #16a34a; }
\`\`\`

Los dos pasan de contraste. Y aun así, para alguien que no distingue rojo de verde -cerca del 8% de los hombres- ese formulario no dice nada.

**El color puede reforzar un mensaje, nunca puede ser el único que lo da.** Al lado del color va un ícono, una palabra, un símbolo: algo que se lea sin ver el color.`,
      codeExample: {
        html: `<p class="malo">Este gris no llega al mínimo: 2.85 a 1</p>
<p class="bueno">Este sí: 4.54 a 1</p>
<p class="mensaje-error">Error: falta el correo</p>`,
        css: `.malo,
.bueno,
.mensaje-error {
  background: #ffffff;
  padding: 10px 14px;
  margin: 0 0 6px;
  font-size: 15px;
}

.malo {
  color: #999999;
}

.bueno {
  color: #767676;
}

/* El color avisa, pero no está solo: el borde y el texto
   dicen lo mismo sin depender de verlo. */
.mensaje-error {
  color: #b91c1c;
  border-left: 4px solid #b91c1c;
  font-weight: 600;
}`,
        editable: true,
      },
    },
    {
      id: "35-leccion-04",
      order: 4,
      title: "Movimiento que marea, y texto que se oculta mal",
      content: `## prefers-reduced-motion

Una animación de entrada que te parece elegante puede provocarle náuseas o mareo real a alguien con trastorno vestibular. No es incomodidad: es un síntoma físico.

Por eso los sistemas operativos tienen una preferencia de "reducir movimiento", y el navegador te la pasa:

\`\`\`css
.tarjeta {
  transition: transform 0.4s ease;
}

@media (prefers-reduced-motion: reduce) {
  .tarjeta {
    transition: none;
  }
}
\`\`\`

Es una media query como cualquier otra de las que ya escribiste, solo que no pregunta por el ancho de la pantalla sino por lo que la persona ya configuró en su sistema.

**Reducir no es eliminar.** Un cambio de opacidad casi nunca molesta; lo que marea es el movimiento grande: cosas que se deslizan de un lado al otro, que rebotan, que hacen zoom. Podés dejar el fundido y sacar el desplazamiento.

## Ocultar sin esconder

Tenés un ícono de lupa como único contenido de un botón. Se ve claro. Para un lector de pantalla, ese botón **no tiene nombre**: anuncia "botón" y nada más.

La solución es agregar texto que se lea pero no se vea. Y acá está la trampa:

\`\`\`css
/* NO: esto lo oculta también para el lector de pantalla */
.etiqueta { display: none; }

/* NO: lo mismo */
.etiqueta { visibility: hidden; }
\`\`\`

\`display: none\` y \`visibility: hidden\` sacan el elemento del árbol de accesibilidad. El lector de pantalla no lo lee, exactamente igual que el ojo no lo ve.

Lo que hace falta es sacarlo **de la vista** dejándolo **en el árbol**:

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
\`\`\`

Se ve raro escrita, y lo es: cada línea tapa una forma distinta en que un navegador podría llegar a mostrarla. Es una receta, y esta es de las pocas que conviene copiar tal cual en vez de reinventar. Se llama \`sr-only\` por *screen reader only*.

## El área que se puede tocar

Un enlace de 12 píxeles de alto se hace clic bien con un mouse y muy mal con un pulgar. La recomendación es **24 píxeles como mínimo** para cualquier cosa tocable, y 44 si es una acción importante.

\`\`\`css
.icono-boton {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
\`\`\`

El ícono puede seguir midiendo 16px. Lo que crece es **la zona que responde**, no el dibujo.`,
      codeExample: {
        html: `<button class="icono-boton">
  <span class="icono">&#9788;</span>
  <span class="sr-only">Cambiar a modo claro</span>
</button>
<p class="nota">El botón mide 44 por 44 aunque el ícono sea chico.</p>`,
        css: `.icono-boton {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: #313244;
  color: #f9e2af;
  font-size: 18px;
  cursor: pointer;
}

.icono-boton:focus-visible {
  outline: 3px solid #a78bfa;
  outline-offset: 2px;
}

/* Se lee, no se ve. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.nota {
  color: #a6adc8;
  font-size: 14px;
}`,
        editable: true,
      },
    },
  ],
  exercises: [
    {
      id: "35-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Por qué el navegador usa outline y no border para marcar el foco?",
      options: [
        { id: "a", text: "Porque outline no ocupa espacio y no mueve el resto del layout al aparecer", isCorrect: true },
        { id: "b", text: "Porque border no se puede pintar de color", isCorrect: false },
        { id: "c", text: "Porque outline se aplica antes que border en la cascada", isCorrect: false },
        { id: "d", text: "Porque border no funciona dentro de un formulario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Pensá qué pasaría con los elementos de al lado si al enfocar apareciera algo que ocupa lugar.",
      explanation:
        "El outline se dibuja encima del elemento y no participa del layout, así que aparecer y desaparecer no empuja nada. Un border que apareciera al enfocar movería todo lo que está alrededor cada vez que apretás Tab, y eso es mucho peor que el anillo.",
    },
    {
      id: "35-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "Querés que el anillo de foco aparezca al navegar con Tab pero no al hacer clic con el mouse. ¿Qué usás?",
      options: [
        { id: "a", text: "outline: none en :focus, y nada más", isCorrect: false },
        { id: "b", text: "outline: none en :focus, y el anillo en :focus-visible", isCorrect: true },
        { id: "c", text: "El anillo en :hover, que solo se activa con el mouse", isCorrect: false },
        { id: "d", text: "visibility: hidden sobre el outline cuando hay un clic", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Hay una pseudo-clase que deja que el navegador decida si el foco hace falta mostrarlo.",
      explanation:
        ":focus-visible aplica la heurística del navegador: con Tab muestra el anillo, con clic del mouse no. Las dos reglas juntas dan exactamente lo que quería quien escribió outline: none, sin dejar a nadie navegando a ciegas. La opción a es justamente el error que este módulo existe para corregir.",
    },
    {
      id: "35-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Devolvele el foco visible a .accion: en :focus dale outline: none, y en :focus-visible dale outline: 3px solid #a78bfa y outline-offset: 2px.",
      codeTemplate: {
        html: `<button class="accion">Enviar</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".accion:focus {\n  outline: none;\n}\n.accion:focus-visible {\n  outline: 3px solid #a78bfa;\n  outline-offset: 2px;\n}",
      validation: { type: "css-rules" },
      hint: "Son dos reglas separadas, una por cada pseudo-clase. El orden importa: la que pone el anillo va después.",
      explanation:
        "Las dos reglas empatan en especificidad, así que gana la que está escrita última. Si las invirtieras, el outline: none pisaría al anillo y volverías al problema original sin ver ninguna diferencia mientras usás el mouse.",
    },
    {
      id: "35-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Un texto de 15px usa color #999999 sobre fondo blanco, que da una razón de contraste de 2.85:1. ¿Qué le falta?",
      options: [
        { id: "a", text: "Nada: 2.85:1 alcanza para texto chico", isCorrect: false },
        { id: "b", text: "Llegar a 4.5:1, que es el mínimo para texto normal", isCorrect: true },
        { id: "c", text: "Llegar a 21:1, que es el único valor aceptable", isCorrect: false },
        { id: "d", text: "Llegar a 3:1, que es el mínimo para cualquier texto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El mínimo cambia según el tamaño. 15px no llega a contar como texto grande.",
      explanation:
        "Texto normal necesita 4.5:1; el 3:1 es para texto grande, de 18px en adelante o 14px en negrita. Y 21:1 es el máximo posible, negro puro sobre blanco puro, no un requisito. El gris más claro que pasa para texto normal sobre blanco es alrededor de #767676.",
    },
    {
      id: "35-ej-05",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 5,
      prompt:
        "Un formulario marca los campos con error en rojo y los correctos en verde, y los dos colores pasan el contraste. ¿Sigue habiendo un problema?",
      options: [
        { id: "a", text: "No, si pasan el contraste está resuelto", isCorrect: false },
        { id: "b", text: "Sí: quien no distingue rojo de verde no recibe la información, porque el color es el único que la da", isCorrect: true },
        { id: "c", text: "Sí, pero se arregla subiendo el contraste de los dos a 7:1", isCorrect: false },
        { id: "d", text: "Sí, y se arregla usando outline en lugar de color", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El contraste mide claro contra oscuro. No mide si dos colores se distinguen entre sí.",
      explanation:
        "Cerca del 8% de los hombres no distingue rojo de verde, y para ellos los dos estados se ven igual por más contraste que tengan contra el fondo. El color puede reforzar el mensaje, nunca puede ser el único que lo da: al lado va un ícono, una palabra o un símbolo.",
    },
    {
      id: "35-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Respetá la preferencia del sistema: .tarjeta tiene transition: transform 0.4s ease, y dentro de una media query de prefers-reduced-motion: reduce dale transition: none.",
      codeTemplate: {
        html: `<div class="tarjeta">Pasá el mouse por encima</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".tarjeta {\n  transition: transform 0.4s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n  .tarjeta {\n    transition: none;\n  }\n}",
      validation: { type: "css-rules" },
      hint: "Es una media query como las de ancho, pero pregunta por una preferencia del sistema en vez de por el tamaño de la pantalla.",
      explanation:
        "prefers-reduced-motion se activa cuando la persona pidió reducir movimiento en su sistema operativo. Para alguien con trastorno vestibular una animación grande no es incómoda: le provoca mareo real. Reducir no siempre es eliminar, pero desactivar la transición es la respuesta más segura y la más simple.",
    },
    {
      id: "35-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt:
        "Querés que un texto lo lea el lector de pantalla pero no se vea. ¿Por qué no sirve display: none?",
      options: [
        { id: "a", text: "Porque display: none rompe el layout del elemento padre", isCorrect: false },
        { id: "b", text: "Porque saca el elemento del árbol de accesibilidad, así que el lector tampoco lo lee", isCorrect: true },
        { id: "c", text: "Porque display: none solo funciona en elementos de bloque", isCorrect: false },
        { id: "d", text: "Porque el lector de pantalla ignora todo el CSS", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Pensá qué significa 'oculto' para un navegador: ¿oculto para el ojo, o oculto para todo?",
      explanation:
        "display: none y visibility: hidden ocultan para todos, incluido el lector de pantalla. Para que se lea sin verse hace falta sacarlo de la vista dejándolo en el árbol, que es lo que hace la receta sr-only: posición absoluta, un píxel de tamaño, overflow hidden y clip-path.",
    },
    {
      id: "35-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Agrandá el área tocable sin agrandar el ícono: a .icono-boton dale min-width: 44px, min-height: 44px, display: inline-flex, align-items: center y justify-content: center.",
      codeTemplate: {
        html: `<button class="icono-boton">&#9788;</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".icono-boton {\n  min-width: 44px;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}",
      validation: { type: "css-rules" },
      hint: "El ícono sigue midiendo lo mismo. Lo que crece es la caja, y el flex centrado es lo que evita que el dibujo quede en una esquina.",
      explanation:
        "Un objetivo tocable de menos de 24px se falla seguido con el pulgar, y 44px es la medida cómoda para una acción importante. Usar min-width y min-height en vez de width y height deja que el botón crezca si el contenido lo pide, y el inline-flex centrado mantiene el ícono en el medio de esa caja más grande.",
    },
  ],
};
