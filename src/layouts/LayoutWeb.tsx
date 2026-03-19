import { type ReactNode, type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

type LayoutWebProps = {
  readonly children: ReactNode;
};

type Routes = {
  id: string;
  route: string;
  label: string;
}
const sections: Routes[] = [
  {
    id: 'dashboard',
    route: '/',
    label: 'Dashboard'
  },
  {
    id: 'accounts',
    route: '/',
    label: 'Cuentas'
  },
  {
    id: 'transactions',
    route: '/transactions',
    label: 'Movimientos'
  },
  {
    id: 'assets',
    route: '/assets',
    label: 'Inversiones'
  },
  {
    id: 'adjustments',
    route: '/',
    label: 'Ajustes'
  }
];

export default function LayoutWeb({ children }: LayoutWebProps): JSX.Element {
  
  function selectItem(selectedItem: Routes){
    setItemSelected(selectedItem);
    navigate(selectedItem.route);
  }

  const [itemSelected, setItemSelected] = useState(sections.find(item => item.id === 'dashboard') || null);

  const navigate = useNavigate();
  const itemClass = "w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100";
  const itemSelectedClass = "w-full rounded-lg px-3 py-2 text-left bg-gray-50 hover:bg-gray-100";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-200 bg-white p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Compass</h1>
            <p className="text-sm text-gray-500">Versión web</p>
          </div>

          <nav className="space-y-2">
            {sections.map( section => (
              <button
                key={section.id}
                className={itemSelected?.id === section.id ? itemSelectedClass : itemClass}
                onClick={() => selectItem(section)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{itemSelected?.label}</h2>
              <div className="text-sm text-gray-500">PWA Web</div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}