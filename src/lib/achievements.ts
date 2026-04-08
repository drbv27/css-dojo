import type { Achievement } from "@/types";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";

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

export async function checkAchievements(userId: string): Promise<string[]> {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) return [];

  const existingBadges = new Set(user.badges);
  const newBadges: string[] = [];

  // Gather stats
  const completedProgress = await Progress.find({
    userId,
    completed: true,
  });

  const totalCompleted = completedProgress.length;
  const perfectScores = completedProgress.filter((p) => p.score === 100 || p.score === 1).length;
  const uniqueModules = new Set(completedProgress.map((p) => p.moduleId));

  // Count modules where ALL exercises are completed
  // (simplified: we check distinct modules with at least 1 completion)
  const modulesStarted = uniqueModules.size;

  // Speed exercises: completed within 10 minutes of creation
  const speedExercises = completedProgress.filter((p) => {
    if (!p.completedAt || !p.createdAt) return false;
    const diff = p.completedAt.getTime() - p.createdAt.getTime();
    return diff <= 10 * 60 * 1000;
  }).length;

  for (const achievement of SEED_ACHIEVEMENTS) {
    if (existingBadges.has(achievement.slug)) continue;

    let earned = false;

    switch (achievement.condition.type) {
      case "exercises_completed":
        earned = totalCompleted >= achievement.condition.value;
        break;
      case "module_completed":
        // Simplified: at least N modules with completions
        earned = modulesStarted >= achievement.condition.value;
        break;
      case "streak":
        earned = user.currentStreak >= achievement.condition.value ||
                 user.longestStreak >= achievement.condition.value;
        break;
      case "xp":
        earned = user.xp >= achievement.condition.value;
        break;
      case "perfect_scores":
        earned = perfectScores >= achievement.condition.value;
        break;
      case "modules_started":
        earned = modulesStarted >= achievement.condition.value;
        break;
      case "speed_exercises":
        earned = speedExercises >= achievement.condition.value;
        break;
    }

    if (earned) {
      newBadges.push(achievement.slug);
    }
  }

  // Persist new badges
  if (newBadges.length > 0) {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { badges: { $each: newBadges } },
    });
  }

  return newBadges;
}
