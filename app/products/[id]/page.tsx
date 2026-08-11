"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { formatNaira, type Product } from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
import { useQuoteModal } from "@/components/QuoteModalProvider";
import { Btn } from "@/components/ui";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<(Product & { description?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { open } = useQuoteModal();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="pt-40 pb-24 text-center text-[#1E1E1E]/50">Loading…</main>;
  if (notFound || !product) return (
    <main className="pt-40 pb-24 text-center">
      <p className="text-[#1E1E1E]/60 mb-4">Product not found.</p>
      <Link href="/products" className="text-[#0B3D2E] underline">Back to products</Link>
    </main>
  );

  const img = product.images?.[0] || "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200";

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex items-center gap-2 text-xs text-[#1E1E1E]/50 mb-8">
        <Link href="/products" className="hover:text-[#0B3D2E]">Products</Link>
        <ChevronRight size={12} />
        <span>{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-14">
        <img src={img} alt={product.name} className="w-full h-[520px] object-cover" />
        <div>
          {product.category && <div className="text-xs text-[#C8A951] uppercase tracking-wide mb-2">{product.category.name}</div>}
          <h1 className="serif text-4xl font-light mb-4">{product.name}</h1>
          <div className="text-2xl text-[#0B3D2E] mb-6">{formatNaira(product.priceKobo)}</div>
          {product.material && <p className="text-sm text-[#1E1E1E]/60 mb-2"><span className="font-medium text-[#1E1E1E]">Material:</span> {product.material}</p>}
          {product.description && <p className="text-[#1E1E1E]/70 leading-relaxed my-6">{product.description}</p>}

          <div className="flex flex-wrap gap-4 mt-8">
            <Btn variant="primary" onClick={() => { addItem({ productId: product.id, name: product.name, priceKobo: product.priceKobo, image: img }); setAdded(true); }}>
              <ShoppingBag size={16} /> {added ? "Added to Cart" : "Add to Cart"}
            </Btn>
            <Btn variant="outline" onClick={open}>Request Custom Quote <ArrowRight size={16} /></Btn>
          </div>
          {added && <Link href="/cart" className="block mt-4 text-sm text-[#0B3D2E] underline">View cart →</Link>}
        </div>
      </div>
    </main>
  );
}