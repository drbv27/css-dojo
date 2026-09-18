# Auditoría de contenido didáctico — Dev Dojo

Fecha: 2026-09-18. Medido contra el árbol de trabajo en `49abbaa`.

Alcance: los 112 módulos de `src/data/modules/*.ts` (excluidos los `*.test.ts`) de los
seis tracks, más el copy visible de `src/app/**` y `src/components/**`.

Solo lectura. No se editó ningún archivo de contenido. Lo único que se ejecutó fueron
dos tests unitarios de datos (`acentuacion.test.ts` y `signos-interrogacion.test.ts`),
que no abren conexión a Mongo: `vitest.config.mts` no declara archivo de setup y
`src/data/modules/index.ts` no importa nada de base de datos ni de entorno.

---

## 1. Resumen

### Qué se revisó

| Track | Módulos | Lecciones | Ejercicios |
|---|---|---|---|
| css | 36 | 146 | 335 |
| js (incluye los 4 de TypeScript) | 29 | 88 | 191 |
| react | 20 | 67 | 150 |
| html | 17 | 53 | 126 |
| react-eco | 5 | 10 | 30 |
| nextjs | 5 | 10 | 30 |
| **Total** | **112** | **374** | **862** |

Los 112 módulos fueron leídos completos. El método está en el anexo; lo importante es
que la ortografía **no** se midió con `rg` sobre el archivo crudo, sino sobre los
campos de prosa extraídos del objeto de datos (`description`, `lessons[].title`,
`lessons[].content`, `prompt`, `hint`, `explanation`, `options[].text`,
`dropZones[].label`, `retoPasos[].instruccion`), con los bloques ` ``` ` y los spans
de backticks enmascarados. Esa distinción no es cosmética: la primera pasada, hecha
sobre el archivo crudo, daba **1.472 supuestos errores**, y al separar prosa de código
quedaron **361**. Los otros 1.111 eran nombres de clase CSS, identificadores y
variables de los ejemplos.

### Estado general por track

- **css (36)** — El más trabajado y el más desparejo. Los módulos narrativos nuevos
  (31-36, 22, 30) son de lo mejor del repo; los de catálogo (03, 12, 19, 21, 23, 26-29)
  son listas de sintaxis. Concentra 205 de los 361 errores de tilde y casi toda la
  mezcla tú/vos.
- **html (17)** — El más homogéneo en tono (tuteo puro, sin mezcla) y sin errores
  factuales relevantes. Su problema es de ejemplos: el módulo de formularios avanzados
  rompe en el 100% de sus demos la regla de accesibilidad que enseña el módulo anterior.
- **js (29)** — Prosa sólida y sin errores factuales. El problema está en la brecha
  entre lo que el texto enseña y lo que el `codeExample` ejecutable hace: varios módulos
  explican sintaxis moderna y el sandbox usa la vieja. Los 4 módulos de TypeScript no
  tienen código ejecutable en ninguna lección.
- **react (20)** — Técnicamente el más correcto (batching, reconciliación, reglas de
  hooks, API de React 19 verificadas y correctas). Un error factual duro (el Compiler) y
  dos demos que enseñan lo contrario de lo que predican.
- **react-eco (5)** y **nextjs (5)** — Los más limpios en ortografía (3 y 1 error
  respectivamente) y los más expuestos a envejecer. Cobertura muy fina para el tamaño
  del tema.

### Los 10 problemas más graves

1. **El campo `retoPasos[].instruccion` no lo mira ningún guard.** El test
   `acentuacion.test.ts` recolecta la prosa en `prosaDe()` (líneas 128-138) y nunca
   incluye `retoPasos`. Hay 92 de esos pasos en 23 módulos, y contienen 35 errores de
   tilde, de los cuales **16 son palabras que el propio diccionario del guard ya tiene**
   (`parrafos`, `titulo`, `linea`, `pagina`, `boton`, `despues`, `tambien`, `unico`,
   `relacion`). El guard está verde y el texto está mal. Es el hallazgo estructural del
   informe: no es una falta más, es un agujero en la red.
2. **"contrasena" sin ñ, 20 veces, en todas las pantallas de autenticación.**
   `login`, `registro`, `perfil`, `recuperar` y `nueva-contrasena`. Es la primera
   palabra que ve alguien que se registra.
3. **La app mezcla tú y vos en la misma frase.** `src/app/(auth)/login/page.tsx:101`
   dice "No tienes cuenta?" (tuteo) y la línea 103, dentro del mismo `<p>`, dice
   "Registrate aqui" (voseo).
4. **13 módulos mezclan tuteo y voseo adentro del mismo archivo.** No es variación de
   estilo: es una capa vieja en tuteo y una capa nueva en voseo que nunca se unificaron.
   El caso más visible es `14-especificidad.ts`, que pasa de "no necesitas memorizar"
   (línea 111) a "Ya sabés calcular especificidad" (línea 193).
5. **`04-box-model.ts` enseña `float: left` para columnas 50/50 como si fuera la forma
   normal**, y `15-float-display.ts:78` explica después que eso es exactamente el
   antipatrón histórico. Box Model nunca avisa.
6. **`08-tipografias.ts` se contradice consigo mismo en el mismo archivo**: la línea 307
   dice "`justify` casi nunca" y el reto integrador de la línea 575 exige
   `text-align: justify`.
7. **`react-17-testing.ts:93-118`: el demo de tests siempre pasa.** Los cuatro tests se
   empujan con `paso: true` fijo, sin leer nada del componente. Un módulo que enseña
   testing con un runner que no verifica nada enseña lo contrario de lo que dice.
8. **`react-18-react19.ts:42-56` presenta el React Compiler como automático al pasar a
   React 19** ("No necesitas cambiar tu código"). Es opt-in: un plugin de build que hay
   que instalar y configurar. Único error factual duro del repo.
9. **`js-25-proyecto-weather.ts` inyecta input de usuario sin escapar en `innerHTML`**
   (líneas 56 y 273, la variable `ciudad`), y el módulo nunca menciona XSS — aunque
   `js-12-dom-manipulacion.ts` sí advierte del riesgo.
10. **Los 4 módulos de TypeScript no tienen código ejecutable.** Las 8 lecciones de
    `ts-01` a `ts-04` traen `codeExample` con `editable: true` pero sin campo `js`. El
    alumno llega a un playground vacío. Las 36 lecciones de `js-14` a `js-25` sí lo traen.

---

## 2. Ortografía

### 2.1 Lo que YA está bien — no lo toques

Antes del listado, lo que se verificó y está resuelto, porque saberlo evita trabajo
duplicado:

- **Los signos `¿` están puestos.** Se midió y da **cero** faltantes. Mi primera pasada
  reportó 560 interrogativas sin abrir; era un bug de mi propio detector, que empezaba a
  contar *después* del `¿`. `01-que-es-css.ts:5` dice `"¿Qué es CSS?"`, no `"Qué es CSS?"`.
  El hallazgo se descarta entero.
- **Los dos guards existentes pasan**: `acentuacion.test.ts` y
  `signos-interrogacion.test.ts`, 15 tests, todos verdes. Lo que sigue es lo que esos
  guards **no** cubren, no una regresión de lo que sí cubren.
- **`solo` sin tilde y `esta` demostrativo sin tilde están bien** y el guard lo documenta
  a propósito. No hace falta revisarlos.

### 2.2 Dónde están los 361 errores de tilde/ñ en los módulos

| Track | Errores | Módulos afectados |
|---|---|---|
| css | 205 | 24 de 36 |
| html | 65 | 15 de 17 |
| js | 55 | 25 de 29 |
| react | 32 | 13 de 20 |
| react-eco | 3 | 2 de 5 |
| nextjs | 1 | 1 de 5 |
| **Total** | **361** | **80 de 112** |

Archivos más cargados: `18-css-grid.ts` (29), `10-selectores-descendientes.ts` (18),
`30-proyecto-cv-css.ts` (15), `js-07-funciones.ts` (10), `html-10-semantica.ts` (10),
`html-17-elementos-interactivos.ts` (10).

**32 módulos no tienen ni un error de prosa.** Están bien escritos.

### 2.3 Agrupado por palabra (módulos)

Cada palabra una vez, con todas sus ubicaciones.

- **modulo** → módulo (27) — `03-propiedades-basicas.ts`:390; `05-unidades-css.ts`:527; `06-dimensiones.ts`:55; `08-tipografias.ts`:520; `10-selectores-descendientes.ts`:496; `11-pseudo-clases.ts`:552; `17-flexbox.ts`:566; `18-css-grid.ts`:668; `26-sass-fundamentos.ts`:416; `30-proyecto-cv-css.ts`:429,445,450,455,460,465,480; `html-16-proyecto-cv.ts`:25,29; `js-03-operadores.ts`:25; `js-07-funciones.ts`:368,1223; `js-22-patrones.ts`:16; `react-01-que-es-react.ts`:132; `react-17-testing.ts`:564,570; `ts-02-tipos-avanzados.ts`:155
- **caracteristica** → característica (17) — `02-selectores.ts`:116; `04-box-model.ts`:223; `05-unidades-css.ts`:132; `12-pseudo-elementos.ts`:29; `15-float-display.ts`:196; `23-transiciones-animaciones.ts`:298; `26-sass-fundamentos.ts`:652; `27-sass-avanzado.ts`:102; `html-08-formularios-basicos.ts`:53; `js-07-funciones.ts`:413; `js-20-clases-poo.ts`:222; `nextjs-01-introduccion.ts`:27; `react-18-react19.ts`:872; `react-eco-02-zustand.ts`:130,207; `react-eco-05-tanstack-query.ts`:145; `ts-02-tipos-avanzados.ts`:48
- **clasico** → clásico (17) — `04-box-model.ts`:141; `08-tipografias.ts`:217,475; `12-pseudo-elementos.ts`:265; `15-float-display.ts`:36,509,523; `16-posicionamiento.ts`:455; `17-flexbox.ts`:300; `18-css-grid.ts`:537; `30-proyecto-cv-css.ts`:360; `js-06-ciclos.ts`:29; `js-07-funciones.ts`:769,928; `js-08-arrays.ts`:122; `react-17-testing.ts`:33; `react-19-proyecto-taskmanager.ts`:711
- **cuadricula** → cuadrícula (17) — `18-css-grid.ts`:7,102,133,134,140,155,185,254,268,362,381,427,465,479,501,503; `25-media-queries.ts`:579
- **estan** → están (17) — `08-tipografias.ts`:43; `10-selectores-descendientes.ts`:19,153,213,301,320,330; `15-float-display.ts`:543; `18-css-grid.ts`:247; `24-variables-css.ts`:54; `html-06-listas.ts`:44; `html-14-media-avanzado.ts`:229,238,312; `html-15-buenas-practicas.ts`:118; `js-21-errores.ts`:351; `react-03-componentes.ts`:440
- **simbolo** → símbolo (16) — `02-selectores.ts`:216,254; `10-selectores-descendientes.ts`:90,309,399; `12-pseudo-elementos.ts`:319; `14-especificidad.ts`:468; `26-sass-fundamentos.ts`:576,584,603,605; `27-sass-avanzado.ts`:642,650,652; `html-04-enlaces.ts`:216; `react-02-jsx.ts`:352
- **caracteristicas** → características (15) — `08-tipografias.ts`:215,227; `16-posicionamiento.ts`:39,96,150,167; `25-media-queries.ts`:455; `26-sass-fundamentos.ts`:19; `html-06-listas.ts`:34; `js-09-metodos-arrays.ts`:23,37; `js-15-localstorage.ts`:33; `js-19-es6-moderno.ts`:7; `react-18-react19.ts`:5,565
- **ingles** → inglés (15) — `03-propiedades-basicas.ts`:291; `08-tipografias.ts`:448; `11-pseudo-clases.ts`:314; `21-shadows-gradients-filters.ts`:377; `html-02-estructura-basica.ts`:50; `html-05-imagenes-multimedia.ts`:244; `html-14-media-avanzado.ts`:320,338; `html-15-buenas-practicas.ts`:434; `js-04-strings.ts`:226; `js-07-funciones.ts`:1289; `js-09-metodos-arrays.ts`:283; `js-10-objetos.ts`:247; `js-13-eventos.ts`:228; `react-13-react-router.ts`:411
- **demas** → demás (13) — `10-selectores-descendientes.ts`:401; `14-especificidad.ts`:541; `16-posicionamiento.ts`:45,71,484; `17-flexbox.ts`:602; `18-css-grid.ts`:568; `html-10-semantica.ts`:452; `html-17-elementos-interactivos.ts`:33,151; `js-02-variables-tipos.ts`:145; `react-04-props.ts`:510; `react-13-react-router.ts`:506
- **ahi** → ahí (11) — `05-unidades-css.ts`:527; `12-pseudo-elementos.ts`:494; `16-posicionamiento.ts`:260,430; `24-variables-css.ts`:54; `30-proyecto-cv-css.ts`:209; `html-16-proyecto-cv.ts`:115; `js-07-funciones.ts`:722; `js-21-errores.ts`:186; `react-13-react-router.ts`:524; `react-19-proyecto-taskmanager.ts`:728
- **modulos** → módulos (11) — `01-que-es-css.ts`:33; `15-float-display.ts`:285; `30-proyecto-cv-css.ts`:441,482; `js-07-funciones.ts`:852; `js-17-asincronismo.ts`:356; `js-19-es6-moderno.ts`:7; `js-22-patrones.ts`:30; `react-17-testing.ts`:352; `ts-01-introduccion.ts`:109; `ts-03-generics.ts`:151
- **sera** → será (9) — `04-box-model.ts`:61; `05-unidades-css.ts`:197; `06-dimensiones.ts`:111; `26-sass-fundamentos.ts`:521; `js-06-ciclos.ts`:315; `js-07-funciones.ts`:917; `js-11-dom-seleccion.ts`:256; `react-18-react19.ts`:420
- **asi** → así (8) — `05-unidades-css.ts`:605; `06-dimensiones.ts`:634; `11-pseudo-clases.ts`:566; `14-especificidad.ts`:732,749; `24-variables-css.ts`:491; `25-media-queries.ts`:710
- **menu** → menú (8) — `10-selectores-descendientes.ts`:132,279,500,510; `html-08-formularios-basicos.ts`:160,373; `html-12-accesibilidad.ts`:351,357
- **deberia** → debería (7) — `11-pseudo-clases.ts`:74; `14-especificidad.ts`:531,569; `html-10-semantica.ts`:269,514; `react-06-eventos.ts`:358; `react-16-performance.ts`:172
- **dia** → día (7) — `06-dimensiones.ts`:69; `14-especificidad.ts`:439; `15-float-display.ts`:489; `24-variables-css.ts`:476,493; `30-proyecto-cv-css.ts`:110; `js-01-que-es-javascript.ts`:18
- **espanol** → español (7) — `19-propiedades-logicas.ts`:45,46,54,63,129; `html-01-que-es-html.ts`:147; `html-02-estructura-basica.ts`:50
- **areas** → áreas (6) — `18-css-grid.ts`:7,150,151,155,195,199
- **bateria** → batería (6) — `html-17-elementos-interactivos.ts`:85,124,128,129,134,217
- **detras** → detrás (6) — `03-propiedades-basicas.ts`:74,426; `21-shadows-gradients-filters.ts`:237,404,416,423
- **enfasis** → énfasis (6) — `html-03-texto-y-encabezados.ts`:96,99,122,255,266; `html-15-buenas-practicas.ts`:140
- **podria** → podría (6) — `html-04-enlaces.ts`:310; `html-10-semantica.ts`:284; `js-07-funciones.ts`:199,1131; `js-11-dom-seleccion.ts`:46; `react-20-proyecto-ecommerce.ts`:807
- **dinamicamente** → dinámicamente (5) — `26-sass-fundamentos.ts`:28; `js-11-dom-seleccion.ts`:48; `react-01-que-es-react.ts`:65,209; `react-08-listas-keys.ts`:449
- **reves** → revés (5) — `25-media-queries.ts`:701,735; `30-proyecto-cv-css.ts`:152; `html-10-semantica.ts`:451; `js-07-funciones.ts`:750
- **tipica** → típica (5) — `html-10-semantica.ts`:107,483,504; `react-03-componentes.ts`:418,442
- **dias** → días (4) — `js-01-que-es-javascript.ts`:29,142; `js-25-proyecto-weather.ts`:34,108
- **menus** → menús (4) — `html-06-listas.ts`:30,34,44; `js-01-que-es-javascript.ts`:22
- **tipico** → típico (4) — `25-media-queries.ts`:95; `26-sass-fundamentos.ts`:461; `html-08-formularios-basicos.ts`:60,247
- **unica** → única (4) — `05-unidades-css.ts`:627; `06-dimensiones.ts`:617; `11-pseudo-clases.ts`:571,588
- **articulo** → artículo (3) — `15-float-display.ts`:420,509; `html-03-texto-y-encabezados.ts`:275
- **articulos** → artículos (3) — `12-pseudo-elementos.ts`:340; `18-css-grid.ts`:636; `html-10-semantica.ts`:293
- **cambiara** → cambiará (3) — `06-dimensiones.ts`:583; `11-pseudo-clases.ts`:287; `js-02-variables-tipos.ts`:173
- **electronico** → electrónico (3) — `html-04-enlaces.ts`:79,282,292
- **parrafos** → párrafos (3) — `01-que-es-css.ts`:313; `02-selectores.ts`:391; `10-selectores-descendientes.ts`:515
- **seria** → sería (3) — `23-transiciones-animaciones.ts`:54; `js-05-condicionales.ts`:303; `js-24-proyecto-quiz.ts`:443
- **tendra** → tendrá (3) — `14-especificidad.ts`:29; `24-variables-css.ts`:437; `js-23-proyecto-todo.ts`:35
- **boton** → botón (2) — `24-variables-css.ts`:476; `29-tailwind.ts`:727
- **clasica** → clásica (2) — `js-02-variables-tipos.ts`:22; `js-07-funciones.ts`:56
- **digitos** → dígitos (2) — `03-propiedades-basicas.ts`:43; `html-09-formularios-avanzados.ts`:375
- **explicitamente** → explícitamente (2) — `js-18-fetch-api.ts`:282; `react-02-jsx.ts`:372
- **expresion** → expresión (2) — `react-02-jsx.ts`:346,347
- **haria** → haría (2) — `30-proyecto-cv-css.ts`:255; `react-17-testing.ts`:478
- **linea** → línea (2) — `11-pseudo-clases.ts`:566; `12-pseudo-elementos.ts`:503
- **mostrara** → mostrará (2) — `16-posicionamiento.ts`:238,474
- **parrafo** → párrafo (2) — `02-selectores.ts`:396; `10-selectores-descendientes.ts`:510
- **podrias** → podrías (2) — `18-css-grid.ts`:389; `30-proyecto-cv-css.ts`:37
- **practicamente** → prácticamente (2) — `04-box-model.ts`:442; `08-tipografias.ts`:45
- **proximo** → próximo (2) — `html-16-proyecto-cv.ts`:25; `react-01-que-es-react.ts`:132
- **raton** → ratón (2) — `html-11-atributos-globales.ts`:52,134
- **veras** → verás (2) — `html-17-elementos-interactivos.ts`:48,239
- Una sola vez cada una: **analisis** → análisis (`react-01-que-es-react.ts`:120); **aplicaran** → aplicarán (`01-que-es-css.ts`:51); **atras** → atrás (`js-06-ciclos.ts`:35); **contrasena** → contraseña (`html-08-formularios-basicos.ts`:89); **deberias** → deberías (`js-25-proyecto-weather.ts`:417); **decision** → decisión (`29-tailwind.ts`:745); **despues** → después (`10-selectores-descendientes.ts`:510); **especificamente** → específicamente (`html-12-accesibilidad.ts`:339); **frances** → francés (`08-tipografias.ts`:209); **generica** → genérica (`08-tipografias.ts`:559); **habia** → había (`18-css-grid.ts`:668); **implicitamente** → implícitamente (`react-15-patrones.ts`:459); **implicitos** → implícitos (`18-css-grid.ts`:620); **informacion** → información (`11-pseudo-clases.ts`:588); **jerarquico** → jerárquico (`js-07-funciones.ts`:746); **pagina** → página (`16-posicionamiento.ts`:493); **podrian** → podrían (`24-variables-css.ts`:163); **proporcion** → proporción (`06-dimensiones.ts`:617); **rapidamente** → rápidamente (`04-box-model.ts`:199); **relacion** → relación (`06-dimensiones.ts`:617); **separacion** → separación (`29-tailwind.ts`:712); **tamanio** → tamaño (`18-css-grid.ts`:391); **tambien** → también (`01-que-es-css.ts`:313); **telefono** → teléfono (`30-proyecto-cv-css.ts`:482); **tendria** → tendría (`html-10-semantica.ts`:455); **tipografia** → tipografía (`29-tailwind.ts`:722); **titulo** → título (`05-unidades-css.ts`:610); **todavia** → todavía (`html-01-que-es-html.ts`:38); **unico** → único (`15-float-display.ts`:523)

### 2.4 "ñ" escrita como "n"

Son pocos pero graves porque salen en pantalla:

- **espanol** → español (7) — `19-propiedades-logicas.ts:45,46,54,63,129`;
  `html-01-que-es-html.ts:147`; `html-02-estructura-basica.ts:50`
- **tamanio** → tamaño (1) — `18-css-grid.ts:391`
- **contrasena** → contraseña (1 en módulos) — `html-08-formularios-basicos.ts:89`
- En el copy de la app: **contrasena** × 20 (ver 2.6)

No se encontró `anos` por `años` en prosa. No hay más ñ mutiladas que estas.

### 2.5 El agujero del guard: `retoPasos[].instruccion`

`acentuacion.test.ts:128-138` (`prosaDe`) arma la prosa a auditar con `m.title`,
`m.description`, `l.title`, `l.content`, `e.prompt`, `e.hint`, `e.explanation`,
`o.text` y `z.label`. **Falta `e.retoPasos[].instruccion`.** Hay 92 en 23 módulos y
acumulan 35 errores, 16 de ellos de palabras que el diccionario del guard ya tiene:

| Archivo:línea | Palabra | Va |
|---|---|---|
| 01-que-es-css.ts:313 | parrafos, tambien | párrafos, también |
| 02-selectores.ts:391 | parrafos | párrafos |
| 02-selectores.ts:396 | parrafo | párrafo |
| 05-unidades-css.ts:610 | titulo | título |
| 06-dimensiones.ts:617 | relacion | relación |
| 10-selectores-descendientes.ts:510 | parrafo, despues | párrafo, después |
| 10-selectores-descendientes.ts:515 | parrafos | párrafos |
| 11-pseudo-clases.ts:566 | linea | línea |
| 12-pseudo-elementos.ts:503 | linea | línea |
| 15-float-display.ts:523 | unico | único |
| 16-posicionamiento.ts:493 | pagina | página |
| 24-variables-css.ts:476 | boton | botón |
| 29-tailwind.ts:727 | boton | botón |

Arreglo: agregar `for (const p of e.retoPasos ?? []) partes.push(p.instruccion);` a
`prosaDe()` en los dos tests. `esperado` no debe agregarse: es CSS, no prosa.

### 2.6 Copy de la aplicación (114 errores en 32 archivos `.tsx`)

- **contrasena** → contraseña (20) — `src/app/(app)/perfil/page.tsx`:184,198,203,219,237,267; `src/app/(auth)/login/page.tsx`:63,70,95; `src/app/(auth)/nueva-contrasena/page.tsx`:141,190,192,203,221,227; `src/app/(auth)/recuperar/page.tsx`:56,63; `src/app/(auth)/registro/page.tsx`:88,110,116
- **modulos** → módulos (14) — `src/app/(app)/certificados/page.tsx`:66; `src/app/(app)/dashboard/page.tsx`:225,311; `src/app/(app)/modulos/[slug]/ejercicio/[exerciseId]/page.tsx`:120,139; `src/app/(app)/modulos/[slug]/leccion/[lessonId]/page.tsx`:284,303; `src/app/(app)/modulos/[slug]/page.tsx`:88,113,157; `src/app/(teacher)/teacher/modulos/page.tsx`:221; `src/app/(teacher)/teacher/page.tsx`:140; `src/components/layout/Header.tsx`:11
- **modulo** → módulo (13) — `src/app/(app)/modulos/[slug]/ejercicio/[exerciseId]/page.tsx`:128,129,239,258; `src/app/(app)/modulos/[slug]/leccion/[lessonId]/page.tsx`:292,293,414; `src/app/(app)/modulos/[slug]/page.tsx`:96,97,122; `src/app/(teacher)/teacher/estudiante/[id]/page.tsx`:148,151; `src/app/(teacher)/teacher/page.tsx`:199
- **menu** → menú (10) — `src/components/auth/UserMenu.tsx`:43; `src/components/layout/MobileMenu.tsx`:102,132; `src/components/layout/MobileNav.tsx`:101,131
- **sesion** → sesión (6) — `src/app/(auth)/login/page.tsx`:39; `src/app/(auth)/registro/page.tsx`:135; `src/components/auth/LoginButton.tsx`:9; `src/components/auth/LogoutButton.tsx`:15; `src/components/auth/UserMenu.tsx`:100; `src/components/layout/MobileMenu.tsx`:215
- **codigo** → código (5) — `src/app/(auth)/nueva-contrasena/page.tsx`:146,192; `src/app/(auth)/recuperar/page.tsx`:63,100,101
- **titulo** → título (5) — `src/app/(app)/playground/[id]/page.tsx`:55,184; `src/app/(app)/playground/page.tsx`:50; `src/components/exercises/JsBehaviorExercise.tsx`:158,162
- **explicacion** → explicación (4) — `src/components/exercises/CodeCompletionExercise.tsx`:225; `src/components/exercises/DragDropExercise.tsx`:390; `src/components/exercises/ExerciseResult.tsx`:80; `src/components/exercises/QuizExercise.tsx`:167
- **aqui** → aquí (3) — `src/app/(app)/leaderboard/page.tsx`:219; `src/app/(auth)/login/page.tsx`:103; `src/components/exercises/DragDropExercise.tsx`:132
- **cinturon** → cinturón (3) — `src/app/(app)/leaderboard/page.tsx`:74,75,76
- **minimo** → mínimo (3) — `src/app/(app)/perfil/page.tsx`:228; `src/app/(auth)/nueva-contrasena/page.tsx`:210; `src/app/(auth)/registro/page.tsx`:95
- **todavia** → todavía (3) — `src/app/(app)/certificados/page.tsx`:74,79; `src/app/(teacher)/teacher/estudiante/[id]/page.tsx`:215
- **ahi** → ahí (2) — `src/app/(app)/certificados/page.tsx`:79; `src/app/(app)/leaderboard/page.tsx`:75
- **asi** → así (2) — `src/app/(app)/leaderboard/page.tsx`:64; `src/app/(teacher)/teacher/estudiante/[id]/page.tsx`:215
- **curriculum** → currículum (2) — `src/app/(app)/leaderboard/page.tsx`:64,76
- **estan** → están (2) — `src/app/(app)/dashboard/page.tsx`:311; `src/app/(app)/leaderboard/page.tsx`:64
- **solucion** → solución (2) — `src/components/games/GameEngine.tsx`:368,441
- **tambien** → también (2) — `src/app/(teacher)/teacher/estudiante/[id]/page.tsx`:214; `src/components/exercises/DragDropExercise.tsx`:261
- Una sola vez cada una: **comparacion** → comparación (`src/components/exercises/VisualMatchExercise.tsx`:112); **cuadricula** → cuadrícula (`src/app/(app)/juegos/page.tsx`:35); **digitos** → dígitos (`src/app/(auth)/recuperar/page.tsx`:63); **electronico** → electrónico (`src/app/(auth)/recuperar/page.tsx`:63); **habilitara** → habilitará (`src/app/(app)/dashboard/page.tsx`:311); **linea** → línea (`src/components/exercises/LiveEditorExercise.tsx`:54); **llego** → llegó (`src/app/(app)/certificados/page.tsx`:79); **maxima** → máxima (`src/app/(app)/perfil/page.tsx`:133); **maximo** → máximo (`src/components/gamification/SidebarXP.tsx`:44); **posicion** → posición (`src/app/(app)/juegos/page.tsx`:13); **subia** → subía (`src/app/(app)/leaderboard/page.tsx`:75); **ultima** → última (`src/app/(teacher)/teacher/page.tsx`:228); **ultimo** → último (`src/app/(app)/leaderboard/page.tsx`:74)

Nota: dos de los aciertos en `teacher/estudiante/[id]/page.tsx:214,215` están en
comentarios de código, no en copy visible. Los dejo listados por completitud pero son
prioridad baja.

Además, hay **texto sin `¿` en el copy** que sí lo necesita:
`src/app/(auth)/login/page.tsx:101` dice `No tienes cuenta?`. El guard de signos solo
mira `src/data/modules`, no el copy de la app.

### 2.7 `¿` mal insertado (9 casos)

Estos son distintos de los anteriores: el `¿` está, pero en el lugar equivocado. El
patrón es siempre el mismo — texto que **habla del símbolo `?`** (el ternario, el
parámetro opcional, `??`) y una pasada automática de acentuación lo confundió con una
pregunta. El guard actual no puede verlos: cuenta `¿` contra `?` y acá la cuenta cierra.

`¿` sobrante pegado a un `?` literal:

- `js-05-condicionales.ts:240` — `¿Cuál es el resultado de: 10 > 5 ? ¿"mayor" : "menor"?` → sobra el segundo `¿`
- `js-19-es6-moderno.ts:278` — `Que devuelve 0 ?? ¿"default"?` → sobra el `¿`, y además falta el `¿` de apertura y la tilde de `Qué`
- `ts-01-introduccion.ts:176` — `¿Qué indica el signo ? ¿después de un parámetro en TypeScript?` → sobra el segundo `¿`

`¿` abriendo una oración **afirmativa** (no es pregunta y nunca cierra):

- `14-especificidad.ts:649` — `¿Cuánto pesa el selector :is(#título, p) ?` → el `?` final está separado; es pregunta, pero mal espaciada
- `react-07-renderizado-condicional.ts:379` — `¿El operador ternario (condición ? A : B) es ideal cuando...`
- `react-07-renderizado-condicional.ts:397` — `¿El operador ternario (?) permite elegir entre dos opciones...`
- `react-07-renderizado-condicional.ts` (`react07-ej-07`, `options[3].text`) — `¿style.className = activo ? "activo" : ""`
- `ts-01-introduccion.ts:185` — `¿El ? marca un parámetro como opcional — puede o no recibir un valor.`
- `ts-03-generics.ts:173` — `¿Partial<T> convierte todas las propiedades de T en opcionales (?), útil para...`

Arreglo: borrar esos `¿`. Y si se agrega un guard, la regla que los caza es "un `¿`
cuya oración no cierra con `?` antes del primer `.`", tratando un `?` rodeado de
espacios como símbolo literal y no como cierre.

---

## 3. Coherencia

### 3.1 Tuteo y voseo: el repo está a mitad de una migración

Esto no es un matiz de estilo, es el hallazgo de coherencia más grande y se puede medir.
Contando solo formas inequívocas en la prosa de los módulos:

- Voseo: 195 marcas (`querés` 40, `escribí` 27, `vos` 24, `tenés` 18, `fijate` 18, `podés` 17, `sabés` 12, `usá` 9, …)
- Tuteo: 277 marcas (`puedes` 88, `agrega` 75, `escribe` 47, `quieres` 17, `mira` 14, `debes` 13, …)

33 de 112 módulos usan voseo. **13 usan las dos formas en el mismo archivo**:

| Archivo | vos | tú |
|---|---|---|
| 14-especificidad.ts | 11 | 2 |
| 18-css-grid.ts | 7 | 6 |
| 30-proyecto-cv-css.ts | 6 | 1 |
| js-07-funciones.ts | 3 | 7 |
| 08-tipografias.ts | 3 | 1 |
| 25-media-queries.ts | 3 | 1 |
| 06-dimensiones.ts | 2 | 1 |
| 26-sass-fundamentos.ts | 2 | 1 |
| js-08-arrays.ts | 2 | 2 |
| 01-que-es-css.ts | 1 | 1 |
| 02-selectores.ts | 1 | 2 |
| 10-selectores-descendientes.ts | 1 | 2 |
| js-09-metodos-arrays.ts | 1 | 1 |

El patrón es claro y explica el origen: **la prosa vieja está en tuteo y la nueva en
voseo.** Dos ejemplos que lo muestran dentro del mismo archivo:

- `14-especificidad.ts:111` — "No **necesitas** memorizar números exactos… **puedes** predecir"
  vs `14-especificidad.ts:193` — "Ya **sabés** calcular especificidad" (las lecciones de
  `:is()`/`:where()`/`@layer`, agregadas después)
- `18-css-grid.ts:57` — "**Puedes** mezclar unidades fijas y flexibles" y `:76` — "**Usa**
  Grid para layouts generales" vs `18-css-grid.ts:283` — "Ya **podés** armar una
  cuadrícula" y `:305` — "**usá** las de tu padre" (la lección de `subgrid`)

Track por track: **css** es el epicentro (los módulos 31-36, 22, 33-35 son voseo puro;
01-04, 10, 12, 16, 17, 19, 21, 23 son tuteo). **html** es el único 100% consistente
(tuteo puro, sin una sola marca de voseo en los 17 módulos). **js** es casi todo tuteo
con 6 ejercicios sueltos en voseo (`js-22-patrones.ts:407,427`; `ts-03-generics.ts:240,259`;
`ts-04-typescript-react.ts:242,261`, y los `live-editor` de `js-07:1577,1603,1620`,
`js-08:310`, `js-09:327`). **react** es tuteo puro. **react-eco** y **nextjs** mezclan
de forma sistemática en los 10 archivos: la prosa base y los quizzes simples en tuteo,
las `explanation`/`hint` de los `code-completion` difíciles en voseo.

- Tuteo: `nextjs-01-introduccion.ts:20`, `nextjs-03-server-components.ts:63`,
  `nextjs-05-server-actions.ts:62,195`, `react-eco-03-shadcn.ts:65,180`,
  `react-eco-05-tanstack-query.ts:79`
- Voseo: `nextjs-01-introduccion.ts:247`, `nextjs-02-routing.ts:248`,
  `nextjs-04-api-routes.ts:259`, `nextjs-05-server-actions.ts:257`,
  `react-eco-02-zustand.ts:260`, `react-eco-03-shadcn.ts:257`,
  `react-eco-04-react-hook-form.ts:249`

Que `react-eco-03-shadcn.ts` tenga tuteo en `:65,180` y voseo en `:257` es el mismo
archivo hablando de dos maneras.

En el copy de la app domina el tuteo, con dos fugas de voseo:
`src/app/(auth)/login/page.tsx:103` ("Registrate aqui", pegado al "No tienes cuenta?"
de la línea 101) y `src/app/(app)/certificados/page.tsx:74` ("Todavia no tenes ninguno").
Los mensajes de error también mezclan: `JsBehaviorExercise.tsx` usa "Revisá" y
`ProjectSubmission`/`LaunchSurvey`/`FreeCourseSignup` usan "Intenta de nuevo" para el
mismo tipo de mensaje.

**Recomendación:** elegir una y hacer una pasada. El voseo domina en el contenido más
nuevo y mejor escrito; el tuteo domina en volumen y es el 100% de html y react. Es una
decisión de producto, no técnica, pero mientras no se tome, cada módulo nuevo agranda
el problema.

### 3.2 Conceptos usados antes de enseñarse

Verificado contra el campo `order`, no contra el número de archivo.

| Dónde se usa | Qué usa | Dónde se enseña | Distancia |
|---|---|---|---|
| `04-box-model.ts:153,202,407,415` (order 4) | `float: left` | `15-float-display.ts` (order 18) | 14 posiciones |
| `04-box-model.ts:183-186,202,410` (order 4) | `overflow` | `31-overflow.ts` (order 7) | 3 posiciones |
| `31-overflow.ts:152-192` (order 7) | `position: sticky` | `16-posicionamiento.ts` (order 19) | 12 posiciones |
| `16-posicionamiento.ts:110-117` (order 19) | `transform: translate(-50%,-50%)` | `22-transforms.ts` (order 26) | 7 posiciones |
| `35-accesibilidad-visual.ts:283,497` (order 29) | `@media`, y dice "las que **ya escribiste**" | `25-media-queries.ts` (order 30) | el módulo siguiente |
| `03-propiedades-basicas.ts:409-410,426` | `padding` | `04-box-model.ts`, `06-dimensiones.ts` | 1-3 posiciones |
| `html-04-enlaces.ts:67-79` | `id` (anclas) | `html-11-atributos-globales.ts` | 7 posiciones |
| `js-16-formularios.ts:165`, `js-17-asincronismo.ts:212-214` | destructuring | `js-19-es6-moderno.ts` | 2-3 posiciones |
| `react-01-que-es-react.ts:86,91` | `useState`, `onClick` | `react-05` (205), `react-06` (206) | 4-5 posiciones |
| `react-04-props.ts:115,154,173` | `onClick` | `react-06-eventos.ts` (206) | 2 posiciones |
| `react-05-estado-usestate.ts:142-143` | `e.target.value` | `react-06-eventos.ts` (206) | 1 posición |
| `react-10-hooks-avanzados.ts:137` | nombra `React.memo` | `react-16-performance.ts` (216) | 6 posiciones |
| `nextjs-03-server-components.ts:118` | nombra TanStack Query en una tabla | `react-eco-05-tanstack-query.ts`, **otro dojo** | sin orden forzado entre dojos |
| `nextjs-05-server-actions.ts:250-258` | `"use server"` dentro del cuerpo de una función | las lecciones (`:22-24`, `:76`) solo mostraron la forma a nivel de archivo | nunca se explica |

Los dos peores, porque no son andamiaje sino contradicción:

- **`35-accesibilidad-visual.ts:283`** dice literalmente "Es una media query como
  cualquier otra de las que **ya escribiste**" cuando el alumno todavía no escribió
  ninguna: `35` es order 29 y `25-media-queries` es order 30.
- **`08-tipografias.ts:285`** dice "para centrar la caja hace falta otra técnica, y la
  vas a ver en el **próximo módulo**". Esa técnica es `margin: 0 auto` y ya se enseñó
  tres módulos **antes**, en `06-dimensiones.ts:138,235`. El propio archivo se
  contradice: `08-tipografias.ts:520` dice bien "que ves en el modulo de dimensiones".

### 3.3 Contradicciones entre módulos

1. **Breakpoints atribuidos al framework equivocado.**
   `25-media-queries.ts:97-101` da la tabla sm 640 / md 768 / lg 1024 / xl 1280 /
   2xl 1536 y la línea 160 dice que es "la convención de la industria (Tailwind,
   **Bootstrap**)". Esos son los valores de Tailwind. Los de Bootstrap están en el
   propio repo, en `28-bootstrap.ts:65-70`: 576 / 768 / 992 / 1200 / 1400. La línea 526
   del mismo `25` lo dice bien ("frameworks como Tailwind CSS"); es solo la 160 la que
   está mal. Arreglo: sacar "Bootstrap" de la línea 160.

