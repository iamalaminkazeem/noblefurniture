"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { Btn } from "@/components/ui";
import { formatNaira } from "@/components/ProductCard";

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const { clear } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) { setLoading(false); return; }
    fetch(`/api/checkout/status?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); if (data.status === "PAID") clear(); })
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) return <main className="pt-40 pb-24 text-center text-[#1E1E1E]/50">Confirming your payment…</main>;

  if (!order || order.error) {
    return (
      <main className="pt-40 pb-24 max-w-md mx-auto px-6 text-center">
        <XCircle size={40} className="text-red-500 mx-auto mb-4" />
        <h1 className="serif text-2xl mb-2">Order not found</h1>
        <p className="text-[#1E1E1E]/60 mb-6">We couldn't find that order reference.</p>
        <Link href="/products"><Btn variant="primary">Back to Products</Btn></Link>
      </main>
    );
  }

  const isPaid = order.status === "PAID";

  return (
    <main className="pt-40 pb-24 max-w-md mx-auto px-6 text-center">
      {isPaid ? <CheckCircle2 size={40} className="text-[#0B3D2E] mx-auto mb-4" /> : <Clock size={40} className="text-[#C8A951] mx-auto mb-4" />}
      <h1 className="serif text-2xl mb-2">{isPaid ? "Payment successful" : "Payment pending"}</h1>
      <p className="text-[#1E1E1E]/60 mb-6">
        {isPaid ? "Thank you — your order is confirmed. A receipt has been sent to your email." : "We're still confirming this payment with Paystack. Refresh in a moment, or contact us with your reference."}
      </p>
      <div className="bg-[#F8F8F8] p-6 text-left text-sm mb-8">
        <div className="flex justify-between mb-2"><span className="text-[#1E1E1E]/50">Reference</span><span>{order.paystackRef}</span></div>
        <div className="flex justify-between"><span className="text-[#1E1E1E]/50">Amount</span><span>{formatNaira(order.amountKobo)}</span></div>
      </div>
      <Link href="/products"><Btn variant="primary">Continue Shopping</Btn></Link>
    </main>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<main className="pt-40 pb-24 text-center text-[#1E1E1E]/50">Loading…</main>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}