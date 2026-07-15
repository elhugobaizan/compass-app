import { JSX } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/utils/formatters";
import type { DailyExpensePoint } from "@/utils/dailyExpenses";

type DailyExpensesChartProps = {
  readonly items: DailyExpensePoint[];
  readonly dailyMax?: number;
};

type TooltipProps = {
  readonly active?: boolean;
  readonly payload?: Array<{
    value: number;
    payload: DailyExpensePoint;
  }>;
};

function CustomTooltip({ active, payload }: TooltipProps): JSX.Element | null {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-sm">
      <p className="text-sm font-medium text-[var(--color-ink)]">Día {item.label}</p>
      <p className="text-sm text-[var(--color-muted)]">
        {formatCurrency(item.total)}
      </p>
    </div>
  );
}

export default function DailyExpensesChart({
  items,
  dailyMax,
}: DailyExpensesChartProps): JSX.Element {
  const hasMax = typeof dailyMax === "number" && dailyMax > 0;

  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={items} margin={{ top: 8, right: 12, left: 8, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />

          {hasMax && (
            <ReferenceLine
              y={dailyMax}
              stroke="var(--color-accent)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: `Máx diario ${formatCurrency(dailyMax)}`,
                position: "insideTopRight",
                fill: "var(--color-accent)",
                fontSize: 11,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--color-expense)"
            strokeWidth={2.5}
            dot={{ r: 2.5 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
