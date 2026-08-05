import type { ModuleData } from "@/types";

export const especificidadModule: ModuleData = {
  slug: "especificidad",
  title: "Especificidad CSS",
  description:
    "Entiende como CSS decide que estilos aplicar cuando hay conflictos. Aprende a calcular la especificidad y a usar la cascada a tu favor.",
  order: 11,
  dojo: "css" as const,
  category: "intermediate",
  icon: "Scale",
  lessons: [
    {
      id: "09-leccion-01",
      title: "Que es la especificidad",
      content: `## Que es la especificidad

La **especificidad** es el mecanismo que usa CSS para decidir **que regla gana** cuando múltiples reglas aplican al mismo elemento con la misma propiedad.

### El problema

\`\`\`css
p { color: blue; }
.intro { color: green; }
#principal p { color: red; }
\`\`\`

Si un párrafo tiene clase "intro" y está dentro de \`#principal\`, ¿qué color tendra? La respuesta es **rojo**, porque \`#principal p\` tiene mayor especificidad.

### La cascada CSS

CSS significa **Cascading** Style Sheets. Cuando hay conflictos, se resuelven en este orden de prioridad (de menor a mayor):

1. **Origen del estilo** (navegador < usuario < autor)
2. **Especificidad** del selector
3. **Orden de aparición** (el último gana, si hay empate)

### Jerarquía de especificidad

De menor a mayor poder:

| Nivel | Selector | Ejemplo |
|-------|----------|---------|
| 0 | Selector universal | \`*\` |
| 1 | Tipo / pseudo-elemento | \`p\`, \`::before\` |
| 2 | Clase / pseudo-clase / atributo | \`.card\`, \`:hover\`, \`[type]\` |
| 3 | ID | \`#header\` |
| 4 | Estilos en línea | \`style="..."\` |
| 5 | !important | Gana a todo |

### Regla de oro

> Cuando dos reglas apuntan al mismo elemento, **gana la más específica**. Si tienen la misma especificidad, **gana la que aparece después** en el código.`,
      codeExample: {
        html: `<div id="contenedor">\n  <p class="texto">Este parrafo tiene ID del padre, clase propia y es un <p>.</p>\n</div>`,
        css: `/* Especificidad baja: selector de tipo */\np {\n  color: blue;\n  font-size: 16px;\n}\n\n/* Especificidad media: selector de clase */\n.texto {\n  color: green;\n  font-weight: bold;\n}\n\n/* Especificidad alta: ID + tipo */\n#contenedor p {\n  color: crimson;\n  /* GANA: ID tiene mas peso que clase */\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "09-leccion-02",
      title: "Calculando la especificidad",
      content: `## Calculando la especificidad

La especificidad se calcula como un **valor de tres partes**: (IDs, Clases, Tipos), que se compara de izquierda a derecha.

### Sistema de calculo

| Componente | Valor | Incluye |
|-----------|-------|---------|
| **A** - IDs | Cada ID suma 1 a la primera posición | \`#header\`, \`#main\` |
| **B** - Clases | Cada clase/pseudo-clase/atributo suma 1 a la segunda posición | \`.card\`, \`:hover\`, \`[type]\` |
| **C** - Tipos | Cada tipo/pseudo-elemento suma 1 a la tercera posición | \`p\`, \`div\`, \`::before\` |

### Ejemplos de calculo

\`\`\`
Selector                    IDs  Clases  Tipos  = Especificidad
p                            0     0       1    = (0,0,1)
.destacado                   0     1       0    = (0,1,0)
p.destacado                  0     1       1    = (0,1,1)
#header                      1     0       0    = (1,0,0)
#header .nav a               1     1       1    = (1,1,1)
#header .nav .link:hover     1     3       0    = (1,3,0)
div#main p.intro::first-line 1     1       3    = (1,1,3)
\`\`\`

### Comparación de especificidad

Se compara **de izquierda a derecha**:

\`\`\`
(1,0,0) > (0,5,0) > (0,0,10)
\`\`\`

Un solo ID **(1,0,0)** gana a cinco clases **(0,5,0)**, y cinco clases ganan a diez selectores de tipo **(0,0,10)**.

### Selectores que NO afectan la especificidad

- El selector universal \`*\` tiene especificidad (0,0,0)
- Los combinadores (\`>\`, \`+\`, \`~\`, espacio) no aportan especificidad
- La pseudo-clase \`:not()\` no cuenta, pero **lo que está dentro sí cuenta**

\`\`\`css
/* :not() no suma, pero .especial si */
p:not(.especial) { }  /* (0,1,1) */
\`\`\`

> **Consejo práctico:** No necesitas memorizar números exactos. Lo importante es la jerarquía: IDs > clases > tipos. Si entiendes esto, puedes predecir que regla ganara.`,
      codeExample: {
        html: `<div id="pagina">\n  <p class="texto importante">Que especificidad gana?</p>\n</div>`,
        css: `/* (0,0,1) - Un tipo */\np {\n  color: blue;\n  border: 2px solid blue;\n  padding: 10px;\n}\n\n/* (0,1,1) - Una clase + un tipo */\np.texto {\n  color: green;\n  border-color: green;\n}\n\n/* (0,2,1) - Dos clases + un tipo */\np.texto.importante {\n  color: orange;\n  border-color: orange;\n}\n\n/* (1,0,1) - Un ID + un tipo = GANA */\n#pagina p {\n  color: crimson;\n  border-color: crimson;\n  font-weight: bold;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "09-leccion-03",
      title: "!important y estilos en línea",
      content: `## !important y estilos en línea

### Estilos en línea (style="...")

Los estilos escritos directamente en el atributo \`style\` del HTML tienen una especificidad **mayor que cualquier selector**:

\`\`\`html
<p style="color: red;" class="azul" id="parrafo">
  Este texto sera ROJO, sin importar los selectores CSS.
</p>
\`\`\`

\`\`\`css
#parrafo { color: blue; }   /* Pierde contra style="" */
.azul { color: blue; }      /* Pierde contra style="" */
\`\`\`

### La declaración !important

\`!important\` se añade a una declaración para darle la **máxima prioridad**:

\`\`\`css
.texto {
  color: blue !important; /* Gana a todo, incluso a style="" */
}
\`\`\`

### Jerarquía completa (de menor a mayor)

1. Selectores de tipo \`p { }\`
2. Selectores de clase \`.card { }\`
3. Selectores de ID \`#main { }\`
4. Estilos en línea \`style=""\`
5. \`!important\` en cualquier selector
6. \`!important\` en estilos en línea (máxima prioridad)

### Cuando dos !important chocan

Si ambas reglas tienen \`!important\`, se vuelve a aplicar la **especificidad normal** para desempatar:

\`\`\`css
.texto { color: blue !important; }    /* (0,1,0) + !important */
#main p { color: red !important; }    /* (1,0,1) + !important - GANA */
\`\`\`

### Por que evitar !important

- Rompe el flujo natural de la cascada
- Hace el código **difícil de mantener** y depurar
- Crea una "guerra de !important" donde necesitas más !important para sobreescribir
- Se considera una **mala práctica** en la mayoria de casos

### Usos legitimos de !important

- Sobreescribir estilos de **librerias externas** que no puedes modificar
- Clases de **utilidad** que siempre deben ganar: \`.hidden { display: none !important; }\`
- **Accesibilidad**: forzar tamaños de fuente mínimos

> **Regla de oro:** Si necesitas usar \`!important\`, probablemente hay un problema de arquitectura CSS. Intenta primero aumentar la especificidad del selector.`,
      codeExample: {
        html: `<p id="demo" class="azul" style="color: orange;">Texto con estilo en linea (orange)</p>\n<p id="demo2" class="forzado">Texto con !important</p>`,
        css: `/* El estilo en linea (orange) gana a estos selectores */\n#demo { color: blue; }\n.azul { color: green; }\np { color: purple; }\n\n/* !important gana incluso a estilos en linea */\n.forzado {\n  color: crimson !important;\n  font-weight: bold;\n  font-size: 18px;\n}\n\n/* Este ID pierde contra !important de la clase */\n#demo2 {\n  color: navy;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "09-leccion-05",
      title: ":is() y :where(): agrupar selectores",
      content: `## :is() y :where(): agrupar selectores

Ya sabés calcular especificidad. Ahora vamos a las dos herramientas que te dejan **controlarla**, en lugar de solo padecerla.

### El problema: repetir el mismo prefijo

Mirá esto:

\`\`\`css
.articulo h1,
.articulo h2,
.articulo h3 {
  margin-top: 1.5em;
}
\`\`\`

Funciona, pero \`.articulo\` está escrito tres veces. Con cuatro niveles de anidamiento y cinco etiquetas, esto se vuelve inmanejable.

### :is() agrupa

\`\`\`css
.articulo :is(h1, h2, h3) {
  margin-top: 1.5em;
}
\`\`\`

Una sola regla, el prefijo escrito una vez. Se lee: "cualquier h1, h2 o h3 que esté dentro de .articulo".

### La parte que sorprende: cuánto pesa :is()

Acá es donde importa haber entendido la especificidad, porque \`:is()\` **no es neutral**:

> \`:is()\` toma la especificidad de su argumento **más específico**.

\`\`\`css
:is(#titulo, p) { color: red; }
\`\`\`

Ese selector pesa **como un ID** (1-0-0), incluso cuando termina aplicándose a un \`<p>\`. El \`#titulo\` de adentro le contagia su peso a todo el grupo.

Y eso puede arruinarte el día: metés un ID en la lista por comodidad y de golpe esa regla le gana a todas tus clases.

### :where() pesa cero. Siempre.

\`:where()\` se escribe **exactamente igual** y agrupa **exactamente igual**. La única diferencia es el peso:

> \`:where()\` **siempre** tiene especificidad cero, sin importar lo que lleve adentro.

\`\`\`css
:where(#titulo, p) { color: red; }
\`\`\`

Ese selector pesa **0-0-0**. Cualquier regla posterior con una simple clase le gana.

### Cuándo usar cada uno

| | \`:is()\` | \`:where()\` |
|---|---|---|
| Agrupa selectores | sí | sí |
| Especificidad | la del más específico | siempre cero |
| Sirve para | acortar selectores propios | escribir estilos fáciles de sobrescribir |

### Para qué sirve de verdad \`:where()\`

Pensá que escribís los estilos base de un sitio y otra persona va a construir componentes encima. Si escribís:

\`\`\`css
.contenido h2 { color: navy; }  /* 0-1-1 */
\`\`\`

...quien venga después con \`.titulo-destacado { color: crimson; }\` (0-1-0) **no va a poder** sobrescribirlo, porque pesa menos. Va a terminar recurriendo a \`!important\`, y ya viste a dónde lleva eso.

Pero si escribís:

\`\`\`css
:where(.contenido) h2 { color: navy; }  /* 0-0-1 */
\`\`\`

...ahora una clase cualquiera le gana sin pelear. Le estás diciendo al que venga después: "esto es un valor por defecto, pisalo cuando quieras".

> **La regla para llevarse:** usá \`:is()\` para escribir menos, y \`:where()\` cuando quieras que tu estilo sea **fácil de sobrescribir a propósito**.`,
      codeExample: {
        html: `<div class="contenido">\n  <h2>Titulo por defecto (navy)</h2>\n  <h2 class="destacado">Titulo destacado (crimson)</h2>\n</div>\n<div class="articulo">\n  <h3>Agrupado con :is()</h3>\n  <p>Parrafo del articulo</p>\n</div>`,
        css: `/* :where() pesa 0-0-1, asi que una clase suelta le gana */\n:where(.contenido) h2 {\n  color: navy;\n}\n\n/* 0-1-0 le gana al 0-0-1 de arriba, sin !important */\n.destacado {\n  color: crimson;\n}\n\n/* :is() agrupa y el prefijo se escribe una sola vez */\n.articulo :is(h3, p) {\n  margin-top: 12px;\n  padding-left: 8px;\n  border-left: 3px solid steelblue;\n}`,
        editable: true,
      },
      // Lesson IDs keep their original numbering because they are live URLs;
      // `order` is what the page sorts by, and good practices must close the
      // module, after the tools it recommends.
      order: 4,
    },
    {
      id: "09-leccion-06",
      title: "@layer: ordenar la cascada",
      content: `## @layer: ordenar la cascada

Hasta acá, cuando dos reglas chocan, gana la más específica. Y si empatan, gana la que está **más abajo** en la hoja.

Eso funciona mientras controles todo tu CSS. El problema aparece cuando no.

### El problema real

Usás una librería de estilos y querés cambiarle un botón. La librería escribió:

\`\`\`css
.boton.boton-primario { background: blue; }  /* 0-2-0 */
\`\`\`

Vos escribís:

\`\`\`css
.mi-boton { background: green; }  /* 0-1-0 */
\`\`\`

Perdés. Y tus opciones eran las tres de siempre: subir la especificidad imitando la de ellos, duplicar clases, o \`!important\`. Todas son parches, y todas escalan mal.

### La solución: declarar el orden vos

\`@layer\` te deja crear **bandas de precedencia explícitas**:

\`\`\`css
/* Primero declaras el orden. Esta linea es la que decide. */
@layer reset, libreria, componentes, utilidades;

@layer libreria {
  .boton.boton-primario { background: blue; }  /* 0-2-0 */
}

@layer componentes {
  .mi-boton { background: green; }  /* 0-1-0 */
}
\`\`\`

Ahora gana **verde**. Y esto es lo importante:

> El orden de las capas **le gana a la especificidad**. Una capa declarada después vence a una anterior, aunque sus selectores pesen menos.

Leelo de nuevo, porque invierte lo que venías aprendiendo. Dentro de una misma capa, la especificidad sigue decidiendo. Entre capas distintas, no: decide el orden que declaraste.

### Cómo se escribe

\`\`\`css
/* 1. Declara el orden una sola vez, arriba de todo */
@layer reset, base, componentes, utilidades;

/* 2. Despues llena cada capa, en cualquier orden */
@layer base {
  h1 { font-size: 2rem; }
}

@layer componentes {
  .tarjeta { padding: 16px; }
}
\`\`\`

El orden de esa primera línea es el que manda. No importa en qué orden llenes las capas después: podés escribir \`componentes\` antes que \`base\` en el archivo y el resultado no cambia.

### La trampa que hay que saber

> El CSS que **no** está en ninguna capa le gana a **todas** las capas.

\`\`\`css
@layer componentes {
  .titulo { color: blue; }
}

/* Esto no esta en ninguna capa: gana, aunque este arriba */
.titulo { color: red; }
\`\`\`

Es intencional: te permite meter capas en un proyecto existente sin que tu CSS de siempre pierda de golpe. Pero si te olvidás, parece magia negra. La regla práctica es simple: **si usás capas, poné todo en capas.**

### Cómo se relaciona con lo anterior

Estas son las tres herramientas que ahora tenés para el mismo problema, de la más fina a la más brusca:

| Herramienta | Qué hace |
|---|---|
| \`:where()\` | baja el peso de tu selector a cero |
| \`@layer\` | decide quién gana sin tocar los selectores |
| \`!important\` | rompe la cascada a martillazos |

> **Consejo:** con \`@layer\` y \`:where()\` disponibles, \`!important\` deja de tener excusas en código propio. Si lo estás escribiendo, casi siempre es que falta ordenar la cascada.`,
      codeExample: {
        html: `<button class="boton boton-primario mi-boton">Mira mi color</button>\n<p class="nota">La capa componentes se declaro despues que libreria, asi que gana con menos especificidad.</p>`,
        css: `/* Esta linea decide quien gana */\n@layer libreria, componentes;\n\n@layer libreria {\n  /* 0-2-0: mas especifico, pero en una capa anterior */\n  .boton.boton-primario {\n    background-color: steelblue;\n    color: white;\n  }\n}\n\n@layer componentes {\n  /* 0-1-0: menos especifico y gana igual */\n  .mi-boton {\n    background-color: seagreen;\n  }\n}\n\n.boton {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\n.nota {\n  font-size: 13px;\n  color: #666;\n}`,
        editable: true,
      },
      order: 5,
    },
    {
      id: "09-leccion-04",
      title: "Buenas prácticas de especificidad",
      content: `## Buenas prácticas de especificidad

### Mantener la especificidad baja

Los mejores proyectos CSS mantienen la especificidad lo más **baja y uniforme** posible:

\`\`\`css
/* BIEN: especificidad baja y predecible */
.card { }
.card-title { }
.card-body { }

/* MAL: especificidad alta e inconsistente */
div#contenedor .sidebar ul li.activo a { }
\`\`\`

### Orden recomendado en la hoja de estilos

Organiza tu CSS de menor a mayor especificidad:

1. **Reset / Normalize** - Selectores de tipo
2. **Estilos base** - Tipos (body, h1-h6, p, a)
3. **Componentes** - Clases (.card, .btn, .nav)
4. **Utilidades** - Clases de utilidad (.hidden, .text-center)

### Evitar IDs para estilos

\`\`\`css
/* EVITAR: ID tiene especificidad muy alta */
#header { background: navy; }

/* PREFERIR: clase con misma funcionalidad */
.header { background: navy; }
\`\`\`

### Regla de tres niveles

Intenta que tus selectores no superen **tres niveles de anidamiento**:

\`\`\`css
/* BIEN: maximo 3 niveles */
.nav .nav-item .link { }

/* MAL: demasiado especifico y fragil */
header nav ul li a.link { }
\`\`\`

### Resolviendo conflictos sin !important

En lugar de usar \`!important\`, tenés estas salidas, de la más limpia a la más sucia:

1. **Declarar capas** con \`@layer\` y poner tu CSS en una capa posterior. Resuelve el conflicto sin tocar ni un selector.
2. **Bajar el peso del estilo base** con \`:where()\`, para que una clase cualquiera pueda sobrescribirlo.
3. **Reordenar** las reglas (la última gana si hay empate).
4. **Añadir una clase** más específica.
5. **Duplicar la clase** para aumentar especificidad: \`.btn.btn { }\`. Funciona, pero es un truco: el dia que alguien lo lea no va a entender por que está escrito dos veces.

Las dos primeras son las que aprendiste en las lecciones anteriores, y son las únicas que no dejan deuda. Las últimas tres son lo que se hacia cuando \`@layer\` y \`:where()\` no existian.

> **Consejo final:** Piensa en la especificidad como una herramienta, no como un obstaculo. Y si te encontras escribiendo \`!important\` en tu propio código, el problema casi nunca es la especificidad: es que falta ordenar la cascada.`,
      codeExample: {
        html: `<nav class="nav">\n  <a href="#" class="nav-link activo">Inicio</a>\n  <a href="#" class="nav-link">Blog</a>\n  <a href="#" class="nav-link">Contacto</a>\n</nav>`,
        css: `/* Nivel 1: estilos base del componente */\n.nav {\n  display: flex;\n  gap: 4px;\n  background: #f5f5f5;\n  padding: 8px;\n  border-radius: 8px;\n}\n\n/* Nivel 2: elementos del componente */\n.nav-link {\n  padding: 8px 16px;\n  text-decoration: none;\n  color: #555;\n  border-radius: 4px;\n}\n\n/* Nivel 3: estados */\n.nav-link:hover {\n  background: #e0e0e0;\n  color: #333;\n}\n\n.nav-link.activo {\n  background: steelblue;\n  color: white;\n}`,
        editable: true,
      },
      order: 6,
    },
  ],
  exercises: [
    {
      id: "09-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "¿Qué tipo de selector tiene MAYOR especificidad?",
      options: [
        { id: "a", text: "Selector de tipo (p, div)", isCorrect: false },
        { id: "b", text: "Selector de clase (.card)", isCorrect: false },
        { id: "c", text: "Selector de ID (#header)", isCorrect: true },
        { id: "d", text: "Selector universal (*)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "De los selectores normales (sin contar estilos en línea o !important), hay uno que usa el simbolo # y tiene el mayor peso.",
      explanation:
        "De los selectores CSS normales, el selector de ID (#) tiene la mayor especificidad. La jerarquía es: universal (*) < tipo (p) < clase (.card) < ID (#header). Solo los estilos en línea y !important superan a los IDs.",
    },
    {
      id: "09-ej-02",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt:
        "Ordena los selectores arrastrando cada uno a su nivel de especificidad correspondiente (de menor a mayor):",
      dragItems: [
        { id: "drag-1", content: "* (universal)", correctZone: "zone-nula" },
        { id: "drag-2", content: "p (tipo)", correctZone: "zone-baja" },
        { id: "drag-3", content: ".card (clase)", correctZone: "zone-media" },
        { id: "drag-4", content: "#main (ID)", correctZone: "zone-alta" },
      ],
      dropZones: [
        { id: "zone-nula", label: "Especificidad nula (0,0,0)" },
        { id: "zone-baja", label: "Especificidad baja (0,0,1)" },
        { id: "zone-media", label: "Especificidad media (0,1,0)" },
        { id: "zone-alta", label: "Especificidad alta (1,0,0)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-nula",
          "drag-2": "zone-baja",
          "drag-3": "zone-media",
          "drag-4": "zone-alta",
        },
      },
      hint: "El selector universal tiene especificidad 0. Luego tipos, clases y finalmente IDs tienen valores crecientes.",
      explanation:
        "La especificidad se calcula como (IDs, Clases, Tipos): * = (0,0,0), p = (0,0,1), .card = (0,1,0), #main = (1,0,0). Un ID siempre supera a cualquier cantidad de clases, y una clase siempre supera a cualquier cantidad de tipos.",
    },
    {
      id: "09-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "¿Cuál es la especificidad del selector #header .nav a?",
      options: [
        { id: "a", text: "(0,1,1)", isCorrect: false },
        { id: "b", text: "(1,1,1)", isCorrect: true },
        { id: "c", text: "(1,0,2)", isCorrect: false },
        { id: "d", text: "(1,2,0)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Cuenta: cuantos IDs tiene (#header), cuantas clases (.nav), cuantos tipos (a). Forma un número con cada conteo.",
      explanation:
        "El selector '#header .nav a' tiene: 1 ID (#header) + 1 clase (.nav) + 1 tipo (a) = especificidad (1,1,1). Recuerda: IDs suman en la primera posición, clases en la segunda y tipos en la tercera.",
    },
    {
      id: "09-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "El texto deberia ser rojo, pero la clase .azul lo esta sobreescribiendo. Completa la declaración para forzar que sea rojo sin cambiar el selector:",
      codeTemplate: {
        html: `<p class="azul rojo">Debe ser rojo</p>`,
        cssPrefix: `.azul { color: blue; }\n.rojo { color: red`,
        cssSuffix: `; }`,
        blanks: [" !important"],
      },
      validation: { type: "exact", answer: " !important" },
      hint: "Hay una palabra clave especial que se añade después del valor y antes del punto y coma para forzar la prioridad.",
      explanation:
        "La declaración '!important' fuerza la prioridad de una regla sobre todas las demas (excepto otro !important con mayor especificidad). Se escribe después del valor: 'color: red !important;'. Sin embargo, su uso debe ser excepcional.",
    },
    {
      id: "09-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "¿Qué selector gana? A: .card .título { color: blue; } vs B: #principal p { color: red; }. El párrafo tiene clase 'título', está dentro de .card y de #principal.",
      options: [
        { id: "a", text: "A gana porque tiene dos clases", isCorrect: false },
        { id: "b", text: "B gana porque tiene un ID", isCorrect: true },
        { id: "c", text: "Empatan y gana el último", isCorrect: false },
        { id: "d", text: "Depende del orden en el HTML", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Recuerda: un solo ID tiene más peso que cualquier cantidad de clases.",
      explanation:
        "El selector B '#principal p' tiene especificidad (1,0,1) y A '.card .título' tiene (0,2,0). Aunque A tiene dos clases, un solo ID (1,0,0) supera a cualquier número de clases (0,n,0). El ID siempre gana.",
    },
    {
      id: "09-ej-06",
      type: "live-editor",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt:
        "El párrafo deberia ser de color steelblue, pero la regla existente lo pone rojo. Escribe un selector con suficiente especificidad para que sea steelblue SIN usar !important. Pista: usa el ID del contenedor.",
      codeTemplate: {
        html: `<div id="contenedor">\n  <p class="texto">Este texto debe ser steelblue.</p>\n</div>`,
        cssPrefix: ".texto { color: red; }\n\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "#contenedor .texto {\n  color: steelblue;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Para superar la especificidad de .texto (0,1,0), necesitas un selector con al menos un ID. Usa #contenedor combinado con .texto.",
      explanation:
        "El selector '#contenedor .texto' tiene especificidad (1,1,0), que supera a '.texto' con (0,1,0). Al combinar el ID del padre con la clase, obtenemos suficiente especificidad para ganar sin recurrir a !important.",
    },
    {
      id: "09-ej-07",
      type: "drag-drop",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Arrastra cada selector a su especificidad calculada:",
      dragItems: [
        { id: "drag-1", content: "p.intro", correctZone: "zone-011" },
        { id: "drag-2", content: "#main .card h2", correctZone: "zone-112" },
        { id: "drag-3", content: "div ul li a", correctZone: "zone-004" },
        { id: "drag-4", content: ".nav .link:hover", correctZone: "zone-030" },
      ],
      dropZones: [
        { id: "zone-011", label: "(0,1,1)" },
        { id: "zone-112", label: "(1,1,2)" },
        { id: "zone-004", label: "(0,0,4)" },
        { id: "zone-030", label: "(0,3,0)" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-011",
          "drag-2": "zone-112",
          "drag-3": "zone-004",
          "drag-4": "zone-030",
        },
      },
      hint: "Cuenta por separado: IDs (#), clases (. y :pseudo-clases), tipos (elementos HTML y ::pseudo-elementos). Forma la tupla (IDs, Clases, Tipos).",
      explanation:
        "p.intro = 0 IDs, 1 clase, 1 tipo = (0,1,1). #main .card h2 = 1 ID, 1 clase, 2 tipos = (1,1,2). div ul li a = 0 IDs, 0 clases, 4 tipos = (0,0,4). .nav .link:hover = 0 IDs, 3 clases (incluyendo :hover como pseudo-clase), 0 tipos = (0,3,0).",
    },
    {
      id: "09-ej-08",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Hay tres reglas en conflicto. El resultado objetivo muestra el texto en color crimson con font-size 20px. Escribe un selector con especificidad suficiente para ganar a los dos selectores existentes y aplica esos estilos.",
      codeTemplate: {
        html: `<section id="seccion">\n  <article class="articulo">\n    <p class="texto">Este parrafo debe ser crimson y 20px.</p>\n  </article>\n</section>`,
        cssPrefix: "p { color: blue; font-size: 14px; }\n.articulo .texto { color: green; font-size: 16px; }\n\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "#seccion .articulo .texto {\n  color: crimson;\n  font-size: 20px;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "La regla más fuerte actual tiene especificidad (0,2,0). Para ganarle, usa el ID #sección combinado con las clases existentes.",
      explanation:
        "Las reglas existentes tienen especificidad (0,0,1) y (0,2,0). El selector '#sección .articulo .texto' tiene (1,2,0), que supera a ambas. Al incluir el ID del ancestro, ganamos sin necesidad de !important.",
    },
    {
      id: "09-ej-09",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 9,
      prompt: "¿Cuánto pesa el selector :is(#título, p) ?",
      options: [
        { id: "a", text: "0-0-1, porque termina aplicandose a un p", isCorrect: false },
        { id: "b", text: "1-0-0, porque toma la especificidad de su argumento más específico", isCorrect: true },
        { id: "c", text: "0-0-0, igual que :where()", isCorrect: false },
        { id: "d", text: "1-0-1, porque suma el ID y la etiqueta", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una de las dos funciones pesa cero siempre, y la otra no. Esta es la que NO pesa cero.",
      explanation:
        ":is() adopta la especificidad de su argumento más específico, así que el #título le contagia su peso a todo el grupo: 1-0-0. Esa es justamente la diferencia con :where(), que pesa 0-0-0 sin importar lo que lleve adentro. Meter un ID dentro de un :is() por comodidad puede hacer que esa regla le gane a todas tus clases.",
    },
    {
      id: "09-ej-10",
      type: "quiz",
      difficulty: 3,
      xpReward: 20,
      order: 10,
      prompt:
        "Declaras @layer libreria, componentes; La capa libreria tiene .botón.botón-primario (0-2-0) y la capa componentes tiene .mi-botón (0-1-0). Ambas definen background. ¿Cuál gana?",
      options: [
        { id: "a", text: "La de libreria, porque su selector es más específico", isCorrect: false },
        { id: "b", text: "La de componentes, porque su capa se declaro después", isCorrect: true },
        { id: "c", text: "Ninguna, hay que usar !important para desempatar", isCorrect: false },
        { id: "d", text: "Depende de cual se escriba más abajo en el archivo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Entre capas distintas, la especificidad deja de decidir. Lo que decide es el orden que declaraste.",
      explanation:
        "El orden de las capas le gana a la especificidad: componentes se declaro después de libreria, así que gana con 0-1-0 contra 0-2-0. Dentro de una misma capa la especificidad sigue mandando, pero entre capas manda el orden. Y ojo: el CSS que no está en ninguna capa le gana a todas.",
    },
    {
      id: "09-ej-11",
      type: "live-editor",
      difficulty: 3,
      xpReward: 25,
      order: 11,
      prompt:
        "El estilo base pinta el título de navy con especificidad 0-1-1, así que una clase suelta no puede ganarle. Reescribilo para que sea fácil de sobrescribir: usa :where(.contenido) h2 con color: navy, y después una regla .destacado con color: crimson.",
      codeTemplate: {
        html: `<div class="contenido">\n  <h2>Titulo normal</h2>\n  <h2 class="destacado">Titulo destacado</h2>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ":where(.contenido) h2 {\n  color: navy;\n}\n.destacado {\n  color: crimson;\n}",
      validation: {
        // Graded by parsing `targetCSS` into selector -> declarations, not by
        // searching the submission for loose words. See src/lib/cssRules.ts.
        type: "css-rules",
      },
      hint: "Envolve el .contenido dentro de :where() para que deje de aportar peso. El h2 queda afuera del paréntesis.",
      explanation:
        "Con :where(.contenido) h2 el selector pasa de 0-1-1 a 0-0-1, porque :where() no aporta especificidad. Ahora .destacado, que pesa 0-1-0, le gana sin necesidad de !important. Es la forma de decir 'esto es un valor por defecto, pisalo cuando quieras'.",
    },
  ],
};
