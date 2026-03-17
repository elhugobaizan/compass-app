import type { ReactNode, JSX } from "react";
import Card from "./Card";

type PanelCardProps = {
  readonly title?: string;
  readonly subtitle?: string;
  readonly children?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
};

export default function PanelCard({
  title,
  subtitle,
  children,
  action,
  className = "",
}: PanelCardProps): JSX.Element {
  return (
    <Card className={`flex h-full flex-col ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </Card>
  );
}