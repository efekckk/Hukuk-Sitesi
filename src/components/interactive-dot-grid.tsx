"use client";

import { useEffect, useRef, useCallback } from "react";

interface InteractiveDotGridProps {
  /** Space between dots in pixels */
  spacing?: number;
  /** Base dot radius */
  dotRadius?: number;
  /** Max dot radius when mouse is near */
  maxDotRadius?: number;
  /** Mouse influence radius in pixels */
  mouseRadius?: number;
  /** Base dot color as r,g,b */
  dotColor?: string;
  /** Active (mouse-near) dot color as r,g,b */
  activeColor?: string;
  /** Base opacity of dots */
  baseOpacity?: number;
  /** Max opacity when mouse is near */
  maxOpacity?: number;
  /** Ripple wave speed (px per frame) */
  rippleSpeed?: number;
  /** How many ripple rings to keep alive */
  maxRipples?: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function InteractiveDotGrid({
  spacing = 32,
  dotRadius = 1,
  maxDotRadius = 3.5,
  mouseRadius = 160,
  dotColor = "255, 255, 255",
  activeColor = "182, 140, 90",
  baseOpacity = 0.015,
  maxOpacity = 0.6,
  rippleSpeed = 3,
  maxRipples = 4,
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const prevMouseRef = useRef({ x: -1000, y: -1000 });
  const ripplesRef = useRef<Ripple[]>([]);
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const lastRippleTimeRef = useRef(0);

  const spawnRipple = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastRippleTimeRef.current < 300) return;
      lastRippleTimeRef.current = now;

      if (ripplesRef.current.length >= maxRipples) {
        ripplesRef.current.shift();
      }
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: mouseRadius * 2.5,
        opacity: 0.35,
      });
    },
    [maxRipples, mouseRadius]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimensionsRef.current = { w, h };
    }

    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      const prev = prevMouseRef.current;
      const dx = newX - prev.x;
      const dy = newY - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn ripple on fast movements
      if (dist > 60) {
        spawnRipple(newX, newY);
      }

      prevMouseRef.current = { x: newX, y: newY };
      mouseRef.current = { x: newX, y: newY, active: true };
    }

    function handleMouseLeave() {
      mouseRef.current.active = false;
    }

    function handleClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    }

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    function animate() {
      const { w, h } = dimensionsRef.current;
      ctx!.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;
      const time = Date.now() * 0.001;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += rippleSpeed;
        ripples[i].opacity *= 0.985;
        if (
          ripples[i].radius > ripples[i].maxRadius ||
          ripples[i].opacity < 0.01
        ) {
          ripples.splice(i, 1);
        }
      }

      // Draw dots
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const offsetX = (w % spacing) / 2;
      const offsetY = (h % spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * spacing;
          const y = offsetY + row * spacing;

          // Subtle ambient breathing
          const breath =
            Math.sin(time * 0.8 + col * 0.3 + row * 0.2) * 0.3 + 0.7;

          let influence = 0;
          let isActive = false;

          // Mouse proximity influence
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouseRadius) {
              influence = 1 - dist / mouseRadius;
              influence = influence * influence; // ease-in-out curve
              isActive = true;
            }
          }

          // Ripple influence
          let rippleInfluence = 0;
          for (const ripple of ripples) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ringWidth = 40;
            const distFromRing = Math.abs(dist - ripple.radius);
            if (distFromRing < ringWidth) {
              const ringInfluence =
                (1 - distFromRing / ringWidth) * ripple.opacity;
              rippleInfluence = Math.max(rippleInfluence, ringInfluence);
            }
          }

          const totalInfluence = Math.min(
            1,
            influence + rippleInfluence
          );

          // Calculate visual properties
          const radius =
            dotRadius +
            (maxDotRadius - dotRadius) * totalInfluence * breath;
          const opacity =
            (baseOpacity +
              (maxOpacity - baseOpacity) * totalInfluence) *
            breath;

          // Color interpolation
          const color =
            isActive || rippleInfluence > 0.1 ? activeColor : dotColor;

          // Draw dot
          ctx!.beginPath();
          ctx!.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${color}, ${opacity})`;
          ctx!.fill();

          // Draw connection lines to neighbors when active
          if (totalInfluence > 0.3) {
            const lineOpacity = (totalInfluence - 0.3) * 0.15;

            // Right neighbor
            if (col < cols - 1) {
              const nx = offsetX + (col + 1) * spacing;
              const ny = y;
              const ndx = nx - mouse.x;
              const ndy = ny - mouse.y;
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
              if (ndist < mouseRadius || rippleInfluence > 0.2) {
                ctx!.beginPath();
                ctx!.moveTo(x, y);
                ctx!.lineTo(nx, ny);
                ctx!.strokeStyle = `rgba(${activeColor}, ${lineOpacity})`;
                ctx!.lineWidth = 0.4;
                ctx!.stroke();
              }
            }

            // Bottom neighbor
            if (row < rows - 1) {
              const nx = x;
              const ny = offsetY + (row + 1) * spacing;
              const ndx = nx - mouse.x;
              const ndy = ny - mouse.y;
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
              if (ndist < mouseRadius || rippleInfluence > 0.2) {
                ctx!.beginPath();
                ctx!.moveTo(x, y);
                ctx!.lineTo(nx, ny);
                ctx!.strokeStyle = `rgba(${activeColor}, ${lineOpacity})`;
                ctx!.lineWidth = 0.4;
                ctx!.stroke();
              }
            }
          }
        }
      }

      // Draw ripple rings
      for (const ripple of ripples) {
        ctx!.beginPath();
        ctx!.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${activeColor}, ${ripple.opacity * 0.15})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [
    spacing,
    dotRadius,
    maxDotRadius,
    mouseRadius,
    dotColor,
    activeColor,
    baseOpacity,
    maxOpacity,
    rippleSpeed,
    spawnRipple,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
