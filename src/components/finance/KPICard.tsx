import { JSX } from "react";
import Card from "../ui/Card";

type KPICardProps = {
  readonly label: string;
  readonly value?: string | number | null;
  readonly isLoading?: boolean;
};

export default function KPICard({
  label,
  value,
  isLoading = false,
}: KPICardProps): JSX.Element {
  return (
    <Card>
      <div className="flex flex-col items-start">
        <span className="text-sm text-gray-500">{label}</span>

        {isLoading ? (
          <span className="mt-2 text-gray-400">Cargando...</span>
        ) : value !== null && value !== undefined ? (
          <span className="mt-2 text-2xl font-bold">{value}</span>
        ) : (
          <span className="mt-2 text-gray-400">—</span>
        )}
      </div>
    </Card>
  );
}