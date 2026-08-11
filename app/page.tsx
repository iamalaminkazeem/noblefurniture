"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronDown, Check, Star, Quote } from "lucide-react";
import { SectionLabel, Btn, CtaBand } from "@/components/ui";
import { IMG, TESTIMONIALS, FAQS } from "@/lib/content";
import { useQuoteModal } from "@/components/QuoteModalProvider";
import { ProductCard, type Product } from "@/components/ProductCard";

export default function Home() {
  const { open } = useQuoteModal();
  const [openFaq, setOpenFaq] = useState(0);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => setFeatured(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden">
        <img src={IMG.hero} alt="Luxury living room furnished by Noble Furniture Gallery" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0C] via-[#0B0F0C]/50 to-[#0B0F0C]/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-24 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-[#C8A951]" />
              <span className="text-[#C8A951] text-xs tracking-[0.3em] uppercase">Lagos · Nigeria</span>
            </div>
            <h1 className="serif text-white text-5xl md:text-7xl leading-[1.05] font-light mb-6">
              Furniture built to <span className="italic text-[#C8A951]">outlast</span> the trend.
            </h1>
            <p className="text-white/80 text-lg max-w-lg mb-10 leading-relaxed">
              Noble Furniture Gallery designs, builds and installs premium furniture for homes,
              hotels and offices across Nigeria — every piece made by hand, made to last.
            </p>
            <div className="flex flex-wrap gap-4">
              <Btn variant="gold" onClick={open}>Request a Quote <ArrowRight size={16} /></Btn>
              <Link href="/products"><Btn variant="ghost">Browse Collections</Btn></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B3D2E] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["12+", "Years Crafting"], ["3,400+", "Pieces Delivered"], ["180+", "Projects Completed"], ["98%", "Client Satisfaction"]].map(([n, l]) => (
            <div key={l}><div className="serif text-4xl text-[#C8A951] mb-1">{n}</div><div className="text-white/70 text-xs tracking-wide uppercase">{l}</div></div>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div><SectionLabel>Collections</SectionLabel><h2 className="serif text-4xl md:text-5xl font-light">Furniture for every room</h2></div>
          <Link href="/products" className="text-sm text-[#0B3D2E] flex items-center gap-1.5 hover:text-[#C8A951]">View all collections <ChevronRight size={16} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ name: "Living Room", img: IMG.sofa }, { name: "Bedroom", img: IMG.bed }, { name: "Dining", img: IMG.dining }].map((c) => (
            <Link key={c.name} href="/products" className="group relative h-96 overflow-hidden block">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="serif text-2xl mb-1">{c.name}</div>
                <div className="text-xs tracking-wide uppercase text-[#C8A951] flex items-center gap-1">Explore <ChevronRight size={14} /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionLabel>Featured</SectionLabel>
          <h2 className="serif text-4xl md:text-5xl font-light mb-12">Pieces our clients return for</h2>
          {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading products…</p> : featured.length === 0 ? (
            <p className="text-[#1E1E1E]/50 text-sm">No featured products yet — add some from the admin dashboard and they'll appear here automatically.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{featured.map((p) => <ProductCard key={p.id} p={p} onQuote={open} />)}</div>
          )}
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img src={IMG.workshop} alt="Noble Furniture Gallery workshop" className="w-full h-[520px] object-cover" />
          <div className="absolute -bottom-6 -right-6 bg-[#0B3D2E] text-white p-6 max-w-[220px] hidden md:block">
            <div className="serif text-3xl text-[#C8A951]">12+</div>
            <div className="text-xs text-white/70 mt-1">years building furniture that stays in the family</div>
          </div>
        </div>
        <div>
          <SectionLabel>Why Choose Us</SectionLabel>
          <h2 className="serif text-4xl md:text-5xl font-light mb-6">Craftsmanship you can put a hand on</h2>
          <p className="text-[#1E1E1E]/70 leading-relaxed mb-8">We manufacture in-house, so every frame, joint and finish passes through our own workshop before it reaches you — not a warehouse of imported stock.</p>
          <div className="space-y-5">
            {[["Solid materials, no shortcuts", "Hardwood frames and genuine finishes on every piece, custom or ready-made."],
              ["Built to your specification", "Custom dimensions, fabrics and finishes for homes, hotels and offices."],
              ["Delivery & installation handled", "Our own team delivers and installs — nationwide, with care."]].map(([t, d]) => (
              <div key={t} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#0B3D2E]/5 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={16} className="text-[#0B3D2E]" /></div>
                <div><div className="font-medium mb-0.5">{t}</div><div className="text-sm text-[#1E1E1E]/60 leading-relaxed">{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0B3D2E] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <SectionLabel>Our Process</SectionLabel>
          <h2 className="serif text-4xl md:text-5xl font-light mb-14 max-w-xl">From first sketch to your living room</h2>
          <div className="grid md:grid-cols-4 gap-10">
            {[["Consult", "Share your space, style and budget with our design team."], ["Design", "We draw the piece to spec and confirm materials with you."],
              ["Build", "Our craftsmen manufacture your order in our Lagos workshop."], ["Deliver", "We deliver and install, then follow up on the fit and finish."]].map(([t, d], i) => (
              <div key={t} className="border-t border-white/15 pt-6">
                <div className="serif text-[#C8A951] text-3xl mb-3">0{i + 1}</div>
                <div className="font-medium mb-2">{t}</div><div className="text-sm text-white/60 leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <SectionLabel>Testimonials</SectionLabel>
        <h2 className="serif text-4xl md:text-5xl font-light mb-12">What clients say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-[#F8F8F8] p-8 relative">
              <Quote size={28} className="text-[#C8A951] mb-4" />
              <p className="text-[#1E1E1E]/80 leading-relaxed mb-6">{t.text}</p>
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C8A951" strokeWidth={0} />)}</div>
              <div className="font-medium text-sm">{t.name}</div><div className="text-xs text-[#1E1E1E]/50">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <SectionLabel>FAQs</SectionLabel>
          <h2 className="serif text-4xl md:text-5xl font-light mb-12">Common questions</h2>
          <div className="divide-y divide-[#0B3D2E]/10 border-t border-b border-[#0B3D2E]/10">
            {FAQS.slice(0, 4).map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between py-5 text-left">
                  <span className="font-medium pr-6">{f.q}</span>
                  <ChevronDown size={18} className={`flex-shrink-0 text-[#C8A951] transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="text-sm text-[#1E1E1E]/65 leading-relaxed pb-5 pr-10">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand onQuote={open} />
    </main>
  );
}
