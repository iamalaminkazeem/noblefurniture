"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { Btn } from "./ui";
import { NAV } from "@/lib/content";
import { BUSINESS } from "@/lib/business";
import { useQuoteModal } from "./QuoteModalProvider";
import { useCart } from "./CartProvider";

const PATHS: Record<string, string> = {
  Home: "/", About: "/about", Products: "/products", "Custom Furniture": "/custom-furniture",
  Services: "/services", Projects: "/projects", Gallery: "/gallery", Blog: "/blog", Contact: "/contact",
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { open } = useQuoteModal();
  const { count } = useCart();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${solid ? "bg-white/95 backdrop-blur shadow-md" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className={`serif text-2xl font-semibold ${solid ? "text-[#0B3D2E]" : "text-white"}`}>Noble</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C8A951]">Furniture Gallery</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((n) => (
            <Link key={n} href={PATHS[n]} className={`text-sm tracking-wide transition-colors ${pathname === PATHS[n] ? "text-[#C8A951] font-medium" : solid ? "text-[#1E1E1E] hover:text-[#0B3D2E]" : "text-white/90 hover:text-white"}`}>
              {n}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${BUSINESS.phoneTel}`} className={`p-2.5 rounded-full border ${solid ? "border-[#0B3D2E]/20 text-[#0B3D2E]" : "border-white/30 text-white"}`} aria-label="Call us">
            <Phone size={16} />
          </a>
          <Link href="/cart" className={`relative p-2.5 rounded-full border ${solid ? "border-[#0B3D2E]/20 text-[#0B3D2E]" : "border-white/30 text-white"}`} aria-label="Cart">
            <ShoppingBag size={16} />
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#C8A951] text-[#0B3D2E] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{count}</span>}
          </Link>
          <Btn variant="gold" onClick={open} className="!py-2.5">Request a Quote</Btn>
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <Link href="/cart" className={`relative ${solid ? "text-[#0B3D2E]" : "text-white"}`} aria-label="Cart">
            <ShoppingBag size={22} />
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#C8A951] text-[#0B3D2E] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{count}</span>}
          </Link>
          <button className={solid ? "text-[#0B3D2E]" : "text-white"} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#0B3D2E]/10 px-6 py-5 flex flex-col gap-4 shadow-lg max-h-[70vh] overflow-y-auto">
          {NAV.map((n) => (
            <Link key={n} href={PATHS[n]} onClick={() => setMenuOpen(false)} className={`text-left text-sm py-1 ${pathname === PATHS[n] ? "text-[#C8A951] font-medium" : "text-[#1E1E1E]"}`}>{n}</Link>
          ))}
          <Btn variant="primary" onClick={() => { open(); setMenuOpen(false); }} className="mt-2 w-full">Request a Quote</Btn>
        </div>
      )}
    </header>
  );
}
