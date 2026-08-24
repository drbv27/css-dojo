import type { ModuleData } from "@/types";

// Los archivos del track CSS llevan el numero de su campo `order`, y esa
// alineacion se hizo el 2026-08-24 renombrando 27 de los 30 archivos. El orden
// real lo sigue fijando `order` mas el `.sort()` del final de este archivo: el
// nombre del archivo no tiene efecto en runtime, solo orienta a quien abre la
// carpeta.
//
// Los ids de leccion y ejercicio NO se renumeraron, a proposito. Llevan el
// prefijo que tenia el archivo ANTES del renombre, asi que `22-transforms.ts`
// contiene ids `30-leccion-01`. Parece un olvido y no lo es:
//
//   `exerciseId` es clave de persistencia. `src/lib/models/Progress.ts` lo
//   guarda como String y lo indexa junto a userId y moduleId
//   (`{ userId: 1, moduleId: 1, exerciseId: 1 }`). Renumerar los ids
//   huerfanaria el progreso ya guardado de cada alumno en los 27 modulos
//   renombrados: sus ejercicios completados dejarian de matchear y volverian a
//   aparecer sin hacer. Son 381 ids con prefijo numerico.
//
//   Ademas hay tests que los referencian por string literal, por ejemplo
//   `validacion-curriculum.test.ts` con "23-ej-05".
//
// Un id es una identidad, no una posicion. Si algun dia hay que renumerarlos,
// necesita una migracion de la coleccion Progress en el mismo movimiento, no un
// renombre.

// HTML modules
import { htmlQueEsModule } from "./html-01-que-es-html";
import { htmlEstructuraModule } from "./html-02-estructura-basica";
import { htmlTextoModule } from "./html-03-texto-y-encabezados";
import { htmlEnlacesModule } from "./html-04-enlaces";
import { htmlImagenesModule } from "./html-05-imagenes-multimedia";
import { htmlListasModule } from "./html-06-listas";
import { htmlTablasModule } from "./html-07-tablas";
import { htmlFormulariosModule } from "./html-08-formularios-basicos";
import { htmlFormulariosAvanzadosModule } from "./html-09-formularios-avanzados";
import { htmlSemanticaModule } from "./html-10-semantica";
import { htmlAtributosModule } from "./html-11-atributos-globales";
import { htmlAccesibilidadModule } from "./html-12-accesibilidad";
import { htmlMetaSeoModule } from "./html-13-meta-seo";
import { htmlMediaAvanzadoModule } from "./html-14-media-avanzado";
import { htmlBuenasPracticasModule } from "./html-15-buenas-practicas";
import { htmlProyectoCVModule } from "./html-16-proyecto-cv";
import { htmlInteractivosModule } from "./html-17-elementos-interactivos";

// CSS modules
import { queEsCSSModule } from "./01-que-es-css";
import { selectoresModule } from "./02-selectores";
import { propiedadesBasicasModule } from "./03-propiedades-basicas";
import { tipografiasModule } from "./08-tipografias";
import { dimensionesModule } from "./06-dimensiones";
import { mathFunctionsModule } from "./07-math-functions";
import { advancedTextModule } from "./09-advanced-text";
import { attributeSelectorsModule } from "./13-attribute-selectors";
import { listsAndTablesModule } from "./20-lists-and-tables";
import { transformsModule } from "./22-transforms";
import { selectoresDescendientesModule } from "./10-selectores-descendientes";
import { pseudoClasesModule } from "./11-pseudo-clases";
import { pseudoElementosModule } from "./12-pseudo-elementos";
import { especificidadModule } from "./14-especificidad";
import { unidadesCSSModule } from "./05-unidades-css";
import { boxModelModule } from "./04-box-model";
import { posicionamientoModule } from "./16-posicionamiento";
import { floatDisplayModule } from "./15-float-display";
import { propiedadesLogicasModule } from "./19-propiedades-logicas";
import { flexboxModule } from "./17-flexbox";
import { cssGridModule } from "./18-css-grid";
import { mediaQueriesModule } from "./25-media-queries";
import { transicionesAnimacionesModule } from "./23-transiciones-animaciones";
import { variablesCSSModule } from "./24-variables-css";
import { shadowsGradientsFiltersModule } from "./21-shadows-gradients-filters";
import { sassFundamentosModule } from "./26-sass-fundamentos";
import { sassAvanzadoModule } from "./27-sass-avanzado";
import { bootstrapModule } from "./28-bootstrap";
import { tailwindModule } from "./29-tailwind";
import { proyectoCvCssModule } from "./30-proyecto-cv-css";

