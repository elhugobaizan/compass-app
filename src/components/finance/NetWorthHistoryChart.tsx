import { JSX } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/utils/formatters";

type NetWorthHistoryItem = {
  month: string;
  netWorth: number;
};

type NetWorthHistoryChartProps = {
  readonly items: NetWorthHistoryItem[];
};

type TooltipProps = {
  readonly active?: boolean;
  readonly payload?: Array<{
    value: number;
    payload: NetWorthHistoryItem;
  }>;
};

function CustomTooltip({ active, payload }: TooltipProps): JSX.Element | null {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-sm font-medium text-gray-900">{item.month}</p>
      <p className="text-sm text-gray-600">{formatCurrency(item.netWorth)}</p>
    </div>
  );
}

export default function NetWorthHistoryChart({
  items,
}: NetWorthHistoryChartProps): JSX.Element {
  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={items} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="#1F2937"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}