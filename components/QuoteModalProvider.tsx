"use client";
import React, { createContext, useContext, useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { Field } from "./ui";
import { CATEGORIES } from "@/lib/content";
import { getRecaptchaToken } from "./RecaptchaScript";

const QuoteModalContext = createContext<{ open: () => void } | null>(null);

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error("useQuoteModal must be used within QuoteModalProvider");
  return ctx;
}

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function close() {
    setIsOpen(false);
    setTimeout(() => { setSent(false); setError(""); }, 300);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const recaptchaToken = await getRecaptchaToken("quote_submit");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
    } catch {
      setError("Something went wrong sending your request. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <QuoteModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative bg-white max-w-lg w-full max-h-[88vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-7 py-5 border-b border-[#0B3D2E]/10">
              <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#C8A951]" /><span className="serif text-xl">Request a Quote</span></div>
              <button onClick={close} aria-label="Close"><X size={20} /></button>
            </div>

            {sent ? (
              <div className="p-10 flex flex-col items-center text-center">
                <Check size={32} className="text-[#0B3D2E] mb-4" />
                <div className="serif text-2xl mb-2">Quote request sent</div>
                <p className="text-sm text-[#1E1E1E]/60 mb-6">A confirmation has been sent to your email. Our team will reach out within one business day.</p>
                <button onClick={close} className="bg-[#0B3D2E] text-white px-7 py-3 text-sm">Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-7 space-y-4">
                {/* Honeypot — hidden from real users via CSS, bots tend to fill every field */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] w-px h-px opacity-0" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" name="fullName" required />
                  <Field label="Phone / WhatsApp" name="phone" required />
                </div>
                <Field label="Email" name="email" type="email" required />
                <Field label="Location" name="location" required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block text-xs text-[#1E1E1E]/60 uppercase tracking-wide">
                    Furniture type
                    <select name="furnitureType" required className="w-full bg-white border border-[#0B3D2E]/15 px-4 py-3 text-sm mt-1.5 focus:outline-none focus:border-[#C8A951]">
                      {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                      <option>Custom / Other</option>
                    </select>
                  </label>
                  <label className="block text-xs text-[#1E1E1E]/60 uppercase tracking-wide">
                    Budget range
                    <select name="budgetRange" className="w-full bg-white border border-[#0B3D2E]/15 px-4 py-3 text-sm mt-1.5 focus:outline-none focus:border-[#C8A951]">
                      <option>Under ₦500,000</option>
                      <option>₦500,000 – ₦1,500,000</option>
                      <option>₦1,500,000 – ₦3,000,000</option>
                      <option>Above ₦3,000,000</option>
                    </select>
                  </label>
                </div>
                <Field label="Describe what you need" name="description" textarea required />
                <Field label="Preferred date" name="preferredDate" type="date" />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button disabled={submitting} className="w-full bg-[#0B3D2E] text-white px-7 py-3.5 text-sm disabled:opacity-60">
                  {submitting ? "Sending…" : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </QuoteModalContext.Provider>
  );
}
