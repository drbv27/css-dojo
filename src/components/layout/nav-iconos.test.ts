import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { NAV_ITEMS, TEACHER_NAV_ITEMS } from "@/lib/constants";

/**
 * Todo icono que la navegacion nombra existe en los TRES mapas que la dibujan.
 *
 * ## Por que hace falta un guard
 *
 * Los tres componentes renderizan `{Icon && <Icon />}`. Un icono que no esta en
 * el mapa **no rompe nada**: el enlace sale sin icono y listo. No hay error, no
 * hay warning, y el typecheck no lo ve porque `item.icon` es un `string`.
 *
 * Medido el 2026-08-31, antes de este guard: el `Sidebar` no tenia `Gamepad2`
 * -que usa "Juegos CSS"- ni `Settings` -que usa "Gestionar Modulos"-. Los dos
 * enlaces venian saliendo sin icono en el escritorio desde que existen, y nadie
 * lo noto, justamente porque falla en silencio.
 *
 * Es la misma forma que la clase de color no declarada de `globals-tokens.test`:
 * un nombre que apunta a nada, y una interfaz que se traga la ausencia.
 */

const MAPAS = [
  "src/components/layout/Sidebar.tsx",
  "src/components/layout/MobileMenu.tsx",
  "src/components/layout/MobileNav.tsx",
];

/** Los nombres declarados dentro del ICON_MAP de un componente. */
function iconosDe(archivo: string): Set<string> {
  const s = readFileSync(archivo, "utf8");
  // Sin la bandera `s`: el target de tsconfig es anterior a es2018 y no la acepta.
  const m = s.match(/const ICON_MAP[\s\S]*?=\s*\{([^}]*)\}/);
  if (!m) return new Set();
  return new Set(
    m[1]
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  );
}

const USADOS = [...NAV_ITEMS, ...TEACHER_NAV_ITEMS].map((i) => i.icon);

describe("los iconos de la navegacion existen en los tres mapas", () => {
  it("el guard mira algo: hay items de nav y mapas con iconos", () => {
    // Sin esto, un regex roto deja el guard verde sobre el conjunto vacio.
    expect(USADOS.length).toBeGreaterThan(5);
    for (const archivo of MAPAS) {
      expect(iconosDe(archivo).size).toBeGreaterThan(3);
    }
  });

  it("ningun item de navegacion nombra un icono que su mapa no tiene", () => {
    const faltantes: string[] = [];

    for (const archivo of MAPAS) {
      const declarados = iconosDe(archivo);
      for (const icono of USADOS) {
        if (!declarados.has(icono)) {
          faltantes.push(`${archivo.split("/").pop()}: falta ${icono}`);
        }
      }
    }

    expect([...new Set(faltantes)]).toEqual([]);
  });
});