2. **`justify` prohibido y exigido en el mismo módulo.**
   `08-tipografias.ts:305` — "en pantallas, `left` casi siempre se lee mejor" y `:307` —
   "**`justify` casi nunca**". Pero el reto integrador del mismo archivo,
   `08-tipografias.ts:575` (`esperado: ".nota p { text-align: justify; }"`) y su
   `referenceSolution` en `:588`, exigen `justify` sin ninguna nota de excepción.
   `09-advanced-text.ts:233` repite el patrón. Arreglo: cambiar el reto a `left`, o
   explicar la excepción (columna ancha) antes de pedirla.

3. **`float` para columnas: enseñado como normal, después como antipatrón.**
   `04-box-model.ts:407` pide literalmente "Usa float: left en ambas" para un layout
   50/50. `15-float-display.ts:78` explica después que ese uso es el antipatrón
   histórico, y su propio reto (`:545`) lo reemplaza por `display: flex` justamente
   "para mostrar por qué hoy casi no se usa". Box Model nunca avisa.

4. **Dos recetas para ocultar visualmente, una obsoleta.**
   `35-accesibilidad-visual.ts:313,369` usa `clip-path: inset(50%)` y la presenta como
   "de las pocas recetas que conviene copiar tal cual". `27-sass-avanzado.ts:118` define
   el placeholder `%visualmente-oculto` con `clip: rect(0,0,0,0)` — propiedad obsoleta,
   reemplazada por `clip-path` — sin ninguna advertencia. Arreglo: actualizar el
   placeholder de `27`.

