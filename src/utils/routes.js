export const PAGE_ROUTES = {
  Dashboard: { path: "/dashboard", title: "Dashboard" },
  AddRecord: { path: "/registros/novo", title: "Registrar Consumo" },
  Goals: { path: "/metas", title: "Metas" },
  Tips: { path: "/dicas", title: "Dicas" },
  Calculator: { path: "/calculadora", title: "Calculadora" },
  Game: { path: "/game", title: "Game" },
  Profile: { path: "/perfil", title: "Perfil" },
  Intro: { path: "/intro", title: "Introdução" },
  Onboarding: { path: "/onboarding", title: "Onboarding" },
  Login: { path: "/login", title: "Login" },
};

export function createPageUrl(pageName) {
  return PAGE_ROUTES[pageName]?.path || "/";
}

export function getPageNameByPath(pathname) {
  const entry = Object.entries(PAGE_ROUTES).find(
    ([, config]) => config.path === pathname
  );
  return entry ? entry[0] : null;
}
