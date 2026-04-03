import { JSX } from "react";

import Button from "@/components/ui/Button";
import { getMonthLabel } from "@/utils/date";

type BillsMonthPickerProps = {
  readonly selectedMonth: Date;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onResetToCurrentMonth?: () => void;
};

export default function BillsMonthPicker({
  selectedMonth,
  onPrevious,
  onNext,
  onResetToCurrentMonth,
}: BillsMonthPickerProps): JSX.Element {
  return (
    <section className="rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Período
          </p>
          <h2 className="mt-1 text-lg font-semibold capitalize text-gray-900 sm:text-xl">
            {getMonthLabel(selectedMonth)}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="ghost" size="sm" onClick={onPrevious}>
            Anterior
          </Button>

          {onResetToCurrentMonth ? (<Button
            variant="secondary"
            size="sm"
            onClick={onResetToCurrentMonth}
          >
            Este mes
          </Button>) : null}

          <Button variant="ghost" size="sm" onClick={onNext}>
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  );
}