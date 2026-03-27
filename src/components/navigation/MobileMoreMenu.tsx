import { JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { secondaryMobileNavItems } from "@/config/navigation";
import { isRouteActive } from "@/utils/navigation";

type MobileMoreMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMoreMenu({
  open,
  onClose,
}: MobileMoreMenuProps): JSX.Element | null {
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-20 z-50 mx-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
        <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Más opciones
        </div>

        <div className="space-y-1">
          {secondaryMobileNavItems.map((item) => {
            const active = isRouteActive(location.pathname, item);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${active
                  ? "bg-gray-50 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
                onClick={() => {
                  navigate(item.route);
                  onClose();
                }}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}