import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { initializeTransaction } from "@/lib/paystack";
import { checkoutSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`checkout:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });

  const { email, address, customerName, phone, items } = parsed.data;

  try {
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let amountKobo = 0;
    const orderItemsData = items.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) throw new Error(`Product ${i.productId} not found`);
      if (product.stockQuantity < i.quantity) {
        throw new Error(`Only ${product.stockQuantity} left of "${product.name}" — please adjust the quantity in your cart.`);
      }
      amountKobo += product.priceKobo * i.quantity;
      return { productId: product.id, quantity: i.quantity, priceKobo: product.priceKobo };
    });

    const reference = `NFG-${randomUUID()}`;

    const order = await prisma.order.create({
      data: { customerName, email, phone, address, amountKobo, paystackRef: reference, items: { create: orderItemsData } },
    });

    const paystackRes = await initializeTransaction({
      email, amountKobo, reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    });

    return NextResponse.json({ authorization_url: paystackRes.data.authorization_url, orderId: order.id });
  } catch (err) {
    console.error("Checkout init failed:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Something went wrong starting checkout" }, { status: 400 });
  }
}