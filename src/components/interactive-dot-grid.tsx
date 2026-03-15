"use client";

import { useEffect, useRef, useCallback } from "react";

interface InteractiveDotGridProps {
  spacing?: number;
  dotRadius?: number;
  maxDotRadius?: number;
  mouseRadius?: number;
  dotColor?: string;
  activeColor?: string;
  baseOpacity?: number;
  maxOpacity?: number;
  rippleSpeed?: number;
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
  // Idle tracking: if mouse hasn't moved and no ripples, skip redraw
  const idleFramesRef = useRef(0);
  const lastMouseRef = useRef({ x: -1000, y: -1000 });

  const mouseRadiusSq = mouseRadius * mouseRadius;

  const spawnRipple = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastRippleTimeRef.current < 300) return;
      lastRippleTimeRef.current = now;

      if (ripplesRef.current.length >= maxRipples) {
        ripplesRef.current.shift();
      }
      ripplesRef.current.push({
        x, y,
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
      idleFramesRef.current = 0; // force redraw on resize
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      const prev = prevMouseRef.current;
      const dx = newX - prev.x;
      const dy = newY - prev.y;
      if (dx * dx + dy * dy > 3600) { // 60px threshold squared
        spawnRipple(newX, newY);
      }
      prevMouseRef.current = { x: newX, y: newY };
      mouseRef.current = { x: newX, y: newY, active: true };
      idleFramesRef.current = 0;
    }

    function handleMouseLeave() {
      mouseRef.current.active = false;
      idleFramesRef.current = 0;
    }

    function handleClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
      idleFramesRef.current = 0;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    function animate() {
      animationRef.current = requestAnimationFrame(animate);

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;

      // Update ripples
      let hasActiveRipple = false;
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += rippleSpeed;
        ripples[i].opacity *= 0.985;
        if (ripples[i].radius > ripples[i].maxRadius || ripples[i].opacity < 0.01) {
          ripples.splice(i, 1);
        } else {
          hasActiveRipple = true;
        }
      }

      // Skip redraw if nothing is happening
      const mx = mouse.x, my = mouse.y;
      const last = lastMouseRef.current;
      const mouseMoved = Math.abs(mx - last.x) > 0.5 || Math.abs(my - last.y) > 0.5;

      if (!mouseMoved && !hasActiveRipple) {
        idleFramesRef.current++;
        // Allow ambient breathing redraws every 4 frames when truly idle
        if (idleFramesRef.current % 4 !== 0) return;
      } else {
        idleFramesRef.current = 0;
        lastMouseRef.current = { x: mx, y: my };
      }

      const { w, h } = dimensionsRef.current;
      ctx!.clearRect(0, 0, w, h);

      const time = Date.now() * 0.001;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const offsetX = (w % spacing) / 2;
      const offsetY = (h % spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * spacing;
          const y = offsetY + row * spacing;

          const breath = Math.sin(time * 0.8 + col * 0.3 + row * 0.2) * 0.3 + 0.7;

          let influence = 0;
          let isActive = false;

          if (mouse.active) {
            const dx = x - mx;
            const dy = y - my;
            const distSq = dx * dx + dy * dy; // no sqrt needed for comparison
            if (distSq < mouseRadiusSq) {
              const dist = Math.sqrt(distSq); // sqrt only when inside radius
              influence = 1 - dist / mouseRadius;
              influence = influence * influence;
              isActive = true;
            }
          }

          let rippleInfluence = 0;
          if (hasActiveRipple) {
            for (const ripple of ripples) {
              const dx = x - ripple.x;
              const dy = y - ripple.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const ringWidth = 40;
              const distFromRing = Math.abs(dist - ripple.radius);
              if (distFromRing < ringWidth) {
                const ri = (1 - distFromRing / ringWidth) * ripple.opacity;
                if (ri > rippleInfluence) rippleInfluence = ri;
              }
            }
          }

          const totalInfluence = influence + rippleInfluence > 1 ? 1 : influence + rippleInfluence;

          const radius = dotRadius + (maxDotRadius - dotRadius) * totalInfluence * breath;
          const opacity = (baseOpacity + (maxOpacity - baseOpacity) * totalInfluence) * breath;
          const color = isActive || rippleInfluence > 0.1 ? activeColor : dotColor;

          ctx!.beginPath();
          ctx!.arc(x, y, radius < 0.5 ? 0.5 : radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${color}, ${opacity})`;
          ctx!.fill();

          // Connection lines only when strongly active
          if (totalInfluence > 0.3) {
            const lineOpacity = (totalInfluence - 0.3) * 0.15;

            if (col < cols - 1) {
              const nx = offsetX + (col + 1) * spacing;
              const ndx = nx - mx, ndy = y - my;
              if (ndx * ndx + ndy * ndy < mouseRadiusSq || rippleInfluence > 0.2) {
                ctx!.beginPath();
                ctx!.moveTo(x, y);
                ctx!.lineTo(nx, y);
                ctx!.strokeStyle = `rgba(${activeColor}, ${lineOpacity})`;
                ctx!.lineWidth = 0.4;
                ctx!.stroke();
              }
            }

            if (row < rows - 1) {
              const ny = offsetY + (row + 1) * spacing;
              const ndx = x - mx, ndy = ny - my;
              if (ndx * ndx + ndy * ndy < mouseRadiusSq || rippleInfluence > 0.2) {
                ctx!.beginPath();
                ctx!.moveTo(x, y);
                ctx!.lineTo(x, ny);
                ctx!.strokeStyle = `rgba(${activeColor}, ${lineOpacity})`;
                ctx!.lineWidth = 0.4;
                ctx!.stroke();
              }
            }
          }
        }
      }

      // Ripple rings
      if (hasActiveRipple) {
        for (const ripple of ripples) {
          ctx!.beginPath();
          ctx!.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${activeColor}, ${ripple.opacity * 0.15})`;
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
      }
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
    spacing, dotRadius, maxDotRadius, mouseRadius, mouseRadiusSq,
    dotColor, activeColor, baseOpacity, maxOpacity, rippleSpeed, spawnRipple,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