5. **Mobile-first predicado y no practicado.**
   `25-media-queries.ts:155-162` insiste en mobile-first (`min-width`) como "la
   convención de la industria". El mixin de ejemplo de `26-sass-fundamentos.ts:321-329`
   genera exclusivamente `max-width` (desktop-first), sin reconciliar.

6. **"Nunca uses `var`" y `var` en los sandboxes.**
   `js-02-variables-tipos.ts:40` enseña la regla y `js-07-funciones.ts:746` la repite,
   pero `js-07-funciones.ts:677` usa `for (var i = 0; ...)` en su propio `codeExample`,
   69 líneas antes. Se repite en `js-09:127,177,184,188,191`, `js-10:72,138,139,143`,
   `js-11:175-176`, `js-12:110,116`, `js-13:57-60,113-114,171-173,186` — todos
   posteriores a la lección que prohíbe `var`. La prosa usa `const`/`let`; los sandboxes
   ejecutables, no.

7. **Dos convenciones opuestas para el `default` de un reducer, en el mismo módulo.**
   `react-14-estado-global.ts:43` usa `throw new Error(...)` y `:91` usa `return state`,
   sin discutir el trade-off.

8. **`<i>` presentado como inútil y después rehabilitado.**
   `html-03-texto-y-encabezados.ts:126` dice "Evita usar `<b>` y `<i>`" sin matices.
   `html-15-buenas-practicas.ts:136-141` explica doce módulos después que `<i>` sí tiene
   usos semánticos legítimos, sin reconectar con la regla anterior.

