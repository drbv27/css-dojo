import type { Achievement } from "@/types";

export const SEED_ACHIEVEMENTS: Achievement[] = [
  // Primeros pasos
  {
    slug: "primera-victoria",
    title: "Primera Victoria",
    description: "Completa tu primer ejercicio",
    icon: "🏆",
    condition: { type: "exercises_completed", value: 1 },
  },
  {
    slug: "paso-firme",
    title: "Paso Firme",
    description: "Completa 10 ejercicios",
    icon: "👣",
    condition: { type: "exercises_completed", value: 10 },
  },
  {
    slug: "dedicado",
    title: "Dedicado",
    description: "Completa 50 ejercicios",
    icon: "💪",
    condition: { type: "exercises_completed", value: 50 },
  },
  {
    slug: "centurion",
    title: "Centurion",
    description: "Completa 100 ejercicios",
    icon: "🛡️",
    condition: { type: "exercises_completed", value: 100 },
  },
  {
    slug: "implacable",
    title: "Implacable",
    description: "Completa 200 ejercicios",
    icon: "⚔️",
    condition: { type: "exercises_completed", value: 200 },
  },

  // Modulos
  {
    slug: "modulo-completado",
    title: "Primer Modulo",
    description: "Completa todos los ejercicios de un modulo",
    icon: "📘",
    condition: { type: "module_completed", value: 1 },
  },
  {
    slug: "explorador",
    title: "Explorador",
    description: "Inicia ejercicios en 5 modulos diferentes",
    icon: "🧭",
    condition: { type: "modules_started", value: 5 },
  },
  {
    slug: "aventurero",
    title: "Aventurero",
    description: "Inicia ejercicios en 10 modulos diferentes",
    icon: "🗺️",
    condition: { type: "modules_started", value: 10 },
  },
  {
    slug: "enciclopedia",
    title: "Enciclopedia",
    description: "Inicia ejercicios en 20 modulos diferentes",
    icon: "📚",
    condition: { type: "modules_started", value: 20 },
  },

  // Rachas
  {
    slug: "en-racha-3",
    title: "En Racha",
    description: "Mantiene una racha de 3 dias consecutivos",
    icon: "🔥",
    condition: { type: "streak", value: 3 },
  },
  {
    slug: "imparable-7",
    title: "Imparable",
    description: "Racha de 7 dias consecutivos",
    icon: "⚡",
    condition: { type: "streak", value: 7 },
  },
  {
    slug: "guerrero-14",
    title: "Guerrero",
    description: "Racha de 14 dias consecutivos",
    icon: "🥋",
    condition: { type: "streak", value: 14 },
  },
  {
    slug: "leyenda-30",
    title: "Leyenda",
    description: "Racha de 30 dias consecutivos",
    icon: "👑",
    condition: { type: "streak", value: 30 },
  },

  // XP / Rangos
  {
    slug: "primer-cinturon",
    title: "Primer Cinturon",
    description: "Alcanza 150 XP (Cinturon Amarillo)",
    icon: "🥇",
    condition: { type: "xp", value: 150 },
  },
  {
    slug: "medio-camino",
    title: "Medio Camino",
    description: "Alcanza 800 XP (Cinturon Verde)",
    icon: "🌿",
    condition: { type: "xp", value: 800 },
  },
  {
    slug: "avanzado",
    title: "Avanzado",
    description: "Alcanza 2500 XP (Cinturon Morado)",
    icon: "💎",
    condition: { type: "xp", value: 2500 },
  },
  {
    slug: "elite",
    title: "Elite",
    description: "Alcanza 6000 XP (Cinturon Rojo)",
    icon: "🎯",
    condition: { type: "xp", value: 6000 },
  },
  {
    slug: "maestro-supremo",
    title: "Maestro Supremo",
    description: "Alcanza 11000 XP (Gran Maestro)",
    icon: "🐉",
    condition: { type: "xp", value: 11000 },
  },

  // Precision
  {
    slug: "perfeccionista",
    title: "Perfeccionista",
    description: "Score perfecto en 10 ejercicios",
    icon: "⭐",
    condition: { type: "perfect_scores", value: 10 },
  },
  {
    slug: "francotirador",
    title: "Francotirador",
    description: "Score perfecto en 50 ejercicios",
    icon: "🎖️",
    condition: { type: "perfect_scores", value: 50 },
  },
  {
    slug: "maquina",
    title: "Maquina",
    description: "Score perfecto en 100 ejercicios",
    icon: "🤖",
    condition: { type: "perfect_scores", value: 100 },
  },

  // Velocidad
  {
    slug: "velocista",
    title: "Velocista",
    description: "Completa 5 ejercicios en menos de 10 minutos",
    icon: "⏱️",
    condition: { type: "speed_exercises", value: 5 },
  },
];
