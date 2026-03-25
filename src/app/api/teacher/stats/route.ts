import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();

  const students = await User.find({ role: "student" }).lean();
  const allProgress = await Progress.find({ completed: true }).lean();

  const totalStudents = students.length;
  const avgXP =
    totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.xp || 0), 0) / totalStudents)
      : 0;

  const activeToday = students.filter((s) => {
    if (!s.lastActiveDate) return false;
    const today = new Date();
    const last = new Date(s.lastActiveDate);
    return last.getDate() === today.getDate() && last.getMonth() === today.getMonth() && last.getFullYear() === today.getFullYear();
  }).length;

  const totalExercisesCompleted = allProgress.length;

  const moduleStats: Record<string, number> = {};
  for (const p of allProgress) {
    moduleStats[p.moduleId] = (moduleStats[p.moduleId] || 0) + 1;
  }

  return NextResponse.json({ totalStudents, avgXP, activeToday, totalExercisesCompleted, moduleStats });
}
