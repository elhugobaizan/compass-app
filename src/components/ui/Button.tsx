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
      return "bg-compass-accent text-white hover:bg-gray-800 disabled:bg-gray-300";
    case "secondary":
      return "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 disabled:text-gray-400";
    case "ghost":
      return "bg-transparent text-gray-700 hover:bg-gray-100 disabled:text-gray-400";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300";
    case "danger-ghost":
      return "bg-transparent text-red-600 hover:bg-red-50 disabled:text-red-300";
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
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors";

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