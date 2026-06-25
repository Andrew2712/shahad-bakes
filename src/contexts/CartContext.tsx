import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type CartItem, getCart, saveCart, clearCart } from "@/lib/firebase/db";
import { useAuth } from "./AuthContext";

const TAX_RATE = 0.05;
const DELIVERY_CHARGE = 60;
const FREE_DELIVERY_ABOVE = 799;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearAll: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue>({} as CartContextValue);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (user) {
      getCart(user.uid).then((cart) => {
        if (cart?.items) setItems(cart.items);
      });
    } else {
      // Guest cart from sessionStorage
      const stored = sessionStorage.getItem("shahad_cart");
      if (stored) setItems(JSON.parse(stored));
    }
  }, [user]);

  // Persist cart
  useEffect(() => {
    if (user) {
      saveCart(user.uid, items);
    } else {
      sessionStorage.setItem("shahad_cart", JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === newItem.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === newItem.productId
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearAll = useCallback(async () => {
    setItems([]);
    if (user) await clearCart(user.uid);
    else sessionStorage.removeItem("shahad_cart");
  }, [user]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryCharge = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  const total = subtotal + tax + deliveryCharge;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        tax,
        deliveryCharge,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearAll,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
