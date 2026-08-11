import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminOverview() {
  const [productCount, newQuotes, pendingConsultations, orderCount] = await Promise.all([
    prisma.product.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.consultation.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PAID" } }),
  ]);

  const cards = [
    { label: "Products Listed", value: productCount, href: "/admin/products" },
    { label: "New Quote Requests", value: newQuotes, href: "/admin/quotes" },
    { label: "Pending Consultations", value: pendingConsultations, href: "/admin/consultations" },
    { label: "Paid Orders", value: orderCount, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="serif text-3xl font-light mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white p-6 border border-[#0B3D2E]/10 hover:border-[#C8A951] transition-colors">
            <div className="serif text-4xl text-[#0B3D2E] mb-1">{c.value}</div>
            <div className="text-xs text-[#1E1E1E]/50 uppercase tracking-wide">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
