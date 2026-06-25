import type { Product } from "@/lib/firebase/db";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { categories } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const catName = categories.find((c) => c.slug === product.category)?.name ?? "Delights";

  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl hover:shadow-secondary/5 hover:-translate-y-1 transition duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
          loading="lazy"
        />
        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary px-2.5 py-1 text-[10px] uppercase tracking-wider text-primary-foreground"
                style={{ fontFamily: "var(--font-button)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
            <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground" style={{ fontFamily: "var(--font-button)" }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-widest text-primary/80 mb-1" style={{ fontFamily: "var(--font-button)" }}>
          {catName}
        </div>
        <h3 className="font-display text-lg leading-tight text-secondary flex-1">{product.name}</h3>
        {product.description && (
          <p className="mt-1.5 text-xs text-foreground/60 line-clamp-2 leading-relaxed">{product.description}</p>
        )}

        {/* Price + Cart */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-secondary">
              ₹{(product.discountPrice ?? product.price).toFixed(0)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-foreground/50 line-through">₹{product.price.toFixed(0)}</span>
            )}
          </div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </div>
  );
}
