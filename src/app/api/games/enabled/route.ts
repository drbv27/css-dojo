import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";

export async function GET() {
  await dbConnect();
  const settings = await ModuleSettings.find({ slug: /^game-/ }).lean();

  // Games default to enabled if no setting exists
  const disabledSlugs = settings
    .filter((s: any) => s.enabled === false)
    .map((s: any) => s.slug);

  return NextResponse.json({ disabledSlugs });
}
