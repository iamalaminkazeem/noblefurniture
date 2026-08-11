import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const products = await prisma.product.findMany({
    where: { inStock: true, ...(category ? { category: { name: category } } : {}), ...(featured === "true" ? { featured: true } : {}) },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}
