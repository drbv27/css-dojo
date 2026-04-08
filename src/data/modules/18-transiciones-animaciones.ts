import type { ModuleData } from "@/types";

export const transicionesAnimacionesModule: ModuleData = {
  slug: "transiciones-animaciones",
  title: "Transiciones y Animaciones CSS",
  description:
    "Da vida a tus interfaces con transiciones suaves entre estados y animaciones personalizadas usando @keyframes.",
  order: 18,
  dojo: "css" as const,
  category: "advanced",
  icon: "Play",
  lessons: [
    {
      id: "18-leccion-01",
      title: "Transiciones CSS",
      content: `## Transiciones CSS

Las **transiciones** permiten cambiar suavemente el valor de una propiedad CSS durante un periodo de tiempo, en lugar de que el cambio sea instantaneo.

### Propiedades de transicion

| Propiedad | Descripcion | Ejemplo |
|-----------|------------|---------|
| \`transition-property\` | Que propiedad animar | \`background-color\`, \`all\` |
| \`transition-duration\` | Cuanto dura | \`0.3s\`, \`500ms\` |
| \`transition-timing-function\` | Curva de velocidad | \`ease\`, \`linear\` |
| \`transition-delay\` | Tiempo de espera antes de empezar | \`0s\`, \`200ms\` |

### Propiedad abreviada

\`\`\`css
.boton {
  /* transition: propiedad duracion funcion retardo */
  transition: background-color 0.3s ease 0s;
}
\`\`\`

### Ejemplo basico

\`\`\`css
.boton {
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  transition: background-color 0.3s ease;
}

.boton:hover {
  background-color: #2980b9;
}
\`\`\`

Sin la transicion, el cambio de color seria instantaneo. Con ella, el color cambia suavemente en 0.3 segundos.

### Transiciones multiples

Puedes animar varias propiedades separandolas con comas:

\`\`\`css
.tarjeta {
  transition: transform 0.3s ease,
              box-shadow 0.3s ease,
              background-color 0.5s ease;
}

.tarjeta:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  background-color: #f8f9fa;
}
\`\`\`

O anima todas las propiedades con \`all\`:

\`\`\`css
.elemento {
  transition: all 0.3s ease;
}
\`\`\`

> **Consejo de rendimiento:** Evita usar \`transition: all\` en produccion. Es mejor especificar cada propiedad para evitar transiciones no deseadas y mejorar el rendimiento.`,
      codeExample: {
        html: `<button class="btn-transicion">Pasa el cursor sobre mi</button>\n<div class="tarjeta-hover">\n  <h3>Tarjeta interactiva</h3>\n  <p>Hover para ver el efecto</p>\n</div>`,
        css: `.btn-transicion {\n  background-color: #3498db;\n  color: white;\n  padding: 12px 32px;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: background-color 0.3s ease, transform 0.2s ease;\n}\n.btn-transicion:hover {\n  background-color: #2980b9;\n  transform: scale(1.05);\n}\n\n.tarjeta-hover {\n  margin-top: 16px;\n  padding: 24px;\n  background: white;\n  border: 1px solid #ddd;\n  border-radius: 12px;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n.tarjeta-hover:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 25px rgba(0,0,0,0.1);\n}`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "18-leccion-02",
      title: "Funciones de temporizado",
      content: `## Funciones de temporizado (timing functions)

La funcion de temporizado controla la **velocidad** de la transicion a lo largo del tiempo. No todas las animaciones deben moverse a velocidad constante.

### Funciones predefinidas

| Funcion | Comportamiento |
|---------|---------------|
| \`ease\` | Empieza lento, acelera, termina lento (por defecto) |
| \`linear\` | Velocidad constante |
| \`ease-in\` | Empieza lento, termina rapido |
| \`ease-out\` | Empieza rapido, termina lento |
| \`ease-in-out\` | Lento al inicio y al final |

### Curvas personalizadas con cubic-bezier()

Para control total, usa \`cubic-bezier(x1, y1, x2, y2)\`:

\`\`\`css
.elemento {
  /* Efecto de rebote suave */
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
\`\`\`

Los cuatro numeros definen dos puntos de control de una curva Bezier. Puedes experimentar con herramientas como **cubic-bezier.com**.

### Funcion steps()

Crea animaciones escalonadas (saltos discretos):

\`\`\`css
.sprite {
  transition: background-position 0.5s steps(6);
  /* Se mueve en 6 pasos, util para sprites */
}
\`\`\`

### Cual usar?

- **ease-out**: Para elementos que **entran** a la pantalla (llegan y frenan)
- **ease-in**: Para elementos que **salen** de la pantalla (aceleran y desaparecen)
- **ease-in-out**: Para movimientos que **empiezan y terminan** en la vista
- **linear**: Para rotaciones continuas o barras de progreso

> **Regla de oro:** \`ease-out\` es la mejor opcion por defecto para interacciones de usuario (hover, click). Siente natural porque los objetos en el mundo real desaceleran al detenerse.`,
      codeExample: {
        html: `<div class="demo-timing">\n  <div class="barra ease">ease</div>\n  <div class="barra linear">linear</div>\n  <div class="barra ease-in">ease-in</div>\n  <div class="barra ease-out">ease-out</div>\n  <div class="barra ease-in-out">ease-in-out</div>\n</div>\n<p class="instruccion">Pasa el cursor sobre el contenedor</p>`,
        css: `.demo-timing {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.barra {\n  height: 40px;\n  width: 120px;\n  color: white;\n  display: flex;\n  align-items: center;\n  padding-left: 12px;\n  border-radius: 6px;\n  font-size: 0.85rem;\n  font-weight: bold;\n}\n.demo-timing:hover .barra {\n  width: 100%;\n}\n.ease { background: #e74c3c; transition: width 1.5s ease; }\n.linear { background: #f39c12; transition: width 1.5s linear; }\n.ease-in { background: #27ae60; transition: width 1.5s ease-in; }\n.ease-out { background: #3498db; transition: width 1.5s ease-out; }\n.ease-in-out { background: #9b59b6; transition: width 1.5s ease-in-out; }\n.instruccion {\n  margin-top: 12px;\n  font-style: italic;\n  color: #666;\n}`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "18-leccion-03",
      title: "Animaciones con @keyframes",
      content: `## Animaciones con @keyframes

Mientras las transiciones van de un estado A a un estado B, las **animaciones** permiten definir multiples estados intermedios y se pueden ejecutar automaticamente (sin necesidad de hover u otro trigger).

### Definir una animacion

Usa \`@keyframes\` para definir los pasos:

\`\`\`css
@keyframes deslizar {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
\`\`\`

Tambien puedes usar porcentajes para mas control:

\`\`\`css
@keyframes rebotar {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-30px); }
  70%  { transform: translateY(-15px); }
  100% { transform: translateY(0); }
}
\`\`\`

### Aplicar la animacion

\`\`\`css
.elemento {
  animation: deslizar 0.5s ease-out forwards;
}
\`\`\`

### Propiedades de animation

| Propiedad | Valores comunes | Descripcion |
|-----------|----------------|-------------|
| \`animation-name\` | Nombre del @keyframes | Que animacion aplicar |
| \`animation-duration\` | \`0.5s\`, \`1s\` | Duracion de un ciclo |
| \`animation-timing-function\` | \`ease\`, \`linear\` | Curva de velocidad |
| \`animation-delay\` | \`0s\`, \`0.5s\` | Retardo antes de empezar |
| \`animation-iteration-count\` | \`1\`, \`3\`, \`infinite\` | Cuantas veces se repite |
| \`animation-direction\` | \`normal\`, \`reverse\`, \`alternate\` | Direccion de la animacion |
| \`animation-fill-mode\` | \`none\`, \`forwards\`, \`backwards\`, \`both\` | Estado al terminar |

### Propiedad abreviada

\`\`\`css
.elemento {
  /* animation: nombre duracion timing retardo repeticiones direccion fill-mode */
  animation: rebotar 1s ease-in-out 0s infinite alternate forwards;
}
\`\`\`

### animation-fill-mode

Controla el estado del elemento fuera del tiempo de la animacion:

- \`none\`: Vuelve a su estado original (por defecto)
- \`forwards\`: Mantiene los estilos del ultimo keyframe
- \`backwards\`: Aplica los estilos del primer keyframe durante el delay
- \`both\`: Combina forwards y backwards

> **Importante:** \`forwards\` es esencial cuando quieres que el elemento mantenga su estado final despues de animarse (por ejemplo, permanecer visible despues de un fade-in).`,
      codeExample: {
        html: `<div class="contenedor-animaciones">\n  <div class="pulso">Pulso</div>\n  <div class="flotante">Flotante</div>\n  <div class="entrada">Entrada</div>\n</div>`,
        css: `@keyframes pulsar {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n\n@keyframes flotar {\n  0% { transform: translateY(0); }\n  50% { transform: translateY(-10px); }\n  100% { transform: translateY(0); }\n}\n\n@keyframes entrar {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.contenedor-animaciones {\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  padding: 20px;\n}\n\n.pulso, .flotante, .entrada {\n  padding: 20px 28px;\n  border-radius: 12px;\n  color: white;\n  font-weight: bold;\n  text-align: center;\n}\n\n.pulso {\n  background: #e74c3c;\n  animation: pulsar 2s ease-in-out infinite;\n}\n.flotante {\n  background: #3498db;\n  animation: flotar 3s ease-in-out infinite;\n}\n.entrada {\n  background: #27ae60;\n  animation: entrar 1s ease-out forwards;\n}`,
        editable: true,
      },
      order: 3,
    },
    {
      id: "18-leccion-04",
      title: "Buenas practicas y rendimiento",
      content: `## Buenas practicas y rendimiento

### Propiedades baratas de animar

No todas las propiedades CSS se animan con la misma eficiencia. Las mejores para rendimiento son:

| Propiedad | Rendimiento | Nota |
|-----------|-------------|------|
| \`transform\` | Excelente | Usa la GPU |
| \`opacity\` | Excelente | Usa la GPU |
| \`filter\` | Bueno | Usa la GPU en navegadores modernos |
| \`background-color\` | Medio | Requiere repintado |
| \`width\` / \`height\` | Malo | Requiere recalcular layout |
| \`top\` / \`left\` | Malo | Requiere recalcular layout |

### Regla de oro del rendimiento

**Prefiere animar \`transform\` y \`opacity\`** sobre cualquier otra propiedad:

\`\`\`css
/* Mal rendimiento */
.elemento:hover {
  left: 100px;     /* Recalcula layout */
  width: 200px;    /* Recalcula layout */
}

/* Buen rendimiento */
.elemento:hover {
  transform: translateX(100px);  /* Solo composicion */
  opacity: 0.8;                  /* Solo composicion */
}
\`\`\`

### will-change: optimizacion explicita

Indica al navegador que una propiedad va a cambiar para que se prepare:

\`\`\`css
.elemento {
  will-change: transform, opacity;
}
\`\`\`

> **Precaucion:** No abuses de \`will-change\`. Usalo solo en elementos que realmente se van a animar. Aplicarlo a muchos elementos consume memoria.

### Respetar preferencias del usuario

Algunos usuarios prefieren movimiento reducido. Usa la media query \`prefers-reduced-motion\`:

\`\`\`css
@keyframes flotar {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.elemento {
  animation: flotar 3s infinite;
}

/* Desactiva animaciones para usuarios que lo prefieren */
@media (prefers-reduced-motion: reduce) {
  .elemento {
    animation: none;
  }
}
\`\`\`

### Transiciones vs Animaciones: cuando usar cada una

| Caracteristica | Transicion | Animacion |
|---------------|-----------|-----------|
| Trigger | Requiere cambio de estado (hover, clase) | Puede ser automatica |
| Complejidad | Solo A a B | Multiples pasos |
| Repeticion | Una vez por trigger | Se puede repetir infinitamente |
| Control | Limitado | Total (pausar, revertir, iterar) |

> **Regla practica:** Usa transiciones para interacciones simples (hover, focus, toggle de clases). Usa animaciones para efectos complejos, automaticos o repetitivos.`,
      codeExample: {
        html: `<div class="demo-rendimiento">\n  <div class="bueno">Buen rendimiento<br>(transform)</div>\n  <div class="accesible">Respetuoso<br>(reduced-motion)</div>\n</div>`,
        css: `@keyframes mover-bien {\n  0% { transform: translateX(0); }\n  50% { transform: translateX(30px); }\n  100% { transform: translateX(0); }\n}\n\n.demo-rendimiento {\n  display: flex;\n  gap: 20px;\n  padding: 20px;\n}\n\n.bueno, .accesible {\n  padding: 24px;\n  border-radius: 12px;\n  color: white;\n  font-weight: bold;\n  text-align: center;\n}\n\n.bueno {\n  background: #27ae60;\n  will-change: transform;\n  animation: mover-bien 2s ease-in-out infinite;\n}\n\n.accesible {\n  background: #8e44ad;\n  animation: mover-bien 2s ease-in-out infinite;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .accesible {\n    animation: none;\n  }\n}`,
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "18-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt:
        "Cual es la diferencia principal entre una transicion y una animacion CSS?",
      options: [
        { id: "a", text: "Las transiciones son mas rapidas que las animaciones", isCorrect: false },
        { id: "b", text: "Las transiciones van de un estado A a B; las animaciones pueden tener multiples pasos intermedios", isCorrect: true },
        { id: "c", text: "Las animaciones solo funcionan en moviles", isCorrect: false },
        { id: "d", text: "No hay diferencia, son lo mismo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en la cantidad de estados que cada una puede manejar.",
      explanation:
        "Las transiciones cambian suavemente de un estado A a un estado B (requieren un trigger como :hover). Las animaciones con @keyframes pueden definir multiples estados intermedios con porcentajes y ejecutarse automaticamente.",
    },
    {
      id: "18-ej-02",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt:
        "Completa la propiedad para que el cambio de color del boton dure 0.3 segundos con curva ease:",
      codeTemplate: {
        html: `<button class="btn">Hover</button>`,
        cssPrefix: ".btn {\n  background-color: #3498db;\n  ",
        cssSuffix: ": background-color 0.3s ease;\n}\n.btn:hover {\n  background-color: #2980b9;\n}",
        blanks: ["transition"],
      },
      validation: { type: "exact", answer: "transition" },
      hint: "Es la propiedad que define un cambio suave entre dos estados de un elemento.",
      explanation:
        "La propiedad 'transition' permite definir una transicion suave. Aqui se aplica a 'background-color' con duracion de 0.3s y curva 'ease', creando un cambio de color fluido al hacer hover.",
    },
    {
      id: "18-ej-03",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt:
        "Arrastra cada funcion de temporizado a su comportamiento correcto:",
      dragItems: [
        { id: "drag-1", content: "ease", correctZone: "zone-suave" },
        { id: "drag-2", content: "linear", correctZone: "zone-constante" },
        { id: "drag-3", content: "ease-in", correctZone: "zone-lento-inicio" },
        { id: "drag-4", content: "ease-out", correctZone: "zone-lento-final" },
      ],
      dropZones: [
        { id: "zone-suave", label: "Lento al inicio y al final (por defecto)" },
        { id: "zone-constante", label: "Velocidad constante" },
        { id: "zone-lento-inicio", label: "Empieza lento, termina rapido" },
        { id: "zone-lento-final", label: "Empieza rapido, termina lento" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-suave",
          "drag-2": "zone-constante",
          "drag-3": "zone-lento-inicio",
          "drag-4": "zone-lento-final",
        },
      },
      hint: "'ease-in' significa que 'entra lentamente' (empieza lento). 'ease-out' significa que 'sale lentamente' (termina lento).",
      explanation:
        "'ease' es la curva por defecto (lenta al inicio y final). 'linear' mantiene velocidad constante. 'ease-in' arranca lento y acelera. 'ease-out' arranca rapido y desacelera al final.",
    },
    {
      id: "18-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt:
        "Completa la regla para definir una animacion llamada 'girar' que rote el elemento 360 grados:",
      codeTemplate: {
        html: `<div class="icono">*</div>`,
        cssPrefix: "@",
        cssSuffix: " girar {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n.icono {\n  animation: girar 2s linear infinite;\n}",
        blanks: ["keyframes"],
      },
      validation: { type: "exact", answer: "keyframes" },
      hint: "Es la regla que define los 'fotogramas clave' de una animacion CSS.",
      explanation:
        "La regla @keyframes define los fotogramas clave de una animacion. Aqui define la animacion 'girar' que rota de 0 a 360 grados. Se aplica con la propiedad 'animation' que la ejecuta infinitamente.",
    },
    {
      id: "18-ej-05",
      type: "live-editor",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt:
        "Crea una animacion @keyframes llamada 'fadeIn' que cambie opacity de 0 a 1. Aplica esta animacion a un elemento con clase 'aparecer' con duracion de 1s, ease-out, y animation-fill-mode: forwards.",
      codeTemplate: {
        html: `<div class="aparecer">\n  <h2>Hola mundo!</h2>\n  <p>Este contenido aparece con animacion.</p>\n</div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        "@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.aparecer {\n  animation: fadeIn 1s ease-out forwards;\n  background: #3498db;\n  color: white;\n  padding: 24px;\n  border-radius: 12px;\n}",
      validation: {
        type: "includes",
        answer: [
          "@keyframes",
          "fadeIn",
          "opacity",
          "animation",
          "forwards",
        ],
      },
      hint: "Define @keyframes fadeIn con from { opacity: 0 } y to { opacity: 1 }, luego aplica la animacion en .aparecer.",
      explanation:
        "Se define @keyframes fadeIn con opacity de 0 a 1. Luego se aplica con 'animation: fadeIn 1s ease-out forwards'. El 'forwards' asegura que el elemento mantenga opacity: 1 al terminar la animacion.",
    },
    {
      id: "18-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt:
        "Que valor de animation-fill-mode hace que el elemento mantenga los estilos del ultimo keyframe despues de terminar la animacion?",
      options: [
        { id: "a", text: "none", isCorrect: false },
        { id: "b", text: "backwards", isCorrect: false },
        { id: "c", text: "forwards", isCorrect: true },
        { id: "d", text: "inherit", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es el valor que mira 'hacia adelante' (al final de la animacion).",
      explanation:
        "'forwards' mantiene los estilos del ultimo keyframe al finalizar la animacion. Sin el, el elemento volveria a su estado original. Es esencial para animaciones de entrada como fade-in.",
    },
    {
      id: "18-ej-07",
      type: "visual-match",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt:
        "Crea un boton con clase 'btn-animado' que tenga transicion suave al hover: fondo de #3498db a #2c3e50, transformacion scale(1.05), y box-shadow. Duracion de transicion: 0.3s ease.",
      codeTemplate: {
        html: `<button class="btn-animado">Boton Animado</button>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".btn-animado {\n  background-color: #3498db;\n  color: white;\n  padding: 14px 32px;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;\n}\n.btn-animado:hover {\n  background-color: #2c3e50;\n  transform: scale(1.05);\n  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);\n}",
      validation: {
        type: "includes",
        answer: [
          "transition",
          "0.3s",
          "transform",
          "scale",
          "box-shadow",
          ":hover",
        ],
      },
      hint: "Define los estilos base del boton con transition para las 3 propiedades, y en :hover cambia el fondo, agrega scale y box-shadow.",
      explanation:
        "El boton usa transition para animar suavemente background-color, transform y box-shadow en 0.3s. Al hover, se oscurece el fondo, se agranda ligeramente con scale(1.05) y se agrega una sombra.",
    },
    {
      id: "18-ej-08",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt:
        "Cuales son las dos propiedades CSS mas eficientes para animar (mejor rendimiento)?",
      options: [
        { id: "a", text: "width y height", isCorrect: false },
        { id: "b", text: "transform y opacity", isCorrect: true },
        { id: "c", text: "margin y padding", isCorrect: false },
        { id: "d", text: "top y left", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Son las propiedades que el navegador puede procesar en la GPU sin recalcular el layout.",
      explanation:
        "'transform' y 'opacity' son las propiedades mas eficientes para animar porque el navegador las procesa en la GPU sin necesidad de recalcular el layout ni repintar. Las otras opciones fuerzan recalculos costosos.",
    },
  ],
};
