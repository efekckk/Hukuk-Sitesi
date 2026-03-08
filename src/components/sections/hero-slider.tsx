"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const AUTO_PLAY_INTERVAL = 6000;

/* ─── Data types ─── */
interface SlideData {
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  secondaryCtaIsExternal?: boolean;
}

interface HeroSliderProps {
  slides?: SlideData[];
  tickerItems?: string[];
}

const fallbackLinks: { cta: string; secondaryCta?: string }[] = [
  { cta: "/hakkimizda", secondaryCta: "/uzmanlik-alanlari" },
  { cta: "/uzmanlik-alanlari" },
  { cta: "/iletisim", secondaryCta: "tel:+902121234567" },
];

export function HeroSlider({ slides: propSlides, tickerItems }: HeroSliderProps) {
  const t = useTranslations("heroSlider");
  const [current, setCurrent] = useState(0);

  /* ─── Museum spotlight cursor ─── */
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSpringX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const cursorSpringY = useSpring(cursorY, { damping: 25, stiffness: 200 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      e.currentTarget.style.setProperty("--spotlight-x", `${x}px`);
      e.currentTarget.style.setProperty("--spotlight-y", `${y}px`);
      cursorX.set(x);
      cursorY.set(y);
    },
    [cursorX, cursorY]
  );

  const handleMouseEnter = useCallback(() => setCursorVisible(true), []);
  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setCursorVisible(false);
      e.currentTarget.style.setProperty("--spotlight-x", "-500px");
      e.currentTarget.style.setProperty("--spotlight-y", "-500px");
    },
    []
  );

  const useDbSlides = propSlides && propSlides.length > 0;
  const slideCount = useDbSlides ? propSlides.length : 3;

  const getSlide = (index: number): SlideData => {
    if (useDbSlides) return propSlides[index];
    return {
      tagline: t(`slides.${index}.tagline`),
      title: t(`slides.${index}.title`),
      subtitle: t(`slides.${index}.subtitle`),
      ctaText: t(`slides.${index}.cta`),
      ctaLink: fallbackLinks[index].cta,
      secondaryCtaText: fallbackLinks[index].secondaryCta
        ? t(`slides.${index}.secondaryCta`)
        : undefined,
      secondaryCtaLink: fallbackLinks[index].secondaryCta,
      secondaryCtaIsExternal: index === 2,
    };
  };

  /* ─── Auto-play ─── */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [slideCount]);

  const slide = getSlide(current);

  const defaultTicker = [
    "Ticaret Hukuku", "Ceza Hukuku", "İş Hukuku",
    "Aile Hukuku", "İdare Hukuku", "Gayrimenkul Hukuku",
  ];
  const ticker = tickerItems && tickerItems.length > 0 ? tickerItems : defaultTicker;

  return (
    <section
      className="relative h-screen w-full flex flex-col overflow-hidden bg-black md:cursor-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ============================================================
          1. VIDEO KATMANI — mix-blend-screen ile karanlıktan doğuyor
          ============================================================ */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.55] mix-blend-screen"
      >
        <source src="/videos/hero-loop.webm" type="video/webm" />
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* ============================================================
          2. ATMOSFER KATMANLARI — Vignette & karanlık kenarlar
          ============================================================ */}
      {/* Sol-sağ siyah kenar — içerik alanını yalıtır */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-[1]" />
      {/* Alt siyah — ticker'a doğru erime */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-[1]" />
      {/* Üst hafif karartma */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-[1]" />

      {/* ============================================================
          3. SPOTLIGHT — Cursor takipli sıcak ışık
          ============================================================ */}
      {/* Warm glow — overlay blend ile heykeli parlatır */}
      <div
        className="absolute inset-0 hidden md:block pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 500px 650px at var(--spotlight-x, -500px) var(--spotlight-y, -500px), rgba(255,240,215,0.12) 0%, rgba(255,220,180,0.05) 30%, transparent 60%)",
          mixBlendMode: "overlay",
        }}
      />
      {/* Color-dodge — en parlak noktaları vurgular */}
      <div
        className="absolute inset-0 hidden md:block pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 350px 450px at var(--spotlight-x, -500px) var(--spotlight-y, -500px), rgba(255,245,230,0.06) 0%, transparent 50%)",
          mixBlendMode: "color-dodge",
        }}
      />

      {/* ============================================================
          4. VERTICAL GRID LINES
          ============================================================ */}
      <div className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true">
        <div className="h-full max-w-7xl mx-auto flex justify-between px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-px h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
            />
          ))}
        </div>
      </div>

      {/* ============================================================
          5. MUSEUM DUST — yavaşça süzülen tozlar
          ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${1 + (i % 3) * 0.5}px`,
              height: `${1 + (i % 3) * 0.5}px`,
              left: `${(i * 5.1) % 100}%`,
              top: `${(i * 7.3) % 100}%`,
              backgroundColor: i % 5 === 0
                ? "rgba(182, 140, 90, 0.2)"
                : "rgba(255, 255, 255, 0.1)",
              animation: `dust-drift ${18 + (i % 6) * 5}s linear infinite`,
              animationDelay: `${(i * 2.7) % 20}s`,
            }}
          />
        ))}
      </div>

      {/* ============================================================
          6. GOLD PARTICLES — yükselen altın parçacıklar
          ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-brand-400/30"
            style={{
              left: `${10 + ((i * 11.3) % 80)}%`,
              bottom: `${10 + ((i * 17) % 50)}%`,
              animation: `particle-float ${12 + (i % 4) * 3}s ease-in-out infinite`,
              animationDelay: `${(i * 2.1) % 10}s`,
            }}
          />
        ))}
      </div>

      {/* ============================================================
          7. CUSTOM CURSOR — museum light dot
          ============================================================ */}
      <motion.div
        className="absolute pointer-events-none z-50 hidden md:block"
        style={{
          left: cursorSpringX,
          top: cursorSpringY,
          x: "-50%",
          y: "-50%",
          opacity: cursorVisible ? 1 : 0,
        }}
      >
        <div
          className="absolute -inset-6 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)",
          }}
        />
        <div className="w-5 h-5 rounded-full bg-white/90 mix-blend-difference" />
      </motion.div>

      {/* ============================================================
          8. İÇERİK — Slider text + CTA
          ============================================================ */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {/* Tagline */}
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                >
                  <div className="w-12 h-px bg-gradient-to-r from-brand-400/80 to-transparent" />
                  <span className="text-xs font-light tracking-[0.35em] uppercase text-brand-400/80">
                    {slide.tagline}
                  </span>
                </motion.div>

                {/* Title — serif, light, wide tracking */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-light text-slate-200 mb-8 leading-[1.1] tracking-wide uppercase drop-shadow-2xl">
                  {slide.title.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.3em]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.25 + i * 0.12,
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>

                {/* Gold divider */}
                <div className="flex mb-8">
                  <motion.div
                    className="h-px bg-gradient-to-r from-brand-400/60 via-brand-300/30 to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 1.2 }}
                  />
                </div>

                {/* Subtitle */}
                <motion.p
                  className="text-base md:text-lg font-light text-slate-400 mb-12 max-w-xl leading-relaxed tracking-wide border-l-2 border-brand-400/30 pl-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTA buttons — minimalist */}
                <motion.div
                  className="flex flex-wrap items-center gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {slide.secondaryCtaIsExternal ? (
                    <a
                      href={slide.ctaLink}
                      className={cn(
                        "group inline-flex items-center justify-center gap-2.5",
                        "border border-brand-400/40 text-brand-400 font-light",
                        "h-12 px-8 text-sm tracking-[0.2em] uppercase",
                        "hover:bg-brand-400 hover:text-black transition-all duration-500"
                      )}
                    >
                      {slide.ctaText}
                      <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-500" />
                    </a>
                  ) : (
                    <Link
                      href={slide.ctaLink}
                      className={cn(
                        "group inline-flex items-center justify-center gap-2.5",
                        "border border-brand-400/40 text-brand-400 font-light",
                        "h-12 px-8 text-sm tracking-[0.2em] uppercase",
                        "hover:bg-brand-400 hover:text-black transition-all duration-500"
                      )}
                    >
                      {slide.ctaText}
                      <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-500" />
                    </Link>
                  )}
                  {slide.secondaryCtaText && slide.secondaryCtaLink && (
                    slide.secondaryCtaIsExternal ? (
                      <a
                        href={slide.secondaryCtaLink}
                        className={cn(
                          "group inline-flex items-center justify-center gap-2.5",
                          "text-slate-400 font-light",
                          "text-sm tracking-[0.12em] uppercase",
                          "hover:text-slate-200 transition-all duration-500",
                          "border-b border-slate-700 pb-1 hover:border-slate-400"
                        )}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {slide.secondaryCtaText}
                      </a>
                    ) : (
                      <Link
                        href={slide.secondaryCtaLink}
                        className={cn(
                          "group inline-flex items-center justify-center gap-2.5",
                          "text-slate-400 font-light",
                          "text-sm tracking-[0.12em] uppercase",
                          "hover:text-slate-200 transition-all duration-500",
                          "border-b border-slate-700 pb-1 hover:border-slate-400"
                        )}
                      >
                        {slide.secondaryCtaText}
                      </Link>
                    )
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators */}
            {slideCount > 1 && (
              <div className="flex items-center gap-3 mt-14">
                {Array.from({ length: slideCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={cn(
                      "transition-all duration-500",
                      current === i
                        ? "w-8 h-px bg-slate-300"
                        : "w-4 h-px bg-white/15 hover:bg-white/30"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          9. NEWS TICKER
          ============================================================ */}
      <div className="relative z-10 border-t border-white/[0.04] bg-black/80 backdrop-blur-sm py-3">
        <Marquee pauseOnHover className="[--duration:30s] [--gap:0rem]">
          {ticker.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-6 text-sm text-white/40 font-medium tracking-wide uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400/50 mr-3" />
              {item}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
