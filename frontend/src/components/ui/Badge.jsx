import React from "react";
import { cn } from "./utils";

const VARIANTS = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  neutral: "bg-surface-muted text-text-muted",
};

export function Badge({ variant = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        VARIANTS[variant] || VARIANTS.neutral,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
