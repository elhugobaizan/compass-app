import { JSX } from "react";
import { formatCurrency } from "@/utils/formatters";

type CategoryBreakdownItem = {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
};

type CategoryBreakdownListProps = {
  readonly items: CategoryBreakdownItem[];
};

export default function CategoryBreakdownList({
  items,
}: CategoryBreakdownListProps): JSX.Element {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.categoryId} className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="truncate text-sm font-medium text-[var(--color-ink)]">
              {item.categoryName}
            </span>

            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--color-ink)]">
                {formatCurrency(item.total)}
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                {item.percentage.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="h-2 rounded-full bg-[var(--color-border)]">
            <div
              className="h-2 rounded-full bg-[var(--color-accent)]"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}