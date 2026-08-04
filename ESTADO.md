# Estado del proyecto

Punto de retomada. Última actualización: 2026-08-04, `main` @ `bfc15a7`, todo deployado.

> Este archivo existe para que una sesión nueva no tenga que redescubrir nada. Si
> hacés cambios grandes, actualizalo o borralo — un documento desactualizado es
> peor que ninguno.

---

## Cómo continuar en un chat nuevo

La memoria del proyecto vive en **Engram** (32+ observaciones, scope `css-dojo`).
Se carga sola al arrancar la sesión, pero conviene pedirla explícitamente.

Ojo con la búsqueda: por defecto exige que **todos** los términos coincidan. Si
no encontrás nada, usá `match_mode: "any"`.

Los artefactos de planificación SDD están en `openspec/changes/` y además
espejados en Engram por `topic_key`.

---

## Qué se hizo (4 cambios, 8 PRs, todos mergeados y deployados)

| Cambio | Qué resolvió |
|---|---|
| `automated-gates` (PR #1, #2) | `npm run lint` estaba **roto** desde el paso a Next 16 (`next lint` fue eliminado). Se agregó config flat de ESLint, `typecheck`, Vitest, Playwright y CI en GitHub Actions. Se arreglaron 11 errores de React. |
| PR #3 | El CI validaba en Node 24 mientras producción compila en **Node 22**. Alineado, y se agregó `engines.node`. |
| `loader-moderno-dojo` (PR #4) | El loader del landing: anillo determinado atado al progreso real de los `.glb`, anuncios `aria-live`, y salida al landing estático si un asset falla (antes el overlay quedaba para siempre). |
| Validación de ejercicios (PR #5) | **61 ejercicios se aprobaban sin hacerlos.** Se reemplazó búsqueda de substrings por parseo real: `css-rules` y `html-structure`. |
| Track CSS (PR #6, #7, #8) | Proyecto integrador (módulo 25), reorden pedagógico, y un ejercicio que pedía flexbox diez módulos antes de enseñarlo. |

Tres bugs que veían los usuarios y ya no: el loop infinito contra el endpoint de
OTP en el reset de contraseña, el rango de 0 XP que veían todos en el nav móvil,
y un timer filtrado en los juegos.

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

**Nada ordena por el campo `order`.** `src/app/(app)/modulos/page.tsx` agrupa por
`category` (`intro → intermediate → advanced → preprocessors → frameworks →
project`) y solo ordena por posición del array dentro de cada grupo. Mover un
módulo sin mover su categoría **no cambia nada en pantalla**. Hay un test que lo
verifica.

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
npm run test:run     # 98 tests
npm run test:e2e     # Playwright, chromium
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
  una técnica enseñada más de 3 módulos después.

---

## Pendiente, en orden de valor

1. **CSS moderno ausente.** `:is()` y `:where()` no aparecen en todo el track, con
   un módulo entero de especificidad (11). `:has()` falta del de pseudo-clases (9).
   `@container` del de media queries (17). También `aspect-ratio`, `@supports`,
   `@layer`, `subgrid`, `min()`. Y `text-align` **no se enseña formalmente en
   ningún módulo**.
2. **Ortografía.** 1 vocal acentuada y cero `¿` en 24 módulos, con 89 preguntas sin
   abrir — mientras la UI de la app tiene 85 acentos. Afecta también al track HTML.
   Mecánico pero toca cientos de strings; verificar que no rompa tokens de
   validación ni textos esperados por tests.
3. **Los proyectos de HTML y React se renderizan en medio de la lista.** Siguen bajo
   `*-advanced`. La categoría `project` ya existe y el patrón está probado: son
   quince minutos.
4. **La plantilla uniforme.** Los 24 módulos originales tienen exactamente 3-4
   lecciones y 8 ejercicios. Flexbox y "qué es CSS" con el mismo peso. Los módulos
   de Sass (21-22) no tienen `live-editor` ni `visual-match` — justo donde hace
   falta ver el CSS compilado.
5. **Deuda técnica.** 35 `@typescript-eslint/no-explicit-any` como warnings.
   `globals.css:15-18` declara `--color-css-purple` y `--color-ts-blue` dos veces
   cada uno. La corrección de ejercicios es del lado del cliente, así que un alumno
   determinado puede inspeccionarla — cerrarlo implica validación en el servidor.
6. **Referencias hacia adelante en lecciones**: quedan ~23, medidas y con umbral en
   el test. Dominadas por `display: flex` en ejemplos previos al módulo 15. Es
   tolerable: un ejemplo de CSS no puede escribirse sin propiedades.

### Decisiones ya tomadas, no reabrir

- Los tres ejercicios de Bootstrap/Tailwind se corrigen por **clases en HTML**, no
  por CSS parseado. Tienen `targetCSS` vacío a propósito.
- Unidades y dimensiones son **circulares** por naturaleza: no se puede enseñar
  `width` sin una unidad ni demostrar `vw` sin una propiedad. Ningún orden lo
  resuelve; se resuelve introduciendo `px` informalmente.
- `float-display` (13) hace un preview intencional de flexbox y grid, y lo dice en
  el texto. No es deuda.
