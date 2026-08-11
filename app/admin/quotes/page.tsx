"use client";
import React, { useEffect, useState } from "react";

type Quote = {
  id: string; fullName: string; email: string; phone: string; location: string;
  furnitureType: string; budgetRange?: string; description: string; status: string; createdAt: string;
};

const STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/quotes").then((r) => r.json()).then((data) => setQuotes(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q))); // optimistic
    await fetch("/api/admin/quotes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  }

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Quote Requests</h1>
      {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading…</p> : quotes.length === 0 ? (
        <p className="text-[#1E1E1E]/50 text-sm">No quote requests yet.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="bg-white border border-[#0B3D2E]/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <div className="font-medium">{q.fullName}</div>
                  <div className="text-xs text-[#1E1E1E]/50">{q.email} · {q.phone} · {q.location}</div>
                </div>
                <select value={q.status} onChange={(e) => updateStatus(q.id, e.target.value)} className="border border-[#0B3D2E]/15 text-xs px-3 py-1.5">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-sm text-[#1E1E1E]/70 mb-2"><span className="font-medium">{q.furnitureType}</span>{q.budgetRange && ` · ${q.budgetRange}`}</div>
              <p className="text-sm text-[#1E1E1E]/60">{q.description}</p>
              <div className="text-xs text-[#1E1E1E]/40 mt-3">{new Date(q.createdAt).toLocaleString("en-NG")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
