import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function serializeInvoice(inv: any) {
  return {
    ...inv,
    subtotalKobo: Number(inv.subtotalKobo),
    discountKobo: Number(inv.discountKobo),
    deliveryKobo: Number(inv.deliveryKobo),
    installationKobo: Number(inv.installationKobo),
    totalKobo: Number(inv.totalKobo),
    items: inv.items?.map((i: any) => ({
      ...i,
      unitPriceKobo: Number(i.unitPriceKobo),
      amountKobo: Number(i.amountKobo),
    })),
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeInvoice(invoice));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const { id } = await params;
  const { status } = await req.json();
  if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });
  const updated = await prisma.invoice.update({ where: { id }, data: { status } });
  return NextResponse.json(serializeInvoice(updated));
}