import { JSX, ReactNode } from "react";

export type BadgeTone = "neutral" | "warning" | "subtle" | "success" | "info" | "error";

type BadgeProps = {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border border-gray-200 bg-gray-50 text-gray-600",
  warning: "border border-amber-200 bg-amber-50 text-amber-800",
  subtle: "bg-gray-100 text-gray-600",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border border-blue-200 bg-blue-50 text-blue-700",
  error: "border border-red-200 bg-red-50 text-red-700",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps): JSX.Element {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}