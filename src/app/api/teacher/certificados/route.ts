import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { panelDeCertificados } from "@/lib/certificados-panel";
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
