// POST /api/quotes — public, rate-limited, reCAPTCHA + honeypot protected.
// GET  /api/quotes — admin only (Clerk-protected via middleware.ts).
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
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

  // Honeypot: a real visitor never fills this hidden field. A bot usually does.
  if (parsed.data.website) {
    return NextResponse.json({ success: true }); // silently pretend success, don't tip off bots
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(quotes);
}
