import { JSX, ReactNode } from "react";

type SummaryCardProps = {
  readonly label: string;
  readonly value: string | number;
  readonly helperText?: string;
  readonly icon?: ReactNode;
  readonly valueClassName?: string;
  readonly className?: string;
};

export default function SummaryCard({
  label,
  value,
  helperText,
  icon,
  valueClassName = "",
  className = "",
}: SummaryCardProps): JSX.Element {
  return (
    <div
      className={[
        "rounded-2xl border border-gray-100 bg-white px-4 py-3",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">{label}</p>

          <p
            className={[
              "mt-1 text-lg font-semibold text-gray-900",
              valueClassName,
            ].join(" ")}
          >
            {value}
          </p>

          {helperText && (
            <p className="mt-1 text-xs text-gray-400">{helperText}</p>
          )}
        </div>

        {icon && <div className="shrink-0 text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}