import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Package, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/celebration-cakes", label: "Celebration" },
  { to: "/corporate-gifting", label: "Gifting" },
  { to: "/bulk-orders", label: "Bulk" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-display text-lg text-primary font-bold">S</span>
          </div>
          <span className="font-display text-xl tracking-tight text-secondary">
            Shahad <span className="text-primary">Bakes</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm" style={{ fontFamily: "var(--font-button)" }}>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider text-[11px] font-medium"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[1.1rem] rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center leading-none px-1">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 hover:border-primary transition text-sm"
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="max-w-[80px] truncate text-xs font-medium" style={{ fontFamily: "var(--font-button)" }}>
                  {profile?.name?.split(" ")[0] ?? "Account"}
                </span>
                <ChevronDown className="h-3 w-3 text-foreground/60" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-border bg-background shadow-xl overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-muted transition"
                    >
                      <User className="h-4 w-4 text-primary" /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-muted transition"
                    >
                      <Package className="h-4 w-4 text-primary" /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-muted transition"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" /> Admin
                      </Link>
                    )}
                    <div className="border-t border-border">
                      <button
                        onClick={() => { setProfileOpen(false); handleSignOut(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-muted transition"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 transition"
              style={{ fontFamily: "var(--font-button)" }}
            >
              <User className="h-4 w-4" /> Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-foreground/80 hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="py-2.5 text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setOpen(false)} className="py-2.5 text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="py-2.5 text-sm flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 text-primary" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { setOpen(false); handleSignOut(); }} className="py-2.5 text-sm text-destructive flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="py-2.5 text-sm text-primary font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Sign In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
