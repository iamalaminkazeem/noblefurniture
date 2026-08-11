"use client";
import React from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatNaira } from "@/components/ProductCard";
import { Btn } from "@/components/ui";

export default function CartPage() {
  const { items, totalKobo, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-40 pb-24 max-w-2xl mx-auto px-6 text-center">
        <h1 className="serif text-3xl font-light mb-4">Your cart is empty</h1>
        <p className="text-[#1E1E1E]/60 mb-8">Browse our collections and add pieces you're interested in.</p>
        <Link href="/products"><Btn variant="primary">Browse Products</Btn></Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-10">
      <h1 className="serif text-4xl font-light mb-10">Your Cart</h1>
      <div className="divide-y divide-[#0B3D2E]/10 border-t border-b border-[#0B3D2E]/10 mb-10">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-5 py-6">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="serif text-lg mb-1">{item.name}</div>
              <div className="text-sm text-[#1E1E1E]/60">{formatNaira(item.priceKobo)}</div>
            </div>
            <div className="flex items-center gap-3 border border-[#0B3D2E]/15">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2"><Minus size={14} /></button>
              <span className="text-sm w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2"><Plus size={14} /></button>
            </div>
            <div className="text-sm font-medium w-28 text-right">{formatNaira(item.priceKobo * item.quantity)}</div>
            <button onClick={() => removeItem(item.productId)} className="text-[#1E1E1E]/40 hover:text-red-600" aria-label="Remove"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-10">
        <span className="text-[#1E1E1E]/60">Subtotal</span>
        <span className="serif text-2xl">{formatNaira(totalKobo)}</span>
      </div>

      <Link href="/checkout"><Btn variant="primary" className="w-full sm:w-auto">Proceed to Checkout <ArrowRight size={16} /></Btn></Link>
    </main>
  );
}
