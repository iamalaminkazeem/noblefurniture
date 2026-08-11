import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Edit Product</h1>
      <ProductForm
        initial={{
          id: product.id, name: product.name, slug: product.slug,
          description: product.description || "", material: product.material || "",
          priceKobo: product.priceKobo, stockQuantity: product.stockQuantity,
          images: product.images, categoryId: product.categoryId,
          featured: product.featured, inStock: product.inStock,
        }}
      />
    </div>
  );
}