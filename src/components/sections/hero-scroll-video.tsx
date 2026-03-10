"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 150;
const FRAME_BASE = "/frames/themis/";

function frameSrc(index: number): string {
  return `${FRAME_BASE}${String(index + 1).padStart(4, "0")}.jpg`;
}

// Scroll 0'da hangi frame'de başlanmalı: yakın açı = son frame
const INITIAL_FRAME = FRAME_COUNT - 1;

export function HeroScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  // Başlangıç değerlerini doğru frame'e set et — LERP geçişini önler
  const currentFrameRef = useRef(INITIAL_FRAME);
  const targetFrameRef = useRef(INITIAL_FRAME);
  const rafRef = useRef(0);

  /* ── 1. Frame'leri önceden yükle ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scroll pozisyonundan doğru başlangıç frame'ini hesapla
    const animationRange = window.innerHeight * 1.0;
    const progress = Math.min(Math.max(window.scrollY / animationRange, 0), 1);
    const startFrame = (1 - progress) * (FRAME_COUNT - 1);
    currentFrameRef.current = startFrame;
    targetFrameRef.current = startFrame;

    framesRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        // Başlangıç frame'i yüklenince hemen çiz (ilk görsel doğru olsun)
        const sf = Math.round(startFrame);
        if (i === sf) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      return img;
    });
  }, []);

  /* ── 2. rAF lerp loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.01) return;

      const next = current + diff * 0.28;
      currentFrameRef.current = next;

      // Alpha blend between two adjacent frames for smooth interpolation
      const frameFloat = Math.min(Math.max(next, 0), FRAME_COUNT - 1);
      const frameA = Math.floor(frameFloat);
      const frameB = Math.min(frameA + 1, FRAME_COUNT - 1);
      const alpha = frameFloat - frameA;

      const imgA = framesRef.current[frameA];
      const imgB = framesRef.current[frameB];

      if (imgA?.complete && imgA.naturalWidth > 0) {
        if (canvas.width !== imgA.naturalWidth) {
          canvas.width = imgA.naturalWidth;
          canvas.height = imgA.naturalHeight;
        }
        ctx.globalAlpha = 1;
        ctx.drawImage(imgA, 0, 0, canvas.width, canvas.height);

        // Blend in next frame if available and there's meaningful alpha
        if (alpha > 0.001 && imgB?.complete && imgB.naturalWidth > 0) {
          ctx.globalAlpha = alpha;
          ctx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── 3. Scroll → targetFrame ── */
  useEffect(() => {
    const onScroll = () => {
      /*
       * Wrapper: 200vh = 100vh (sticky ekran) + 100vh (animasyon)
       *
       * scrollY 0 → 100vh:  frame 150 → 1  (yakından uzağa)
       * scrollY > 100vh: sticky çözülür, sayfa aşağı akar
       *
       * progress = scrollY / vh → 100vh'de tam 1.0'a ulaşır
       */
      const animationRange = window.innerHeight * 1.0;
      const progress = Math.min(Math.max(window.scrollY / animationRange, 0), 1);
      // Ters: scroll aşağı → yakından uzağa (frame 150 → 1); float for smooth blend
      targetFrameRef.current = (1 - progress) * (FRAME_COUNT - 1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // İlk çağrı (sayfa yenilenmeden hemen hesapla)
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
