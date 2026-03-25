import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { studentId, approved } = await request.json();
  if (!studentId || typeof approved !== "boolean") {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    studentId,
    { approved },
    { new: true }
  ).select("-password");

  if (!user) {
    return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, approved: user.approved });
}
