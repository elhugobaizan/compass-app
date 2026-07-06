import type { ButtonHTMLAttributes, ReactNode, JSX } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "danger-ghost";

type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:opacity-90 disabled:opacity-50";
    case "secondary":
      return "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-[var(--color-accent-bg)] disabled:opacity-50";
    case "ghost":
      return "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-accent-bg)] disabled:opacity-50";
    case "danger":
      return "bg-[var(--color-expense)] text-white hover:opacity-90 disabled:opacity-50";
    case "danger-ghost":
      return "bg-transparent text-[var(--color-expense-text)] hover:bg-[var(--color-expense-bg)] disabled:opacity-50";
  }
}

function getSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "px-3 py-1.5 text-xs";
    case "md":
      return "px-4 py-2 text-sm";
  }
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors";

  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant);
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}