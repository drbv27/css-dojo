import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Playground from "@/lib/models/Playground";

// GET /api/playgrounds/[id] - get single playground
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const playground = await Playground.findOne({
      _id: id,
      userId: session.id,
    }).lean();

    if (!playground) {
      return NextResponse.json(
        { error: "Playground no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ playground });
  } catch (error) {
    console.error("Error fetching playground:", error);
    return NextResponse.json(
      { error: "Error al obtener playground" },
      { status: 500 }
    );
  }
}

// PUT /api/playgrounds/[id] - update playground
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, html, css } = body;

    await dbConnect();
    const playground = await Playground.findOneAndUpdate(
      { _id: id, userId: session.id },
      { title, html, css },
      { new: true }
    ).lean();

    if (!playground) {
      return NextResponse.json(
        { error: "Playground no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ playground });
  } catch (error) {
    console.error("Error updating playground:", error);
    return NextResponse.json(
      { error: "Error al actualizar playground" },
      { status: 500 }
    );
  }
}

// DELETE /api/playgrounds/[id] - delete playground
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const playground = await Playground.findOneAndDelete({
      _id: id,
      userId: session.id,
    });

    if (!playground) {
      return NextResponse.json(
        { error: "Playground no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting playground:", error);
    return NextResponse.json(
      { error: "Error al eliminar playground" },
      { status: 500 }
    );
  }
}
