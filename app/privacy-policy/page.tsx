import { PageHero } from "@/components/ui";
import { IMG } from "@/lib/content";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "Privacy Policy | Noble Furniture Gallery" };

export default function PrivacyPolicy() {
  return (
    <main className="pt-20">
      <PageHero eyebrow="Legal" title="Privacy Policy" img={IMG.heroAlt} />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-24 prose prose-sm">
        <p className="text-xs text-[#1E1E1E]/50 mb-8 uppercase tracking-wide">
          ⚠️ Template only — have a Nigerian lawyer review this against NDPR (Nigeria Data Protection Regulation)
          before publishing. Last updated: placeholder.
        </p>

        <h2 className="serif text-2xl mb-3">Information We Collect</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          When you request a quote, book a consultation, or place an order, we collect your name, phone
          number, email address, delivery location, and details about the furniture you're interested in.
          When you make a payment, transaction details are processed directly by our payment provider,
          Paystack — we do not store your card information.
        </p>

        <h2 className="serif text-2xl mb-3">How We Use Your Information</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          We use your details to respond to quote and consultation requests, process and deliver orders,
          and send order-related updates. We do not sell your personal information to third parties.
        </p>

        <h2 className="serif text-2xl mb-3">Third-Party Services</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          We use Paystack for payment processing, Resend for transactional email, and Google reCAPTCHA to
          protect our forms from spam. Each of these providers processes data under their own privacy policies.
        </p>

        <h2 className="serif text-2xl mb-3">Your Rights</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed mb-6">
          You may request access to, correction of, or deletion of your personal data at any time by
          contacting us at {BUSINESS.email}.
        </p>

        <h2 className="serif text-2xl mb-3">Contact</h2>
        <p className="text-[#1E1E1E]/70 leading-relaxed">
          Questions about this policy can be directed to {BUSINESS.email} or {BUSINESS.phoneDisplay}.
        </p>
      </section>
    </main>
  );
}
