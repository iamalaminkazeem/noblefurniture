"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHero, SectionLabel } from "@/components/ui";
import { IMG, FAQS } from "@/lib/content";

export default function FAQPage() {
  const [open, setOpen] = useState(0);
  return (
    <main className="pt-20">
      <PageHero eyebrow="FAQs" title="Answers to common questions" img={IMG.dining} />
      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-24">
        <SectionLabel>Frequently Asked</SectionLabel>
        <h2 className="serif text-4xl md:text-5xl font-light mb-12">Everything you need to know</h2>
        <div className="divide-y divide-[#0B3D2E]/10 border-t border-b border-[#0B3D2E]/10">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between py-5 text-left">
                <span className="font-medium pr-6">{f.q}</span>
                <ChevronDown size={18} className={`flex-shrink-0 text-[#C8A951] transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="text-sm text-[#1E1E1E]/65 leading-relaxed pb-5 pr-10">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
