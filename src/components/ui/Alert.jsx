import clsx from "clsx";
import React from "react";

export function Alert({ className, children }) {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ className, children }) {
  return <div className={clsx("flex-1 leading-relaxed", className)}>{children}</div>;
}
