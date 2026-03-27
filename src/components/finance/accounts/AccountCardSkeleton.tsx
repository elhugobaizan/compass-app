import { JSX } from "react";
import Card from "../../ui/Card";

type AccountCardSkeletonProps = {
  readonly compact?: boolean;
};

export default function AccountCardSkeleton({
  compact = false,
}: AccountCardSkeletonProps): JSX.Element {
  return (
    <Card className={compact ? "rounded-xl p-3" : "rounded-xl p-4"}>
      <div className="animate-pulse">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={
                compact
                  ? "h-9 w-9 shrink-0 rounded-xl bg-gray-200"
                  : "h-10 w-10 shrink-0 rounded-xl bg-gray-200"
              }
            />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-28 rounded bg-gray-100" />
            </div>
          </div>

          <div className="h-6 w-14 shrink-0 rounded-md bg-gray-200" />
        </div>

        <div
          className={
            compact
              ? "mt-3 border-t border-gray-100 pt-3"
              : "mt-4 border-t border-gray-100 pt-4"
          }
        >
          <div className="flex items-end justify-between gap-3">
            <div className="h-3 w-10 rounded bg-gray-100" />
            <div
              className={
                compact
                  ? "h-5 w-24 rounded bg-gray-200"
                  : "h-6 w-28 rounded bg-gray-200"
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}