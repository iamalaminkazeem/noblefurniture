"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Download, Eye } from "lucide-react";

type Invoice = { id: string; invoiceNumber: string; customerName: string; totalKobo: number; status: string; createdAt: string };

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/invoices").then((r) => r.json()).then((data) => setInvoices(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="serif text-3xl font-light">Invoices</h1>
        <Link href="/admin/invoices/new" className="bg-[#0B3D2E] text-white px-5 py-2.5 text-sm flex items-center gap-2"><Plus size={16} /> New Invoice</Link>
      </div>

      {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading…</p> : invoices.length === 0 ? (
        <p className="text-[#1E1E1E]/50 text-sm">No invoices yet.</p>
      ) : (
        <div className="bg-white border border-[#0B3D2E]/10">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center gap-4 p-4 border-b border-[#0B3D2E]/10 last:border-0">
              <div className="flex-1">
                <div className="font-medium">{inv.invoiceNumber} — {inv.customerName}</div>
                <div className="text-xs text-[#1E1E1E]/50">{formatNaira(inv.totalKobo)} · {inv.status} · {new Date(inv.createdAt).toLocaleDateString("en-NG")}</div>
              </div>
              <Link href={`/admin/invoices/${inv.id}`} className="p-2 text-[#0B3D2E] hover:bg-[#F8F8F8]" aria-label="View"><Eye size={16} /></Link>
              <a href={`/api/admin/invoices/${inv.id}/pdf`} className="p-2 text-[#0B3D2E] hover:bg-[#F8F8F8]" aria-label="Download PDF"><Download size={16} /></a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}