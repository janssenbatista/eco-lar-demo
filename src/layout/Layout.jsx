import React, { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  Plus,
  Target,
  Lightbulb,
  Calculator,
  BrainCircuit,
  User,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useCloseSidebar,
  useSidebarState,
} from "@/components/ui/Sidebar";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/context/AuthContext";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  { title: "Registrar consumo", url: createPageUrl("AddRecord"), icon: Plus },
  { title: "Metas", url: createPageUrl("Goals"), icon: Target },
  { title: "Dicas", url: createPageUrl("Tips"), icon: Lightbulb },
  { title: "Calculadora", url: createPageUrl("Calculator"), icon: Calculator },
  { title: "Game", url: createPageUrl("Game"), icon: BrainCircuit },
  { title: "Perfil", url: createPageUrl("Profile"), icon: User },
];

function LayoutShell() {
  const location = useLocation();
  const closeSidebar = useCloseSidebar();
  const { isOpen } = useSidebarState();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate(createPageUrl("Login"));
      return;
    }
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}
      <Sidebar className="border-r border-emerald-100">
        <SidebarHeader className="border-b border-emerald-100/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">EcoLar</h2>
              <p className="text-xs text-emerald-600">Assistente sustentável</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-4 py-6">
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link to={item.url} className="block">
                        <SidebarMenuButton
                          className={
                            isActive
                              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                              : "text-gray-700"
                          }
                          asChild
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={
                                isActive
                                  ? "h-5 w-5 text-white"
                                  : "h-5 w-5 text-emerald-600"
                              }
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-emerald-100/70">
          <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
            <p className="text-sm font-semibold text-gray-900">
              💚 Impacto positivo
            </p>
            <p className="text-xs text-gray-600">
              Cada hábito sustentável conta muito!
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-emerald-100/60 bg-white/70 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              <h1 className="text-lg font-semibold text-gray-900">EcoLar</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutShell />
    </SidebarProvider>
  );
}
