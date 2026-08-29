import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { panelDeCertificados } from "@/lib/certificados-panel";
import { otorgar } from "@/lib/certificados";
import type { DojoType } from "@/types";

const RUTAS: DojoType[] = ["css", "html", "js", "react", "react-eco", "nextjs"];

/**
 * The teacher's roster of who can be awarded a certificate, and who is close.
 *
 * READ ONLY, on purpose. Awarding is Phase 5.1 and does not exist yet: with an
 * instructor-triggered award, nobody is watching eligibility on the students'
 * behalf, so this view has to exist BEFORE the button -- otherwise a student
 * reaches 100 %, a required module grows, and they fall back below it with no
 * one having seen it.
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const pedido = new URL(request.url).searchParams.get("dojo") ?? "css";
  const dojo = RUTAS.find((r) => r === pedido);
  if (!dojo) {
    // Una ruta que no existe no es un panel vacio: es una pregunta mal hecha, y
    // devolver vacio la haria parecer una cohorte sin alumnos.
    return NextResponse.json({ error: "Ruta desconocida" }, { status: 400 });
  }

  await dbConnect();
  return NextResponse.json({ rutas: RUTAS, panel: await panelDeCertificados(dojo) });
}

/**
 * Awards a certificate. Fase 5.1.
 *
 * The whole endpoint is a guard plus one call: `otorgar` already verifies
 * eligibility and freezes the snapshot from the very check that passed, so
 * there is no window where the award records a different requirement than the
 * one it just verified. Re-deciding any of that here would be a second copy of
 * the rule.
 *
 * ELIGIBILITY IS NOT RE-DECIDED BY THE CALLER. The teacher says WHO, never
 * WHETHER: a request naming a student who is not eligible is refused by
 * `otorgar`, not by this handler, and not by the button being hidden. A UI that
 * hides the button is a convenience; it is not a check.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userId = typeof body?.userId === "string" ? body.userId : null;
  const dojo = RUTAS.find((r) => r === body?.dojo);

  if (!userId || !dojo) {
    return NextResponse.json({ error: "Falta el alumno o la ruta" }, { status: 400 });
  }

  const resultado = await otorgar(userId, dojo);

  if (!resultado.otorgado) {
    // 409 y no 400: la peticion esta bien formada, el estado del alumno es el
    // que no la permite. El motivo viaja entero para que la vista pueda decir
    // QUE le falta, en vez de "no se pudo".
    return NextResponse.json(resultado, { status: 409 });
  }

  return NextResponse.json(resultado);
}
