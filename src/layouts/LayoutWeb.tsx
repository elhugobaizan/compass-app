import type { ReactNode } from "react";

type LayoutWebProps = {
  children: ReactNode;
};

export default function LayoutWeb({ children }: LayoutWebProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-200 bg-white p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Finanzas</h1>
            <p className="text-sm text-gray-500">Versión web</p>
          </div>

          <nav className="space-y-2">
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
              Dashboard
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
              Cuentas
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
              Movimientos
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
              Inversiones
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
              Ajustes
            </button>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <div className="text-sm text-gray-500">PWA Web</div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}