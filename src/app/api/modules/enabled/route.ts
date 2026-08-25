import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { slugsVisiblesPara } from "@/lib/moduleVisibility";

// Devuelve los slugs de modulos VISIBLES para el alumno segun su cohorte.
// La regla vive en `@/lib/moduleVisibility` porque `POST /api/module-views`
// necesita exactamente la misma.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ enabledSlugs: [] });
  }

  await dbConnect();
  return NextResponse.json(await slugsVisiblesPara(session));
}
