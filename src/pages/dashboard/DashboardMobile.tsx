import { JSX } from "react";
import KPICard from "@/components/finance/KPICard";
import AccountCard from "@/components/finance/AccountCard";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";

export default function DashboardMobile(): JSX.Element {
  return (
    <div className="space-y-4">
      <SectionBlock
        title="Actividad"
        subtitle="Gráficos y movimientos recientes"
      >
        <div className="grid grid-cols-1 gap-4">
          <KPICard label="Patrimonio Neto" value="$1.234.567" />
          <KPICard label="Liquidez" value="$123.456" />
          <KPICard label="Deuda" value="$12.345" />
        </div>
      </SectionBlock>

      <SectionBlock title="Cuentas">
        <div className="space-y-4">
          <AccountCard 
            name="Lemon Wallet" 
            institution="Lemon"
            currency="ARS"
            accountType="WALLET"
            accountGroup="LIQUID"
            balance="$123.456"
            isPaymentMethod          
          />
          <AccountCard 
            name="Lemon Wallet" 
            institution="Lemon"
            currency="ARS"
            accountType="WALLET"
            accountGroup="LIQUID"
            balance="$123.456"
            isPaymentMethod          
          />
          <AccountCard 
            name="Lemon Wallet" 
            institution="Lemon"
            currency="ARS"
            accountType="WALLET"
            accountGroup="LIQUID"
            balance="$123.456"
            isPaymentMethod          
          />
        </div>
      </SectionBlock>

      <SectionBlock title="Actividad">
        <div className="space-y-4">
          <PanelCard
            title="Evolución mensual"
            subtitle="Patrimonio y liquidez"
            className="h-48"
          >
            <EmptyState
              title="Todavía no hay movimientos"
              description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
            />
          </PanelCard>
          <PanelCard
            title="Últimos movimientos"
            subtitle="Resumen reciente"
            className="h-48"
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