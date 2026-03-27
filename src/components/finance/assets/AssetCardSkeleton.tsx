import { JSX } from "react";

export default function AssetCardSkeleton(): JSX.Element {
  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="rounded-t-2xl border border-gray-100 bg-white px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-gray-100" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-12 animate-pulse rounded-md bg-gray-100" />
                </div>

                <div className="mt-2">
                  <div className="h-5 w-20 animate-pulse rounded-md bg-gray-100" />
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-3 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mt-1 ml-auto h-3 w-16 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border border-t-0 border-gray-100 bg-gray-50/70 px-4 py-3">
        <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}