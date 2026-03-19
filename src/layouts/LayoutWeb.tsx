import WebSidebarNav from "@/components/navigation/WebSidebarNav";
import { type ReactNode, type JSX } from "react";
import { useLocation } from "react-router-dom";
import { getRouteTitle } from "@/utils/navigation";

type LayoutWebProps = {
  readonly children: ReactNode;
};

export default function LayoutWeb({ children }: LayoutWebProps): JSX.Element {
  const location = useLocation();
  const title = getRouteTitle(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-200 bg-white p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Compass</h1>
            <p className="text-sm text-gray-500">Versión web</p>
          </div>

          <WebSidebarNav /> 
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <div className="text-sm text-gray-500">PWA Web</div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}