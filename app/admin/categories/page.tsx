"use client";
import React, { useEffect, useState } from "react";
import { Field, Btn } from "@/components/ui";

type Category = { id: string; name: string };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/categories").then((r) => r.json()).then((data) => setCategories(Array.isArray(data) ? data : []));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error("Failed");
      setName("");
      load();
    } catch {
      setError("Could not add category — it may already exist.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Categories</h1>
      <form onSubmit={handleSubmit} className="flex gap-3 items-end mb-10 max-w-md">
        <div className="flex-1"><Field label="New category name" value={name} onChange={(e: any) => setName(e.target.value)} required /></div>
        <Btn variant="primary" type="submit" disabled={saving}>{saving ? "Adding…" : "Add"}</Btn>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="bg-white border border-[#0B3D2E]/10">
        {categories.map((c) => (
          <div key={c.id} className="p-4 border-b border-[#0B3D2E]/10 last:border-0 text-sm">{c.name}</div>
        ))}
      </div>
    </div>
  );
}