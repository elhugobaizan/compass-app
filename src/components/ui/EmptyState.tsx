import type { ReactNode, JSX } from "react";

type EmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
};

export default function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center ${className}`}
    >
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}