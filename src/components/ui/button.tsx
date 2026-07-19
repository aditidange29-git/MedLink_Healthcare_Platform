"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 active:scale-95 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
export { Button };
