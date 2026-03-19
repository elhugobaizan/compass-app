export type AppRouteItem = {
  id: string;
  route: string;
  label: string;
  icon: string;
};

export const navigationItems: AppRouteItem[] = [
  {
    id: "dashboard",
    route: "/",
    label: "Dashboard",
    icon: "",
  },
  {
    id: "accounts",
    route: "/accounts",
    label: "Cuentas",
    icon: "",
  },
  {
    id: "transactions",
    route: "/transactions",
    label: "Movimientos",
    icon: "",
  },
  {
    id: "assets",
    route: "/assets",
    label: "Inversiones",
    icon: "",
  },
  {
    id: "settings",
    route: "/settings",
    label: "Ajustes",
    icon: "",
  },
];