import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { InvoicePDF } from "@/lib/invoice-pdf";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 403 }); }
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let logoSrc: Buffer | undefined;
  try {
    logoSrc = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
  } catch {
    console.warn("public/logo.png not found — generating invoice without logo.");
  }

  const buffer = await renderToBuffer(InvoicePDF({ invoice, logoSrc }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}