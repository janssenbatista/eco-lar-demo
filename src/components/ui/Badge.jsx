import clsx from "clsx";
import React from "react";

export function Badge({ className, children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
