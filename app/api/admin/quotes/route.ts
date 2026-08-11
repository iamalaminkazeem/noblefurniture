import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { sendQuoteConfirmation, notifyAdminNewQuote } from "@/lib/email";
import { quoteSchema } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`quote:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const captchaOk = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!captchaOk) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const { fullName, email, phone, location, furnitureType, budgetRange, description, preferredDate } = parsed.data;

  const quote = await prisma.quoteRequest.create({
    data: { fullName, email, phone, location, furnitureType, budgetRange, description, preferredDate: preferredDate ? new Date(preferredDate) : undefined },
  });

  try {
    await sendQuoteConfirmation(email, fullName);
    await notifyAdminNewQuote({ fullName, email, phone, furnitureType, description });
  } catch (e) {
    console.error("Quote email failed:", e);
  }

  return NextResponse.json({ success: true, id: quote.id }, { status: 201 });
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(quotes);
}