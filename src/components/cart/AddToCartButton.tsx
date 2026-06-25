import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/lib/firebase/db";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

export function AddToCartButton({ product, className = "", compact = false }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!product.available}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition font-medium ${
        compact
          ? "px-3 py-1.5 text-xs"
          : "px-5 py-2.5 text-sm"
      } ${
        added
          ? "bg-green-600 text-white"
          : product.available
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-muted text-muted-foreground cursor-not-allowed"
      } ${className}`}
      style={{ fontFamily: "var(--font-button)" }}
    >
      {added ? (
        <>
          <Check className={compact ? "h-3 w-3" : "h-4 w-4"} />
          {!compact && "Added!"}
        </>
      ) : (
        <>
          <ShoppingBag className={compact ? "h-3 w-3" : "h-4 w-4"} />
          {product.available ? (compact ? "Add" : "Add to Cart") : "Unavailable"}
        </>
      )}
    </button>
  );
}
