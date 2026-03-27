import { JSX, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type HeaderAlertProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
};

export default function HeaderAlert({
  title,
  description,
  action,
}: HeaderAlertProps): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <AlertTriangle
          className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-900">{title}</p>

          {description && (
            <p className="mt-1 text-sm text-amber-800">{description}</p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}