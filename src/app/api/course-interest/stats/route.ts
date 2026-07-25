import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CourseInterest from "@/lib/models/CourseInterest";
import User from "@/lib/models/User";
import {
  SURVEY_SLUG,
  PRODUCTS,
  BUY_INTENT_OPTIONS,
  SANDBOX_WTP_OPTIONS,
} from "@/lib/course-launch";

// GET (solo profesor): resultados agregados del sondeo de pre-lanzamiento.
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  void User; // asegura registro del modelo para el populate

  const docs = await CourseInterest.find({ surveySlug: SURVEY_SLUG })
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();

  const total = docs.length;
  // Senal dura: cuantos manifestaron intencion de compra concreta (no "explorando").
  const buyers = docs.filter((d) => d.buyIntent && d.buyIntent !== "exploring").length;

  const products = PRODUCTS.map((p) => ({
    key: p.slug,
    label: p.name,
    count: docs.filter((d) => (d.products || []).includes(p.slug)).length,
  }));

  const buyIntent = BUY_INTENT_OPTIONS.map((o) => ({
    key: o.key,
    label: o.label,
    count: docs.filter((d) => d.buyIntent === o.key).length,
  }));

  const sandboxWtp = SANDBOX_WTP_OPTIONS.map((o) => ({
    key: o.key,
    label: o.label,
    count: docs.filter((d) => d.sandboxWtp === o.key).length,
  }));

  const respondents = docs.map((d) => {
    const u = d.userId as unknown as { name?: string; email?: string } | null;
    return {
      name: u?.name ?? "(usuario eliminado)",
      email: u?.email ?? "",
      products: d.products || [],
      buyIntent: d.buyIntent,
      individualPicks: d.individualPicks || [],
      sandboxWtp: d.sandboxWtp,
      comment: d.comment ?? "",
      createdAt: d.createdAt,
    };
  });

  return NextResponse.json({ total, buyers, products, buyIntent, sandboxWtp, respondents });
}
