import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  await dbConnect();

  const users = await User.find({ role: "student" })
    .select("name email image xp currentStreak")
    .sort({ xp: -1 })
    .limit(50)
    .lean();

  return NextResponse.json(users);
}
