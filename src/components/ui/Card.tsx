import type { ReactNode, JSX } from "react";

type CardProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps): JSX.Element {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-[0_1px_4px_rgba(46,42,36,0.04)] mb-0 ${className}`}
    >
      {children}
    </div>
  );
}