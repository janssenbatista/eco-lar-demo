import clsx from "clsx";
import React from "react";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
