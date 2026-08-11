"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { PageHero, CtaBand } from "@/components/ui";
import { IMG, CATEGORIES } from "@/lib/content";
import { useQuoteModal } from "@/components/QuoteModalProvider";
import { ProductCard, type Product } from "@/components/ProductCard";

export default function Products() {
  const { open } = useQuoteModal();
  const [activeCat, setActiveCat] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = activeCat === "All" ? "/api/products" : `/api/products?category=${encodeURIComponent(activeCat)}`;
    fetch(url).then((r) => r.json()).then((data) => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [activeCat]);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="pt-20">
      <PageHero eyebrow="Our Products" title="Collections built for every space" img={IMG.dining} />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 text-xs tracking-wide uppercase transition-colors ${activeCat === c ? "bg-[#0B3D2E] text-white" : "bg-[#F8F8F8] text-[#1E1E1E]/70 hover:bg-[#0B3D2E]/10"}`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-[#0B3D2E]/15 px-4 py-2.5 text-sm max-w-xs">
            <Search size={16} className="text-[#1E1E1E]/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="w-full outline-none text-[#1E1E1E]" />
          </div>
        </div>

        {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading products…</p> : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#1E1E1E]/50 text-sm">No products found. Add products through the admin dashboard and they'll show up here immediately.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{filtered.map((p) => <ProductCard key={p.id} p={p} onQuote={open} />)}</div>
        )}
      </section>
      <CtaBand onQuote={open} title="Don't see the exact piece you want?" sub="We build fully custom furniture to your dimensions, materials and finish." />
    </main>
  );
}
