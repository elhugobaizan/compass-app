import { JSX, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";

type ToolPageShellProps = {
  readonly children: (isMobile: boolean) => ReactNode;
};

/**
 * Envoltorio de una herramienta abierta desde la grilla de /tools.
 * Aporta el layout y la vuelta al lanzador; el contenido lo pone cada tool.
 */
export default function ToolPageShell({ children }: ToolPageShellProps): JSX.Element {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <button
        type="button"
        onClick={() => navigate("/tools")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Herramientas
      </button>

      {children(isMobile)}
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}
