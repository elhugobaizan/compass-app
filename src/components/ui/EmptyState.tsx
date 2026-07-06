import type { ReactNode, JSX } from "react";

type EmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
  readonly variant?: string;
};

function getBorderColor(variant: string) {
  if (variant == "warning") return "border-[#C9942F]";
  if (variant == "error") return "border-[var(--color-expense)]";
  if (variant == "info") return "border-[var(--color-accent)]";
  return "border-[var(--color-border)]";
}

function getBackgroundColor(variant: string) {
  if (variant == "warning") return "bg-[#F6EAD5]";
  if (variant == "error") return "bg-[var(--color-expense-bg)]";
  if (variant == "info") return "bg-[var(--color-accent-bg)]";
  return "bg-[var(--color-paper)]";
}

export default function EmptyState({
  title,
  description,
  action,
  className = "",
  variant = "default",
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed ${getBorderColor(variant)} ${getBackgroundColor(variant)} px-6 py-8 text-center ${className}`}
    >
      <h3 className="font-serif text-base font-semibold text-[var(--color-ink)]">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}