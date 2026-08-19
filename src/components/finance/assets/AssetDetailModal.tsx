import { JSX } from "react";

import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import type { Asset } from "@/types/asset";
import type { Account } from "@/types/account";
import { getAssetValue, getAssetCurrency, getFixedDepositProjectedValue } from "@/utils/assets";
import { calculateAssetYield } from "@/utils/assetYield";
import { getAssetTypeConfig } from "@/utils/assetTypes";
import { formatCurrency } from "@/utils/formatters";
import { formatDate } from "@/utils/formatters";
import { getDaysFromToday } from "@/utils/date";
import { toNumber } from "@/utils/numbers";

type AssetDetailModalProps = {
  readonly asset: Asset | null;
  readonly accounts?: Account[];
  readonly accountName?: string;
  readonly onClose: () => void;
};

function Row({
  label,
  value,
  tone = "default",
}: {
  readonly label: string;
  readonly value: string;
  readonly tone?: "default" | "positive";
}): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span
        className={
          tone === "positive"
            ? "shrink-0 text-sm font-semibold text-[var(--color-income)]"
            : "shrink-0 text-sm font-medium text-[var(--color-ink)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function AssetDetailModal({
  asset,
  accounts = [],
  accountName,
  onClose,
}: AssetDetailModalProps): JSX.Element | null {
  if (!asset) return null;

  const currency = getAssetCurrency(asset, accounts);
  const visual = getAssetTypeConfig(asset.asset_type);
  const value = getAssetValue(asset);
  const projected = getFixedDepositProjectedValue(asset);
  const yieldInfo = calculateAssetYield(asset, accounts);
  const quantity = toNumber(asset.quantity);
  const price = toNumber(asset.price);
  const daysToMaturity = getDaysFromToday(asset.maturity);

  return (
    <Modal open={!!asset} title={asset.name} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{visual.label}</Badge>
          {asset.symbol && <Badge tone="subtle">{asset.symbol}</Badge>}
          {accountName && <Badge tone="info">{accountName}</Badge>}
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-3">
          <p className="text-xs text-[var(--color-muted)]">Valor actual</p>
          <p className="mt-1 font-serif text-xl font-semibold text-[var(--color-ink)]">
            {formatCurrency(value, currency)}
          </p>
        </div>

        <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {quantity > 0 && (
            <Row
              label="Cantidad"
              value={new Intl.NumberFormat("es-AR", {
                maximumFractionDigits: 8,
              }).format(quantity)}
            />
          )}

          {price > 0 && (
            <Row label="Precio unitario" value={formatCurrency(price, currency)} />
          )}

          {toNumber(asset.capital) > 0 && (
            <Row label="Capital" value={formatCurrency(toNumber(asset.capital), currency)} />
          )}

          {yieldInfo && <Row label="Tasa" value={`${yieldInfo.tna}% TNA`} />}

          {asset.start_date && (
            <Row label="Inicio" value={formatDate(asset.start_date)} />
          )}

          {asset.maturity && (
            <Row
              label="Vencimiento"
              value={
                daysToMaturity === null
                  ? formatDate(asset.maturity)
                  : `${formatDate(asset.maturity)} · ${
                      daysToMaturity === 0
                        ? "hoy"
                        : daysToMaturity > 0
                          ? `en ${daysToMaturity} días`
                          : `hace ${Math.abs(daysToMaturity)} días`
                    }`
              }
            />
          )}

          {projected !== null && (
            <Row
              label="Al vencimiento"
              value={formatCurrency(projected, currency)}
              tone="positive"
            />
          )}
        </ul>

        {yieldInfo && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-3">
              <p className="text-xs text-[var(--color-muted)]">Rinde por día</p>
              <p className="mt-1 font-serif text-base font-semibold text-[var(--color-income)]">
                {formatCurrency(yieldInfo.dailyYield, currency)}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-3">
              <p className="text-xs text-[var(--color-muted)]">Rinde por mes</p>
              <p className="mt-1 font-serif text-base font-semibold text-[var(--color-income)]">
                {formatCurrency(yieldInfo.monthlyYield, currency)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
