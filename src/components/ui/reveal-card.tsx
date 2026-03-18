"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";

interface RevealCardProps {
  href: string;
  title: string;
  description?: string;
  image?: string | null;
  index: number;
}

export function RevealCard({ href, title, description, image, index }: RevealCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const col = index % 3;
    const staggerDelay = col * 80; // ms

    // Başlangıç state — görünmez
    el.style.opacity = "0";
    el.style.transform = "translateY(56px) scale(0.96)";

    // Lenis'in scroll eventini kullan — yoksa native scroll
    function check() {
      const rect = el!.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Element alt kenarı viewport'a girdiğinde tetikle
      if (rect.top < windowH - 60) {
        setTimeout(() => {
          el!.style.opacity = "1";
          el!.style.transform = "translateY(0px) scale(1)";
        }, staggerDelay);
        // Bir kez tetiklendi, temizle
        window.removeEventListener("scroll", check);
        document.removeEventListener("scroll", check);
        window.removeEventListener("lenis-scroll", check);
      }
    }

    // İlk render'da zaten görünüyorsa hemen aç
    check();

    // Lenis custom event + native scroll ikisini de dinle
    window.addEventListener("scroll", check, { passive: true });
    // Lenis scroll olayı için
    window.addEventListener("lenis-scroll", check, { passive: true });

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("lenis-scroll", check);
    };
  }, [index]);

  return (
    <Link
      ref={ref}
      href={href}
      className="reveal-card group relative aspect-square overflow-hidden bg-[#222] flex flex-col justify-end"
    >
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ filter: "grayscale(50%) brightness(0.4)" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10" style={{ padding: "var(--space-xl)" }}>
        <h2
          className="font-serif font-light text-white leading-snug transition-colors duration-300 group-hover:text-[#b8975a]"
          style={{ fontSize: "2.625rem" }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="leading-relaxed text-white/45 line-clamp-3"
            style={{ fontSize: "1.4375rem", marginTop: "var(--space-xs)" }}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
