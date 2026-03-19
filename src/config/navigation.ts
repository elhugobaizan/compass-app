export type AppRouteItem = {
  id: string;
  route: string;
  label: string;
};

export const navigationItems: AppRouteItem[] = [
  {
    id: "dashboard",
    route: "/",
    label: "Dashboard",
  },
  {
    id: "accounts",
    route: "/accounts",
    label: "Ctas",
  },
  {
    id: "transactions",
    route: "/transactions",
    label: "Movs",
  },
  {
    id: "assets",
    route: "/assets",
    label: "Inv",
  },
  {
    id: "settings",
    route: "/settings",
    label: "Ajs",
  },
];