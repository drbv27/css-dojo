import type { ModuleData } from "@/types";

export const tipografiaWebModule: ModuleData = {
  slug: "tipografia-web",
  title: "Tipografía web: salir de Arial",
  description:
    "Cómo se carga una fuente que la máquina del visitante no tiene, qué cuesta cada peso que pedís, y qué ve el usuario mientras la fuente viaja.",
  order: 10,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-texto",
  icon: "TypeOutline",
  lessons: [
    {
      id: "32-leccion-01",
      title: "La pila de fuentes, y por qué el respaldo no es opcional",
      content: `## El problema que resuelve

En el módulo de tipografías escribiste esto:

\`\`\`css
body {
  font-family: Arial, sans-serif;
}
\`\`\`

Y funcionó, porque Arial está en casi todas las máquinas del mundo. Ahora probá con la fuente que te pidió el cliente:

\`\`\`css
body {
  font-family: Poppins;
}
\`\`\`

En tu máquina se ve perfecto, porque la instalaste para hacer el diseño. **En la del visitante se ve Times New Roman.** No hay error, no hay aviso: el navegador buscó Poppins, no la encontró, y usó lo que tenía.

## La pila es una lista de intentos

\`font-family\` no recibe una fuente: recibe **una lista en orden de preferencia**.

\`\`\`css
body {
  font-family: "Poppins", "Segoe UI", Arial, sans-serif;
}
\`\`\`

El navegador prueba de izquierda a derecha y se queda con la primera que tenga. Y el último de la lista **nunca es un nombre**: es una **familia genérica** —\`sans-serif\`, \`serif\`, \`monospace\`— que el navegador siempre puede resolver.

## La regla

**Toda pila termina en una genérica.** Sin eso, el día que fallen todas las anteriores el navegador usa su default, que suele ser una serif que no elegiste y que te rompe el diseño entero.

Y las comillas: van cuando el nombre tiene espacios. \`"Segoe UI"\` sí, \`Arial\` no. Ponerlas siempre tampoco está mal y te ahorra pensarlo.

## Lo que esto todavía no resuelve

Nada de esto **trae** la fuente. La pila sólo elige entre las que el visitante ya tiene, y Poppins no la tiene nadie por defecto.

Traerla es la lección que sigue, y ahí aparece la parte que casi nadie mide: cuánto pesa cada peso que pedís, y qué ve el usuario durante los milisegundos en que la fuente todavía está viajando.`,
      order: 1,
    },
    {
      id: "32-leccion-02",
      title: "Traer la fuente: link contra import",
      content: `## Las dos formas, y no dan lo mismo

Google Fonts te ofrece dos maneras de traer una fuente. Las dos funcionan. Una es claramente mejor.

**Con \`<link>\`, en el HTML:**

\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
\`\`\`

**Con \`@import\`, en el CSS:**

\`\`\`css
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");
\`\`\`

## Por qué el link gana

\`@import\` **encadena las descargas**. El navegador baja tu \`styles.css\`, lo empieza a leer, encuentra el \`@import\` en la primera línea, y **recién ahí** sale a pedir la fuente. Son dos viajes, uno después del otro.

Con \`<link>\` en el HTML, el navegador ve los dos pedidos apenas parsea el \`<head>\` y los hace **en paralelo**.

En una conexión buena la diferencia es de milésimas. En un celular con señal mala son cientos de milisegundos de texto invisible o mal dibujado, y esos sí se ven.

## Y el preconnect, que casi nadie pone

Esas dos líneas de \`preconnect\` que Google te da y que todo el mundo borra por "ruido" hacen algo concreto: le avisan al navegador que va a tener que hablar con esos dos dominios, así va abriendo la conexión mientras todavía está leyendo el resto del HTML.

Son gratis y se notan. Dejalas.

## La regla

**\`<link>\` en el HTML, siempre.** \`@import\` existe, es válido, y su lugar es adentro de un CSS que ya se está usando para otra cosa —como partir una hoja grande en varias—, nunca para traer una fuente.`,
      order: 2,
    },
    {
      id: "32-leccion-03",
      title: "Los pesos, y lo que cuesta cada uno",
      content: `## El error que se comete una sola vez

Entrás a Google Fonts, te gusta Poppins, y la página te deja tildar los pesos. Están todos ahí: 100, 200, 300, 400, 500, 600, 700, 800, 900. Y cada uno con su cursiva.

Tildás todos, "por las dudas".

## Lo que eso cuesta, en números

Cada peso es **un archivo distinto**. No es una fuente que se estira: la redonda de 400 y la negrita de 700 son dos diseños dibujados por separado.

Una fuente latina moderna en formato \`woff2\` pesa aproximadamente:

| Lo que pedís | Archivos | Peso aproximado |
|---|---|---|
| 400 | 1 | ~15 KB |
| 400 y 700 | 2 | ~30 KB |
| Los nueve pesos | 9 | ~135 KB |
| Los nueve, más cursivas | 18 | ~270 KB |

**270 KB para una tipografía.** Es más de lo que pesa toda tu página. Y en un celular con 3G eso es un segundo largo antes de que se lea la primera palabra.

## Lo que necesitás de verdad

Casi cualquier sitio se resuelve con **dos pesos**: uno para el texto y uno para los títulos.

\`\`\`
family=Poppins:wght@400;700
\`\`\`

Si el diseño pide un tercero, se agrega ese tercero. Lo que no se hace es tildar los nueve por si acaso.

## La cursiva falsa, y por qué evitarla

Si pedís sólo la redonda y después escribís \`font-style: italic\`, el navegador **te la inventa**: inclina la letra por software. Se llama cursiva sintética y se nota, porque una cursiva de verdad no es la redonda torcida, es otro dibujo.

Si vas a usar cursiva, pedila. Si no la vas a usar, no la traigas.`,
      order: 3,
    },
    {
      id: "32-leccion-04",
      title: "font-face, font-display y el parpadeo",
      content: `## Cuando la fuente no viene de Google

\`@font-face\` es la forma cruda: le decís al navegador cómo se llama la fuente y dónde está el archivo.

\`\`\`css
@font-face {
  font-family: "MiFuente";
  src: url("/fuentes/mifuente.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

body {
  font-family: "MiFuente", Arial, sans-serif;
}
\`\`\`

Fijate que el \`font-family\` de adentro del \`@font-face\` **no selecciona nada**: es el nombre que le estás inventando para poder usarlo después.

Y \`font-weight: 400\` tampoco pone la letra en 400: le está diciendo al navegador **cuál peso es este archivo**. Si tenés la negrita, va otro bloque igual con \`700\` y su propio \`url\`.

## Qué ve el usuario mientras la fuente viaja

Acá está la parte que casi nadie enseña. Entre que la página se dibuja y que la fuente llega pasa un rato, y en ese rato **hay que mostrar algo**.

Las dos cosas que pueden pasar tienen nombre:

- **FOIT** —texto invisible—: el navegador no dibuja nada hasta que la fuente llega. La página se ve vacía.
- **FOUT** —texto sin estilo—: el navegador dibuja con la fuente de respaldo y cambia cuando llega la buena. Se ve un salto.

## font-display elige cuál de los dos

\`\`\`css
font-display: swap;      /* dibuja YA con el respaldo, y cambia al llegar */
font-display: block;     /* espera hasta 3s en blanco, despues el respaldo */
font-display: optional;  /* si no llega rapido, ni la usa */
\`\`\`

**\`swap\` es el que querés casi siempre.** El salto de la fuente molesta un segundo; el texto invisible impide leer.

Y ese salto se hace chico si tu respaldo se parece a la fuente buena. Por eso la pila importa: \`"Poppins", "Segoe UI", Arial, sans-serif\` salta menos que \`"Poppins", serif\`.

## Lo que te llevás

Elegir una fuente es la mitad. La otra mitad es **qué ve el usuario en el segundo en que todavía no llegó**, y eso lo decidís vos con \`font-display\` y con la pila.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "32-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Por qué toda pila de fuentes tiene que terminar en una familia genérica como sans-serif?",
      options: [
        { id: "a", text: "Porque el navegador ignora la primera fuente de la lista si no lleva comillas", isCorrect: false },
        { id: "b", text: "Porque las genéricas cargan más rápido que las fuentes con nombre", isCorrect: false },
        { id: "c", text: "Porque si fallan todas las anteriores, el navegador usa su propia fuente por defecto y no la que vos elegiste", isCorrect: true },
        { id: "d", text: "Porque sin una genérica el texto no se muestra hasta que termine de cargar la fuente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Pensá qué pasa cuando el visitante no tiene ninguna de las fuentes que nombraste: alguien tiene que decidir, y si no decidís vos decide el navegador.",
      explanation:
        "La genérica es tu última palabra. Sin ella, cuando ninguna de las fuentes con nombre está disponible el navegador cae en su default, que en la mayoría es una serif. Terminar en sans-serif o serif es elegir vos la peor forma posible en vez de dejarla al azar.",
    },
    {
      id: "32-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "Dale a la clase 'titular' una pila de fuentes que intente Georgia primero, después 'Times New Roman', y termine en la genérica serif. Agregale también font-size: 32px y color: #2c2c2c.",
      codeTemplate: {
        html: `<h2 class="titular">Crónica de un lunes</h2>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        '.titular {\n  font-family: Georgia, "Times New Roman", serif;\n  font-size: 32px;\n  color: #2c2c2c;\n}',
      validation: { type: "css-rules" },
      hint: "El nombre con espacios lleva comillas; el que es una sola palabra no las necesita. Y la genérica va última, siempre sin comillas.",
      explanation:
        "La pila se lee de izquierda a derecha y el navegador usa la primera que tenga. Terminar en serif es lo que evita que, si fallan las dos anteriores, decida el navegador por vos.",
    },
    {
      id: "32-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "¿Por qué conviene traer una fuente con <link> en el HTML en vez de con @import en el CSS?",
      options: [
        { id: "a", text: "Porque @import no funciona con Google Fonts, sólo con archivos propios", isCorrect: false },
        { id: "b", text: "Porque @import encadena las descargas: el navegador tiene que leer el CSS antes de salir a pedir la fuente", isCorrect: true },
        { id: "c", text: "Porque @import obliga a repetir la declaración en cada archivo CSS del proyecto", isCorrect: false },
        { id: "d", text: "Porque con @import la fuente no queda en la caché del navegador", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Pensá en el orden de los viajes: ¿cuándo se entera el navegador de que tiene que pedir la fuente en cada caso?",
      explanation:
        "Con @import el navegador baja el CSS, lo empieza a leer, encuentra el import y recién ahí pide la fuente: dos viajes en fila. Con <link> ve los dos pedidos al parsear el head y los hace en paralelo. En una conexión buena son milésimas; en un celular con señal mala son cientos de milisegundos de texto sin dibujar.",
    },
    {
      id: "32-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Tildaste los nueve pesos de una fuente más sus cursivas. ¿Qué le estás mandando al visitante?",
      options: [
        { id: "a", text: "Un solo archivo más grande, de unos 40 KB", isCorrect: false },
        { id: "b", text: "Nada extra: el navegador baja sólo los pesos que la página usa", isCorrect: false },
        { id: "c", text: "Dieciocho archivos distintos, unos 270 KB, porque cada peso y cada cursiva es un diseño aparte", isCorrect: true },
        { id: "d", text: "Dos archivos, uno con todas las redondas y otro con todas las cursivas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Una negrita no es la redonda engordada por software: es otro dibujo, hecho por el tipógrafo. Y cada dibujo viaja aparte.",
      explanation:
        "Cada peso es un archivo, y cada cursiva otro. Nueve pesos con sus cursivas son dieciocho archivos y alrededor de 270 KB, más de lo que suele pesar la página entera. Casi todo se resuelve con dos: uno para el texto y uno para los títulos.",
    },
    {
      id: "32-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "Dale a la clase 'cuerpo' la pila 'Poppins', 'Segoe UI', sans-serif, con font-size: 17px y line-height: 1.7. Ojo con las comillas: van sólo en los nombres con espacios.",
      codeTemplate: {
        html: `<p class="cuerpo">El texto largo de una nota se lee mejor con una linea generosa y una fuente pensada para pantalla.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        '.cuerpo {\n  font-family: "Poppins", "Segoe UI", sans-serif;\n  font-size: 17px;\n  line-height: 1.7;\n}',
      validation: { type: "css-rules" },
      hint: "Poppins es una sola palabra y no necesitaría comillas, pero ponerlas siempre te ahorra pensarlo. La genérica va última y nunca lleva.",
      explanation:
        "La pila termina en sans-serif, que es lo que evita que decida el navegador si fallan las dos anteriores. Y elegir un respaldo parecido a la fuente buena hace que el salto, cuando la fuente llega, se note menos.",
    },
    {
      id: "32-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Declará una fuente propia con @font-face: llamala 'MiFuente', traela de \"/fuentes/mifuente.woff2\" en format(\"woff2\"), con font-weight: 400 y font-display: swap.",
      codeTemplate: {
        html: `<p class="nota">Una fuente que no viene de Google se declara a mano.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        '@font-face {\n  font-family: "MiFuente";\n  src: url("/fuentes/mifuente.woff2") format("woff2");\n  font-weight: 400;\n  font-display: swap;\n}',
      validation: { type: "css-rules" },
      hint: "El font-family de adentro del bloque no selecciona nada: es el nombre que le estás inventando a la fuente para poder usarlo después.",
      explanation:
        "El bloque @font-face registra una fuente; no la aplica. El font-weight de adentro le dice al navegador cuál peso es ESTE archivo, no qué grosor poner. Y font-display: swap es lo que evita que el texto quede invisible mientras la fuente viaja.",
    },
    {
      id: "32-ej-07",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt:
        "¿Qué hace font-display: swap mientras la fuente todavía está descargando?",
      options: [
        { id: "a", text: "Dibuja el texto con la fuente de respaldo enseguida, y lo cambia cuando la buena llega", isCorrect: true },
        { id: "b", text: "Deja el texto invisible hasta que la fuente llega, para evitar el salto", isCorrect: false },
        { id: "c", text: "Descarta la fuente si tarda más de un segundo y se queda con el respaldo", isCorrect: false },
        { id: "d", text: "Descarga la fuente antes que el resto de la página", isCorrect: false },
      ],
      validation: { type: "exact", answer: "a" },
      hint: "El nombre lo dice: hay un intercambio. La pregunta es qué se muestra en el mientras tanto.",
      explanation:
        "swap dibuja ya con el respaldo y cambia al llegar la buena: hay un salto visible, pero el texto se puede leer desde el primer momento. block hace lo contrario, deja el texto invisible hasta tres segundos, y optional puede ni usar la fuente. El salto molesta un segundo; el texto invisible impide leer.",
    },
    {
      id: "32-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Armá el encabezado de una nota: a la clase `.titulo` dale la pila 'Poppins', sans-serif con font-weight: 700 y font-size: 34px; y a la clase 'bajada' la misma pila con font-weight: 400, font-size: 19px y color: #555555.",
      codeTemplate: {
        html: `<h1 class="titulo">Como elegir una tipografia</h1><p class="bajada">Dos pesos alcanzan para casi todo, y cada uno que agregas se paga en kilobytes.</p>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        '.titulo {\n  font-family: "Poppins", sans-serif;\n  font-weight: 700;\n  font-size: 34px;\n}\n.bajada {\n  font-family: "Poppins", sans-serif;\n  font-weight: 400;\n  font-size: 19px;\n  color: #555555;\n}',
      validation: { type: "css-rules" },
      hint: "Son exactamente los dos pesos que hay que pedirle a Google Fonts para este encabezado: 400 y 700. Ni uno más.",
      explanation:
        "Este es el caso real: un peso para el texto y uno para los títulos. Con esos dos se resuelve casi cualquier sitio, y son unos 30 KB en vez de los 270 que salen de tildar todo por las dudas.",
    },
    {
      /**
       * EL RETO INTEGRADOR del modulo. Cierra `tipografia-web` haciendo que el
       * alumno declare una fuente propia, la aplique con su pila de respaldo y
       * use los dos pesos que pidio, en UNA sola tarea.
       *
       * No declara `targetCSS`: se deriva de `retoPasos` con `cssEsperadoDe`.
       */
      id: "32-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 9,
      prompt:
        "Mini reto. Armá la tipografía de la nota cumpliendo los cuatro pasos. Ojo con el paso 1: el font-weight de adentro del @font-face dice cuál peso es ese archivo, no qué grosor poner.",
      retoPasos: [
        {
          instruccion:
            "Declará la fuente redonda con @font-face: nombre \"Nota\", archivo \"/fuentes/nota-400.woff2\" en format(\"woff2\"), font-weight 400 y font-display swap.",
          esperado:
            '@font-face { font-family: "Nota"; src: url("/fuentes/nota-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }',
        },
        {
          instruccion:
            "Declará la negrita en otro bloque @font-face igual, con el archivo \"/fuentes/nota-700.woff2\" y font-weight 700.",
          esperado:
            '@font-face { font-family: "Nota"; src: url("/fuentes/nota-700.woff2") format("woff2"); font-weight: 700; font-display: swap; }',
        },
        {
          instruccion:
            'Aplicale a .articulo la pila "Nota", "Segoe UI", sans-serif, con line-height 1.7.',
          esperado:
            '.articulo { font-family: "Nota", "Segoe UI", sans-serif; line-height: 1.7; }',
        },
        {
          instruccion:
            "Poné .articulo-titulo en font-weight 700 y font-size 32px, que es el peso que trajiste en el paso 2.",
          esperado: ".articulo-titulo { font-weight: 700; font-size: 32px; }",
        },
      ],
      codeTemplate: {
        html: `<article class="articulo"><h2 class="articulo-titulo">Dos pesos y nada mas</h2><p>Cada peso que pedis es un archivo aparte, y el usuario lo espera.</p></article>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      referenceSolution:
        '@font-face {\n  font-family: "Nota";\n  src: url("/fuentes/nota-400.woff2") format("woff2");\n  font-weight: 400;\n  font-display: swap;\n}\n@font-face {\n  font-family: "Nota";\n  src: url("/fuentes/nota-700.woff2") format("woff2");\n  font-weight: 700;\n  font-display: swap;\n}\n.articulo {\n  font-family: "Nota", "Segoe UI", sans-serif;\n  line-height: 1.7;\n}\n.articulo-titulo {\n  font-weight: 700;\n  font-size: 32px;\n}',
      validation: { type: "css-rules" },
      hint: "Los dos bloques @font-face llevan el MISMO font-family. No es un error: así el navegador sabe que los dos archivos son la misma familia en distinto peso, y elige solo cuál usar.",
      explanation:
        "El reto junta las tres ideas del módulo: declarar la fuente, darle una pila de respaldo, y pedir sólo los pesos que vas a usar. Los dos @font-face con el mismo nombre son lo que le permite al navegador resolver font-weight: 700 sin inventar una negrita falsa.",
    },
  ],
};
