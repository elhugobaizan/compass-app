import { type ReactNode, type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

type LayoutMobileProps = {
  readonly children: ReactNode;
};

type Routes = {
  id: string;
  route: string;
  label: string;
}
const sections: Routes[] = [
  {
    id: 'accounts',
    route: '/',
    label: 'Ctas'
  },
  {
    id: 'transactions',
    route: '/transactions',
    label: 'Movs'
  },
  {
    id: 'dashboard',
    route: '/',
    label: 'Dashboard'
  },
  {
    id: 'assets',
    route: '/assets',
    label: 'Inv'
  },
  {
    id: 'adjustments',
    route: '/',
    label: 'Ajs'
  }
];

export default function LayoutMobile({ children }: LayoutMobileProps): JSX.Element {

  function selectItem(selectedItem: Routes){
    setItemSelected(selectedItem);
    navigate(selectedItem.route);
  }

  const [itemSelected, setItemSelected] = useState(sections.find(item => item.id === 'dashboard') || null);

  const navigate = useNavigate();
  const itemClass = "rounded-md py-2 hover:bg-gray-100";
  const itemSelectedClass ="rounded-md py-2 bg-gray-50 hover:bg-gray-100";

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
          {sections.map(section => (
            <button 
              key={section.id}
              className={section.id === itemSelected?.id ? itemSelectedClass : itemClass}
              onClick={() => selectItem(section)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}