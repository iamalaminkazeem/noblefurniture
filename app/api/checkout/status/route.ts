import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const reference = new URL(req.url).searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { paystackRef: reference }, include: { items: { include: { product: true } } } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}