import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ArrowRight, Leaf, Sparkles, Wheat, Heart, Instagram, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import catCookies from "@/assets/cat-cookies.jpg";
import catLoaf from "@/assets/cat-loaf.jpg";
import catBrownies from "@/assets/cat-brownies.jpg";
import catCelebration from "@/assets/cat-celebration.jpg";
import catSavouries from "@/assets/cat-savouries.jpg";
import catGF from "@/assets/cat-glutenfree.jpg";
import gifting from "@/assets/gifting.jpg";
import { categories, products, WHATSAPP } from "@/lib/products";

const imgMap: Record<string, string> = {
  cookies: catCookies,
  loaf: catLoaf,
  brownies: catBrownies,
  celebration: catCelebration,
  savouries: catSavouries,
  glutenfree: catGF,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shahad Bakes — Healthy Sweetness Without Guilt" },
      { name: "description", content: "Freshly baked goodness made without sugar, flour or refined oils. Premium healthy bakery — cookies, cakes, brownies & celebration cakes." },
      { property: "og:title", content: "Shahad Bakes — Healthy Sweetness Without Guilt" },
      { property: "og:description", content: "Sugar-free · Flour-free · Refined-oil-free · 100% Freshly Baked" },
    ],
  }),
  component: Home,
});

const bestsellers = products.filter((p) => p.tags?.includes("Bestseller"));

