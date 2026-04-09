import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { resetToken, password } = await request.json();

    if (!resetToken || !password) {
      return NextResponse.json({ message: "Token y contrasena son obligatorios" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "La contrasena debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || "css-dojo-secret-key-cambiar-en-produccion";
    let payload: any;
    try {
      payload = jwt.verify(resetToken, secret);
    } catch {
      return NextResponse.json({ message: "El enlace ha expirado. Solicita un nuevo codigo." }, { status: 401 });
    }

    if (payload.purpose !== "password-reset") {
      return NextResponse.json({ message: "Token invalido" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    user.password = await hashPassword(password);
    await user.save();

    return NextResponse.json({ message: "Contrasena actualizada correctamente" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Error al restablecer la contrasena" }, { status: 500 });
  }
}
