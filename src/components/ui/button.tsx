"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-secondary text-white hover:bg-secondary-light active:bg-secondary",
    secondary:
      "bg-secondary text-white hover:bg-secondary-light active:bg-secondary",
    outline:
      "border border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-white",
    ghost: "text-muted-foreground bg-transparent hover:bg-muted active:bg-muted/80",
  },
  size: {
    sm: "h-9 px-3 text-sm rounded-md",
    default: "h-10 px-5 py-2 text-sm rounded-md",
    lg: "h-12 px-8 text-base rounded-lg",
  },
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
