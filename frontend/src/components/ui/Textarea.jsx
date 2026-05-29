import React from "react";
import { cn } from "./utils";

export const Textarea = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      required,
      containerClassName,
      textareaClassName,
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
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed",
            hasError
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border",
            textareaClassName
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

Textarea.displayName = "Textarea";

export default Textarea;
