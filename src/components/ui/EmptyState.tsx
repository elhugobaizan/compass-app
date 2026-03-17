import type { ReactNode, JSX } from "react";

type EmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
  readonly variant?: string;
};

function getBorderColor(variant: string)  {
  if(variant == "warning") return "border-yellow-500";
  if(variant == "error") return "border-red-500";
  return "border-gray-300";
}

function getBackgroundColor(variant: string)  {
  if(variant == "warning") return "bg-yellow-50";
  if(variant == "error") return "bg-red-50";
  return "bg-gray-50";
}

export default function EmptyState({
  title,
  description,
  action,
  className = "",
  variant = "info",
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed ${getBorderColor(variant)} ${getBackgroundColor(variant)} px-6 py-8 text-center ${className}`}
    >
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}