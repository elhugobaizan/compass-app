import { JSX, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

import {
  primaryMobileNavItems,
} from "@/config/navigation";
import { isRouteActive } from "@/utils/navigation";
import MobileMoreMenu from "@/components/navigation/MobileMoreMenu";

export default function MobileBottomNav(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const itemBaseClass =
    "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs transition";
  const itemActiveClass = "bg-gray-50 text-gray-900";
  const itemInactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";

  const isMoreActive = location.pathname.startsWith("/assets") ||
    location.pathname.startsWith("/analytics") ||
    location.pathname.startsWith("/settings");

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          {primaryMobileNavItems.map((item) => {
            const active = isRouteActive(location.pathname, item);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`${itemBaseClass} ${active ? itemActiveClass : itemInactiveClass
                  }`}
                onClick={() => {
                  setIsMoreOpen(false);
                  navigate(item.route);
                }}
              >
                {Icon && <Icon className="mb-1 h-5 w-5" />}
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`${itemBaseClass} ${isMoreActive ? itemActiveClass : itemInactiveClass
              }`}
            onClick={() => setIsMoreOpen((prev) => !prev)}
          >
            <MoreHorizontal className="mb-1 h-5 w-5" />
            <span>Más</span>
          </button>
        </div>
      </nav>

      <MobileMoreMenu
        open={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
      />
    </>
  );
}