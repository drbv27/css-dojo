import type { ModuleData } from "@/types";

// CSS Modules
import { queEsCSSModule } from "./01-que-es-css";
import { selectoresModule } from "./02-selectores";
import { propiedadesBasicasModule } from "./03-propiedades-basicas";
import { tipografiasModule } from "./04-tipografias";
import { dimensionesModule } from "./05-dimensiones";
import { selectoresDescendientesModule } from "./06-selectores-descendientes";
import { pseudoClasesModule } from "./07-pseudo-clases";
import { pseudoElementosModule } from "./08-pseudo-elementos";
import { especificidadModule } from "./09-especificidad";
import { unidadesCSSModule } from "./10-unidades-css";
import { boxModelModule } from "./11-box-model";
import { posicionamientoModule } from "./12-posicionamiento";
import { floatDisplayModule } from "./13-float-display";
import { propiedadesLogicasModule } from "./14-propiedades-logicas";
import { flexboxModule } from "./15-flexbox";
import { cssGridModule } from "./16-css-grid";
import { mediaQueriesModule } from "./17-media-queries";
import { transicionesAnimacionesModule } from "./18-transiciones-animaciones";
import { variablesCSSModule } from "./19-variables-css";
import { shadowsGradientsFiltersModule } from "./20-shadows-gradients-filters";
import { sassFundamentosModule } from "./21-sass-fundamentos";
import { sassAvanzadoModule } from "./22-sass-avanzado";
import { bootstrapModule } from "./23-bootstrap";
import { tailwindModule } from "./24-tailwind";

// JS Modules
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

export {
  // CSS
  queEsCSSModule,
  selectoresModule,
  propiedadesBasicasModule,
  tipografiasModule,
  dimensionesModule,
  selectoresDescendientesModule,
  pseudoClasesModule,
  pseudoElementosModule,
  especificidadModule,
  unidadesCSSModule,
  boxModelModule,
  posicionamientoModule,
  floatDisplayModule,
  propiedadesLogicasModule,
  flexboxModule,
  cssGridModule,
  mediaQueriesModule,
  transicionesAnimacionesModule,
  variablesCSSModule,
  shadowsGradientsFiltersModule,
  sassFundamentosModule,
  sassAvanzadoModule,
  bootstrapModule,
  tailwindModule,
  // JS
  jsQueEsModule,
  jsVariablesTiposModule,
  jsOperadoresModule,
  jsStringsModule,
  jsCondicionalesModule,
  jsCiclosModule,
  jsFuncionesModule,
  jsArraysModule,
  jsMetodosArraysModule,
  jsObjetosModule,
  jsDomSeleccionModule,
  jsDomManipulacionModule,
  jsEventosModule,
  jsDomEstilosModule,
  jsLocalStorageModule,
  jsFormulariosModule,
  jsAsincronismoModule,
  jsFetchApiModule,
  jsEs6ModernoModule,
  jsClasesPooModule,
  jsErroresModule,
  jsPatronesModule,
  jsProyectoTodoModule,
  jsProyectoQuizModule,
  jsProyectoWeatherModule,
};

export const ALL_MODULES: ModuleData[] = [
  // CSS
  queEsCSSModule,
  selectoresModule,
  propiedadesBasicasModule,
  tipografiasModule,
  dimensionesModule,
  selectoresDescendientesModule,
  pseudoClasesModule,
  pseudoElementosModule,
  especificidadModule,
  unidadesCSSModule,
  boxModelModule,
  posicionamientoModule,
  floatDisplayModule,
  propiedadesLogicasModule,
  flexboxModule,
  cssGridModule,
  mediaQueriesModule,
  transicionesAnimacionesModule,
  variablesCSSModule,
  shadowsGradientsFiltersModule,
  sassFundamentosModule,
  sassAvanzadoModule,
  bootstrapModule,
  tailwindModule,
  // JS
  jsQueEsModule,
  jsVariablesTiposModule,
  jsOperadoresModule,
  jsStringsModule,
  jsCondicionalesModule,
  jsCiclosModule,
  jsFuncionesModule,
  jsArraysModule,
  jsMetodosArraysModule,
  jsObjetosModule,
  jsDomSeleccionModule,
  jsDomManipulacionModule,
  jsEventosModule,
  jsDomEstilosModule,
  jsLocalStorageModule,
  jsFormulariosModule,
  jsAsincronismoModule,
  jsFetchApiModule,
  jsEs6ModernoModule,
  jsClasesPooModule,
  jsErroresModule,
  jsPatronesModule,
  jsProyectoTodoModule,
  jsProyectoQuizModule,
  jsProyectoWeatherModule,
].sort((a, b) => a.order - b.order);
