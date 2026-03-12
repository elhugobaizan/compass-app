import { View } from 'react-native';
import VencimientosModal from '../components/VencimientosModal';
import type { VencimientosHoy } from '../utils';

type Props = Readonly<{
  vencimientosHoy: VencimientosHoy;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
  viewAlerts: () => void;
  viewUser: () => void;
  children: React.ReactNode;
}>;

export default function MobileLayout({
  vencimientosHoy,
  isVisible,
  setIsVisible,
  children,
}: Props) {
  return (
    <View style={{ flex: 1, height: '100%', width: '100%', padding: 0, margin: 0 }}>
      <View style={{ flex: 1, padding: 0 }}>
        {children}
      </View>
      <VencimientosModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        vencimientosHoy={vencimientosHoy}
      />
    </View>
  );
}
