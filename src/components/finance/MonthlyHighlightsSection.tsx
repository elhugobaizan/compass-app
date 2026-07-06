import { JSX } from "react";
import { CalendarClock, Landmark, Receipt } from "lucide-react";

import SectionBlock from "@/components/ui/SectionBlock";
import SummaryCard from "@/components/ui/SummaryCard";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatters";
import { parseLocalDate } from "@/utils/date";
import type { MonthlyHighlights, NextDue } from "@/utils/homeHighlights";

type MonthlyHighlightsSectionProps = {
  readonly highlights: MonthlyHighlights;
};

function formatDueText(due: NextDue): string {
  if (!due) return "Sin vencimientos próximos";

  const date = parseLocalDate(due.dateKey);
  const dateLabel = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(date);

  const relative =
    due.daysFromToday === 0
      ? "hoy"
      : due.daysFromToday === 1
        ? "mañana"
        : `en ${due.daysFromToday} días`;

  return `${dateLabel} · ${relative}`;
}

function NextDueRow({
  icon,
  title,
  due,
}: {
  readonly icon: JSX.Element;
  readonly title: string;
  readonly due: NextDue;
}): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--color-muted)]">{title}</p>
        <p className="truncate text-sm font-medium text-[var(--color-ink)]">
          {due ? due.label : "—"}
        </p>
      </div>
      <p className="shrink-0 text-xs text-[var(--color-muted)]">{formatDueText(due)}</p>
    </div>
  );
}

export default function MonthlyHighlightsSection({
  highlights,
}: MonthlyHighlightsSectionProps): JSX.Element {
  const {
    dailyMax,
    daysRemaining,
    spentToday,
    pendingFixedExpenses,
    nextFixedDeposit,
    nextBill,
  } = highlights;

  return (
    <SectionBlock title="Resumen del mes" subtitle="Cuánto podés gastar y qué se viene">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Gasto máximo por día"
          value={formatCurrency(dailyMax)}
          helperText={`${daysRemaining} ${daysRemaining === 1 ? "día restante" : "días restantes"}`}
        />
        <SummaryCard
          label="Llevo gastado hoy"
          value={formatCurrency(spentToday)}
          helperText={
            dailyMax > 0 && spentToday > dailyMax
              ? "Superaste el máximo de hoy"
              : "Dentro del máximo"
          }
        />
        <SummaryCard
          label="Gastos fijos pendientes"
          value={formatCurrency(pendingFixedExpenses)}
          helperText="Facturas por pagar este mes"
        />
      </div>

      <Card className="mt-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
          <CalendarClock className="h-4 w-4" />
          Próximos vencimientos
        </div>
        <div className="space-y-3">
          <NextDueRow
            icon={<Landmark className="h-4 w-4" />}
            title="Próximo plazo fijo"
            due={nextFixedDeposit}
          />
          <NextDueRow
            icon={<Receipt className="h-4 w-4" />}
            title="Próxima factura"
            due={nextBill}
          />
        </div>
      </Card>
    </SectionBlock>
  );
}
