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
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-0 ${className}`}
    >
      {children}
    </div>
  );
}