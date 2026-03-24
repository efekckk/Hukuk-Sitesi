interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative bg-[#0a0a0a] overflow-hidden flex items-end"
      style={{ minHeight: "clamp(10rem, 18vw, 22rem)" }}
    >
      {backgroundImage && (
        <>
          <div className="absolute inset-0" aria-hidden="true">
            <img src={backgroundImage} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(60%) brightness(0.35)" }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-[#0a0a0a]" />}
      <div className="relative z-10 mx-auto max-w-7xl w-full" style={{ padding: "0 var(--section-px) var(--space-lg)" }}>
        <h1 className="font-serif font-light tracking-tight text-white" style={{ fontSize: "var(--fs-3xl)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="tracking-widest uppercase text-white/40" style={{ fontSize: "var(--fs-micro)", marginTop: "var(--space-xs)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
