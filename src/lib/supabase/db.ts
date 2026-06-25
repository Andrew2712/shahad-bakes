import { supabase } from "./config";

// ────────────────────────────────────────────────────────────
// TYPE DEFINITIONS  (mirror the Firebase types exactly so the
// rest of the codebase needs zero changes)
// ────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  photoURL?: string;
  role: "customer" | "admin";
  createdAt: { toDate: () => Date };
  updatedAt: { toDate: () => Date };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  available: boolean;
  tags: string[];
  featured: boolean;
  createdAt: { toDate: () => Date };
  updatedAt: { toDate: () => Date };
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: { toDate: () => Date };
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  invoiceId?: string;
  notes?: string;
  createdAt: { toDate: () => Date };
  updatedAt: { toDate: () => Date };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  createdAt: { toDate: () => Date };
}

// ── Helper: wrap ISO string into Firestore-compatible object ──
function ts(isoString: string | null) {
  const d = isoString ? new Date(isoString) : new Date();
  return { toDate: () => d };
}

function rowToUserProfile(row: any): UserProfile {
  return {
    uid: row.uid,
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    pincode: row.pincode ?? undefined,
    photoURL: row.photo_url ?? undefined,
    role: row.role ?? "customer",
    createdAt: ts(row.created_at),
    updatedAt: ts(row.updated_at),
  };
}

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description ?? "",
    ingredients: row.ingredients ?? "",
    price: row.price,
    discountPrice: row.discount_price ?? undefined,
    imageUrl: row.image_url ?? "",
    available: row.available ?? true,
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    createdAt: ts(row.created_at),
    updatedAt: ts(row.updated_at),
  };
}

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    city: row.city,
    pincode: row.pincode,
    items: row.items ?? [],
    subtotal: row.subtotal,
    tax: row.tax,
    deliveryCharge: row.delivery_charge,
    discount: row.discount,
    total: row.total,
    status: row.status,
    invoiceId: row.invoice_id ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: ts(row.created_at),
    updatedAt: ts(row.updated_at),
  };
}

function rowToInvoice(row: any): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    orderId: row.order_id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    items: row.items ?? [],
    subtotal: row.subtotal,
    tax: row.tax,
    deliveryCharge: row.delivery_charge,
    discount: row.discount,
    total: row.total,
    createdAt: ts(row.created_at),
  };
}

// ────────────────────────────────────────────────────────────
// USER HELPERS
// ────────────────────────────────────────────────────────────

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  const { error } = await supabase.from("users").upsert(
    {
      uid,
      name: data.name ?? "",
      email: data.email ?? "",
      photo_url: data.photoURL ?? null,
      role: "customer",
    },
    { onConflict: "uid", ignoreDuplicates: true }
  );
  if (error) console.error("createUserProfile:", error.message);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("users").select("*").eq("uid", uid).single();
  if (error || !data) return null;
  return rowToUserProfile(data);
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  const { error } = await supabase.from("users").update({
    name: updates.name,
    phone: updates.phone ?? null,
    address: updates.address ?? null,
    city: updates.city ?? null,
    pincode: updates.pincode ?? null,
    updated_at: new Date().toISOString(),
  }).eq("uid", uid);
  if (error) throw new Error(error.message);
}

// ────────────────────────────────────────────────────────────
// PRODUCT HELPERS
// ────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").eq("category", category).eq("available", true);
  return (data ?? []).map(rowToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data ? rowToProduct(data) : null;
}

export async function addProduct(p: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const { error } = await supabase.from("products").insert({
    name: p.name,
    category: p.category,
    description: p.description,
    ingredients: p.ingredients,
    price: p.price,
    discount_price: p.discountPrice ?? null,
    image_url: p.imageUrl,
    available: p.available,
    tags: p.tags,
    featured: p.featured,
  });
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, p: Partial<Product>) {
  const { error } = await supabase.from("products").update({
    name: p.name,
    category: p.category,
    description: p.description,
    ingredients: p.ingredients,
    price: p.price,
    discount_price: p.discountPrice ?? null,
    image_url: p.imageUrl,
    available: p.available,
    tags: p.tags,
    featured: p.featured,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").eq("featured", true).eq("available", true).limit(6);
  return (data ?? []).map(rowToProduct);
}

// ────────────────────────────────────────────────────────────
// CART HELPERS
// ────────────────────────────────────────────────────────────

export async function getCart(userId: string): Promise<Cart | null> {
  const { data } = await supabase.from("carts").select("*").eq("user_id", userId).single();
  if (!data) return null;
  return { userId, items: data.items ?? [], updatedAt: ts(data.updated_at) };
}

export async function saveCart(userId: string, items: CartItem[]) {
  await supabase.from("carts").upsert(
    { user_id: userId, items, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
}

export async function clearCart(userId: string) {
  await supabase.from("carts").upsert(
    { user_id: userId, items: [], updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
}

// ────────────────────────────────────────────────────────────
// ORDER HELPERS
// ────────────────────────────────────────────────────────────

export async function createOrder(o: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const { data, error } = await supabase.from("orders").insert({
    user_id: o.userId,
    customer_name: o.customerName,
    customer_email: o.customerEmail,
    customer_phone: o.customerPhone,
    delivery_address: o.deliveryAddress,
    city: o.city,
    pincode: o.pincode,
    items: o.items,
    subtotal: o.subtotal,
    tax: o.tax,
    delivery_charge: o.deliveryCharge,
    discount: o.discount,
    total: o.total,
    status: o.status,
    notes: o.notes ?? null,
  }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data } = await supabase.from("orders").select("*").eq("id", id).single();
  return data ? rowToOrder(data) : null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return (data ?? []).map(rowToOrder);
}

export async function getAllOrders(): Promise<Order[]> {
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(rowToOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

// ────────────────────────────────────────────────────────────
// INVOICE HELPERS
// ────────────────────────────────────────────────────────────

export async function createInvoice(inv: Omit<Invoice, "id" | "createdAt">): Promise<string> {
  const { data, error } = await supabase.from("invoices").insert({
    invoice_number: inv.invoiceNumber,
    order_id: inv.orderId,
    user_id: inv.userId,
    customer_name: inv.customerName,
    customer_email: inv.customerEmail,
    customer_phone: inv.customerPhone,
    delivery_address: inv.deliveryAddress,
    items: inv.items,
    subtotal: inv.subtotal,
    tax: inv.tax,
    delivery_charge: inv.deliveryCharge,
    discount: inv.discount,
    total: inv.total,
  }).select("id").single();
  if (error) throw new Error(error.message);

  // Link invoice to order
  await supabase.from("orders").update({ invoice_id: data.id }).eq("id", inv.orderId);

  return data.id;
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const { data } = await supabase.from("invoices").select("*").eq("id", id).single();
  return data ? rowToInvoice(data) : null;
}

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const { data } = await supabase.from("invoices").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return (data ?? []).map(rowToInvoice);
}

export async function getAllInvoices(): Promise<Invoice[]> {
  const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(rowToInvoice);
}

// ────────────────────────────────────────────────────────────
// ADMIN HELPERS
// ────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<UserProfile[]> {
  const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  return (data ?? []).map(rowToUserProfile);
}

export async function getRecentOrders(n = 10): Promise<Order[]> {
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(n);
  return (data ?? []).map(rowToOrder);
}

// ────────────────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────────────────

export function generateInvoiceNumber(): string {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SB-${yy}${mm}-${rand}`;
}
