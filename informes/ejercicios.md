# Auditoría de ejercicios — tracks HTML, CSS y JS

**Fecha:** 2026-09-18 · **Alcance:** 82 módulos (`dojo: css` 36, `js` 29, `html` 17) · **652 ejercicios**
**Naturaleza:** análisis de solo lectura. No se modificó ningún archivo del proyecto.

---

## Resumen

| | |
|---|---|
| Ejercicios en alcance | **652** (css 335, js 191, html 126) |
| Ejercicios corridos contra el corrector real | **618** con control positivo |
| Ejercicios con al menos un problema confirmado | **79** |
| Contradicciones prosa ↔ validador | **1** confirmada |
| Ejercicios `css-rules` que rechazan CSS equivalente | **71 de 120** |
| Ejercicios HTML frágiles por corrección por subcadena | **6 de 126** |
| Ejercicios donde el rechazo hunde el puntaje a **0** | **13** (todos mini retos) |

### Cómo se midió, y por qué se le puede creer

Los hallazgos **no se dedujeron leyendo el campo `validation`**. Se midieron ejecutando
`calificar()` de `src/lib/calificar.ts` —el corrector real— sobre cada ejercicio, con el
parser `jsdom` del servidor para los de HTML.

Esto importa porque el `validation` declarado **no siempre es el que corrige**: los 93
`drag-drop` declaran `type: "exact"` y en realidad se corrigen por `correctZone`. Auditar
el dato sin ejecutar el corrector produce hallazgos falsos.

Tres controles respaldan cada número de este informe:

1. **Control positivo.** La respuesta de referencia de cada ejercicio (sus `blanks`,
   su `targetCSS` o su `referenceSolution`) saca 100. Se corrió sobre 618 ejercicios:
   **0 fallas**. Ningún ejercicio del alcance es imposible de aprobar.
2. **Control de tolerancias.** Las equivalencias que el corrector relajó a propósito
   —`background` ↔ `background-color`, comillas en `font-family`— **siguen aceptándose**:
   10 de 10 casos dan 100. Si el arnés de medición estuviera roto, éstas también fallarían.
3. **Descarte manual.** Cada forma "equivalente" se revisó a mano antes de reportarla.
   Se descartaron las que no son realmente equivalentes (ver *Hallazgos descartados*).

### Los 10 peores

| # | Archivo · id | Qué pasa |
|---|---|---|
| 1 | `18-css-grid.ts` · `16-ej-02` | El texto promete que `1fr 1fr 1fr` vale; el regex lo rechaza. **Único caso de prosa que contradice al validador.** |
| 2 | `24-variables-css.ts` · `19-ej-reto` | Mini reto (100 o 0). `#fff` en vez de `#ffffff` → **0**. También `white`/`#ffffff`. |
| 3 | `12-pseudo-elementos.ts` · `08-ej-reto` | Mini reto. `content: ''` con comilla simple → **0**. |
| 4 | `32-tipografia-web.ts` · `32-ej-reto` | Mini reto. Comilla simple en `url()`/`format()` → **0**; `bold` por `700` → **0**. |
| 5 | `11-pseudo-clases.ts` · `07-ej-reto` | Mini reto. Tres familias distintas lo hunden a **0**. |
| 6 | `30-proyecto-cv-css.ts` · `25-ej-reto` | Mini reto **final del track**. `border: solid 3px …` → **0**. |
| 7 | `html-12-accesibilidad.ts` · `html12-ej-08` | Atributos con comilla simple → **63**. HTML válido, nunca se pidió comilla doble. |
| 8 | `html-17-elementos-interactivos.ts` · `html17-ej-02` | Agregar `class` al `<p>` → **50**. |
| 9 | `34-imagenes-y-medios.ts` · `34-ej-reto` | Mini reto. "Devolvele el color" → `filter: none` y `grayscale(0)` dan **0**. |
| 10 | `js-10-objetos.ts` · `js10-ej-03` | El hint pide "un string entre comillas"; `'edad'` da **0**. |

---

## 1. Contradicción prosa ↔ validador

