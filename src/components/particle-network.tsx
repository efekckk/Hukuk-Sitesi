"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface ParticleNetworkProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
  particleSpeed?: number;
  lineOpacity?: number;
  dotOpacity?: number;
  dotColor?: string;
  lineColor?: string;
}

export function ParticleNetwork({
  particleCount = 80,
  connectionDistance = 150,
  mouseRadius = 200,
  particleSpeed = 0.3,
  lineOpacity = 0.15,
  dotOpacity = 0.4,
  dotColor = "148, 163, 184",
  lineColor = "148, 163, 184",
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      const count = Math.min(
        particleCount,
        Math.floor((width * height) / 12000)
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount, particleSpeed]
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

      if (
        particlesRef.current.length === 0 ||
        Math.abs(w - dimensionsRef.current.w) > 100
      ) {
        initParticles(w, h);
      }
    }

    resize();
    initParticles(dimensionsRef.current.w, dimensionsRef.current.h);

    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    }

    function handleMouseLeave() {
      mouseRef.current.active = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    function animate() {
      const { w, h } = dimensionsRef.current;
      ctx!.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges with fade zone
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        }
        if (p.x > w) {
          p.x = w;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        }
        if (p.y > h) {
          p.y = h;
          p.vy *= -1;
        }

        // Mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius && dist > 0) {
            const force = (mouseRadius - dist) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 0.15;
            p.vy += Math.sin(angle) * force * 0.15;
          }
        }

        // Damping to prevent runaway velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > particleSpeed * 3) {
          p.vx = (p.vx / speed) * particleSpeed * 3;
          p.vy = (p.vy / speed) * particleSpeed * 3;
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity =
              (1 - dist / connectionDistance) * lineOpacity;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }

        // Draw mouse connections
        if (mouse.active) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const opacity =
              (1 - dist / mouseRadius) * lineOpacity * 1.5;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx!.lineWidth = 0.6;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${dotColor}, ${p.opacity * dotOpacity})`;
        ctx!.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    initParticles,
    connectionDistance,
    mouseRadius,
    particleSpeed,
    lineOpacity,
    dotOpacity,
    dotColor,
    lineColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
