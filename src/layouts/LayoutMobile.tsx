import type { ReactNode } from "react";

type LayoutMobileProps = {
  children: ReactNode;
};

export default function LayoutMobile({
  children,
}: LayoutMobileProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Finanzas</h1>
          <span className="text-sm text-gray-500">Mobile</span>
        </div>
      </header>

      <main className="px-4 py-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3">
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <button className="rounded-md py-2 hover:bg-gray-100">Home</button>
          <button className="rounded-md py-2 hover:bg-gray-100">Ctas</button>
          <button className="rounded-md py-2 hover:bg-gray-100">Movs</button>
          <button className="rounded-md py-2 hover:bg-gray-100">Más</button>
        </div>
      </nav>
    </div>
  );
}