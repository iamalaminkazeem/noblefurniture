import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), website: z.string().max(0).optional() });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ success: true }); // honeypot

  try {
    await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email } });
  } catch {
    // Unique constraint — they're already subscribed. Don't leak that, just say success.
  }

  return NextResponse.json({ success: true });
}