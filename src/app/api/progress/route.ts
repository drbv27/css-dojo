import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Progress from "@/lib/models/Progress";
import User from "@/lib/models/User";
import { calculateXP } from "@/lib/xp";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const progress = await Progress.find({ userId: session.id }).lean();
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const body = await request.json();
  const moduleId = body.moduleId ?? body.moduleSlug;
  const { exerciseId, exerciseType, score, userAnswer } = body;

  const xpEarned = calculateXP(body.difficulty || 1, score);

  const progress = await Progress.findOneAndUpdate(
    { userId: session.id, moduleId, exerciseId },
    {
      $set: {
        exerciseType,
        completed: score >= 70,
        score,
        xpEarned,
        userAnswer,
        lastAttemptAt: new Date(),
        ...(score >= 70 ? { completedAt: new Date() } : {}),
      },
      $inc: { attempts: 1 },
    },
    { upsert: true, new: true }
  );

  let userXP = 0;
  let userStreak = 0;

  if (score >= 70) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await User.findById(session.id);
    if (user) {
      user.xp += xpEarned;

      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
      if (lastActive) {
        lastActive.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          user.currentStreak += 1;
        } else if (diffDays > 1) {
          user.currentStreak = 1;
        }
      } else {
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
      user.lastActiveDate = new Date();
      await user.save();

      userXP = user.xp;
      userStreak = user.currentStreak;
    }
  } else {
    const user = await User.findById(session.id).lean();
    if (user) {
      userXP = (user as any).xp ?? 0;
      userStreak = (user as any).currentStreak ?? 0;
    }
  }

  return NextResponse.json({ progress, xpEarned, userXP, userStreak });
}
