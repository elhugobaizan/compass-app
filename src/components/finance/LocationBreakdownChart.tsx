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
import type { LocationBreakdownItem } from "@/utils/locationBreakdown";

type LocationBreakdownChartProps = {
  items: LocationBreakdownItem[];
};

const BAR_OPACITIES = [1, 0.82, 0.64, 0.46, 0.3];

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: LocationBreakdownItem;
  }>;
};

function CustomTooltip({ active, payload }: TooltipProps): JSX.Element | null {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-sm">
      <p className="text-sm font-medium text-[var(--color-ink)]">
        {item.locationName}
      </p>
      <p className="text-sm text-[var(--color-muted)]">{formatCurrency(item.total)}</p>
      <p className="text-xs text-[var(--color-muted)]">
        {item.percentage.toFixed(0)}% · {item.count}{" "}
        {item.count === 1 ? "movimiento" : "movimientos"}
      </p>
    </div>
  );
}

export default function LocationBreakdownChart({
  items,
}: LocationBreakdownChartProps): JSX.Element {
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
            dataKey="locationName"
            width={110}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--color-accent-bg)" }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]}>
            {items.map((item, index) => (
              <Cell
                key={item.locationId}
                fill="var(--color-accent)"
                fillOpacity={BAR_OPACITIES[index % BAR_OPACITIES.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
