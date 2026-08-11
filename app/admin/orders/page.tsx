"use client";
import React, { useEffect, useState } from "react";
import { formatNaira } from "@/components/ProductCard";

type Order = {
  id: string; customerName: string; email: string; phone: string; address: string;
  amountKobo: number; status: string; paystackRef: string; createdAt: string;
  items: { quantity: number; priceKobo: number; product: { name: string } }[];
};

const STATUSES = ["PENDING", "PAID", "FAILED", "FULFILLED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/orders").then((r) => r.json()).then((data) => setOrders(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  }

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Orders</h1>
      {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading…</p> : orders.length === 0 ? (
        <p className="text-[#1E1E1E]/50 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-[#0B3D2E]/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-[#1E1E1E]/50">{o.email} · {o.phone}</div>
                  <div className="text-xs text-[#1E1E1E]/50">{o.address}</div>
                </div>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="border border-[#0B3D2E]/15 text-xs px-3 py-1.5">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-sm text-[#1E1E1E]/70 space-y-1 mb-2">
                {o.items.map((i, idx) => <div key={idx}>{i.product.name} × {i.quantity} — {formatNaira(i.priceKobo * i.quantity)}</div>)}
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-[#0B3D2E]/10 pt-2">
                <span>Total</span><span>{formatNaira(o.amountKobo)}</span>
              </div>
              <div className="text-xs text-[#1E1E1E]/40 mt-2">Ref: {o.paystackRef} · {new Date(o.createdAt).toLocaleString("en-NG")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}