// JS modules
import { jsQueEsModule } from "./js-01-que-es-javascript";
import { jsVariablesTiposModule } from "./js-02-variables-tipos";
import { jsOperadoresModule } from "./js-03-operadores";
import { jsStringsModule } from "./js-04-strings";
import { jsCondicionalesModule } from "./js-05-condicionales";
import { jsCiclosModule } from "./js-06-ciclos";
import { jsFuncionesModule } from "./js-07-funciones";
import { jsArraysModule } from "./js-08-arrays";
import { jsMetodosArraysModule } from "./js-09-metodos-arrays";
import { jsObjetosModule } from "./js-10-objetos";
import { jsDomSeleccionModule } from "./js-11-dom-seleccion";
import { jsDomManipulacionModule } from "./js-12-dom-manipulacion";
import { jsEventosModule } from "./js-13-eventos";
import { jsDomEstilosModule } from "./js-14-dom-estilos";
import { jsLocalStorageModule } from "./js-15-localstorage";
import { jsFormulariosModule } from "./js-16-formularios";
import { jsAsincronismoModule } from "./js-17-asincronismo";
import { jsFetchApiModule } from "./js-18-fetch-api";
import { jsEs6ModernoModule } from "./js-19-es6-moderno";
import { jsClasesPooModule } from "./js-20-clases-poo";
import { jsErroresModule } from "./js-21-errores";
import { jsPatronesModule } from "./js-22-patrones";
import { jsProyectoTodoModule } from "./js-23-proyecto-todo";
import { jsProyectoQuizModule } from "./js-24-proyecto-quiz";
import { jsProyectoWeatherModule } from "./js-25-proyecto-weather";

// TypeScript modules (within JS track)
import { tsIntroModule } from "./ts-01-introduccion";
import { tsTiposAvanzadosModule } from "./ts-02-tipos-avanzados";
import { tsGenericsModule } from "./ts-03-generics";
import { tsTsReactModule } from "./ts-04-typescript-react";

// React modules
import { reactQueEsModule } from "./react-01-que-es-react";
import { reactJsxModule } from "./react-02-jsx";
import { reactComponentesModule } from "./react-03-componentes";
import { reactPropsModule } from "./react-04-props";
import { reactEstadoModule } from "./react-05-estado-usestate";
import { reactEventosModule } from "./react-06-eventos";
import { reactRenderizadoModule } from "./react-07-renderizado-condicional";
import { reactListasModule } from "./react-08-listas-keys";
import { reactUseEffectModule } from "./react-09-useeffect";
import { reactHooksAvanzadosModule } from "./react-10-hooks-avanzados";
import { reactFormulariosModule } from "./react-11-formularios";
import { reactContextModule } from "./react-12-context";
import { reactRouterModule } from "./react-13-react-router";
import { reactEstadoGlobalModule } from "./react-14-estado-global";
import { reactPatronesModule } from "./react-15-patrones";
import { reactPerformanceModule } from "./react-16-performance";
import { reactTestingModule } from "./react-17-testing";
import { react19Module } from "./react-18-react19";
import { reactProyectoTaskModule } from "./react-19-proyecto-taskmanager";
import { reactProyectoEcommerceModule } from "./react-20-proyecto-ecommerce";

// React Ecosystem modules
import { reactEcoRouterModule } from "./react-eco-01-router";
import { reactEcoZustandModule } from "./react-eco-02-zustand";
import { reactEcoShadcnModule } from "./react-eco-03-shadcn";
import { reactEcoHookFormModule } from "./react-eco-04-react-hook-form";
import { reactEcoTanstackModule } from "./react-eco-05-tanstack-query";

