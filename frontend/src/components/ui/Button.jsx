import React from "react";
import { cn } from "./utils";

const VARIANTS = {
  primary:
    "bg-primary text-white shadow-card hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary:
    "bg-surface-muted text-text border border-border hover:bg-surface-elevated",
  outline:
    "border border-border text-text hover:bg-surface-muted hover:text-text",
  ghost: "text-text-muted hover:text-text hover:bg-surface-muted",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/40",
};

const SIZES = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leadingIcon,
  trailingIcon,
  className,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 disabled:pointer-events-none",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {!isLoading && leadingIcon ? leadingIcon : null}
      <span>{children}</span>
      {!isLoading && trailingIcon ? trailingIcon : null}
    </button>
  );
}

export default Button;
