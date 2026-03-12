import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { palette, modalStyles } from '../../AppStyles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from 'react';

type ModalProps = {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly visible?: boolean;
  readonly onClose?: () => void;
};

export default function CustomModal({ children, title, icon, visible: controlledVisible, onClose }: ModalProps) {

  const [internalVisible, setInternalVisible] = useState(false);
  const isVisible = controlledVisible ?? internalVisible;

  const handleClose = () => {
    setInternalVisible(false);
    onClose?.();
  };

  return (
    <Modal visible={isVisible} transparent accessibilityLabel={title}>
      <View style={modalStyles.modalBack}>
        <View style={modalStyles.modalViewExpandable}>
          <View style={[modalStyles.modalTitle, { height: 56, minHeight: 56 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {icon}
              <Text style={{ fontWeight: 700, fontSize: 18, color: palette.textOnDark }}>{title}</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={12}>
              <FontAwesome5 name="times" size={20} color={palette.textOnDark} />
            </Pressable>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={modalStyles.modalBody}
            showsVerticalScrollIndicator
            bounces={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
