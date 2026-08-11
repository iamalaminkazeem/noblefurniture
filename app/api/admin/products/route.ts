import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const body = await req.json();
  const { name, slug, description, material, priceKobo, images, categoryId, featured, inStock } = body;
  if (!name || !slug || !priceKobo || !categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: { name, slug, description, material, priceKobo, images: images || [], categoryId, featured: !!featured, inStock: inStock !== false },
  });
  return NextResponse.json(product, { status: 201 });
}