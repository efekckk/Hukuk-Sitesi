"use client";

import { ReactLenis, useLenis } from "lenis/react";

let scrollPending = false;

function LenisScrollBridge() {
  useLenis(() => {
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
      {children}
    </ReactLenis>
  );
}
