"use client";
import Link from "next/link";
import { MaterialTag } from "./ui";
import { useCart } from "./CartProvider";
import { ShoppingBag } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  material?: string | null;
  priceKobo: number;
  images: string[];
  category?: { name: string };
};

export function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}

export function ProductCard({ p, onQuote }: { p: Product; onQuote: () => void }) {
  const { addItem } = useCart();
  const img = p.images?.[0] || "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=900&auto=format&fit=crop";

  return (
    <div className="group">
      <Link href={`/products/${p.id}`} className="block relative overflow-hidden h-72 mb-4">
        <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        {p.material && <MaterialTag className="absolute top-4 left-4">{p.material}</MaterialTag>}
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          {p.category && <div className="text-xs text-[#C8A951] uppercase tracking-wide mb-1">{p.category.name}</div>}
          <Link href={`/products/${p.id}`} className="serif text-lg mb-1 hover:text-[#0B3D2E] block">{p.name}</Link>
          <div className="text-sm text-[#1E1E1E]/60">{formatNaira(p.priceKobo)}</div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => addItem({ productId: p.id, name: p.name, priceKobo: p.priceKobo, image: img })}
            className="text-xs bg-[#0B3D2E] text-white px-3 py-2 flex items-center gap-1.5 hover:bg-[#C8A951] hover:text-[#0B3D2E] transition-colors whitespace-nowrap"
          >
            <ShoppingBag size={12} /> Add
          </button>
          <button onClick={onQuote} className="text-xs border border-[#0B3D2E] text-[#0B3D2E] px-3 py-2 hover:bg-[#0B3D2E] hover:text-white transition-colors whitespace-nowrap">
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}
