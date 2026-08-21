import { NavigationItem, navigationItems } from "@/config/navigation";
import { getToolByRoute } from "@/config/tools";

export function isRouteActive(
  currentPath: string,
  item: NavigationItem
): boolean {
  if (item.route === "/") {
    return currentPath === "/";
  }

  return currentPath.startsWith(item.route);
}


export function getRouteTitle(pathname: string): string {
  // Dentro de una herramienta el header muestra su nombre, no "Herramientas"
  const tool = getToolByRoute(pathname);
  if (tool) return tool.label;

  const match = navigationItems.find((item) => {
    if (item.route === "/") return pathname === "/";
    return pathname.startsWith(item.route);
  });

  return match?.label ?? "Compass";
}