function Home() {
  return (
    <Shell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="h-full w-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/55 to-secondary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative container-x py-28 md:py-44 lg:py-52">
          <div className="max-w-2xl text-[var(--cream)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--cream)]/30 bg-[var(--cream)]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] backdrop-blur" style={{ fontFamily: "var(--font-button)" }}>
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Premium Healthy Bakery
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] text-balance">
              Healthy Sweetness <em className="not-italic text-primary">Without Guilt.</em>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--cream)]/85 max-w-xl leading-relaxed">
              Freshly baked goodness made without sugar, flour, or refined oils. Artisan cookies, loaves, brownies and celebration cakes — crafted for health and happiness.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3" style={{ fontFamily: "var(--font-button)" }}>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition shadow-xl shadow-primary/25">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--cream)]/40 bg-transparent px-7 py-3.5 text-sm text-[var(--cream)] hover:bg-[var(--cream)]/10 transition">
                Order Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="border-y border-border bg-[var(--cream)]/40">
        <div className="container-x py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-secondary" style={{ fontFamily: "var(--font-button)" }}>
          <div className="flex items-center gap-2"><div className="flex text-primary">{[...Array(5)].map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div> Loved by health-conscious families</div>
          <Dot /> <span>No Sugar</span>
          <Dot /> <span>No Flour</span>
          <Dot /> <span>No Refined Oil</span>
          <Dot /> <span>100% Freshly Baked</span>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="container-x py-24 md:py-32">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <SectionTitle eyebrow="Shop By Category" title={<>A bakery built around <em className="not-italic text-primary">wellness.</em></>} />
          <Link to="/products" className="text-sm text-secondary hover:text-primary inline-flex items-center gap-2" style={{ fontFamily: "var(--font-button)" }}>
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
          {categories.map((c) => (
            <Link key={c.slug} to="/products" className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <img src={imgMap[c.image]} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-2xl mb-1">{c.icon}</div>
                <div className="font-display text-2xl md:text-3xl text-[var(--cream)]">{c.name}</div>
                <div className="text-sm text-[var(--cream)]/80 mt-1">{c.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[var(--cream)]/40 py-24 md:py-32 border-y border-border">
        <div className="container-x">
          <SectionTitle eyebrow="Bestsellers" title={<>Loved at every <em className="not-italic text-primary">first bite.</em></>} sub="The bakes our customers keep coming back for — wholesome ingredients, unforgettable flavour." />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {bestsellers.slice(0, 5).map((p, i) => (
              <div key={p.name} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl hover:shadow-secondary/5 hover:-translate-y-1 transition">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={[catCookies, catLoaf, catBrownies, catSavouries, catGF][i % 5]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-widest text-primary mb-1" style={{ fontFamily: "var(--font-button)" }}>Bestseller</div>
                  <div className="font-display text-lg leading-tight text-secondary">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SHAHAD */}
      <section className="container-x py-24 md:py-32">
        <SectionTitle center eyebrow="Why Shahad" title={<>Indulgence that <em className="not-italic text-primary">cares for you.</em></>} sub="Every bake is a small promise — clean, honest, freshly made." />
        <div className="mt-14 grid md:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "Health First", text: "No sugar, no maida, no refined oils — ever." },
            { icon: Leaf, title: "Clean Ingredients", text: "Whole grains, nuts, dates, honey, jaggery." },
            { icon: Wheat, title: "Fresh Daily", text: "Baked each morning in small batches." },
            { icon: Sparkles, title: "Crafted With Care", text: "Slow, artisanal baking methods." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-7 hover:border-primary/40 transition">
              <div className="h-12 w-12 rounded-full bg-[var(--cream)] grid place-items-center text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-xl text-secondary">{f.title}</div>
              <div className="mt-2 text-sm text-foreground/70 leading-relaxed">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CELEBRATION CAKES */}
      <section className="relative overflow-hidden">
        <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-24 md:py-32">
          <div className="grid grid-cols-2 gap-4">
            <img src={catCelebration} alt="Celebration cake" className="aspect-[3/4] object-cover rounded-2xl row-span-2" loading="lazy" />
            <img src={catLoaf} alt="" className="aspect-square object-cover rounded-2xl" loading="lazy" />
            <img src={catBrownies} alt="" className="aspect-square object-cover rounded-2xl" loading="lazy" />
          </div>
          <div>
            <SectionTitle eyebrow="Celebration Cakes" title={<>Make every moment <em className="not-italic text-primary">a sweet memory.</em></>} sub="Custom birthday, festive and theme cakes — crafted with sugar alternatives, whole grains and pure love. Pre-order 48 hours in advance." />
            <Link to="/celebration-cakes" className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-sm text-secondary-foreground hover:bg-secondary/90 transition" style={{ fontFamily: "var(--font-button)" }}>
              Design Your Cake <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary text-secondary-foreground py-24 md:py-32">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3" style={{ fontFamily: "var(--font-button)" }}>Customer Stories</div>
            <h2 className="font-display text-4xl md:text-5xl text-[var(--cream)] text-balance leading-[1.05]">Real families. Real reviews.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya M.", role: "Mom of two", text: "Finally a bakery I trust for my kids. The dates filled cookies disappear in a day!", rating: 5 },
              { name: "Arjun R.", role: "Fitness coach", text: "Sattu cookies are my go-to post-workout snack. Clean ingredients, real flavour.", rating: 5 },
              { name: "Neha K.", role: "Diabetic friendly", text: "Ordered a chocolate truffle for my dad's birthday — he couldn't believe it was sugar-free.", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-[var(--cream)]/5 border border-[var(--cream)]/10 p-7">
                <div className="flex text-primary mb-4">{[...Array(t.rating)].map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="text-[var(--cream)]/90 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 pt-5 border-t border-[var(--cream)]/10">
                  <div className="font-display text-lg text-[var(--cream)]">{t.name}</div>
                  <div className="text-xs text-[var(--cream)]/60">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORPORATE GIFTING */}
      <section className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <SectionTitle eyebrow="Corporate Gifting" title={<>Hampers that say <em className="not-italic text-primary">thank you, beautifully.</em></>} sub="Curated healthy gift boxes for festivals, employee wellness, client appreciation and weddings. Custom branding available." />
            <div className="mt-8 flex flex-wrap gap-3" style={{ fontFamily: "var(--font-button)" }}>
              <Link to="/corporate-gifting" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm text-primary-foreground hover:bg-primary/90 transition">
                Explore Hampers <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/bulk-orders" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm text-secondary hover:bg-muted transition">
                Bulk Orders
              </Link>
            </div>
          </div>
          <img src={gifting} alt="Healthy gift hamper" className="aspect-[4/3] object-cover rounded-2xl" loading="lazy" />
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-[var(--cream)]/40 border-t border-border py-20">
        <div className="container-x text-center">
          <Instagram className="h-6 w-6 text-primary mx-auto" />
          <div className="mt-3 font-display text-3xl text-secondary">@shahad_bakes</div>
          <p className="text-sm text-foreground/70 mt-1">Follow us for daily bakes, recipes & behind-the-scenes</p>
          <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {[catCookies, catLoaf, catBrownies, catCelebration, catSavouries, catGF].map((s, i) => (
              <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-xl group">
                <img src={s} alt="" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Dot() { return <span className="inline-block h-1 w-1 rounded-full bg-primary/60" />; }
