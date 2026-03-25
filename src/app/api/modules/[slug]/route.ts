import { NextResponse } from "next/server";
import { ALL_MODULES } from "@/data/modules";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const mod = ALL_MODULES.find((m) => m.slug === slug);

  if (!mod) {
    return NextResponse.json({ error: "Modulo no encontrado" }, { status: 404 });
  }

  return NextResponse.json(mod);
}
