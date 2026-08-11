"use client";
import React, { useState } from "react";
import { PageHero, SectionLabel, Field, Btn } from "@/components/ui";
import { IMG } from "@/lib/content";
import { formatNaira } from "@/components/ProductCard";

export default function TrackOrder() {
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    const form = new FormData(e.currentTarget);
    const reference = form.get("reference") as string;
    const email = form.get("email") as string;

    try {
      const res = await fetch(`/api/orders/track?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Not found");
      setOrder(await res.json());
    } catch {
      setError("No matching order found. Double-check your reference and email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-20">
      <PageHero eyebrow="Track Order" title="Check your order status" img={IMG.office} />
      <section className="max-w-xl mx-auto px-6 lg:px-10 py-24">
        <SectionLabel>Order Lookup</SectionLabel>
        <h2 className="serif text-3xl font-light mb-8">Enter your details</h2>
        <form onSubmit={handleSubmit} className="bg-[#F8F8F8] p-8 space-y-4 mb-8">
          <Field label="Order reference" name="reference" placeholder="NFG-xxxxxxxx" required />
          <Field label="Email used at checkout" name="email" type="email" required />
          <Btn variant="primary" type="submit" disabled={loading} className="w-full">{loading ? "Looking up…" : "Track Order"}</Btn>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        {order && (
          <div className="bg-white border border-[#0B3D2E]/10 p-6">
            <div className="flex justify-between mb-4"><span className="text-[#1E1E1E]/50 text-sm">Status</span><span className="font-medium">{order.status}</span></div>
            <div className="space-y-2 mb-4 text-sm">
              {order.items.map((i: any, idx: number) => <div key={idx} className="flex justify-between"><span>{i.product.name} × {i.quantity}</span><span>{formatNaira(i.priceKobo * i.quantity)}</span></div>)}
            </div>
            <div className="flex justify-between font-medium border-t border-[#0B3D2E]/10 pt-3"><span>Total</span><span>{formatNaira(order.amountKobo)}</span></div>
          </div>
        )}
      </section>
    </main>
  );
}