"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Check } from "lucide-react";

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

export default function ViewInvoice() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch(`/api/admin/invoices/${id}`).then((r) => r.json()).then(setInvoice).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function togglePaid() {
    const newStatus = invoice.status === "PAID" ? "UNPAID" : "PAID";
    setInvoice((prev: any) => ({ ...prev, status: newStatus })); // optimistic
    await fetch(`/api/admin/invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
  }

  if (loading) return <p className="text-[#1E1E1E]/50 text-sm">Loading…</p>;
  if (!invoice) return <p className="text-[#1E1E1E]/50 text-sm">Invoice not found.</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="serif text-3xl font-light">{invoice.invoiceNumber}</h1>
        <div className="flex gap-3">
          <a href={`/api/admin/invoices/${id}/pdf`} className="border border-[#0B3D2E] text-[#0B3D2E] px-4 py-2.5 text-sm flex items-center gap-2"><Download size={16} /> PDF</a>
          <button onClick={togglePaid} className={`px-4 py-2.5 text-sm flex items-center gap-2 ${invoice.status === "PAID" ? "bg-[#F8F8F8] text-[#1E1E1E]" : "bg-[#0B3D2E] text-white"}`}>
            <Check size={16} /> Mark as {invoice.status === "PAID" ? "Unpaid" : "Paid"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#0B3D2E]/10 p-6 mb-6">
        <div className="font-medium mb-1">{invoice.customerName}</div>
        <div className="text-sm text-[#1E1E1E]/60">{invoice.customerPhone} {invoice.customerEmail && `· ${invoice.customerEmail}`}</div>
        {invoice.customerAddress && <div className="text-sm text-[#1E1E1E]/60 mt-1">{invoice.customerAddress}</div>}
      </div>

      <div className="bg-white border border-[#0B3D2E]/10 p-6 mb-6">
        <div className="space-y-2 mb-4">
          {invoice.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.description} × {item.quantity}</span>
              <span>{formatNaira(item.amountKobo)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#0B3D2E]/10 pt-4 flex justify-between font-medium">
          <span>Total</span><span>{formatNaira(invoice.totalKobo)}</span>
        </div>
        <div className="mt-2 text-sm">
          Status: <span className={invoice.status === "PAID" ? "text-[#0B3D2E] font-medium" : "text-[#C8A951] font-medium"}>{invoice.status}</span>
        </div>
      </div>
    </div>
  );
}