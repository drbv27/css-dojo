import type { ModuleData } from "@/types";

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

export {
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
};

export const ALL_MODULES: ModuleData[] = [
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
].sort((a, b) => a.order - b.order);
