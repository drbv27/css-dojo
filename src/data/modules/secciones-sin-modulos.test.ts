import { describe, expect, it } from "vitest";
import { ALL_MODULES } from "./index";
import { DOJO_CATEGORY_ORDER } from "../moduleCategories";
import type { DojoType, ModuleCategory } from "@/types";

/**
 * La direccion QUE FALTABA.
 *
 * `categorias-panel.test.ts` verifica que todo modulo tenga una seccion
 * alcanzable: modulo -> seccion. Nadie verificaba el sentido contrario, seccion
 * -> modulo, asi que una seccion declarada sin un solo modulo renderiza un
 * titulo con nada abajo y ningun test protesta. Es la misma vacuidad que el
 * resto del sistema rechaza: una regla sobre el conjunto vacio se cumple sola.
 *
 * Este guard es ademas la aplicacion de una decision del instructor
 * (2026-08-31): la seccion `css-oficio` que el plan pedia para la Fase 3 NO se
 * crea. Sus dos modulos van a secciones que ya existen -- DevTools a
 * `css-herramientas`, accesibilidad visual a `css-visual` --. Lo que se guarda
 * aca no es el literal "css-oficio no existe", que dejaria de significar algo en
 * cuanto alguien lo escribiera con contenido adentro, sino la invariante de la
 * que sale esa decision: una seccion existe cuando tiene con que llenarse.
 */

const DOJOS = Object.keys(DOJO_CATEGORY_ORDER) as DojoType[];

/**
 * Secciones declaradas que HOY no tienen ningun modulo. Medido el 2026-08-31.
 *
 * NO es una lista de permitidas para siempre, y por eso hay dos aserciones y no
 * una: la segunda falla en cuanto una de estas recibe su primer modulo, pidiendo
 * que se la saque de aca. Una excepcion que no se puede limpiar sola se pudre en
 * silencio, y termina tapando justo el caso que el guard existia para cazar.
 *
 * Las dos son del track JS, que se trabaja aparte. Se dejan anotadas en vez de
 * ignoradas para que el guard diga la verdad sobre el repo entero y no solo
 * sobre CSS.
 */
const VACIAS_CONOCIDAS: ModuleCategory[] = ["js-async", "js-dom"];

const modulosDe = (dojo: DojoType, cat: ModuleCategory) =>
  ALL_MODULES.filter((m) => m.dojo === dojo && m.category === cat);

describe("ninguna seccion declarada queda sin modulos", () => {
  it("toda seccion declarada tiene al menos un modulo", () => {
    const vacias: string[] = [];

    for (const dojo of DOJOS) {
      for (const cat of DOJO_CATEGORY_ORDER[dojo]) {
        if (VACIAS_CONOCIDAS.includes(cat)) continue;
        if (modulosDe(dojo, cat).length === 0) vacias.push(`${dojo} -> ${cat}`);
      }
    }

    expect(vacias).toEqual([]);
  });

  it("y la lista de vacias conocidas no se pudre: si una recibe un modulo, se saca", () => {
    // El control de la excepcion. Sin esto, `VACIAS_CONOCIDAS` crece, nadie la
    // poda, y con el tiempo el guard de arriba deja de mirar medio repo.
    const yaNoVacias: string[] = [];

    for (const cat of VACIAS_CONOCIDAS) {
      const conModulos = DOJOS.filter((d) => modulosDe(d, cat).length > 0);
      if (conModulos.length > 0) {
        yaNoVacias.push(`${cat} (ya tiene modulos en ${conModulos.join(", ")})`);
      }
    }

    expect(yaNoVacias).toEqual([]);
  });

  it("y toda vacia conocida sigue siendo una seccion DECLARADA", () => {
    // El otro modo de pudrirse: alguien borra la seccion y la excepcion queda
    // apuntando a nada. Es el patron del nombre que no existe, aplicado a la
    // lista de excepciones del guard.
    const declaradas = new Set(DOJOS.flatMap((d) => DOJO_CATEGORY_ORDER[d]));
    const fantasmas = VACIAS_CONOCIDAS.filter((c) => !declaradas.has(c));

    expect(fantasmas).toEqual([]);
  });
});
