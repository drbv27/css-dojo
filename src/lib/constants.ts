import type { Rank, NavItem } from "@/types";

export const APP_NAME = "Dev Dojo";

export const TEACHER_EMAIL = process.env.TEACHER_EMAIL ?? "";

export const RANKS: Rank[] = [
  { name: "Cinturon Blanco", minXP: 0, icon: "belt-white", color: "#9CA3AF" },
  { name: "Cinturon Amarillo", minXP: 150, icon: "belt-yellow", color: "#FBBF24" },
  { name: "Cinturon Naranja", minXP: 400, icon: "belt-orange", color: "#FB923C" },
  { name: "Cinturon Verde", minXP: 800, icon: "belt-green", color: "#34D399" },
  { name: "Cinturon Azul", minXP: 1500, icon: "belt-blue", color: "#60A5FA" },
  { name: "Cinturon Morado", minXP: 2500, icon: "belt-purple", color: "#A78BFA" },
  { name: "Cinturon Marron", minXP: 4000, icon: "belt-brown", color: "#D97706" },
  { name: "Cinturon Rojo", minXP: 6000, icon: "belt-red", color: "#EF4444" },
  { name: "Cinturon Negro", minXP: 8500, icon: "belt-black", color: "#E2E8F0" },
  { name: "Gran Maestro", minXP: 11000, icon: "belt-master", color: "#FFD700" },
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
  { label: "Perfil", href: "/perfil", icon: "User" },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { label: "Panel Profesor", href: "/teacher", icon: "GraduationCap" },
  { label: "Gestionar Modulos", href: "/teacher/modulos", icon: "Settings" },
];
