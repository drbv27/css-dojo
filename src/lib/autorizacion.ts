import { NextResponse } from "next/server";
import type { JWTPayload } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

/**
 * Veta a un alumno cuya cuenta el profesor todavia no aprobo.
 *
 * `ApprovalGate` es un componente de CLIENTE: oculta la interfaz, no protege
 * los datos. Hasta que existio esta funcion, un alumno recien registrado —que
 * ve la pantalla "esperando aprobacion"— podia llamar a los endpoints desde la
 * consola con la cookie que ya tenia, y completar ejercicios y sumar XP igual.
 * El control que el profesor creia estar ejerciendo no existia en el servidor.
 *
 * `approved` se consulta contra la base y NO se lee del token: la aprobacion
 * se puede revocar, y un JWT vive siete dias.
 *
 * Devuelve la respuesta de rechazo, o `null` si puede seguir.
 */
export async function vetoPorCuentaNoAprobada(
  session: JWTPayload
): Promise<NextResponse | null> {
  if (session.role === "teacher") return null;

  await dbConnect();
  const user = await User.findById(session.id)
    .select("approved")
    .lean<{ approved?: boolean } | null>();

  if (!user?.approved) {
    return NextResponse.json(
      { error: "Tu cuenta todavía no fue aprobada por el profesor" },
      { status: 403 }
    );
  }
  return null;
}
