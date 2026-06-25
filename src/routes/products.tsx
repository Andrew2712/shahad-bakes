import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import { categories, products as staticProducts } from "@/lib/products";
import { getAllProducts, type Product } from "@/lib/supabase/db";
import { ProductCard } from "@/components/cart/ProductCard";
import catCookies from "@/assets/cat-cookies.jpg";
import catLoaf from "@/assets/cat-loaf.jpg";
import catBrownies from "@/assets/cat-brownies.jpg";
import catCelebration from "@/assets/cat-celebration.jpg";
import catSavouries from "@/assets/cat-savouries.jpg";
import catGF from "@/assets/cat-glutenfree.jpg";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const imgFor = (cat: string) => {
  switch (cat) {
    case "cookies":           return catCookies;
    case "loaf-cakes":        return catLoaf;
    case "brownies":          return catBrownies;
    case "celebration-cakes": return catCelebration;
    case "savouries":         return catSavouries;
    case "gluten-free":       return catGF;
    case "delights":          return catLoaf;
    default:                  return catCookies;
  }
};

function toProductList(staticList: typeof staticProducts): Product[] {
  return staticList.map((p, idx) => ({
    id: `static-${idx}`,
    name: p.name,
    category: p.category,
    description: `Artisan ${p.name} by Shahad Bakes — sugar-free, flour-free, refined-oil-free.`,
    ingredients: "Natural whole ingredients. Contact us for the full list.",
    price: 299,
    discountPrice: undefined,
    imageUrl: imgFor(p.category),
    available: true,
    tags: p.tags ?? [],
    featured: p.tags?.includes("Bestseller") ?? false,
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() },
  }));
}

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Shahad Bakes" },
      { name: "description", content: "Browse 50+ healthy bakes: cookies, gluten-free, savouries, loaf cakes, brownies, delights and celebration cakes." },
      { property: "og:title", content: "Products — Shahad Bakes" },
      { property: "og:description", content: "Sugar-free · Flour-free · Refined-oil-free artisanal bakes." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [active, setActive]     = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((dbProducts) => {
        if (dbProducts.length > 0) {
          const enriched = dbProducts
            .map((p) => ({
              ...p,
              imageUrl: p.imageUrl && p.imageUrl.trim() !== "" ? p.imageUrl : imgFor(p.category),
            }))
            .sort((a, b) => a.price - b.price);
          setProducts(enriched);
        } else {
          setProducts(toProductList(staticProducts).sort((a, b) => a.price - b.price));
        }
      })
      .catch(() => {
        setError(true);
        setProducts(toProductList(staticProducts).sort((a, b) => a.price - b.price));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <Shell>
      {/* Hero */}
      <section className="bg-[var(--cream)]/40 border-b border-border">
        <div className="container-x py-16 md:py-24">
          <SectionTitle
            eyebrow="Our Bakes"
            title={
              <>
                The full Shahad{" "}
                <em className="not-italic text-primary">collection.</em>
              </>
            }
            sub="Every product is sugar-free, flour-free and refined-oil-free. Tap a category to filter."
          />
        </div>
      </section>

      {/* Category filter chips */}
      <section className="container-x py-6 sticky top-16 md:top-20 z-30 bg-background/85 backdrop-blur border-b border-border/50">
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          style={{ fontFamily: "var(--font-button)" }}
        >
          <Chip active={active === "all"} onClick={() => setActive("all")}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.slug}
              active={active === c.slug}
              onClick={() => setActive(c.slug)}
            >
              {c.icon} {c.name}
            </Chip>
          ))}
          <Chip
            active={active === "delights"}
            onClick={() => setActive("delights")}
          >
            ✨ Delights
          </Chip>
        </div>
      </section>

      {/* Product grid */}
      <section className="container-x pb-24 py-10 md:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-foreground/50" style={{ fontFamily: "var(--font-button)" }}>
              Loading bakes…
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-foreground/50 text-sm">
            Couldn't reach the server — showing offline catalogue.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-foreground/60">
            No products in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition ${
        active
          ? "bg-secondary text-secondary-foreground border-secondary"
          : "border-border text-foreground/70 hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}