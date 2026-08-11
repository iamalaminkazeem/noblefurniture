"use client";
import { PageHero, CtaBand } from "@/components/ui";
import { IMG, SERVICES } from "@/lib/content";
import { useQuoteModal } from "@/components/QuoteModalProvider";

export default function Services() {
  const { open } = useQuoteModal();
  return (
    <main className="pt-20">
      <PageHero eyebrow="Services" title="From workshop drawing to final installation" img={IMG.workshop} />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0B3D2E]/10">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="bg-white p-8 hover:bg-[#F8F8F8] transition-colors">
              <div className="serif text-[#C8A951] text-3xl mb-4">0{i + 1}</div>
              <div className="font-medium text-lg mb-2">{s.title}</div>
              <p className="text-sm text-[#1E1E1E]/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand onQuote={open} />
    </main>
  );
}
