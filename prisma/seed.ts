// Populates starting categories + products so the site isn't empty on first run.
// Runs after `prisma migrate dev`, or manually with: npm run seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = ["Luxury Sofas", "Beds", "Dining Sets", "Office Furniture", "Wardrobes", "TV Consoles"];

const PRODUCTS = [
  { name: "Aurelio Sofa Set", category: "Luxury Sofas", material: "Italian leather · Iroko frame", priceKobo: 245_000_00, stockQuantity: 4, images: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=900"], featured: true },
  { name: "Solace Bed Frame", category: "Beds", material: "Solid mahogany · Velvet headboard", priceKobo: 118_000_00, stockQuantity: 6, images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900"], featured: true },
  { name: "Meridian Dining Set", category: "Dining Sets", material: "Marble top · Brass legs", priceKobo: 165_000_00, stockQuantity: 3, images: ["https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=900"], featured: true },
  { name: "Executive Office Suite", category: "Office Furniture", material: "Walnut veneer · Leather trim", priceKobo: 98_000_00, stockQuantity: 8, images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900"], featured: false },
  { name: "Noble Wardrobe", category: "Wardrobes", material: "Oak · Soft-close hinges", priceKobo: 132_000_00, stockQuantity: 5, images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=900"], featured: false },
  { name: "Linea TV Console", category: "TV Consoles", material: "Teak · Matte black steel", priceKobo: 62_000_00, stockQuantity: 10, images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900"], featured: false },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding categories...");
  const categoryMap: Record<string, string> = {};
  for (const name of CATEGORIES) {
    const cat = await prisma.category.upsert({ where: { slug: slugify(name) }, update: {}, create: { name, slug: slugify(name) } });
    categoryMap[name] = cat.id;
  }

  console.log("Seeding products...");
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name),
        material: p.material,
        priceKobo: p.priceKobo,
        stockQuantity: p.stockQuantity,
        images: p.images,
        featured: p.featured,
        categoryId: categoryMap[p.category],
      },
    });
  }

  console.log("Seed complete.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());