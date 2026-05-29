import React from "react";
import { cn } from "./utils";

export const Input = React.forwardRef(
  (
    {
      label,
      labelAction,
      helperText,
      error,
      required,
      startAdornment,
      endAdornment,
      containerClassName,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-text">
              {label}
              {required && <span className="text-danger ml-1">*</span>}
            </label>
            {labelAction}
          </div>
        )}
        <div className="relative">
          {startAdornment && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-60 disabled:cursor-not-allowed",
              hasError
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border",
              startAdornment ? "pl-10" : "",
              endAdornment ? "pr-10" : "",
              inputClassName
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {endAdornment}
            </div>
          )}
        </div>
        {helperText && !hasError && (
          <p className="text-xs text-text-muted">{helperText}</p>
        )}
        {hasError && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
