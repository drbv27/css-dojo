# Estado del proyecto

Punto de retomada. Última actualización: 2026-08-06, `main` @ `8743d8a`.

> **Ojo al retomar:** los PRs #28 y #29 están abiertos y **completos**, con los
> cinco gates verdes localmente. Lo único que falta es que corra el CI: GitHub
> tuvo un incidente declarado de Actions ("Major Outage", 6 de agosto) y seis
> corridas quedaron canceladas sin ejecutar un solo paso. **#28 tiene que
> mergearse ANTES que #29** — el contenido de #29 depende del componente de #28,
> y al revés los ejercicios se corregirían con score 0 siempre.

> Este archivo existe para que una sesión nueva no tenga que redescubrir nada. Si
> hacés cambios grandes, actualizalo o borralo — un documento desactualizado es
> peor que ninguno.

---

## Cómo continuar en un chat nuevo

La memoria del proyecto vive en **Engram** (45+ observaciones, scope `css-dojo`).
Se carga sola al arrancar la sesión, pero conviene pedirla explícitamente.

Ojo con la búsqueda: por defecto exige que **todos** los términos coincidan. Si
no encontrás nada, usá `match_mode: "any"`.

Los artefactos de planificación SDD están en `openspec/changes/` y además
espejados en Engram por `topic_key`.

---

## Qué se hizo (27 PRs mergeados y deployados, 2 esperando CI)

