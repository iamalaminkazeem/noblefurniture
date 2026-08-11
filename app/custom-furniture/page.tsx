"use client";
import { PageHero, SectionLabel, Btn } from "@/components/ui";
import { IMG } from "@/lib/content";
import { useQuoteModal } from "@/components/QuoteModalProvider";
import { ArrowRight, Check } from "lucide-react";

export default function CustomFurniture() {
  const { open } = useQuoteModal();
  return (
    <main className="pt-20">
      <PageHero eyebrow="Custom Furniture" title="Built to your exact dimensions and finish" img={IMG.custom} />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <SectionLabel>How Custom Orders Work</SectionLabel>
          <h2 className="serif text-3xl md:text-4xl font-light mb-6">From your idea to a buildable spec</h2>
          <p className="text-[#1E1E1E]/70 leading-relaxed mb-8">
            Send us a photo, sketch, or Pinterest reference — or just describe the piece. Our design team
            translates it into exact dimensions, materials and finish, confirms it with you, then our
            in-house craftsmen build it in our Lagos workshop.
          </p>
          <div className="space-y-5">
            {[
              ["Any dimension, any space", "We build to fit your room exactly — no compromise on scale."],
              ["Your choice of material and finish", "Hardwood species, leather or fabric, stain or paint — your call."],
              ["Commercial-scale custom orders", "Matching furniture sets for hotels, offices and restaurants."],
            ].map(([t, d]) => (
              <div key={t} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#0B3D2E]/5 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={16} className="text-[#0B3D2E]" /></div>
                <div><div className="font-medium mb-0.5">{t}</div><div className="text-sm text-[#1E1E1E]/60 leading-relaxed">{d}</div></div>
              </div>
            ))}
          </div>
          <Btn variant="primary" onClick={open} className="mt-10">Start a Custom Request <ArrowRight size={16} /></Btn>
        </div>
        <img src={IMG.workshop} alt="Custom furniture being built in our workshop" className="w-full h-[560px] object-cover" />
      </section>
    </main>
  );
}
