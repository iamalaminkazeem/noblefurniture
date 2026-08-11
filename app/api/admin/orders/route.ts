import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}