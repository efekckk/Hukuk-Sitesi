interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative bg-[#0a0a0a] text-white py-20 overflow-hidden">
      {/* Background image with overlay */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(85%) contrast(1.3) brightness(0.35)", mixBlendMode: "lighten" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]/40" />
        </>
      )}
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
