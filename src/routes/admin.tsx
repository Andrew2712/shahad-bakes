import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllOrders, getAllUsers, getAllProducts, getAllInvoices,
  updateOrderStatus, addProduct, updateProduct, deleteProduct,
  type Order, type UserProfile, type Product, type Invoice,
  type OrderStatus,
} from "@/lib/supabase/db";
import { generateInvoicePDF, downloadPDF } from "@/lib/invoice";
import { getInvoice } from "@/lib/supabase/db";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2, LayoutDashboard, Package, Users, FileText,
  ShoppingBag, TrendingUp, Search, Download, Pencil, Trash2,
  Plus, X, Save, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Shahad Bakes" }] }),
  component: AdminPage,
});

type Tab = "overview" | "orders" | "products" | "customers" | "invoices";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

function AdminPage() {
  const { user, profile, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    if (!loading && user && !isAdmin) { toast.error("Access denied"); navigate({ to: "/" }); }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([getAllOrders(), getAllUsers(), getAllProducts(), getAllInvoices()]).then(([o, u, p, i]) => {
      setOrders(o); setUsers(u); setProducts(p); setInvoices(i); setFetching(false);
    });
  }, [isAdmin]);

  async function changeStatus(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    toast.success("Order status updated");
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  async function handleDownloadInvoice(inv: Invoice) {
    const blob = await generateInvoicePDF(inv);
    downloadPDF(blob, `Invoice-${inv.invoiceNumber}.pdf`);
    toast.success("Downloading…");
  }

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  if (loading || fetching) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "orders", label: `Orders (${orders.length})`, icon: <Package className="h-4 w-4" /> },
    { id: "products", label: `Products (${products.length})`, icon: <ShoppingBag className="h-4 w-4" /> },
    { id: "customers", label: `Customers (${users.length})`, icon: <Users className="h-4 w-4" /> },
    { id: "invoices", label: `Invoices (${invoices.length})`, icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <Shell>
      <section className="py-10 md:py-14">
        <div className="container-x max-w-7xl">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl text-secondary">Admin Dashboard</h1>
            <p className="text-sm text-foreground/50 mt-1">Manage your Shahad Bakes store</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition ${
                  tab === t.id ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-button)" }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={<TrendingUp />} color="bg-green-50 text-green-600" />
                <StatCard label="Total Orders" value={orders.length} icon={<Package />} color="bg-blue-50 text-blue-600" />
                <StatCard label="Pending Orders" value={pendingCount} icon={<Package />} color="bg-yellow-50 text-yellow-600" />
                <StatCard label="Total Customers" value={users.length} icon={<Users />} color="bg-purple-50 text-purple-600" />
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-lg text-secondary">Recent Orders</h2>
                  <button onClick={() => setTab("orders")} className="text-xs text-primary hover:underline" style={{ fontFamily: "var(--font-button)" }}>View all</button>
                </div>
                <OrderTable orders={orders.slice(0, 5)} onStatusChange={changeStatus} />
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div>
              <div className="mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search by customer name or order ID…" />
              </div>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <OrderTable
                  orders={orders.filter((o) =>
                    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                    o.id.toLowerCase().includes(search.toLowerCase())
                  )}
                  onStatusChange={changeStatus}
                />
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <ProductsTab
              products={products}
              onDelete={handleDeleteProduct}
              onRefresh={() => getAllProducts().then(setProducts)}
            />
          )}

          {/* CUSTOMERS */}
          {tab === "customers" && (
            <div>
              <div className="mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search customers…" />
              </div>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <Th>Customer</Th><Th>Email</Th><Th>Phone</Th><Th>Role</Th><Th>Joined</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
                        .map((u) => (
                          <tr key={u.uid} className="border-b border-border/50 hover:bg-muted/30 transition">
                            <Td>
                              <div className="flex items-center gap-2">
                                {u.photoURL ? <img src={u.photoURL} className="h-7 w-7 rounded-full object-cover" alt="" /> : <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center"><Users className="h-3.5 w-3.5 text-primary" /></div>}
                                <span className="font-medium text-secondary">{u.name || "—"}</span>
                              </div>
                            </Td>
                            <Td>{u.email}</Td>
                            <Td>{u.phone || "—"}</Td>
                            <Td>
                              <span className={`rounded-full px-2 py-0.5 text-xs ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-foreground/60"}`} style={{ fontFamily: "var(--font-button)" }}>
                                {u.role}
                              </span>
                            </Td>
                            <Td>{u.createdAt?.toDate?.()?.toLocaleDateString("en-IN") ?? "—"}</Td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INVOICES */}
          {tab === "invoices" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <Th>Invoice #</Th><Th>Customer</Th><Th>Order ID</Th><Th>Total</Th><Th>Date</Th><Th>Download</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                        <Td><span className="font-mono text-xs text-primary">{inv.invoiceNumber}</span></Td>
                        <Td>{inv.customerName}</Td>
                        <Td><span className="font-mono text-xs text-foreground/50">{inv.orderId.slice(-8).toUpperCase()}</span></Td>
                        <Td className="font-semibold text-secondary">₹{inv.total.toFixed(0)}</Td>
                        <Td>{inv.createdAt?.toDate?.()?.toLocaleDateString("en-IN") ?? "—"}</Td>
                        <Td>
                          <button onClick={() => handleDownloadInvoice(inv)} className="flex items-center gap-1 text-xs text-primary hover:underline" style={{ fontFamily: "var(--font-button)" }}>
                            <Download className="h-3 w-3" /> PDF
                          </button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}

// ── Sub-components ────────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center`}>{icon}</div>
      <div>
        <p className="text-xs text-foreground/50" style={{ fontFamily: "var(--font-button)" }}>{label}</p>
        <p className="font-display text-2xl text-secondary mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function OrderTable({ orders, onStatusChange }: { orders: Order[]; onStatusChange: (id: string, s: OrderStatus) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <Th>Order ID</Th><Th>Customer</Th><Th>Items</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={6} className="py-10 text-center text-foreground/40">No orders found</td></tr>
          ) : orders.map((o) => (
            <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition">
              <Td><span className="font-mono text-xs text-foreground/60">#{o.id.slice(-8).toUpperCase()}</span></Td>
              <Td>
                <div>
                  <p className="font-medium text-secondary">{o.customerName}</p>
                  <p className="text-xs text-foreground/40">{o.customerPhone}</p>
                </div>
              </Td>
              <Td>{o.items.length} item{o.items.length > 1 ? "s" : ""}</Td>
              <Td className="font-semibold text-secondary">₹{o.total.toFixed(0)}</Td>
              <Td>
                <select
                  value={o.status}
                  onChange={(e) => onStatusChange(o.id, e.target.value as OrderStatus)}
                  className={`rounded-full px-2 py-1 text-xs border-0 cursor-pointer appearance-none ${STATUS_COLORS[o.status] ?? ""}`}
                  style={{ fontFamily: "var(--font-button)" }}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </Td>
              <Td className="text-foreground/50 text-xs">{o.createdAt?.toDate?.()?.toLocaleDateString("en-IN") ?? "—"}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTab({ products, onDelete, onRefresh }: {
  products: Product[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", category: "cookies", description: "", ingredients: "", price: 299, discountPrice: undefined as number | undefined, imageUrl: "", available: true, tags: [] as string[], featured: false };
  const [form, setForm] = useState(emptyForm);

  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, description: p.description, ingredients: p.ingredients, price: p.price, discountPrice: p.discountPrice, imageUrl: p.imageUrl, available: p.available, tags: p.tags, featured: p.featured });
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditProduct(null); setForm(emptyForm); }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, form);
        toast.success("Product updated");
      } else {
        await addProduct({ name: form.name, category: form.category, description: form.description, ingredients: form.ingredients, price: form.price, discountPrice: form.discountPrice, imageUrl: form.imageUrl, available: form.available, tags: form.tags, featured: form.featured });
        toast.success("Product added");
      }
      await onRefresh();
      closeForm();
    } catch { toast.error("Failed to save product"); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products…" />
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition shrink-0" style={{ fontFamily: "var(--font-button)" }}>
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-background rounded-2xl border border-border shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-display text-lg text-secondary">{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={closeForm}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Product Name *", field: "name", type: "text" },
                { label: "Image URL", field: "imageUrl", type: "text" },
                { label: "Price (₹) *", field: "price", type: "number" },
                { label: "Discount Price (₹)", field: "discountPrice", type: "number" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="label-base">{label}</label>
                  <input type={type} value={(form as any)[field] ?? ""} onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) || undefined : e.target.value })} className="input-base" />
                </div>
              ))}
              <div>
                <label className="label-base">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-base">
                  {["cookies", "gluten-free", "savouries", "loaf-cakes", "brownies", "celebration-cakes", "delights"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-base">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-base resize-none" />
              </div>
              <div>
                <label className="label-base">Ingredients</label>
                <textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows={2} className="input-base resize-none" />
              </div>
              <div>
                <label className="label-base">Tags (comma separated)</label>
                <input type="text" value={form.tags.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="Bestseller, New, High Protein" className="input-base" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-primary" /> Available
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" /> Featured
                </label>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={closeForm} className="rounded-full border border-border px-5 py-2 text-sm hover:border-primary transition" style={{ fontFamily: "var(--font-button)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60" style={{ fontFamily: "var(--font-button)" }}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <Th>Product</Th><Th>Category</Th><Th>Price</Th><Th>Status</Th><Th>Tags</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <Td>
                      <div className="flex items-center gap-2">
                        {p.imageUrl && <img src={p.imageUrl} className="h-8 w-8 rounded-lg object-cover" alt="" />}
                        <span className="font-medium text-secondary line-clamp-1">{p.name}</span>
                      </div>
                    </Td>
                    <Td className="text-foreground/60 capitalize">{p.category}</Td>
                    <Td>
                      <span className="font-medium text-secondary">₹{(p.discountPrice ?? p.price).toFixed(0)}</span>
                      {p.discountPrice && <span className="ml-1 text-xs text-foreground/40 line-through">₹{p.price}</span>}
                    </Td>
                    <Td>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${p.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`} style={{ fontFamily: "var(--font-button)" }}>
                        {p.available ? "Available" : "Unavailable"}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex gap-1 flex-wrap">
                        {p.tags.slice(0, 2).map((t) => (
                          <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary" style={{ fontFamily: "var(--font-button)" }}>{t}</span>
                        ))}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted text-primary transition"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive transition"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </Td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-base pl-9 text-sm" />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider" style={{ fontFamily: "var(--font-button)" }}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 ${className}`}>{children}</td>;
}
