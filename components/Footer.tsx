import Link from "next/link";
import { NAV, SERVICES } from "@/lib/content";
import { BUSINESS } from "@/lib/business";
import { NewsletterForm } from "./NewsletterForm";

const PATHS: Record<string, string> = {
  Home: "/", About: "/about", Products: "/products", "Custom Furniture": "/custom-furniture",
  Services: "/services", Projects: "/projects", Gallery: "/gallery", Blog: "/blog", Contact: "/contact",
};

export function Footer() {
  return (
    <footer className="bg-[#0B0F0C] text-white/70 pt-20 pb-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
        <div className="lg:col-span-2">
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="serif text-2xl text-white font-semibold">Noble</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C8A951]">Furniture Gallery</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs mb-6">Premium furniture manufacturing, sales, delivery and installation — built in Lagos, delivered across Nigeria.</p>
          <div className="text-white text-sm font-medium mb-3">Get furniture tips & offers</div>
          <NewsletterForm />
        </div>
        <div>
          <div className="text-white text-sm font-medium mb-4">Quick Links</div>
          <div className="flex flex-col gap-2.5 text-sm">
            {NAV.map((n) => <Link key={n} href={PATHS[n]} className="hover:text-[#C8A951] transition-colors w-fit">{n}</Link>)}
            <Link href="/track-order" className="hover:text-[#C8A951] transition-colors w-fit">Track Order</Link>
          </div>
        </div>
        <div>
          <div className="text-white text-sm font-medium mb-4">Services</div>
          <div className="flex flex-col gap-2.5 text-sm">{SERVICES.slice(0, 4).map((s) => <span key={s.title}>{s.title}</span>)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-white text-sm font-medium mb-4">Contact</div>
          <div className="flex flex-col gap-2.5 text-sm break-words">
            <span>{BUSINESS.address}</span>
            <span>{BUSINESS.phoneDisplay}</span>
            <span className="break-all">{BUSINESS.email}</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-center">
        <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-[#C8A951]">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#C8A951]">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}