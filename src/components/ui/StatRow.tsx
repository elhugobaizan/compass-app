import { JSX } from "react";

type StatRowProps = {
  readonly label: string;
  readonly value: string | number;
  readonly muted?: boolean;
};

export default function StatRow({
  label,
  value,
  muted = false,
}: StatRowProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium ${
          muted ? "text-gray-500" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}