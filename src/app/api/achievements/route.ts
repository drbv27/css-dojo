import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { checkAchievements, SEED_ACHIEVEMENTS } from "@/lib/achievements";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(session.id).lean();
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const badges = (user as any).badges ?? [];
  const earned = SEED_ACHIEVEMENTS.filter((a) => badges.includes(a.slug));

  return NextResponse.json({ badges: earned });
}

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const newBadgeSlugs = await checkAchievements(session.id);

  const newAchievements = SEED_ACHIEVEMENTS.filter((a) =>
    newBadgeSlugs.includes(a.slug)
  );

  return NextResponse.json({ newAchievements });
}
