import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAdminNewContact } from "@/lib/email";
import { contactSchema } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ success: true });

  const captchaOk = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!captchaOk) return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });

  const { fullName, email, phone, message } = parsed.data;
  const saved = await prisma.contactMessage.create({ data: { fullName, email, phone, message } });

  try {
    await notifyAdminNewContact({ fullName, email, phone, message });
  } catch (e) {
    console.error("Contact email failed:", e);
  }

  return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
}
