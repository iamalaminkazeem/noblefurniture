import { NextRequest, NextResponse } from "next/server";
import { getImageKit } from "@/lib/imagekit";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Not authorized" }, { status: 403 }); }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const imagekit = getImageKit();
    const result = await imagekit.upload({ file: buffer, fileName: file.name, folder: "/noble-furniture-gallery" });
    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error("ImageKit upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}