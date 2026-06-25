import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import { categories, products as staticProducts } from "@/lib/products";
import { getAllProducts, type Product } from "@/lib/firebase/db";
import { ProductCard } from "@/components/cart/ProductCard";
import catCookies from "@/assets/cat-cookies.jpg";
import catLoaf from "@/assets/cat-loaf.jpg";
import catBrownies from "@/assets/cat-brownies.jpg";
import catCelebration from "@/assets/cat-celebration.jpg";
import catSavouries from "@/assets/cat-savouries.jpg";
import catGF from "@/assets/cat-glutenfree.jpg";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";

const imgFor = (cat: string) => {
  switch (cat) {
    case "cookies": return catCookies;
    case "loaf-cakes": return catLoaf;
    case "brownies": return catBrownies;
    case "celebration-cakes": return catCelebration;
    case "savouries": return catSavouries;
    case "gluten-free": return catGF;
    default: return catLoaf;
  }
};

// Fallback static-to-Product adapter
function toFirestoreProducts(staticList: typeof staticProducts): Product[] {
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }));
}

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Shahad Bakes" },
      { name: "description", content: "Browse 50+ healthy bakes: cookies, gluten-free, savouries, loaf cakes, brownies and celebration cakes." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [active, setActive] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((firestoreProducts) => {
        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        } else {
          // Firestore empty — use static fallback
          setProducts(toFirestoreProducts(staticProducts));
        }
      })
      .catch(() => setProducts(toFirestoreProducts(staticProducts)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <Shell>
      <section className="bg-[var(--cream)]/40 border-b border-border">
        <div className="container-x py-16 md:py-24">
          <SectionTitle
            eyebrow="Our Bakes"
            title={<>The full Shahad <em className="not-italic text-primary">collection.</em></>}
            sub="Every product is sugar-free, flour-free and refined-oil-free. Filter by category below."
          />
        </div>
      </section>

      {/* Category filter chips */}
      <section className="container-x py-6 sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur border-b border-border/50">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ fontFamily: "var(--font-button)" }}>
          <Chip active={active === "all"} onClick={() => setActive("all")}>All</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={active === c.slug} onClick={() => setActive(c.slug)}>
              {c.icon} {c.name}
            </Chip>
          ))}
          <Chip active={active === "delights"} onClick={() => setActive("delights")}>✨ Delights</Chip>
        </div>
      </section>

      {/* Product grid */}
      <section className="container-x py-10 md:py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-foreground/50">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-wider transition ${
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "border border-border bg-background hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
