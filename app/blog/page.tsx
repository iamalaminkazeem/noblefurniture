"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHero, SectionLabel } from "@/components/ui";
import { IMG } from "@/lib/content";

type Post = { id: string; title: string; slug: string; excerpt: string; coverImage?: string; publishedAt: string };

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog").then((r) => r.json()).then((data) => setPosts(Array.isArray(data) ? data : [])).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-20">
      <PageHero eyebrow="Blog" title="Furniture guides, care tips and trends" img={IMG.blog} />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <SectionLabel>Latest</SectionLabel>
        <h2 className="serif text-4xl md:text-5xl font-light mb-12">From the workshop</h2>

        {loading ? <p className="text-[#1E1E1E]/50 text-sm">Loading posts…</p> : posts.length === 0 ? (
          <p className="text-[#1E1E1E]/50 text-sm">No posts published yet — add one from the admin dashboard.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                <div className="h-56 overflow-hidden mb-4">
                  <img src={p.coverImage || IMG.blog} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="text-xs text-[#C8A951] uppercase tracking-wide mb-1">{new Date(p.publishedAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</div>
                <div className="serif text-xl mb-2 group-hover:text-[#0B3D2E]">{p.title}</div>
                <p className="text-sm text-[#1E1E1E]/60 leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
