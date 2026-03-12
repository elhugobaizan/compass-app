import { Text, View } from 'react-native';
import { useBreakpoint } from '../utils';
import { theme } from '../theme/theme';
import { CompassIcon } from './Glyphs/icons';

export type ListEmptyStateProps = Readonly<{
  /** Mensaje que se muestra debajo del icono */
  message: string;
  /** Nombre del icono de FontAwesome5 (ej: "inbox", "folder-open"). Por defecto "inbox" */
  icon?: string;
}>;

export default function ListEmptyState({ message, icon = 'inbox' }: ListEmptyStateProps) {
  const { isMobile } = useBreakpoint();

  const iconSize = isMobile ? 56 : 40;
  const iconColor = theme.colors.text.muted;
  const paddingVertical = isMobile ? theme.spacing.xxl * 2 : theme.spacing.xxl;
  const gap = isMobile ? theme.spacing.lg : theme.spacing.md;
  const fontSize = isMobile ? theme.typography.size.xl : theme.typography.size.lg;
  const fontWeight = theme.typography.weight.semibold;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical,
        paddingHorizontal: theme.spacing.lg,
      }}
    >
      <View style={{ marginBottom: gap }}>
        <CompassIcon name={icon} size={iconSize} color={iconColor} />
      </View>
      <Text
        style={{
          fontSize,
          fontWeight,
          color: theme.colors.text.secondary,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
    </View>
  );
}