### 3.4 Terminología

- **"etiqueta" y "elemento" usados como sinónimos en todo el track HTML**, sin que
  ningún módulo defina la diferencia. `html-01-que-es-html.ts:60` dice bien "elementos"
  y `:77` dice "Cada **etiqueta** HTML se convierte en un nodo del árbol DOM" — que
  además es técnicamente falso (ver §4). Se repite en
  `html-08-formularios-basicos.ts:77` vs `:79` (mismo `<input>`, dos términos) y en
  `html-10-semantica.ts` (~línea 79) vs `:265`.
- **Tres nombres para dos conceptos de selector.** `02-selectores.ts:158` llama
  "Selector múltiple (sin espacio)" a `p.destacado`. `10-selectores-descendientes.ts:259`
  llama a lo mismo "Selector de tipo con clase", y usa "compuesto" (`:228`) para otra
  cosa: cadenas de descendientes.
- **"ruta" significa dos cosas distintas en la app, y el mismo alumno ve las dos en la
  misma sesión.** En `src/components/layout/DojoSwitcher.tsx:23-33,115,129,154-156`,
  "Ruta" es la categoría amplia (Frontend / Backend / IA Dev) y cada dojo individual se
  llama "tecnología" (`interface Tech`, `:14`). Pero en
  `src/app/(app)/dashboard/page.tsx:131` ("Ruta de {dojoLabel…}") y en
  `src/app/(teacher)/teacher/certificados/page.tsx:178,181,260,410`, "ruta" nombra a UN
  dojo. Misma palabra, dos granularidades de la misma taxonomía. Arreglo: renombrar el
  agrupador de `DojoSwitcher` (por ejemplo "Área") y reservar "ruta" para el dojo.
- **La landing pre-login usa "Track" en inglés** (`src/components/landing/Secciones.tsx:60`,
  `src/components/landing/LandingEstatica.tsx:78`) mientras toda la app autenticada dice
  "ruta" en español.
- **"landmark"** aparece en el enunciado de `html-16-proyecto-cv.ts:185` sin haberse
  definido nunca: `html-10` y `html-12` explican el concepto pero nunca usan la palabra.
- **`02-selectores.ts:169-178` enseña el selector descendiente completo**, y
  `10-selectores-descendientes.ts:17-19` lo vuelve a presentar de cero diez posiciones
  después, como si fuera la primera vez, sin referencia cruzada.

No se encontraron explicaciones cortadas a media frase ni párrafos duplicados con otras
palabras en ninguno de los seis tracks.

---

## 4. Ejemplos y código

### 4.1 Código que no corre o que está mal

