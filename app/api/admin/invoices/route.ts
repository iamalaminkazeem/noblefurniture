import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await prisma.invoiceCounter.upsert({
    where: { id: String(year) },
    update: { count: { increment: 1 } },
    create: { id: String(year), count: 1 },
  });
  return `NFG-${year}-${String(counter.count).padStart(4, "0")}`;
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }

  const body = await req.json();
  const { customerName, customerEmail, customerPhone, customerAddress, dueDate, discountKobo, deliveryKobo, installationKobo, notes, items } = body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Customer name and at least one item are required" }, { status: 400 });
  }

  const subtotalKobo = items.reduce((sum: number, i: any) => sum + i.quantity * i.unitPriceKobo, 0);
  const totalKobo = subtotalKobo - (discountKobo || 0) + (deliveryKobo || 0) + (installationKobo || 0);
  const invoiceNumber = await generateInvoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      subtotalKobo,
      discountKobo: discountKobo || 0,
      deliveryKobo: deliveryKobo || 0,
      installationKobo: installationKobo || 0,
      totalKobo,
      notes,
      items: {
        create: items.map((i: any) => ({
          description: i.description,
          quantity: i.quantity,
          unitPriceKobo: i.unitPriceKobo,
          amountKobo: i.quantity * i.unitPriceKobo,
        })),
      },
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}