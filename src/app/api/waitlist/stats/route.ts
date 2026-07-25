import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Waitlist from "@/lib/models/Waitlist";
import User from "@/lib/models/User";

// GET ?slug= (solo profesor): total + lista de apuntados a una lista de espera.
export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("slug") ?? "";

  await dbConnect();
  void User;

  const docs = await Waitlist.find({ itemSlug: slug })
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();

  const people = docs.map((d) => {
    const u = d.userId as unknown as { name?: string; email?: string } | null;
    return {
      name: u?.name ?? "(usuario eliminado)",
      email: u?.email ?? "",
      comment: d.comment ?? "",
      createdAt: d.createdAt,
    };
  });

  return NextResponse.json({ total: people.length, people });
}
