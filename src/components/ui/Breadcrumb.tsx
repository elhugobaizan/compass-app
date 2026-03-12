import type { CSSProperties } from "react";
import { theme } from "../theme";

export type BreadcrumbStep = Readonly<{
  label: string;
  onPress?: () => void;
}>;

type BreadcrumbProps = Readonly<{
  steps: readonly BreadcrumbStep[];
}>;

export function Breadcrumb({
  steps,
}: BreadcrumbProps) {
  const baseStyle: CSSProperties = {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    height: '20px' as const,
    width: 'auto' as const,
    backgroundColor: theme.colors.background.card,
  };
  const baseLinkStyle: CSSProperties = {
    color: theme.colors.text.primary,
    background: "none",
    border: 0,
    padding: 0,
    cursor: "pointer",
    font: "inherit",
  };
  const baseCurrentStyle: CSSProperties = {
    color: theme.colors.text.tertiary,
  };

  return (
    <div style={baseStyle}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const hasLink = typeof step.onPress === "function" && !isLast;
        return (
          <span key={`${step.label}-${index}`}>
            {hasLink ? (
              <button type="button" onClick={step.onPress} style={baseLinkStyle}>
                {step.label}
              </button>
            ) : (
              <span style={baseCurrentStyle}>{step.label}</span>
            )}
            {isLast ? null : " / "}
          </span>
        );
      })}
    </div>
  );
}
