import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const { id } = await params;
  const { status } = await req.json();
  if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });
  const updated = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}