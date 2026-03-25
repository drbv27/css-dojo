import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";
import { ALL_MODULES } from "@/data/modules";

export async function GET() {
  await dbConnect();

  // Get all module settings from DB
  const settings = await ModuleSettings.find({}).lean();

  // Build a map of slug -> enabled
  const settingsMap = new Map<string, boolean>();
  for (const s of settings) {
    settingsMap.set(s.slug, s.enabled);
  }

  // A module is enabled if it has no settings doc (default) or enabled=true
  const enabledSlugs = ALL_MODULES.filter((mod) => {
    const setting = settingsMap.get(mod.slug);
    return setting === undefined || setting === true;
  }).map((mod) => mod.slug);

  return NextResponse.json({ enabledSlugs });
}
