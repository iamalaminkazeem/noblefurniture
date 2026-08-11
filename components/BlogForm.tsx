"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Btn } from "./ui";
import { ImageUploadField } from "./ImageUploadField";

type BlogData = { id?: string; title: string; slug: string; excerpt: string; content: string; coverImage?: string; published: boolean };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function BlogForm({ initial }: { initial?: BlogData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [published, setPublished] = useState(initial?.published || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { title, excerpt, content, coverImage, published, slug: slugify(title) };

    try {
      const url = initial?.id ? `/api/admin/blog/${initial.id}` : "/api/admin/blog";
      const method = initial?.id ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Something went wrong saving this post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 bg-white p-8 border border-[#0B3D2E]/10">
      <Field label="Title" value={title} onChange={(e: any) => setTitle(e.target.value)} required />
      <Field label="Excerpt (short summary shown in the blog list)" textarea value={excerpt} onChange={(e: any) => setExcerpt(e.target.value)} required />
      <Field label="Content" textarea value={content} onChange={(e: any) => setContent(e.target.value)} required />
      <ImageUploadField currentUrl={coverImage} onUploaded={setCoverImage} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published (visible on the site)</label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Btn variant="primary" type="submit" disabled={saving}>{saving ? "Saving…" : initial ? "Save Changes" : "Create Post"}</Btn>
    </form>
  );
}
