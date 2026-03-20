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
            <span className="truncate text-sm font-medium text-gray-900">
              {item.categoryName}
            </span>

            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.total)}
              </div>
              <div className="text-xs text-gray-500">
                {item.percentage.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gray-400"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}