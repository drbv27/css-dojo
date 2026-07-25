import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Waitlist from "@/lib/models/Waitlist";
import User from "@/lib/models/User";
import { PYTHON_WAITLIST_SLUG, PYTHON_XP_REWARD } from "@/lib/course-launch";

// Slugs permitidos y su recompensa de XP por apuntarse.
const XP_BY_SLUG: Record<string, number> = {
  [PYTHON_WAITLIST_SLUG]: PYTHON_XP_REWARD,
};
const ALLOWED = Object.keys(XP_BY_SLUG);

// GET ?slug= : el estado del usuario actual (¿ya se apunto?).
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!ALLOWED.includes(slug)) {
    return NextResponse.json({ error: "Slug invalido" }, { status: 400 });
  }

  await dbConnect();
  const entry = await Waitlist.findOne({ userId: session.id, itemSlug: slug }).lean();
  return NextResponse.json({ joined: Boolean(entry), comment: entry?.comment ?? "" });
}

const bodySchema = z.object({
  slug: z.enum(ALLOWED as [string, ...string[]]),
  comment: z.string().trim().max(1000).optional(),
});

// POST: apuntarse a la lista (upsert). Otorga XP una sola vez.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }
  const { slug, comment } = parsed.data;

  await dbConnect();

  const existing = await Waitlist.findOne({ userId: session.id, itemSlug: slug }).lean();

  await Waitlist.findOneAndUpdate(
    { userId: session.id, itemSlug: slug },
    { $set: { comment: comment || undefined } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // XP solo la primera vez que se apunta.
  let xpAwarded = 0;
  if (!existing) {
    const reward = XP_BY_SLUG[slug] ?? 0;
    if (reward > 0) {
      await User.findByIdAndUpdate(session.id, { $inc: { xp: reward } });
      xpAwarded = reward;
    }
  }

  return NextResponse.json({ ok: true, xpAwarded });
}
