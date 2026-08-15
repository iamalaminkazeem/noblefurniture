import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/quotes", label: "Quote Requests" },
  { href: "/admin/consultations", label: "Consultations" },
  { href: "/admin/blog", label: "Blog" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/not-authorized");

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="bg-[#0B3D2E] text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="serif text-lg font-semibold">Noble</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C8A951]">Admin</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
        <nav className="max-w-7xl mx-auto px-6 flex gap-6 text-sm border-t border-white/10 overflow-x-auto">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="py-3 text-white/70 hover:text-white transition-colors whitespace-nowrap">{l.label}</Link>
          ))}
        </nav>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}