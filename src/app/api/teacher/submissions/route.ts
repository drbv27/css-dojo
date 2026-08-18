import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import User from "@/lib/models/User";
import { projectModules } from "@/lib/projects";

// GET (solo profesor) ?projectSlug=&cohort= : lista de entregas (metadatos + alumno).
export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const url = new URL(request.url);
  const projectSlug = url.searchParams.get("projectSlug") ?? "";
  const cohortParam = url.searchParams.get("cohort");
  const cohort = cohortParam ? Number(cohortParam) : null;

  await dbConnect();
  void User; // registra el modelo para el populate

  const query: Record<string, unknown> = { projectSlug };
  if (cohort && Number.isInteger(cohort)) query.cohort = cohort;

  const docs = await Submission.find(query)
    .sort({ updatedAt: -1 })
    .populate("userId", "name email")
    .select("filename size cohort updatedAt userId")
    .lean();

  const submissions = docs.map((d) => {
    const u = d.userId as unknown as { _id?: unknown; name?: string; email?: string } | null;
    return {
      id: String(d._id),
      name: u?.name ?? "(alumno eliminado)",
      email: u?.email ?? "",
      cohort: d.cohort,
      filename: d.filename,
      size: d.size,
      updatedAt: d.updatedAt,
    };
  });

  // Lista de proyectos disponibles (para el selector del panel).
  const projects = projectModules().map((m) => ({ slug: m.slug, title: m.title }));

  return NextResponse.json({ projects, submissions });
}
