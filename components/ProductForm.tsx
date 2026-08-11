"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Btn } from "./ui";
import { ImageUploadField } from "./ImageUploadField";

type Category = { id: string; name: string };
type ProductData = {
  id?: string; name: string; slug: string; description?: string; material?: string;
  priceKobo: number; stockQuantity: number; images: string[]; categoryId: string; featured: boolean; inStock: boolean;
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ProductForm({ initial }: { initial?: ProductData }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(initial?.name || "");
  const [material, setMaterial] = useState(initial?.material || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [priceNaira, setPriceNaira] = useState(initial ? String(initial.priceKobo / 100) : "");
  const [stockQuantity, setStockQuantity] = useState(initial ? String(initial.stockQuantity) : "0");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || "");
  const [imageUrl, setImageUrl] = useState(initial?.images?.[0] || "");
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((data) => {
      setCategories(Array.isArray(data) ? data : []);
      if (!initial && data[0]) setCategoryId(data[0].id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const qty = parseInt(stockQuantity, 10) || 0;
    const payload = {
      name, material, description, categoryId, featured,
      slug: slugify(name),
      priceKobo: Math.round(parseFloat(priceNaira) * 100),
      stockQuantity: qty,
      inStock: qty > 0,
      images: imageUrl ? [imageUrl] : [],
    };

    try {
      const url = initial?.id ? `/api/admin/products/${initial.id}` : "/api/admin/products";
      const method = initial?.id ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong saving this product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 bg-white p-8 border border-[#0B3D2E]/10">
      <Field label="Product name" value={name} onChange={(e: any) => setName(e.target.value)} required />
      <label className="block text-xs text-[#1E1E1E]/60 uppercase tracking-wide">
        Category
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full bg-white border border-[#0B3D2E]/15 px-4 py-3 text-sm mt-1.5">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <Field label="Material" value={material} onChange={(e: any) => setMaterial(e.target.value)} placeholder="e.g. Italian leather · Iroko frame" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₦)" type="number" value={priceNaira} onChange={(e: any) => setPriceNaira(e.target.value)} required />
        <Field label="Stock quantity" type="number" min="0" value={stockQuantity} onChange={(e: any) => setStockQuantity(e.target.value)} required />
      </div>
      <Field label="Description" textarea value={description} onChange={(e: any) => setDescription(e.target.value)} />
      <ImageUploadField currentUrl={imageUrl} onUploaded={setImageUrl} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured on homepage</label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Btn variant="primary" type="submit" disabled={saving}>{saving ? "Saving…" : initial ? "Save Changes" : "Create Product"}</Btn>
    </form>
  );
}