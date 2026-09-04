import type { Rank, NavItem } from "@/types";

export const APP_NAME = "Dev Dojo";

export const TEACHER_EMAIL = process.env.TEACHER_EMAIL ?? "";

/**
 * Los umbrales estan anclados a HITOS DEL CURRICULUM, no a numeros redondos.
 * Cada uno de los cinco de arriba cae justo por debajo de terminar algo que se
 * puede nombrar, y `cinturones-escala.test.ts` verifica esa correspondencia
 * contra el curriculum real en cada corrida:
 *
 *   Morado       el camino OBLIGATORIO de CSS, o sea el del certificado
 *   Marron       CSS entero, opcionales incluidos
 *   Rojo         CSS + HTML
 *   Negro        CSS + HTML + JS
 *   Gran Maestro + React
 *
 * POR QUE SIGUEN SIENDO ABSOLUTOS. Hacerlos un porcentaje del curriculum
 * parece la solucion obvia y no lo es: una cohorte que solo cursa CSS toca
 * techo en el 44% para siempre, y los cinturones de arriba dejan de ser
 * alcanzables por alguien real del programa.
 *
 * POR QUE NO HAY COLCHON PARA EL CONTENIDO QUE VIENE. Un colchon es una
 * adivinanza disfrazada de plan: deja el techo inalcanzable mientras tanto, y
 * si JS o React crecen distinto igual hay que recorregir. El defecto nunca
 * fueron los numeros, fue que la deriva era SILENCIOSA -- se abarataron cuatro
 * veces sin que nada se pusiera rojo --. El guard es lo que lo arregla: la
 * proxima tanda de contenido rompe un test en vez de descontar en silencio.
 */
export const RANKS: Rank[] = [
  { name: "Cinturon Blanco", minXP: 0, icon: "belt-white", color: "#9CA3AF" },
  { name: "Cinturon Amarillo", minXP: 300, icon: "belt-yellow", color: "#FBBF24" },
  { name: "Cinturon Naranja", minXP: 900, icon: "belt-orange", color: "#FB923C" },
  { name: "Cinturon Verde", minXP: 1800, icon: "belt-green", color: "#34D399" },
  { name: "Cinturon Azul", minXP: 3200, icon: "belt-blue", color: "#60A5FA" },
  { name: "Cinturon Morado", minXP: 5200, icon: "belt-purple", color: "#A78BFA", hito: "el camino obligatorio de CSS" },
  { name: "Cinturon Marron", minXP: 7400, icon: "belt-brown", color: "#92400E", hito: "CSS entero, opcionales incluidos" },
  { name: "Cinturon Rojo", minXP: 9600, icon: "belt-red", color: "#EF4444", hito: "CSS + HTML" },
  { name: "Cinturon Negro", minXP: 12800, icon: "belt-black", color: "#E2E8F0", hito: "CSS + HTML + JS" },
  { name: "Gran Maestro", minXP: 15800, icon: "belt-master", color: "#FFD700", hito: "CSS + HTML + JS + React" },
];
export const XP_REWARDS: Record<number, number> = {
  1: 10,
  2: 20,
  3: 30,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Modulos", href: "/modulos", icon: "BookOpen" },
  { label: "Juegos CSS", href: "/juegos", icon: "Gamepad2" },
  { label: "Playground", href: "/playground", icon: "Code" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Certificados", href: "/certificados", icon: "Award" },
  { label: "Perfil", href: "/perfil", icon: "User" },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { label: "Panel Profesor", href: "/teacher", icon: "GraduationCap" },
  { label: "Gestionar Modulos", href: "/teacher/modulos", icon: "Settings" },
  { label: "Entregas", href: "/teacher/entregas", icon: "Inbox" },
  { label: "Open Code (sondeo)", href: "/teacher/open-code", icon: "Megaphone" },
];
