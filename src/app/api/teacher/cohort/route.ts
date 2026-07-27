import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CohortConfig, { readCohortConfig } from "@/lib/models/CohortConfig";
import User from "@/lib/models/User";

// GET : configuracion de cohortes + cuantos alumnos hay en cada una.
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await dbConnect();
  const cfg = await readCohortConfig();

  const counts = await User.aggregate<{ _id: number; count: number }>([
    { $match: { role: "student" } },
    { $group: { _id: "$cohort", count: { $sum: 1 } } },
  ]);
  const studentsByCohort: Record<number, number> = {};
  for (const c of counts) studentsByCohort[c._id ?? 1] = c.count;

  return NextResponse.json({
    activeCohort: cfg.activeCohort,
    cohortCount: cfg.cohortCount,
    migrated: cfg.migrated,
    studentsByCohort,
  });
}

// PUT : fijar la cohorte activa (a la que se asignan los nuevos registros).
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const activeCohort = Number(body.activeCohort);

  await dbConnect();
  const cfg = await CohortConfig.findOne({ key: "config" });
  if (!cfg) {
    return NextResponse.json(
      { error: "Aun no se migra al modelo por cohortes." },
      { status: 409 }
    );
  }

  if (!Number.isInteger(activeCohort) || activeCohort < 1 || activeCohort > cfg.cohortCount) {
    return NextResponse.json(
      { error: `activeCohort debe ser un entero entre 1 y ${cfg.cohortCount}` },
      { status: 400 }
    );
  }

  cfg.activeCohort = activeCohort;
  await cfg.save();

  return NextResponse.json({ activeCohort: cfg.activeCohort, cohortCount: cfg.cohortCount });
}

// POST : crear una nueva cohorte (incrementa el contador). Opcional: activarla.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  await dbConnect();
  const cfg = await CohortConfig.findOne({ key: "config" });
  if (!cfg) {
    return NextResponse.json(
      { error: "Aun no se migra al modelo por cohortes." },
      { status: 409 }
    );
  }

  cfg.cohortCount += 1;
  if (body.setActive === true) cfg.activeCohort = cfg.cohortCount;
  await cfg.save();

  return NextResponse.json({ activeCohort: cfg.activeCohort, cohortCount: cfg.cohortCount });
}
