import { JSX, useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";
import SectionBlock from "@/components/ui/SectionBlock";
import Button from "@/components/ui/Button";
import { useSettingsQuery } from "@/hooks/queries/useSettingsQuery";
import { useUpdateSetting } from "@/hooks/mutations/useUpdateSetting";
import { toNumber } from "@/utils/numbers";

type EditableSettings = {
  sueldo?: string;
  dolares?: string;
  reserva?: string;
  casa?: string;
  auto?: string;
  efectivo?: string;
  deuda?: string;
};

export default function SettingsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const { data: settings = [] } = useSettingsQuery();
  const { mutateAsync: updateSetting, isPending } = useUpdateSetting();

  const [values, setValues] = useState<EditableSettings>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const newValues: EditableSettings = {};
    settings.forEach((s) => {
      if (
        ["sueldo", "dolares", "reserva", "casa", "auto", "efectivo", "deuda"].includes(
          s.key,
        )
      ) {
        newValues[s.key as keyof EditableSettings] = String(toNumber(s.value));
      }
    });
    setValues(newValues);
  }, [settings]);

  async function handleSave() {
    try {
      await Promise.all(
        Object.entries(values).map(([key, value]) =>
          updateSetting({ key, value: value ? Number(value) : null }),
        ),
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error guardando ajustes:", error);
    }
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title={isMobile ? "Ajustes" : ""}
        description={
          isMobile
            ? undefined
            : "Configuración y preferencias de la aplicación."
        }
      />

      <SectionBlock title="Datos personales" subtitle="Información financiera">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Sueldo mensual
            </label>
            <input
              type="number"
              value={values.sueldo || ""}
              onChange={(e) => setValues({ ...values, sueldo: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="2.140.000"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Se usa para calcular el disponible
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Tipo de cambio USD
            </label>
            <input
              type="number"
              step="0.01"
              value={values.dolares || ""}
              onChange={(e) => setValues({ ...values, dolares: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="27.793.168,19"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Para convertir montos a USD
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Reserva / Objetivo de ahorro
            </label>
            <input
              type="number"
              value={values.reserva || ""}
              onChange={(e) => setValues({ ...values, reserva: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="2.000.000"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Meta de ahorro mensual
            </p>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Patrimonio adicional" subtitle="Otros activos">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Casa
            </label>
            <input
              type="number"
              value={values.casa || ""}
              onChange={(e) => setValues({ ...values, casa: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Auto
            </label>
            <input
              type="number"
              value={values.auto || ""}
              onChange={(e) => setValues({ ...values, auto: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Efectivo
            </label>
            <input
              type="number"
              value={values.efectivo || ""}
              onChange={(e) => setValues({ ...values, efectivo: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Deuda
            </label>
            <input
              type="number"
              value={values.deuda || ""}
              onChange={(e) => setValues({ ...values, deuda: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="0"
            />
          </div>
        </div>
      </SectionBlock>

      <div className="flex gap-2">
        <Button
          fullWidth
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
        {saved && (
          <div className="flex items-center rounded-lg border border-[var(--color-income-bg)] bg-[var(--color-income-bg)] px-3 py-2">
            <span className="text-sm text-[var(--color-income-text)]">✓ Guardado</span>
          </div>
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}