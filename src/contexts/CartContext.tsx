import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { type CartItem, getCart, saveCart, clearCart } from "@/lib/supabase/db";
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
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load cart on auth change
  useEffect(() => {
    if (user) {
      getCart(user.id)
        .then((cart) => {
          if (cart?.items && cart.items.length > 0) {
            setItems(cart.items);
          } else {
            // Migrate guest cart to user cart on login
            const stored = sessionStorage.getItem("shahad_cart");
            if (stored) {
              const guestItems = JSON.parse(stored) as CartItem[];
              setItems(guestItems);
              sessionStorage.removeItem("shahad_cart");
            }
          }
        })
        .catch(console.error);
    } else {
      const stored = sessionStorage.getItem("shahad_cart");
      if (stored) {
        try { setItems(JSON.parse(stored)); } catch { setItems([]); }
      }
    }
  }, [user?.id]);

  // Debounced persist — don't hammer DB on every keystroke
  useEffect(() => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      if (user) {
        saveCart(user.id, items).catch(console.error);
      } else {
        sessionStorage.setItem("shahad_cart", JSON.stringify(items));
      }
    }, 600);
    return () => { if (syncTimeout.current) clearTimeout(syncTimeout.current); };
  }, [items, user?.id]);

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
    if (user) await clearCart(user.id).catch(console.error);
    else sessionStorage.removeItem("shahad_cart");
  }, [user?.id]);

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
