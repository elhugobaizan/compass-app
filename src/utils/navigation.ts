import { NavigationItem, navigationItems } from "@/config/navigation";

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
  const match = navigationItems.find((item) => {
    if (item.route === "/") return pathname === "/";
    return pathname.startsWith(item.route);
  });

  return match?.label ?? "Compass";
}