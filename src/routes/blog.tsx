import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { SectionTitle } from "@/components/site/SectionTitle";
import catCookies from "@/assets/cat-cookies.jpg";
import catLoaf from "@/assets/cat-loaf.jpg";
import catBrownies from "@/assets/cat-brownies.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Healthy Living Journal — Shahad Bakes" },
      { name: "description", content: "Stories, recipes and tips for a healthier, sweeter life." },
      { property: "og:title", content: "Healthy Living Journal — Shahad Bakes" },
      { property: "og:description", content: "Reads on wellness, ingredients and the joy of mindful baking." },
    ],
  }),
  component: Blog,
});

const posts = [
  { title: "Why we said no to refined sugar — forever", excerpt: "The science, the alternatives, and what changed in our kitchen.", img: catCookies, tag: "Ingredients" },
  { title: "Banana oats cake: our most-asked-for recipe", excerpt: "A glimpse into how a bestseller is born.", img: catLoaf, tag: "Behind the Bake" },
  { title: "The brownie that actually loves you back", excerpt: "Whole wheat, dark cocoa, jaggery — the math that works.", img: catBrownies, tag: "Recipe Notes" },
];

function Blog() {
  return (
    <Shell>
      <section className="container-x py-20 md:py-28">
        <SectionTitle eyebrow="Journal" title={<>Stories from the <em className="not-italic text-primary">bakery.</em></>} sub="Slow reads on wellness, ingredients and the joy of mindful baking." />
        <div className="mt-12 grid md:grid-cols-3 gap-7">
          {posts.map((p) => (
            <Link key={p.title} to="/blog" className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img src={p.img} alt="" className="h-full w-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-primary mt-5" style={{ fontFamily: "var(--font-button)" }}>{p.tag}</div>
              <div className="mt-2 font-display text-2xl text-secondary leading-tight group-hover:text-primary transition">{p.title}</div>
              <p className="mt-2 text-sm text-foreground/70">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
