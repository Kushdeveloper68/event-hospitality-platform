import React from "react";
import { cn } from "./utils";

export const Select = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      required,
      containerClassName,
      selectClassName,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label className="text-sm font-semibold text-text">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-60 disabled:cursor-not-allowed appearance-none",
            hasError
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border",
            selectClassName
          )}
          {...props}
        />
        {helperText && !hasError && (
          <p className="text-xs text-text-muted">{helperText}</p>
        )}
        {hasError && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
