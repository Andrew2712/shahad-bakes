import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import catCelebration from "@/assets/cat-celebration.jpg";
import { MessageCircle } from "lucide-react";
import { WHATSAPP, products } from "@/lib/products";

export const Route = createFileRoute("/celebration-cakes")({
  head: () => ({
    meta: [
      { title: "Celebration Cakes — Shahad Bakes" },
      { name: "description", content: "Custom birthdays, festive, theme & wedding cakes. Sugar-free and freshly baked. Pre-order 48 hours in advance." },
      { property: "og:title", content: "Celebration Cakes — Shahad Bakes" },
      { property: "og:description", content: "Make every moment a sweet, healthy memory." },
      { property: "og:image", content: catCelebration },
    ],
  }),
  component: Celebration,
});

const cakes = products.filter((p) => p.category === "celebration-cakes");

function Celebration() {
  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-border">
        <img src={catCelebration} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 to-secondary/40" />
        <div className="relative container-x py-24 md:py-36 text-[var(--cream)]">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4" style={{ fontFamily: "var(--font-button)" }}>Celebration Cakes</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[1.05] text-balance">Make every moment <em className="not-italic text-primary">a sweet memory.</em></h1>
          <p className="mt-5 max-w-xl text-[var(--cream)]/85 text-lg">Custom birthday, festive and theme cakes — sugar-free, wholesome, unforgettable.</p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm text-primary-foreground hover:bg-primary/90 transition" style={{ fontFamily: "var(--font-button)" }}>
            <MessageCircle className="h-4 w-4" /> Design Your Cake
          </a>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionTitle eyebrow="Signature Cakes" title="Made-to-order, baked-to-impress." />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cakes.map((c) => (
            <div key={c.name} className="group rounded-2xl bg-card border border-border overflow-hidden hover:-translate-y-1 transition">
              <div className="aspect-square overflow-hidden"><img src={catCelebration} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" /></div>
              <div className="p-4 font-display text-lg text-secondary">{c.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--cream)]/40 border-y border-border py-20">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {[
            { t: "Choose Your Cake", d: "Pick a signature design or share your vision." },
            { t: "Personalise It", d: "Flavour, size, theme, message — your call." },
            { t: "Fresh Delivery", d: "Baked fresh, delivered chilled, on your day." },
          ].map((s, i) => (
            <div key={s.t} className="p-7 rounded-2xl bg-card border border-border">
              <div className="text-primary font-display text-3xl">0{i + 1}</div>
              <div className="mt-3 font-display text-xl text-secondary">{s.t}</div>
              <div className="mt-2 text-sm text-foreground/70">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
