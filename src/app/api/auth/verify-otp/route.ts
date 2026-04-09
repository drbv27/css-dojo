import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Correo y codigo son obligatorios" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+resetOtp +resetOtpExpiresAt");

    if (!user || !user.resetOtp || !user.resetOtpExpiresAt) {
      return NextResponse.json({ message: "Codigo invalido o expirado" }, { status: 401 });
    }

    if (new Date() > user.resetOtpExpiresAt) {
      user.resetOtp = undefined;
      user.resetOtpExpiresAt = undefined;
      await user.save();
      return NextResponse.json({ message: "El codigo ha expirado. Solicita uno nuevo." }, { status: 401 });
    }

    const isValid = await comparePassword(otp, user.resetOtp);
    if (!isValid) {
      return NextResponse.json({ message: "Codigo incorrecto" }, { status: 401 });
    }

    // Generate short-lived reset token (5 min)
    const secret = process.env.JWT_SECRET || "css-dojo-secret-key-cambiar-en-produccion";
    const resetToken = jwt.sign(
      { userId: user._id.toString(), purpose: "password-reset" },
      secret,
      { expiresIn: "5m" }
    );

    // Clear OTP
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ resetToken });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ message: "Error al verificar el codigo" }, { status: 500 });
  }
}
