import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { type ReactNode, type JSX } from "react";

type LayoutMobileProps = {
  readonly children: ReactNode;
};

export default function LayoutMobile({ children }: LayoutMobileProps): JSX.Element {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Compass</h1>
          <span className="text-sm text-gray-500">Mobile</span>
        </div>
      </header>

      <main className="px-4 py-4 pb-24">{children}</main>
      <MobileBottomNav />
    </div>
  );
}