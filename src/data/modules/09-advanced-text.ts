import type { ModuleData } from "@/types";

export const advancedTextModule: ModuleData = {
  slug: "advanced-text",
  title: "Texto avanzado",
  description:
    "Todo lo que se le puede hacer a un texto más allá del tamaño y el color: subrayados, mayúsculas, espaciado entre letras, sangría, y el recorte con puntos suspensivos.",
  order: 9,
  dojo: "css" as const,
  nivel: "profundizacion",
  category: "css-texto",
  icon: "CaseSensitive",
  lessons: [
    {
      id: "27-leccion-01",
      title: "text-decoration completo, no solo underline",
      content: `## Más de lo que parece

Casi todo el mundo conoce \`text-decoration\` por dos usos: subrayar algo, o sacarle el subrayado a un enlace.

\`\`\`css
.enlace-limpio {
  text-decoration: none;
}
\`\`\`

Pero \`text-decoration\` es una propiedad abreviada de **cuatro** cosas, y las otras tres casi nadie las usa aunque resuelven problemas reales.

| Parte | Qué controla | Valores |
|-------|--------------|---------|
| \`text-decoration-line\` | Dónde va la raya | \`underline\`, \`overline\`, \`line-through\`, \`none\` |
| \`text-decoration-style\` | Cómo es la raya | \`solid\`, \`double\`, \`dotted\`, \`dashed\`, \`wavy\` |
| \`text-decoration-color\` | De qué color | Cualquier color |
| \`text-decoration-thickness\` | Qué tan gruesa | \`auto\`, \`from-font\`, o una medida |

### Las cuatro juntas, en una línea

\`\`\`css
.error-ortografico {
  text-decoration: underline wavy red 2px;
}
\`\`\`

Eso es el subrayado ondulado rojo del corrector de texto, hecho con CSS y sin una sola imagen.

### Por qué el color separado importa

Este es el caso que aparece de verdad en un diseño: un enlace donde el subrayado tiene que ser más suave que el texto.

\`\`\`css
.enlace-suave {
  color: #8b5cf6;
  text-decoration: underline;
  text-decoration-color: #d8c5f7;
}
\`\`\`

Sin \`text-decoration-color\` no se puede: la raya hereda el color del texto y no hay forma de separarlos. Antes esto se falsificaba con un \`border-bottom\`, que es peor, porque un borde no sigue las letras y no se corta bien cuando el texto pasa a la línea siguiente.

### El tachado que significa algo

\`line-through\` no es decoración: comunica. Un precio viejo al lado del nuevo, una tarea terminada.

\`\`\`css
.precio-viejo {
  text-decoration: line-through;
  color: #999;
}
\`\`\`

Ojo con esto: el tachado es **visual**. Un lector de pantalla no lo anuncia, así que si el tachado carga información importante, el texto tiene que decirla también.`,
      codeExample: {
        html: `<p class="error">Esta palabra esta mal ecrita</p>\n<p><a href="#" class="enlace-suave">Un enlace con subrayado suave</a></p>\n<p>Antes: <span class="precio-viejo">$100</span> Ahora: $70</p>`,
        css: `.error {\n  text-decoration: underline wavy red 2px;\n}\n\n.enlace-suave {\n  color: #8b5cf6;\n  text-decoration: underline;\n  text-decoration-color: #d8c5f7;\n}\n\n.precio-viejo {\n  text-decoration: line-through;\n  color: #999;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "27-leccion-02",
      title: "Mayúsculas, espaciado y sangría",
      content: `## Cuatro propiedades chicas que cambian mucho

### text-transform: cambiar la forma sin tocar el HTML

\`\`\`css
.etiqueta {
  text-transform: uppercase;
}
\`\`\`

| Valor | Resultado |
|-------|-----------|
| \`uppercase\` | TODO EN MAYÚSCULAS |
| \`lowercase\` | todo en minúsculas |
| \`capitalize\` | Primera Letra De Cada Palabra |
| \`none\` | Como está en el HTML |

**La razón de fondo, y es la que importa:** el HTML guarda el contenido, el CSS decide cómo se ve. Si escribís "DESARROLLADORA" en mayúsculas dentro del HTML, ese texto **es** mayúsculas para siempre, y un lector de pantalla puede leerlo letra por letra como si fuera una sigla. Con \`text-transform\` el contenido sigue siendo "Desarrolladora" y solo la presentación cambia.

Y \`capitalize\` tiene una trampa: pone en mayúscula la primera letra de **cada palabra**, así que "ana martínez de la torre" queda "Ana Martínez De La Torre". Para nombres suele estar bien; para títulos en español casi nunca, porque el español no capitaliza cada palabra.

### letter-spacing y word-spacing: el aire entre las letras

\`\`\`css
.titulo-espaciado {
  letter-spacing: 2px;
}
\`\`\`

\`letter-spacing\` agrega espacio entre **letras**, \`word-spacing\` entre **palabras**. Aceptan valores negativos, que aprietan.

Dos reglas prácticas:

- Un texto en mayúsculas casi siempre necesita \`letter-spacing\` positivo. Las mayúsculas fueron diseñadas para ir sueltas.
- Un párrafo largo **no** lleva \`letter-spacing\`. Apenas 1px multiplicado por miles de letras destruye la lectura.

Conviene usar \`em\` en lugar de \`px\`, así el espaciado acompaña al tamaño de la letra:

\`\`\`css
.etiqueta {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
\`\`\`

### text-indent: la sangría del primer renglón

\`\`\`css
.parrafo-libro {
  text-indent: 2em;
}
\`\`\`

Sangra **solo la primera línea**, como en un libro impreso. También acepta negativos, que sacan la primera línea para afuera.`,
      codeExample: {
        html: `<p class="etiqueta">Habilidades</p>\n<p class="parrafo-libro">Este parrafo tiene sangria en la primera linea, como en un libro. Las lineas que siguen arrancan pegadas al margen, y por eso se nota donde empieza cada parrafo.</p>`,
        css: `.etiqueta {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #8b5cf6;\n  font-size: 0.875rem;\n}\n\n.parrafo-libro {\n  text-indent: 2em;\n  line-height: 1.6;\n  max-width: 40em;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "27-leccion-03",
      title: 'Los puntos suspensivos: tres propiedades o ninguna',
      content: `## El "…" que corta un título largo

Este es el efecto que ves todos los días: un título que no cabe y termina en puntos suspensivos. Se hace con \`text-overflow: ellipsis\`.

Y acá viene lo importante: **esa propiedad sola no hace nada.** Hacen falta **tres**, y si falta una, no pasa absolutamente nada. Es la causa número uno de "no me funciona el ellipsis".

\`\`\`css
.titulo-corto {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
\`\`\`

### Por qué hacen falta las tres

Pensalo como una cadena de tres pasos, en orden:

1. **\`white-space: nowrap\`** — prohíbe que el texto pase a la línea siguiente. Sin esto el texto simplemente baja y nunca desborda, así que no hay nada que recortar.
2. **\`overflow: hidden\`** — ahora el texto es una sola línea larga que se sale de la caja. Esto la recorta.
3. **\`text-overflow: ellipsis\`** — le dice que en vez de cortar seco, ponga "…".

Si sacás la 1, el texto baja de línea. Si sacás la 2, el texto se sale y se ve entero. Si sacás la 3, se corta a la mitad de una letra. **Las tres o ninguna.**

### white-space por su cuenta

\`white-space\` no existe solo para esto. Controla qué hace el navegador con los espacios y los saltos de línea que escribiste en el HTML:

| Valor | Espacios seguidos | Salto de línea del HTML | Corta línea al llegar al borde |
|-------|-------------------|------------------------|-------------------------------|
| \`normal\` | los junta en uno | lo ignora | sí |
| \`nowrap\` | los junta en uno | lo ignora | **no** |
| \`pre\` | los respeta | lo respeta | no |
| \`pre-wrap\` | los respeta | lo respeta | sí |
| \`pre-line\` | los junta en uno | lo respeta | sí |

\`pre-wrap\` es el que sirve para mostrar texto que el usuario escribió y donde sus saltos de línea importan, como un comentario.

### Lo que el recorte se lleva

El texto recortado **sigue estando** en el HTML: no se borró, solo no se ve. Eso es bueno para el buscador y para un lector de pantalla, pero significa que el usuario no puede leerlo. Si el texto completo importa, dejá una forma de verlo: el atributo \`title\`, o no recortar.`,
      codeExample: {
        html: `<div class="tarjeta">\n  <p class="titulo-corto" title="Desarrolladora Front End especializada en interfaces accesibles">Desarrolladora Front End especializada en interfaces accesibles</p>\n</div>\n<div class="tarjeta">\n  <p class="sin-ellipsis">Desarrolladora Front End especializada en interfaces accesibles</p>\n</div>`,
        css: `.tarjeta {\n  width: 260px;\n  padding: 12px;\n  margin-bottom: 12px;\n  border: 1px solid #ccc;\n}\n\n.titulo-corto {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin: 0;\n}\n\n.sin-ellipsis {\n  margin: 0;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "27-leccion-04",
      title: "text-shadow, y todo junto en el CV de Ana",
      content: `## text-shadow

Misma idea que una sombra de caja, pero sobre las letras. Cuatro valores: cuánto se corre a la derecha, cuánto para abajo, cuánto se difumina, y de qué color.

\`\`\`css
.titulo-con-sombra {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
\`\`\`

El tercer valor es el que decide si queda bien o queda de 1998. Sin difuminado la sombra es un duplicado duro de la letra; con difuminado es una sombra.

### Donde de verdad sirve

No para decorar un título cualquiera, sino para **rescatar la legibilidad** de un texto encima de una imagen o de un fondo con poco contraste:

\`\`\`css
.texto-sobre-foto {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
\`\`\`

Sin corrimiento horizontal, poco vertical y bastante difuminado: el texto blanco se lee igual sobre una zona clara de la foto. Y una aclaración honesta: esto **mejora** el contraste, no lo garantiza. Si el fondo es muy claro, la solución es una capa oscura detrás del texto, no una sombra más fuerte.

## Todo junto en el CV de Ana

\`\`\`css
.titulo-profesional {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.875rem;
}

.perfil {
  line-height: 1.7;
  text-align: justify;
  max-width: 60em;
}

.trabajo {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
\`\`\`

Tres decisiones y ninguna es decorativa: el cargo en mayúsculas espaciadas se lee como una etiqueta y no compite con el nombre; el perfil con más interlineado se lee de corrido; y el nombre de la empresa recortado mantiene la fila prolija cuando el texto es largo.

## Lo que conviene que te lleves

Estas propiedades son **micro-tipografía**: ninguna cambia el layout, todas cambian cuánto se entiende. Y la que más problemas te va a ahorrar es la cadena de tres del ellipsis, porque cuando "no funciona" casi siempre falta \`white-space: nowrap\`.`,
      codeExample: {
        html: `<header class="encabezado">\n  <h1 class="nombre">Ana Martínez</h1>\n  <p class="titulo-profesional">Desarrolladora Front End</p>\n</header>\n<p class="perfil">Perfil profesional con varios anios de experiencia construyendo interfaces que se entienden y que funcionan en cualquier pantalla.</p>`,
        css: `.encabezado {\n  background-color: #8b5cf6;\n  padding: 24px;\n}\n\n.nombre {\n  color: white;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n  margin: 0;\n}\n\n.titulo-profesional {\n  color: #e9dcfb;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-size: 0.875rem;\n  margin: 6px 0 0;\n}\n\n.perfil {\n  line-height: 1.7;\n  text-align: justify;\n  max-width: 60em;\n  padding: 16px 24px;\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "27-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Cuántas propiedades hacen falta para que un texto largo termine en puntos suspensivos?",
      options: [
        { id: "a", text: "Una sola: text-overflow: ellipsis", isCorrect: false },
        {
          id: "b",
          text: "Tres: white-space: nowrap, overflow: hidden y text-overflow: ellipsis",
          isCorrect: true,
        },
        { id: "c", text: "Dos: overflow: hidden y text-overflow: ellipsis", isCorrect: false },
        { id: "d", text: "Ninguna, el navegador lo hace solo cuando el texto no cabe", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Pensá en la cadena: primero hay que impedir que el texto baje de línea, después recortar lo que se sale, y solo al final pedir los puntos.",
      explanation:
        "Hacen falta las tres y en ese orden lógico: white-space: nowrap impide el salto de línea, overflow: hidden recorta lo que se sale, y text-overflow: ellipsis reemplaza el corte seco por los puntos. Si falta cualquiera de las tres, no pasa nada.",
    },
    {
      id: "27-ej-02",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "¿Por qué conviene escribir un cargo en minúsculas en el HTML y pasarlo a mayúsculas con text-transform, en lugar de escribirlo ya en mayúsculas?",
      options: [
        {
          id: "a",
          text: "Porque el contenido sigue siendo el texto real y solo cambia la presentación, que es trabajo del CSS",
          isCorrect: true,
        },
        { id: "b", text: "Porque el HTML no admite letras mayúsculas dentro de un párrafo", isCorrect: false },
        { id: "c", text: "Porque text-transform hace que la página cargue más rápido", isCorrect: false },
        { id: "d", text: "Porque las mayúsculas del HTML se pierden al copiar el texto", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "Volvé a la división de tareas: ¿qué guarda el HTML y qué decide el CSS?",
      explanation:
        "El HTML guarda el contenido y el CSS decide cómo se ve. Un texto escrito en mayúsculas dentro del HTML ES mayúsculas para siempre, y un lector de pantalla puede leerlo letra por letra como si fuera una sigla. Con text-transform el contenido queda intacto y solo cambia la presentación.",
    },
    {
      id: "27-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Completá la propiedad que falta para que este texto no baje de línea y el recorte con puntos pueda funcionar:",
      codeTemplate: {
        html: `<p class="trabajo">Desarrolladora Front End en una empresa con nombre largo</p>`,
        cssPrefix: ".trabajo {\n  ",
        cssSuffix: ": nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}",
        blanks: ["white-space"],
      },
      validation: { type: "exact", answer: "white-space" },
      hint: "Es la que controla qué hace el navegador con los espacios y los saltos de línea. Dos palabras unidas con guion.",
      explanation:
        "white-space: nowrap es el primer eslabón de la cadena: prohíbe el salto de línea, así el texto se convierte en una sola línea larga que puede desbordar. Sin eso el texto baja de línea, nunca desborda, y no hay nada que recortar.",
    },
    {
      id: "27-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Escribí la clase 'trabajo' con las tres propiedades del recorte con puntos suspensivos: white-space: nowrap, overflow: hidden y text-overflow: ellipsis. Agregá también width: 240px para que se vea el efecto.",
      codeTemplate: {
        html: `<p class="trabajo">Desarrolladora Front End en una empresa con nombre muy largo</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".trabajo {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  width: 240px;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Las tres van juntas en la misma regla, más el ancho. Sin un ancho que lo acote, el texto nunca desborda y el efecto no se nota.",
      explanation:
        "Las tres propiedades forman una cadena: nowrap impide el salto de línea, hidden recorta el desborde y ellipsis pone los puntos. El width es lo que crea el límite: sin él la caja crece con el texto y nunca hay desborde que recortar.",
    },
    {
      id: "27-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Arrastrá cada propiedad a lo que controla:",
      dragItems: [
        { id: "drag-1", content: "letter-spacing", correctZone: "zone-letras" },
        { id: "drag-2", content: "word-spacing", correctZone: "zone-palabras" },
        { id: "drag-3", content: "text-indent", correctZone: "zone-primera-linea" },
        { id: "drag-4", content: "text-transform", correctZone: "zone-mayusculas" },
        { id: "drag-5", content: "text-decoration-thickness", correctZone: "zone-grosor" },
      ],
      dropZones: [
        { id: "zone-letras", label: "El espacio entre letras" },
        { id: "zone-palabras", label: "El espacio entre palabras" },
        { id: "zone-primera-linea", label: "La sangría de la primera línea" },
        { id: "zone-mayusculas", label: "Mayúsculas o minúsculas sin tocar el HTML" },
        { id: "zone-grosor", label: "El grosor de la raya del subrayado" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-letras",
          "drag-2": "zone-palabras",
          "drag-3": "zone-primera-linea",
          "drag-4": "zone-mayusculas",
          "drag-5": "zone-grosor",
        },
      },
      hint: "Los nombres en inglés son casi literales: letter es letra, word es palabra, indent es sangría, thickness es grosor.",
      explanation:
        "letter-spacing separa letras y word-spacing separa palabras. text-indent sangra únicamente la primera línea. text-transform cambia mayúsculas y minúsculas sin modificar el contenido. text-decoration-thickness es una de las cuatro partes de text-decoration y controla el grosor de la raya.",
    },
    {
      id: "27-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Escribí la clase 'etiqueta' como una etiqueta tipográfica: text-transform: uppercase, letter-spacing: 0.08em, font-size: 0.875rem y color: #8b5cf6.",
      codeTemplate: {
        html: `<p class="etiqueta">Habilidades</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".etiqueta {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  font-size: 0.875rem;\n  color: #8b5cf6;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "El espaciado va en em y no en px a propósito: así acompaña al tamaño de la letra si después lo cambiás.",
      explanation:
        "Un texto en mayúsculas casi siempre necesita letter-spacing positivo, porque las mayúsculas fueron diseñadas para ir sueltas. Usar em en lugar de px hace que el espaciado escale con el tamaño de fuente en lugar de quedar fijo.",
    },
    {
      id: "27-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Reproducí el diseño objetivo: la clase 'error' con un subrayado ondulado rojo de 2px usando la forma abreviada text-decoration: underline wavy red 2px; y la clase 'precio-viejo' con text-decoration: line-through y color: #999.",
      codeTemplate: {
        html: `<p class="error">Esta palabra esta mal ecrita</p>\n<p>Antes: <span class="precio-viejo">$100</span> Ahora: $70</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".error {\n  text-decoration: underline wavy red 2px;\n}\n\n.precio-viejo {\n  text-decoration: line-through;\n  color: #999;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "La forma abreviada acepta las cuatro partes en una: línea, estilo, color y grosor, separadas por espacios.",
      explanation:
        "text-decoration: underline wavy red 2px junta las cuatro partes en una declaración: la línea es underline, el estilo wavy, el color red y el grosor 2px. Y line-through no es decorativo: comunica que ese precio ya no vale.",
    },
    {
      id: "27-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Un texto tiene overflow: hidden y text-overflow: ellipsis, pero no aparecen los puntos suspensivos: el texto simplemente baja de línea. ¿Qué falta?",
      options: [
        { id: "a", text: "Un text-align: justify", isCorrect: false },
        { id: "b", text: "white-space: nowrap, para impedir el salto de línea", isCorrect: true },
        { id: "c", text: "Cambiar overflow: hidden por overflow: scroll", isCorrect: false },
        { id: "d", text: "Un text-indent negativo que saque el texto de la caja", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Si el texto baja de línea, entonces cabe, y si cabe no desborda. ¿Qué propiedad prohíbe que baje?",
      explanation:
        "Falta white-space: nowrap. Mientras el texto pueda pasar a la línea siguiente siempre va a caber en la caja, así que nunca desborda y no hay nada que recortar. Es el caso más común de puntos suspensivos que no aparecen.",
    },
  ],
};
