import { JSX } from "react";

export type BillStatusFilter = "all" | "pending" | "paid" | "overdue";

type BillsStatusFilterOption = {
  readonly label: string;
  readonly value: BillStatusFilter;
};

type BillsStatusFilterProps = {
  readonly value: BillStatusFilter;
  readonly onChange: (value: BillStatusFilter) => void;
  readonly options: readonly BillsStatusFilterOption[];
};

export default function BillsStatusFilter({
  value,
  onChange,
  options,
}: BillsStatusFilterProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              isActive
                ? "rounded-full border border-gray-900 bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition"
                : "rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}