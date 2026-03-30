import type { LucideIcon } from "lucide-react";
import {
  House,
  Wallet,
  ArrowRightLeft,
  BarChart3,
  Landmark,
  Settings,
} from "lucide-react";

export type NavigationItem = {
  id: string;
  route: string;
  label: string;
  title: string;
  icon: LucideIcon;
  mobile: "primary" | "secondary";
  showInWeb: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    route: "/",
    label: "Inicio",
    title: "Dashboard",
    icon: House,
    mobile: "primary",
    showInWeb: true,
  },
  {
    id: "accounts",
    route: "/accounts",
    label: "Cuentas",
    title: "Cuentas",
    icon: Wallet,
    mobile: "primary",
    showInWeb: true,
  },
  {
    id: "transactions",
    route: "/transactions",
    label: "Movimientos",
    title: "Movimientos",
    icon: ArrowRightLeft,
    mobile: "primary",
    showInWeb: true,
  },
  {
    id: "assets",
    route: "/assets",
    label: "Inversiones",
    title: "Assets",
    icon: Landmark,
    mobile: "secondary",
    showInWeb: true,
  },
  {
    id: "analytics",
    route: "/analytics",
    label: "Analítica",
    title: "Analítica",
    icon: BarChart3,
    mobile: "secondary",
    showInWeb: true,
  },
  {
    id: "settings",
    route: "/settings",
    label: "Ajustes",
    title: "Ajustes",
    icon: Settings,
    mobile: "secondary",
    showInWeb: true,
  },
];

export const primaryMobileNavItems = navigationItems.filter(
  (item) => item.mobile === "primary"
);

export const secondaryMobileNavItems = navigationItems.filter(
  (item) => item.mobile === "secondary"
);

export const webNavItems = navigationItems.filter(
  (item) => item.showInWeb
);