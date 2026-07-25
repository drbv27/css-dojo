import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CourseInterest from "@/lib/models/CourseInterest";
import User from "@/lib/models/User";
import {
  SURVEY_SLUG,
  OPEN_CODE_BADGE,
  OPEN_CODE_XP_REWARD,
  PRODUCT_SLUGS,
  BUY_INTENT_KEYS,
  SANDBOX_WTP_KEYS,
} from "@/lib/course-launch";

// GET: la respuesta del usuario actual (para pintar el estado "ya respondiste").
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const interest = await CourseInterest.findOne({
    userId: session.id,
    surveySlug: SURVEY_SLUG,
  }).lean();

  return NextResponse.json({ interest: interest ?? null });
}

const enumOf = (vals: string[]) => z.enum(vals as [string, ...string[]]);

const bodySchema = z.object({
  products: z.array(enumOf(PRODUCT_SLUGS)).max(10).default([]),
  buyIntent: enumOf(BUY_INTENT_KEYS),
  individualPicks: z.array(enumOf(PRODUCT_SLUGS)).max(10).default([]),
  sandboxWtp: enumOf(SANDBOX_WTP_KEYS),
  comment: z.string().trim().max(1000).optional(),
});

// POST: responde el sondeo (upsert). Otorga badge+XP una sola vez.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { products, buyIntent, individualPicks, sandboxWtp, comment } = parsed.data;

  await dbConnect();

  await CourseInterest.findOneAndUpdate(
    { userId: session.id, surveySlug: SURVEY_SLUG },
    {
      $set: {
        products,
        buyIntent,
        individualPicks: buyIntent === "individual" ? individualPicks : [],
        sandboxWtp,
        comment: comment || undefined,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Badge + XP por participar, solo la primera vez.
  let awardedBadge = false;
  const user = await User.findById(session.id);
  if (user && !user.badges.includes(OPEN_CODE_BADGE)) {
    user.badges.push(OPEN_CODE_BADGE);
    user.xp += OPEN_CODE_XP_REWARD;
    await user.save();
    awardedBadge = true;
  }

  return NextResponse.json({
    ok: true,
    awardedBadge,
    xpAwarded: awardedBadge ? OPEN_CODE_XP_REWARD : 0,
    badge: OPEN_CODE_BADGE,
  });
}
