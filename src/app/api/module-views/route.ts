import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ModuleView from "@/lib/models/ModuleView";
import { slugsVisiblesPara } from "@/lib/moduleVisibility";
import { ALL_MODULES } from "@/data/modules";

// Registra que un alumno abrio un modulo. Ver `@/lib/models/ModuleView` para
// por que hace falta separado de `Progress`.
//
// Tres guards, y los tres existen para que el dato signifique lo que dice:
//
//  1. Al PROFESOR no se le registra nada. Un profesor recorriendo modulos para
//     revisar contenido generaria vistas que despues se leerian como interes de
//     alumno. La respuesta sigue siendo 200 para no darle un error a algo que
//     hizo bien.
//  2. Un `moduleId` que no existe en el curriculum se rechaza. Sin esto,
//     cualquier string entra a la coleccion y el conteo por modulo mezcla
//     basura con datos.
//  3. Un modulo que NO es visible para esa cohorte no cuenta como vista. La
//     pagina de modulo renderiza un estado bloqueado en ese caso, asi que el
//     alumno no vio contenido: registrarlo diria que lo abrio y lo abandono,
//     que es justo la conclusion equivocada.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { moduleId } = await request.json().catch(() => ({ moduleId: undefined }));
  if (typeof moduleId !== "string" || !moduleId) {
    return NextResponse.json({ error: "moduleId requerido" }, { status: 400 });
  }

  if (session.role === "teacher") {
    return NextResponse.json({ registrado: false, motivo: "teacher" });
  }

  if (!ALL_MODULES.some((m) => m.slug === moduleId)) {
    return NextResponse.json({ error: "modulo desconocido" }, { status: 404 });
  }

  await dbConnect();

  const { enabledSlugs } = await slugsVisiblesPara(session);
  if (!enabledSlugs.includes(moduleId)) {
    return NextResponse.json({ registrado: false, motivo: "no-visible" });
  }

  const ahora = new Date();
  await ModuleView.findOneAndUpdate(
    { userId: session.id, moduleId },
    { $inc: { views: 1 }, $set: { lastViewedAt: ahora }, $setOnInsert: { firstViewedAt: ahora } },
    { upsert: true },
  );

  return NextResponse.json({ registrado: true });
}