// Next.js modules
import { nextjsIntroModule } from "./nextjs-01-introduccion";
import { nextjsRoutingModule } from "./nextjs-02-routing";
import { nextjsServerComponentsModule } from "./nextjs-03-server-components";
import { nextjsApiRoutesModule } from "./nextjs-04-api-routes";
import { nextjsServerActionsModule } from "./nextjs-05-server-actions";

export const ALL_MODULES: ModuleData[] = [
  // HTML
  htmlQueEsModule, htmlEstructuraModule, htmlTextoModule, htmlEnlacesModule,
  htmlImagenesModule, htmlListasModule, htmlTablasModule, htmlFormulariosModule,
  htmlFormulariosAvanzadosModule, htmlSemanticaModule, htmlAtributosModule,
  htmlAccesibilidadModule, htmlMetaSeoModule, htmlMediaAvanzadoModule, htmlBuenasPracticasModule,
  htmlInteractivosModule, htmlProyectoCVModule,
  // CSS. El orden real del track lo fija el campo `order` de cada modulo: el
  // `.sort((a, b) => a.order - b.order)` del final de este archivo reordena todo,
  // asi que el orden en que se listan aca abajo NO tiene ningun efecto.
  //
  // Es documental, para el que lee. Y ojo con lo que decia este comentario antes:
  // afirmaba que `orden-curriculum-css.test.ts` falla si el orden de declaracion
  // se desincroniza del campo `order`. NO falla. Ese guard compara la secuencia
  // del array YA ORDENADO, no este literal. Mantenelo en orden por prolijidad,
  // sabiendo que nada te avisa si se te va.
  queEsCSSModule, selectoresModule, propiedadesBasicasModule, boxModelModule,
  unidadesCSSModule, dimensionesModule, mathFunctionsModule, tipografiasModule,
  advancedTextModule, selectoresDescendientesModule,
  pseudoClasesModule, pseudoElementosModule, attributeSelectorsModule, especificidadModule,
  floatDisplayModule,
  posicionamientoModule, flexboxModule, cssGridModule, propiedadesLogicasModule,
  listsAndTablesModule, shadowsGradientsFiltersModule, transformsModule, transicionesAnimacionesModule, variablesCSSModule,
  mediaQueriesModule, sassFundamentosModule, sassAvanzadoModule, bootstrapModule,
  tailwindModule, proyectoCvCssModule,
  // JS
  jsQueEsModule, jsVariablesTiposModule, jsOperadoresModule, jsStringsModule,
  jsCondicionalesModule, jsCiclosModule, jsFuncionesModule, jsArraysModule,
  jsMetodosArraysModule, jsObjetosModule, jsDomSeleccionModule, jsDomManipulacionModule,
  jsEventosModule, jsDomEstilosModule, jsLocalStorageModule, jsFormulariosModule,
  jsAsincronismoModule, jsFetchApiModule, jsEs6ModernoModule, jsClasesPooModule,
  jsErroresModule, jsPatronesModule, jsProyectoTodoModule, jsProyectoQuizModule,
  jsProyectoWeatherModule,
  // TypeScript (JS track)
  tsIntroModule, tsTiposAvanzadosModule, tsGenericsModule, tsTsReactModule,
  // React
  reactQueEsModule, reactJsxModule, reactComponentesModule, reactPropsModule,
  reactEstadoModule, reactEventosModule, reactRenderizadoModule, reactListasModule,
  reactUseEffectModule, reactHooksAvanzadosModule, reactFormulariosModule,
  reactContextModule, reactRouterModule, reactEstadoGlobalModule, reactPatronesModule,
  reactPerformanceModule, reactTestingModule, react19Module,
  reactProyectoTaskModule, reactProyectoEcommerceModule,
  // React Ecosystem
  reactEcoRouterModule, reactEcoZustandModule, reactEcoShadcnModule,
  reactEcoHookFormModule, reactEcoTanstackModule,
  // Next.js
  nextjsIntroModule, nextjsRoutingModule, nextjsServerComponentsModule,
  nextjsApiRoutesModule, nextjsServerActionsModule,
].sort((a, b) => a.order - b.order);
