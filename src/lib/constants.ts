import type { Rank, NavItem } from "@/types";

export const APP_NAME = "Dev Dojo";

export const TEACHER_EMAIL = process.env.TEACHER_EMAIL ?? "";

export const RANKS: Rank[] = [
  { name: "Cinturón Blanco", minXP: 0, icon: "belt-white", color: "#9CA3AF" },
  { name: "Cinturón Amarillo", minXP: 100, icon: "belt-yellow", color: "#FBBF24" },
  { name: "Cinturón Naranja", minXP: 250, icon: "belt-orange", color: "#FB923C" },
  { name: "Cinturón Verde", minXP: 500, icon: "belt-green", color: "#34D399" },
  { name: "Cinturón Azul", minXP: 800, icon: "belt-blue", color: "#60A5FA" },
  { name: "Cinturón Morado", minXP: 1200, icon: "belt-purple", color: "#A78BFA" },
  { name: "Cinturón Marrón", minXP: 1700, icon: "belt-brown", color: "#D97706" },
  { name: "Cinturón Rojo", minXP: 2300, icon: "belt-red", color: "#EF4444" },
  { name: "Cinturón Negro", minXP: 3000, icon: "belt-black", color: "#E2E8F0" },
  { name: "Gran Maestro", minXP: 4000, icon: "belt-master", color: "#FFD700" },
];

export const XP_REWARDS: Record<number, number> = {
  1: 10,
  2: 25,
  3: 50,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Modulos", href: "/modulos", icon: "BookOpen" },
  { label: "Juegos CSS", href: "/juegos", icon: "Gamepad2" },
  { label: "Playground", href: "/playground", icon: "Code" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Perfil", href: "/perfil", icon: "User" },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { label: "Panel Profesor", href: "/teacher", icon: "GraduationCap" },
  { label: "Gestionar Modulos", href: "/teacher/modulos", icon: "Settings" },
];
