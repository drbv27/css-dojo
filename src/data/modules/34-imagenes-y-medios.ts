import type { ModuleData } from "@/types";

export const imagenesYMediosModule: ModuleData = {
  slug: "imagenes-y-medios",
  title: "Imágenes y medios",
  description:
    "La imagen deformada es el bug visual número uno del principiante. Acá se arregla, y se entiende por qué pasaba.",
  order: 23,
  dojo: "css" as const,
  nivel: "obligatorio",
  category: "css-visual",
  icon: "Image",
  lessons: [
    {
      id: "34-leccion-01",
      title: "La foto aplastada, y por qué object-fit la arregla",
      content: `## El bug que todos escriben una vez

Tenés una galería y querés que todas las fotos midan lo mismo. Escribís lo obvio:

\`\`\`css
.foto {
  width: 300px;
  height: 200px;
}
\`\`\`

Y las fotos quedan **deformadas**: las verticales aplastadas, las panorámicas estiradas, las caras raras. Es el bug visual número uno del principiante y no es un descuido: es exactamente lo que pediste.

## Por qué pasa

Una \`<img>\` no es una caja con contenido: es una caja **con una imagen adentro**, y esa imagen tiene su propia proporción. Al fijarle ancho **y** alto le diste una caja que no respeta esa proporción, y el navegador hizo lo único que podía: estirar los píxeles hasta llenarla.

## object-fit: cómo se acomoda la imagen adentro de su caja

\`\`\`css
.foto {
  width: 300px;
  height: 200px;
  object-fit: cover;
}
\`\`\`

Los valores que importan:

| Valor | Qué hace |
|---|---|
| \`fill\` | el default: **deforma** hasta llenar la caja |
| \`cover\` | llena la caja **sin deformar**, recortando lo que sobra |
| \`contain\` | entra entera **sin deformar**, dejando espacio vacío |
| \`none\` | tamaño original, sin achicar ni agrandar |

\`cover\` es el que querés en una galería: todas las fotos miden igual y ninguna se deforma. El precio es que **recorta**, y ese precio lo elegís vos.

## Lo que hay que ver, no leer

Comparalo en vivo con una foto vertical y una panorámica en la misma grilla. Con \`fill\` las caras se estiran; con \`cover\` se recortan pero se ven bien. La diferencia no se entiende en una tabla: se entiende mirándola.

## Lo que sigue

\`object-position\` para decidir **qué parte** se recorta —porque \`cover\` centrado a veces te corta la cabeza—, \`aspect-ratio\` para reservar la proporción sin fijar los dos lados, los filtros, \`clip-path\`, y cuándo conviene una imagen de fondo en vez de una \`<img>\`.`,
      order: 1,
    },
    {
      id: "34-leccion-02",
      title: "object-position: qué parte se recorta",
      content: `## cover recorta, y por defecto recorta del centro

\`object-fit: cover\` conserva la proporción y saca lo que sobra. La pregunta que sigue es **de dónde** lo saca, y la respuesta por defecto es: de los bordes, dejando el centro.

Eso funciona en un paisaje y falla en un retrato. Si la persona está arriba en la foto y la caja es apaisada, \`cover\` centrado **le corta la cabeza**.

## La propiedad

\`\`\`css
.foto {
  object-fit: cover;
  object-position: top;
}
\`\`\`

Acepta lo mismo que \`background-position\`, que ya viste:

\`\`\`css
object-position: top;          /* pega arriba */
object-position: 50% 20%;      /* centrado horizontal, 20% desde arriba */
object-position: left bottom;  /* esquina */
\`\`\`

## El caso real: fotos de perfil

Para caras, \`50% 20%\` suele funcionar mejor que el centro: la cara casi siempre está en el tercio superior.

\`\`\`css
.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  object-position: 50% 20%;
  border-radius: 50%;
}
\`\`\`

## Y el que casi nadie usa: contain con position

Con \`contain\` la imagen entra entera y sobra espacio. \`object-position\` decide **dónde queda la imagen dentro de ese espacio**, en vez de qué se recorta.

\`\`\`css
.logo {
  object-fit: contain;
  object-position: left;   /* el logo pegado a la izquierda, no centrado */
}
\`\`\`

Es útil en logos de clientes, donde querés que todos arranquen alineados aunque midan distinto.`,
      order: 2,
    },
    {
      id: "34-leccion-03",
      title: "aspect-ratio: reservar la proporción",
      content: `## El problema del salto

La página carga, el texto se dibuja, y cuando la imagen llega **todo salta hacia abajo** para hacerle lugar. Es molesto y además Google lo mide y lo penaliza.

Pasa porque hasta que la imagen no llega, el navegador no sabe cuánto va a medir, así que le reserva cero.

## La solución vieja y la nueva

Antes esto se resolvía con un truco de \`padding-top\` en porcentaje que nadie entendía del todo. Hoy es una línea:

\`\`\`css
.foto {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
\`\`\`

**El navegador ya sabe cuánto alto va a ocupar antes de tener la imagen**, así que reserva el espacio y nada salta.

## Cómo se lee

\`aspect-ratio: ancho / alto\`. Los valores más usados:

| Valor | Para qué |
|---|---|
| \`16 / 9\` | video, banners |
| \`4 / 3\` | fotos clásicas |
| \`1 / 1\` | cuadrado, avatares, grillas |
| \`3 / 4\` | retratos verticales |

## El par que va junto

\`aspect-ratio\` y \`object-fit\` se usan de a dos, y conviene entender por qué:

- \`aspect-ratio\` le da a la **caja** la forma que vos querés.
- \`object-fit\` decide cómo se acomoda **la imagen** adentro de esa caja.

Sin el segundo, una foto vertical en una caja \`16 / 9\` se deforma igual: le diste la forma a la caja, no a la imagen.

## Y sirve para cualquier caja, no sólo imágenes

\`\`\`css
.video-embebido {
  width: 100%;
  aspect-ratio: 16 / 9;
}
\`\`\`

Es la forma moderna de meter un video de YouTube que se adapte al ancho sin deformarse. El truco del padding en porcentaje quedó atrás.`,
      order: 3,
    },
    {
      id: "34-leccion-04",
      title: "Filtros, clip-path, y cuándo NO usar una img",
      content: `## filter: retocar sin salir del navegador

\`\`\`css
.foto {
  filter: grayscale(100%);
}

.foto:hover {
  filter: grayscale(0%);
}
\`\`\`

Los que más se usan:

\`\`\`css
filter: grayscale(100%);           /* blanco y negro */
filter: blur(4px);                 /* desenfoque */
filter: brightness(0.6);           /* mas oscura */
filter: contrast(1.2) saturate(1.3);  /* se encadenan, en orden */
\`\`\`

**Se aplican en orden y se acumulan.** Y ojo: \`filter\` afecta al elemento **entero**, hijos incluidos. Un \`blur\` en una tarjeta desenfoca también su texto.

## clip-path: recortar con una forma

\`\`\`css
.foto-circular {
  clip-path: circle(50%);
}
\`\`\`

Con \`border-radius: 50%\` hacés lo mismo para un círculo. \`clip-path\` sirve cuando la forma **no** es un rectángulo redondeado:

\`\`\`css
clip-path: circle(50%);
clip-path: polygon(50% 0%, 100% 100%, 0% 100%);   /* un triangulo */
clip-path: inset(10% 20% 10% 20%);                /* recorte por lados */
\`\`\`

Lo recortado **deja de recibir clics**, que a veces es lo que querés y a veces es un bug difícil de encontrar.

## La decisión que importa: img o background-image

No es una preferencia de estilo. La regla es de **significado**:

| Usá | Cuándo |
|---|---|
| \`<img>\` | la imagen **es contenido**: una foto de producto, el avatar, una captura |
| \`background-image\` | la imagen **es decoración**: una textura, un degradado, un patrón |

## Y la razón de fondo

Un \`<img>\` tiene \`alt\`. Un fondo no. Si la imagen dice algo —el producto que vas a comprar, la cara de la persona— y la ponés como fondo, **para un lector de pantalla esa información no existe**.

La prueba rápida: si al describir la página en voz alta nombrarías esa imagen, es contenido y va en \`<img>\`. Si ni la mencionarías, es decoración.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "34-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt:
        "Le fijás width y height a una imagen y queda deformada. ¿Qué valor de object-fit la hace llenar la caja sin deformarse?",
      options: [
        { id: "a", text: "contain, porque entra entera dentro de la caja", isCorrect: false },
        { id: "b", text: "fill, porque llena todo el espacio disponible", isCorrect: false },
        { id: "c", text: "none, porque conserva el tamaño original de la imagen", isCorrect: false },
        { id: "d", text: "cover, porque llena la caja conservando la proporción y recorta lo que sobra", isCorrect: true },
      ],
      validation: { type: "exact", answer: "d" },
      hint: "Dos de los valores conservan la proporción. La diferencia entre ellos es si dejan espacio vacío o si recortan.",
      explanation:
        "cover llena la caja entera sin deformar, y el precio es que recorta lo que no entra. contain también conserva la proporción, pero deja franjas vacías porque hace entrar la imagen completa. fill es el default y es justamente el que estaba deformando.",
    },
    {
      id: "34-ej-02",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 2,
      prompt:
        "La imagen con clase 'miniatura' está deformada porque tiene ancho y alto fijos. Dale width: 300px, height: 200px, object-fit: cover y border-radius: 8px para que llene la caja sin deformarse.",
      codeTemplate: {
        html: `<img class="miniatura" src="https://placehold.co/900x300" alt="Una foto panorámica en una caja que no tiene su proporción" />`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".miniatura {\n  width: 300px;\n  height: 200px;\n  object-fit: cover;\n  border-radius: 8px;\n}",
      validation: { type: "css-rules" },
      hint: "Dos valores conservan la proporción. El que llena la caja entera es el que recorta lo que sobra.",
      explanation:
        "La foto es panorámica y la caja no: sin object-fit el navegador estira los píxeles hasta llenarla. Con cover conserva la proporción y recorta los costados, que es el trato que uno acepta en una galería donde todas las miniaturas tienen que medir igual.",
    },
    {
      id: "34-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt:
        "Usás object-fit: cover en fotos de perfil y a varias personas les corta la cabeza. ¿Qué agregás?",
      options: [
        { id: "a", text: "object-fit: contain, para que entre la cara entera", isCorrect: false },
        { id: "b", text: "object-position con un valor que suba el recorte, como 50% 20%", isCorrect: true },
        { id: "c", text: "Un height mayor, para que quepa la cabeza", isCorrect: false },
        { id: "d", text: "aspect-ratio: 1 / 1, para que la foto quede cuadrada", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "cover ya decide CUÁNTO recorta. Falta decirle DE DÓNDE, y por defecto lo hace del centro.",
      explanation:
        "object-position mueve el encuadre dentro de la caja. Para caras, 50% 20% funciona mejor que el centro porque la cara casi siempre está en el tercio superior. contain no sirve acá: entraría entera pero dejaría franjas vacías y las fotos dejarían de verse parejas.",
    },
    {
      id: "34-ej-04",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt:
        "Armá el avatar redondo: a la clase 'avatar' dale width: 120px, height: 120px, object-fit: cover, object-position: 50% 20% y border-radius: 50%.",
      codeTemplate: {
        html: `<img class="avatar" src="https://placehold.co/400x600" alt="Foto de perfil de Ana Martinez" />`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".avatar {\n  width: 120px;\n  height: 120px;\n  object-fit: cover;\n  object-position: 50% 20%;\n  border-radius: 50%;\n}",
      validation: { type: "css-rules" },
      hint: "La foto original es vertical y la caja es cuadrada: sin object-fit se aplasta, y sin object-position el recorte sale del centro.",
      explanation:
        "Es el avatar de manual: cuadrado, sin deformar, recortado un poco más arriba del centro para no cortar la cara, y redondeado. Las cinco declaraciones trabajan juntas y sacar cualquiera se nota.",
    },
    {
      id: "34-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt:
        "¿Qué problema resuelve aspect-ratio que object-fit no resuelve?",
      options: [
        { id: "a", text: "Evita que la imagen se deforme al llenar su caja", isCorrect: false },
        { id: "b", text: "Reserva el espacio antes de que la imagen llegue, así la página no salta al cargar", isCorrect: true },
        { id: "c", text: "Recorta la imagen desde el borde que vos elijas", isCorrect: false },
        { id: "d", text: "Descarga una versión más chica de la imagen en pantallas pequeñas", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Pensá en el momento anterior a que la imagen exista en pantalla. ¿Cuánto alto le reserva el navegador si no le decís nada?",
      explanation:
        "aspect-ratio le da forma a la CAJA y object-fit acomoda la IMAGEN adentro. Como la caja tiene su proporción declarada, el navegador reserva el alto antes de tener la imagen y nada salta cuando llega. Se usan de a dos: aspect-ratio sin object-fit sigue deformando.",
    },
    {
      id: "34-ej-06",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 6,
      prompt:
        "Hacé que la clase 'portada' ocupe todo el ancho con proporción 16 / 9 y sin deformarse: width: 100%, aspect-ratio: 16 / 9 y object-fit: cover.",
      codeTemplate: {
        html: `<img class="portada" src="https://placehold.co/600x900" alt="Portada de la nota" />`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".portada {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  object-fit: cover;\n}",
      validation: { type: "css-rules" },
      hint: "aspect-ratio le da la forma a la caja; sin object-fit la imagen vertical se estira igual para llenarla.",
      explanation:
        "Con la proporción declarada el navegador reserva el alto antes de descargar la imagen y la página no salta. Y cover hace que la foto vertical llene esa caja apaisada recortando en vez de aplastarse.",
    },
    {
      id: "34-ej-07",
      type: "live-editor",
      difficulty: 2,
      xpReward: 20,
      order: 7,
      prompt:
        "La galería muestra las fotos en blanco y negro y las devuelve al color al pasar el mouse. Dale a la clase `.miniatura-gris` filter: grayscale(100%), y a `.miniatura-gris` en :hover filter: grayscale(0%).",
      codeTemplate: {
        html: `<img class="miniatura-gris" src="https://placehold.co/300x200" alt="Miniatura de un proyecto" />`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      targetCSS:
        ".miniatura-gris {\n  filter: grayscale(100%);\n}\n.miniatura-gris:hover {\n  filter: grayscale(0%);\n}",
      validation: { type: "css-rules" },
      hint: "El filtro va en el estado normal y el hover lo apaga. Por ahora el cambio es instantáneo; suavizarlo es cosa del módulo de transiciones, más adelante.",
      explanation:
        "grayscale es el filtro más usado en galerías. Y ojo con filter en general: afecta al elemento entero, hijos incluidos, así que un blur en una tarjeta desenfoca también su texto. El cambio de color acá es instantáneo a propósito: suavizarlo con transition es del módulo de transiciones y animaciones, que viene después.",
    },
    {
      id: "34-ej-08",
      type: "quiz",
      difficulty: 3,
      xpReward: 30,
      order: 8,
      prompt:
        "Tenés que mostrar la foto del producto que el usuario va a comprar. ¿img o background-image, y por qué?",
      options: [
        { id: "a", text: "background-image, porque permite usar cover y position con más control", isCorrect: false },
        { id: "b", text: "Da lo mismo: son dos formas equivalentes de mostrar la misma imagen", isCorrect: false },
        { id: "c", text: "img, porque la imagen es contenido y necesita alt para quien usa un lector de pantalla", isCorrect: true },
        { id: "d", text: "background-image, porque las imágenes de fondo cargan antes", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "La prueba rápida: si al describir la página en voz alta nombrarías esa imagen, no es decoración.",
      explanation:
        "La regla es de significado, no de estilo. Un img tiene alt y un fondo no, así que una imagen que dice algo puesta como fondo simplemente no existe para un lector de pantalla. Y object-fit da el mismo control que cover: el argumento técnico a favor del fondo ya no existe.",
    },
    {
      /**
       * EL RETO INTEGRADOR del modulo. Cierra `imagenes-y-medios` haciendo que
       * el alumno arme una galeria real en UNA sola tarea: la caja con su
       * proporcion, la imagen acomodada adentro, el encuadre corregido y el
       * filtro.
       *
       * No declara `targetCSS`: se deriva de `retoPasos` con `cssEsperadoDe`.
       */
      id: "34-ej-reto",
      type: "live-editor",
      difficulty: 3,
      xpReward: 60,
      order: 9,
      prompt:
        "Mini reto. Armá la galería cumpliendo los cuatro pasos. Ojo con el paso 2: darle forma a la caja no le da forma a la imagen, hacen falta las dos cosas.",
      retoPasos: [
        {
          instruccion:
            "Dale a .tarjeta-foto un ancho del 100% y proporción 4 / 3, para que el navegador reserve el alto antes de que la imagen llegue.",
          esperado: ".tarjeta-foto { width: 100%; aspect-ratio: 4 / 3; }",
        },
        {
          instruccion:
            "Hacé que la imagen llene esa caja sin deformarse, recortando lo que sobre.",
          esperado: ".tarjeta-foto { object-fit: cover; }",
        },
        {
          instruccion:
            "Subí el encuadre a 50% 20%, porque son retratos y el centro corta las caras.",
          esperado: ".tarjeta-foto { object-position: 50% 20%; }",
        },
        {
          instruccion:
            "Poné .tarjeta-foto en blanco y negro con un filtro, y devolvele el color en :hover.",
          esperado:
            ".tarjeta-foto { filter: grayscale(100%); } .tarjeta-foto:hover { filter: grayscale(0%); }",
        },
      ],
      codeTemplate: {
        html: `<div class="galeria"><img class="tarjeta-foto" src="https://placehold.co/400x700" alt="Retrato de una integrante del equipo" /><img class="tarjeta-foto" src="https://placehold.co/900x400" alt="Retrato de un integrante del equipo" /></div>`,
        cssPrefix: "",
        cssSuffix: "",
        blanks: [],
      },
      referenceSolution:
        ".tarjeta-foto {\n  width: 100%;\n  aspect-ratio: 4 / 3;\n  object-fit: cover;\n  object-position: 50% 20%;\n  filter: grayscale(100%);\n}\n.tarjeta-foto:hover {\n  filter: grayscale(0%);\n}",
      validation: { type: "css-rules" },
      hint: "Las dos fotos del ejemplo tienen proporciones opuestas a propósito: una vertical y una apaisada. Si tu solución las deja parejas y sin deformar, funciona.",
      explanation:
        "El reto junta las cuatro ideas. Y la prueba de que está bien resuelto es que las dos fotos, que son de proporciones opuestas, terminan midiendo igual y sin aplastarse: eso es exactamente lo que object-fit hace y lo que fijar ancho y alto a mano no puede.",
    },
  ],
};
