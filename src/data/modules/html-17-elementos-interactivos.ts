import type { ModuleData } from "@/types";

export const htmlInteractivosModule: ModuleData = {
  slug: "html-17-elementos-interactivos",
  title: "HTML moderno: elementos interactivos",
  description:
    "Elementos nativos de HTML que hacen cosas sin (casi) JavaScript: details/summary, dialog, y los indicadores progress y meter.",
  order: 17,
  dojo: "html",
  category: "html-advanced",
  icon: "layout",
  lessons: [
    {
      id: "html17-leccion-01",
      title: "Interactivos sin (casi) JavaScript",
      content: `## Interactivos sin (casi) JavaScript

HTML moderno trae elementos que **hacen cosas por si solos**, sin escribir JavaScript. Aca hay dos.

### details / summary — un acordeon nativo

Muestra u oculta contenido al hacer clic. **Cero JavaScript.**

\`\`\`html
<details>
  <summary>Ver mas informacion</summary>
  <p>Este contenido estaba oculto y aparece al hacer clic en el resumen.</p>
</details>
\`\`\`

- El \`<summary>\` es la parte siempre visible (el titulo que se clickea).
- Todo lo demas dentro del \`<details>\` se muestra/oculta.
- Agrega el atributo \`open\` para que aparezca **abierto por defecto**: \`<details open>\`.

### dialog — una ventana modal nativa

\`<dialog>\` es una ventana emergente (modal). El **marcado** es HTML:

\`\`\`html
<dialog open>
  <p>Soy una ventana de dialogo.</p>
</dialog>
\`\`\`

> **Honestidad tecnica:** con el atributo \`open\` se muestra estatica. Para **abrirla y cerrarla** con
> botones se usa JavaScript (\`dialog.showModal()\` y \`dialog.close()\`), que veras mas adelante. Hoy
> aprendemos su **estructura**.`,
      codeExample: {
        html: `<details>
  <summary>Que incluye el curso?</summary>
  <p>HTML, CSS, JavaScript y una introduccion a React.</p>
</details>

<details open>
  <summary>Necesito saber programar? (abierto por defecto)</summary>
  <p>No. Empezamos desde cero.</p>
</details>`,
        css: ``,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html17-leccion-02",
      title: "Indicadores: progress y meter",
      content: `## Indicadores: progress y meter

Dos elementos que **dibujan una barra** por si solos (se ven sin CSS). Se parecen, pero se usan distinto.

### progress — avance hacia una meta

Para algo que **avanza** de 0 a un total: una descarga, una subida, el paso de un formulario.

\`\`\`html
<progress value="40" max="100"></progress>
\`\`\`

- \`value\` = cuanto va. \`max\` = el total.
- Si omites \`value\`, se muestra "cargando" (animada).

### meter — una medida dentro de un rango

Para una **medicion fija** dentro de un rango conocido: bateria, espacio en disco, una puntuacion.

\`\`\`html
<meter value="0.7" min="0" max="1"></meter>

<!-- Con umbrales: cambia de color segun el valor -->
<meter value="20" min="0" max="100" low="30" high="70" optimum="90"></meter>
\`\`\`

### La diferencia clave

| Elemento | Cuando usarlo |
|----------|---------------|
| \`<progress>\` | Algo **avanza** hacia una meta (descarga, subida, pasos completados) |
| \`<meter>\` | Una **medida** en un rango conocido (bateria, disco, nota) |

> Regla mental: **progress = progreso** (se mueve hacia el final). **meter = medidor** (una foto fija de una cantidad).`,
      codeExample: {
        html: `<p>Descargando actualizacion:</p>
<progress value="65" max="100"></progress>

<p>Bateria:</p>
<meter value="80" min="0" max="100" low="20" high="60" optimum="100"></meter>

<p>Espacio en disco usado:</p>
<meter value="90" min="0" max="100" high="80"></meter>`,
        css: ``,
        editable: true,
      },
      order: 2,
    },
  ],
  exercises: [
    {
      id: "html17-ej-01",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 1,
      prompt: "Quieres mostrar el nivel de bateria de un dispositivo (una cantidad fija en un rango). Que elemento usas?",
      options: [
        { id: "a", text: "<meter> — es una medida dentro de un rango conocido", isCorrect: true },
        { id: "b", text: "<progress> — porque siempre se usa para barras", isCorrect: false },
        { id: "c", text: "<details> — para mostrar la bateria al hacer clic", isCorrect: false },
        { id: "d", text: "<dialog> — abre una ventana con la bateria", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "progress = avanza hacia una meta; meter = una medida fija en un rango.",
      explanation:
        "La bateria es una medicion dentro de un rango (0 a 100%), no un avance hacia una meta: por eso <meter>. <progress> es para cosas que progresan, como una descarga.",
    },
    {
      id: "html17-ej-02",
      type: "live-editor",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Crea un acordeon con <details>: un <summary> que diga 'Horario de atencion' y dentro un <p> con el horario.",
      codeTemplate: { html: `<!-- Tu <details> aqui -->`, cssPrefix: "", cssSuffix: "" },
      validation: {
        type: "includes-ordered",
        answer: ["<details", "<summary", "</summary>", "<p>", "</p>", "</details>"],
      },
      hint: "El <summary> va primero (es lo visible); el resto del contenido va despues, todo dentro de <details>.",
      explanation:
        "<details> envuelve todo; el <summary> es la parte clickeable siempre visible, y lo demas se muestra/oculta. Sin una linea de JavaScript.",
    },
    {
      id: "html17-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Crea una barra de <progress> para una subida de archivo que va en el 40% (de un total de 100).",
      codeTemplate: { html: `<!-- Tu <progress> aqui -->`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "progress[value=\"40\"]",
          "progress[max=\"100\"]",
        ],
      },
      hint: "value es cuanto va (40) y max es el total (100).",
      explanation:
        "<progress value=\"40\" max=\"100\"> dibuja una barra llena al 40%. Se usa para avances hacia una meta.",
    },
    {
      id: "html17-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Crea un <meter> que muestre una puntuacion de 8 en un rango de 0 a 10.",
      codeTemplate: { html: `<!-- Tu <meter> aqui -->`, cssPrefix: "", cssSuffix: "" },
      validation: {
        // Parses the submitted HTML into a DOM and checks each expectation with
        // a CSS selector, so nesting and attributes are verified rather than the
        // presence of tag fragments anywhere in the text. See src/lib/htmlStructure.ts.
        type: "html-structure",
        answer: [
          "meter[value=\"8\"]",
          "meter[min=\"0\"]",
          "meter[max=\"10\"]",
        ],
      },
      hint: "meter necesita value (8), min (0) y max (10).",
      explanation:
        "<meter> representa una medida dentro de un rango conocido; aqui una puntuacion de 8 sobre 10.",
    },
    {
      id: "html17-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Arrastra cada elemento a su uso correcto:",
      dragItems: [
        { id: "d1", content: "<details>", correctZone: "z1" },
        { id: "d2", content: "<dialog>", correctZone: "z2" },
        { id: "d3", content: "<progress>", correctZone: "z3" },
        { id: "d4", content: "<meter>", correctZone: "z4" },
      ],
      dropZones: [
        { id: "z1", label: "Mostrar/ocultar contenido al hacer clic" },
        { id: "z2", label: "Una ventana modal (emergente)" },
        { id: "z3", label: "El avance de una descarga" },
        { id: "z4", label: "El nivel de bateria (medida en un rango)" },
      ],
      validation: { type: "exact", answer: { d1: "z1", d2: "z2", d3: "z3", d4: "z4" } },
      hint: "progress = avanza; meter = mide; details = despliega; dialog = ventana.",
      explanation:
        "details muestra/oculta; dialog es una ventana modal; progress marca un avance hacia una meta; meter mide una cantidad en un rango.",
    },
    {
      id: "html17-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Escribe la estructura de un <dialog> (con el atributo open para verlo) que contenga un <p> y un <button> que diga 'Cerrar'.",
      codeTemplate: { html: `<!-- Tu <dialog> aqui -->`, cssPrefix: "", cssSuffix: "" },
      validation: {
        type: "includes-ordered",
        answer: ["<dialog", "open", "<p>", "</p>", "<button", "</button>", "</dialog>"],
      },
      hint: "Escribe <dialog open> ... </dialog>, y dentro un <p> y un <button>.",
      explanation:
        "Con el atributo open el <dialog> se ve estatico. Para abrirlo/cerrarlo con el boton se necesita JavaScript (showModal/close), que veras mas adelante.",
    },
  ],
};
