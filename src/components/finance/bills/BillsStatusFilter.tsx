import FilterChips from "@/components/ui/FilterChips";
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
    <FilterChips
      value={value}
      onChange={onChange}
      options={options}
    />
  );
}