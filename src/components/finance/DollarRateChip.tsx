import { JSX } from "react";
import { useDollarRate } from "@/hooks/queries/useDollarRate";
import { formatCurrency } from "@/utils/formatters";

export default function DollarRateChip(): JSX.Element | null {
  const { data, isLoading, isError } = useDollarRate();

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-muted)]" />
        <span className="text-xs text-[var(--color-muted)]">Dólar blue…</span>
      </div>
    );
  }

  if (isError || !data) return null;

  const updated = new Date(data.fechaActualizacion);
  const updatedLabel = updated.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-1.5"
      title={`Actualizado ${updatedLabel}`}
    >
      <span className="text-xs font-semibold text-[var(--color-ink)]">
        Dólar blue
      </span>
      <span className="text-xs text-[var(--color-muted)]">
        compra {formatCurrency(data.compra)} · venta {formatCurrency(data.venta)}
      </span>
    </div>
  );
}
