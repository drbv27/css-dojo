import type { ModuleData } from "@/types";

export const especificidadModule: ModuleData = {
  slug: "especificidad",
  title: "Especificidad CSS",
  description:
    "Entiende como CSS decide que estilos aplicar cuando hay conflictos. Aprende a calcular la especificidad y a usar la cascada a tu favor.",
  order: 9,
  dojo: "css" as const,
  category: "intermediate",
  icon: "Scale",
  lessons: [
    {
      id: "09-leccion-01",
      title: "Que es la especificidad",
      content: `## Que es la especificidad

La **especificidad** es el mecanismo que usa CSS para decidir **que regla gana** cuando multiples reglas aplican al mismo elemento con la misma propiedad.

### El problema

\`\`\`css
p { color: blue; }
.intro { color: green; }
#principal p { color: red; }
\`\`\`

Si un parrafo tiene clase "intro" y esta dentro de \`#principal\`, que color tendra? La respuesta es **rojo**, porque \`#principal p\` tiene mayor especificidad.

### La cascada CSS

CSS significa **Cascading** Style Sheets. Cuando hay conflictos, se resuelven en este orden de prioridad (de menor a mayor):

1. **Origen del estilo** (navegador < usuario < autor)
2. **Especificidad** del selector
3. **Orden de aparicion** (el ultimo gana, si hay empate)

### Jerarquia de especificidad

De menor a mayor poder:

| Nivel | Selector | Ejemplo |
|-------|----------|---------|
| 0 | Selector universal | \`*\` |
| 1 | Tipo / pseudo-elemento | \`p\`, \`::before\` |
| 2 | Clase / pseudo-clase / atributo | \`.card\`, \`:hover\`, \`[type]\` |
| 3 | ID | \`#header\` |
| 4 | Estilos en linea | \`style="..."\` |
| 5 | !important | Gana a todo |

### Regla de oro

> Cuando dos reglas apuntan al mismo elemento, **gana la mas especifica**. Si tienen la misma especificidad, **gana la que aparece despues** en el codigo.`,
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
| **A** - IDs | Cada ID suma 1 a la primera posicion | \`#header\`, \`#main\` |
| **B** - Clases | Cada clase/pseudo-clase/atributo suma 1 a la segunda posicion | \`.card\`, \`:hover\`, \`[type]\` |
| **C** - Tipos | Cada tipo/pseudo-elemento suma 1 a la tercera posicion | \`p\`, \`div\`, \`::before\` |

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

### Comparacion de especificidad

Se compara **de izquierda a derecha**:

\`\`\`
(1,0,0) > (0,5,0) > (0,0,10)
\`\`\`

Un solo ID **(1,0,0)** gana a cinco clases **(0,5,0)**, y cinco clases ganan a diez selectores de tipo **(0,0,10)**.

### Selectores que NO afectan la especificidad

- El selector universal \`*\` tiene especificidad (0,0,0)
- Los combinadores (\`>\`, \`+\`, \`~\`, espacio) no aportan especificidad
- La pseudo-clase \`:not()\` no cuenta, pero **lo que esta dentro si cuenta**

\`\`\`css
/* :not() no suma, pero .especial si */
p:not(.especial) { }  /* (0,1,1) */
\`\`\`

> **Consejo practico:** No necesitas memorizar numeros exactos. Lo importante es la jerarquia: IDs > clases > tipos. Si entiendes esto, puedes predecir que regla ganara.`,
      codeExample: {
        html: `<div id="pagina">\n  <p class="texto importante">Que especificidad gana?</p>\n</div>`,
        css: `/* (0,0,1) - Un tipo */\np {\n  color: blue;\n  border: 2px solid blue;\n  padding: 10px;\n}\n\n/* (0,1,1) - Una clase + un tipo */\np.texto {\n  color: green;\n  border-color: green;\n}\n\n/* (0,2,1) - Dos clases + un tipo */\np.texto.importante {\n  color: orange;\n  border-color: orange;\n}\n\n/* (1,0,1) - Un ID + un tipo = GANA */\n#pagina p {\n  color: crimson;\n  border-color: crimson;\n  font-weight: bold;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "09-leccion-03",
      title: "!important y estilos en linea",
      content: `## !important y estilos en linea

### Estilos en linea (style="...")

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

### La declaracion !important

\`!important\` se anade a una declaracion para darle la **maxima prioridad**:

\`\`\`css
.texto {
  color: blue !important; /* Gana a todo, incluso a style="" */
}
\`\`\`

### Jerarquia completa (de menor a mayor)

1. Selectores de tipo \`p { }\`
2. Selectores de clase \`.card { }\`
3. Selectores de ID \`#main { }\`
4. Estilos en linea \`style=""\`
5. \`!important\` en cualquier selector
6. \`!important\` en estilos en linea (maxima prioridad)

### Cuando dos !important chocan

Si ambas reglas tienen \`!important\`, se vuelve a aplicar la **especificidad normal** para desempatar:

\`\`\`css
.texto { color: blue !important; }    /* (0,1,0) + !important */
#main p { color: red !important; }    /* (1,0,1) + !important - GANA */
\`\`\`

### Por que evitar !important

- Rompe el flujo natural de la cascada
- Hace el codigo **dificil de mantener** y depurar
- Crea una "guerra de !important" donde necesitas mas !important para sobreescribir
- Se considera una **mala practica** en la mayoria de casos

### Usos legitimos de !important

- Sobreescribir estilos de **librerias externas** que no puedes modificar
- Clases de **utilidad** que siempre deben ganar: \`.hidden { display: none !important; }\`
- **Accesibilidad**: forzar tamanos de fuente minimos

> **Regla de oro:** Si necesitas usar \`!important\`, probablemente hay un problema de arquitectura CSS. Intenta primero aumentar la especificidad del selector.`,
      codeExample: {
        html: `<p id="demo" class="azul" style="color: orange;">Texto con estilo en linea (orange)</p>\n<p id="demo2" class="forzado">Texto con !important</p>`,
        css: `/* El estilo en linea (orange) gana a estos selectores */\n#demo { color: blue; }\n.azul { color: green; }\np { color: purple; }\n\n/* !important gana incluso a estilos en linea */\n.forzado {\n  color: crimson !important;\n  font-weight: bold;\n  font-size: 18px;\n}\n\n/* Este ID pierde contra !important de la clase */\n#demo2 {\n  color: navy;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "09-leccion-04",
      title: "Buenas practicas de especificidad",
      content: `## Buenas practicas de especificidad

### Mantener la especificidad baja

Los mejores proyectos CSS mantienen la especificidad lo mas **baja y uniforme** posible:

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

En lugar de usar \`!important\`, puedes:

1. **Reordenar** las reglas (la ultima gana si hay empate)
2. **Anadir una clase** mas especifica
3. **Duplicar la clase** para aumentar especificidad: \`.btn.btn { }\`

> **Consejo final:** Piensa en la especificidad como una herramienta, no como un obstaculo. Un CSS bien organizado rara vez tiene problemas de especificidad.`,
      codeExample: {
        html: `<nav class="nav">\n  <a href="#" class="nav-link activo">Inicio</a>\n  <a href="#" class="nav-link">Blog</a>\n  <a href="#" class="nav-link">Contacto</a>\n</nav>`,
        css: `/* Nivel 1: estilos base del componente */\n.nav {\n  display: flex;\n  gap: 4px;\n  background: #f5f5f5;\n  padding: 8px;\n  border-radius: 8px;\n}\n\n/* Nivel 2: elementos del componente */\n.nav-link {\n  padding: 8px 16px;\n  text-decoration: none;\n  color: #555;\n  border-radius: 4px;\n}\n\n/* Nivel 3: estados */\n.nav-link:hover {\n  background: #e0e0e0;\n  color: #333;\n}\n\n.nav-link.activo {\n  background: steelblue;\n  color: white;\n}`,
        editable: true,
      },
      order: 4,
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
        "Que tipo de selector tiene MAYOR especificidad?",
      options: [
        { id: "a", text: "Selector de tipo (p, div)", isCorrect: false },
        { id: "b", text: "Selector de clase (.card)", isCorrect: false },
        { id: "c", text: "Selector de ID (#header)", isCorrect: true },
        { id: "d", text: "Selector universal (*)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "De los selectores normales (sin contar estilos en linea o !important), hay uno que usa el simbolo # y tiene el mayor peso.",
      explanation:
        "De los selectores CSS normales, el selector de ID (#) tiene la mayor especificidad. La jerarquia es: universal (*) < tipo (p) < clase (.card) < ID (#header). Solo los estilos en linea y !important superan a los IDs.",
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
        "Cual es la especificidad del selector #header .nav a?",
      options: [
        { id: "a", text: "(0,1,1)", isCorrect: false },
        { id: "b", text: "(1,1,1)", isCorrect: true },
        { id: "c", text: "(1,0,2)", isCorrect: false },
        { id: "d", text: "(1,2,0)", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Cuenta: cuantos IDs tiene (#header), cuantas clases (.nav), cuantos tipos (a). Forma un numero con cada conteo.",
      explanation:
        "El selector '#header .nav a' tiene: 1 ID (#header) + 1 clase (.nav) + 1 tipo (a) = especificidad (1,1,1). Recuerda: IDs suman en la primera posicion, clases en la segunda y tipos en la tercera.",
    },
    {
      id: "09-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "El texto deberia ser rojo, pero la clase .azul lo esta sobreescribiendo. Completa la declaracion para forzar que sea rojo sin cambiar el selector:",
      codeTemplate: {
        html: `<p class="azul rojo">Debe ser rojo</p>`,
        cssPrefix: `.azul { color: blue; }\n.rojo { color: red`,
        cssSuffix: `; }`,
        blanks: [" !important"],
      },
      validation: { type: "exact", answer: " !important" },
      hint: "Hay una palabra clave especial que se anade despues del valor y antes del punto y coma para forzar la prioridad.",
      explanation:
        "La declaracion '!important' fuerza la prioridad de una regla sobre todas las demas (excepto otro !important con mayor especificidad). Se escribe despues del valor: 'color: red !important;'. Sin embargo, su uso debe ser excepcional.",
    },
    {
      id: "09-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Que selector gana? A: .card .titulo { color: blue; } vs B: #principal p { color: red; }. El parrafo tiene clase 'titulo', esta dentro de .card y de #principal.",
      options: [
        { id: "a", text: "A gana porque tiene dos clases", isCorrect: false },
        { id: "b", text: "B gana porque tiene un ID", isCorrect: true },
        { id: "c", text: "Empatan y gana el ultimo", isCorrect: false },
        { id: "d", text: "Depende del orden en el HTML", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Recuerda: un solo ID tiene mas peso que cualquier cantidad de clases.",
      explanation:
        "El selector B '#principal p' tiene especificidad (1,0,1) y A '.card .titulo' tiene (0,2,0). Aunque A tiene dos clases, un solo ID (1,0,0) supera a cualquier numero de clases (0,n,0). El ID siempre gana.",
    },
    {
      id: "09-ej-06",
      type: "live-editor",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt:
        "El parrafo deberia ser de color steelblue, pero la regla existente lo pone rojo. Escribe un selector con suficiente especificidad para que sea steelblue SIN usar !important. Pista: usa el ID del contenedor.",
      codeTemplate: {
        html: `<div id="contenedor">\n  <p class="texto">Este texto debe ser steelblue.</p>\n</div>`,
        cssPrefix: ".texto { color: red; }\n\n",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS: "#contenedor .texto {\n  color: steelblue;\n}",
      validation: {
        type: "includes",
        answer: ["#contenedor", "color", "steelblue"],
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
        type: "includes",
        answer: ["#seccion", "color", "crimson", "font-size", "20px"],
      },
      hint: "La regla mas fuerte actual tiene especificidad (0,2,0). Para ganarle, usa el ID #seccion combinado con las clases existentes.",
      explanation:
        "Las reglas existentes tienen especificidad (0,0,1) y (0,2,0). El selector '#seccion .articulo .texto' tiene (1,2,0), que supera a ambas. Al incluir el ID del ancestro, ganamos sin necesidad de !important.",
    },
  ],
};
