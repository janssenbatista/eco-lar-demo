import clsx from "clsx";
import React from "react";

export function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-emerald-100/70",
        className
      )}
    />
  );
}
