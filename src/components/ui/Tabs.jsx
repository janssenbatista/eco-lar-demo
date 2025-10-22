import clsx from "clsx";
import React, { createContext, useContext } from "react";

const TabsContext = createContext(null);

export function Tabs({ value, onValueChange, children }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div className={clsx("inline-flex flex-wrap gap-2 rounded-xl bg-emerald-50 p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("TabsTrigger must be used within Tabs");
  }
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange?.(value)}
      className={clsx(
        "min-w-[120px] rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-emerald-500 text-white shadow-md"
          : "bg-white text-gray-600 hover:bg-emerald-100",
        className
      )}
    >
      {children}
    </button>
  );
}
