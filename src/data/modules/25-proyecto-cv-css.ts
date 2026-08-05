import type { ModuleData } from "@/types";

/**
 * Capstone for the CSS track. It styles the CV the student already built in
 * html-16-proyecto-cv, which was written with semantic tags and ZERO classes --
 * so the first step is adding them. That is the point: a student who has only
 * ever seen `p { }` does not feel why classes exist until they need to style one
 * paragraph differently from another.
 *
 * Shape follows the HTML project rather than the other CSS modules: heavily
 * live-editor, one quiz that catches a mistake the student has probably just
 * made, and a closing integrative step. Every CSS step grades with `css-rules`,
 * the class-adding step with `html-structure`.
 */
export const proyectoCvCssModule: ModuleData = {
  slug: "proyecto-cv-css",
  title: "Proyecto: Estiliza tu CV con CSS",
  description:
    "Toma el CV que escribiste en HTML y convertilo en una página presentable: clases, tipografía, box model, flexbox, grid, tabla y responsive. El cierre del track de CSS.",
  order: 25,
  dojo: "css" as const,
  category: "project",
  icon: "FileUser",
  lessons: [
    {
      id: "25-leccion-01",
      title: "El proyecto: tu CV, ahora con estilo",
      content: `## De la estructura a la presentación

En el track de HTML escribiste un CV. Funciona, es semántico y accesible... y se ve como un documento de 1994. Texto negro, fondo blanco, enlaces azules subrayados.

Eso no es un defecto de tu HTML. **Es exactamente lo que HTML debe hacer:** decir que significa cada cosa, no como se ve. Ahora le toca a CSS.

### Que vamos a construir

Vas a partir del mismo CV y llegar a una página que podrias mandar a una entrevista. En orden:

1. **Clases** — el paso que cambia todo, y el primero
2. **Reset y tipografía** — que se lea bien antes de que se vea lindo
3. **Box model** — el ancho de lectura y el aire alrededor
4. **Header con Flexbox** — nombre a un lado, contacto al otro
5. **Secciones con Grid** — habilidades y experiencia en columnas
6. **La tabla** — que deje de parecer una planilla
7. **La foto** — recortada y redonda, sin deformarse
8. **Responsive** — que sirva en el teléfono

### Una advertencia sobre el orden

Vas a querer saltar directo a las sombras y los degradados. No lo hagas. **Un CV con tipografía mala y sombras hermosas se ve peor que uno con tipografía buena y cero sombras.** La jerarquía visual se construye con tamaño, peso y espacio; el resto es decoración.

> Si no tenes tu CV a mano, cada paso trae el HTML que necesita. Pero si guardaste el tuyo, usalo: el proyecto vale mucho mas cuando estas estilando tus propios datos.`,
      codeExample: {
        html: `<header>\n  <h1>Ana Martinez</h1>\n  <p>Desarrolladora Frontend</p>\n</header>`,
        css: `/* Sin CSS: el navegador aplica sus estilos por defecto */\n/* h1 grande y negrita, p normal, todo apilado y pegado al borde */`,
        js: "",
        editable: false,
      },
      order: 1,
    },
    {
      id: "25-leccion-02",
      title: "Por que tu CV necesita clases",
      content: `## El problema de estilar solo con etiquetas

Tu CV usa \`<p>\` en varios lugares distintos: el título profesional debajo del nombre, el párrafo del perfil, y la descripción de cada trabajo.

Si escribis esto:

\`\`\`css
p {
  font-size: 16px;
  color: #555;
}
\`\`\`

...los tres se ven igual. Pero **no cumplen la misma función**. El título profesional es casi un subtitulo del nombre; el perfil es texto de lectura; la descripción de un trabajo es texto de apoyo.

### La salida no es pelear con la especificidad

Se puede intentar distinguirlos por posición:

\`\`\`css
header p { font-size: 20px; }        /* el titulo profesional */
main section:first-child p { }       /* el perfil... creo? */
\`\`\`

Funciona hasta que movas una sección. **Estas atando tus estilos al orden del HTML**, y el orden cambia.

### La clase nombra la intención

\`\`\`html
<p class="titulo-profesional">Desarrolladora Frontend</p>
<p class="perfil">Desarrolladora con foco en accesibilidad...</p>
\`\`\`

\`\`\`css
.titulo-profesional { font-size: 20px; color: #666; }
.perfil { font-size: 16px; line-height: 1.7; }
\`\`\`

Ahora el estilo dice **que es** cada cosa, no **donde esta**. Podes reordenar todo el CV y nada se rompe.

### Como nombrar

No hay una regla universal, pero si una guia que ahorra dolor: **nombra por función, no por apariencia.**

| Mal | Bien | Por que |
|---|---|---|
| \`.texto-azul\` | \`.enlace-contacto\` | El dia que sea verde, el nombre miente |
| \`.grande\` | \`.titulo-seccion\` | ¿"Grande" respecto de que? |
| \`.div2\` | \`.tarjeta-experiencia\` | No dice nada |

> **Y no borres la semántica.** Las clases se agregan a las etiquetas semánticas, no las reemplazan. \`<section class="perfil">\` sigue siendo una \`section\` para un lector de pantalla.`,
      codeExample: {
        html: `<p>Desarrolladora Frontend</p>\n<p>Perfil profesional con foco en accesibilidad.</p>`,
        css: `/* Sin clases no hay forma de distinguirlos sin atarse al orden */\np { font-size: 16px; }\n\n/* Con clases, cada uno dice que es */\n.titulo-profesional { font-size: 20px; }\n.perfil { line-height: 1.7; }`,
        js: "",
        editable: false,
      },
      order: 2,
    },
    {
      id: "25-leccion-03",
      title: "El plan de maquetado: de arriba hacia abajo",
      content: `## Un orden que evita retrabajo

Hay un orden que ahorra horas, y casi nadie lo sigue la primera vez.

### 1. Reset primero

Los navegadores traen márgenes por defecto que no pediste. Antes de posicionar nada:

\`\`\`css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
\`\`\`

\`box-sizing: border-box\` hace que \`width\` incluya padding y borde. Sin eso, cada vez que agregues padding el elemento crece y tu layout se corre. **Este es el ajuste mas rentable de todo CSS.**

### 2. Tipografía antes que layout

Antes de decidir donde va cada caja, decidi como se lee. Si cambias el \`font-size\` base después de maquetar, todos los espacios que ajustaste quedan mal.

### 3. Layout de afuera hacia adentro

Primero el contenedor general, después las secciones, al final los detalles. Al reves, cada cambio del contenedor rompe lo de adentro.

### 4. Responsive al final, pero pensado desde el principio

No dejes anchos fijos en px si sabes que vas a hacer responsive. \`max-width\` con \`width: 100%\` se adapta solo.

### La estructura que vamos a lograr

\`\`\`
body
  header.encabezado        -> flexbox: nombre | contacto
  main.contenido           -> max-width y centrado
    section.perfil
    section.experiencia    -> grid de tarjetas
    section.habilidades    -> tabla estilizada
    figure.foto            -> imagen recortada
  footer.pie
\`\`\`

> **Un consejo sobre el ancho de lectura:** un párrafo de 60 a 75 caracteres por línea es lo mas comodo de leer. En pantalla ancha eso es cerca de \`65ch\` o \`700px\`. Un CV a todo el ancho de un monitor de 27 pulgadas es incomodo, aunque "aproveche el espacio".`,
      codeExample: {
        html: `<main class="contenido">\n  <section class="perfil">...</section>\n</main>`,
        css: `* { box-sizing: border-box; }\nbody { margin: 0; }\n\n.contenido {\n  max-width: 700px;\n  width: 100%;\n  margin: 0 auto;\n}`,
        js: "",
        editable: false,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "25-ej-01",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 1,
      prompt:
        "Paso 1 - Las clases. Tomamos el encabezado de tu CV y le agregamos clases que nombren la función de cada parte. Agrega: clase 'encabezado' al <header>, clase 'nombre' al <h1>, clase 'título-profesional' al <p>, y clase 'contacto' al <nav> que envuelve los enlaces. No cambies las etiquetas, solo agrega los atributos class.",
      codeTemplate: {
        html: `<header>\n  <h1>Ana Martinez</h1>\n  <p>Desarrolladora Frontend</p>\n  <nav>\n    <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>\n    <a href="tel:+541100000000">+54 11 0000 0000</a>\n  </nav>\n</header>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      validation: {
        type: "html-structure",
        answer: [
          "header.encabezado",
          "header.encabezado > h1.nombre",
          "header.encabezado > p.titulo-profesional",
          "header.encabezado > nav.contacto",
          "nav.contacto a[href^=\"mailto:\"]",
          "nav.contacto a[href^=\"tel:\"]",
        ],
      },
      hint: "Una clase se agrega con el atributo class: <h1 class=\"nombre\">. Las etiquetas semánticas se conservan tal cual.",
      explanation:
        "Las clases nombran la FUNCIÓN de cada parte, no su apariencia. 'título-profesional' seguira teniendo sentido si mañana lo pintas de otro color; '.texto-gris' no. Y fijate que el <header>, el <h1> y el <nav> siguen ahi: las clases se suman a la semántica, no la reemplazan.",
    },
    {
      id: "25-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "Paso 2 - Reset y tipografía. Escribe el CSS base: al selector universal (*) ponele box-sizing: border-box. Al body, margin: 0, font-family: system-ui, sans-serif, font-size: 16px, line-height: 1.6 y color: #333. Al .nombre, font-size: 32px y margin-bottom: 4px. Al .título-profesional, font-size: 20px, color: #666 y margin-top: 0.",
      codeTemplate: {
        html: `<header class="encabezado">\n  <h1 class="nombre">Ana Martinez</h1>\n  <p class="titulo-profesional">Desarrolladora Frontend</p>\n</header>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "* {\n  box-sizing: border-box;\n}\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n  color: #333;\n}\n.nombre {\n  font-size: 32px;\n  margin-bottom: 4px;\n}\n.titulo-profesional {\n  font-size: 20px;\n  color: #666;\n  margin-top: 0;\n}",
      validation: {
        type: "css-rules",
      },
      hint: "box-sizing: border-box en * hace que width incluya padding y borde. El margin-bottom: 4px del nombre y el margin-top: 0 del título los acercan como un bloque.",
      explanation:
        "Este paso hace mas por la legibilidad que cualquier sombra. line-height: 1.6 da aire entre líneas; el contraste de tamaño entre 32px y 20px crea jerarquía sin necesidad de color. Y border-box en * evita que cada padding que agregues después te corra el layout.",
    },
    {
      id: "25-ej-03",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Paso 3 - El ancho de lectura. Dale a .contenido un max-width de 700px, width: 100%, margin: 0 auto y padding: 0 24px. Al .encabezado ponele padding: 32px 24px, border-bottom: 2px solid #eee y margin-bottom: 32px.",
      codeTemplate: {
        html: `<header class="encabezado">\n  <h1 class="nombre">Ana Martinez</h1>\n</header>\n<main class="contenido">\n  <section class="perfil">\n    <h2>Perfil</h2>\n    <p>Desarrolladora con foco en accesibilidad y performance.</p>\n  </section>\n</main>`,
        cssPrefix: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; }\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".contenido {\n  max-width: 700px;\n  width: 100%;\n  margin: 0 auto;\n  padding: 0 24px;\n}\n.encabezado {\n  padding: 32px 24px;\n  border-bottom: 2px solid #eee;\n  margin-bottom: 32px;\n}",
      validation: {
        type: "css-rules",
      },
      hint: "margin: 0 auto centra un elemento que tiene un ancho máximo. width: 100% lo deja encogerse en pantallas chicas.",
      explanation:
        "max-width con width: 100% es el patrón responsive mas simple que existe: en pantalla ancha se detiene en 700px, en el teléfono ocupa todo. Un ancho fijo en px haria falta arreglarlo después con media queries. El padding lateral evita que el texto toque el borde en mobile.",
    },
    {
      id: "25-ej-04",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 4,
      prompt:
        "Paso 4 - El header con Flexbox. Hace que .encabezado use display: flex, justify-content: space-between, align-items: center, flex-wrap: wrap y gap: 16px. Al .contacto ponele display: flex, flex-direction: column y gap: 4px. A los enlaces del contacto (.contacto a) ponele color: #0066cc y text-decoration: none.",
      codeTemplate: {
        html: `<header class="encabezado">\n  <div>\n    <h1 class="nombre">Ana Martinez</h1>\n    <p class="titulo-profesional">Desarrolladora Frontend</p>\n  </div>\n  <nav class="contacto">\n    <a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>\n    <a href="tel:+541100000000">+54 11 0000 0000</a>\n  </nav>\n</header>`,
        cssPrefix: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; }\n.nombre { font-size: 32px; margin: 0 0 4px; }\n.titulo-profesional { font-size: 20px; color: #666; margin: 0; }\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".encabezado {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.contacto {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.contacto a {\n  color: #0066cc;\n  text-decoration: none;\n}",
      validation: {
        type: "css-rules",
      },
      hint: "space-between empuja el primer hijo a la izquierda y el último a la derecha. flex-wrap: wrap es lo que evita que se desborde en pantallas angostas.",
      explanation:
        "flex-wrap: wrap hace la mitad del trabajo responsive antes de escribir una sola media query: cuando no hay ancho, el contacto baja abajo del nombre solo. Y fijate que el gap reemplaza los márgenes entre hijos, que es mas fácil de mantener que margin-right en todos menos el último.",
    },
    {
      id: "25-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt:
        "En el paso anterior le quitaste el subrayado a los enlaces del contacto con text-decoration: none. ¿Qué problema de accesibilidad introduce eso, y cual es la forma correcta de resolverlo?",
      options: [
        {
          id: "a",
          text: "Ninguno: el color azul ya alcanza para que se note que es un enlace.",
          isCorrect: false,
        },
        {
          id: "b",
          text: "Quien no distingue el azul del texto negro pierde la única señal de que es un enlace. Hay que dar una segunda pista que no dependa del color, y mantener un foco visible para el teclado.",
          isCorrect: true,
        },
        {
          id: "c",
          text: "Ninguno, siempre que el enlace este dentro de un <nav>.",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Se arregla poniendo cursor: pointer.",
          isCorrect: false,
        },
      ],
      validation: {
        type: "exact",
        answer: "b",
      },
      hint: "Pensa en alguien con daltonismo, y en alguien que navega con Tab en vez de mouse.",
      explanation:
        "El color NUNCA debe ser la única forma de transmitir información: es una de las reglas mas citadas de WCAG. Si quitas el subrayado, agrega otra señal (un subrayado en :hover, un borde inferior, un icono) y asegurate de que :focus-visible se vea claramente. cursor: pointer no sirve: solo existe si hay mouse, y quien usa teclado o lector de pantalla nunca lo ve.",
    },
    {
      id: "25-ej-06",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt:
        "Paso 5 - Experiencia con Grid. Hace que .experiencia use display: grid, grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) y gap: 20px. A cada .trabajo ponele padding: 16px, border: 1px solid #e5e5e5, border-radius: 8px y background-color: #fafafa.",
      codeTemplate: {
        html: `<section>\n  <h2>Experiencia</h2>\n  <div class="experiencia">\n    <article class="trabajo">\n      <h3>Frontend Developer</h3>\n      <p>Migre el design system a Tailwind.</p>\n    </article>\n    <article class="trabajo">\n      <h3>Junior Developer</h3>\n      <p>Baje el bundle un 40%.</p>\n    </article>\n  </div>\n</section>`,
        cssPrefix: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; padding: 16px; }\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".experiencia {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 20px;\n}\n.trabajo {\n  padding: 16px;\n  border: 1px solid #e5e5e5;\n  border-radius: 8px;\n  background-color: #fafafa;\n}",
      validation: {
        type: "css-rules",
      },
      hint: "repeat(auto-fit, minmax(260px, 1fr)) crea tantas columnas como quepan, cada una de 260px mínimo. No necesita media queries.",
      explanation:
        "auto-fit con minmax es la técnica responsive mas potente de Grid: el navegador decide cuantas columnas caben y reacomoda solo. Dos tarjetas en escritorio, una apilada en el teléfono, sin escribir ni una media query. Esto es lo que Grid hace mejor que Flexbox.",
    },
    {
      id: "25-ej-07",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 7,
      prompt:
        "Paso 6 - La tabla de habilidades. Dale a .habilidades: width: 100%, border-collapse: collapse y margin-top: 16px. A las celdas de encabezado (.habilidades th): text-align: left, padding: 12px, background-color: #f0f0f0 y border-bottom: 2px solid #ddd. A las celdas de datos (.habilidades td): padding: 12px y border-bottom: 1px solid #eee.",
      codeTemplate: {
        html: `<table class="habilidades">\n  <thead>\n    <tr><th>Habilidad</th><th>Nivel</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>CSS</td><td>Avanzado</td></tr>\n    <tr><td>HTML</td><td>Avanzado</td></tr>\n  </tbody>\n</table>`,
        cssPrefix: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; padding: 16px; }\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".habilidades {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 16px;\n}\n.habilidades th {\n  text-align: left;\n  padding: 12px;\n  background-color: #f0f0f0;\n  border-bottom: 2px solid #ddd;\n}\n.habilidades td {\n  padding: 12px;\n  border-bottom: 1px solid #eee;\n}",
      validation: {
        type: "css-rules",
      },
      hint: "border-collapse: collapse junta los bordes de las celdas en una sola línea. Sin eso queda el doble borde clasico de los 90.",
      explanation:
        "border-collapse: collapse es lo primero que hay que escribir en cualquier tabla: sin el, cada celda dibuja su propio borde y queda ese efecto de planilla vieja. Y text-align: left en th corrige el centrado que el navegador aplica por defecto, que casi nunca es lo que uno quiere en una tabla de datos.",
    },
    {
      id: "25-ej-08",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 8,
      prompt:
        "Paso 7 - La foto. Dale a .foto: margin: 0 y text-align: center. A la imagen (.foto img): width: 140px, height: 140px, object-fit: cover, border-radius: 50% y border: 3px solid #fff. Al pie de foto (.foto figcaption): font-size: 14px, color: #777 y margin-top: 8px.",
      codeTemplate: {
        html: `<figure class="foto">\n  <img src="https://placehold.co/300x200" alt="Retrato de Ana Martinez">\n  <figcaption>Ana Martinez</figcaption>\n</figure>`,
        cssPrefix: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; padding: 16px; background: #eee; }\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".foto {\n  margin: 0;\n  text-align: center;\n}\n.foto img {\n  width: 140px;\n  height: 140px;\n  object-fit: cover;\n  border-radius: 50%;\n  border: 3px solid #fff;\n}\n.foto figcaption {\n  font-size: 14px;\n  color: #777;\n  margin-top: 8px;\n}",
      validation: {
        type: "css-rules",
      },
      hint: "object-fit: cover recorta la imagen para llenar el espacio sin deformarla. Fijate que la imagen del ejemplo es rectangular y el contenedor es cuadrado.",
      explanation:
        "object-fit: cover es la diferencia entre una foto recortada y una foto estirada. Sin el, poner width y height distintos a la proporción original achata las caras. Con el, el navegador recorta lo que sobra y mantiene la proporción. Y border-radius: 50% sobre un cuadrado da un circulo perfecto; sobre un rectangulo, un ovalo.",
    },
    {
      id: "25-ej-09",
      type: "live-editor",
      difficulty: 3,
      xpReward: 30,
      order: 9,
      prompt:
        "Paso 8 - Responsive. Escribe una media query para pantallas de hasta 600px que: al .encabezado le ponga flex-direction: column, align-items: flex-start y text-align: left; al .nombre le baje el font-size a 26px; y al .contenido le deje padding: 0 16px.",
      codeTemplate: {
        html: `<header class="encabezado">\n  <div>\n    <h1 class="nombre">Ana Martinez</h1>\n    <p class="titulo-profesional">Desarrolladora Frontend</p>\n  </div>\n  <nav class="contacto"><a href="mailto:a@b.com">a@b.com</a></nav>\n</header>\n<main class="contenido"><p>Perfil profesional.</p></main>`,
        cssPrefix: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; }\n.encabezado { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 32px 24px; }\n.nombre { font-size: 32px; margin: 0; }\n.contenido { max-width: 700px; margin: 0 auto; padding: 0 24px; }\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "@media (max-width: 600px) {\n  .encabezado {\n    flex-direction: column;\n    align-items: flex-start;\n    text-align: left;\n  }\n  .nombre {\n    font-size: 26px;\n  }\n  .contenido {\n    padding: 0 16px;\n  }\n}",
      validation: {
        type: "css-rules",
      },
      hint: "La media query envuelve las reglas: @media (max-width: 600px) { ... }. Redimensiona la vista previa para verla actuar.",
      explanation:
        "Fijate cuanto NO hiciste falta escribir. El flex-wrap del paso 4 y el auto-fit del paso 6 ya resolvian buena parte del responsive solos. Una media query bien puesta ajusta lo que el layout fluido no puede adivinar -- como bajar el tamaño del nombre -- en vez de rehacer todo el layout. Si tu media query tiene 40 reglas, el problema esta en el layout base.",
    },
    {
      id: "25-ej-10",
      type: "live-editor",
      difficulty: 3,
      xpReward: 40,
      order: 10,
      prompt:
        "Cierre integrador. Estiliza el CV completo desde cero. Necesitas: box-sizing: border-box en *; body con margin: 0, font-family: system-ui, sans-serif y line-height: 1.6; .encabezado con display: flex, justify-content: space-between y flex-wrap: wrap; .nombre con font-size: 32px; .contenido con max-width: 700px y margin: 0 auto; .experiencia con display: grid y gap: 20px; .habilidades con width: 100% y border-collapse: collapse; .foto img con object-fit: cover y border-radius: 50%; y una media query de hasta 600px que ponga .encabezado en flex-direction: column.",
      codeTemplate: {
        html: `<header class="encabezado">\n  <div>\n    <h1 class="nombre">Ana Martinez</h1>\n    <p class="titulo-profesional">Desarrolladora Frontend</p>\n  </div>\n  <nav class="contacto"><a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a></nav>\n</header>\n<main class="contenido">\n  <section><h2>Perfil</h2><p>Desarrolladora con foco en accesibilidad.</p></section>\n  <section>\n    <h2>Experiencia</h2>\n    <div class="experiencia">\n      <article class="trabajo"><h3>Frontend</h3><p>Design system.</p></article>\n      <article class="trabajo"><h3>Junior</h3><p>Performance.</p></article>\n    </div>\n  </section>\n  <section>\n    <h2>Habilidades</h2>\n    <table class="habilidades">\n      <thead><tr><th>Habilidad</th><th>Nivel</th></tr></thead>\n      <tbody><tr><td>CSS</td><td>Avanzado</td></tr></tbody>\n    </table>\n  </section>\n  <figure class="foto">\n    <img src="https://placehold.co/300x200" alt="Retrato de Ana Martinez">\n    <figcaption>Ana Martinez</figcaption>\n  </figure>\n</main>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "* {\n  box-sizing: border-box;\n}\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  line-height: 1.6;\n}\n.encabezado {\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.nombre {\n  font-size: 32px;\n}\n.contenido {\n  max-width: 700px;\n  margin: 0 auto;\n}\n.experiencia {\n  display: grid;\n  gap: 20px;\n}\n.habilidades {\n  width: 100%;\n  border-collapse: collapse;\n}\n.foto img {\n  object-fit: cover;\n  border-radius: 50%;\n}\n@media (max-width: 600px) {\n  .encabezado {\n    flex-direction: column;\n  }\n}",
      validation: {
        type: "css-rules",
      },
      hint: "Segui el orden del modulo: reset, tipografía, contenedor, header, secciones, tabla, foto, y la media query al final.",
      explanation:
        "Terminaste el track de CSS con algo que podes mostrar. Y fijate el orden en que lo escribiste: reset, tipografía, layout de afuera hacia adentro, responsive al final. Ese orden no es estetico -- es el que evita que cada cambio rompa lo anterior. Si arrancas por las sombras, vas a reescribir tres veces.",
    },
  ],
};
