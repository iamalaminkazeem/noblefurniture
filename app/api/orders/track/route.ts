// Public — looks up an order by reference + matching email.
// Requiring both prevents a stranger from tracking your order with just the reference.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const email = searchParams.get("email");
  if (!reference || !email) return NextResponse.json({ error: "Missing reference or email" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { paystackRef: reference },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}