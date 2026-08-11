import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { notifyAdminNewConsultation, sendConsultationConfirmation } from "@/lib/email";
import { consultationSchema } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`consult:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ success: true });

  const captchaOk = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!captchaOk) return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });

  const { fullName, email, phone, preferredDate, notes } = parsed.data;
  const booking = await prisma.consultation.create({ data: { fullName, email, phone, preferredDate: new Date(preferredDate), notes } });

  try {
    await sendConsultationConfirmation(email, fullName);
    await notifyAdminNewConsultation({ fullName, email, phone, preferredDate, notes });
  } catch (e) {
    console.error("Consultation email failed:", e);
  }

  return NextResponse.json({ success: true, id: booking.id }, { status: 201 });
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const bookings = await prisma.consultation.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(bookings);
}