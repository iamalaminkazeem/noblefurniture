import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const verified = await verifyTransaction(reference);
    const isPaid = verified.data.status === "success";

    const order = await prisma.order.update({
      where: { paystackRef: reference },
      data: { status: isPaid ? "PAID" : "FAILED" },
      include: { items: true },
    });

    if (isPaid) {
      for (const item of order.items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;
        const newQty = Math.max(0, product.stockQuantity - item.quantity);
        await prisma.product.update({ where: { id: item.productId }, data: { stockQuantity: newQty, inStock: newQty > 0 } });
      }
    }
  }

  return NextResponse.json({ received: true });
}