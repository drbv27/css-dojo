import type { Rank, NavItem } from "@/types";

export const APP_NAME = "Dev Dojo";

export const TEACHER_EMAIL = process.env.TEACHER_EMAIL ?? "";

export const RANKS: Rank[] = [
  { name: "Aprendiz", minXP: 0, icon: "belt-white", color: "#9CA3AF" },
  { name: "Practicante", minXP: 200, icon: "belt-blue", color: "#60A5FA" },
  { name: "Guerrero", minXP: 500, icon: "belt-purple", color: "#A78BFA" },
  { name: "Maestro", minXP: 1000, icon: "belt-gold", color: "#F59E0B" },
  { name: "Sensei", minXP: 1800, icon: "belt-red", color: "#EF4444" },
];

export const XP_REWARDS: Record<number, number> = {
  1: 10,
  2: 25,
  3: 50,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Modulos", href: "/modulos", icon: "BookOpen" },
  { label: "Playground", href: "/playground", icon: "Code" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Perfil", href: "/perfil", icon: "User" },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { label: "Panel Profesor", href: "/teacher", icon: "GraduationCap" },
  { label: "Gestionar Modulos", href: "/teacher/modulos", icon: "Settings" },
];
