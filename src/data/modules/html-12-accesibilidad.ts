import type { ModuleData } from "@/types";

export const htmlAccesibilidadModule: ModuleData = {
  slug: "html-accesibilidad",
  title: "Accesibilidad en HTML",
  description:
    "Aprende a crear paginas web accesibles usando roles ARIA, texto alternativo, navegacion por teclado y buenas practicas de accesibilidad.",
  order: 12,
  category: "html-intermediate",
  icon: "eye",
  dojo: "html",
  lessons: [
    {
      id: "html12-leccion-01",
      title: "Por que importa la accesibilidad?",
      content: `## Por que importa la accesibilidad?

La **accesibilidad web** (a11y) significa crear sitios que todas las personas puedan usar, incluyendo personas con discapacidades visuales, auditivas, motrices o cognitivas.

### Datos importantes

- Mas del **15% de la poblacion mundial** tiene alguna discapacidad
- En muchos paises, la accesibilidad web es un **requisito legal**
- Un sitio accesible tambien es mejor para **todos** los usuarios

### Los 4 principios WCAG

Las **Pautas de Accesibilidad para el Contenido Web** (WCAG) se basan en:

1. **Perceptible:** La informacion debe poder percibirse (no solo visual)
2. **Operable:** La interfaz debe poder operarse (teclado, no solo raton)
3. **Comprensible:** El contenido debe ser facil de entender
4. **Robusto:** Debe funcionar con diferentes tecnologias asistivas

### HTML semantico = base de la accesibilidad

Usar etiquetas semanticas es el **primer paso** hacia un sitio accesible. Los lectores de pantalla dependen de la estructura HTML para navegar.

> **Recuerda:** La accesibilidad no es un extra, es una parte fundamental del desarrollo web.`,
      codeExample: {
        html: `<!-- Ejemplo: Sitio NO accesible -->
<div onclick="alert('clic')" style="padding:12px;background:#e17055;color:white;margin-bottom:16px;border-radius:4px;">
  <div style="font-size:20px;font-weight:bold;">Mal ejemplo</div>
  <div>Este "boton" es un div. No es accesible por teclado.</div>
</div>

<!-- Ejemplo: Sitio accesible -->
<button onclick="alert('clic')" style="padding:12px;background:#00b894;color:white;border:none;border-radius:4px;font-size:16px;cursor:pointer;display:block;width:100%;">
  <strong>Buen ejemplo</strong><br>
  Este boton es accesible por teclado y lector de pantalla.
</button>

<br>

<img alt="Logo de accesibilidad web: persona con brazos abiertos dentro de un circulo" style="width:60px;height:60px;background:#0984e3;border-radius:50%;display:flex;align-items:center;justify-content:center;">

<p><strong>Regla clave:</strong> Si parece un boton, debe SER un boton.</p>`,
        css: `body { font-family: sans-serif; padding: 16px; }
button:focus { outline: 3px solid #fdcb6e; outline-offset: 2px; }`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "html12-leccion-02",
      title: "Roles y atributos ARIA",
      content: `## Roles y atributos ARIA

**ARIA** (Accessible Rich Internet Applications) es un conjunto de atributos que mejoran la accesibilidad cuando el HTML semantico no es suficiente.

### Regla de oro de ARIA

> No uses ARIA si puedes usar HTML semantico. Un \`<button>\` es mejor que \`<div role="button">\`.

### Roles ARIA comunes

| Rol | Uso |
|-----|-----|
| \`role="button"\` | Indica que un elemento actua como boton |
| \`role="navigation"\` | Zona de navegacion |
| \`role="alert"\` | Mensaje importante que se anuncia inmediatamente |
| \`role="dialog"\` | Ventana de dialogo o modal |
| \`role="tab"\` / \`role="tabpanel"\` | Interfaz de pestanas |

### Atributos ARIA esenciales

| Atributo | Funcion |
|----------|---------|
| \`aria-label\` | Etiqueta accesible (cuando no hay texto visible) |
| \`aria-hidden="true"\` | Oculta el elemento de lectores de pantalla |
| \`aria-describedby\` | Referencia a un elemento con descripcion adicional |
| \`aria-expanded\` | Indica si un elemento desplegable esta abierto |
| \`aria-live\` | Anuncia cambios dinamicos (\`polite\` o \`assertive\`) |
| \`aria-required\` | Indica que un campo es obligatorio |

### Ejemplo practico

\`\`\`html
<button aria-label="Cerrar menu" aria-expanded="false">
  X
</button>

<div aria-live="polite" id="notificacion">
  <!-- Los cambios aqui se anuncian automaticamente -->
</div>
\`\`\``,
      codeExample: {
        html: `<!-- Boton con solo un icono necesita aria-label -->
<button aria-label="Buscar" style="font-size:24px;padding:12px;background:#6c5ce7;color:white;border:none;border-radius:8px;cursor:pointer;">
  🔍
</button>

<button aria-label="Cerrar ventana" style="font-size:24px;padding:12px;background:#e17055;color:white;border:none;border-radius:8px;cursor:pointer;margin-left:8px;">
  ✕
</button>

<br><br>

<!-- Campo con descripcion adicional -->
<label for="password">Contrasena:</label><br>
<input type="password" id="password" aria-describedby="password-help" style="padding:8px;margin:4px 0;">
<p id="password-help" style="color:#636e72;font-size:14px;">
  Debe tener al menos 8 caracteres, una mayuscula y un numero.
</p>

<!-- Zona de notificaciones en vivo -->
<div aria-live="polite" id="notificacion" style="padding:12px;background:#dfe6e9;border-radius:8px;margin-top:12px;">
  Las notificaciones apareceran aqui.
</div>
<button onclick="document.getElementById('notificacion').textContent='Nuevo mensaje recibido!'" style="margin-top:8px;padding:8px 16px;background:#00b894;color:white;border:none;border-radius:4px;cursor:pointer;">
  Simular notificacion
</button>`,
        css: `body { font-family: sans-serif; padding: 16px; }
button:focus { outline: 3px solid #fdcb6e; outline-offset: 2px; }
input:focus { outline: 3px solid #6c5ce7; outline-offset: 2px; }`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "html12-leccion-03",
      title: "Texto alternativo, foco y skip navigation",
      content: `## Texto alternativo, foco y skip navigation

### Texto alternativo (alt)

El atributo \`alt\` en imagenes es **obligatorio** para la accesibilidad.

**Buenas practicas:**
- Describe lo que muestra la imagen, no "imagen de..."
- Si la imagen es decorativa, usa \`alt=""\` (vacio, no omitido)
- Se especifico: "Gato naranja durmiendo en un sofa" es mejor que "Gato"

\`\`\`html
<!-- Informativa -->
<img src="grafico.png" alt="Ventas aumentaron 30% en marzo 2026">

<!-- Decorativa -->
<img src="linea-decorativa.png" alt="">
\`\`\`

### Skip navigation

Un enlace oculto que permite a usuarios de teclado **saltar al contenido principal**:

\`\`\`html
<a href="#main-content" class="skip-link">Ir al contenido principal</a>
<!-- ... header y nav ... -->
<main id="main-content">...</main>
\`\`\`

### Gestion del foco

- Todos los elementos interactivos deben ser **enfocables con Tab**
- El **orden de foco** debe ser logico (izquierda a derecha, arriba a abajo)
- Nunca uses \`outline: none\` sin una alternativa visual
- Usa \`:focus-visible\` para mostrar indicadores de foco solo con teclado

### Contraste de colores

El texto debe tener un **contraste minimo de 4.5:1** con el fondo (WCAG AA). Herramientas como "WebAIM Contrast Checker" ayudan a verificar.`,
      codeExample: {
        html: `<!-- Skip navigation -->
<a href="#contenido" class="skip-link">Ir al contenido principal</a>

<header style="background:#2d3436;color:white;padding:12px 16px;">
  <nav>
    <a href="#" style="color:#74b9ff;margin-right:12px;">Inicio</a>
    <a href="#" style="color:#74b9ff;margin-right:12px;">Cursos</a>
    <a href="#" style="color:#74b9ff;">Contacto</a>
  </nav>
</header>

<main id="contenido" style="padding:16px;">
  <h2>Ejemplo de accesibilidad</h2>

  <!-- Imagen con buen alt -->
  <figure>
    <div style="background:#6c5ce7;color:white;padding:40px;text-align:center;border-radius:8px;">
      [Imagen de ejemplo]
    </div>
    <figcaption>
      Alt correcto: "Grafico de barras mostrando crecimiento de usuarios en 2026"
    </figcaption>
  </figure>

  <!-- Buen contraste -->
  <div style="display:flex;gap:12px;margin-top:16px;">
    <div style="background:#2d3436;color:#ffffff;padding:12px;border-radius:8px;flex:1;text-align:center;">
      Buen contraste ✓
    </div>
    <div style="background:#dfe6e9;color:#b2bec3;padding:12px;border-radius:8px;flex:1;text-align:center;">
      Mal contraste ✕
    </div>
  </div>
</main>`,
        css: `.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #fdcb6e;
  color: #2d3436;
  padding: 8px 16px;
  z-index: 100;
  font-weight: bold;
  text-decoration: none;
}
.skip-link:focus {
  top: 0;
}
body { font-family: sans-serif; margin: 0; }
a:focus { outline: 3px solid #fdcb6e; outline-offset: 2px; }`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "html12-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que significan las siglas ARIA en accesibilidad web?",
      options: [
        { id: "a", text: "Advanced Rendering Interface for Applications", isCorrect: false },
        { id: "b", text: "Accessible Rich Internet Applications", isCorrect: true },
        { id: "c", text: "Automatic Reader Integration for Accessibility", isCorrect: false },
        { id: "d", text: "Application Resource Interface Architecture", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Se enfoca en hacer aplicaciones de internet accesibles.",
      explanation:
        "ARIA significa Accessible Rich Internet Applications. Son atributos que mejoran la accesibilidad cuando el HTML semantico no es suficiente.",
    },
    {
      id: "html12-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que atributo ARIA se usa para dar una etiqueta accesible a un boton con solo un icono?",
      options: [
        { id: "a", text: "aria-text", isCorrect: false },
        { id: "b", text: "aria-name", isCorrect: false },
        { id: "c", text: "aria-label", isCorrect: true },
        { id: "d", text: "aria-title", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es como una 'etiqueta' invisible que describe el elemento.",
      explanation:
        'aria-label proporciona una etiqueta accesible cuando no hay texto visible. Ejemplo: <button aria-label="Cerrar">X</button>.',
    },
    {
      id: "html12-ej-03",
      type: "code-completion",
      difficulty: 1 ,
      xpReward: 10,
      order: 3,
      prompt: "Completa el atributo para ocultar un icono decorativo de los lectores de pantalla:",
      codeTemplate: {
        html: "",
        cssPrefix: '<span ',
        cssSuffix: '="true">★</span>',
        blanks: ["aria-hidden"],
      },
      validation: { type: "exact", answer: "aria-hidden" },
      hint: "Este atributo ARIA oculta elementos de la tecnologia asistiva.",
      explanation:
        'aria-hidden="true" oculta un elemento de los lectores de pantalla. Es util para iconos decorativos que no aportan informacion.',
    },
    {
      id: "html12-ej-04",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Cual es la regla de oro de ARIA?",
      options: [
        { id: "a", text: "Siempre usar el maximo de atributos ARIA posible", isCorrect: false },
        { id: "b", text: "ARIA solo funciona en formularios", isCorrect: false },
        { id: "c", text: "No usar ARIA si puedes usar HTML semantico nativo", isCorrect: true },
        { id: "d", text: "Cada elemento debe tener al menos un atributo ARIA", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Piensa en que es mejor: un boton real o un div con role='button'.",
      explanation:
        'La regla de oro es preferir HTML semantico sobre ARIA. Un <button> nativo ya tiene toda la accesibilidad integrada, mientras que <div role="button"> requiere implementar teclado y foco manualmente.',
    },
    {
      id: "html12-ej-05",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica cada practica de texto alt como buena o mala:",
      dragItems: [
        { id: "drag-1", content: 'alt="Gato naranja durmiendo en un sofa azul"', correctZone: "zone-buena" },
        { id: "drag-2", content: 'alt="imagen"', correctZone: "zone-mala" },
        { id: "drag-3", content: 'alt="" (imagen decorativa)', correctZone: "zone-buena" },
        { id: "drag-4", content: "Omitir el atributo alt completamente", correctZone: "zone-mala" },
      ],
      dropZones: [
        { id: "zone-buena", label: "Buena practica" },
        { id: "zone-mala", label: "Mala practica" },
      ],
      validation: {
        type: "exact",
        answer: {
          "drag-1": "zone-buena",
          "drag-2": "zone-mala",
          "drag-3": "zone-buena",
          "drag-4": "zone-mala",
        },
      },
      hint: "El alt debe describir el contenido de la imagen de forma util.",
      explanation:
        'Un buen alt describe especificamente la imagen. Para imagenes decorativas se usa alt="" vacio. Nunca se debe omitir el atributo ni usar textos genericos como "imagen".',
    },
    {
      id: "html12-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Que es un 'skip navigation link'?",
      options: [
        { id: "a", text: "Un enlace para saltar animaciones CSS", isCorrect: false },
        { id: "b", text: "Un enlace oculto que permite saltar al contenido principal", isCorrect: true },
        { id: "c", text: "Un boton para desactivar el menu de navegacion", isCorrect: false },
        { id: "d", text: "Un atributo ARIA para ignorar la navegacion", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es util para usuarios que navegan con teclado.",
      explanation:
        "Un skip navigation link es un enlace (generalmente oculto visualmente) que aparece al presionar Tab y permite a usuarios de teclado saltar directamente al contenido principal, sin tener que recorrer todo el menu.",
    },
    {
      id: "html12-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Cual es el ratio minimo de contraste recomendado por WCAG AA para texto normal?",
      options: [
        { id: "a", text: "2:1", isCorrect: false },
        { id: "b", text: "3:1", isCorrect: false },
        { id: "c", text: "4.5:1", isCorrect: true },
        { id: "d", text: "7:1", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Es mayor que 4 pero menor que 5.",
      explanation:
        "WCAG AA requiere un contraste minimo de 4.5:1 para texto normal y 3:1 para texto grande. El nivel AAA requiere 7:1 para texto normal.",
    },
  ],
};
