"use client";
import React from "react";
import { whatsappLink } from "@/lib/business";

export function MaterialTag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 -rotate-2 bg-[#F8F8F8] border border-[#0B3D2E]/15 text-[#0B3D2E] text-[11px] tracking-wide uppercase px-2.5 py-1 shadow-sm ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A951]" />
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-px bg-[#C8A951]" />
      <span className="text-[#C8A951] text-xs tracking-[0.25em] uppercase font-medium">{children}</span>
    </div>
  );
}

type BtnVariant = "primary" | "outline" | "ghost" | "gold";

export function Btn({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const base = "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-wide transition-all duration-300 disabled:opacity-60";
  const styles: Record<BtnVariant, string> = {
    primary: "bg-[#0B3D2E] text-white hover:bg-[#C8A951] hover:text-[#0B3D2E]",
    outline: "border border-[#0B3D2E] text-[#0B3D2E] hover:bg-[#0B3D2E] hover:text-white",
    ghost: "border border-white/40 text-white hover:bg-white hover:text-[#0B3D2E]",
    gold: "bg-[#C8A951] text-[#0B3D2E] hover:bg-[#0B3D2E] hover:text-white",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

export function Field({ label, textarea, ...props }: { label: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls = "w-full bg-white border border-[#0B3D2E]/15 px-4 py-3 text-sm focus:outline-none focus:border-[#C8A951] transition-colors";
  return (
    <label className="block text-xs text-[#1E1E1E]/60 uppercase tracking-wide">
      {label}
      {textarea ? (
        // @ts-ignore
        <textarea rows={4} className={`${cls} mt-1.5 resize-none`} {...props} />
      ) : (
        // @ts-ignore
        <input className={`${cls} mt-1.5`} {...props} />
      )}
    </label>
  );
}

export function PageHero({ eyebrow, title, img }: { eyebrow: string; title: string; img: string }) {
  return (
    <section className="relative h-[46vh] min-h-[340px] flex items-end overflow-hidden">
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0C]/85 via-[#0B0F0C]/30 to-[#0B0F0C]/10" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-14 w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-[#C8A951]" />
          <span className="text-[#C8A951] text-xs tracking-[0.3em] uppercase">{eyebrow}</span>
        </div>
        <h1 className="serif text-white text-4xl md:text-5xl font-light max-w-2xl">{title}</h1>
      </div>
    </section>
  );
}

export function CtaBand({ onQuote, title, sub }: { onQuote: () => void; title?: string; sub?: string }) {
  return (
    <section className="bg-[#0B3D2E] py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <h2 className="serif text-3xl md:text-4xl font-light text-white mb-3">{title || "Ready to furnish your space with confidence?"}</h2>
        <p className="text-white/60 mb-8">{sub || "Tell us what you need — our team replies within one business day with a detailed quote."}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Btn variant="gold" onClick={onQuote}>Request a Quote</Btn>
          <a href={whatsappLink()} target="_blank" rel="noreferrer"><Btn variant="ghost">WhatsApp Us</Btn></a>
        </div>
      </div>
    </section>
  );
}
