import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import type { NetWorthBlock } from "@/utils/analyticsKPIs";
import { formatCurrency } from "@/utils/formatters";

type NetWorthBreakdownModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly blocks: NetWorthBlock[];
  readonly total: number;
};

export default function NetWorthBreakdownModal({
  open,
  onClose,
  blocks,
  total,
}: NetWorthBreakdownModalProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Composición del patrimonio">
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-muted)]">
          Cómo se compone tu patrimonio neto por bloque.
        </p>

        {blocks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-4 text-center text-sm text-[var(--color-muted)]">
            Todavía no hay datos para desglosar.
          </div>
        ) : (
          <ul className="space-y-3">
            {blocks.map((block) => {
              const share = total > 0 ? (block.value / total) * 100 : 0;

              return (
                <li key={block.key} className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-ink)]">
                      {block.label}
                    </span>
                    <span className="shrink-0 font-serif text-sm font-semibold text-[var(--color-ink)]">
                      {formatCurrency(block.value)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-paper)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-accent)]"
                        style={{ width: `${Math.max(0, Math.min(100, share))}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs text-[var(--color-muted)]">
                      {share.toFixed(0)}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <span className="text-sm font-medium text-[var(--color-ink)]">
            Patrimonio neto
          </span>
          <span className="font-serif text-base font-semibold text-[var(--color-ink)]">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </Modal>
  );
}
