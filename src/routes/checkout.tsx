import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder, createInvoice, generateInvoiceNumber, type OrderItem } from "@/lib/supabase/db";
import { generateInvoicePDF, downloadPDF } from "@/lib/invoice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ArrowLeft, ShoppingBag } from "lucide-react";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Shahad Bakes" }] }),
  component: CheckoutPage,
});

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
}

function CheckoutPage() {
  const { user, profile, loading } = useAuth();
  const { items, subtotal, tax, deliveryCharge, total, clearAll } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        name: f.name || profile.name || "",
        email: profile.email || "",
        phone: f.phone || profile.phone || "",
        address: f.address || profile.address || "",
        city: f.city || profile.city || "",
        pincode: f.pincode || profile.pincode || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && items.length === 0 && step !== 3) navigate({ to: "/products" });
  }, [items, loading, step, navigate]);

  function update(field: keyof CheckoutForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateStep1() {
    if (!form.name.trim()) { toast.error("Please enter your name"); return false; }
    if (!form.phone.match(/^[6-9]\d{9}$/)) { toast.error("Enter a valid 10-digit phone number"); return false; }
    return true;
  }

  function validateStep2() {
    if (!form.address.trim()) { toast.error("Please enter your address"); return false; }
    if (!form.city.trim()) { toast.error("Please enter your city"); return false; }
    if (!form.pincode.match(/^\d{6}$/)) { toast.error("Enter a valid 6-digit pincode"); return false; }
    return true;
  }

  async function handlePlaceOrder() {
    if (!user) return;
    setSubmitting(true);
    try {
      const orderItems: OrderItem[] = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
      }));

      // 1. Create order
      const oid = await createOrder({
        userId: user.id,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        deliveryAddress: `${form.address}, ${form.city} - ${form.pincode}`,
        city: form.city,
        pincode: form.pincode,
        items: orderItems,
        subtotal,
        tax,
        deliveryCharge,
        discount: 0,
        total,
        status: "pending",
        notes: form.notes,
      });

      // 2. Create invoice record
      const invNumber = generateInvoiceNumber();
      const invData = {
        invoiceNumber: invNumber,
        orderId: oid,
        userId: user.id,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        deliveryAddress: `${form.address}, ${form.city} - ${form.pincode}`,
        items: orderItems,
        subtotal,
        tax,
        deliveryCharge,
        discount: 0,
        total,
        createdAt: { toDate: () => new Date() },
      };
      const invId = await createInvoice(invData);

      // 3. Generate + auto-download PDF
      const blob = await generateInvoicePDF(invData as any);
      downloadPDF(blob, `Shahad-Bakes-Invoice-${invNumber}.pdf`);

      // 4. Clear cart
      await clearAll();

      setOrderId(oid);
      setStep(3);
      toast.success("Order placed! Your invoice is downloading.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 3) {
    return (
      <Shell>
        <section className="min-h-[70vh] flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl text-secondary mb-3">Order Placed!</h1>
            <p className="text-foreground/60 text-sm leading-relaxed mb-1">
              Your invoice PDF has been downloaded. We'll confirm your order shortly via WhatsApp.
            </p>
            <p className="text-xs text-foreground/40 mb-8">Order ID: <span className="font-mono text-secondary">{orderId}</span></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/orders"
                className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90 transition"
                style={{ fontFamily: "var(--font-button)" }}
              >
                Track My Orders
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-border px-6 py-3 text-sm hover:border-primary hover:text-primary transition"
                style={{ fontFamily: "var(--font-button)" }}
              >
                Shop More
              </Link>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="py-14 md:py-20">
        <div className="container-x max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <button onClick={() => navigate({ to: "/" })} className="text-foreground/50 hover:text-primary transition">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-3xl text-secondary">Checkout</h1>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-10 text-sm" style={{ fontFamily: "var(--font-button)" }}>
            {(["Customer Info", "Delivery Address", "Review & Confirm"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`hidden sm:block text-xs ${step === i + 1 ? "text-secondary font-medium" : "text-foreground/40"}`}>{s}</span>
                {i < 2 && <div className={`h-px w-6 sm:w-10 ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form panel */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {step === 1 && (
                  <div>
                    <h2 className="font-display text-xl text-secondary mb-5">Customer Information</h2>
                    <div className="space-y-4">
                      <InputField label="Full Name *" value={form.name} onChange={(v) => update("name", v)} placeholder="Your full name" />
                      <InputField label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" type="email" disabled />
                      <InputField label="Phone Number *" value={form.phone} onChange={(v) => update("phone", v)} placeholder="9876543210" type="tel" maxLength={10} />
                    </div>
                    <button
                      onClick={() => validateStep1() && setStep(2)}
                      className="mt-6 rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground hover:bg-primary/90 transition"
                      style={{ fontFamily: "var(--font-button)" }}
                    >
                      Continue to Delivery →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-display text-xl text-secondary mb-5">Delivery Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="label-base">Street Address *</label>
                        <textarea
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          placeholder="House no., street, area"
                          rows={2}
                          className="input-base resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="City *" value={form.city} onChange={(v) => update("city", v)} placeholder="Bangalore" />
                        <InputField label="Pincode *" value={form.pincode} onChange={(v) => update("pincode", v)} placeholder="560001" maxLength={6} />
                      </div>
                      <div>
                        <label className="label-base">Order Notes (optional)</label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => update("notes", e.target.value)}
                          placeholder="Delivery instructions, customisations..."
                          rows={2}
                          className="input-base resize-none"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="rounded-full border border-border px-6 py-3 text-sm hover:border-primary transition"
                        style={{ fontFamily: "var(--font-button)" }}
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => validateStep2() && setStep(3 as any)}
                        className="rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground hover:bg-primary/90 transition"
                        style={{ fontFamily: "var(--font-button)" }}
                      >
                        Review Order →
                      </button>
                    </div>
                  </div>
                )}

                {(step as number) === 3 && (
                  <div>
                    <h2 className="font-display text-xl text-secondary mb-5">Review & Confirm</h2>
                    <div className="space-y-3 text-sm mb-5">
                      <Row label="Name" value={form.name} />
                      <Row label="Phone" value={form.phone} />
                      <Row label="Address" value={`${form.address}, ${form.city} - ${form.pincode}`} />
                      {form.notes && <Row label="Notes" value={form.notes} />}
                    </div>
                    <div className="border-t border-border pt-4 mt-4 space-y-2 text-sm">
                      {items.map((i) => (
                        <div key={i.productId} className="flex justify-between">
                          <span className="text-foreground/70">{i.name} × {i.quantity}</span>
                          <span className="text-secondary font-medium">₹{(i.price * i.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="rounded-full border border-border px-6 py-3 text-sm hover:border-primary transition"
                        style={{ fontFamily: "var(--font-button)" }}
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={submitting}
                        className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60"
                        style={{ fontFamily: "var(--font-button)" }}
                      >
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Confirm Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm h-fit sticky top-24">
              <h3 className="font-display text-lg text-secondary mb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" /> Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                {items.map((i) => (
                  <div key={i.productId} className="flex justify-between gap-2">
                    <span className="text-foreground/70 line-clamp-1 flex-1">{i.name}</span>
                    <span className="text-foreground/50 shrink-0">×{i.quantity}</span>
                    <span className="text-secondary font-medium shrink-0">₹{(i.price * i.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-foreground/60"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between text-foreground/60"><span>Tax (5%)</span><span>₹{tax.toFixed(0)}</span></div>
                <div className="flex justify-between text-foreground/60">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryCharge}`}</span>
                </div>
              </div>
              <div className="mt-3 border-t border-border pt-3 flex justify-between font-display text-lg text-secondary">
                <span>Total</span><span>₹{total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", disabled = false, maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean; maxLength?: number;
}) {
  return (
    <div>
      <label className="label-base">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled} maxLength={maxLength} className="input-base disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-foreground/50">{label}</span>
      <span className="text-secondary">{value}</span>
    </div>
  );
}
