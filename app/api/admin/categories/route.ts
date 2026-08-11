import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const category = await prisma.category.create({ data: { name, slug: slugify(name) } });
  return NextResponse.json(category, { status: 201 });
}