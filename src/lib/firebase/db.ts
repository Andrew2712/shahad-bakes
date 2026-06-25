import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  limit,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";

// ────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  tags: string[];       // e.g. ["Bestseller", "New", "High Protein"]
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  updatedAt: Timestamp;
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
  invoiceUrl?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  pdfUrl?: string;
  createdAt: Timestamp;
}

// ────────────────────────────────────────────────────────────
// COLLECTION REFERENCES
// ────────────────────────────────────────────────────────────

export const usersCol = collection(db, "users");
export const productsCol = collection(db, "products");
export const cartsCol = collection(db, "carts");
export const ordersCol = collection(db, "orders");
export const invoicesCol = collection(db, "invoices");

// ────────────────────────────────────────────────────────────
// USER HELPERS
// ────────────────────────────────────────────────────────────

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  const ref = doc(usersCol, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      ...data,
      uid,
      role: "customer",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(usersCol, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(usersCol, uid), { ...data, updatedAt: serverTimestamp() });
}

// ────────────────────────────────────────────────────────────
// PRODUCT HELPERS
// ────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const snap = await getDocs(query(productsCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const snap = await getDocs(
    query(productsCol, where("category", "==", category), where("available", "==", true))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(productsCol, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return addDoc(productsCol, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(productsCol, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(productsCol, id));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const snap = await getDocs(
    query(productsCol, where("featured", "==", true), where("available", "==", true), limit(5))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

// ────────────────────────────────────────────────────────────
// CART HELPERS
// ────────────────────────────────────────────────────────────

export async function getCart(userId: string): Promise<Cart | null> {
  const snap = await getDoc(doc(cartsCol, userId));
  return snap.exists() ? (snap.data() as Cart) : null;
}

export async function saveCart(userId: string, items: CartItem[]) {
  await setDoc(doc(cartsCol, userId), {
    userId,
    items,
    updatedAt: serverTimestamp(),
  });
}

export async function clearCart(userId: string) {
  await setDoc(doc(cartsCol, userId), { userId, items: [], updatedAt: serverTimestamp() });
}

// ────────────────────────────────────────────────────────────
// ORDER HELPERS
// ────────────────────────────────────────────────────────────

export async function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(ordersCol, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(ordersCol, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const snap = await getDocs(
    query(ordersCol, where("userId", "==", userId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(): Promise<Order[]> {
  const snap = await getDocs(query(ordersCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(ordersCol, id), { status, updatedAt: serverTimestamp() });
}

// ────────────────────────────────────────────────────────────
// INVOICE HELPERS
// ────────────────────────────────────────────────────────────

export async function createInvoice(data: Omit<Invoice, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(invoicesCol, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const snap = await getDoc(doc(invoicesCol, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Invoice) : null;
}

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const snap = await getDocs(
    query(invoicesCol, where("userId", "==", userId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
}

export async function getAllInvoices(): Promise<Invoice[]> {
  const snap = await getDocs(query(invoicesCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
}

// ────────────────────────────────────────────────────────────
// ADMIN HELPERS
// ────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(query(usersCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function getRecentOrders(n = 10): Promise<Order[]> {
  const snap = await getDocs(query(ordersCol, orderBy("createdAt", "desc"), limit(n)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SB-${yy}${mm}-${rand}`;
}

// ────────────────────────────────────────────────────────────
// SEED — static products from prototype into Firestore
// Call once from admin dashboard
// ────────────────────────────────────────────────────────────

import { products as staticProducts } from "../products";

export async function seedProductsToFirestore(imageBaseUrl = "") {
  const catImageMap: Record<string, string> = {
    cookies: `${imageBaseUrl}/cat-cookies.jpg`,
    "gluten-free": `${imageBaseUrl}/cat-glutenfree.jpg`,
    savouries: `${imageBaseUrl}/cat-savouries.jpg`,
    "loaf-cakes": `${imageBaseUrl}/cat-loaf.jpg`,
    brownies: `${imageBaseUrl}/cat-brownies.jpg`,
    "celebration-cakes": `${imageBaseUrl}/cat-celebration.jpg`,
    delights: `${imageBaseUrl}/cat-loaf.jpg`,
  };

  for (const p of staticProducts) {
    await addDoc(productsCol, {
      name: p.name,
      category: p.category,
      description: `Artisan ${p.name} by Shahad Bakes — sugar-free, flour-free, refined-oil-free.`,
      ingredients: "Natural whole ingredients. Ask us for the full list.",
      price: 299,
      discountPrice: undefined,
      imageUrl: catImageMap[p.category] ?? "",
      available: true,
      tags: p.tags ?? [],
      featured: p.tags?.includes("Bestseller") ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
