"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";

type Post = { id: string; title: string; published: boolean; createdAt: string };

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/blog").then((r) => r.json()).then((data) => setPosts(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This can't be undone.")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="serif text-3xl font-light">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-[#0B3D2E] text-white px-5 py-2.5 text-sm flex items-center gap-2"><Plus size={16} /> New Post</Link>
      </div>

      {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading…</p> : posts.length === 0 ? (
        <p className="text-[#1E1E1E]/50 text-sm">No posts yet.</p>
      ) : (
        <div className="bg-white border border-[#0B3D2E]/10">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border-b border-[#0B3D2E]/10 last:border-0">
              <div className="flex-1">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-[#1E1E1E]/50">{p.published ? "Published" : "Draft"} · {new Date(p.createdAt).toLocaleDateString("en-NG")}</div>
              </div>
              <Link href={`/admin/blog/${p.id}`} className="p-2 text-[#0B3D2E] hover:bg-[#F8F8F8]" aria-label="Edit"><Pencil size={16} /></Link>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
