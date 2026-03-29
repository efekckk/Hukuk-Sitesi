"use client";

import { useState } from "react";

interface GoogleMapProps {
  embedUrl?: string;
  className?: string;
}

export function GoogleMap({ embedUrl, className = "" }: GoogleMapProps) {
  const [active, setActive] = useState(false);

  const url =
    embedUrl ||
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1264.8024832187223!2d28.987225782511512!3d41.06409113978253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7232a06a9c7%3A0x17f8412d21270583!2sAEB%20Hukuk!5e0!3m2!1str!2str!4v1773399491463!5m2!1str!2str";

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden ${className}`}
      onMouseLeave={() => setActive(false)}
      style={{ filter: "grayscale(80%) contrast(1.1)" }}
    >
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ofis Konumu"
      />

      {/* Üst kısım — uydu/harita butonlarını ve Google logosunu gizle */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#e8e6e2] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#e8e6e2] to-transparent pointer-events-none" />

      {/* Tıklanmadan harita scroll'u yakalamamalı */}
      {!active && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setActive(true)}
        />
      )}
    </div>
  );
}
