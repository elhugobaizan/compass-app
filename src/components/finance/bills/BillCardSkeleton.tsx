import { JSX } from "react";

export default function BillCardSkeleton(): JSX.Element {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-muted" />

          <div className="mt-3 space-y-2">
            <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-36 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-55 lg:items-end">
          <div className="flex flex-col lg:items-end">
            <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
            <div className="mt-1 h-6 w-24 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </article>
  );
}