| Archivo:línea | Problema | Arreglo |
|---|---|---|
| `26-sass-fundamentos.ts:373-374` | Llama a `color.adjust()` sin que exista `@use "sass:color"` en ningún lado del módulo. **No compila.** Verificado: no hay ningún `@use "sass:` en el archivo. | Agregar `@use "sass:color";` o volver a `darken()` |
| `js-04-strings.ts:122,128,130,138,139` | Los backticks de ejemplo están escapados con tres barras (`\\\``) en vez de una. El alumno ve `\`Me llamo…\`` con barras espurias — justo en la lección que enseña la sintaxis de backticks | Una sola barra de escape |
| `31-overflow.ts:145` | Muestra `.comentarios { tabindex: 0; }` dentro de un bloque ` ```css `. `tabindex` no es CSS. El comentario en la misma línea lo aclara y el párrafo siguiente también, así que el riesgo es menor, pero un bloque etiquetado `css` con CSS inválido sigue siendo mala señal | Mostrar el `<div tabindex="0">` como HTML |
| `nextjs-05-server-actions.ts:21-34` | Usa `revalidatePath` sin importarlo (se corrige recién en la lección 2) | Agregar el import |
| `js-03-operadores.ts:25` | La tabla anuncia `10 / 3` → `3.33` como resultado exacto | Escribir `≈ 3.33` |

### 4.2 Prácticas obsoletas o peligrosas enseñadas sin advertencia

- **XSS sin mencionar.** `js-25-proyecto-weather.ts:56,273` concatena `ciudad` —que
  viene directo de `input.value`— dentro de `innerHTML` sin escapar. Escribir
  `<img src=x onerror=alert(1)>` como ciudad ejecuta ese HTML. El módulo nunca menciona
  el riesgo, aunque `js-12-dom-manipulacion.ts` sí lo advierte para el mismo patrón.
  Arreglo: usar `textContent` para `ciudad`, y agregar la nota.
- **`clip: rect(0,0,0,0)`** en `27-sass-avanzado.ts:118` (propiedad obsoleta).
- **`darken()`** en `26-sass-fundamentos.ts:90` y `27-sass-avanzado.ts:225,383`:
  deprecada en Dart Sass moderno a favor de `color.adjust()`. Irónico, porque
  `26:502-521` sí presenta `@import` como obsoleto y `@use` como lo recomendado — pero
  no aplica el mismo criterio a las funciones de color.
- **`/` como división en Sass** en `27-sass-avanzado.ts:183` (`percentage($i / 12)`):
  deprecado a favor de `math.div()`.
- **Clearfix sin contexto.** `12-pseudo-elementos.ts:265-275` presenta el clearfix como
  "un patrón clásico" sin decir que hoy se evita; la aclaración llega recién en
  `15-float-display.ts:141`, seis módulos después.
- **`z.string().email()`** en `nextjs-04-api-routes.ts:96` y
  `react-eco-04-react-hook-form.ts:101`. El repo tiene `zod ^4.3.6` instalado
  (`package.json:51`); en Zod 4 la forma es `z.email()` de primer nivel. Sigue
  funcionando con warning, pero desaparece en la próxima mayor. Ambas ubicaciones
  verificadas.
- **Efecto secundario impuro durante el render.**
  `react-16-performance.ts:64,65` declara `let renderCountNormal = 0` / `renderCountMemo = 0`
  fuera del componente y los incrementa en el cuerpo del render (`:69`, `:80`). Es
  exactamente lo que las reglas de React prohíben, enseñado sin ninguna advertencia, en
  el módulo de performance. Arreglo: `useRef` + `useEffect`, o el Profiler que el propio
  texto recomienda.
- **`style=` inline** en los `codeExample` de los módulos HTML 10, 12, 13, 14, 15 y 17,
  cuando `html-11-atributos-globales.ts:44` enseña "se recomienda usar clases CSS en
  lugar de estilos en línea". El caso más llamativo: `html-15-buenas-practicas.ts:69-105`,
  el módulo de "código limpio", tiene su demo lleno de `style="display:flex;gap:16px;"`.
- **Campo del esquema que no existe en el formulario.**
  `react-eco-04-react-hook-form.ts:102` declara `edad: z.number().min(18, …)` en el
  schema de Zod, pero el `<form>` de ejemplo (`:119-122`) solo registra `nombre` y
  `email`. El campo `edad` nunca se ilustra. Y si se agregara sin `valueAsNumber: true`
  fallaría contra `z.number()`, porque React Hook Form devuelve string por defecto —
  que es justo la trampa que valdría la pena enseñar.
- **`isLoading` en vez de `isPending` para `useQuery`.**
  `react-eco-05-tanstack-query.ts:47,55`. En TanStack Query v5 el flag principal
  recomendado es `isPending`. Funciona igual en este ejemplo concreto (no hay
  `initialData`), pero enseña la forma vieja. El mismo módulo sí usa `isPending`
  correctamente para `useMutation` (`:116,118,127`), así que la inconsistencia está
  dentro del mismo archivo.
- **`<label>` sin `for`/`id` en los tres `codeExample` de
  `html-09-formularios-avanzados.ts`** (líneas 42-55, 113-116, 191-201): "Color
  favorito", "Volumen", "Buscar", "Fecha", "Archivo", "Nombre", "Email"… ninguno
  asociado. El módulo **inmediatamente anterior**,
  `html-08-formularios-basicos.ts:129`, enseña: "Siempre usa `<label>` con `for`
  asociado al `id` del input. Sin label, los lectores de pantalla no pueden describir el
  campo". `html-09` rompe esa regla en el 100% de sus ejemplos. Es el peor caso de
  "predicar y no practicar" del repo.

### 4.3 Demos que no hacen lo que dicen

- **`react-17-testing.ts:93-118`** — los cuatro tests del runner se empujan con
  `paso: true` literal, sin leer el estado ni el DOM del componente `Contador`.
  El botón "Ejecutar tests" siempre da todo verde. Verificado: cuatro `tests.push`
  con `paso: true` fijo, ningún `paso: false`, ninguna condición.
  Arreglo: leer el DOM real, o decir explícitamente en el demo que es ilustrativo.
- **`js-19-es6-moderno.ts`** — el `content` enseña spread, optional chaining y nullish
  coalescing, y el `codeExample` nunca los usa: línea 73 usa `Object.assign({}, ...)`
  en vez de `...`; línea 141 simula `?.` con un ternario; línea 151 usa
  `valor0 != null ? valor0 : "default"` en vez de `??`. El alumno no puede experimentar
  con la sintaxis que el módulo dice enseñar.
- **`js-20-clases-poo.ts`** — el `content` enseña `class`/`extends`/`super`
  (líneas 22, 104-112) y los tres `codeExample` (`:59`, `:131`, `:227`) usan
  `function` + `.prototype` + `Object.create`. Nunca se ve una `class` real.
- **`js-21-errores.ts`** — el `content` enseña `class ValidacionError extends Error`
  (`:96`) y el `codeExample` (`:129`) define `function ValidacionError(...)` sin heredar
  de `Error`.
- **`html-10-semantica.ts:212-219`** y **`html-12-accesibilidad.ts:198-205`** — los demos
  de `<figure>` sustituyen la imagen por un `<div>` decorativo, aunque el texto de la
  misma lección muestra el código correcto con `<img alt="…">`.
- **Disclaimers desparejos de simulación.** `react-13-react-router.ts:72` dice bien
  "Simulacion de React Router (no funciona con CDN real)". `react-16-performance.ts`
  ("// Simulacion de lazy loading") y `react-17-testing.ts` ("// Simulacion visual de
  tests") no explican la limitación.

### 4.4 Lo que se verificó y está bien

No inventé hallazgos donde no los hay. Verificado explícitamente:

- `fetch` se usa correctamente: `js-18-fetch-api.ts:50,61` y `js-25` comprueban
  `response.ok` y explican que `fetch` no rechaza con un 404. Evitan el error clásico.
- `JSON.parse(localStorage…)` siempre envuelto en try/catch (js-15, js-23, js-24, js-25).
- No hay ni un `catch` vacío en los 29 módulos de js/ts.
- `XMLHttpRequest` aparece solo como opción incorrecta de un quiz, nunca como vigente.
- En react: no hay `ReactDOM.render` (siempre `createRoot`), ni `defaultProps`/`PropTypes`
  presentados como vigentes, ni componentes de clase como camino principal (siempre
  marcados "legado"), ni mutación directa de estado, ni `key={index}` sin advertencia.
- `React.FC` no se usa en `ts-04`; los componentes se tipan en la firma. Correcto.
- `any` se enseña con advertencia explícita en `ts-01:39-41`.
- Los tres proyectos de js (23 Todo, 24 Quiz, 25 Weather) tienen lógica de dominio
  genuinamente distinta — no es el mismo esqueleto tres veces.
- En CSS 01-18 no hay errores de sintaxis ni ejemplos copiados sin adaptar: el "CV de
  Ana" que reaparece en 07, 09, 13 y 18 es un hilo deliberado, con CSS distinto cada vez.
- La tabla de `html-07-tablas.ts:171` tiene el `colspan`/`rowspan` bien calculado.

---

## 5. Valor pedagógico

La pregunta era: ¿esto le enseña algo a alguien, o llena espacio?

### css (36 módulos)

**Fuertes.** Arrancan de un problema real y construyen alrededor:
`05-unidades-css` (dvh/svh/lvh motivado con la barra del navegador móvil),
`07-math-functions` (cada lección nace del límite de la anterior),
`09-advanced-text`, `11-pseudo-clases` (`:has()` con su historia de veinte años de
pedidos), `13-attribute-selectors` (tiene sección de "cuándo NO usarlo"),
`14-especificidad` (`@layer` motivado con un conflicto real contra una librería),
`18-css-grid` (subgrid explicado desde botones desalineados entre tarjetas),
`22-transforms` (pipeline layout→paint→composite explicado con precisión),
`31-overflow`, `32-tipografia-web`, `33-herencia-valores-globales`,
`34-imagenes-y-medios`, `35-accesibilidad-visual`, `36-depurar-con-devtools`.
`30-proyecto-cv-css` es el mejor cierre del repo: retoma el CV semántico del track HTML,
justifica por qué agregar clases (`:63-114`), impone un orden de trabajo con razones
(`:125-171`) y en `25-ej-05` hace que el alumno descubra el problema de accesibilidad
que él mismo acaba de crear.

**Flojos.** Todos comparten la misma forma: título, tabla de sintaxis, bloque de código,
callout "> **Consejo:**". Explican QUÉ hace cada propiedad y casi nunca CUÁNDO usarla:

- `03-propiedades-basicas` — tres lecciones de tablas (formatos de color, `background`,
  `border`). Se salva a medias por el reto integrador. Falta: cuándo hex, cuándo HSL,
  cuándo `rgb()` con alfa.
- `12-pseudo-elementos` lecciones 1-2 (`:41-119`) — listas de qué hace cada
  pseudo-elemento. Mejora mucho en la lección 3.
- `19-propiedades-logicas` — explica el sistema block/inline/start/end sin un solo caso
  donde el alumno vea la diferencia contra `margin-left`. Falta: un ejemplo con `dir="rtl"`.
- `21-shadows-gradients-filters` — `:17-89` da la sintaxis completa de
  `box-shadow`/`text-shadow` sin un caso de uso más allá de "da profundidad".
- `23-transiciones-animaciones` — catálogo de propiedades animables. Falta el criterio
  de qué es barato animar (que `22-transforms` sí explica).
- `26-sass-fundamentos` / `27-sass-avanzado` — catálogo de sintaxis. **Nunca explican
  por qué elegir Sass hoy**, cuando CSS ya tiene variables, nesting nativo y funciones
  matemáticas. Se salvan por los ejercicios de compilación mental
  (`21-ej-09/10/11`, `22-ej-09/10/11`), que son de lo mejor de esos módulos.
- **`28-bootstrap` es el peor del track.** `:336-449` es una lista de clases con su
  efecto. No hay ni una línea sobre cuándo Bootstrap es la elección correcta frente a
  CSS propio, ni qué se paga (peso del CSS sin usar, dificultad de personalizar sin
  Sass, clases sin semántica). Enseña a listar clases, no a decidir.
- `29-tailwind` — mejor que Bootstrap porque tiene tabla comparativa (`:64-72`) y explica
  la filosofía utility-first (`:41-47`), pero `:105-508` vuelve al catálogo. Nunca se
  practica cuándo extraer un componente en vez de repetir quince utilidades. El reto
  final es la excepción buena: hace explícito que "en Tailwind la decisión de estilo vive
  en el HTML".
- **Hueco transversal:** los tres módulos de herramientas (26, 27, 29) nunca se cruzan.
  Nadie dice si conviene combinar Sass con Tailwind o no. Y `24-variables-css`,
  `26` y `27` explican "variables para no repetir valores" casi con la misma frase, sin
  que ninguno señale la diferencia real: las de Sass son de compilación, las custom
  properties son de ejecución, heredables y cambiables con JS y media queries. Es la
  idea que justifica tener los tres módulos, y no está escrita en ninguno.

### html (17 módulos)

**Fuertes.** `html-04-enlaces` (tablas GET/POST y absoluta/relativa que dan un "cuándo"
real), `html-10-semantica` (el contraste "sopa de divs vs semántico" es un dispositivo
pedagógico potente), `html-12-accesibilidad` (div-onclick vs button, cifras WCAG reales),
`html-17-elementos-interactivos` (la regla mental "progress avanza, meter mide", y
honestidad explícita en `:47-49` sobre que `<dialog>` interactivo necesita JS que
todavía no se vio). `html-16-proyecto-cv` integra de verdad: no enseña sintaxis nueva,
reutiliza header/main/section, table, figure+alt, mailto/tel y jerarquía de encabezados
en nueve ejercicios progresivos.

**Flojos.** `html-11-atributos-globales` — el "Resumen de atributos globales" de
`:217-230` son once filas "atributo | función" sin criterio de cuándo usar `data-*` en
vez de una clase. Se salva porque los `codeExample` son interactivos y muestran el
efecto (`:142-153`, `:233-244`). `html-13-meta-seo` tiene el mismo formato de tablas más
un "Checklist de SEO" sin desarrollo (`:210-217`), pero se salva mejor: cada lección
trae una maqueta visual de cómo se ve en Google y al compartir en redes (`:76-83`,
`:148-158`), y eso sí conecta el código con el para qué.

### js (29 módulos, incluidos los 4 de TypeScript)

**Fuertes.** `js-07-funciones` es el mejor del track: tabla comparativa de las tres
formas de declarar funciones con cuándo usar cada una (`:415-422`, `:486-494`), hoisting
y TDZ explicados con su causa (`:451`), y `live-editor` cuyas explicaciones enseñan la
trampa real (que `if (a+b) return…` falla con 0 por ser falsy). `js-09-metodos-arrays`
**sí** enseña a elegir, no es una lista: explica que `map` no muta y devuelve la misma
longitud, la trampa de `sort()` sin comparador, y en `js09-ej-08` (`:349`) usa el carrito
vacío para enseñar que `reduce` sin valor inicial lanza error — el "por qué" de un bug
real de producción. También bien: `js-05-condicionales`, `js-06-ciclos`,
`js-12-dom-manipulacion`, `js-13-eventos` (delegación con sus ventajas concretas),
`js-18-fetch-api` y `js-21-errores` (dan el cuándo, no solo el qué),
`js-22-patrones` (tabla de cuándo usar cada patrón en `:230`, no nombres sueltos).
En TypeScript: `ts-02` tiene una tabla interface-vs-type con tradeoffs reales (`:50`),
`ts-03` no se queda en `identity<T>` sino que usa un wrapper de respuesta de API
(`Respuesta<T>` en `:37`), y `ts-04` tiene tabla de tipos de evento por elemento (`:106`)
y un hook genérico real (`useLocalStorage<T>`, `:116`).

**Flojos.**

- `js-04-strings:67-86` — la lección "Métodos de strings" es puros bullets
  ("`slice(inicio,fin)` extrae una porción", "`substring` similar a slice") sin decir
  cuándo `slice` vs `substring` ni cuándo `replace` vs `replaceAll`. Contraste directo
  con `js-09`, que sí da el criterio. Falta: la diferencia real con índices negativos.
- Mismo patrón, más leve, en `js-08-arrays:67-92` y `js-10-objetos:156-186`.
- `js-19-es6-moderno` — la prosa explica bien el para qué (inmutabilidad para React,
  acceso seguro), pero como el `codeExample` nunca ejecuta esa sintaxis (§4.3), el
  módulo pierde justo el valor interactivo que el resto del curso sí da.
- **`ts-01` a `ts-04`**: las 8 lecciones traen `codeExample` con `editable: true` y sin
  campo `js`. El playground está vacío. Verificado contra los datos: 8 de 8 lecciones sin
  código ejecutable, contra 36 de 36 con código en `js-14`..`js-25`. Mientras eso siga
  así, "editable" no significa nada en TypeScript.
- Huecos: `js-02-variables-tipos` muestra `typeof null` → `"object"` en su
  `codeExample:108` y el `content` (`:82-91`) nunca lo explica. El alumno ve un resultado
  contraintuitivo sin contexto. Y `js-17-asincronismo` nunca toca microtask vs macrotask
  (por qué una Promise resuelta corre antes que `setTimeout(fn, 0)`) — no es un error,
  es una oportunidad perdida en el módulo donde correspondía.

### react (20 módulos)

**Fuertes.** `react-16-performance` enseña a decidir: checklist concreto, cuándo NO usar
`React.memo`/`useMemo`/`useCallback`, y cierra con "mide antes de optimizar".
`react-12-context` y `react-14-estado-global` tienen tablas de decisión explícitas
(Props vs Context; useState vs useReducer vs Context vs Zustand). `react-09-useeffect`
lección 4 da ejemplos MAL/BIEN y una regla clara: "si puedes calcularlo durante el
render, no necesitas useEffect".

**Flojos.**

- `react-15-patrones` lección 3 (Compound Components) explica el CÓMO (Context interno,
  API `Componente.SubComponente`) pero no el CUÁNDO ni el costo, a diferencia de las
  lecciones 1 y 2 del mismo módulo que sí tienen tablas de decisión.
- **Hueco real:** el ejercicio `react15-ej-08` (`:518`) pregunta por la diferencia entre
  Container y Presentational, patrón que **no aparece en ninguna lección del módulo**
  (las lecciones cubren Composición, Render Props/HOC y Compound Components, `:15-384`).
  Evalúa algo que nunca se enseñó.
- `react-17-testing` — la prosa sí enseña a decidir (prioridad de queries con su razón,
  `findBy` vs `queryBy`, qué mockear), pero el demo que siempre pasa (§4.3) le resta
  todo. Un módulo de testing con un runner falso enseña la lección equivocada.

### react-eco (5) y nextjs (5)

Son **tours de superficie**, y hay que decirlo con todas las letras: dos lecciones por
librería alcanzan para orientarse, no para dominar. Cinco módulos cubren React Router +
Zustand + shadcn + React Hook Form + TanStack Query; otros cinco, todo Next.js.

**Lo mejor del repo está acá.** `nextjs-03-server-components.ts:61-63` — "Regla de oro:
Server por defecto. Solo usa 'use client' cuando necesites interactividad" — es la
explicación conceptual mejor lograda de los diez archivos. Y las `explanation` de los
ejercicios difíciles sí explican el porqué con el bug concreto que el patrón evita:
`react-eco-01-router.ts:271-273` (Outlet), `react-eco-02-zustand.ts:259-260`
(selectores), `nextjs-04-api-routes.ts:277-278` (status code). Eso es valor agregado
real, no paráfrasis de la doc. El patrón `create<ThemeStore>()(persist(...))` con doble
paréntesis de `react-eco-02-zustand.ts:95-106` está bien resuelto — es un detalle de TS
que la mayoría de los tutoriales omite.

**Lo flojo.** `react-eco-03-shadcn.ts:76-119` (Button/Input/Card/Dialog) es un catálogo
de componentes con su sintaxis, sin un solo criterio de cuándo elegir cada uno. El
alumno lee exactamente lo mismo en la doc de shadcn.

**Huecos de cobertura, nombrados.** React Router no enseña data router, loaders ni
actions — el patrón vigente en proyectos nuevos. React Hook Form no menciona
`Controller`, que es lo que hace falta para integrar inputs de terceros, **incluidos los
de shadcn que se enseñan en el módulo anterior**: los dos módulos están pegados y no se
cruzan. TanStack Query no toca infinite queries ni modo suspense. Y Next.js no toca el
cambio de comportamiento del caché por defecto de `fetch` (sin `cache`/`revalidate`),
que es la fuente de bugs más común al migrar de Next 14 a 15+, ni middleware.

**Envejecimiento.** Es el riesgo estructural de estos dos tracks.
`react-eco-01-router.ts:5-6,15` fija el contenido en React Router "v6" de forma
explícita (título, descripción, heading e imports de `react-router-dom` en
`:28,47,62,90,119,136`), sin data router. Correctamente **no** usa `<Switch>`, que es v5
y está muerto. Sobre la versión actual: el registro de npm
(`registry.npmjs.org/react-router/latest`) devuelve `8.4.0`, así que hay al menos dos
mayores publicadas después de v6. **Una afirmación previa de que v6 está formalmente EOL
desde junio de 2026 no se pudo confirmar contra ninguna fuente primaria y queda
retirada**: ni `reactrouter.com/upgrading/v7` ni el changelog contienen esa declaración.
El hallazgo se sostiene sin esa fecha.

Lo que sí está confirmado en el repo mismo: `package.json:51` tiene `zod ^4.3.6` y dos
módulos usan la forma deprecada `z.string().email()`. En cambio, todo lo que depende de
la versión de Next y React **está bien**: `params: Promise<{…}>` con `await params`
(`nextjs-02-routing.ts:26-27`, `nextjs-04-api-routes.ts:60-61,70-71`), `await headers()`
/ `await cookies()` (`nextjs-04:123,127`), y `useActionState` + `useFormStatus` sin la
API vieja `useFormState` (`nextjs-05:107-139`). Correcto para `next ^16.2.1` y
`react ^19.2.4`.

---

## Anexo: método y hasta dónde llegué

**Cómo se midió la ortografía.** Los 112 archivos de datos se convirtieron a JSON
(quitando el `import type`, la anotación `: ModuleData` y los `as const`, y serializando
el objeto con Node). Los 112 se convirtieron sin error. De ahí se extrajeron 5.723
bloques de prosa de los campos listados arriba, se enmascararon los bloques ` ``` ` y
los spans de backticks, y se buscó un diccionario de 300 formas mal escritas, filtrando
los tokens pegados a `.`, `#`, `-`, `{`, `(`, `$`, `/`, `_`, `@`, `<`, `>` (selectores,
identificadores, JSX). Los resultados se cruzaron contra el diccionario de
`acentuacion.test.ts` para separar lo que el guard ya cubre de lo que no.

