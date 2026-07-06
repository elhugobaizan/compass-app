import { JSX } from "react";

import Button from "@/components/ui/Button";
import { getMonthLabel } from "@/utils/date";

type MonthPickerProps = {
  readonly selectedMonth: Date;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onResetToCurrentMonth?: () => void;
  readonly label?: string;
  readonly resetLabel?: string;
};

export default function MonthPicker({
  selectedMonth,
  onPrevious,
  onNext,
  onResetToCurrentMonth,
  label = "Período",
  resetLabel = "Este mes",
}: MonthPickerProps): JSX.Element {
  const now = new Date();
  const monthDiff =
    (selectedMonth.getFullYear() - now.getFullYear()) * 12 +
    (selectedMonth.getMonth() - now.getMonth());
  const isPast = monthDiff < 0;
  const isCurrentMonth = monthDiff === 0;
  const isFuture = monthDiff > 0;

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-3 shadow-[0_1px_4px_rgba(46,42,36,0.04)] sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            {label}
          </p>
          <h2 className="mt-1 truncate font-serif text-lg font-semibold capitalize text-[var(--color-ink)] sm:text-xl">
            {getMonthLabel(selectedMonth)}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={isPast ? "secondary" : "ghost"} size="sm" onClick={onPrevious}>
            Anterior
          </Button>

          {onResetToCurrentMonth ? (
            <Button
              variant={isCurrentMonth ? "secondary" : "ghost"}
              size="sm"
              onClick={onResetToCurrentMonth}
            >
              {resetLabel}
            </Button>
          ) : null}

          <Button variant={isFuture ? "secondary" : "ghost"} size="sm" onClick={onNext}>
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  );
}