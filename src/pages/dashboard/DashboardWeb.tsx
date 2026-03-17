import { JSX } from "react";
import Card from "@/components/ui/Card"
// import AccountCard from "@/components/finance/AccountCard";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export default function DashboardWeb(): JSX.Element {
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
        <EmptyState
          title="No tenés cuentas cargadas"
          description="Creá tu primera cuenta para empezar a ver saldos, liquidez e inversiones."
          action={<Button>Crear cuenta</Button>}
        />
        <div className="grid grid-cols-3 gap-6">
{/*           <AccountCard 
              name="Lemon Wallet" 
              institution="Lemon"
              currency="ARS"
              accountType="WALLET"
              accountGroup="LIQUID"
              balance="$123.456"
              isPaymentMethod          
            />
          <AccountCard 
            name="ICBC Caja USD"
            institution="ICBC"
            currency="USD"
            accountType="BANK"
            accountGroup="LIQUID"
            balance="USD 1.200"    
          />
          <AccountCard 
            name="Lemon Crypto"
            institution="Lemon"
            currency="MULTI"
            accountType="BROKER"
            accountGroup="INVESTMENT"
            balance="$456.789"       
          /> */}
        </div>
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