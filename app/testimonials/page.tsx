import { Star, Quote } from "lucide-react";
import { PageHero, SectionLabel } from "@/components/ui";
import { IMG, TESTIMONIALS } from "@/lib/content";

export const metadata = { title: "Testimonials | Noble Furniture Gallery" };

export default function TestimonialsPage() {
  return (
    <main className="pt-20">
      <PageHero eyebrow="Testimonials" title="What our clients say" img={IMG.project3} />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <SectionLabel>Reviews</SectionLabel>
        <h2 className="serif text-4xl md:text-5xl font-light mb-12">Real feedback, real projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-[#F8F8F8] p-8 relative">
              <Quote size={28} className="text-[#C8A951] mb-4" />
              <p className="text-[#1E1E1E]/80 leading-relaxed mb-6">{t.text}</p>
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C8A951" strokeWidth={0} />)}</div>
              <div className="font-medium text-sm">{t.name}</div><div className="text-xs text-[#1E1E1E]/50">{t.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
