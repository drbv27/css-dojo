import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import { generateOtp, sendOtpEmail } from "@/lib/email";
import { excedeLimite } from "@/lib/limite";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "El correo es obligatorio" }, { status: 400 });
    }

    await dbConnect();

    // Cada llamada manda un correo por Resend: sin tope, este endpoint es un
    // caño de spam con el dominio del dojo como remitente.
    if (await excedeLimite(`forgot:${String(email).toLowerCase()}`, 3, 900)) {
      // Mismo mensaje que el camino feliz: no revela si el correo existe.
      return NextResponse.json({ message: "Si el correo esta registrado, recibiras un codigo" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return 200 to not reveal if email exists
    if (!user) {
      return NextResponse.json({ message: "Si el correo esta registrado, recibiras un codigo" });
    }

    const otp = generateOtp();
    const hashedOtp = await hashPassword(otp);

    user.resetOtp = hashedOtp;
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp, user.name);

    return NextResponse.json({ message: "Si el correo esta registrado, recibiras un codigo" });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Error al enviar el codigo" }, { status: 500 });
  }
}
