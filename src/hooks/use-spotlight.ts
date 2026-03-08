"use client";

import { useCallback } from "react";
import { useMotionValue, useMotionTemplate } from "framer-motion";

interface UseSpotlightOptions {
  radius?: number;
  color?: string;
  opacity?: number;
}

export function useSpotlight({
  radius = 350,
  color = "148,163,184",
  opacity = 0.06,
}: UseSpotlightOptions = {}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const spotlight = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(${color},${opacity}), transparent 80%)`;

  return { handleMouseMove, spotlight };
}
