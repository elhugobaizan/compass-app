import { JSX, ReactNode } from "react";

type PageHeaderProps = {
  readonly title: string;
  readonly description?: string;
  readonly alert?: ReactNode;
  readonly summary?: ReactNode;
  readonly action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  alert,
  summary,
  action,
}: PageHeaderProps): JSX.Element {
  return (
    <header className="space-y-4">
      <div className="flex flex-row gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>

        {action && (
          <div className="flex shrink-0 items-center md:justify-end">
            {action}
          </div>
        )}
      </div>

      {alert}

      {summary}
    </header>
  );
}