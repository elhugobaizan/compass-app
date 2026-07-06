import { JSX } from "react";

import Card from "@/components/ui/Card";

type BillCardSkeletonProps = {
  readonly compact?: boolean;
};

export default function BillCardSkeleton({
  compact = false,
}: BillCardSkeletonProps): JSX.Element {
  return (
    <Card className={compact ? "rounded-xl p-3 my-3" : "rounded-xl p-4"}>
      <div className="animate-pulse">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className={
                compact
                  ? "h-9 w-9 shrink-0 rounded-xl bg-[var(--color-border)]"
                  : "h-10 w-10 shrink-0 rounded-xl bg-[var(--color-border)]"
              }
            />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-32 rounded bg-[var(--color-border)] sm:w-40" />
              <div className="mt-2 h-3 w-36 rounded bg-[var(--color-border)] sm:w-48" />

              <div className="mt-3 space-y-2">
                <div className="h-3 w-24 rounded bg-[var(--color-border)] sm:w-28" />
                <div className="h-3 w-32 rounded bg-[var(--color-border)] sm:w-40" />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="h-5 w-20 rounded-full bg-[var(--color-border)]" />
            <div
              className={
                compact
                  ? "h-5 w-20 rounded bg-[var(--color-border)]"
                  : "h-6 w-24 rounded bg-[var(--color-border)]"
              }
            />
          </div>


        </div>
        <div
          className={
            compact
              ? "mt-3 border-t border-[var(--color-border)] pt-3"
              : "mt-4 border-t border-[var(--color-border)] pt-4"
          }
        >
          <div className="flex items-end justify-between gap-3">
            <div className="h-3 w-10 rounded bg-[var(--color-border)]" />
            <div
              className={
                compact
                  ? "h-5 w-24 rounded bg-[var(--color-border)]"
                  : "h-6 w-28 rounded bg-[var(--color-border)]"
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}