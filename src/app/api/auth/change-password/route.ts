import { NextResponse } from "next/server";
import { getSession, hashPassword, comparePassword } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Ambas contrasenas son requeridas" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "La nueva contrasena debe tener al menos 6 caracteres" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findById(session.id);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "La contrasena actual es incorrecta" }, { status: 401 });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return NextResponse.json({ ok: true });
}
