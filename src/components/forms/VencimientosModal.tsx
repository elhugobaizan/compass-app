import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { VencimientosHoy } from '../utils';
import { NumberToMoney, useBreakpoint } from '../utils';
import { useTheme } from '../theme/ThemeProvider';
import { useModalStyles } from '../pages/Styles/styles';

type Props = Readonly<{
  visible: boolean;
  onClose: () => void;
  vencimientosHoy: VencimientosHoy;
}>;

export default function VencimientosModal({ visible, onClose, vencimientosHoy }: Props) {
  const device = useBreakpoint();
  const { theme } = useTheme();
  const modal = useModalStyles(device);
  return (
    <Modal visible={visible} transparent accessibilityLabel="Vencimientos hoy">
      <View style={modal.backdrop}>
        <View style={modal.expandedView}>
          <View style={modal.title}>
            <Text style={modal.titleText}>Vencimientos hoy</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <FontAwesome5 name="times" size={20} color={theme.colors.text.inverse} />
            </Pressable>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={modal.body} showsVerticalScrollIndicator bounces={false}>
            {vencimientosHoy.total === 0 ? (
              <Text style={modal.bodyText}>No hay vencimientos para hoy.</Text>
            ) : (
              <>
                {vencimientosHoy.impuestos.length > 0 && (
                  <>
                    <Text style={modal.sectionTitle}>Impuestos</Text>
                    {vencimientosHoy.impuestos.map((i) => (
                      <View key={i.id} style={modal.body}>
                        <Text style={modal.bodyText} numberOfLines={2}>{i.Detalle || i.Datos || 'Impuesto'}</Text>
                        <Text style={modal.bodyText}>{NumberToMoney(i.Deuda ?? 0)}</Text>
                      </View>
                    ))}
                  </>
                )}
                {vencimientosHoy.plazos.length > 0 && (
                  <>
                    <Text style={modal.sectionTitle}>Plazos fijos</Text>
                    {vencimientosHoy.plazos.map((p) => (
                      <View key={p.id} style={modal.body}>
                        <Text style={modal.bodyText} numberOfLines={2}>{p.Nombre}</Text>
                        <Text style={modal.bodyText}>{NumberToMoney(p.Capital ?? 0)} · {p.Periodo ?? ''}</Text>
                      </View>
                    ))}
                  </>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
