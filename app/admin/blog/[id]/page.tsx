import { prisma } from "@/lib/db";
import { BlogForm } from "@/components/BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Edit Post</h1>
      <BlogForm initial={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage || "", published: post.published }} />
    </div>
  );
}