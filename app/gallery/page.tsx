import { PageHero } from "@/components/ui";
import { IMG } from "@/lib/content";

export const metadata = { title: "Gallery | Noble Furniture Gallery" };

export default function Gallery() {
  const imgs = [IMG.sofa, IMG.bed, IMG.dining, IMG.office, IMG.wardrobe, IMG.console, IMG.project1, IMG.project2, IMG.workshop];
  return (
    <main className="pt-20">
      <PageHero eyebrow="Gallery" title="A closer look at our craft" img={IMG.project1} />
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {imgs.map((src, i) => <img key={i} src={src} alt="Noble Furniture Gallery piece" className="w-full object-cover hover:opacity-90 transition-opacity" style={{ height: i % 3 === 0 ? 420 : 280 }} />)}
        </div>
      </section>
    </main>
  );
}
