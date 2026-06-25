import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, MapPin } from "lucide-react";
import { WHATSAPP } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 bg-secondary text-secondary-foreground">
      <div className="container-x py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-2xl">Shahad <span className="text-primary">Bakes</span></div>
          <p className="mt-3 text-sm text-secondary-foreground/75 leading-relaxed">
            Healthy sweetness without guilt. Freshly baked every day, with no sugar, no flour and no refined oil.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary/90 mb-4" style={{ fontFamily: "var(--font-button)" }}>Explore</div>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/celebration-cakes" className="hover:text-primary">Celebration Cakes</Link></li>
            <li><Link to="/corporate-gifting" className="hover:text-primary">Corporate Gifting</Link></li>
            <li><Link to="/bulk-orders" className="hover:text-primary">Bulk Orders</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Healthy Living Journal</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary/90 mb-4" style={{ fontFamily: "var(--font-button)" }}>Company</div>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link to="/about" className="hover:text-primary">About Shahad</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/faqs" className="hover:text-primary">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary/90 mb-4" style={{ fontFamily: "var(--font-button)" }}>Get in touch</div>
          <ul className="space-y-3 text-sm text-secondary-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> Crafted with love, delivered fresh.</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@shahadbakes.com</li>
            <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"><MessageCircle className="h-4 w-4" /> WhatsApp Order</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><Instagram className="h-4 w-4" /> @shahad_bakes</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-secondary-foreground/60">
          <div>© {new Date().getFullYear()} Shahad Bakes. All rights reserved.</div>
          <div>No Sugar · No Flour · No Refined Oil</div>
        </div>
      </div>
    </footer>
  );
}
