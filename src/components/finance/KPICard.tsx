import { JSX } from "react";
import Card from "../ui/Card";

type KPICardProps = {
  readonly label: string;
  readonly value: string | number;
  readonly subvalue?: string;
  readonly align?: "left" | "center" | "right";
};

export default function KPICard({
  label,
  value,
  subvalue,
  align = "left",
}: KPICardProps): JSX.Element {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : (align === "right"
      ? "items-end text-right"
      : "items-start text-left");

  return (
    <Card>
      <div className={`flex flex-col ${alignment}`}>
        <span className="text-sm text-gray-500">{label}</span>

        <span className="mt-1 text-2xl font-bold">
          {value}
        </span>

        {subvalue && (
          <span className="mt-1 text-xs text-gray-400">
            {subvalue}
          </span>
        )}
      </div>
    </Card>
  );
}