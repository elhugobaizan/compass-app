import { JSX, ReactNode } from "react";
import clsx from "clsx";

type AccountCardListProps = {
  readonly children: ReactNode;
  readonly compact?: boolean;
};

export default function AccountCardList({
  children,
  compact = false,
}: AccountCardListProps): JSX.Element {
  return (
    <div
      className={clsx(
        "grid",
        compact
          ? "grid-cols-1 gap-3"
          : "grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}