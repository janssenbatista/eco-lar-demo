import clsx from "clsx";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, toggle, close }),
    [isOpen, toggle, close]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("Sidebar component must be used within SidebarProvider");
  }
  return ctx;
}

export function useSidebarState() {
  return useSidebar();
}

export function Sidebar({ className, children }) {
  const { isOpen } = useSidebar();
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-30 w-72 -translate-x-full border-r border-emerald-100 bg-white/90 shadow-lg transition-transform duration-200 backdrop-blur-md md:static md:translate-x-0",
        isOpen && "translate-x-0",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }) {
  return <div className={clsx("px-4 py-6", className)}>{children}</div>;
}

export function SidebarContent({ className, children }) {
  return (
    <div className={clsx("overflow-y-auto px-4", className)}>{children}</div>
  );
}

export function SidebarFooter({ className, children }) {
  return <div className={clsx("px-4 py-6", className)}>{children}</div>;
}

export function SidebarGroup({ className, children }) {
  return <div className={clsx("mb-6", className)}>{children}</div>;
}

export function SidebarGroupLabel({ className, children }) {
  return (
    <p
      className={clsx(
        "px-2 text-xs font-semibold uppercase tracking-wide text-gray-500",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SidebarGroupContent({ className, children }) {
  return <div className={clsx("mt-3 space-y-1", className)}>{children}</div>;
}

export function SidebarMenu({ className, children }) {
  return <nav className={clsx("space-y-1", className)}>{children}</nav>;
}

export function SidebarMenuItem({ className, children }) {
  return <div className={clsx(className)}>{children}</div>;
}

export function SidebarMenuButton({ className, children, asChild = false }) {
  const Component = asChild ? React.Fragment : "button";
  const props = asChild ? {} : { type: "button" };
  return (
    <Component {...props}>
      <div
        className={clsx(
          "flex items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-emerald-50",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
}

export function SidebarTrigger({ className }) {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600",
        className
      )}
    >
      <span className="sr-only">Alternar menu</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

export function useCloseSidebar() {
  const { close } = useSidebar();
  return close;
}
