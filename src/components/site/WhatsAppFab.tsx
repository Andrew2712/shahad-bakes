import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/products";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground shadow-2xl shadow-secondary/30 px-5 py-3 text-sm hover:bg-secondary/90 transition"
      style={{ fontFamily: "var(--font-button)" }}
    >
      <MessageCircle className="h-4 w-4 text-primary" />
      WhatsApp Order
    </a>
  );
}
