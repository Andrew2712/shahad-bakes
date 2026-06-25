import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import about from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shahad Bakes" },
      { name: "description", content: "The story behind Shahad Bakes — a healthy bakery on a mission to make indulgence guilt-free." },
      { property: "og:title", content: "About — Shahad Bakes" },
      { property: "og:description", content: "Born from a kitchen. Built on health. Crafted with love." },
      { property: "og:image", content: about },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Shell>
      <section className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <SectionTitle eyebrow="Our Story" title={<>Born from a kitchen. <em className="not-italic text-primary">Built on health.</em></>} />
          <div className="mt-6 space-y-5 text-foreground/75 leading-relaxed">
            <p>Shahad — meaning <em>honey</em> — began with a simple wish: that the people we love most could enjoy something sweet without compromise. No sugar to spike, no maida to weigh them down, no refined oils to second-guess.</p>
            <p>Today, our small-batch bakery crafts over 50 wholesome bakes from honest ingredients — jaggery, dates, honey, oats, ragi, millet, nuts and seeds. Slow-baked, never mass-produced.</p>
            <p>We believe indulgence and wellness aren't opposites. They're the same thing, when made with care.</p>
          </div>
        </div>
        <img src={about} alt="Our baker" className="rounded-2xl aspect-[4/5] object-cover" loading="lazy" />
      </section>

      <section className="bg-[var(--cream)]/40 border-y border-border py-20">
        <div className="container-x grid md:grid-cols-3 gap-6 text-center">
          {[
            { n: "50+", l: "Wholesome bakes" },
            { n: "Zero", l: "Sugar, maida, refined oil" },
            { n: "Daily", l: "Freshly baked, small-batch" },
          ].map((s) => (
            <div key={s.l} className="p-8 rounded-2xl bg-card border border-border">
              <div className="font-display text-5xl text-primary">{s.n}</div>
              <div className="mt-2 text-sm uppercase tracking-widest text-foreground/70" style={{ fontFamily: "var(--font-button)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
