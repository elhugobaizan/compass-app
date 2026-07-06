import WebSidebarNav from "@/components/navigation/WebSidebarNav";
import { type ReactNode, type JSX } from "react";
import { useLocation } from "react-router-dom";
import { getRouteTitle } from "@/utils/navigation";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Logo from "@/components/ui/Logo";

type LayoutWebProps = {
  readonly children: ReactNode;
};

export default function LayoutWeb({ children }: LayoutWebProps): JSX.Element {
  const location = useLocation();
  const title = getRouteTitle(location.pathname);
  
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="mb-8 flex items-center gap-2.5">
            <Logo size={32} />
            <div>
              <h1 className="font-serif text-xl font-bold text-[var(--color-ink)]">Compass</h1>
              <p className="text-sm text-[var(--color-muted)]">Versión web</p>
            </div>
          </div>

          <WebSidebarNav />
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
              <ThemeSwitcher />
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}