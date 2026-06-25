import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — Shahad Bakes" },
      { name: "description", content: "Common questions about ingredients, shelf life, ordering and delivery at Shahad Bakes." },
      { property: "og:title", content: "FAQs — Shahad Bakes" },
      { property: "og:description", content: "Everything you'd want to know." },
    ],
  }),
  component: Faqs,
});

const faqs = [
  { q: "Are your bakes really sugar-free?", a: "Yes. We sweeten everything with natural alternatives like dates, jaggery and a touch of honey — never refined white sugar." },
  { q: "What flour do you use?", a: "No refined flour (maida) ever. We bake with whole wheat, ragi, oats, almond, buckwheat and millet." },
  { q: "How do you avoid refined oils?", a: "We use cold-pressed oils, ghee and unsalted butter — depending on the recipe." },
  { q: "What's the shelf life?", a: "Cookies & savouries: 10–15 days. Loaf cakes: 4–5 days refrigerated. Celebration cakes: best within 24 hours." },
  { q: "Do you deliver?", a: "Yes — city-wide delivery and pan-India shipping for shelf-stable products. WhatsApp us to confirm your pin code." },
  { q: "Can I customise a celebration cake?", a: "Absolutely. Pre-order at least 48 hours in advance. Share your theme and we'll handle the rest." },
];

function Faqs() {
  return (
    <Shell>
      <section className="container-x py-20 md:py-28">
        <SectionTitle eyebrow="FAQs" title={<>Everything you&apos;d want to <em className="not-italic text-primary">know.</em></>} />
        <div className="mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                <span className="font-display text-xl text-secondary">{f.q}</span>
                <span className="text-primary text-2xl leading-none transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-foreground/75 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </Shell>
  );
}
