"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) return <p className="text-sm text-[#C8A951] flex items-center gap-2"><Check size={16} /> Subscribed — thank you.</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8A951]" />
      <button disabled={submitting} className="bg-[#C8A951] text-[#0B3D2E] px-5 py-2.5 text-sm font-medium disabled:opacity-60">
        {submitting ? "…" : "Join"}
      </button>
    </form>
  );
}