import { JSX } from "react";

type TransactionCardSkeletonProps = {
  readonly count?: number;
  readonly showActions?: boolean;
};

function TransactionCardSkeletonItem({
  showActions,
}: {
  readonly showActions: boolean;
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 ml-auto h-5 w-24 animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-100" />
        </div>
      )}
    </div>
  );
}

export default function TransactionCardSkeleton({
  count = 4,
  showActions = false,
}: TransactionCardSkeletonProps): JSX.Element {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <TransactionCardSkeletonItem
          key={index}
          showActions={showActions}
        />
      ))}
    </div>
  );
}