import { PageHero } from "@/components/ui";
import { IMG } from "@/lib/content";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "Terms & Conditions | Noble Furniture Gallery" };

export default function Terms() {
  return (
    <main className="pt-20">
      <PageHero eyebrow="Legal" title="Terms & Conditions" img={IMG.heroAlt} />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-24 prose prose-sm">
        <p className="text-xs text-[#1E1E1E]/50 mb-8 uppercase tracking-wide">
          ⚠️ Template only — have a Nigerian lawyer review this before publishing, especially the
          returns/warranty and liability sections. Last updated: placeholder.
        </p>

        <h2 className="serif text-2xl mb-3">Orders & Payment</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          Orders are confirmed once payment is received via Paystack. Custom orders require full or partial
          payment upfront depending on the agreed quote before production begins.
        </p>

        <h2 className="serif text-2xl mb-3">Delivery</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          Delivery timelines vary by product and location and will be communicated at the time of order
          confirmation. {BUSINESS.name} is not liable for delays caused by circumstances outside our control.
        </p>

        <h2 className="serif text-2xl mb-3">Returns & Warranty</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          Ready-made items may be returned within [X] days if unused and in original condition. Custom-built
          furniture is made to order and is non-refundable except in the case of manufacturing defects.
        </p>

        <h2 className="serif text-2xl mb-3">Limitation of Liability</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          {BUSINESS.name} shall not be liable for indirect or consequential damages arising from the use
          of our products beyond the value of the order itself.
        </p>

        <h2 className="serif text-2xl mb-3">Contact</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed">
          Questions about these terms can be directed to {BUSINESS.email} or {BUSINESS.phoneDisplay}.
        </p>
      </section>
    </main>
  );
}
