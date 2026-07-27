import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";

function parseCohort(value: unknown): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

// GET ?cohort=N : ajustes de visibilidad de esa cohorte.
export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();
  const cohort = parseCohort(new URL(request.url).searchParams.get("cohort"));
  const settings = await ModuleSettings.find({ cohort }).lean();

  return NextResponse.json(settings.map((s) => ({ slug: s.slug, enabled: s.enabled })));
}

// PUT : activar/desactivar un modulo para una cohorte.
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { slug, enabled } = body as { slug: string; enabled: boolean };
  const cohort = parseCohort(body.cohort);

  if (!slug || typeof enabled !== "boolean") {
    return NextResponse.json(
      { error: "slug (string) y enabled (boolean) son requeridos" },
      { status: 400 }
    );
  }

  await dbConnect();
  await ModuleSettings.findOneAndUpdate(
    { cohort, slug },
    { cohort, slug, enabled },
    { upsert: true, new: true }
  );

  return NextResponse.json({ cohort, slug, enabled });
}
