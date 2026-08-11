import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { QuoteModalProvider } from "@/components/QuoteModalProvider";
import { CartProvider } from "@/components/CartProvider";
import { RecaptchaScript } from "@/components/RecaptchaScript";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Noble Furniture Gallery | Premium Furniture, Lagos",
  description: "Luxury furniture manufacturing, sales, delivery and installation for homes, hotels and offices across Nigeria.",
  openGraph: {
    title: "Noble Furniture Gallery",
    description: "Luxury furniture manufacturing, sales, delivery and installation across Nigeria.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <RecaptchaScript />
          <CartProvider>
            <QuoteModalProvider>
              <Header />
              {children}
              <Footer />
              <WhatsAppButton />
            </QuoteModalProvider>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}