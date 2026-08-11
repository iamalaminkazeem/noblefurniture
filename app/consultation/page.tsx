"use client";
import React, { useState } from "react";
import { Check, CalendarCheck } from "lucide-react";
import { PageHero, SectionLabel, Field } from "@/components/ui";
import { IMG } from "@/lib/content";
import { getRecaptchaToken } from "@/components/RecaptchaScript";

export default function BookConsultation() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const recaptchaToken = await getRecaptchaToken("consultation_submit");

    try {
      const res = await fetch("/api/consultations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, recaptchaToken }) });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pt-20">
      <PageHero eyebrow="Book a Consultation" title="Sit down with our design team" img={IMG.office} />
      <section className="max-w-2xl mx-auto px-6 lg:px-10 py-24">
        <SectionLabel>Consultation</SectionLabel>
        <h2 className="serif text-3xl md:text-4xl font-light mb-4">Space planning, materials, and layout — one on one</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-10">
          Book a free consultation with our design team, in-showroom or on-site, to talk through your
          space, style and budget before committing to a custom order.
        </p>

        {sent ? (
          <div className="bg-[#F8F8F8] p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#0B3D2E] flex items-center justify-center mb-4"><Check size={24} className="text-white" /></div>
            <div className="serif text-2xl mb-2">Consultation requested</div>
            <p className="text-sm text-[#1E1E1E]/60">A confirmation has been sent to your email. We'll reach out to confirm the time.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#F8F8F8] p-8 space-y-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] w-px h-px opacity-0" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" name="fullName" required />
              <Field label="Phone / WhatsApp" name="phone" required />
            </div>
            <Field label="Email" name="email" type="email" required />
            <Field label="Preferred date" name="preferredDate" type="date" required />
            <Field label="What would you like to discuss?" name="notes" textarea />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={submitting} className="w-full bg-[#0B3D2E] text-white px-7 py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              <CalendarCheck size={16} /> {submitting ? "Sending…" : "Request Consultation"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
