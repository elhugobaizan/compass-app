import { JSX } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import SectionBlock from "../../components/ui/SectionBlock";
import AccountCard from "../../components/finance/AccountCard";

export default function AccountsPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cuentas"
        description="Administrá wallets, bancos y brokers"
        action={<Button>Agregar cuenta</Button>}
      />

      <SectionBlock title="Listado">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
            name="ICBC Caja USD"
            institution="ICBC"
            currency="USD"
            accountType="BANK"
            accountGroup="LIQUID"
            balance="USD 1.200"
          />
        </div>
      </SectionBlock>
    </div>
  );
}