**Errores míos que corregí en el camino, por si sirven de aviso:**

1. La primera medición, hecha con `rg` sobre el archivo crudo, dio 1.472 errores. El 77%
   eran código. El número correcto es 361.
2. Reporté 560 interrogativas sin `¿`. Era un bug de mi detector, que empezaba a contar
   después del propio `¿`. El número real es cero: los signos están puestos. Lo verifiqué
   contra el fuente (`01-que-es-css.ts:5`) y contra el guard, que pasa.
3. Mi detector de "`¿` que abre una afirmación" dio cero la primera vez. Como ya tenía a
   la vista un caso que debía haber cazado (`ts-01-introduccion.ts:185`), lo traté como
   detector roto y no como hallazgo negativo. Corregido y con control positivo, encontró 6.
4. Busqué `z.string().email()` con un patrón que exigía paréntesis vacíos, así que
   `react-eco-04-react-hook-form.ts:101` —que pasa un mensaje— no apareció, y estuve a
   punto de marcar ese hallazgo como no confirmado. Lo era.
5. **Mi filtro de falsos positivos descartaba toda palabra seguida de dos puntos.** Lo
   había puesto para excluir `propiedad:` de los ejemplos, pero en prosa "palabra:" es
   la forma normal de introducir una lista. Lo detecté barriendo los juegos: `rg` veía
   "La forma clasica:" en `flexbox-levels.ts:439` y mi scanner no. Al quitar el filtro
   aparecieron **22 errores más en los módulos** (`### Problema clasico:`,
   `**Caracteristicas:**`, `Segui el orden del modulo:`, `no podria:`…), todos prosa
   legítima, ninguno código. **La primera versión de este informe decía 339; el número
   real es 361.** Las tablas, el reparto por track y los listados de §2.3 y §2.6 ya
   están recalculados.

Los cinco son la misma falla: **una herramienta de medición rota no da error, da un
número creíble.** Los tres primeros inflaban hallazgos; el cuarto y el quinto los
escondían — y el quinto es el peor, porque un recuento que falta por defecto se lee como
buena noticia y nadie lo audita. Cualquier medición que se repita sobre este contenido
conviene que traiga su control positivo, como el que se agregó en el punto 3, y que
compare su resultado contra un `rg` crudo sobre un caso conocido, que es lo que
finalmente destapó el punto 5.

**Cobertura, honestamente:**

- Los 112 módulos: leídos completos, los seis tracks. Sin huecos.
- La ortografía: medida sobre el 100% de los campos de prosa de los 112 módulos y sobre
  los 84 archivos `.tsx` de `src/app` y `src/components`.
- El copy de la app: el barrido mecánico de ortografía cubrió los 84 `.tsx`. La revisión
  **cualitativa** del copy (terminología, tono, mensajes de error) se hizo con `rg`
  dirigido sobre los 79 `.tsx` no-test, y **solo 6 archivos se leyeron línea por línea**:
  `landing/Secciones.tsx` (40-94), `layout/DojoSwitcher.tsx` (completo),
  `modulos/[slug]/leccion/[lessonId]/page.tsx` (295-319),
  `modulos/[slug]/ejercicio/[exerciseId]/page.tsx` (130-154),
  `teacher/estudiante/[id]/page.tsx` (70-89), `exercises/JsBehaviorExercise.tsx` (85-149).
  Todo lo demás se cubrió buscando patrones concretos (dojo/track/ruta/módulo/lección,
  formas de tuteo y voseo, `placeholder=`, `aria-label=`, "próximamente", "TODO",
  "lorem", "no se pudo", "intenta de nuevo"). **Es la parte más débil del informe: copy
  que no contenga esas palabras clave no fue revisado.**
- Sobre los mensajes de error y estados vacíos, lo que sí se revisó está bien: los "no
  encontrado" de `leccion/[lessonId]/page.tsx:308-309` y
  `ejercicio/[exerciseId]/page.tsx:144-145` no verbalizan la salida, pero tienen
  breadcrumb de vuelta (`:303-305` y `:139-141`). `dashboard/page.tsx:311` es un buen
  ejemplo: explica la causa y aclara que no depende del alumno. No hay "Lorem" ni "TODO"
  visible en producción; los "Próximamente" son estados de producto intencionales.
- Una afirmación sobre el ciclo de vida de React Router llegó sin respaldo y fue
  retirada del informe tras no poder confirmarse contra una fuente primaria (ver §5).
- **Fuera de alcance por acuerdo:** la rigidez de los `validation`/`answer` de los
  ejercicios, que audita otra sesión. Lo único que miré de los ejercicios fue su prosa
  (`prompt`, `hint`, `explanation`, `options[].text`).
- `src/data/games/*` sí se midió, en una pasada posterior: ver §6, con la clasificación
  de campos declarada.

---

## 6. Los juegos (`src/data/games/`)

Barrido posterior, pedido aparte y hecho con el mismo método que los módulos: los dos
archivos se convirtieron a JSON con node y se midió solo sobre los campos de prosa.

### 6.1 Qué conté como prosa y qué como código

`FLEXBOX_LEVELS` y `GRID_LEVELS` tienen 24 niveles cada uno, 48 en total. Declaro la
clasificación en vez de decidir en silencio, y verifiqué contra el renderizador
(`src/components/games/GameEngine.tsx`) cuáles llegan efectivamente a la pantalla:

**Prosa (se mide):** `title` (renderizado en `GameEngine.tsx:275`), `description`
(`:278`) y `hint` (`:314`). Son 144 bloques: 48 títulos, 48 descripciones, 48 pistas.

**Código (no se mide):** `property` (nombre de propiedad CSS, renderizado en `:273` y
como `placeholder` en `:343`), `initialCSS`, `solutionCSS` (renderizado en `:369`),
`validateFn`, `boardConfig.columns`/`rows`/`highlightCells`, `items[].id`,
`items[].color`, `items[].targetArea`, `targets[].gridArea`, `containerStyle`,
`id` y `xpReward`.

**Ambiguo, y por eso lo declaro en vez de contarlo:** `boardConfig.items[].label`. Se
renderiza al usuario (`GridBoard.tsx:262`, `FlexboxBoard.tsx:227`), así que por
visibilidad sería prosa. Pero los valores son dígitos (`1`…`6`), símbolos (`!`) y
nombres de área de layout en inglés (`Header`, `Nav`, `Sidebar`, `Content`, `Main`,
`Hero`, `Footer`, `Features`, `Side`, `Logo`), que funcionan como etiquetas técnicas
pareadas con los tokens de `gridArea`/`targetArea`. **No los medí**, porque acentuarlos
sería un error y porque traducirlos es una decisión de producto, no de ortografía.
Si se decide que el tablero hable español, ese campo entra al alcance y hay que revisarlo.

### 6.2 Resultado: 28 errores de tilde en 48 niveles

Ningún test del repo lee `src/data/games/`: `rg -l` sobre los archivos `.test.ts*` no
devuelve ninguna referencia a `GRID_LEVELS`, `FLEXBOX_LEVELS` ni a la ruta. Los dos
guards de ortografía corren solo sobre `src/data/modules`. **Estos 28 errores nunca
estuvieron cubiertos por nada.**

| Archivo | Errores |
|---|---|
| `grid-levels.ts` | 16 |
| `flexbox-levels.ts` | 12 |

- **cuadricula** → cuadrícula (5) — `grid-levels.ts`:87 (nivel 4, hint), :223 (nivel 12, title), :224 (nivel 12, description), :240 (nivel 12, hint), :436 (nivel 22, description)
- **linea** → línea (5) — `flexbox-levels.ts`:234 (nivel 13, title); `grid-levels.ts`:41 (nivel 2, description), :53 (nivel 2, hint), :87 (nivel 4, hint), :123 (nivel 6, hint)
- **alineacion** → alineación (3) — `flexbox-levels.ts`:32 (nivel 1, hint), :99 (nivel 5, hint); `grid-levels.ts`:457 (nivel 23, title)
- **posicion** → posición (3) — `flexbox-levels.ts`:36 (nivel 2, title), :410 (nivel 22, description); `grid-levels.ts`:40 (nivel 2, title)
- **clasica** → clásica (2) — `flexbox-levels.ts`:439 (nivel 23, hint); `grid-levels.ts`:369 (nivel 19, title)
- **demas** → demás (2) — `flexbox-levels.ts`:328 (nivel 17, hint), :458 (nivel 24, hint)
- Una sola vez cada una: **direccion** → dirección (`flexbox-levels.ts`:270, nivel 14, hint); **jerarquia** → jerarquía (`flexbox-levels.ts`:369, nivel 20, title); **limite** → límite (`grid-levels.ts`:74, nivel 4, title — es el sustantivo, "Avance hasta el limite", no el subjuntivo de *limitar*); **lineas** → líneas (`flexbox-levels.ts`:251, nivel 13, hint); **maximo** → máximo (`flexbox-levels.ts`:64, nivel 3, hint); **minimo** → mínimo (`grid-levels.ts`:414, nivel 21, description); **separacion** → separación (`grid-levels.ts`:247, nivel 13, description); **ultima** → última (`grid-levels.ts`:87, nivel 4, hint)

Los títulos son los peores porque son lo primero que se ve en la lista de niveles:
"Salto de linea", "Avance hasta el limite", "Cuadricula completa", "La forma clasica".

No hay ñ mutiladas en los juegos, y no hay interrogativas sin `¿` (los textos de los
niveles son imperativos, no preguntas).

### 6.3 El patrón: guards verdes con punto ciego

Tres casos en el mismo repo, y ya no se puede llamar coincidencia:

1. **`acentuacion.test.ts`** pasa sobre 92 `retoPasos[].instruccion` que su `prosaDe()`
   nunca lee (§2.5).
2. **`src/data/games/`** no lo cubre ningún test. 28 errores que nunca tuvieron red.
3. **`nav-iconos.test.ts`** — reportado por la otra sesión, y lo corroboré por encima:
   las líneas 24-26 guardan `Sidebar.tsx`, `MobileMenu.tsx` y `MobileNav.tsx`, pero
   `src/app/(app)/layout.tsx` solo importa `MobileMenu` (línea 6, renderizado en :106).
   No importa `Sidebar.tsx` — la línea 39 es el comentario `{/* Sidebar */}` — ni
   `MobileNav`, y `MobileMenu.tsx` define su propio `MobileNavLink` local en vez de usar
   el componente guardado. O sea: de los tres archivos que el test protege, uno se
   renderiza. Es un spot check, no una auditoría completa de ese test.

La forma es siempre la misma: **el guard afirma sobre el conjunto que su propia función
de extracción decide mirar, y ese conjunto se quedó atrás cuando los datos crecieron.**
Un test verde se lee como "esto está cubierto", y la lectura es falsa sin que nada falle.
No hace falta desconfiar de los tests; hace falta que cada guard de contenido declare
—y verifique— su denominador: cuántos campos existen contra cuántos mira.

---

## 7. Qué se corrigió (pasada de arreglos, 2026-09-18)

Territorio autorizado: `src/data/modules/**` (solo campos de prosa),
`src/data/modules/acentuacion.test.ts` y `src/data/games/**`. No se tocó
`src/app/**`, `src/components/**`, `src/lib/**`, ni los campos del corrector
(`validation`, `retoPasos[].esperado`, `codeTemplate`, `blanks`, `targetCSS`).
Sin commits.

### 7.1 El guard ciego

`acentuacion.test.ts` y `signos-interrogacion.test.ts` ahora incluyen
`retoPasos[].instruccion` en `prosaDe()`. `esperado` queda fuera a propósito: es
el CSS que el alumno tiene que escribir, no prosa.

El ciclo se hizo en el orden que lo prueba: **rojo primero.** Con el campo
agregado y antes de corregir nada, `acentuacion.test.ts` falló con 18
ocurrencias en 12 módulos — errores que llevaban ahí desde siempre y que el
guard ya sabía reconocer pero nunca miraba. Después de la corrección, verde.

Ese rojo también encontró dos palabras que mi propio diccionario no tenía:
`mas` ×2 en `14-especificidad` y `vacio` en `12-pseudo-elementos`.

### 7.2 Ortografía

| Dónde | Errores hallados | Corregidos | Sin tocar a propósito |
|---|---|---|---|
| `src/data/modules/**` (81 archivos de contenido) | 372 | 370 | 2 |
| `src/data/games/**` (2 archivos) | 44 | 44 | 0 |

Cómo se compone el 372 de módulos, porque vino de tres instrumentos distintos y
ninguno solo lo habría dado entero:

- **361** del scanner con diccionario de 300 formas (§2.2).
- **+3** que aportó el guard al ponerse rojo: `mas` ×2 en `14-especificidad` y
  `vacio` en `12-pseudo-elementos`, ninguna en mi diccionario.
- **+8** del barrido morfológico `-ción/-sión`, que no depende de una lista de
  palabras: `leccion` ×3, `negacion` ×3, `fraccion`, `presentacion`.

Los 44 de juegos son los 28 del §6 más 16 de esa misma familia `-ción`
(`formacion` ×9, `expansion` ×3, `meditacion`, `fraccion`, y dos más).

Contra-verificación del total: comparando la prosa extraída del commit base
`64e4802` contra el estado actual, aparecen 388 palabras acentuadas nuevas en
los módulos. La diferencia con los 370 son las ~18 que vienen en la prosa que se
agregó en esta pasada (la sección de XSS y la nota del Compiler), no en
correcciones.

**Dos casos que se dejaron sin tilde a propósito**, y conviene que queden por
escrito para que nadie los "arregle" después:

