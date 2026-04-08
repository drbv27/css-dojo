import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();

  const dojo = request.nextUrl.searchParams.get("dojo") as DojoType | null;

  const students = await User.find({ role: "student" }).lean();
  const allProgress = await Progress.find({ completed: true }).lean();

  // Filter by dojo if specified
  const dojoSlugs = dojo
    ? ALL_MODULES.filter((m) => m.dojo === dojo).map((m) => m.slug)
    : null;

  const filteredProgress = dojoSlugs
    ? allProgress.filter((p) => dojoSlugs.includes(p.moduleId))
    : allProgress;

  const totalStudents = students.length;
  const approvedStudents = students.filter((s: any) => s.approved).length;

  // Average XP
  const avgXP = totalStudents > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.xp || 0), 0) / totalStudents)
    : 0;

  // Total exercises in scope
  const totalExercisesInScope = dojoSlugs
    ? ALL_MODULES.filter((m) => dojoSlugs.includes(m.slug)).reduce((sum, m) => sum + m.exercises.length, 0)
    : ALL_MODULES.reduce((sum, m) => sum + m.exercises.length, 0);

  // Average progress (% of exercises completed per student)
  let avgProgress = 0;
  if (totalStudents > 0 && totalExercisesInScope > 0) {
    const studentProgressValues = students.map((s) => {
      const studentCompleted = filteredProgress.filter(
        (p) => p.userId.toString() === s._id.toString()
      ).length;
      return Math.round((studentCompleted / totalExercisesInScope) * 100);
    });
    avgProgress = Math.round(
      studentProgressValues.reduce((sum, v) => sum + v, 0) / totalStudents
    );
  }

  // Active today
  const activeToday = students.filter((s) => {
    if (!s.lastActiveDate) return false;
    const today = new Date();
    const last = new Date(s.lastActiveDate);
    return (
      last.getDate() === today.getDate() &&
      last.getMonth() === today.getMonth() &&
      last.getFullYear() === today.getFullYear()
    );
  }).length;

  // Most active module
  const moduleCount: Record<string, number> = {};
  for (const p of filteredProgress) {
    moduleCount[p.moduleId] = (moduleCount[p.moduleId] || 0) + 1;
  }
  const mostActiveSlug = Object.entries(moduleCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostActiveModule = mostActiveSlug
    ? ALL_MODULES.find((m) => m.slug === mostActiveSlug)?.title ?? mostActiveSlug
    : "—";

  // Total exercises completed
  const totalExercisesCompleted = filteredProgress.length;

  return NextResponse.json({
    totalStudents,
    approvedStudents,
    avgXP,
    avgProgress,
    activeToday,
    mostActiveModule,
    totalExercisesCompleted,
    totalExercisesInScope,
  });
}
