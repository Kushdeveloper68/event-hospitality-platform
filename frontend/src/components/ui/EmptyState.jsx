import React from "react";
import { cn } from "./utils";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 text-center",
        className
      )}
    >
      <span className="material-symbols-outlined text-5xl text-text-muted">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-text">{title}</p>
        {description && (
          <p className="text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export default EmptyState;
