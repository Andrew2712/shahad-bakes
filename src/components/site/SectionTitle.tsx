import type { ReactNode } from "react";

export function SectionTitle({ eyebrow, title, sub, center }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3" style={{ fontFamily: "var(--font-button)" }}>
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-secondary text-balance leading-[1.05]">{title}</h2>
      {sub && <p className="mt-4 text-foreground/70 leading-relaxed">{sub}</p>}
    </div>
  );
}
