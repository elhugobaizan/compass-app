import type { ButtonHTMLAttributes, ReactNode, JSX } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors";

  const variantClasses =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300"
      : variant === "secondary"
      ? "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 disabled:text-gray-400"
      : "bg-transparent text-gray-700 hover:bg-gray-100 disabled:text-gray-400";

  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}