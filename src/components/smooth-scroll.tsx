"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

let scrollPending = false;

function LenisScrollBridge() {
  useLenis((lenis) => {
    // Lenis instance'ını global'e expose et (modal lock için)
    if (!(window as any).__lenis) (window as any).__lenis = lenis;
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("scroll", { bubbles: false }));
        scrollPending = false;
      });
    }
  });
  return null;
}

function LenisScrollReset() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // İlk mount'ta scroll reset yapma
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Route değiştiğinde hem Lenis hem native scroll'u sıfırla
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.0,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      }}
    >
      <LenisScrollBridge />
      <LenisScrollReset />
      {children}
    </ReactLenis>
  );
}
