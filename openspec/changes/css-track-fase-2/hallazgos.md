# Hallazgos — producción, medida el 2026-08-25

Read-only queries against the `cssdojo` production database. Every number below
carries the command or the collection it came from, because a number in a record
without its measurement is how the last seven stale records in this repo started.

## Base

| Medición | Valor |
|---|---|
| Alumnos | 35 (34 aprobados) |
| Cohorte 1 / Cohorte 2 | 21 / 14 |
| Documentos en `progresses` | 5289 |
| Usuarios con algún progreso | 27 |
| `completed: true` | 5251 de 5289 (**99.3 %**) |

## 1. El track CSS no tiene curva de abandono

Cohorte 1 es la señal limpia: 21 alumnos, **todo visible, cero módulos
desactivados**.

```
 1 que-es-css         12      17 flexbox            9
 2 selectores         11      18 css-grid           9
 3 propiedades-basicas 11     24 variables-css      9
 4 box-model           9      25 media-queries      9
 5 unidades-css        9      26 sass-fundamentos   8
 6 dimensiones        10      27 sass-avanzado      7
 8 tipografias        10      28 bootstrap-5        9
10 selectores-desc.   10      29 tailwind-css       0
```

Plana del módulo 2 al 28. El embudo real es
`21 inscriptos → 15 con algún progreso → 12 llegan a CSS módulo 1 → 9 sostienen
hasta el 28`. Ejercicios por alumno: `656, 505, 449, 442, 440, 335, 335, 332,
289, 148, 139, 125, 49, 6, 5` — nueve arriba de 289, seis abajo de 148, nada en
el medio.

**Se pierde gente en la ENTRADA, no en el camino.**

## 2. Los ceros no prueban que se saltee nada

| Módulo | Alumnos | Agregado |
|---|---|---|
| `math-functions` (7) | 0 | **2026-08-22** |
| `attribute-selectors` (13) | 0 | **2026-08-23** |
| `lists-and-tables` (20) | 0 | **2026-08-23** |
| `transforms` (22) | 0 | **2026-08-23** |
| `shadows-gradients-filters` (21) — control | 9 | 2026-03-25 |
| `transiciones-animaciones` (23) — control | 9 | 2026-03-25 |

Cohorte 1 dejó de trabajar el **2026-08-12**. Los cuatro ceros son más nuevos
que la cohorte.

## 3. `completed` no discrimina, y no hay paredes por dificultad

99.3 % de los documentos están en `completed: true`. Los alumnos **no fallan
ejercicios, dejan de hacerlos**. Los intentos por ejercicio van de 1.07 a 2.00;
los máximos son `que-es-css` (1.99) y `tipografias` (1.79).

`especificidad` (14), que la hipótesis señalaba como pared, está en **1.36**. No
es un acantilado.

## 4. `tailwind-css` (29): calendario, no interés

Es el único cero que la antigüedad no explica — entró el 2026-03-25, mismo commit
que módulos con 9 alumnos, y está `enabled` para la cohorte 1.

Último día de actividad de los 9 que hicieron `bootstrap-5` (28):

```
07-03  07-05  07-06  07-07  07-08  07-11  07-12  07-12   ·   08-12
```

Ocho de nueve en una ventana de nueve días. Eso es una cohorte terminando junta.
Hicieron del 1 al 28 y se les acabó el curso.

## 5. El default de visibilidad es BLOQUEADO, y ahí se pierden módulos

`src/app/api/modules/enabled/route.ts`: después de migrar, un módulo es visible
**solo si existe un doc `ModuleSettings` con `enabled: true`** para esa cohorte.
Sin doc, no se ve.

Consecuencia medida: **un módulo recién agregado nace invisible para todas las
cohortes** hasta que alguien lo habilita. Cualquier lectura de "cero progreso"
tiene que chequear visibilidad primero, o confunde "nadie lo quiso" con "nadie
lo pudo ver".

Estado encontrado en los extremos del track, invertido:

| slug | cohorte 1 | cohorte 2 |
|---|---|---|
| `bootstrap-5` (28) | enabled | sin doc |
| `tailwind-css` (29) | enabled | sin doc |
| `proyecto-cv-css` (30) | **sin doc** | **enabled** |

La cohorte que terminó los 28 módulos no podía ver el proyecto final; la que va
por el módulo 10, sí. Corregido el 2026-08-25 con autorización explícita del
instructor: habilitado para la cohorte 1, deshabilitado para la 2. Cero
documentos de progreso en ese módulo en ambas cohortes, así que no se interrumpió
trabajo de nadie.

## 6. El hueco que la instrumentación cierra

`Progress` se escribe **solo al enviar un ejercicio**. Un alumno que abre un
módulo, lo lee y se va no deja ningún rastro. Por eso "lo salteó" y "nunca lo
abrió" eran indistinguibles — y esa es exactamente la distinción que la
clasificación necesita.

`ModuleView` (PR #33) lo resuelve. Desde su deploy, la cohorte 2 genera el dato.

## Cómo reproducir

Las consultas fueron scripts de un solo uso con `mongoose`, leyendo
`MONGODB_URI` de `.env.local`, borrados después de correr. Solo lecturas:
`countDocuments`, `distinct` y `aggregate` sobre `progresses`, `users` y
`modulesettings`. Las fechas de alta de módulo salen de
`git log --follow --diff-filter=A -- <archivo>`.
