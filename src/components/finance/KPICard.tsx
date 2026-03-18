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
        value: "text-green-600",
        accent: "bg-green-50 border-green-100",
      };

    case "negative":
      return {
        value: "text-red-600",
        accent: "bg-red-50 border-red-100",
      };

    case "info":
      return {
        value: "text-blue-600",
        accent: "bg-blue-50 border-blue-100",
      };

    default:
      return {
        value: "text-gray-900",
        accent: "bg-white border-gray-200",
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
      return "text-green-600";
    case "negative":
      return "text-red-600";
    default:
      return "text-gray-400";
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
      ? `mt-2 text-3xl font-bold md:text-3xl ${valueColor}`
      : `mt-2 text-2xl font-bold ${valueColor}`;

  const labelClass =
    size === "featured"
      ? "text-sm font-medium text-gray-600"
      : "text-sm text-gray-500";

  const trendColor = trend ? getTrendColor(trend.sentiment) : "";

  return (
    <Card className={`h-full border ${accent}`}>
      <div className={`flex h-full flex-col ${alignment}`}>
        <span className={labelClass}>{label}</span>

        {isLoading ? (
          <span className="mt-2 text-gray-400">Cargando...</span>
        ) : value !== null && value !== undefined ? (
          <span className={valueClass}>{value}</span>
        ) : (
          <span className="mt-2 text-2xl font-bold text-gray-300">—</span>
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
          <span className="mt-2 text-xs text-gray-400">{subvalue}</span>
        )}
      </div>
    </Card>
  );
}