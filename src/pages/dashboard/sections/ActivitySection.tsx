import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";
import TransactionRow from "@/components/finance/TransactionRow";
import type { Transaction } from "@/types/transaction";

type ActivitySectionProps = {
  readonly isMobile: boolean;
  readonly transactions?: Transaction[];
  readonly isLoading: boolean;
  readonly isError: boolean;
};

export default function ActivitySection({
  isMobile,
  transactions,
  isLoading,
  isError,
}: ActivitySectionProps): JSX.Element {
  return (
    <SectionBlock
      title="Actividad"
      subtitle={isMobile ? undefined : "Gráficos y movimientos recientes"}
    >
      <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-6"}>
        <PanelCard
          title="Evolución mensual"
          subtitle="Patrimonio, liquidez e inversión"
          className="h-64"
        >
          <EmptyState
            title="Todavía no hay movimientos"
            description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
          />
        </PanelCard>

        <PanelCard
          title="Últimos movimientos"
          subtitle="Timeline resumido"
          className="h-64"
        >
          {isLoading && <p className="text-sm text-gray-500">Cargando movimientos...</p>}

          {isError && (
            <EmptyState
              title="No pudimos cargar los movimientos"
              description="Revisá el backend o la conexión e intentá de nuevo."
              variant="error"
            />
          )}

          {!isLoading && !isError && transactions?.length === 0 && (
            <EmptyState
              title="Todavía no hay movimientos"
              description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
            />
          )}

          {!isLoading && !isError && !!transactions?.length && (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  amount={transaction.amount}
                  date={transaction.date}
                  concept={transaction.concept}
                />
              ))}
            </div>
          )}
        </PanelCard>
      </div>
    </SectionBlock>
  );
}