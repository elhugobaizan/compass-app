export default function DashboardMobile(): JSX.Element {
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Patrimonio Neto</p>
          <p className="mt-2 text-xl font-bold">$1.234.567</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Liquidez</p>
          <p className="mt-2 text-xl font-bold">$123.456</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Deuda</p>
          <p className="mt-2 text-xl font-bold">$12.345</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="font-semibold">Wallet ARS</h3>
          <p className="mt-2 text-sm text-gray-600">Monto: $123.456</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="font-semibold">Banco USD</h3>
          <p className="mt-2 text-sm text-gray-600">Monto: USD 1.200</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="font-semibold">Cripto</h3>
          <p className="mt-2 text-sm text-gray-600">BTC: 0.123</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <span className="text-sm text-gray-400">Gráfico</span>
        </div>

        <div className="flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <span className="text-sm text-gray-400">Timeline</span>
        </div>
      </section>
    </div>
  );
}