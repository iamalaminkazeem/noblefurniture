import { PageHero } from "@/components/ui";
import { IMG, PROJECTS } from "@/lib/content";
import { ChevronRight } from "lucide-react";

export const metadata = { title: "Projects | Noble Furniture Gallery" };

export default function Projects() {
  return (
    <main className="pt-20">
      <PageHero eyebrow="Projects" title="Spaces we've furnished across Nigeria" img={IMG.project2} />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 space-y-16">
        {PROJECTS.map((p, i) => (
          <div key={p.name} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <img src={p.img} alt={p.name} className="w-full h-96 object-cover" />
            <div>
              <div className="text-xs text-[#C8A951] uppercase tracking-wide mb-2">{p.type}</div>
              <h3 className="serif text-3xl font-light mb-4">{p.name}</h3>
              <p className="text-[#1E1E1E]/65 leading-relaxed mb-5">Full furniture design, manufacturing and installation delivered on-site, with every piece finished to match the architecture and lighting of the space.</p>
              <button className="text-sm text-[#0B3D2E] flex items-center gap-1.5 hover:text-[#C8A951]">View project details <ChevronRight size={16} /></button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
