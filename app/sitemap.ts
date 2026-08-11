import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://noblefurnituregallery.com";
  const staticRoutes = ["", "/about", "/products", "/custom-furniture", "/services", "/projects", "/gallery", "/blog", "/faq", "/testimonials", "/contact", "/consultation", "/privacy-policy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
    productRoutes = products.map((p) => ({ url: `${base}/products/${p.id}`, lastModified: p.updatedAt }));
    const posts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
    blogRoutes = posts.map((b) => ({ url: `${base}/blog/${b.slug}`, lastModified: b.updatedAt }));
  } catch {
    // DB not migrated yet — sitemap still works with just static routes.
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
