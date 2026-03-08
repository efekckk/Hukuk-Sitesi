"use client";

import { InteractiveDotGrid } from "./interactive-dot-grid";

export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Interactive Dot Grid — subtle on white */}
      <div className="absolute inset-0 pointer-events-auto">
        <InteractiveDotGrid
          spacing={34}
          dotRadius={0.6}
          maxDotRadius={2.5}
          mouseRadius={140}
          dotColor="255, 255, 255"
          activeColor="182, 140, 90"
          baseOpacity={0.015}
          maxOpacity={0.25}
          rippleSpeed={2.5}
          maxRipples={3}
        />
      </div>
    </div>
  );
}
