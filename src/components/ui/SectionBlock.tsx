import { JSX } from "react";
import type { ReactNode } from "react";

type SectionBlockProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
  readonly action?: ReactNode;
};

export default function SectionBlock({
  title,
  subtitle,
  children,
  action,
}: SectionBlockProps): JSX.Element {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {children}
    </section>
  );
}