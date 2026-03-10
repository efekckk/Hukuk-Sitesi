interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative h-64 md:h-80 bg-[#0a0a0a] overflow-hidden flex items-end">
      {backgroundImage && (
        <>
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(60%) brightness(0.35)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-[#0a0a0a]" />
      )}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-8 pb-10">
        <h1 className="font-serif text-4xl font-light tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm tracking-widest uppercase text-white/40">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
