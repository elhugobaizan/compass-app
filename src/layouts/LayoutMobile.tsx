import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { type ReactNode, type JSX } from "react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Logo from "@/components/ui/Logo";

type LayoutMobileProps = {
  readonly children: ReactNode;
};

export default function LayoutMobile({ children }: LayoutMobileProps): JSX.Element {

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <h1 className="font-serif text-lg font-bold text-[var(--color-ink)]">Compass</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="px-4 py-4 pb-24">{children}</main>
      <MobileBottomNav />
    </div>
  );
}