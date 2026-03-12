import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Button, ConfigProvider, InputNumber, Modal } from "antd";
import { formStyles, formTheme } from "../../AppStyles";
import type { UsuarioInfo } from "../types";

export interface EditarActivosRealesModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  /** Valor actual Auto (en pesos) */
  readonly autoVal: number;
  /** Valor actual Casa (en dólares) */
  readonly casaVal: number;
  readonly autoId: string;
  readonly casaId: string;
  readonly onSave: (auto: UsuarioInfo, casa: UsuarioInfo) => Promise<void>;
}

export function EditarActivosRealesModal({
  visible,
  onClose,
  autoVal,
  casaVal,
  autoId,
  casaId,
  onSave,
}: EditarActivosRealesModalProps) {
  const [auto, setAuto] = useState(autoVal);
  const [casa, setCasa] = useState(casaVal);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setAuto(autoVal);
      setCasa(casaVal);
    }
  }, [visible, autoVal, casaVal]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(
        { Campo: "auto", Valor: auto, id: autoId },
        { Campo: "casa", Valor: casa, id: casaId }
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ConfigProvider theme={formTheme}>
      <Modal
        title="Editar activos reales"
        open={visible}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        styles={{ body: { paddingTop: 8 } }}
      >
        <View style={[formStyles.fieldContainer, { marginTop: 8 }]}>
          <Text style={formStyles.formLabel}>Auto (pesos)</Text>
          <InputNumber
            value={auto}
            onChange={(v) => setAuto(v ?? 0)}
            min={0}
            controls={false}
            style={{ ...formStyles.formInputRight, width: "100%" }}
            placeholder="0"
          />
        </View>
        <View style={formStyles.fieldContainer}>
          <Text style={formStyles.formLabel}>Casa (dólares)</Text>
          <InputNumber
            value={casa}
            onChange={(v) => setCasa(v ?? 0)}
            min={0}
            controls={false}
            style={{ ...formStyles.formInputRight, width: "100%" }}
            placeholder="0"
          />
        </View>
        <View style={[formStyles.formButtonRow, { justifyContent: "flex-end", gap: 8 }]}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Guardar
          </Button>
        </View>
      </Modal>
    </ConfigProvider>
  );
}
