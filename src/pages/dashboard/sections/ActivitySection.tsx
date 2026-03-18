import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";
import TransactionRow from "@/components/finance/TransactionRow";
import type { Transaction } from "@/types/transaction";
import { getRecentTransactions } from "@/utils/transactions";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

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
  const recentTransactions = getRecentTransactions(transactions || [], 3);
  const hasTransactions = !!recentTransactions?.length;
  const navigate = useNavigate();

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
            description="Cuando registres movimientos y saldos, vas a ver la evolución acá."
          />
        </PanelCard>

        <PanelCard
          title="Últimos movimientos"
          subtitle="Timeline resumido"
          className="h-64"
          action={
            hasTransactions ? (
              <Button variant="ghost" className={"px-2 py-1 text-xs"}
                onClick={() => navigate("/transactions")}
              >
                Ver todos
              </Button>
            ) : null
          }
        >
          {isLoading && <p className="text-sm text-gray-500">Cargando movimientos...</p>}

          {isError && (
            <EmptyState
              title="No pudimos cargar los movimientos"
              description="Revisá el backend o la conexión e intentá de nuevo."
              variant="error"
            />
          )}

          {!isLoading && !isError && recentTransactions?.length === 0 && (
            <EmptyState
              title="Todavía no hay movimientos"
              description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
            />
          )}

          {!isLoading && !isError && !!recentTransactions?.length && (
            <div className="h-full space-y-3 overflow-y-auto pr-1">
              {recentTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  amount={transaction.amount}
                  date={transaction.date}
                  concept={transaction.concept}
                  typeLabel={transaction.type.name || "unknown"}
                  categoryLabel={transaction.category?.name || "Sin categoría"}
                />
              ))}
            </div>
          )}
        </PanelCard>
      </div>
    </SectionBlock>
  );
}