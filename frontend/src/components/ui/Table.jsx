import React from "react";
import { cn } from "./utils";

export function Table({ className, containerClassName, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-card overflow-hidden",
        containerClassName
      )}
    >
      <div className="overflow-x-auto">
        <table className={cn("w-full text-left text-sm", className)} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <thead
      className={cn(
        "bg-surface-muted text-[11px] font-bold uppercase tracking-widest text-text-muted border-b border-border",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "hover:bg-surface-muted/60 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ className, children, ...props }) {
  return (
    <th className={cn("px-6 py-4", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn("px-6 py-4", className)} {...props}>
      {children}
    </td>
  );
}

export default Table;
