import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Progress from "@/lib/models/Progress";
import { ALL_MODULES } from "@/data/modules";

// One-time migration: fix Progress records that have moduleId undefined/null.
// Derives the correct moduleId (slug) from the exerciseId field.
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();

  // Build a map: exerciseId -> module slug
  const exerciseToModule: Record<string, string> = {};
  for (const mod of ALL_MODULES) {
    for (const ex of mod.exercises) {
      exerciseToModule[ex.id] = mod.slug;
    }
  }

  // Find all progress records with missing moduleId
  const broken = await Progress.find({
    $or: [{ moduleId: null }, { moduleId: "" }, { moduleId: { $exists: false } }],
  }).lean();

  let fixed = 0;
  let skipped = 0;

  for (const record of broken) {
    const slug = exerciseToModule[record.exerciseId];
    if (slug) {
      await Progress.updateOne(
        { _id: record._id },
        { $set: { moduleId: slug } }
      );
      fixed++;
    } else {
      skipped++;
    }
  }

  return NextResponse.json({ fixed, skipped, total: broken.length });
}