| Cambio | Qué resolvió |
|---|---|
| `automated-gates` (PR #1, #2) | `npm run lint` estaba **roto** desde el paso a Next 16 (`next lint` fue eliminado). Se agregó config flat de ESLint, `typecheck`, Vitest, Playwright y CI en GitHub Actions. Se arreglaron 11 errores de React. |
| PR #3 | El CI validaba en Node 24 mientras producción compila en **Node 22**. Alineado, y se agregó `engines.node`. |
| `loader-moderno-dojo` (PR #4) | El loader del landing: anillo determinado atado al progreso real de los `.glb`, anuncios `aria-live`, y salida al landing estático si un asset falla (antes el overlay quedaba para siempre). |
| Validación de ejercicios (PR #5) | **61 ejercicios se aprobaban sin hacerlos.** Se reemplazó búsqueda de substrings por parseo real: `css-rules` y `html-structure`. |
| Track CSS (PR #6, #7, #8) | Proyecto integrador (módulo 25), reorden pedagógico, y un ejercicio que pedía flexbox diez módulos antes de enseñarlo. |
| PR #9 | Este archivo, más los 15 artefactos de `openspec/` que estaban sin commitear. |
| PR #10 | **El proyecto integrador de CSS no se podía activar ni desactivar.** El panel docente filtraba por su propia lista de categorías, que no incluía `project`. La causa no era la línea faltante: la lista estaba **duplicada** entre la vista del alumno y la del docente. Ahora hay fuente única en `src/data/moduleCategories.ts`. |
| PR #11 | El proyecto final de HTML se renderizaba **penúltimo**, aunque el propio módulo dice "ejercicio integrador de cierre". Categoría nueva `html-projects`. |
| CSS moderno (PR #12, #13, #14) | Las 8 técnicas ausentes, distribuidas en el módulo que le corresponde a cada una. Ver abajo. |
| PR #15 | Actualización de este archivo hasta el #14. |
| Ortografía (PR #16, #17, #18) | **503 preguntas sin abrir y ~3.460 palabras sin tilde ni ñ, en 101 módulos de los seis tracks.** Ver abajo. |
| PR #19 | Actualización de este archivo tras la ortografía. |
| PR #20 | **Los módulos de Sass enseñaban un preprocesador sin mostrar nunca el CSS compilado.** 16 ejercicios entre los dos, ninguno de escribir. Sin compilador en el proyecto, se invirtió: el enunciado muestra el Sass y el alumno escribe el CSS que produce. |
| PR #21, #22, #23 | **13 módulos se aprobaban sin producir nada** — solo quiz y arrastrar. Ahora ninguno: js/ts, react-eco y nextjs tienen `code-completion`. El test pasó de medir a prohibir. |
| PR #24 | Planificación SDD completa de `js-behavior-validator`. |
| PR #25, #26, #27 | El validador de JavaScript: motor, plomería, y el pivote a Web Worker. Ver abajo. |

Tres bugs que veían los usuarios y ya no: el loop infinito contra el endpoint de
OTP en el reset de contraseña, el rango de 0 XP que veían todos en el nav móvil,
y un timer filtrado en los juegos.

### CSS moderno: dónde quedó cada técnica

Se decidió **distribuir** en vez de crear un módulo "CSS moderno" aparte. El
argumento: `:where()` fuera de la lección de especificidad es trivia; adentro es
la respuesta al problema que el alumno ya está teniendo.

| Técnica | Módulo (orden) |
|---|---|
| `text-align` | Tipografías (6) |
| `aspect-ratio` | Dimensiones (7) |
| `:has()` | Pseudo-clases (9) |
| `:is()`, `:where()` | Especificidad (11) |
| `@layer` | Especificidad (11) |
| `subgrid` | CSS Grid (16) |
| `@container`, `@supports` | Media Queries (17) |

`text-align` era el peor caso: **21 usos en el track y cero enseñanza**. El
módulo destino se eligió midiendo — el uso más temprano está en orden 7, así que
Tipografías (6) no deja ninguna referencia hacia adelante.

En Especificidad, "Buenas prácticas" pasó a ser la última lección (orden 6): una
lección de buenas prácticas tiene que venir después de las herramientas que
recomienda. Su lista de conflictos ahora arranca por `@layer` y `:where()`, y
marca la duplicación de clases (`.btn.btn`) como el truco que es.

### Ortografía: cómo se hizo, y qué NO se toca

Tres slices por mecanismo, no por track. `¿` (503), palabras inequívocas
(3.031) y palabras dependientes de contexto (430).

**El método, que sirve para cualquier edición masiva de contenido.** El riesgo
no era una tilde mal puesta: era tocar un `targetCSS` o un token de validación y
romper ejercicios en silencio. Antes de editar se snapshotea a un archivo todo
lo intocable — ejemplos de código, bloques y código en línea, `targetCSS`,
`codeTemplate`, `validation`, ids, `dragItems`, `dropZones`, xp, dificultad,
orden — y después se compara. Las tres PRs cerraron byte a byte idénticas.

Ese snapshot cazó **cuatro filtraciones reales** que ya estaban aplicadas:
`description:` y `title:` son claves de prosa pero también aparecen **dentro de
ejemplos de código**, y un `re.sub` sin máscara se mete en los comentarios CSS
de los ejemplos.

**Trampa del fuente:** dentro de un template literal los backticks del markdown
vienen **escapados** (`` \` ``). Buscar tres backticks crudos no encuentra
ningún bloque de código, y entonces el `?` de un ternario de JavaScript parece
una pregunta. El track de JS además escribe los enunciados con **comilla
simple**, porque el texto lleva comillas dobles adentro.

**Reglas del idioma que hay que respetar:**

- Los plurales de agudas en `-n`/`-s` **pierden** la tilde: `función` →
  `funciones`, `común` → `comunes`, `botón` → `botones`. Las esdrújulas la
  conservan: `código` → `códigos`. El corpus ya tenía 102 `funciones` correctas.
- **`solo` no lleva tilde nunca** desde la reforma de 2010, ni como adverbio.
  Sus 298 apariciones ya estaban bien.
- `esta` ante sustantivo es demostrativo y va **sin** tilde. El pronombre
  tampoco (`esta es la que gana`).
- Las **mayúsculas llevan tilde**: `MÁS USADAS`, `FUNCIÓN`.

**Lo que quedó sin tocar a propósito:** los strings en castellano **dentro de
ejemplos de código** (`<p>Este parrafo TAMBIEN es seleccionado</p>`, el chat que
dice `'Hola! Como estas?'`). Se le muestran al alumno y la tilde sería correcta,
pero viven en `codeExample`, y un invariante que dice "el código no se toca" no
vale nada con excepciones. Es un pase aparte si se quiere hacer.

### El validador de JavaScript: por qué es un Web Worker

Los tracks de JS, React, react-eco y Next.js no tenían **ningún** ejercicio de
escribir código, porque la corrección no tenía forma de verificar JavaScript.
Solo dos validadores son estructurales: `css-rules` y `html-structure`.

Se descartó el AST: **verifica la forma del código, no si funciona**, que es el
mismo defecto que el PR #5 sacó. Y ningún parser sirve en el navegador — el único
que hay es `typescript`, ~7MB.

El enfoque es **correr el código** contra casos declarados y puntuar
`pasados/total`:

```ts
validation: { type: "js-behavior", cases: [{ call: "sumar(1, 2)", expect: 3 }] }
referenceSolution: "function sumar(a, b) { return a + b; }"
```

**Empezó en el iframe de la vista previa y ese diseño era equivocado.** Un iframe
`srcdoc` **comparte hilo con su página**, así que un `while (true)` del alumno
congelaba React, el deadline y la pestaña entera. Medido con un contador en el
padre: tickea antes de inyectar el marco y después `page.evaluate` no vuelve. La
restricción "el bucle se abandona con timeout" era falsa: el padre también está
congelado.

Por eso el ejecutor es un **Web Worker**: hilo propio, la página nunca se
bloquea, y `terminate()` mata de verdad. **No lo muevas de vuelta al iframe.**

Dos cosas que NO hay que "simplificar", las dos con comentario en el código:

- **El harness embebe el código del alumno** y lo evalúa con `new Function` en su
  propio cuerpo. Un `const` en el tope de un script no es global, así que con el
  código cargado aparte, `const sumar = ...` daría "sumar is not defined" mientras
  funciona perfecto en la vista previa.
- **La comparación vive en el padre**, no en el harness, para que las semánticas
  estén en el módulo con tests y no dentro de un string de código inyectado.

**Costo aceptado:** un worker no tiene DOM, así que los ejercicios de manipular
el DOM (`js-dom`) no se pueden corregir así y siguen con `code-completion`.

**Límite que sigue abierto:** la corrección es del lado del cliente, así que los
valores esperados viajan al navegador y un alumno decidido puede leerlos y
hardcodear. Cerrarlo requiere ejecución en el servidor — que además cierra la
deuda vieja de corrección inspeccionable. Es **el** follow-up.

---

## Cosas que te van a morder si no las sabés

**`.env.local` apunta a MongoDB Atlas de PRODUCCIÓN** (35 usuarios reales, 4.460
registros de progreso). `npm run dev` escribe ahí. Para QA con base:

```bash
docker run -d --name css-dojo-qa-mongo -p 27019:27017 mongo:7
MONGODB_URI="mongodb://127.0.0.1:27019/cssdojo-qa" npm run dev
```

Next.js no sobreescribe variables ya presentes en el entorno, así que el override
gana. El puerto 27018 lo usa otro proyecto. Los módulos vienen **deshabilitados**
en una base nueva: insertá en `modulesettings` o hacé al usuario `teacher`.

**Los slugs no coinciden con los nombres de archivo, ni con el orden.**
`11-box-model.ts` es el módulo 4. `23-bootstrap.ts` tiene slug `bootstrap-5`.
`02-selectores.ts` es `selectores`. La URL es `/modulos/<slug>/ejercicio/<id>`.

**Nada ordena por el campo `order` a nivel módulo.** La página agrupa por
`category` y solo ordena por posición del array dentro de cada grupo. Mover un
módulo sin mover su categoría **no cambia nada en pantalla**. Hay un test que lo
verifica. El `order` del módulo solo alimenta el badge `#NN` de la tarjeta.

Las **categorías por dojo viven en `src/data/moduleCategories.ts`**, y tanto la
vista del alumno como el panel docente leen de ahí. Antes cada una tenía su copia
y se desincronizaron: un módulo con categoría no listada **no se renderiza y no
hay ningún error**. Si agregás una categoría, va ahí. `categorias-panel.test.ts`
falla si algún módulo queda inalcanzable.

**Cada dojo necesita su propia categoría de proyecto** (`project` para CSS,
`html-projects`, `js-projects`, `react-projects`). No se pueden compartir: un test
exige que ninguna categoría aparezca en dos dojos.

**El `order` de lecciones y ejercicios sí ordena**, y si dos comparten número el
resultado lo decide la posición en el array, en silencio. Hay un test que lo
prohíbe.

**`fd` y `sd` no están instalados** aunque las reglas del proyecto los asumen, y
`fd` falla en silencio con stderr suprimido. Usá `rg --files | rg <patrón>`.

**Producción corre Node 22**, fijado por `NIXPACKS_NODE_VERSION` en Coolify.

**Deploy**: Coolify + Nixpacks en VPS, **manual** desde la interfaz después de
pushear. No hay config de deploy en el repo. Live en https://www.devdojo.pro

---

## Los gates

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint . -- debe dar 0 errores (50 warnings es el baseline)
npm run build
npm run test:run     # 160 tests
npm run test:e2e     # Playwright chromium, 5 tests
```

Los cinco corren en CI en cada push a `main` y cada PR.

### Tests que protegen los datos, no el código

Estos son los que impiden que la deuda vuelva:

- `src/data/modules/validacion-curriculum.test.ts` — ningún ejercicio CSS puede
  aprobarse escribiendo la respuesta como prosa; cada `targetCSS` se valida
  contra sí mismo al 100%.
- `src/data/modules/validacion-html.test.ts` — lleva una **solución de referencia
  para los 20** ejercicios HTML y exige que cada una dé 100%. Sin eso, un
  selector demasiado estricto deja un ejercicio imposible y parece culpa del
  alumno.
- `src/data/modules/orden-curriculum-css.test.ts` — reconstruye la secuencia **como
  se ve en pantalla** y la compara con `order`; y ningún ejercicio puede exigir
  una técnica enseñada más de 3 módulos después. Además **mide** la deuda restante
  en lecciones con un umbral de 24. Ese número **nunca se sube**: si sube, alguien
  introdujo una referencia hacia adelante nueva. Ya frenó un caso real.
- `src/data/modules/categorias-panel.test.ts` — ningún módulo puede tener una
  categoría inalcanzable, y el recorrido de categorías de cada dojo tiene que dar
  exactamente la cantidad de módulos de ese dojo. Ese conteo es el que caza el
  bug del PR #10 (24 tarjetas contra un denominador de 25). También exige que el
  proyecto de cierre sea la última categoría del track, con `order` mayor a todo
  módulo de contenido. `js` está excluido a propósito: enseña TypeScript después
  de sus proyectos, y eso es una decisión de curriculum.
- `src/data/modules/orden-lecciones.test.ts` — los `order` de lecciones y
  ejercicios son únicos y van de 1 a n, en los seis tracks.
- `src/data/modules/signos-interrogacion.test.ts` — hay un `¿` por cada `?` que
  cierra oración, y ningún `¿` queda pegado a una palabra o a código. Cuenta
  sobre prosa con el código enmascarado, porque en JS y React el `?` es un
  operador (ternario, `?.`, `??`) y contarlo como pregunta pide abrir algo que no
  lo es.
- `src/data/modules/validacion-js.test.ts` — **corre** cada solución de
  referencia contra sus propios casos. No las compara consigo mismas: eso es
  tautológico y no puede detectar una expectativa que nadie puede satisfacer, que
  es exactamente cómo pasó un `targetCSS` mal formado con el que el CSS correcto
  sacaba 33%. Trae además tres fixtures que prueban que su evaluador distingue
  bien de mal, porque sin ellos los loops pasarían vacíos.
- `src/lib/jsBehavior.test.ts` y `src/lib/jsRunner.test.ts` — el motor y el
  transporte. Los del harness lo **ejecutan** con un `self` falso en vez de
  matchear su fuente.
- `e2e/js-behavior-worker.spec.ts` — lo que ningún test unitario puede probar: que
  el harness corre en un worker real, que `new Function` funciona adentro (una CSP
  sin `unsafe-eval` rompería todo esto **solo en producción**), y que un bucle
  infinito no congela la página y `terminate()` lo mata.
- `src/data/modules/acentuacion.test.ts` — palabras inequívocas acentuadas,
  separadas en agudas (solo singular) y con flexión; prohíbe los plurales
  `-ciónes`; y exige las tres reglas de contexto que el patrón sintáctico
  desambigua. La máscara de código es imprescindible: sin ella `titulo` solo
  daría 169 falsos positivos, todos clases CSS legítimas.
- En `validacion-curriculum.test.ts`, el guarda de **`targetCSS` mal formado**.
  Hace falta porque "la respuesta correcta puntúa 100%" compara el target **contra
  sí mismo** y es tautológico: no puede detectar un target inválido. Un punto y
  coma faltante hace que el parser se trague la propiedad siguiente, y entonces el
  alumno que escribe el CSS **correcto** saca 33% y no aprueba. Una declaración
  bien formada tiene exactamente un `:`.

---

## Pendiente, en orden de valor

1. **La plantilla uniforme.** Quedan **60 módulos** sin ningún ejercicio de
   escribir, medidos con umbral en `tipos-ejercicio.test.ts` (baja cuando agregás,
   nunca sube). Los de Sass y tres de JS ya salieron de esa lista. Los módulos originales tienen exactamente 3-4
   lecciones y 8 ejercicios. Flexbox y "qué es CSS" con el mismo peso. Los módulos
   de Sass (21-22) no tienen `live-editor` ni `visual-match` — justo donde hace
   falta ver el CSS compilado. Los seis módulos tocados por CSS moderno ya rompieron
   la uniformidad, así que el precedente existe.
2. **Ejecución en el servidor.** Cierra dos cosas de una: que los valores
   esperados de `js-behavior` sean inspeccionables, y la deuda vieja de que toda la
   corrección es del lado del cliente. Necesita sandbox en Node con límites de
   tiempo y memoria, endpoint, y decidir qué pasa si el servidor no responde.
3. **Deuda técnica.** 35 `@typescript-eslint/no-explicit-any` como warnings.
   `globals.css:15-18` declara `--color-css-purple` y `--color-ts-blue` dos veces
   cada uno. La corrección de ejercicios es del lado del cliente, así que un alumno
   determinado puede inspeccionarla — cerrarlo implica validación en el servidor.
4. **Referencias hacia adelante en lecciones**: quedan 24, medidas y con umbral en
   el test. Dominadas por `display: flex` en ejemplos previos al módulo 15. Es
   tolerable: un ejemplo de CSS no puede escribirse sin propiedades.
5. **Agregar ejercicios baja el porcentaje de progreso** de quien ya tenía el
   módulo completo. Pasó con los seis módulos de CSS moderno. No se perdió nada,
   pero si molesta hay que decidirlo a nivel producto, no de código.

### Decisiones ya tomadas, no reabrir

- Los tres ejercicios de Bootstrap/Tailwind se corrigen por **clases en HTML**, no
  por CSS parseado. Tienen `targetCSS` vacío a propósito.
- Unidades y dimensiones son **circulares** por naturaleza: no se puede enseñar
  `width` sin una unidad ni demostrar `vw` sin una propiedad. Ningún orden lo
  resuelve; se resuelve introduciendo `px` informalmente.
- `float-display` (13) hace un preview intencional de flexbox y grid, y lo dice en
  el texto. No es deuda.
- **Los proyectos de React ya están bien.** Una versión anterior de este archivo
  decía que los proyectos de HTML y React se renderizaban en medio de la lista.
  Era cierto solo para HTML. `react-19-proyecto-taskmanager` y
  `react-20-proyecto-ecommerce` ya estaban bajo `react-projects`, que ya cerraba el
  track. Verificado módulo por módulo. No lo rehagas.
- **El ejecutor de JavaScript NO vuelve al iframe.** Se midió: un iframe `srcdoc`
  comparte hilo con la página y un `while (true)` la congela entera, deadline
  incluido. El Web Worker es la decisión, con el costo de no tener DOM.
- **No agregar un parser de JavaScript.** Se evaluó el AST y se descartó: verifica
  la forma del código, no si funciona, y ningún parser sirve en el navegador.
- **CSS moderno se distribuyó, no se agrupó.** No crear un módulo "CSS moderno":
  se evaluó y se descartó, porque deja el track enseñando CSS viejo con un apéndice
  colgado al final.
- Las lecciones se renderizan por `order`, no por posición en el array ni por el
  número del `id`. En Especificidad los `id` quedaron desordenados a propósito
  (`09-leccion-05` es la cuarta): son URLs vivas y no se renombran.
