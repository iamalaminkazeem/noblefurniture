import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { InvoicePDF } from "@/lib/invoice-pdf";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Plain public URL to the logo — the standard, well-documented way to pass
  // an image to @react-pdf/renderer. No file reading, no buffer/base64
  // conversion, no edge cases to fight.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noblefurniture.vercel.app";
  const logoSrc = `${siteUrl}/logo.png`;

  const buffer = await renderToBuffer(InvoicePDF({ invoice, logoSrc }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}