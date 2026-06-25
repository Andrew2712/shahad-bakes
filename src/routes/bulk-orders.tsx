import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/products";

export const Route = createFileRoute("/bulk-orders")({
  head: () => ({
    meta: [
      { title: "Bulk Orders — Shahad Bakes" },
      { name: "description", content: "Bulk orders for events, offices and resellers. Special pricing and custom packaging available." },
      { property: "og:title", content: "Bulk Orders — Shahad Bakes" },
      { property: "og:description", content: "Healthy bakes, at scale." },
    ],
  }),
  component: Bulk,
});

function Bulk() {
  return (
    <Shell>
      <section className="container-x py-20 md:py-28">
        <SectionTitle eyebrow="Bulk Orders" title={<>Healthy bakes, <em className="not-italic text-primary">at scale.</em></>} sub="Weddings, offices, cafés, resellers — we partner with you for orders of 50 pieces and above. Special pricing, custom packaging and reliable delivery." />

        <form className="mt-12 grid md:grid-cols-2 gap-5 max-w-3xl">
          <Field label="Your Name" placeholder="Full name" />
          <Field label="Email" type="email" placeholder="you@example.com" />
          <Field label="Phone" placeholder="+91 …" />
          <Field label="Company / Event" placeholder="Optional" />
          <Field label="Product Interest" placeholder="e.g. Cookies + Brownies" />
          <Field label="Quantity" placeholder="e.g. 200 boxes" />
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-foreground/70" style={{ fontFamily: "var(--font-button)" }}>Notes</label>
            <textarea rows={4} className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Tell us about your requirement…" />
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3" style={{ fontFamily: "var(--font-button)" }}>
            <button type="button" className="rounded-full bg-secondary px-7 py-3.5 text-sm text-secondary-foreground hover:bg-secondary/90">Submit Enquiry</button>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm text-secondary hover:bg-muted">
              <MessageCircle className="h-4 w-4 text-primary" /> Or WhatsApp us directly
            </a>
          </div>
        </form>
      </section>
    </Shell>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-foreground/70" style={{ fontFamily: "var(--font-button)" }}>{label}</label>
      <input {...rest} className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}
