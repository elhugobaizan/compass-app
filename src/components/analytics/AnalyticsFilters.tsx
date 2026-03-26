import { JSX } from "react";
import type { AnalyticsPeriod } from "@/types/analytics";
import Button from "@/components/ui/Button";

type AnalyticsFiltersProps = {
  readonly period: AnalyticsPeriod;
  readonly onPeriodChange: (period: AnalyticsPeriod) => void;
};

const PERIOD_OPTIONS: Array<{ value: AnalyticsPeriod; label: string }> = [
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "12m", label: "12M" },
  { value: "ytd", label: "Año" },
];

export default function AnalyticsFilters({
  period,
  onPeriodChange,
}: AnalyticsFiltersProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIOD_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={period === option.value ? "primary" : "secondary"}
          className="px-3 py-1.5 text-sm"
          onClick={() => onPeriodChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}