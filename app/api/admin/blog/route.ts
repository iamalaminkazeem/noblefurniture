import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  const body = await req.json();
  const { title, slug, excerpt, content, coverImage, published } = body;
  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const post = await prisma.blogPost.create({
    data: { title, slug, excerpt, content, coverImage, published: !!published, publishedAt: published ? new Date() : null },
  });
  return NextResponse.json(post, { status: 201 });
}