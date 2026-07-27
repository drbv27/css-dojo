import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleSettings from "@/lib/models/ModuleSettings";
import { ALL_MODULES } from "@/data/modules";

function parseCohort(value: unknown): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

// PUT : activar/desactivar un track completo para una cohorte.
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { dojo, enabled } = body as { dojo: string; enabled: boolean };
  const cohort = parseCohort(body.cohort);

  if (!dojo || typeof enabled !== "boolean") {
    return NextResponse.json(
      { error: "dojo (string) y enabled (boolean) son requeridos" },
      { status: 400 }
    );
  }

  const slugs = ALL_MODULES.filter((m) => m.dojo === dojo).map((m) => m.slug);

  if (slugs.length === 0) {
    return NextResponse.json({ error: "Dojo no encontrado" }, { status: 404 });
  }

  await dbConnect();

  const ops = slugs.map((slug) => ({
    updateOne: {
      filter: { cohort, slug },
      update: { cohort, slug, enabled },
      upsert: true,
    },
  }));

  await ModuleSettings.bulkWrite(ops);

  return NextResponse.json({ cohort, dojo, enabled, count: slugs.length });
}
