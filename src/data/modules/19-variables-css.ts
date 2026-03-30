import type { ModuleData } from "@/types";

export const variablesCSSModule: ModuleData = {
  slug: "variables-css",
  title: "Variables CSS (Custom Properties)",
  description:
    "Organiza y reutiliza valores en tu CSS con custom properties: declaracion, uso, scope, valores de respaldo y temas dinamicos.",
  order: 19,
  dojo: "css" as const,
  category: "advanced",
  icon: "Variable",
  lessons: [
    {
      id: "19-leccion-01",
      title: "Declarar y usar variables CSS",
      content: `## Declarar y usar variables CSS

Las **custom properties** (variables CSS) permiten almacenar valores y reutilizarlos en todo tu CSS, facilitando el mantenimiento y la consistencia.

### Declarar una variable

Las variables se declaran con el prefijo \`--\`:

\`\`\`css
:root {
  --color-primario: #3498db;
  --color-secundario: #2ecc71;
  --espaciado: 16px;
  --radio-borde: 8px;
  --fuente-principal: 'Segoe UI', sans-serif;
}
\`\`\`

### Usar una variable

Se accede a las variables con la funcion \`var()\`:

\`\`\`css
.boton {
  background-color: var(--color-primario);
  padding: var(--espaciado);
  border-radius: var(--radio-borde);
  font-family: var(--fuente-principal);
}

.enlace {
  color: var(--color-primario);
}
\`\`\`

### El selector :root

\`:root\` apunta al elemento raiz del documento (\`<html>\`). Las variables declaradas ahi estan disponibles en **todo el documento**:

\`\`\`css
:root {
  --color-acento: #e74c3c;
}

/* Disponible en CUALQUIER lugar del CSS */
.alerta { color: var(--color-acento); }
.boton-peligro { background: var(--color-acento); }
\`\`\`

### Nombres de variables

- Siempre empiezan con \`--\` (dos guiones)
- Son **case-sensitive**: \`--Color\` y \`--color\` son diferentes
- Pueden contener letras, numeros, guiones y guiones bajos
- Convencion comun: \`--categoria-nombre\` (ejemplo: \`--color-texto\`, \`--tamanio-titulo\`)

> **Ventaja clave:** Si necesitas cambiar un color usado en 50 lugares, solo lo cambias en la variable. Sin variables, tendrias que buscar y reemplazar en 50 reglas.`,
      codeExample: {
        html: `<div class="tarjeta">\n  <h2 class="tarjeta-titulo">Variables CSS</h2>\n  <p class="tarjeta-texto">Las variables hacen tu CSS mas mantenible y consistente.</p>\n  <button class="tarjeta-btn">Aprender mas</button>\n</div>`,
        css: `:root {\n  --color-primario: #3498db;\n  --color-texto: #2c3e50;\n  --color-fondo: #f8f9fa;\n  --espaciado: 16px;\n  --radio: 12px;\n}\n\n.tarjeta {\n  background: var(--color-fondo);\n  padding: calc(var(--espaciado) * 2);\n  border-radius: var(--radio);\n  border: 1px solid #e0e0e0;\n}\n\n.tarjeta-titulo {\n  color: var(--color-texto);\n  margin-bottom: var(--espaciado);\n}\n\n.tarjeta-texto {\n  color: #666;\n  margin-bottom: var(--espaciado);\n}\n\n.tarjeta-btn {\n  background: var(--color-primario);\n  color: white;\n  border: none;\n  padding: calc(var(--espaciado) * 0.75) calc(var(--espaciado) * 1.5);\n  border-radius: calc(var(--radio) / 2);\n  cursor: pointer;\n  font-size: 1rem;\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "19-leccion-02",
      title: "Scope, herencia y valores de respaldo",
      content: `## Scope, herencia y valores de respaldo

### Scope (ambito) de las variables

Las variables CSS siguen las reglas de **cascada y herencia**. Una variable declarada en un elemento esta disponible para ese elemento y todos sus descendientes:

\`\`\`css
:root {
  --color: blue;   /* Disponible globalmente */
}

.seccion {
  --color: red;    /* Sobreescribe --color dentro de .seccion */
}

.seccion p {
  color: var(--color); /* red (hereda de .seccion) */
}

.otra p {
  color: var(--color); /* blue (hereda de :root) */
}
\`\`\`

### Variables locales

Puedes declarar variables en cualquier selector para limitar su alcance:

\`\`\`css
.alerta {
  --alerta-fondo: #fff3cd;
  --alerta-borde: #ffc107;
  --alerta-texto: #856404;

  background: var(--alerta-fondo);
  border: 1px solid var(--alerta-borde);
  color: var(--alerta-texto);
}
\`\`\`

### Valores de respaldo (fallback)

La funcion \`var()\` acepta un segundo parametro como **valor de respaldo** por si la variable no esta definida:

\`\`\`css
.elemento {
  color: var(--color-texto, #333);
  /* Si --color-texto no existe, usa #333 */

  padding: var(--espaciado, 16px);
  /* Si --espaciado no existe, usa 16px */
}
\`\`\`

Puedes encadenar fallbacks con variables anidadas:

\`\`\`css
.elemento {
  color: var(--color-especial, var(--color-primario, blue));
  /* Intenta --color-especial, luego --color-primario, luego blue */
}
\`\`\`

### Variables y calc()

Las variables se pueden usar dentro de \`calc()\` para calculos dinamicos:

\`\`\`css
:root {
  --base: 8px;
}

.elemento {
  padding: calc(var(--base) * 2);     /* 16px */
  margin: calc(var(--base) * 3);      /* 24px */
  font-size: calc(var(--base) * 2.5); /* 20px */
}
\`\`\`

> **Buena practica:** Siempre proporciona un valor de respaldo para variables que podrian no estar definidas, especialmente en componentes reutilizables.`,
      codeExample: {
        html: `<div class="componente tema-a">\n  <p>Tema A: variables locales</p>\n</div>\n<div class="componente tema-b">\n  <p>Tema B: variables diferentes</p>\n</div>\n<div class="componente">\n  <p>Sin tema: usa fallback</p>\n</div>`,
        css: `:root {\n  --base: 8px;\n}\n\n.tema-a {\n  --comp-fondo: #e8f4fd;\n  --comp-borde: #3498db;\n  --comp-texto: #1a5276;\n}\n\n.tema-b {\n  --comp-fondo: #eafaf1;\n  --comp-borde: #27ae60;\n  --comp-texto: #1e8449;\n}\n\n.componente {\n  background: var(--comp-fondo, #f5f5f5);\n  border-left: 4px solid var(--comp-borde, #999);\n  color: var(--comp-texto, #333);\n  padding: calc(var(--base) * 2);\n  margin-bottom: calc(var(--base) * 1.5);\n  border-radius: 6px;\n}\n\n.componente p {\n  margin: 0;\n  font-weight: bold;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "19-leccion-03",
      title: "Temas con variables CSS",
      content: `## Temas con variables CSS

Una de las aplicaciones mas poderosas de las variables CSS es la creacion de **temas** (como modo claro y oscuro).

### Estructura de temas

Define las variables base y sobreescribelas para cada tema:

\`\`\`css
/* Tema claro (por defecto) */
:root {
  --color-fondo: #ffffff;
  --color-texto: #1a1a1a;
  --color-primario: #3498db;
  --color-superficie: #f8f9fa;
  --color-borde: #e0e0e0;
}

/* Tema oscuro */
[data-tema="oscuro"] {
  --color-fondo: #1a1a2e;
  --color-texto: #e0e0e0;
  --color-primario: #5dade2;
  --color-superficie: #16213e;
  --color-borde: #2c3e50;
}
\`\`\`

Luego usa las variables en tus estilos:

\`\`\`css
body {
  background-color: var(--color-fondo);
  color: var(--color-texto);
}

.tarjeta {
  background: var(--color-superficie);
  border: 1px solid var(--color-borde);
}

.boton {
  background: var(--color-primario);
}
\`\`\`

### Cambiar tema con JavaScript

\`\`\`javascript
// Activar tema oscuro
document.documentElement.setAttribute('data-tema', 'oscuro');

// Volver al tema claro
document.documentElement.removeAttribute('data-tema');
\`\`\`

### Tema oscuro con prefers-color-scheme

Detecta automaticamente la preferencia del sistema operativo:

\`\`\`css
:root {
  --color-fondo: #ffffff;
  --color-texto: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-fondo: #1a1a2e;
    --color-texto: #e0e0e0;
  }
}
\`\`\`

### Sistema de espaciado con variables

\`\`\`css
:root {
  --espacio-xs: 4px;
  --espacio-sm: 8px;
  --espacio-md: 16px;
  --espacio-lg: 24px;
  --espacio-xl: 32px;
  --espacio-2xl: 48px;
}
\`\`\`

> **Patron profesional:** Los frameworks modernos como las design systems de empresas grandes usan variables CSS como base. Definir un sistema de variables solido es el primer paso para un CSS escalable.`,
      codeExample: {
        html: `<div class="demo-tema" id="app">\n  <div class="barra">\n    <h3>Mi App</h3>\n    <span class="etiqueta">Claro / Oscuro via CSS</span>\n  </div>\n  <div class="contenido-tema">\n    <p>Este componente usa variables CSS para definir sus colores. Cambia los valores de las variables para ver el efecto.</p>\n    <button class="btn-tema">Boton de accion</button>\n  </div>\n</div>`,
        css: `.demo-tema {\n  --dt-fondo: #ffffff;\n  --dt-texto: #1a1a1a;\n  --dt-superficie: #f0f2f5;\n  --dt-primario: #3498db;\n  --dt-borde: #ddd;\n\n  background: var(--dt-fondo);\n  color: var(--dt-texto);\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid var(--dt-borde);\n}\n\n.barra {\n  background: var(--dt-primario);\n  color: white;\n  padding: 12px 20px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.barra h3 { margin: 0; }\n.etiqueta {\n  font-size: 0.8rem;\n  opacity: 0.8;\n}\n\n.contenido-tema {\n  padding: 24px;\n  background: var(--dt-superficie);\n}\n\n.btn-tema {\n  background: var(--dt-primario);\n  color: white;\n  border: none;\n  padding: 10px 24px;\n  border-radius: 6px;\n  cursor: pointer;\n  margin-top: 12px;\n  font-size: 1rem;\n}`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "19-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Como se declara una variable CSS llamada 'color-primario' con el valor #3498db?",
      options: [
        { id: "a", text: "$color-primario: #3498db;", isCorrect: false },
        { id: "b", text: "--color-primario: #3498db;", isCorrect: true },
        { id: "c", text: "var(color-primario): #3498db;", isCorrect: false },
        { id: "d", text: "@color-primario: #3498db;", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las variables CSS usan un prefijo de dos caracteres especiales.",
      explanation:
        "Las variables CSS (custom properties) se declaran con el prefijo '--' (doble guion). La sintaxis $ es de Sass, @ es de Less. 'var()' se usa para leer la variable, no para declararla.",
    },
    {
      id: "19-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt:
        "Completa la funcion CSS para usar la variable --color-primario como color de fondo:",
      codeTemplate: {
        html: `<div class="caja">Contenido</div>`,
        cssPrefix: ":root { --color-primario: #3498db; }\n.caja {\n  background-color: ",
        cssSuffix: "(--color-primario);\n}",
        blanks: ["var"],
      },
      validation: { type: "exact", answer: "var" },
      hint: "Es una funcion de tres letras que 'obtiene' el valor de una variable CSS.",
      explanation:
        "La funcion 'var()' se usa para acceder al valor de una custom property. La sintaxis es var(--nombre-variable). Sin var(), el navegador no sabria que debe buscar el valor de la variable.",
    },
    {
      id: "19-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt:
        "Que hace la declaracion 'color: var(--color-texto, #333)'?",
      options: [
        { id: "a", text: "Aplica ambos colores al mismo tiempo", isCorrect: false },
        { id: "b", text: "Usa --color-texto, o #333 si la variable no esta definida", isCorrect: true },
        { id: "c", text: "Crea una nueva variable con valor #333", isCorrect: false },
        { id: "d", text: "Es un error de sintaxis", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El segundo parametro de var() es un valor de respaldo o fallback.",
      explanation:
        "El segundo argumento de var() es un valor de respaldo (fallback). Si --color-texto no esta definida en ningun ancestro, se usa #333. Es una buena practica incluir fallbacks en componentes reutilizables.",
    },
    {
      id: "19-ej-04",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Arrastra cada concepto de variables CSS a su descripcion correcta:",
      dragItems: [
        { id: "drag-1", content: ":root", correctZone: "zone-global" },
        { id: "drag-2", content: "var(--x, blue)", correctZone: "zone-fallback" },
        { id: "drag-3", content: "--mi-color: red;", correctZone: "zone-declarar" },
        { id: "drag-4", content: "calc(var(--base) * 2)", correctZone: "zone-calculo" },
      ],
      dropZones: [
        { id: "zone-global", label: "Selector para variables globales" },
        { id: "zone-fallback", label: "Usar variable con valor de respaldo" },
        { id: "zone-declarar", label: "Declarar una variable" },
        { id: "zone-calculo", label: "Calcular con variables" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-global",
          "drag-2": "zone-fallback",
          "drag-3": "zone-declarar",
          "drag-4": "zone-calculo",
        },
      },
      hint: ":root es donde se definen las variables globales. var() con dos argumentos incluye un fallback. -- declara. calc() calcula.",
      explanation:
        ":root se usa para declarar variables disponibles globalmente. var(--x, blue) usa la variable con fallback 'blue'. --mi-color: red declara la variable. calc(var(--base) * 2) permite operaciones matematicas con variables.",
    },
    {
      id: "19-ej-05",
      type: "live-editor",
      difficulty: 2,
      xpReward: 25,
      order: 5,
      prompt:
        "Define tres variables en :root: --color-primario (#e74c3c), --color-fondo (#f8f9fa) y --espaciado (16px). Luego crea una clase .caja que use estas variables para background, border-color y padding.",
      codeTemplate: {
        html: `<div class="caja">\n  <h3>Caja con variables</h3>\n  <p>Usando custom properties de CSS.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ":root {\n  --color-primario: #e74c3c;\n  --color-fondo: #f8f9fa;\n  --espaciado: 16px;\n}\n\n.caja {\n  background: var(--color-fondo);\n  border: 2px solid var(--color-primario);\n  padding: var(--espaciado);\n  border-radius: 8px;\n}",
      validation: {
        type: "includes",
        answer: [
          ":root",
          "--color-primario",
          "--color-fondo",
          "--espaciado",
          "var(--color-primario)",
          "var(--color-fondo)",
          "var(--espaciado)",
        ],
      },
      hint: "Primero declara las 3 variables en :root con --, luego usalas en .caja con var().",
      explanation:
        "Se declaran las variables en :root con el prefijo --. Luego en .caja se accede a ellas con var(). Esto permite cambiar los 3 valores desde un solo lugar si fuera necesario.",
    },
    {
      id: "19-ej-06",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 6,
      prompt:
        "Completa el selector CSS para que las variables se apliquen cuando el documento tenga el atributo data-tema='oscuro':",
      codeTemplate: {
        html: `<div>Contenido tematico</div>`,
        cssPrefix: "",
        cssSuffix: ' {\n  --color-fondo: #1a1a2e;\n  --color-texto: #e0e0e0;\n}',
        blanks: ['[data-tema="oscuro"]'],
      },
      validation: { type: "regex", answer: '\\[data-tema\\s*=\\s*["\']oscuro["\']\\]' },
      hint: "Es un selector de atributo que busca un atributo data-tema con valor 'oscuro'. Usa corchetes.",
      explanation:
        "El selector [data-tema=\"oscuro\"] selecciona cualquier elemento que tenga el atributo data-tema con valor 'oscuro'. Al cambiar este atributo con JavaScript, las variables se sobreescriben y todo el tema cambia.",
    },
    {
      id: "19-ej-07",
      type: "visual-match",
      difficulty: 3,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea un sistema de temas usando variables. Define en :root las variables --fondo (#ffffff), --texto (#1a1a1a), --acento (#3498db). Crea una clase .tema-oscuro que sobreescriba: --fondo a #1e1e2f, --texto a #e0e0e0, --acento a #5dade2. Aplica las variables a .pagina (background, color) y .boton (background con --acento, color white).",
      codeTemplate: {
        html: `<div class="pagina">\n  <h2>Sistema de temas</h2>\n  <p>Cambiando variables se cambia todo el aspecto.</p>\n  <button class="boton">Accion</button>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ":root {\n  --fondo: #ffffff;\n  --texto: #1a1a1a;\n  --acento: #3498db;\n}\n\n.tema-oscuro {\n  --fondo: #1e1e2f;\n  --texto: #e0e0e0;\n  --acento: #5dade2;\n}\n\n.pagina {\n  background: var(--fondo);\n  color: var(--texto);\n  padding: 24px;\n  border-radius: 12px;\n}\n\n.boton {\n  background: var(--acento);\n  color: white;\n  border: none;\n  padding: 10px 24px;\n  border-radius: 6px;\n  cursor: pointer;\n}",
      validation: {
        type: "includes",
        answer: [
          ":root",
          "--fondo",
          "--texto",
          "--acento",
          "var(--fondo)",
          "var(--texto)",
          "var(--acento)",
          ".tema-oscuro",
        ],
      },
      hint: "Define las variables en :root para el tema claro, sobreescribelas en .tema-oscuro, y usalas con var() en .pagina y .boton.",
      explanation:
        "El sistema de temas funciona declarando variables en :root (tema claro) y sobreescribiendolas en .tema-oscuro. Los estilos usan var() y se adaptan automaticamente al tema activo.",
    },
    {
      id: "19-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 10,
      order: 8,
      prompt:
        "Si declaras --color: blue en :root y --color: red en .seccion, que color tendra un <p> dentro de .seccion?",
      options: [
        { id: "a", text: "blue (la variable global tiene prioridad)", isCorrect: false },
        { id: "b", text: "red (la variable mas cercana tiene prioridad)", isCorrect: true },
        { id: "c", text: "purple (se mezclan ambos valores)", isCorrect: false },
        { id: "d", text: "Es un error, no se puede redeclarar una variable", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Las variables CSS siguen las reglas de herencia y cascada, como cualquier propiedad CSS.",
      explanation:
        "Las variables CSS se heredan de padres a hijos. Una variable declarada en .seccion sobreescribe la de :root para todos los descendientes de .seccion. El <p> hereda el valor 'red' de su ancestro mas cercano que define --color.",
    },
  ],
};
