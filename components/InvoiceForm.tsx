"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Field, Btn } from "./ui";

type Line = { description: string; quantity: string; unitPrice: string };

export function InvoiceForm() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState("0");
  const [delivery, setDelivery] = useState("0");
  const [installation, setInstallation] = useState("0");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ description: "", quantity: "1", unitPrice: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateLine(i: number, field: keyof Line, value: string) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  }
  function removeLine(i: number) {
    setLines((prev) => prev.filter((_, idx) => idx !== i));
  }

  const subtotal = lines.reduce((sum, l) => sum + (parseFloat(l.quantity) || 0) * (parseFloat(l.unitPrice) || 0), 0);
  const total = subtotal - (parseFloat(discount) || 0) + (parseFloat(delivery) || 0) + (parseFloat(installation) || 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      customerName, customerEmail, customerPhone, customerAddress,
      dueDate: dueDate || undefined,
      discountKobo: Math.round((parseFloat(discount) || 0) * 100),
      deliveryKobo: Math.round((parseFloat(delivery) || 0) * 100),
      installationKobo: Math.round((parseFloat(installation) || 0) * 100),
      notes,
      items: lines
        .filter((l) => l.description && l.unitPrice)
        .map((l) => ({ description: l.description, quantity: parseInt(l.quantity) || 1, unitPriceKobo: Math.round(parseFloat(l.unitPrice) * 100) })),
    };

    try {
      const res = await fetch("/api/admin/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      const invoice = await res.json();
      router.push(`/admin/invoices/${invoice.id}`);
    } catch {
      setError("Something went wrong creating this invoice.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 bg-white p-8 border border-[#0B3D2E]/10">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Customer name" value={customerName} onChange={(e: any) => setCustomerName(e.target.value)} required />
        <Field label="Phone" value={customerPhone} onChange={(e: any) => setCustomerPhone(e.target.value)} />
        <Field label="Email" type="email" value={customerEmail} onChange={(e: any) => setCustomerEmail(e.target.value)} />
        <Field label="Due date" type="date" value={dueDate} onChange={(e: any) => setDueDate(e.target.value)} />
      </div>
      <Field label="Customer address" textarea value={customerAddress} onChange={(e: any) => setCustomerAddress(e.target.value)} />

      <div>
        <div className="text-xs text-[#1E1E1E]/60 uppercase tracking-wide mb-2">Items</div>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input placeholder="Description" value={line.description} onChange={(e) => updateLine(i, "description", e.target.value)} className="flex-1 border border-[#0B3D2E]/15 px-3 py-2 text-sm" />
              <input placeholder="Qty" type="number" min="1" value={line.quantity} onChange={(e) => updateLine(i, "quantity", e.target.value)} className="w-20 border border-[#0B3D2E]/15 px-3 py-2 text-sm" />
              <input placeholder="Unit price (₦)" type="number" value={line.unitPrice} onChange={(e) => updateLine(i, "unitPrice", e.target.value)} className="w-32 border border-[#0B3D2E]/15 px-3 py-2 text-sm" />
              <button type="button" onClick={() => removeLine(i)} className="p-2 text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLine} className="mt-3 text-sm text-[#0B3D2E] flex items-center gap-1.5"><Plus size={14} /> Add item</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Discount (₦)" type="number" value={discount} onChange={(e: any) => setDiscount(e.target.value)} />
        <Field label="Delivery (₦)" type="number" value={delivery} onChange={(e: any) => setDelivery(e.target.value)} />
        <Field label="Installation (₦)" type="number" value={installation} onChange={(e: any) => setInstallation(e.target.value)} />
      </div>
      <Field label="Notes" textarea value={notes} onChange={(e: any) => setNotes(e.target.value)} />

      <div className="flex justify-between text-lg border-t border-[#0B3D2E]/10 pt-4">
        <span>Total</span><span className="font-medium">₦{total.toLocaleString("en-NG")}</span>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Btn variant="primary" type="submit" disabled={saving}>{saving ? "Creating…" : "Create Invoice"}</Btn>
    </form>
  );
}