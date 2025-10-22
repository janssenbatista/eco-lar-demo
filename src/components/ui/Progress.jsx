import clsx from "clsx";
import React from "react";

export function Progress({ value = 0, className }) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className={clsx("h-2 w-full overflow-hidden rounded-full bg-emerald-100", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export default Progress;
