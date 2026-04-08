import type { Achievement } from "@/types";

export const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    slug: "primera-victoria",
    title: "Primera Victoria",
    description: "Completa tu primer ejercicio",
    icon: "trophy",
    condition: { type: "exercises_completed", value: 1 },
  },
  {
    slug: "modulo-completado",
    title: "Modulo Completado",
    description: "Completa todos los ejercicios de un modulo",
    icon: "book-check",
    condition: { type: "module_completed", value: 1 },
  },
  {
    slug: "en-racha-3",
    title: "En Racha",
    description: "Mantiene una racha de 3 dias consecutivos",
    icon: "flame",
    condition: { type: "streak", value: 3 },
  },
  {
    slug: "imparable-7",
    title: "Imparable",
    description: "Mantiene una racha de 7 dias consecutivos",
    icon: "zap",
    condition: { type: "streak", value: 7 },
  },
  {
    slug: "medio-camino",
    title: "Medio Camino",
    description: "Alcanza 800 XP (Cinturon Verde)",
    icon: "milestone",
    condition: { type: "xp", value: 800 },
  },
  {
    slug: "avanzado",
    title: "Avanzado",
    description: "Alcanza 2500 XP (Cinturon Morado)",
    icon: "crown",
    condition: { type: "xp", value: 2500 },
  },
  {
    slug: "perfeccionista",
    title: "Perfeccionista",
    description: "Obtiene puntuacion perfecta en 10 ejercicios",
    icon: "star",
    condition: { type: "perfect_scores", value: 10 },
  },
  {
    slug: "explorador",
    title: "Explorador",
    description: "Inicia ejercicios en 10 modulos diferentes",
    icon: "compass",
    condition: { type: "modules_started", value: 10 },
  },
  {
    slug: "velocista",
    title: "Velocista",
    description: "Completa 5 ejercicios en menos de 10 minutos",
    icon: "timer",
    condition: { type: "speed_exercises", value: 5 },
  },
  {
    slug: "dedicado",
    title: "Dedicado",
    description: "Completa 50 ejercicios en total",
    icon: "award",
    condition: { type: "exercises_completed", value: 50 },
  },
];
