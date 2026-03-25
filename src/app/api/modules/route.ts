import { NextResponse } from "next/server";
import { ALL_MODULES } from "@/data/modules";

export async function GET() {
  const modules = ALL_MODULES.map((m) => ({
    slug: m.slug,
    title: m.title,
    description: m.description,
    order: m.order,
    category: m.category,
    icon: m.icon,
    totalLessons: m.lessons.length,
    totalExercises: m.exercises.length,
  }));

  return NextResponse.json(modules);
}
