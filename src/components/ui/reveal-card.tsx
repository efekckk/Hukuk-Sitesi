"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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

    el.style.opacity = "0";
    el.style.transform = "translateY(56px) scale(0.96)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = (index % 3) * 80;
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0px) scale(1)";
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <Link
      ref={ref}
      href={href}
      className="reveal-card group relative overflow-hidden bg-[#222] flex flex-col justify-end"
      style={{ aspectRatio: "4/3" }}
    >
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04] grayscale-[50%] brightness-[0.4]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10" style={{ padding: "var(--space-xl)" }}>
        <h2
          className="font-serif font-light text-white leading-snug transition-colors duration-300 group-hover:text-[#b8975a]"
          style={{ fontSize: "var(--fs-xl)" }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="leading-relaxed text-white/45 line-clamp-3"
            style={{ fontSize: "var(--fs-sm)", marginTop: "var(--space-xs)" }}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
