import { JSX } from "react";
import Card from "@/components/ui/Card"
import AccountCard from "@/components/finance/AccountCard";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";

export default function DashboardWeb(): JSX.Element {

  const { data: accounts, isLoading, isError } = useAccountsQuery();

  return (
    <div className="space-y-6">
      <SectionBlock 
        title="Resumen"
        subtitle="Vista general de tu situación financiera"
      >
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <p className="text-sm text-gray-500">Patrimonio Neto</p>
            <p className="mt-2 text-2xl font-bold">$1.234.567</p>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">Liquidez</p>
            <p className="mt-2 text-2xl font-bold">$123.456</p>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">Deuda</p>
            <p className="mt-2 text-2xl font-bold">$12.345</p>
          </Card>
        </div>
      </SectionBlock>

      <SectionBlock
        title="Cuentas"
        subtitle="Wallets, bancos y brokers"
        action={<Button disabled>Ver todas</Button>}
      >
        {isLoading && <p className="text-sm text-gray-500">Cargando cuentas...</p>}

        {isError && (
          <EmptyState
            title="No pudimos cargar las cuentas"
            description="Revisá el backend o la conexión e intentá de nuevo."
          />
        )}
        <EmptyState
          title="No tenés cuentas cargadas"
          description="Creá tu primera cuenta para empezar a ver saldos, liquidez e inversiones."
          action={<Button>Crear cuenta</Button>}
        />

        {!isLoading && !isError && accounts?.length === 0 && (
          <EmptyState
            title="No tenés cuentas cargadas"
            description="Cuando agregues cuentas, las vas a ver acá."
          />
        )}

        {!isLoading && !isError && !!accounts?.length && (
          <div className="grid grid-cols-3 gap-6">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                name={account.name}
                institution={account.institution}
                currency={account.currency}
                accountType={account.account_type}
                accountGroup={String(account.account_group_id)}
                balance={account.opening_balance ?? "-"}
                isPaymentMethod={account.is_payment_method}
              />
            ))}
          </div>
        )}
      </SectionBlock>

      <SectionBlock
        title="Actividad"
        subtitle="Gráficos y movimientos recientes"
      >
        <div className="grid grid-cols-2 gap-6">
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
            <EmptyState
              title="Todavía no hay movimientos"
              description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
            />
          </PanelCard>
        </div>
      </SectionBlock>
    </div>
  );
}