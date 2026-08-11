"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
import { formatNaira } from "@/components/ProductCard";

type Product = { id: string; name: string; priceKobo: number; images: string[]; inStock: boolean; featured: boolean; category?: { name: string } };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/products").then((r) => r.json()).then((data) => setProducts(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="serif text-3xl font-light">Products</h1>
        <Link href="/admin/products/new" className="bg-[#0B3D2E] text-white px-5 py-2.5 text-sm flex items-center gap-2"><Plus size={16} /> New Product</Link>
      </div>

      {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading…</p> : products.length === 0 ? (
        <p className="text-[#1E1E1E]/50 text-sm">No products yet. Click "New Product" or run <code>npm run seed</code>.</p>
      ) : (
        <div className="bg-white border border-[#0B3D2E]/10">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border-b border-[#0B3D2E]/10 last:border-0">
              <img src={p.images?.[0] || ""} alt={p.name} className="w-14 h-14 object-cover bg-[#F8F8F8]" />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-[#1E1E1E]/50">{p.category?.name} · {formatNaira(p.priceKobo)}{p.featured && " · Featured"}{!p.inStock && " · Out of stock"}</div>
              </div>
              <Link href={`/admin/products/${p.id}`} className="p-2 text-[#0B3D2E] hover:bg-[#F8F8F8]" aria-label="Edit"><Pencil size={16} /></Link>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
