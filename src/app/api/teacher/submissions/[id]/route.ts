import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import User from "@/lib/models/User";

// GET (solo profesor) : contenido de una entrega (para previsualizar / descargar).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  await dbConnect();
  void User;

  const sub = await Submission.findById(id)
    .populate("userId", "name email")
    .lean();

  if (!sub) {
    return NextResponse.json({ error: "Entrega no encontrada" }, { status: 404 });
  }

  const u = sub.userId as unknown as { name?: string; email?: string } | null;
  return NextResponse.json({
    name: u?.name ?? "",
    email: u?.email ?? "",
    projectSlug: sub.projectSlug,
    filename: sub.filename,
    content: sub.content,
    updatedAt: sub.updatedAt,
  });
}
