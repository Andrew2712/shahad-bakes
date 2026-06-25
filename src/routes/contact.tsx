import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import { WHATSAPP } from "@/lib/products";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shahad Bakes" },
      { name: "description", content: "Get in touch with Shahad Bakes for orders, partnerships and feedback." },
      { property: "og:title", content: "Contact — Shahad Bakes" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <Shell>
      <section className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-16">
        <div>
          <SectionTitle eyebrow="Contact" title={<>We&apos;d love to <em className="not-italic text-primary">hear from you.</em></>} sub="Questions, custom orders, partnerships — we usually reply within a few hours." />
          <ul className="mt-10 space-y-5 text-sm">
            <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /> <div><div className="font-medium text-secondary">Email</div><div className="text-foreground/70">hello@shahadbakes.com</div></div></li>
            <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /> <div><div className="font-medium text-secondary">Phone</div><div className="text-foreground/70">+91 99999 99999</div></div></li>
            <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /> <div><div className="font-medium text-secondary">Studio</div><div className="text-foreground/70">Freshly baked, delivered city-wide.</div></div></li>
          </ul>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm text-primary-foreground hover:bg-primary/90 transition" style={{ fontFamily: "var(--font-button)" }}>
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        <form className="rounded-2xl border border-border bg-card p-7 md:p-10 space-y-5">
          <Field label="Name" placeholder="Your name" />
          <Field label="Email" type="email" placeholder="you@example.com" />
          <Field label="Subject" placeholder="What's this about?" />
          <div>
            <label className="text-xs uppercase tracking-widest text-foreground/70" style={{ fontFamily: "var(--font-button)" }}>Message</label>
            <textarea rows={5} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Tell us more…" />
          </div>
          <button type="button" className="w-full rounded-full bg-secondary px-7 py-3.5 text-sm text-secondary-foreground hover:bg-secondary/90" style={{ fontFamily: "var(--font-button)" }}>Send Message</button>
        </form>
      </section>
    </Shell>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-foreground/70" style={{ fontFamily: "var(--font-button)" }}>{label}</label>
      <input {...rest} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}
