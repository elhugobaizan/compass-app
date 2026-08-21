import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";

import { TOOLS } from "@/config/tools";
import { useShoppingItemsQuery } from "@/hooks/queries/useShoppingItemsQuery";
import { useLocationsQuery } from "@/hooks/queries/useLocationsQuery";

export default function ToolsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  const { data: shoppingItems = [] } = useShoppingItemsQuery();
  const { data: locations = [] } = useLocationsQuery();

  // Resumen en vivo de cada herramienta, para que la tarjeta diga algo útil
  const summaries: Record<string, string> = {
    shopping: (() => {
      const pending = shoppingItems.filter((item) => !item.is_done).length;
      const recurring = shoppingItems.filter((item) => item.is_recurring).length;
      return `${pending} ${pending === 1 ? "pendiente" : "pendientes"} · ${recurring} ${recurring === 1 ? "habitual" : "habituales"}`;
    })(),
    locations: (() => {
      const withMap = locations.filter(
        (l) => l.latitude != null && l.longitude != null,
      ).length;
      return `${locations.length} ${locations.length === 1 ? "lugar" : "lugares"} · ${withMap} con mapa`;
    })(),
  };

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title={isMobile ? "Herramientas" : ""}
        description={isMobile ? undefined : "Utilidades para el día a día."}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => navigate(tool.route)}
              className="group flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-left transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-paper)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-bg)]">
                <Icon className="h-5 w-5 text-[var(--color-accent-text)]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-serif text-base font-semibold text-[var(--color-ink)]">
                  {tool.label}
                </p>

                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {summaries[tool.id]}
                </p>

                {!isMobile && (
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {tool.description}
                  </p>
                )}
              </div>

              <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}