- `18-css-grid.ts:150,151` — "Grid areas" es el término técnico en inglés,
  pareado con `grid-template-areas`. Acentuar la segunda palabra de un compuesto
  inglés ("Grid Áreas") es peor que dejarlo. En cambio "las **áreas** de la
  cuadrícula" (`:155`) sí es prosa española y sí lleva tilde.
- Los 7 restantes de la familia `-ción` son código: `#seccion` en
  `14-especificidad` (es un id), `{condicion}` en
  `react-07-renderizado-condicional` (es JSX en las opciones) y `action={funcion}`
  en `react-18-react19` (es una celda de tabla con código).

### 7.3 Una sobrecorrección que introduje, y cómo apareció

Al acentuar la prosa escribí `artículo` en
`15-float-display.ts:420`, donde esa palabra **nombraba la clase CSS
`.articulo`**. Un enunciado que manda a estilar `.artículo` es peor que uno sin
tilde: el sin tilde se lee raro, el otro directamente no funciona — es el mismo
defecto que `selectores-del-enunciado.test.ts` existe para prevenir, y que su
propio encabezado documenta (un alumno sacó 67/100 haciendo exactamente lo que
el enunciado le pedía).

No lo encontré yo: lo encontró ese guard, que mira otra cosa. El arreglo sigue
la convención que el propio test fija — un selector se nombra como selector — y
quedó `El contenedor \`.articulo\` debe tener overflow: hidden`.

