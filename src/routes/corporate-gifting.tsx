import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import gifting from "@/assets/gifting.jpg";
import { Gift, Users, Calendar, MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/products";

export const Route = createFileRoute("/corporate-gifting")({
  head: () => ({
    meta: [
      { title: "Corporate Gifting — Shahad Bakes" },
      { name: "description", content: "Curated healthy gift hampers for employees, clients and festivals. Custom branding available." },
      { property: "og:title", content: "Corporate Gifting — Shahad Bakes" },
      { property: "og:description", content: "Hampers that say thank you, beautifully." },
      { property: "og:image", content: gifting },
    ],
  }),
  component: Gifting,
});

function Gifting() {
  return (
    <Shell>
      <section className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionTitle eyebrow="Corporate Gifting" title={<>Gifts that say <em className="not-italic text-primary">thank you, beautifully.</em></>} sub="Curated hampers for festivals, employee wellness, client appreciation, weddings and milestone moments. Custom branding and personalised notes available." />
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm text-primary-foreground hover:bg-primary/90 transition" style={{ fontFamily: "var(--font-button)" }}>
            <MessageCircle className="h-4 w-4" /> Request a Quote
          </a>
        </div>
        <img src={gifting} alt="Corporate gift hampers" className="rounded-2xl aspect-[4/3] object-cover" loading="lazy" />
      </section>

      <section className="bg-[var(--cream)]/40 border-y border-border py-20">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, t: "Festive Hampers", d: "Diwali, Christmas, Eid, New Year — thoughtful gifting for every occasion." },
            { icon: Users, t: "Employee Wellness", d: "Healthy bakes that show your team you care about their wellbeing." },
            { icon: Gift, t: "Client Appreciation", d: "Premium boxes with your branding for clients who deserve more than chocolates." },
          ].map((f) => (
            <div key={f.t} className="p-7 rounded-2xl bg-card border border-border">
              <f.icon className="h-6 w-6 text-primary" />
              <div className="mt-4 font-display text-xl text-secondary">{f.t}</div>
              <div className="mt-2 text-sm text-foreground/70">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
