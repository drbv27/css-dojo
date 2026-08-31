import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { certificadosDe } from "@/lib/certificados";

/**
 * The student's own certificates. Fase 5.3.
 *
 * THE USER ID COMES FROM THE SESSION, NEVER FROM THE REQUEST. There is no
 * parameter to name someone else, on purpose: a certificate carries the
 * student's frozen path, and letting a caller ask for another id would turn a
 * personal record into a directory. A teacher who needs the roster has
 * `/api/teacher/certificados`, which is guarded by role.
 *
 * And it NEVER recomputes. It reads awarded records and nothing else -- no
 * `ALL_MODULES`, no `Progress`, no eligibility check. A certificate is a claim
 * about a past state; re-deriving it from today's curriculum would silently
 * rewrite what the student was told they earned.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  return NextResponse.json({ certificados: await certificadosDe(session.id) });
}
