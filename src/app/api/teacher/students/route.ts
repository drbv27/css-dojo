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

  const students = await User.find({ role: "student" })
    .select("-password")
    .sort({ xp: -1 })
    .lean();

  const studentsWithProgress = await Promise.all(
    students.map(async (student) => {
      const progress = await Progress.find({ userId: student._id, completed: true }).lean();
      const modulesCompleted = new Set(progress.map((p) => p.moduleId)).size;
      return { ...student, _id: student._id.toString(), approved: (student as any).approved ?? false, exercisesCompleted: progress.length, modulesStarted: modulesCompleted };
    })
  );

  return NextResponse.json(studentsWithProgress);
}
