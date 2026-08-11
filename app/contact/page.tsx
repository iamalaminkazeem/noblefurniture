"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Check, ArrowRight } from "lucide-react";
import { PageHero, SectionLabel, Btn, Field } from "@/components/ui";
import { IMG } from "@/lib/content";
import { BUSINESS } from "@/lib/business";
import { useQuoteModal } from "@/components/QuoteModalProvider";
import { getRecaptchaToken } from "@/components/RecaptchaScript";

export default function Contact() {
  const { open } = useQuoteModal();
  return (
    <main className="pt-20">
      <PageHero eyebrow="Contact" title="Visit the showroom or reach out directly" img={IMG.heroAlt} />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-16">
        <div>
          <SectionLabel>Get in Touch</SectionLabel>
          <h2 className="serif text-3xl md:text-4xl font-light mb-8">We'd love to hear from you</h2>
          <div className="space-y-6 mb-10">
            {[[MapPin, "Showroom", BUSINESS.address], [Phone, "Phone", BUSINESS.phoneDisplay], [Mail, "Email", BUSINESS.email], [Clock, "Hours", BUSINESS.hours]].map(([Icon, t, d]: any) => (
              <div key={t} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#0B3D2E]/5 flex items-center justify-center flex-shrink-0"><Icon size={17} className="text-[#0B3D2E]" /></div>
                <div><div className="font-medium text-sm mb-0.5">{t}</div><div className="text-sm text-[#1E1E1E]/60">{d}</div></div>
              </div>
            ))}
          </div>
          <Btn variant="primary" onClick={open}>Request a Quote <ArrowRight size={16} /></Btn>
          <div className="mt-10 h-64 bg-[#F8F8F8] flex items-center justify-center text-[#1E1E1E]/40 text-sm">Google Map embed</div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const recaptchaToken = await getRecaptchaToken("contact_submit");

    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, recaptchaToken }) });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try WhatsApp or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) return (
    <div className="bg-[#F8F8F8] p-10 flex flex-col items-center justify-center text-center h-full">
      <Check size={32} className="text-[#0B3D2E] mb-4" />
      <div className="serif text-2xl mb-2">Message received</div>
      <p className="text-sm text-[#1E1E1E]/60">We'll get back to you within one business day.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-[#F8F8F8] p-8 space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] w-px h-px opacity-0" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" name="fullName" required />
        <Field label="Phone / WhatsApp" name="phone" required />
      </div>
      <Field label="Email" name="email" type="email" required />
      <Field label="Message" name="message" textarea required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={submitting} className="w-full bg-[#0B3D2E] text-white px-7 py-3.5 text-sm disabled:opacity-60">{submitting ? "Sending…" : "Send Message"}</button>
    </form>
  );
}
