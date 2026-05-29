import React from "react";
import { cn } from "./utils";

export function PageHeader({
  title,
  subtitle,
  badge,
  meta,
  actions,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black text-text tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        {meta}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
