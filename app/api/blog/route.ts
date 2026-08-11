import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
  return NextResponse.json(posts);
}
