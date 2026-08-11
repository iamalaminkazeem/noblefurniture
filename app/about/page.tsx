import { PageHero, SectionLabel } from "@/components/ui";
import { IMG } from "@/lib/content";

export const metadata = { title: "About Us | Noble Furniture Gallery", description: "Meet the founders and story behind Noble Furniture Gallery, Lagos." };

export default function About() {
  return (
    <main className="pt-20">
      <PageHero eyebrow="About Us" title="Two founders, one workshop, a standard we won't lower" img={IMG.heroAlt} />
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="serif text-3xl md:text-4xl font-light mb-5">Built on a simple frustration</h2>
            <p className="text-[#1E1E1E]/70 leading-relaxed mb-4">Noble Furniture Gallery began with a straightforward problem: too much furniture sold in Lagos looked good in the showroom and fell apart within a year. We set out to build the opposite — pieces made from real hardwood, joined properly, finished by hand.</p>
            <p className="text-[#1E1E1E]/70 leading-relaxed">Today we manufacture, sell, deliver and install furniture for homes, hotels, offices, schools and religious institutions across Nigeria, with every piece passing through our own Lagos workshop.</p>
          </div>
          <div>
            <SectionLabel>Mission & Vision</SectionLabel>
            <h2 className="serif text-3xl md:text-4xl font-light mb-5">Craftsmanship as a standard, not a slogan</h2>
            <p className="text-[#1E1E1E]/70 leading-relaxed mb-4"><span className="font-medium text-[#0B3D2E]">Mission —</span> to furnish Nigerian homes and businesses with furniture built to be inherited, not replaced.</p>
            <p className="text-[#1E1E1E]/70 leading-relaxed"><span className="font-medium text-[#0B3D2E]">Vision —</span> to be the furniture brand West Africa trusts for craftsmanship, on par with international names.</p>
          </div>
        </div>

        <SectionLabel>Meet the Founders</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-8 mb-24">
          {[{ name: "Shakir Yekini", role: "Co-Founder", img: IMG.founder1, bio: "Leads manufacturing and workshop operations, with a hands-on eye for joinery and finish." },
            { name: "Kabir Oluokun", role: "Co-Founder", img: IMG.founder2, bio: "Leads design, client relationships and the commercial furnishing arm of the business." }].map((f) => (
            <div key={f.name} className="flex gap-5 items-start">
              <img src={f.img} alt={f.name} className="w-24 h-24 object-cover flex-shrink-0" />
              <div><div className="serif text-xl mb-0.5">{f.name}</div><div className="text-xs text-[#C8A951] uppercase tracking-wide mb-2">{f.role}</div><p className="text-sm text-[#1E1E1E]/65 leading-relaxed">{f.bio}</p></div>
            </div>
          ))}
        </div>

        <SectionLabel>Core Values</SectionLabel>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[["Craftsmanship", "Every piece hand-finished to a standard we'd put in our own homes."], ["Integrity", "The materials we quote are the materials we deliver."],
            ["Reliability", "We commit to dates and we hold them."], ["Timelessness", "Design that won't look dated in five years."]].map(([t, d]) => (
            <div key={t} className="border-t-2 border-[#C8A951] pt-4"><div className="font-medium mb-2">{t}</div><div className="text-sm text-[#1E1E1E]/60 leading-relaxed">{d}</div></div>
          ))}
        </div>
      </section>
    </main>
  );
}
