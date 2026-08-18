import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import User from "@/lib/models/User";
import { isProjectModule } from "@/lib/projects";

const MAX_SIZE = 2_000_000; // ~2 MB

// GET ?projectSlug= : la entrega del alumno actual para ese proyecto (metadatos).
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const projectSlug = new URL(request.url).searchParams.get("projectSlug") ?? "";
  if (!isProjectModule(projectSlug)) {
    return NextResponse.json({ error: "Proyecto invalido" }, { status: 400 });
  }

  await dbConnect();
  const sub = await Submission.findOne({ userId: session.id, projectSlug })
    .select("filename size updatedAt")
    .lean();

  return NextResponse.json({ submission: sub ?? null });
}

const bodySchema = z.object({
  projectSlug: z.string(),
  filename: z.string().trim().min(1).max(200),
  content: z.string().min(1),
});

// POST : sube (o reemplaza) la entrega del alumno para un proyecto.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }
  const { projectSlug, filename, content } = parsed.data;

  if (!isProjectModule(projectSlug)) {
    return NextResponse.json({ error: "Proyecto invalido" }, { status: 400 });
  }
  if (!/\.html?$/i.test(filename)) {
    return NextResponse.json({ error: "El archivo debe ser .html" }, { status: 400 });
  }
  const size = Buffer.byteLength(content, "utf8");
  if (size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo es demasiado grande (max 2 MB)" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findById(session.id).select("cohort").lean();
  const cohort = user?.cohort ?? 1;

  await Submission.findOneAndUpdate(
    { userId: session.id, projectSlug },
    { $set: { cohort, filename, content, size } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json({ ok: true, filename, size });
}
