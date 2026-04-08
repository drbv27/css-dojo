import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";

// Games use the same ModuleSettings model with slugs like "game-flexbox-dojo", "game-grid-dojo"

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();
  const settings = await ModuleSettings.find({ slug: /^game-/ }).lean();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { slug, enabled } = await request.json();
  if (!slug || typeof enabled !== "boolean") {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  await dbConnect();
  await ModuleSettings.findOneAndUpdate(
    { slug },
    { slug, enabled },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
