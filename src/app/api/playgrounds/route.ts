import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Playground from "@/lib/models/Playground";

// GET /api/playgrounds - list user's playgrounds
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();
    const playgrounds = await Playground.find({ userId: session.id })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ playgrounds });
  } catch (error) {
    console.error("Error fetching playgrounds:", error);
    return NextResponse.json(
      { error: "Error al obtener playgrounds" },
      { status: 500 }
    );
  }
}

// POST /api/playgrounds - create new playground
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { title, html, css } = body;

    await dbConnect();
    const playground = await Playground.create({
      userId: session.id,
      title: title || "Playground sin titulo",
      html: html || "",
      css: css || "",
    });

    return NextResponse.json({ playground }, { status: 201 });
  } catch (error) {
    console.error("Error creating playground:", error);
    return NextResponse.json(
      { error: "Error al crear playground" },
      { status: 500 }
    );
  }
}
