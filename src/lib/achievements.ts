import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";
import { SEED_ACHIEVEMENTS } from "@/lib/achievements-list";

export { SEED_ACHIEVEMENTS };

export async function checkAchievements(userId: string): Promise<string[]> {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) return [];

  const existingBadges = new Set(user.badges);
  const newBadges: string[] = [];

  const completedProgress = await Progress.find({
    userId,
    completed: true,
  });

  const totalCompleted = completedProgress.length;
  const perfectScores = completedProgress.filter((p) => p.score === 100 || p.score === 1).length;
  const uniqueModules = new Set(completedProgress.map((p) => p.moduleId));
  const modulesStarted = uniqueModules.size;

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

  if (newBadges.length > 0) {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { badges: { $each: newBadges } },
    });
  }

  return newBadges;
}
