"use client";
import React, { useEffect, useState } from "react";

type Consultation = { id: string; fullName: string; email: string; phone: string; preferredDate: string; notes?: string; status: string; createdAt: string };

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function AdminConsultations() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/consultations").then((r) => r.json()).then((data) => setItems(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch("/api/admin/consultations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  }

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Consultation Requests</h1>
      {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading…</p> : items.length === 0 ? (
        <p className="text-[#1E1E1E]/50 text-sm">No consultation requests yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((c) => (
            <div key={c.id} className="bg-white border border-[#0B3D2E]/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <div className="font-medium">{c.fullName}</div>
                  <div className="text-xs text-[#1E1E1E]/50">{c.email} · {c.phone}</div>
                </div>
                <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="border border-[#0B3D2E]/15 text-xs px-3 py-1.5">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-sm text-[#1E1E1E]/70 mb-1">Preferred date: {new Date(c.preferredDate).toLocaleDateString("en-NG")}</div>
              {c.notes && <p className="text-sm text-[#1E1E1E]/60">{c.notes}</p>}
              <div className="text-xs text-[#1E1E1E]/40 mt-3">{new Date(c.createdAt).toLocaleString("en-NG")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
