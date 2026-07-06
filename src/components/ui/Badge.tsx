import { JSX, ReactNode } from "react";

export type BadgeTone = "neutral" | "warning" | "subtle" | "success" | "info" | "error";

type BadgeProps = {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]",
  warning: "bg-[#F6EAD5] text-[#8A5A2E]",
  subtle: "bg-[var(--color-accent-bg)] text-[var(--color-accent-text)]",
  success: "bg-[var(--color-income-bg)] text-[var(--color-income-text)]",
  info: "bg-[var(--color-accent-bg)] text-[var(--color-accent-text)]",
  error: "bg-[var(--color-expense-bg)] text-[var(--color-expense-text)]",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps): JSX.Element {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}