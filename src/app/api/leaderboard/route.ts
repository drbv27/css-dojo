import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";
import { ALL_MODULES } from "@/data/modules";
import type { DojoType } from "@/types";

export async function GET(request: NextRequest) {
  await dbConnect();

  const dojo = request.nextUrl.searchParams.get("dojo") as DojoType | null;

  // General leaderboard — sorted by total XP
  if (!dojo) {
    const users = await User.find({ role: "student" })
      .select("name email image xp currentStreak")
      .sort({ xp: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(users);
  }

  // Per-dojo leaderboard — sum XP from progress records for modules in that dojo
  const dojoSlugs = ALL_MODULES.filter((m) => m.dojo === dojo).map((m) => m.slug);

  if (dojoSlugs.length === 0) {
    return NextResponse.json([]);
  }

  const pipeline = [
    { $match: { moduleId: { $in: dojoSlugs }, completed: true } },
    {
      $group: {
        _id: "$userId",
        xp: { $sum: "$xpEarned" },
        exercisesCompleted: { $sum: 1 },
      },
    },
    { $sort: { xp: -1 as const } },
    { $limit: 50 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        xp: 1,
        exercisesCompleted: 1,
      },
    },
  ];

  const results = await Progress.aggregate(pipeline);

  return NextResponse.json(results);
}
