import { Modal, View } from 'react-native';

import AnimatedCompass from './AnimatedLogo';

type LoadingModalProps = Readonly<{
  show?: boolean;
  text?: string;
}>;

export function LoadingModal({ show = false, text = '' }: LoadingModalProps) {
  if (!show) return null;

  return (
    <Modal visible accessibilityLabel={text || 'Cargando'} transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
        <AnimatedCompass transparentBackground size={100} loop withCircle={false} />
      </View>
    </Modal>
  );
}
