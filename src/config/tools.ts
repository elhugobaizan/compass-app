import type { LucideIcon } from "lucide-react";
import { ShoppingCart, MapPin } from "lucide-react";

/**
 * Herramientas del día a día. La sección /tools es un lanzador: cada entrada
 * de acá se dibuja como una tarjeta y abre su propia sub-ruta.
 * Sumar una herramienta = sumar una entrada acá + su ruta en routes.tsx.
 */
export type Tool = {
  readonly id: string;
  readonly route: string;
  readonly label: string;
  readonly description: string;
  readonly icon: LucideIcon;
};

export const TOOLS: readonly Tool[] = [
  {
    id: "shopping",
    route: "/tools/compras",
    label: "Lista de compras",
    description: "Qué falta comprar, con los productos habituales siempre a mano.",
    icon: ShoppingCart,
  },
  {
    id: "locations",
    route: "/tools/lugares",
    label: "Lugares",
    description: "Los lugares donde registrás movimientos, con su ubicación en el mapa.",
    icon: MapPin,
  },
];

export function getToolByRoute(pathname: string): Tool | undefined {
  return TOOLS.find((tool) => pathname.startsWith(tool.route));
}
