import type { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "@/config/navigation";
import { isRouteActive } from "@/utils/navigation";

export default function WebSidebarNav(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const active = isRouteActive(location.pathname, item);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.route)}
            className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
              active
                ? "bg-gray-100 font-medium text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}