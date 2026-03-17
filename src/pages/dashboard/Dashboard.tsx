import { JSX } from 'react';
import LayoutMobile from "../../layouts/LayoutMobile";
import LayoutWeb from "../../layouts/LayoutWeb";
import {useBreakpoint} from "../../utils/utils";
import SectionBlock from '@/components/ui/SectionBlock';
import KPICard from '@/components/finance/KPICard';
import Button from '@/components/ui/Button';
import { useAccountsQuery } from '@/hooks/queries/useAccountsQuery';
import { useTransactionsQuery } from '@/hooks/queries/useTransactionsQuery';
import EmptyState from '@/components/ui/EmptyState';
import AccountCard from '@/components/finance/AccountCard';
import PanelCard from '@/components/ui/PanelCard';
import TransactionRow from '@/components/finance/TransactionRow';

export default function Dashboard(): JSX.Element {
  const { isMobile } = useBreakpoint();

  const { data: accounts, isLoading, isError } = useAccountsQuery();
  const { data: transactions, isLoading: isLoadingTx, isError: isErrorTx } = useTransactionsQuery();
  const hasData = accounts && accounts?.length > 0;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <SectionBlock 
        title="Resumen"
        subtitle={isMobile ? undefined : "Vista general de tu situación financiera"}
      >

        {(!hasData && !isLoading) && (
          <p className="text-sm text-gray-500">
            Todavía no hay datos suficientes para calcular el resumen.
          </p>
        )}

        <div className={isMobile ? "grid grid-cols-1 gap-4" : "grid grid-cols-3 gap-6"}>
          <KPICard label="Patrimonio Neto" value={null} isLoading={isLoading} />
          <KPICard label="Liquidez" value={null} isLoading={isLoading} />
          <KPICard label="Deuda" value={null} isLoading={isLoading} />
        </div>
      </SectionBlock>

      <SectionBlock
        title="Cuentas"
        subtitle={isMobile ? undefined : "Wallets, bancos y brokers"}
        action={<Button disabled>Ver todas</Button>}
      >
        {isLoading && <p className="text-sm text-gray-500">Cargando cuentas...</p>}

        {isError && (
          <EmptyState
            title="No pudimos cargar las cuentas"
            description="Revisá el backend o la conexión e intentá de nuevo."
            variant="error"
          />
        )}

        {!isLoading && !isError && accounts?.length === 0 && (
          <EmptyState
            title="No tenés cuentas cargadas"
            description="Cuando agregues cuentas, las vas a ver acá."
          />
        )}

        {!isLoading && !isError && !!accounts?.length && (
          <div className={isMobile ? "space-y-4" : "grid grid-cols-3 gap-6"}>
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
        subtitle={isMobile ? undefined : "Gráficos y movimientos recientes"}
      >
        <div className={isMobile ? "space-y-4": "grid grid-cols-2 gap-6"}>
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
            {isLoadingTx && <p className="text-sm text-gray-500">Cargando movimientos...</p>}

            {isErrorTx && (
              <EmptyState
                title="No pudimos cargar los movimientos"
                description="Revisá el backend o la conexión e intentá de nuevo."
                variant="error"
              />
            )}

            {!isLoadingTx && !isErrorTx && transactions?.length === 0 && (
              <EmptyState
                title="Todavía no hay movimientos"
                description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
              />
            )}            

            {!isLoadingTx && !isErrorTx && !!transactions?.length && (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  amount={transaction.amount}
                  date={transaction.date}
                  concept={transaction.concept}
                />
              ))
            )}            
          </PanelCard>
        </div>
      </SectionBlock>
    </div>    
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}