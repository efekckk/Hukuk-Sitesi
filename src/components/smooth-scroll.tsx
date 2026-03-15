"use client";

import { ReactLenis, useLenis } from "lenis/react";

function LenisScrollBridge() {
  useLenis(() => {
    // Lenis her scroll tick'inde window'a event fırlat
    // reveal-card gibi native scroll listener'lar bunu yakalar
    window.dispatchEvent(new Event("scroll", { bubbles: false }));
  });
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 0.8,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <LenisScrollBridge />
      {children}
    </ReactLenis>
  );
}
