import { JSX, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { useBreakpoint } from "@/utils/utils";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({
  open,
  title,
  onClose,
  children,
}: ModalProps): JSX.Element | null {
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {isMobile ? (
        <div className="absolute inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl bg-white shadow-2xl">
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-300" />

          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-base font-semibold text-gray-900">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(90vh-64px)] overflow-y-auto px-4 pb-6">
            {children}
          </div>
        </div>
      ) : (
        <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto px-5 py-5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}