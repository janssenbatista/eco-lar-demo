import clsx from "clsx";
import React from "react";

export function Label({ className, children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx("text-sm font-medium text-gray-700", className)}
    >
      {children}
    </label>
  );
}

export default Label;
