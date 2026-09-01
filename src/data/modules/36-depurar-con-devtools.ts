import type { ModuleData } from "@/types";

export const depurarConDevtoolsModule: ModuleData = {
  slug: "depurar-con-devtools",
  title: "Depurar con DevTools",
  description:
    "Dejar de adivinar por qué no se aplica el estilo. El navegador ya te lo está diciendo; falta saber dónde mirar.",
  order: 31,
  dojo: "css" as const,
  nivel: "profundizacion",
  category: "css-herramientas",
  icon: "search",
  lessons: [
    {
      id: "36-leccion-01",
      order: 1,
      title: "No me aplica el estilo",
      content: `## La frase

Es la frase más repetida por alguien que está aprendiendo CSS, y casi siempre viene con la misma reacción: agregar \`!important\` y seguir.

Eso apaga el síntoma y deja la causa. Y la causa el navegador ya te la está mostrando: solo hay que abrir el panel.

## Abrir DevTools

Clic derecho sobre el elemento que te está molestando, y **Inspeccionar**. Se abre el panel con dos mitades que importan:

- a la izquierda, el **árbol del DOM**, con tu elemento resaltado;
- a la derecha, el panel **Styles**, con todas las reglas que lo tocan.

También sirve F12, o Ctrl+Shift+I. Pero el clic derecho sobre el elemento exacto te ahorra buscarlo en el árbol, y esa es la diferencia entre usarlo y no usarlo.

## Lo que dice el panel Styles

Las reglas aparecen **en orden de peso: la que gana está arriba**. Cada bloque te dice de qué archivo y de qué línea salió, y podés hacer clic para ir ahí.

Al final de la lista está \`user agent stylesheet\`: las reglas que trae el navegador de fábrica. Ese margen que aparece de la nada en un \`<h1>\` o en un \`<body>\` sale de ahí, no de tu código.

## La regla vacía

Si inspeccionás un elemento y tu selector **no aparece en ninguna parte** de la lista, no es que "no se aplica": es que **esa regla no está matcheando ese elemento**. Casi siempre por una de tres:

1. una letra distinta en el nombre de la clase,
2. el archivo CSS no se está cargando,
3. el selector describe una estructura que tu HTML no tiene -por ejemplo, \`.tarjeta > p\` cuando el \`<p>\` es nieto y no hijo-.

Las tres se ven en un segundo mirando el panel, y ninguna se resuelve con \`!important\`.

## Editar en vivo

En el panel Styles podés cambiar cualquier valor y **verlo al instante**. Hacé clic en el número, usá las flechas arriba y abajo para subirlo y bajarlo de a uno, o Shift más flecha para ir de a diez.

Es la forma más rápida que existe de entender una propiedad nueva: la movés y mirás. Nada de eso se guarda en tu archivo, así que se puede romper todo sin miedo.`,
      codeExample: {
        html: `<div class="tarjeta">
  <h2 class="titulo">Inspeccioná este título</h2>
  <p>Clic derecho encima, Inspeccionar, y mirá el panel Styles.</p>
</div>`,
        css: `.tarjeta {
  padding: 20px;
  background: #1e1e2e;
  border-radius: 10px;
  color: #cdd6f4;
}

/* El h2 ya trae margin del user agent stylesheet.
   Inspeccionalo y vas a ver de dónde sale. */
.titulo {
  color: #a78bfa;
  margin-top: 0;
}`,
        editable: true,
      },
    },
    {
      id: "36-leccion-02",
      order: 2,
      title: "El estilo tachado",
      content: `## La pista más importante del panel

Inspeccionás un elemento, encontrás tu regla, y la propiedad aparece **tachada**:

\`\`\`
.boton {
  color: blue;        <- tachado
}
\`\`\`

Ese tachado significa una cosa muy concreta: **la propiedad se está aplicando, pero otra regla la está pisando.** No es que tu CSS esté mal escrito ni que no cargue. Es que perdiste.

Y como las reglas están ordenadas por peso, **la que ganó está más arriba en la lista**. Subís, la encontrás, y ahí termina el misterio.

## Por qué ganó la otra

Ya viste el mecanismo en especificidad. El panel te lo muestra funcionando:

| Lo que ves | Lo que pasó |
|---|---|
| La ganadora tiene más clases o un \`#id\` | mayor especificidad |
| Las dos se ven iguales | empataron, y ganó la que está después en el archivo |
| La ganadora dice \`element.style\` | es un estilo inline en el HTML, o algo que puso JavaScript |
| La ganadora tiene \`!important\` | te vas a tener que meter con eso |

Ese \`element.style\` que aparece arriba de todo es el que más confunde: no está en ningún archivo CSS. Está en el atributo \`style\` del HTML, o lo escribió JavaScript en tiempo de ejecución.

## Lo que el tachado te ahorra

Sin el panel, "no me aplica el estilo" es un problema abierto: puede ser el archivo, el nombre, el selector, la especificidad, el orden. Con el panel es una pregunta cerrada:

- **¿La regla aparece?** Si no aparece, el selector no matchea.
- **¿Aparece tachada?** Otra regla le gana, y está más arriba.
- **¿Aparece sin tachar y aun así no se ve?** Entonces la propiedad se aplica y el problema es otro: el elemento está tapado, tiene tamaño cero, o el color coincide con el fondo.

Tres preguntas, tres caminos. Eso es depurar en vez de probar cosas.`,
      codeExample: {
        html: `<p class="texto destacado">Inspeccioname y mirá cuál de los dos color queda tachado.</p>`,
        css: `/* Las dos reglas tocan el mismo elemento y la misma propiedad.
   Una va a aparecer tachada en el panel. */
.texto {
  color: #6c7086;
  font-size: 16px;
}

.texto.destacado {
  color: #f9e2af;
}`,
        editable: true,
      },
    },
    {
      id: "36-leccion-03",
      order: 3,
      title: "El diagrama del box model y el panel Computed",
      content: `## De dónde sale ese espacio

Tenés un elemento separado de otro y no sabés por qué. ¿Es un \`margin\`? ¿Un \`padding\`? ¿Un \`gap\` del contenedor? ¿El \`margin\` que trae el navegador de fábrica?

Al final del panel Styles hay un diagrama de cajas concéntricas con números adentro. Es el box model de ese elemento, con sus medidas reales:

\`\`\`
margin
  border
    padding
      el contenido, con su ancho por alto
\`\`\`

Pasá el mouse por cada capa y el navegador **la pinta sobre la página**. Ahí se termina la discusión: ves exactamente qué capa está generando el espacio, y en qué lado.

Un número en gris claro significa que esa capa vale cero. Un guión, que no aplica.

## El panel Computed

Al lado de Styles está **Computed**, y responde una pregunta distinta.

- **Styles** te dice *qué reglas escribiste y cuál gana*.
- **Computed** te dice *en qué terminó cada propiedad*, un único valor final, con todo ya resuelto.

Es el panel para cuando el valor no está en ninguna de tus reglas:

- \`width: 50%\` en Styles, \`width: 320px\` en Computed;
- \`font-size: 1.5em\` en Styles, \`24px\` en Computed;
- un \`color\` que no escribiste en ninguna parte, porque **lo heredó** del padre.

Ese último caso es el que más cuesta encontrar sin Computed: la propiedad no aparece en tus reglas porque nadie la declaró en ese elemento. Al lado de cada valor heredado, Computed te muestra de qué elemento vino.

## La búsqueda del panel

Computed tiene una cajita de filtro. Escribís \`margin\` y te quedan solo las propiedades de margen. Con más de trescientas propiedades calculadas por elemento, ese filtro es la diferencia entre encontrar algo y perderse.`,
      codeExample: {
        html: `<div class="contenedor">
  <p class="hijo">Inspeccioname y mirá el diagrama de cajas.</p>
</div>`,
        css: `.contenedor {
  padding: 24px;
  background: #313244;
  color: #cdd6f4;
  font-size: 18px;
}

/* El hijo no declara color ni font-size.
   Buscalos en Computed: los heredó del contenedor. */
.hijo {
  margin: 16px 0;
  padding: 12px;
  border: 2px solid #a78bfa;
  background: #1e1e2e;
}`,
        editable: true,
      },
    },
    {
      id: "36-leccion-04",
      order: 4,
      title: "Forzar estados y el modo dispositivo",
      content: `## El problema de :hover

Escribís un \`:hover\` y querés inspeccionarlo. Movés el mouse sobre el elemento para que se active, vas al panel a mirarlo… y al mover el mouse hacia el panel el \`:hover\` se apaga.

Es una pelea que no se puede ganar, y no hace falta pelearla.

## Forzar el estado

En el panel Styles hay un botón que dice **\`:hov\`**. Lo abrís y te aparecen casillas:

\`\`\`
:active   :hover   :focus   :focus-visible   :visited
\`\`\`

Marcás \`:hover\` y el elemento **se queda** en ese estado mientras vos mirás el panel con tranquilidad. Se destilda cuando querés.

Es la única forma cómoda de trabajar un \`:focus-visible\`, porque ese además desaparece en cuanto hacés clic en otro lado.

## El modo dispositivo

El botón con el ícono de celular y tablet -o Ctrl+Shift+M- pone la página en un viewport simulado. Elegís un tamaño, o arrastrás el borde y ves el ancho en píxeles mientras lo movés.

Para lo que sirve de verdad: **encontrar dónde se rompe**. Arrastrás despacio, mirás el número, y anotás el ancho exacto en el que el layout se desarma. Ese número es tu media query, y sale de mirar en vez de copiar los breakpoints de otra persona.

Un aviso: es una **simulación de tamaño**, no un celular. El ancho y la orientación son reales; el rendimiento y algunos comportamientos táctiles, no. Para las decisiones de CSS alcanza y sobra.

## El truco que cierra el círculo

Cuando algo no se ve y no entendés por qué, seleccioná el elemento en el árbol del DOM y fijate si el navegador lo resalta en la página.

- **No lo resalta en ningún lado**: existe en el DOM pero no ocupa lugar. Ancho cero, alto cero, o \`display: none\`.
- **Lo resalta fuera de la pantalla**: está ahí, pero un \`position\` o un \`overflow\` lo mandó afuera.

Ese resaltado responde en dos segundos una pregunta que a mano puede llevar veinte minutos.`,
      codeExample: {
        html: `<button class="boton">Forzá el hover desde el panel</button>
<div class="fantasma">No me ves, pero estoy en el DOM.</div>`,
        css: `.boton {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #313244;
  color: #cdd6f4;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.boton:hover {
  background: #a78bfa;
  color: #11111b;
}

/* Seleccionalo en el árbol del DOM:
   el navegador no lo resalta en ninguna parte. */
.fantasma {
  width: 0;
  height: 0;
  overflow: hidden;
}`,
        editable: true,
      },
    },
  ],
  exercises: [
    {
      id: "36-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Inspeccionás un elemento y tu selector no aparece en ninguna parte del panel Styles. ¿Qué significa?",
      options: [
        { id: "a", text: "Que la regla existe pero otra le gana", isCorrect: false },
        { id: "b", text: "Que el selector no está matcheando ese elemento", isCorrect: true },
        { id: "c", text: "Que la propiedad no es válida", isCorrect: false },
        { id: "d", text: "Que hace falta agregarle !important", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El panel lista TODAS las reglas que tocan el elemento, incluso las que pierden. Si la tuya no está en esa lista, no llegó a tocarlo.",
      explanation:
        "Si la regla existiera y estuviera perdiendo, aparecería tachada. No aparecer significa que el selector no matchea: una letra distinta en el nombre de la clase, el archivo que no carga, o un selector que describe una estructura que el HTML no tiene. Ninguna de las tres se arregla con !important.",
    },
    {
      id: "36-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "En el panel Styles ves color: blue tachado dentro de tu regla. ¿Qué está pasando y dónde buscás la causa?",
      options: [
        { id: "a", text: "La propiedad está mal escrita, y hay que corregir el nombre", isCorrect: false },
        { id: "b", text: "Otra regla la está pisando, y esa regla está más arriba en la lista", isCorrect: true },
        { id: "c", text: "El archivo CSS no se cargó, y hay que revisar el link", isCorrect: false },
        { id: "d", text: "El elemento está oculto, y hay que revisar su display", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El panel ordena las reglas por peso. ¿Dónde queda la que gana?",
      explanation:
        "El tachado significa que la propiedad se aplicó y perdió. Como las reglas se listan en orden de peso, la ganadora está más arriba: subís y la encontrás. Una propiedad mal escrita no aparecería tachada sino marcada como inválida, con otro ícono.",
    },
    {
      id: "36-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Arriba de todas tus reglas aparece un bloque que dice element.style con la propiedad que te está pisando. ¿De dónde salió?",
      options: [
        { id: "a", text: "Del user agent stylesheet, o sea de los estilos de fábrica del navegador", isCorrect: false },
        { id: "b", text: "Del atributo style en el HTML, o de JavaScript escribiendo el estilo en vivo", isCorrect: true },
        { id: "c", text: "De una hoja de estilos externa que se cargó después", isCorrect: false },
        { id: "d", text: "De una media query que está activa en este ancho", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "No está en ningún archivo CSS, y sin embargo le gana a todo lo que escribiste en uno.",
      explanation:
        "element.style es el estilo inline del elemento: el atributo style del HTML, o algo que JavaScript le puso en tiempo de ejecución. Los estilos de fábrica aparecen al final de la lista bajo user agent stylesheet, que es el otro lugar del que salen valores que no escribiste.",
    },
    {
      id: "36-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Un elemento tiene un color que no aparece declarado en ninguna de tus reglas. ¿Qué panel te dice de dónde salió?",
      options: [
        { id: "a", text: "Styles, porque lista todas las reglas que lo tocan", isCorrect: false },
        { id: "b", text: "Computed, que muestra el valor final y de qué elemento se heredó", isCorrect: true },
        { id: "c", text: "El diagrama del box model, que muestra las medidas reales", isCorrect: false },
        { id: "d", text: "El árbol del DOM, que muestra la estructura", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Styles responde qué reglas escribiste. Falta el panel que responde en qué terminó cada propiedad.",
      explanation:
        "Si nadie declaró la propiedad en ese elemento, no va a estar en Styles: llegó por herencia. Computed muestra el valor final resuelto de cada propiedad y, cuando viene heredado, de qué elemento salió. Es también el panel donde un width: 50% aparece ya convertido a píxeles.",
    },
    {
      id: "36-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "El panel te mostró que .aviso tiene color tachado porque .aviso.urgente le gana. Escribí las dos reglas: .aviso con color #6c7086 y .aviso.urgente con color #f38ba8.",
      codeTemplate: {
        html: `<p class="aviso urgente">El servidor no responde</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".aviso {\n  color: #6c7086;\n}\n.aviso.urgente {\n  color: #f38ba8;\n}",
      validation: { type: "css-rules" },
      hint: "El selector que gana es el que nombra las dos clases del elemento.",
      explanation:
        "Dos clases pesan más que una, así que .aviso.urgente gana sin necesidad de !important ni de reordenar nada. Eso es exactamente lo que el tachado del panel te estaba mostrando, y por eso el tachado no es un error: muchas veces es el comportamiento que querías.",
    },
    {
      id: "36-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Querés inspeccionar tranquilo el estado :hover de un botón, pero se apaga al mover el mouse hacia el panel. ¿Cuál es la salida?",
      options: [
        { id: "a", text: "Convertir el :hover en una clase y agregarla a mano", isCorrect: false },
        { id: "b", text: "Usar el botón :hov del panel Styles para forzar el estado", isCorrect: true },
        { id: "c", text: "Pausar la ejecución de JavaScript", isCorrect: false },
        { id: "d", text: "Abrir el panel en una ventana aparte", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El panel tiene un botón chiquito que abre casillas con los nombres de las pseudo-clases.",
      explanation:
        "El botón :hov abre las casillas de :active, :hover, :focus, :focus-visible y :visited, y el elemento se queda en el estado que marques. Es la única forma cómoda de trabajar un :focus-visible, que además desaparece apenas hacés clic en otro lado.",
    },
    {
      id: "36-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 7,
      prompt:
        "Seleccionás un elemento en el árbol del DOM y el navegador no lo resalta en ninguna parte de la página. ¿Qué sabés?",
      options: [
        { id: "a", text: "Que el elemento no existe en el HTML", isCorrect: false },
        { id: "b", text: "Que existe en el DOM pero no ocupa lugar: ancho o alto en cero, o display: none", isCorrect: true },
        { id: "c", text: "Que su color coincide con el del fondo", isCorrect: false },
        { id: "d", text: "Que está tapado por otro elemento con mayor z-index", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Si no existiera, no lo podrías seleccionar en el árbol. Está: lo que no tiene es superficie.",
      explanation:
        "El resaltado marca el área que el elemento ocupa. Que no aparezca en ningún lado significa que esa área es cero, o que no se genera caja. Si estuviera tapado o del color del fondo el resaltado igual aparecería, y eso es justamente lo que distingue los dos problemas en dos segundos.",
    },
    {
      id: "36-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Arrastrando el borde en modo dispositivo encontraste que el layout se rompe a los 720px. Escribí .panel con display: grid y grid-template-columns: 1fr 1fr, y dentro de una media query de max-width: 720px pasalo a una sola columna con grid-template-columns: 1fr.",
      codeTemplate: {
        html: `<div class="panel"><div>Columna A</div><div>Columna B</div></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".panel {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}\n@media (max-width: 720px) {\n  .panel {\n    grid-template-columns: 1fr;\n  }\n}",
      validation: { type: "css-rules" },
      hint: "El breakpoint no es un número de memoria: es el ancho exacto en el que viste romperse el layout.",
      explanation:
        "Ese 720 no salió de una lista de breakpoints estándar: salió de arrastrar el borde y mirar el número cuando el diseño se desarmó. Es la diferencia entre un breakpoint que corresponde a tu contenido y uno copiado de un framework que nunca vio tu página.",
    },
  ],
};
