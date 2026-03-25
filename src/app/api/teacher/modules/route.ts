import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();

  const settings = await ModuleSettings.find({}).lean();

  return NextResponse.json(
    settings.map((s) => ({ slug: s.slug, enabled: s.enabled }))
  );
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { slug, enabled } = body as { slug: string; enabled: boolean };

  if (!slug || typeof enabled !== "boolean") {
    return NextResponse.json(
      { error: "slug (string) y enabled (boolean) son requeridos" },
      { status: 400 }
    );
  }

  await dbConnect();

  await ModuleSettings.findOneAndUpdate(
    { slug },
    { slug, enabled },
    { upsert: true, new: true }
  );

  return NextResponse.json({ slug, enabled });
}
