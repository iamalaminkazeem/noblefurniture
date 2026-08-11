"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IMG } from "@/lib/content";

type Post = { title: string; content: string; coverImage?: string; publishedAt: string };

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setPost).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main className="pt-40 pb-24 text-center text-[#1E1E1E]/50">Loading…</main>;
  if (notFound || !post) return (
    <main className="pt-40 pb-24 text-center">
      <p className="text-[#1E1E1E]/60 mb-4">Post not found.</p>
      <Link href="/blog" className="text-[#0B3D2E] underline">Back to blog</Link>
    </main>
  );

  return (
    <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 lg:px-10">
      <div className="text-xs text-[#C8A951] uppercase tracking-wide mb-3">{new Date(post.publishedAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</div>
      <h1 className="serif text-4xl font-light mb-8">{post.title}</h1>
      <img src={post.coverImage || IMG.blog} alt={post.title} className="w-full h-80 object-cover mb-10" />
      <div className="text-[#1E1E1E]/75 leading-relaxed whitespace-pre-wrap">{post.content}</div>
    </main>
  );
}