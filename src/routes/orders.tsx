import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, getInvoice, type Order } from "@/lib/supabase/db";
import { generateInvoicePDF, downloadPDF } from "@/lib/invoice";
import { useEffect, useState } from "react";
import { Loader2, Package, Download, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Shahad Bakes" }] }),
  component: OrdersPage,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.id).then((o) => { setOrders(o); setFetching(false); });
  }, [user]);

  async function handleDownloadInvoice(order: Order) {
    if (!order.invoiceId) { toast.error("Invoice not found for this order"); return; }
    setDownloading(order.id);
    try {
      const inv = await getInvoice(order.invoiceId);
      if (!inv) { toast.error("Invoice not available"); return; }
      const blob = await generateInvoicePDF(inv);
      downloadPDF(blob, `Shahad-Invoice-${inv.invoiceNumber}.pdf`);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(null);
    }
  }

  if (loading || fetching) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="py-14 md:py-20">
        <div className="container-x max-w-3xl">
          <h1 className="font-display text-3xl text-secondary mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <Package className="h-14 w-14 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-foreground/60 mb-5">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate({ to: "/products" })}
                className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 transition"
                style={{ fontFamily: "var(--font-button)" }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const date = order.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "";
                const isOpen = expanded === order.id;
                return (
                  <div key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                    {/* Order header */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-foreground/50 mt-0.5">{date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? ""}`} style={{ fontFamily: "var(--font-button)" }}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                        <span className="font-display text-secondary">₹{order.total.toFixed(0)}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-foreground/40" /> : <ChevronDown className="h-4 w-4 text-foreground/40" />}
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        {/* Mobile status */}
                        <span className={`sm:hidden inline-flex rounded-full px-3 py-1 text-xs font-medium mb-4 ${STATUS_COLORS[order.status] ?? ""}`} style={{ fontFamily: "var(--font-button)" }}>
                          {STATUS_LABEL[order.status]}
                        </span>

                        {/* Items */}
                        <div className="space-y-2 text-sm mb-4">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex justify-between text-foreground/70">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="text-secondary">₹{(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-border pt-3 space-y-1.5 text-xs text-foreground/60 mb-4">
                          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(0)}</span></div>
                          <div className="flex justify-between"><span>Tax</span><span>₹{order.tax.toFixed(0)}</span></div>
                          <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}</span></div>
                          <div className="flex justify-between font-semibold text-secondary text-sm pt-1 border-t border-border">
                            <span>Total</span><span>₹{order.total.toFixed(0)}</span>
                          </div>
                        </div>

                        {/* Delivery */}
                        <p className="text-xs text-foreground/50 mb-4">📍 {order.deliveryAddress}</p>

                        {/* Download Invoice */}
                        {order.invoiceId && (
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={downloading === order.id}
                            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs hover:border-primary hover:text-primary transition disabled:opacity-60"
                            style={{ fontFamily: "var(--font-button)" }}
                          >
                            {downloading === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                            Download Invoice
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
