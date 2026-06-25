import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, tax, deliveryCharge, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    closeCart();
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/checkout" } as any });
    } else {
      navigate({ to: "/checkout" });
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-secondary/30 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl text-secondary">Your Cart</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 hover:text-primary transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
              <p className="text-foreground/60 text-sm">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 transition"
                style={{ fontFamily: "var(--font-button)" }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3 rounded-xl border border-border p-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-18 w-18 rounded-lg object-cover shrink-0"
                  style={{ width: 72, height: 72 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-secondary leading-tight line-clamp-2">{item.name}</p>
                  <p className="mt-1 text-xs text-foreground/60 capitalize">{item.category.replace("-", " ")}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-secondary text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-1 h-6 w-6 rounded-full flex items-center justify-center text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer totals */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-5 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-primary/80">
                  Add ₹{(799 - subtotal).toFixed(0)} more for free delivery
                </p>
              )}
            </div>
            <div className="flex justify-between font-semibold text-secondary border-t border-border pt-2">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-lg">₹{total.toFixed(0)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              style={{ fontFamily: "var(--font-button)" }}
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
