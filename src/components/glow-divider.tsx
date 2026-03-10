import { cn } from "@/lib/utils";

interface GlowDividerProps {
  className?: string;
}

export function GlowDivider({ className }: GlowDividerProps) {
  return (
    <div
      className={cn("h-px w-full bg-black/[0.07]", className)}
      aria-hidden="true"
    />
  );
}