**Un solo caso confirmado en los 652 ejercicios.** Se buscó en todos los `hint` y
`explanation` con marcadores de alternativa ("también podrías", "equivalente", "es lo
mismo que", "o bien"), y cada alternativa citada se ejecutó contra el corrector.

### 1.1 `src/data/modules/18-css-grid.ts` · `16-ej-02` — categoría 1

El texto le promete al alumno una forma que el validador rechaza:

- `hint`: "Usa la función repeat() con 3 repeticiones de 1fr. **También podrias escribir '1fr 1fr 1fr'**."
- `explanation`: "**Es equivalente a escribir '1fr 1fr 1fr'**."
- `validation`: `{ type: "regex", answer: "repeat\\s*\\(\\s*3\\s*,\\s*1fr\\s*\\)" }`

Medido: `repeat(3, 1fr)` → **100**. `1fr 1fr 1fr` → **0**.

**Arreglo propuesto** — aceptar las dos formas que el propio texto declara equivalentes:

```ts
validation: {
  type: "regex",
  answer: "^\\s*(repeat\\s*\\(\\s*3\\s*,\\s*1fr\\s*\\)|1fr\\s+1fr\\s+1fr)\\s*$"
}
```

El anclaje `^…$` además cierra un agujero del regex actual: hoy `test()` no está anclado,
así que `basura repeat(3,1fr) basura` también aprueba.

### 1.2 Casos revisados y descartados

Cuatro candidatos más dispararon la búsqueda y **no son defectos**:

- `08-tipografias.ts` `04-ej-06`: la cita era la palabra castellana "negrita", no una alternativa de código.
- `19-propiedades-logicas.ts` `14-ej-03`: la explicación menciona `'margin-horizontal'` **para decir que no existe**. Rechazarlo es correcto.
- `19-propiedades-logicas.ts` `14-ej-06`: menciona el par longhand como equivalente conceptual, pero el enunciado pide explícitamente el shorthand lógico.
- `25-media-queries.ts` `17-ej-11`: las comillas eran retóricas ("¿entendés esto?").

---

## 2. Validadores más rígidos que el lenguaje

### 2.1 La causa raíz, que es una sola

`compararReglas` (`src/lib/cssRules.ts`) compara **cadenas de declaración normalizadas**.
Normaliza mayúsculas, espacios, comas, comillas de `font-family` y selectores; y tiene
exactamente **una** tabla de equivalencias (`equivalentesDe`), con **un solo par**:
`background` ↔ `background-color` con color literal.

Consecuencia: **toda equivalencia de CSS que no esté en esa tabla se rechaza.** Los 71
ejercicios de abajo no son 71 defectos independientes — son un mecanismo que sólo conoce
una equivalencia, aplicado a un currículum que usa muchas.

**71 de 120 ejercicios `css-rules` rechazan al menos una forma equivalente. 157 rechazos medidos.**

| Familia | Rechazos | Equivalencia |
|---|---|---|
| `padding: 16px` → `padding: 16px 16px 16px 16px` | 48 | Idéntica por definición del shorthand |
| `border: 1px solid #ddd` → `border: solid 1px #ddd` | 24 | `border` no tiene orden fijo |
| `white` → `#ffffff` (y a la inversa) | 21 | Mismo color |
| `padding: 10px 20px` → `padding: 10px 20px 10px 20px` | 19 | Idéntica |
| `margin: 0` → `margin: 0px` | 16 | Idéntica en propiedades de longitud |
| `font-weight: bold` ↔ `700`, `normal` ↔ `400` | 16 | Definición de la especificación |
| Comilla doble → simple en `content`, `url()`, `format()` | 6 | CSS acepta ambas |
| `#ffffff` → `#fff` | 5 | Idéntica |
| `red` → `#ff0000` | 2 | Mismo color |

### 2.2 Los mini retos amplifican el defecto a cero

Un mini reto puntúa **100 o 0** (decisión del 2026-08-28, documentada en `calificar.ts`).
Ahí una sola declaración escrita en su forma equivalente no baja el puntaje: lo borra.

**13 mini retos caen a 0 con CSS correcto:**

`02-ej-reto`, `03-ej-reto`, `11-ej-reto`, `10-ej-reto`, `05-ej-reto`, `06-ej-reto`,
`04-ej-reto`, `07-ej-reto`, `08-ej-reto`, `19-ej-reto`, `17-ej-reto`, `25-ej-reto`, `32-ej-reto`.

Esto pega donde más duele: los mini retos son los que cuentan para el certificado.

### 2.3 Arreglo propuesto

Extender `equivalentesDe` en `src/lib/cssRules.ts`, que ya es el lugar previsto y ya tiene
la disciplina correcta (aceptar lo equivalente, nunca lo inválido). En orden de impacto:

1. **Shorthand de caja con valores repetidos.** Para `margin`/`padding`/`inset` y sus
   variantes lógicas, expandir a 4 valores antes de comparar: `16px` → `16px 16px 16px 16px`,
   `10px 20px` → `10px 20px 10px 20px`. Cierra 67 rechazos.
2. **`border` y sus lados.** Ordenar los tres componentes (ancho / estilo / color) por
   categoría antes de comparar, no por posición. Cierra 24.
3. **Colores.** Canonicalizar a hex de 6 dígitos: `#fff` → `#ffffff`, y la tabla de los
   148 nombres CSS → hex. Cierra 28. **Restricción:** sólo si el valor completo es un
   color literal, con la misma regla que ya usa `esColorSolo`; nunca dentro de `var()`.
4. **`0` ↔ `0px`.** Sólo en propiedades cuyo valor es siempre una longitud. **No** en
   `opacity`, `z-index`, `line-height`, `flex-grow`/`flex-shrink`, `order` — ahí `0px`
   es inválido. Cierra 16.
5. **`font-weight`.** `bold` ↔ `700`, `normal` ↔ `400`. Cierra 16.
6. **Comillas fuera de `font-family`.** Extender la normalización ya existente a `content`,
   `url()` y `format()`. Cierra 6. **Restricción:** normalizar la comilla, no quitarla —
   `content: ""` desaparece si se desnuda, como ya ocurrió y está documentado.

**Cada relajación necesita sus dos controles**, según la regla que ya rige este repo: uno
que pruebe que la forma equivalente ahora pasa, y otro que pruebe que **aflojar de más pone
el guard en rojo**. Sin el segundo, nada impide que mañana la regla se ensanche hasta
aprobar CSS inválido.

### 2.4 HTML — 6 ejercicios corregidos por subcadena ordenada

Los 126 ejercicios de HTML están sanos salvo seis. **24 se corrigen con `html-structure`**,
que parsea el DOM: comillas, orden de atributos y espacios no lo afectan, y están cubiertos
por un guard (`validacion-html.test.ts`) que verifica que su solución de referencia saca 100.

Los **6 `includes-ordered` quedan fuera de ese guard** y son los frágiles:

| Archivo | id |
|---|---|
| `html-10-semantica.ts` | `html10-ej-09` |
| `html-12-accesibilidad.ts` | `html12-ej-08` |
| `html-13-meta-seo.ts` | `html13-ej-08` |
| `html-14-media-avanzado.ts` | `html14-ej-08` |
| `html-17-elementos-interactivos.ts` | `html17-ej-02`, `html17-ej-06` |

Medido en `html12-ej-08`, cuyo `answer` incluye `for="correo"` e `id="correo"`:

- Con comillas dobles → **100**.
- El **mismo HTML con comillas simples** → **63**. El enunciado nunca pide comillas dobles.

Medido en `html17-ej-02`, cuyo `answer` incluye el fragmento `"<p>"`:

- `<p>Lunes a viernes…</p>` → **100**.
- `<p class="horario">Lunes a viernes…</p>` → **50**. Agregar un atributo rompe el fragmento.

**Arreglo propuesto:** migrar los 6 a `html-structure`, que ya existe y ya resuelve esto.
Por ejemplo, `html17-ej-02`:

```ts
validation: {
  type: "html-structure",
  answer: ["details > summary", "details > summary :: Horario de atención", "details > p"]
}
```

Y `html12-ej-08`:

```ts
validation: {
  type: "html-structure",
  answer: ["img[alt]", "button[aria-label]", "label[for=\"correo\"]", "input#correo"]
}
```

Además, agregarlos al guard de solución de referencia: hoy `validacion-html.test.ts`
filtra por `validation.type === "html-structure"`, así que **los seis ejercicios más
frágiles del track son exactamente los que ningún control cubre**.

### 2.5 JS — un solo caso

El track JS tiene **191 ejercicios, de los cuales 143 son quiz y 11 drag-drop**: sólo 37
piden escribir. De esos, uno rechaza JavaScript equivalente:

**`js-10-objetos.ts` · `js10-ej-03`**

- `prompt`: "Completa para acceder a la propiedad 'edad' usando notación de corchetes:"
- `hint`: "La clave debe ir como **string entre comillas**."
- `validation`: `{ type: "exact", answer: "\"edad\"" }`

Medido: `"edad"` → 100, `'edad'` → **0**. El hint dice "entre comillas" sin decir cuáles, y
en JavaScript las dos son el mismo string.

**Arreglo propuesto:**

```ts
validation: { type: "regex", answer: "^\\s*['\"`]edad['\"`]\\s*$" }
```

Se probaron además variantes de `function`→arrow, espaciado y comas en los 37 ejercicios
de escritura: **ninguna otra rechaza forma equivalente**.

### 2.6 Un caso de rigidez que nace del enunciado

**`34-imagenes-y-medios.ts` · `34-ej-reto`** (mini reto, 100 o 0). El paso 4 dice:

> "Poné .tarjeta-foto en blanco y negro con un filtro, y **devolvele el color** en `:hover`."

El target espera `filter: grayscale(0%)`. Medido:

- `filter: grayscale(0%)` → **100**
- `filter: grayscale(0)` → **0** (valor idéntico en CSS)
- `filter: none` → **0** (lectura más natural de "devolvele el color")

**Arreglo propuesto:** aceptar las tres en el paso, o reformular el paso a
"volvé el filtro a `grayscale(0%)`" para que la instrucción determine una sola respuesta.

---

## 3. Enunciados incompletos

**No se encontró evidencia sistemática, y conviene decirlo explícitamente.**

Se comparó cada declaración exigida por los 120 ejercicios `css-rules` contra todo lo que
el alumno puede ver (`prompt`, pasos del reto, `codeTemplate`, `hint`). El detector marcó
43 ejercicios; **al leerlos uno por uno, casi todos resultaron falsos positivos míos**: los
enunciados sí dicen los valores, en prosa castellana o con otro espaciado.

Ejemplos de lo que el detector marcó mal:

- `03-ej-06`: marcó `border: 2px solid gray` como no anunciado. El enunciado dice
  "borde de 2px solido gris (gray)".
- `20-ej-07`: marcó `box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1)`. El enunciado lo dice
  literal, escrito `rgba(0,0,0,0.1)` — y el corrector normaliza ese espaciado.
- `04-ej-reto`: marcó `font-family: Georgia, serif`. El paso dice "Dale a .nota la familia
  Georgia con serif como respaldo".

En los retos integradores, **no nombrar la propiedad es deliberado**: el paso describe el
efecto en castellano y el alumno elige la propiedad. Eso es el ejercicio, no un hueco.

Lo que sí queda es el riesgo **derivado**: cuando el enunciado describe el resultado en
prosa, admite varias escrituras correctas, y el validador acepta una sola. Ese problema ya
está contado en la sección 2 — es la misma causa raíz, vista desde el enunciado.

**El único enunciado con un hueco real es `34-ej-reto`, documentado en 2.6.**

---

## 4. Incoherencias internas

### 4.1 Los prefijos de `id` NO son un error

El `16-ej-02` dentro de `18-css-grid.ts` llama la atención, pero **es sistemático y
consistente**: 33 de los 82 módulos tienen ids con un prefijo distinto de su `order`, y en
**los 33 el prefijo es único dentro del módulo**. No hay un solo módulo con ids mezclados.

Los prefijos codifican un orden anterior del track, que cambió cuando se reorganizó en
secciones. **No afecta al alumno ni a la corrección.** Renumerarlos rompería el progreso
guardado de quienes ya completaron ejercicios, que se referencia por `id`. Recomendación:
**dejarlos como están** y, si molesta, documentar la convención en un comentario.

### 4.2 Lo que está limpio

Verificado sobre los 652 ejercicios, sin hallazgos:

- **0** `order` duplicados o salteados dentro de un módulo.
- **0** quizzes con más de una opción correcta, o con ninguna.
- **0** desajustes entre la cantidad de `blanks` y la de respuestas esperadas.
- **0** ejercicios `code-completion` sin `blanks`.
- **0** ejercicios imposibles: los 618 con respuesta de referencia sacan 100.

### 4.3 Sesgo de longitud en los quizzes — observación, no defecto

**94 de 323 quizzes (29%)** tienen la respuesta correcta como la opción más larga, con más
del doble de caracteres que la más corta (css 35, js 46, html 13).

Es una heurística, no una prueba: en preguntas conceptuales la respuesta correcta suele
necesitar más palabras ("El outline no forma parte del Box Model y no afecta las
dimensiones"). Pero un alumno apurado puede acertar por forma y no por contenido.

**Sugerencia, de baja prioridad:** al revisar quizzes nuevos, emparejar el largo de los
distractores con el de la correcta. No amerita tocar los 94 existentes.

### 4.4 Punto y coma dentro de un blank

En **107 ejercicios `code-completion`**, escribir el valor con `;` al final da 0. En **13**
de ellos el `cssSuffix` ya aporta el `;`, con lo cual el alumno produciría `;;`.

Es ergonomía, no equivalencia: el `;` tecleado de más es un desliz del alumno, no otra forma
de escribir lo mismo. **Sugerencia:** recortar un `;` final en la respuesta antes de comparar,
en el componente de entrada. Prioridad baja.

---

## Hallazgos descartados (y por qué)

Se descartan explícitamente para que nadie los "arregle" después:

1. **`29-tailwind.ts` · `24-ej-reto`.** Mi primera corrida lo marcó como imposible: su
   solución de referencia sacaba 0 en los 4 pasos. **Era mi arnés**, que corría sin parser
   de HTML. Con el `jsdom` del servidor saca **100**. El ejercicio está bien.
2. **`17-flexbox.ts` · `15-ej-06`.** `flex: 0 0 250px` → `0px 0px 250px` da 0, y está bien:
   `flex-grow` y `flex-shrink` son números, `0px` ahí es inválido.
3. **`js-02-variables-tipos.ts` · `js02-ej-03`.** `const` → `let` da 0, y está bien: el
   enunciado dice "Declara una **constante**".
4. **`opacity: 0` → `0px`** y similares: inválido, no equivalente. Excluidos de la familia
   `0 ↔ 0px` de la sección 2.
5. **`background` ↔ `background-color` y comillas en `font-family`.** Ya están resueltos en
   `cssRules.ts`; se verificó que siguen funcionando (10/10).

---

## Hasta dónde llegué

**Cubierto:**

- Los 82 módulos y 652 ejercicios de `css`, `js` y `html`, cargados desde los archivos de
  datos y ejecutados contra el corrector real.
- Control positivo sobre 618 de los 652. Los 34 restantes se reparten así: **4** son
  `js-behavior` (corren en un Web Worker, sin equivalente fuera del navegador) y **30** no
  declaran solución de referencia en el archivo de datos — 24 `html-structure` y 6
  `includes-ordered`. Los 24 `html-structure` **sí** tienen su solución de referencia en
  `validacion-html.test.ts`, que verifica que sacan 100; los 6 `includes-ordered` no la
  tienen en ningún lado (ver 2.4).
- Barrido de equivalencias sobre los 120 `css-rules` y los 37 ejercicios de escritura de JS.
  En HTML se probaron a mano los 6 `includes-ordered`, que son los frágiles.
- Lectura manual de los 43 candidatos a enunciado incompleto y de los 5 a contradicción.

**No cubierto, y por qué:**

- **Los 4 ejercicios `js-behavior`** (`validation.type: "js-behavior"`): se corrigen
  ejecutando el código del alumno en un Web Worker. Evaluarlos exige un navegador, y este
  informe es lectura de archivos. Su `referenceSolution` y sus `cases` están declarados.
- **La calidad pedagógica del contenido** —si una lección explica bien, si el orden de los
  módulos es el mejor— está fuera del encargo.
- **Los tracks `react`, `react-eco` y `nextjs`** (210 ejercicios) no entraban en el alcance.
  Nota al margen medida de paso: los tres son **100% `exact`**, sin una sola validación
  estructural. Si se audita algo después, es ahí.
- **El sesgo de longitud en quizzes** se midió con una heurística de caracteres, no leyendo
  las 323 preguntas. El número 94 es una señal para revisar, no una lista de defectos.

---

## Apéndice — los 71 ejercicios `css-rules` con formas equivalentes rechazadas

Ordenados por peor puntaje medido. "Peor score" es lo que saca un alumno que escribe CSS
correcto en la forma indicada.

| Archivo | id | Peor score | Formas equivalentes rechazadas | Ejemplo medido |
|---|---|---|---|---|
| `02-selectores.ts` | `02-ej-reto` | 0 | border: reordenado (valido); 1 valor -> 4 valores | `border: 1px solid #ddd  ->  border: solid 1px #ddd` |
| `03-propiedades-basicas.ts` | `03-ej-reto` | 0 | border: reordenado (valido); 1 valor -> 4 valores | `border: 1px solid #ffeaa7  ->  border: solid 1px #ffeaa7` |
| `04-box-model.ts` | `11-ej-reto` | 0 | border: reordenado (valido); 1 valor -> 4 valores | `border: 4px solid #333  ->  border: solid 4px #333` |
| `05-unidades-css.ts` | `10-ej-reto` | 0 | 1 valor -> 4 valores | `padding: 2rem  ->  padding: 2rem 2rem 2rem 2rem` |
| `06-dimensiones.ts` | `05-ej-reto` | 0 | 1 valor -> 4 valores | `padding: 24px  ->  padding: 24px 24px 24px 24px` |
| `08-tipografias.ts` | `04-ej-reto` | 0 | 700 -> bold | `font-weight: 700  ->  font-weight: bold` |
| `10-selectores-descendientes.ts` | `06-ej-reto` | 0 | 1 valor -> 4 valores | `padding: 12px  ->  padding: 12px 12px 12px 12px` |
| `11-pseudo-clases.ts` | `07-ej-reto` | 0 | 700 -> bold; border: reordenado (valido); 1 valor -> 4 valores | `font-weight: 700  ->  font-weight: bold` |
| `12-pseudo-elementos.ts` | `08-ej-reto` | 0 | comilla doble -> simple | `content: ""  ->  content: ''` |
| `24-variables-css.ts` | `19-ej-reto` | 0 | hex largo -> corto; #ffffff -> white; white -> #ffffff; 1 valor -> 4 valores | `--fondo: #ffffff  ->  --fondo: #fff` |
| `25-media-queries.ts` | `17-ej-reto` | 0 | 1 valor -> 4 valores | `padding: 16px  ->  padding: 16px 16px 16px 16px` |
| `30-proyecto-cv-css.ts` | `25-ej-reto` | 0 | border: reordenado (valido); 1 valor -> 4 valores | `border-bottom: 3px solid var(--cv-acento)  ->  border-bottom: solid 3px var(--cv-acento)` |
| `32-tipografia-web.ts` | `32-ej-reto` | 0 | comilla doble -> simple; 700 -> bold | `src: url("/fuentes/nota-400.woff2") format("woff2")  ->  src: url('/fuentes/nota-400.woff2') format('woff2')` |
| `02-selectores.ts` | `02-ej-08` | 50 | red -> #ff0000 | `color: red  ->  color: #ff0000` |
| `10-selectores-descendientes.ts` | `06-ej-06` | 50 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `11-pseudo-clases.ts` | `07-ej-06` | 50 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `13-attribute-selectors.ts` | `28-ej-05` | 50 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `07-math-functions.ts` | `26-ej-03` | 67 | 1 valor -> 4 valores | `padding: 16px  ->  padding: 16px 16px 16px 16px` |
| `09-advanced-text.ts` | `27-ej-07` | 67 | red -> #ff0000 | `text-decoration: underline wavy red 2px  ->  text-decoration: underline wavy #ff0000 2px` |
| `11-pseudo-clases.ts` | `07-ej-10` | 67 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `13-attribute-selectors.ts` | `28-ej-07` | 67 | border: reordenado (valido); 1 valor -> 4 valores | `border: 1px solid #ccc  ->  border: solid 1px #ccc` |
| `20-lists-and-tables.ts` | `29-ej-04` | 67 | border: reordenado (valido); 1 valor -> 4 valores | `border: 1px solid #ccc  ->  border: solid 1px #ccc` |
| `26-sass-fundamentos.ts` | `21-ej-09` | 67 | 1 valor -> 4 valores | `padding: 16px  ->  padding: 16px 16px 16px 16px` |
| `27-sass-avanzado.ts` | `22-ej-09` | 67 | white -> #ffffff; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `33-herencia-valores-globales.ts` | `33-ej-02` | 67 | 1 valor -> 4 valores | `padding: 16px  ->  padding: 16px 16px 16px 16px` |
| `03-propiedades-basicas.ts` | `03-ej-07` | 75 | white -> #ffffff; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `06-dimensiones.ts` | `05-ej-08` | 75 | 0 -> 0px; 2 valores -> 4 valores; 1 valor -> 4 valores | `margin: 0 auto  ->  margin: 0px auto` |
| `07-math-functions.ts` | `26-ej-07` | 75 | 0 -> 0px; 2 valores -> 4 valores | `margin: 0 auto  ->  margin: 0px auto` |
| `22-transforms.ts` | `30-ej-04` | 75 | 1 valor -> 4 valores | `padding: 20px  ->  padding: 20px 20px 20px 20px` |
| `25-media-queries.ts` | `17-ej-05` | 75 | white -> #ffffff; 1 valor -> 4 valores | `color: white  ->  color: #ffffff` |
| `26-sass-fundamentos.ts` | `21-ej-10` | 75 | white -> #ffffff; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `27-sass-avanzado.ts` | `22-ej-10` | 75 | border: reordenado (valido) | `border: 2px solid seagreen  ->  border: solid 2px seagreen` |
| `31-overflow.ts` | `31-ej-02` | 75 | hex largo -> corto; border: reordenado (valido); 1 valor -> 4 valores | `border: 1px solid #cccccc  ->  border: 1px solid #ccc` |
| `32-tipografia-web.ts` | `32-ej-06` | 75 | comilla doble -> simple | `src: url("/fuentes/mifuente.woff2") format("woff2")  ->  src: url('/fuentes/mifuente.woff2') format('woff2')` |
| `33-herencia-valores-globales.ts` | `33-ej-06` | 75 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `03-propiedades-basicas.ts` | `03-ej-06` | 80 | white -> #ffffff; border: reordenado (valido); 1 valor -> 4 valores | `color: white  ->  color: #ffffff` |
| `04-box-model.ts` | `11-ej-05` | 80 | border: reordenado (valido); 1 valor -> 4 valores | `border: 3px solid #333  ->  border: solid 3px #333` |
| `06-dimensiones.ts` | `05-ej-03` | 80 | 1 valor -> 4 valores | `padding: 20px  ->  padding: 20px 20px 20px 20px` |
| `10-selectores-descendientes.ts` | `06-ej-08` | 80 | white -> #ffffff; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `11-pseudo-clases.ts` | `07-ej-08` | 80 | bold -> 700; border: reordenado (valido); 1 valor -> 4 valores | `font-weight: bold  ->  font-weight: 700` |
| `26-sass-fundamentos.ts` | `21-ej-11` | 80 | border: reordenado (valido); bold -> 700; 1 valor -> 4 valores | `border-left: 4px solid #e74c3c  ->  border-left: solid 4px #e74c3c` |
| `30-proyecto-cv-css.ts` | `25-ej-09` | 80 | 0 -> 0px; 2 valores -> 4 valores | `padding: 0 16px  ->  padding: 0px 16px` |
| `05-unidades-css.ts` | `10-ej-08` | 83 | white -> #ffffff; 0 -> 0px; 2 valores -> 4 valores; 1 valor -> 4 valores | `color: white  ->  color: #ffffff` |
| `06-dimensiones.ts` | `05-ej-07` | 83 | border: reordenado (valido); white -> #ffffff; 1 valor -> 4 valores; 2 valores -> 4 valores | `border: 1px solid #ccc  ->  border: solid 1px #ccc` |
| `08-tipografias.ts` | `04-ej-07` | 83 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `12-pseudo-elementos.ts` | `08-ej-06` | 83 | comilla doble -> simple | `content: ""  ->  content: ''` |
| `12-pseudo-elementos.ts` | `08-ej-08` | 83 | bold -> 700 | `font-weight: bold  ->  font-weight: 700` |
| `15-float-display.ts` | `13-ej-05` | 83 | 0 -> 0px | `margin: 0 15px 10px 0  ->  margin: 0px 15px 10px 0px` |
| `21-shadows-gradients-filters.ts` | `20-ej-05` | 83 | 1 valor -> 4 valores | `padding: 24px  ->  padding: 24px 24px 24px 24px` |
| `24-variables-css.ts` | `19-ej-05` | 83 | border: reordenado (valido) | `border: 2px solid var(--color-primario)  ->  border: solid 2px var(--color-primario)` |
| `27-sass-avanzado.ts` | `22-ej-11` | 83 | 1 valor -> 4 valores | `margin: 8px  ->  margin: 8px 8px 8px 8px` |
| `05-unidades-css.ts` | `10-ej-06` | 86 | 0 -> 0px; 2 valores -> 4 valores; 1 valor -> 4 valores | `margin: 0 auto  ->  margin: 0px auto` |
| `21-shadows-gradients-filters.ts` | `20-ej-07` | 86 | white -> #ffffff; 0 -> 0px; 1 valor -> 4 valores | `background: white  ->  background: #ffffff` |
| `30-proyecto-cv-css.ts` | `25-ej-03` | 86 | 0 -> 0px; border: reordenado (valido); 2 valores -> 4 valores | `margin: 0 auto  ->  margin: 0px auto` |
| `30-proyecto-cv-css.ts` | `25-ej-06` | 86 | border: reordenado (valido); 1 valor -> 4 valores | `border: 1px solid #e5e5e5  ->  border: solid 1px #e5e5e5` |
| `32-tipografia-web.ts` | `32-ej-08` | 86 | 700 -> bold; hex largo -> corto | `font-weight: 700  ->  font-weight: bold` |
| `16-posicionamiento.ts` | `12-ej-04` | 88 | white -> #ffffff; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `04-box-model.ts` | `11-ej-06` | 89 | border: reordenado (valido); 1 valor -> 4 valores | `border: 2px solid #666  ->  border: solid 2px #666` |
| `15-float-display.ts` | `13-ej-07` | 89 | white -> #ffffff; 2 valores -> 4 valores; 1 valor -> 4 valores | `color: white  ->  color: #ffffff` |
| `17-flexbox.ts` | `15-ej-04` | 89 | white -> #ffffff; 1 valor -> 4 valores | `color: white  ->  color: #ffffff` |
| `30-proyecto-cv-css.ts` | `25-ej-07` | 89 | border: reordenado (valido); 1 valor -> 4 valores | `border-bottom: 2px solid #ddd  ->  border-bottom: solid 2px #ddd` |
| `25-media-queries.ts` | `17-ej-07` | 90 | white -> #ffffff; 1 valor -> 4 valores | `color: white  ->  color: #ffffff` |
| `30-proyecto-cv-css.ts` | `25-ej-04` | 90 | hex largo -> corto | `color: #0066cc  ->  color: #06c` |
| `30-proyecto-cv-css.ts` | `25-ej-08` | 90 | 0 -> 0px; border: reordenado (valido); 1 valor -> 4 valores | `margin: 0  ->  margin: 0px` |
| `18-css-grid.ts` | `16-ej-07` | 91 | white -> #ffffff; bold -> 700 | `color: white  ->  color: #ffffff` |
| `23-transiciones-animaciones.ts` | `18-ej-07` | 91 | white -> #ffffff; 0 -> 0px; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `30-proyecto-cv-css.ts` | `25-ej-02` | 91 | 0 -> 0px; 1 valor -> 4 valores | `margin: 0  ->  margin: 0px` |
| `17-flexbox.ts` | `15-ej-07` | 92 | white -> #ffffff; bold -> 700; 2 valores -> 4 valores | `color: white  ->  color: #ffffff` |
| `16-posicionamiento.ts` | `12-ej-07` | 94 | border: reordenado (valido); white -> #ffffff; 1 valor -> 4 valores | `border: 1px solid #ddd  ->  border: solid 1px #ddd` |
| `24-variables-css.ts` | `19-ej-07` | 94 | hex largo -> corto; #ffffff -> white; white -> #ffffff; 1 valor -> 4 valores; 2 valores -> 4 valores | `--fondo: #ffffff  ->  --fondo: #fff` |
| `30-proyecto-cv-css.ts` | `25-ej-10` | 94 | 0 -> 0px; 1 valor -> 4 valores; 2 valores -> 4 valores | `margin: 0  ->  margin: 0px` |