import { JSX } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/utils/formatters";

type Item = {
  month: string;
  income: number;
  expense: number;
};

type Props = {
  readonly items: Item[];
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 shadow-sm">
      <p className="text-sm font-medium text-[var(--color-ink)]">{data.month}</p>
      <p className="text-sm text-[var(--color-muted)]">
        Ingresos: {formatCurrency(data.income)}
      </p>
      <p className="text-sm text-[var(--color-muted)]">
        Gastos: {formatCurrency(data.expense)}
      </p>
    </div>
  );
}

export default function IncomeExpenseChart({
  items,
}: Props): JSX.Element {
  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items}>
          <XAxis dataKey="month" />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}