import clsx from "clsx";
import React from "react";

export const Input = React.forwardRef(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(
        "w-full rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-sm text-gray-700 shadow-inner placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
        className
      )}
      {...props}
    />
  );
});

export default Input;
