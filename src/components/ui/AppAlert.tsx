import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type AppAlertProps = Readonly<{
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}>;

/** Fondo del snackbar tipo MUI (dark surface). */

/**
 * Alerta estilo MUI Snackbar/Toast para web: barra en la parte inferior,
 * fondo oscuro, mensaje y acción, sin overlay que bloquee la pantalla.
 */
export function AppAlert({ visible, title, message, onClose }: AppAlertProps) {
  if (!visible) return null;

  const displayMessage = title ? `${title}: ${message}` : message;

  return (
    <Modal visible transparent animationType="slide" accessibilityLabel={title || displayMessage} accessibilityRole="alert">
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.snackbar}>
          <Text style={styles.message} numberOfLines={3}>
            {displayMessage}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
          >
            <Text style={styles.actionText}>CERRAR</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.error.background,
    borderColor: colors.error.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
    maxWidth: 600,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 16,
  },
  action: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionPressed: {
    opacity: 0.8,
  },
  actionText: {
    color: colors.error.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
