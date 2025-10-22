import clsx from "clsx";
import React from "react";

const variants = {
  default:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
  outline:
    "border border-emerald-200 text-emerald-700 hover:bg-emerald-50",
  ghost:
    "text-emerald-700 hover:bg-emerald-50"
};

const sizes = {
  default: "h-10 px-4",
  sm: "h-9 px-3 text-sm",
  icon: "h-10 w-10 p-0"
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:pointer-events-none",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.default,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
