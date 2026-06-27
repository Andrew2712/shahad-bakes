import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, Calendar, User, Phone, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// ── Update this to the real WhatsApp business number ──────────
const WHATSAPP_NUMBER = "918951244486"; // Format: country code + number, no +

type Step = "cart" | "details";
type DeliveryType = "pickup" | "delivery";

interface OrderForm {
  name: string;
  phone: string;
  delivery: DeliveryType;
  date: string;
  notes: string;
  address: string;
}

export function CartDrawer() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    subtotal, tax, deliveryCharge, total, itemCount,
    clearAll,
  } = useCart();
  const { profile } = useAuth();

  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    delivery: "delivery",
    date: "",
    notes: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<OrderForm>>({});

  // Pre-fill from profile when drawer opens
  function handleOpenDetails() {
    setForm((f) => ({
      ...f,
      name: f.name || profile?.name || "",
      phone: f.phone || profile?.phone || "",
      address: f.address || profile?.address || "",
    }));
    setStep("details");
  }

  function validate(): boolean {
    const e: Partial<OrderForm> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter valid 10-digit number";
    if (!form.date) e.date = "Required";
    if (form.delivery === "delivery" && !form.address.trim()) e.address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildWhatsAppMessage(): string {
    const orderLines = items
      .map((i) => `  • ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toFixed(0)}`)
      .join("\n");

    const deliveryLine = form.delivery === "pickup"
      ? "🏪 *Pickup* from store"
      : `🚚 *Delivery* to: ${form.address}`;

    const message = `
🍪 *New Order — Shahad Bakes*

👤 *Name:* ${form.name}
📞 *Phone:* ${form.phone}
📅 *Date:* ${new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
${deliveryLine}

*Order Items:*
${orderLines}

💰 *Subtotal:* ₹${subtotal.toFixed(0)}
🏷️ *Tax (5%):* ₹${tax.toFixed(0)}
🚚 *Delivery:* ${deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
✅ *Total: ₹${total.toFixed(0)}*
${form.notes ? `\n📝 *Notes:* ${form.notes}` : ""}

_Please confirm this order. Thank you!_ 🙏
    `.trim();

    return encodeURIComponent(message);
  }

  async function handleSendWhatsApp() {
    if (!validate()) return;
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, "_blank");
    // Optionally clear cart after sending
    await clearAll();
    closeCart();
    setStep("cart");
    setForm({ name: "", phone: "", delivery: "delivery", date: "", notes: "", address: "" });
  }

  function update(field: keyof OrderForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-secondary/30 backdrop-blur-sm" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* ── STEP 1: CART ─────────────────────────────────────── */}
        {step === "cart" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl text-secondary">Your Basket</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{itemCount}</span>
                )}
              </div>
              <button onClick={closeCart} className="p-1.5 hover:text-primary transition rounded-lg hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                  <p className="text-foreground/50 text-sm">Your basket is empty</p>
                  <button onClick={closeCart} className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 transition" style={{ fontFamily: "var(--font-button)" }}>
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-3 rounded-2xl border border-border p-3 bg-card">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm text-secondary leading-tight line-clamp-2">{item.name}</p>
                      <p className="mt-0.5 text-xs text-foreground/50 capitalize">{item.category.replace("-", " ")}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-secondary text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition text-foreground/70">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition text-foreground/70">
                            <Plus className="h-3 w-3" />
                          </button>
                          <button onClick={() => removeItem(item.productId)} className="ml-1 h-6 w-6 rounded-full flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-5 space-y-4 shrink-0">
                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-foreground/60"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                  <div className="flex justify-between text-foreground/60"><span>Tax (5%)</span><span>₹{tax.toFixed(0)}</span></div>
                  <div className="flex justify-between text-foreground/60">
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryCharge}`}</span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-[11px] text-primary/70">Add ₹{(799 - subtotal).toFixed(0)} more for free delivery</p>
                  )}
                </div>

                <div className="flex justify-between items-center font-display text-lg text-secondary border-t border-border pt-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>

                <p className="text-[11px] text-foreground/40 text-center">
                  Final total confirmed by Shahad on WhatsApp
                </p>

                <button
                  onClick={handleOpenDetails}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                  style={{ fontFamily: "var(--font-button)" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Send Order on WhatsApp
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: ORDER DETAILS ─────────────────────────────── */}
        {step === "details" && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4 shrink-0">
              <button onClick={() => setStep("cart")} className="p-1.5 hover:text-primary transition rounded-lg hover:bg-muted">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="font-display text-xl text-secondary">Order Details</h2>
                <p className="text-xs text-foreground/50">We'll include this in your WhatsApp message</p>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-base flex items-center gap-1"><User className="h-3 w-3" /> Your Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Full name"
                    className={`input-base text-sm ${errors.name ? "border-destructive" : ""}`}
                  />
                  {errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="label-base flex items-center gap-1"><Phone className="h-3 w-3" /> Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`input-base text-sm ${errors.phone ? "border-destructive" : ""}`}
                  />
                  {errors.phone && <p className="text-[10px] text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Pickup / Delivery toggle */}
              <div>
                <label className="label-base">Fulfilment *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["pickup", "delivery"] as DeliveryType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => update("delivery", type)}
                      className={`rounded-xl border py-2.5 text-sm font-medium uppercase tracking-wider transition ${
                        form.delivery === type
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground/70 hover:border-primary hover:text-primary"
                      }`}
                      style={{ fontFamily: "var(--font-button)" }}
                    >
                      {type === "pickup" ? "🏪 Pickup" : "🚚 Delivery"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery address — only shown for delivery */}
              {form.delivery === "delivery" && (
                <div>
                  <label className="label-base flex items-center gap-1"><MapPin className="h-3 w-3" /> Delivery Address *</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="House no., street, area, city, pincode"
                    rows={2}
                    className={`input-base text-sm resize-none ${errors.address ? "border-destructive" : ""}`}
                  />
                  {errors.address && <p className="text-[10px] text-destructive mt-1">{errors.address}</p>}
                </div>
              )}

              {/* Date */}
              <div>
                <label className="label-base flex items-center gap-1"><Calendar className="h-3 w-3" /> Preferred Date *</label>
                <input
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={(e) => update("date", e.target.value)}
                  className={`input-base text-sm ${errors.date ? "border-destructive" : ""}`}
                />
                {errors.date && <p className="text-[10px] text-destructive mt-1">{errors.date}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="label-base">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Customisations, allergies, special instructions…"
                  rows={2}
                  className="input-base text-sm resize-none"
                />
              </div>

              {/* Order summary mini */}
              <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-1.5 text-sm">
                <p className="font-medium text-secondary text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-button)" }}>Order Summary</p>
                {items.map((i) => (
                  <div key={i.productId} className="flex justify-between text-foreground/70 text-xs">
                    <span className="line-clamp-1 flex-1">{i.name} × {i.quantity}</span>
                    <span className="ml-2 shrink-0">₹{(i.price * i.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-display text-secondary">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="border-t border-border px-5 py-5 shrink-0 space-y-3">
              <p className="text-[11px] text-foreground/40 text-center leading-relaxed">
                Clicking below opens WhatsApp with your order pre-filled. Shahad will confirm your order and total.
              </p>
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                style={{ fontFamily: "var(--font-button)" }}
              >
                <MessageCircle className="h-5 w-5" />
                Send Order on WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}