Barrí el resto del diff buscando la misma familia (toda palabra que acentué y
que además fuera nombre de clase, id o variable en ese módulo): dieron 7
candidatos, y el guard confirma que los otros 6 son prosa legítima ("el botón
sigue viéndose", "contra la página entera"), no nombres de identificadores.

**El caso latente también se cerró.** El mismo enunciado nombraba la otra clase
como `(clase 'foto')`, entre comillas en vez de como selector. No fallaba
—`foto` no lleva tilde— pero era la misma forma que produjo el defecto,
esperando a una palabra acentuable. Quedó como `.foto`, que además es la
convención que ese mismo archivo ya usaba en su reto (`:513`): era el único
enunciado del archivo que no la seguía.

### 7.4 Los cuatro bugs pedagógicos

1. **`react-17-testing.ts`** — el runner ahora corre de verdad. Monta el
   `Contador` en un contenedor oculto con `createRoot`, hace click en los
   botones reales y compara el texto del DOM contra lo esperado; el `detalle` de
   cada test dice qué esperaba y qué encontró. Antes los cuatro tests se
   empujaban con `paso: true` literal y el botón siempre daba 4/4 aunque el
   componente estuviera roto. La UI ya soportaba `paso: false`; no hizo falta
   tocarla.
2. **`js-25-proyecto-weather.ts`** — el nombre de ciudad que escribe el usuario
   ya no entra por `innerHTML`. **Eran cinco sitios**, repartidos en las tres
   lecciones del módulo: el estado "Buscando clima de…" (`:73`), el render del
   resultado (`:98`), el encabezado del pronóstico (`:200`), el render de
   favoritos (`:333`) y el botón de favoritos (`:296`). Los cinco pasaron a
   `textContent`, y con ellos los tres `error.message` / `err.message` /
   `e.message` que se concatenaban en los `catch` (`:85`, `:215`, `:343`).

   El de favoritos es el peor de los cinco y conviene decir por qué: esa ciudad
   sale de `localStorage`, así que un payload inyectado ahí **sobrevive al
   reload** y se vuelve a ejecutar en cada visita.

   Se agregó una sección a la lección ("El dato que escribe el usuario no se
   pega con innerHTML") porque el módulo nunca mencionaba XSS, aunque
   `js-12-dom-manipulacion` sí advierte del riesgo. Y se agregó la **excepción**,
   que es la parte que enseña: las temperaturas y la descripción siguen
   concatenándose en `innerHTML` porque ese marcado lo escribe el autor y esos
   valores vienen de la API. La regla quedó formulada como una pregunta sobre el
   origen, no sobre el tipo: **no es "¿es un dato?", es "¿quién lo escribió?"**.

   > **Corrección de este mismo informe.** La primera versión de §7 decía que
   > eran "tres sitios, no dos" y daba el punto por cerrado. Eran cinco. Los dos
   > que faltaban aparecieron recién al barrer los 15 `innerHTML` del archivo en
   > vez de ir a los que ya estaban señalados. Es el mismo defecto que este
   > informe describe en §7.7, cometido por quien lo escribió: **contar los
   > casos que alguien te marcó no es medir el conjunto.**
3. **`react-18-react19.ts`** — la lección y la explicación del quiz
   `react18-ej-01` ahora dicen que el React Compiler es una herramienta de build
   opcional, que se instala y configura aparte, y que actualizar a React 19 no
   lo activa solo.
4. **`ts-01` a `ts-04`** — las 8 lecciones tienen `codeExample.js`. El tab de JS
   sí se renderiza para ellas (`showJS={mod.dojo === "js"}` y los `ts-*`
   declaran `dojo: "js"`), así que estaba apareciendo vacío. El sandbox ejecuta
   JavaScript, no TypeScript, y eso se convirtió en el contenido: cada ejemplo
   muestra **lo que queda después de compilar** —los tipos borrados— y a
   continuación el error que TypeScript habría frenado en el editor y que
   JavaScript deja pasar en silencio.

### 7.5 Resultado de los gates

Corridos sobre el árbol completo, después de todos los cambios:

| Gate | Resultado |
|---|---|
| `npm run typecheck` | limpio, cero errores |
| `npm run test:run` | **453 de 453**, 42 archivos |
| `npm run lint` | 0 errores, 53 warnings preexistentes (`no-explicit-any`), **ninguno en `src/data`** |

Durante la pasada el typecheck estuvo rojo un rato por
`src/components/layout/MobileMenu.tsx(140,32): TS2304: Cannot find name 'conteos'`,
de otra sesión que en ese momento enhebraba una prop por tres componentes.
Se reportó igual en vez de darlo por verde: un gate rojo por trabajo ajeno sigue
siendo un gate rojo, y esconderlo detrás de "no es mío" es justo lo que este
informe le critica a los guards de §6.3. Ya está resuelto por su dueño.

**Nota para quien trabaje sobre este árbol:** hay una sesión sacando
`ALL_MODULES` del bundle de cliente — `DojoSwitcher` vive en el layout raíz del
área autenticada e importaba el currículum entero (~2,3 MB, con las respuestas
adentro) solo para contar módulos por dojo. Mientras la prop del conteo viaja de
un archivo al siguiente, un `TS2304` transitorio en `src/components` o
`src/app` es esperable.

No se corrió `npm run build`, `npm run dev` ni `test:e2e`: el `.env.local`
apunta a producción y el build pisaría el `.next` de las otras sesiones.

Verificación independiente del resultado: re-medido con el scanner sobre el
estado final, quedan **2 ocurrencias** en módulos (las dos de "Grid areas",
intencionales) y **0** en juegos.

### 7.6 Lo que NO se hizo

- **Tú/vos.** Resuelto después: ver §8.
- **Ampliar el diccionario del guard.** Tiene 61 formas; los errores corregidos
  incluyen 67 palabras que no están en esa lista, así que hoy el guard protege
  una fracción de lo que se arregló. Queda pendiente a propósito: con tres
  sesiones escribiendo sobre el mismo árbol, un diccionario de 300 palabras
  pondría en rojo contenido ajeno y nadie podría distinguir si el rojo es un
  error real o el diccionario nuevo. Se hace cuando el árbol esté libre.

  **Cuando se haga, el orden importa: primero terminaciones, después lista.**
  El conjunto de palabras mal escritas no es enumerable; el de terminaciones sí.
  Un diccionario de 300 formas iba a fallar por la misma razón que falló el de
  61 — `formacion`, `expansion` y `meditacion` no estaban en ninguno de los dos,
  y las tres las encontró una regla de tres letras. Si el guard nuevo se arma
  enumerando, arranca con el mismo agujero que el viejo, solo que más grande y
  más difícil de ver. Reglas morfológicas candidatas: `-ción`/`-sión` en
  singular, `-ía` en hiato (`jerarquía`, `categoría`), esdrújulas en `-ico`/`-ica`,
  y la familia `ni`/`n` por `ñ`.
- **`¿Cuando` vs `¿Cuándo` y otras tildes diacríticas** en interrogativas
  indirectas ("### Cuando usar areas vs líneas"). No estaban medidas y no se
  tocaron; es una categoría aparte, sin guard.
- El copy de `src/app/**` y `src/components/**`, incluidas las 20 "contrasena"
  sin ñ: territorio de otra sesión.

### 7.7 El patrón, ahora con cuatro casos

Los cuatro defectos de medición de esta sesión los encontró **una herramienta
distinta de la que produjo el resultado**, nunca la autorrevisión:

1. `rg` crudo contra mi scanner → el filtro de dos puntos escondía 22 errores.
2. Mi scanner contra `rg` → "La forma clasica:" visible para uno, invisible para
   el otro.
3. Un barrido genérico `-ción/-sión` contra mi diccionario de 300 palabras → 32
   errores más que ninguna lista enumerada iba a tener ("formacion", "expansion",
   "meditacion").
4. `selectores-del-enunciado.test.ts` contra mi corrección de tildes → la
   sobrecorrección de `.articulo`.
5. Un barrido de los 15 `innerHTML` del archivo contra los tres casos que ya
   estaban señalados → los otros dos sitios de XSS, incluido el que persiste en
   `localStorage`.

El quinto merece su propia línea, porque es el más incómodo: los tres casos de
XSS venían señalados en este mismo informe, se arreglaron los tres, y el punto
se dio por cerrado. Eran cinco. **Contar los casos que alguien te marcó no es
medir el conjunto**, y la diferencia solo aparece cuando se enumera el conjunto
entero — acá, todos los `innerHTML` del archivo, no los que estaban en la lista.

Y es la misma forma que el §6.3: **un guard afirma sobre el conjunto que su
propia función de extracción decide mirar.** Revisar esa función con la misma
cabeza que la escribió no sirve; hace falta un segundo instrumento que mire
desde otro ángulo. Para el contenido de este repo eso significa, en concreto:
ninguna medición de ortografía debería aceptarse sin contrastarla contra un
barrido morfológico genérico —terminaciones, no palabras— y sin un control
positivo que demuestre que la herramienta detecta un caso que ya se sabe malo.

---

## 8. Unificación en voseo

**Decisión de Diego: voseo para toda la plataforma**, porque es como habla él.
Se ejecuta en dos etapas, con una parada entre medio.

### 8.1 Etapa A — los 13 módulos que se contradecían (hecha)

Estos no eran una decisión de voz, eran un defecto: el mismo archivo cambiaba de
registro entre un párrafo y el siguiente. **171 conversiones**, 158 líneas, y en
todas el número de palabras es idéntico a ambos lados del diff — son
conjugaciones, no reescrituras.

Vinieron en tres tandas, porque una sola pasada no alcanzó:

1. **159 automáticas.** 70 formas inequívocas de 2ª persona
   (`necesitas`→`necesitás`, `puedes`→`podés`, `tienes`→`tenés`) y 89
   imperativos dirigidos al alumno (`usa`→`usá`, `completa`→`completá`).
2. **10 imperativos a mitad de oración**, que la regla de "arranque de oración"
   no veía: "…a varios elementos, **usa** una clase", "luego **agrega** media
   queries", "Para evitar repetir valores, **usa** `repeat()`".
3. **12 residuos** que encontró un barrido por terminación `-as`/`-es`, no por
   lista de palabras.

### 8.2 Lo que NO se convirtió, que es la mitad del trabajo

De 129 candidatos a imperativo, **43 eran tercera persona del indicativo**, no
órdenes:

| Aparece como | Y en realidad es |
|---|---|
| "El **selector de clase** selecciona todos los elementos" | el selector *selecciona* |
| "`map()` **crea** un nuevo array" | map *crea* |
| "`max-width` **define** el ancho máximo" | max-width *define* |
| "una **propiedad** guarda un valor" | la propiedad *guarda* |
| "Si el navegador no encuentra la primera, **prueba** la siguiente" | el navegador *prueba* |

Los 13 `selecciona`, los 5 `define` y los 2 `guarda` del lote son todos
descripción. Convertirlos habría roto la prosa en silencio, y ningún test lo
habría detectado: `selecciona` → `seleccioná` es sintácticamente impecable y
semánticamente absurdo.

### 8.3 Dos hallazgos laterales que el barrido morfológico destapó

Los dos confirman, por tercera vez en este informe, que una lista enumerada no
cierra:

- **Cuatro tuteos que no estaban en ninguna lista:** `pasas`, `quitas`,
  `trabajas`, `arrancas`. Aparecieron buscando la *terminación* `-as`/`-es`
  precedida de `si`/`cuando`/`que`, no buscando palabras.
- **Cinco formas de voseo escritas sin tilde**, que el barrido de ortografía de
  §2 **no podía ver** porque `podes`, `tenes` y `estas` no figuran en ningún
  diccionario de tuteo: `02-selectores.ts:418` ("un atributo que **podes**
  repetir"), `30-proyecto-cv-css.ts:52` ("Si no **tenes** tu CV", "cuando
  **estas** estilando"), `:88` ("**Estas** atando tus estilos"), `:431` ("algo
  que **podes** mostrar"). Estaban desde antes de esta pasada. Un guard de
  acentuación construido solo sobre tuteo tiene ese punto ciego por diseño.

### 8.4 Etapa B — medición antes de tocar nada

No se ejecutó. Se midió primero, a propósito: convertir dos tracks enteros que
hoy son coherentes no es arreglar un defecto, es cambiar una voz, y eso se
aprueba con una muestra, no con un informe.

| track | módulos | strings | 2ª persona | imperativos (candidatos) | total |
|---|---|---|---|---|---|
| html | 17/17 | 106 | 24 | 104 | 128 |
| react | 20/20 | 120 | 65 | 87 | 152 |
| js | 28/29 | 86 | 36 | 74 | 110 |
| css (los 23 restantes) | 28/36 | 177 | 66 | 162 | 228 |
| nextjs | 5/5 | 11 | 8 | 4 | 12 |
| react-eco | 4/5 | 8 | 4 | 5 | 9 |
| **TOTAL** | **102** | **508** | **203** | **436** | **639** |

**La columna de imperativos son candidatos, no trabajo.** En la Etapa A, de 129
candidatos solo 86 resultaron órdenes reales: el 67%. Con esa proporción, el
trabajo efectivo ronda las **490 conversiones**, y las ~150 restantes son
precisamente las que hay que dejar quietas — que son las que cuestan.

html (128) y react (152) suman 280, menos de la mitad del total: el grueso está
en los 23 módulos de css que quedaron fuera de la Etapa A.

### 8.5 Qué cambia y qué no

Cambian las **conjugaciones**, no los posesivos:

- Imperativos: `usa`→`usá`, `escribe`→`escribí`, `mira`→`mirá`, `pon`→`poné`,
  `haz`→`hacé`, `ten`→`tené`.
- Presentes: `tienes`→`tenés`, `puedes`→`podés`, `quieres`→`querés`,
  `necesitas`→`necesitás`, `defines`→`definís`.
- Pronombre: `tú`→`vos`, `ti`→`vos`, `contigo`→`con vos`.
- **No cambian:** `tu código`, `tus estilos`, `te queda`, `se te rompe` — son
  iguales en las dos formas, y tocarlos es ruido en el diff.
- **No cambian los subjuntivos:** `cuando quieras`, `mientras tengas`, `siempre
  que puedas` son idénticos en voseo rioplatense.
- **No se toca** nada dentro de backticks, bloques de código, `codeExample` ni
  strings de HTML/CSS/JS, ni nada que nombre un identificador. Es la misma
  trampa del `.articulo` de §7.3, con más superficie.

### 8.6 Etapa B — ejecutada (los 87 módulos restantes)

**549 conversiones aplicadas. 1.113 candidatos descartados por ser tercera
persona** — el doble de lo que se convirtió. Ahí estuvo el trabajo.

| track | archivos | conversiones | descartados 3ª pers. |
|---|---|---|---|
| html | 17 | 115 | 146 |
| react | 20 | 143 | 174 |
| js | 26 | 88 | 188 |
| css (los 23 restantes) | 16 | 187 | 537 |
| nextjs | 5 | 11 | 30 |
| react-eco | 3 | 5 | 38 |
| **TOTAL** | **87** | **549** | **1.113** |

661 líneas cambiadas, con el mismo número de palabras a ambos lados en las 661:
cero cambios estructurales. Gates: typecheck limpio, **453/453**, lint 0 errores.
Residuo medido al cierre sobre los 112 módulos: **cero** formas inequívocas de
tuteo y cero voseo sin tilde.

### 8.7 Las cuatro clases de tercera persona que ninguna regla local ve

El clasificador se fue endureciendo a medida que aparecían. Se dejan escritas
porque cualquier pasada futura sobre esta prosa se va a topar con las mismas:

1. **Sujeto que es una cosa.** "El **sistema** de grid usa 12 columnas", "La
   **etiqueta** `<ol>` crea una lista", "`<dt>` **define** el término". Se
   detecta por la lista de sujetos típicos (la etiqueta, el elemento, la
   propiedad, el selector, el navegador, el sistema…) y por una etiqueta HTML
   inmediatamente antes.
2. **Títulos de lección.** `13-attribute-selectors` tiene uno llamado "Empieza
   con, termina con, contiene": nombra tres operadores, no ordena nada. Se
   deniegan todos los títulos por regla. Perder un título imperativo es
   cosmético; convertir uno nominal rompe la prosa.
3. **Etiquetas de `dropZones` y textos de `options`.** "Define el orden de
   tabulación" describe lo que hace `tabindex`, no se lo pide al alumno.
4. **Sujeto en la oración anterior.** `28-bootstrap`: "El sistema de grid es la
   base de Bootstrap. **Usa** un sistema de 12 columnas". Ninguna regla local lo
   alcanza. Se denegó a mano, en vez de ensanchar una regla que se habría
   llevado puestos casos legítimos.

A eso se suma el criterio de fondo, que vale más que las cuatro reglas: **ante
la duda, no tocar.** Un tuteo que sobrevive es un defecto cosmético; una
descripción convertida en orden es prosa rota, y no hay test que la vea.

### 8.8 Un bug de la Etapa A, encontrado durante la B

La máscara de código tapaba las cercas ` ``` ` pero **no las escapadas**
(`` \`\`\` ``), que es como aparecen dentro de un template literal en el fuente
`.ts`. En la Etapa A eso dejó pasar **tres conversiones dentro de bloques de
código**: `14-especificidad.ts` (`/* Primero declarás el orden */`),
`26-sass-fundamentos.ts` (`// SCSS que escribís`) y `js-09-metodos-arrays.ts`
(`// Para numeros, necesitás una funcion`).

Las tres son **comentarios en español**, no código que se rompa, y quedan
convertidas — pero quedan así por decisión, no por descuido. La máscara ya
cubre ambas formas.

El bug se encontró leyendo la salida del clasificador y viendo aparecer texto
que debería haber estado enmascarado: `<!-- Usa strong cuando el texto es
IMPORTANTE -->`. Primero verifiqué que el barrido de ortografía de §2 no
estuviera afectado — no lo estaba, porque ese medía sobre el JSON evaluado,
donde las cercas ya vienen sin escapar — y recién después lo arreglé para la
Etapa B.

---

## 9. El diccionario del guard: terminaciones primero

Última pasada. Se amplió `acentuacion.test.ts` en el orden acordado —**reglas
morfológicas primero, lista después**— porque el conjunto de palabras mal
escritas no es enumerable y el de terminaciones sí. Un diccionario armado
enumerando nace con el mismo agujero que tenía el viejo, solo que más grande.

### 9.1 Las cuatro reglas

1. **`-ción`/`-sión` en singular.** El plural pierde la tilde (`funciones`), y el
   `\b` final ya lo deja afuera. Excepción declarada: `ion`.
2. **Familias de sufijo con `i` tónica:** `-grafía`, `-logía`, `-metría`,
   `-nomía`, `-arquía`, `-goría`. **No vale una regla general de `-ía`**:
   `materia`, `historia`, `distancia` y `democracia` van sin tilde, y exigírsela
   sería un error peor que la omisión.
3. **Formas que solo existen en voseo** (`podes`, `tenes`, `escribis`, `decis`,
   `repetis`…). Son invisibles para los dos barridos anteriores: no son tuteo,
   así que un barrido de voz no las ve, y no figuran en ningún diccionario
   armado sobre tuteo. **Lo que deliberadamente NO está:** `estas` (demostrativo)
   y `puedes`/`sabes`/`haces` (tuteo válido en castellano). Eso es cuestión de
   voz, no de ortografía, y no es de este guard.
4. **La `ñ` escrita como `n` o `ni`** (`espanol`, `contrasena`, `tamanio`,
   `anos`). La más grave, porque sale en pantalla y se lee como otro idioma.

Cada regla trae **control positivo y control negativo, en tests distintos**: uno
prueba que caza lo que debe, el otro que no se pasa de rosca. Un solo control no
distingue "la regla anda" de "la regla matchea todo".

### 9.2 La trampa en la que caí, que el propio archivo ya documentaba

La primera versión de las reglas dio **10 fallas, y las 10 eran falsos
positivos**. En JavaScript `\b` es ASCII, así que entre `n` y `ó` hay frontera
de palabra: `-cion\b` matchea **dentro** de `funcionó`, `fusionó`, `Seleccioná`
e `inspeccionás` — todas perfectamente escritas. El guard reclamaba tildes que
ya estaban puestas.

`acentuacion.test.ts` **ya advertía exactamente de esto** en el comentario de
`ocurrenciasQueSonError`, con la misma medición y la misma conclusión: "un guard
que rechaza prosa correcta no protege la ortografía, empuja a escribirla peor
para callarlo". Lo leí al empezar la sesión, lo cité en §7, y aun así escribí la
regla sin el lookahead. Ahora las cuatro llevan `(?![a-záéíóúñüA-ZÁÉÍÓÚÑÜ])`.

Y el falso positivo no lo vi leyendo la regla: lo vi cuando imprimí **de dónde
salía cada match**. La lista de fallas se leía como diez errores plausibles;
el contexto mostraba diez palabras bien escritas.

**Un resultado que parece razonable es el más peligroso de todos, porque no
pide que lo mires dos veces.** Diez fallas de ortografía en un currículum de
112 módulos es exactamente lo que uno espera encontrar: no sorprende, no chirría,
invita a arreglarlas y seguir. Si el número hubiera sido cero o mil, habría
mirado. Fue plausible, y por eso casi pasa.

Y hay algo peor que anotar, porque no es anécdota: **saber que una trampa existe
no alcanza para no pisarla.** Esa advertencia estaba escrita, medida y fechada
en el archivo que yo estaba editando. La misma sesión la vio repetirse en el
otro sentido: el barrido de residuo al cerrar la Etapa B volvió a medir sobre el
archivo crudo contando código como prosa —el error corregido nueve horas
antes— y reportó diez errores que no existían. Dos veces el mismo defecto, en
dos manos distintas, con la corrección ya escrita.

Esa es la razón por la que las verificaciones cruzadas no son burocracia: **si
leer la advertencia bastara, el guard sobraría.**

### 9.3 Dos palabras que el guard NO puede exigir

- **`areas`.** `\b` trata el guion como frontera, así que
  `grid-template-areas` —el nombre de la propiedad, que va sin tilde— matchea
  `areas`, y el guard reclamaría una tilde que rompería el código.
- **`menu`.** `<menu>` es un elemento HTML real (aparece como opción de quiz en
  `html-semantica`) y `.menu` es una clase corriente.

Las dos quedan sin cubrir **a propósito y con el motivo escrito en el código**.
Es el precio de no romper lo que nombran.

### 9.4 Lo que el guard nuevo encontró

Fue rojo primero, como corresponde. Descontando los 10 falsos positivos, los
errores reales fueron **31**, todos invisibles para los barridos previos:

- **17 que escondía un filtro mío**, el mismo defecto que el de los dos puntos
  en §7: mi scanner descartaba toda palabra seguida de `)`. En prosa el
  paréntesis que cierra un inciso es constante — "(horizontal en espanol)",
  "(elementos de cuadricula)", "(problema en ingles)" —, así que el filtro
  silenciaba una categoría entera.
- **6 que ninguna lista tenía**, cazados por terminación: `tecnologia` ×4,
  `metodologia` ×2, `repetis`.
- **8 formas flexionadas** que la búsqueda por palabra exacta no alcanza:
  `clasicos`, `clasicas`, `cuadriculas` ×3, `tendras` ×3, `tendrias`,
  `proximos`.

Estado final: `acentuacion.test.ts` pasa sus **16 tests**, y la suite completa
**456 de 456**, typecheck limpio, lint 0 errores.

### 9.5 El hueco de los juegos, cerrado

`acentuacion.test.ts` ahora también recorre `GRID_LEVELS` y `FLEXBOX_LEVELS`.
Era el último agujero de §6.3: se corrigieron 44 palabras en
`src/data/games/**` y ningún test las cuidaba. **Un arreglo sin red no es un
arreglo, es una pausa** — ese contenido ya se escribió mal una vez y podía
volver sin que nada fallara.

Los campos se declaran en el propio test, no se suponen. **Prosa:** `title`,
`description` y `hint`, las tres renderizadas al alumno (`GameEngine.tsx:275`,
`:278`, `:314`). **Código:** `property`, `initialCSS`, `solutionCSS`,
`validateFn`, `boardConfig.*`, `id`, `xpReward`. **Ambiguo y declarado como
tal:** `boardConfig.items[].label`, que *sí* se renderiza (`GridBoard.tsx:262`,
`FlexboxBoard.tsx:227`) pero cuyos valores son dígitos, símbolos y nombres de
área de layout en inglés (`Header`, `Nav`, `Sidebar`). No se mide: acentuarlos
sería un error y traducirlos es una decisión de producto.

**Rojo primero, demostrado y no afirmado.** Como el contenido ya estaba
corregido, el guard nuevo nacía verde, y un guard que nace verde no probó nada.
Se corrieron las mismas reglas contra la versión de los juegos en el commit
base `64e4802`: **52 fallas sobre 48 niveles**. Sobre el estado actual, cero.

El test trae además dos controles que no dependen del contenido: uno verifica
que `prosaDeNivel` realmente llega a los tres campos —si el extractor se
rompiera, el barrido daría cero y el cero se leería como "los juegos están
limpios"— y otro exige que haya más de 40 niveles, para que renombrar un export
no deje el barrido corriendo sobre el conjunto vacío.

### 9.6 Lo que sigue sin guard

- **El copy de `src/app/**` y `src/components/**`.** El guard solo mira
  `src/data/modules` y `src/data/games`.
- **Tildes diacríticas en interrogativas indirectas** ("Cuando usar" →
  "Cuándo usar").
- **La voz.** El guard cuida la ortografía, no el registro. Que vuelva a
  aparecer `puedes` en vez de `podés` es correcto en castellano y ningún test
  lo va a marcar.
