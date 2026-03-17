import { JSX } from "react";
import Card from "../ui/Card";
import StatRow from "../ui/StatRow";

export default function BillCard(): JSX.Element {
  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Visa Santander</h3>

      <div className="space-y-2">
        <StatRow label="Vencimiento" value="15" muted />
        <StatRow label="Monto" value="$82.500" />
      </div>
    </Card>
  );
}