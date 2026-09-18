import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword, createToken, getTokenCookieOptions } from "@/lib/auth";
import { excedeLimite, limpiarLimite } from "@/lib/limite";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contrasena son requeridos" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Sin contador, probar contrasenas es gratis y no deja rastro.
    const claveLimite = `login:${String(email).toLowerCase()}`;
    if (await excedeLimite(claveLimite, 10, 300)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Esperá unos minutos." },
        { status: 429 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Entro bien: el contador se borra, asi que un tecleo mal escrito hoy no
    // le cuesta el acceso a nadie manana.
    await limpiarLimite(claveLimite);

    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieOptions = getTokenCookieOptions();
    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        currentStreak: user.currentStreak,
      },
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesion" },
      { status: 500 }
    );
  }
}
