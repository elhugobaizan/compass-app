import { JSX } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Card from "../ui/Card";

type Tone = "neutral" | "positive" | "negative" | "info";
type TrendDirection = "up" | "down" | "neutral";
type TrendSentiment = "positive" | "negative" | "neutral";

type KPICardProps = {
  label: string;
  value?: string | number | null;
  isLoading?: boolean;
  subvalue?: string;
  align?: "left" | "center" | "right";
  size?: "default" | "featured";
  tone?: Tone;
  trend?: {
    value: string;
    direction: TrendDirection;
    sentiment?: TrendSentiment;
  };
};

function getToneStyles(tone: Tone) {
  switch (tone) {
    case "positive":
      return {
        value: "text-[var(--color-income)]",
        accent: "bg-[var(--color-income-bg)] border-[var(--color-border)]",
      };

    case "negative":
      return {
        value: "text-[var(--color-expense)]",
        accent: "bg-[var(--color-expense-bg)] border-[var(--color-border)]",
      };

    case "info":
      return {
        value: "text-[var(--color-accent)]",
        accent: "bg-[var(--color-accent-bg)] border-[var(--color-border)]",
      };

    default:
      return {
        value: "text-[var(--color-ink)]",
        accent: "bg-[var(--color-card)] border-[var(--color-border)]",
      };
  }
}

function getTrendIcon(direction: TrendDirection): JSX.Element {
  switch (direction) {
    case "up":
      return <ArrowUpRight className="h-3.5 w-3.5" />;
    case "down":
      return <ArrowDownRight className="h-3.5 w-3.5" />;
    default:
      return <Minus className="h-3.5 w-3.5" />;
  }
}

function getTrendColor(sentiment: TrendSentiment = "neutral"): string {
  switch (sentiment) {
    case "positive":
      return "text-[var(--color-income)]";
    case "negative":
      return "text-[var(--color-expense)]";
    default:
      return "text-[var(--color-muted)]";
  }
}

export default function KPICard({
  label,
  value,
  isLoading = false,
  subvalue,
  align = "left",
  size = "default",
  tone = "neutral",
  trend,
}: KPICardProps): JSX.Element {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  const { value: valueColor, accent } = getToneStyles(tone);

  const valueClass =
    size === "featured"
      ? `mt-2 w-full min-w-0 font-serif text-2xl font-bold leading-tight tabular-nums break-words ${valueColor}`
      : `mt-2 w-full min-w-0 font-serif text-2xl font-bold leading-tight tabular-nums break-words ${valueColor}`;

  const labelClass =
    size === "featured"
      ? "text-sm font-medium text-[var(--color-muted)]"
      : "text-sm text-[var(--color-muted)]";

  const trendColor = trend ? getTrendColor(trend.sentiment) : "";

  return (
    <Card className={`h-full border ${accent}`}>
      <div className={`flex h-full flex-col ${alignment}`}>
        <span className={labelClass}>{label}</span>

        {isLoading ? (
          <span className="mt-2 text-[var(--color-muted)]">Cargando...</span>
        ) : value !== null && value !== undefined ? (
          <span className={valueClass}>{value}</span>
        ) : (
          <span className="mt-2 font-serif text-2xl font-bold text-[var(--color-muted)]">—</span>
        )}

        {trend && (
          <div
            className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}
          >
            {getTrendIcon(trend.direction)}
            <span>{trend.value}</span>
          </div>
        )}

        {subvalue && (
          <span className="mt-2 text-xs text-[var(--color-muted)]">{subvalue}</span>
        )}
      </div>
    </Card>
  );
}