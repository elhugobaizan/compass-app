import { JSX } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { formatCurrency } from "@/utils/formatters";

type CategoryBreakdownItem = {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
};

type CategoryBreakdownChartProps = {
  items: CategoryBreakdownItem[];
};

const BAR_COLORS = [
  "#9CA3AF",
  "#6B7280",
  "#4B5563",
  "#374151",
  "#1F2937",
];

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CategoryBreakdownItem;
  }>;
};

function CustomTooltip({ active, payload }: TooltipProps): JSX.Element | null {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-sm font-medium text-gray-900">{item.categoryName}</p>
      <p className="text-sm text-gray-600">{formatCurrency(item.total)}</p>
      <p className="text-xs text-gray-500">{item.percentage.toFixed(0)}%</p>
    </div>
  );
}

export default function CategoryBreakdownChart({
  items,
}: CategoryBreakdownChartProps): JSX.Element {
  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="categoryName"
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
          <Bar dataKey="total" radius={[0, 6, 6, 0]}>
            {items.map((item, index) => (
              <Cell
                key={item.categoryId}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}