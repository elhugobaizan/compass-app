import type { ReactNode, JSX } from "react";

type PageHeaderProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}