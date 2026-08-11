"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, Btn } from "@/components/ui";
import { useCart } from "@/components/CartProvider";
import { formatNaira } from "@/components/ProductCard";

export default function CheckoutPage() {
  const { items, totalKobo } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <main className="pt-40 pb-24 max-w-2xl mx-auto px-6 text-center">
        <h1 className="serif text-3xl font-light mb-4">Nothing to check out</h1>
        <Link href="/products" className="text-[#0B3D2E] underline">Browse products</Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: form.get("customerName"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      // Real call — hits app/api/checkout/initialize/route.ts, which creates
      // the Order in Postgres and starts a real Paystack transaction.
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url; // redirect to real Paystack payment page
    } catch (err: any) {
      setError(err.message || "Something went wrong starting checkout.");
      setSubmitting(false);
    }
  }

  return (
    <main className="pt-32 pb-24 max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
      <div>
        <h1 className="serif text-3xl font-light mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name" name="customerName" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone / WhatsApp" name="phone" required />
          <Field label="Delivery address" name="address" textarea required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Btn variant="primary" type="submit" disabled={submitting} className="w-full">
            {submitting ? "Redirecting to payment…" : `Pay ${formatNaira(totalKobo)} with Paystack`}
          </Btn>
          <p className="text-xs text-[#1E1E1E]/40 text-center">You'll be redirected to Paystack's secure checkout to complete payment.</p>
        </form>
      </div>

      <div className="bg-[#F8F8F8] p-8 h-fit">
        <div className="serif text-xl mb-6">Order Summary</div>
        <div className="space-y-4 mb-6">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span>{formatNaira(i.priceKobo * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#0B3D2E]/10 pt-4 flex justify-between font-medium">
          <span>Total</span><span>{formatNaira(totalKobo)}</span>
        </div>
      </div>
    </main>
  );
}
