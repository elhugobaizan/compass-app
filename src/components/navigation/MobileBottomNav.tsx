import type { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "@/config/navigation";
import { isRouteActive } from "@/utils/navigation";

export default function MobileBottomNav(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const itemClass = "rounded-md py-2 hover:bg-gray-100";
  const itemSelectedClass = "rounded-md bg-gray-50 py-2 hover:bg-gray-100";

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3">
      <div className="grid grid-cols-5 gap-2 text-center text-sm">
        {navigationItems.map((item) => {
          const active = isRouteActive(location.pathname, item);

          return (
            <button
              key={item.id}
              type="button"
              className={active ? itemSelectedClass : itemClass}
              onClick={() => navigate(item.route)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}