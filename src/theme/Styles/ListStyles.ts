import { Platform } from "react-native";
import { BaseStylesProps } from "../../types";

export const baseListStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};
  const isWeb = Platform.OS === 'web';
  const baseContainer = {
    gap: theme.spacing.md,
    marginLeft: isMobile ? theme.spacing.md : 0,
    marginRight: isMobile ? theme.spacing.md : 0,
    paddingLeft: isMobile ? 0 : theme.spacing.md,
    paddingRight: isMobile ? 0 : theme.spacing.md,
    paddingBottom: isMobile ? 0 : theme.spacing.sm,
    paddingTop: isMobile ? 0 : theme.spacing.sm,
    backgroundColor: theme.colors.background.cardBackground,
  };
  const container = isWeb
    ? { ...baseContainer, display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))' }
    : { ...baseContainer, flexDirection: 'column' as const };

  return {
    container,
    item: {
      title: {
        fontSize: theme.typography.size.md,
        fontWeight: theme.typography.weight.semibold,
        textAlign: 'left' as const,
        color: theme.colors.text.primary,
      }
    },
  }
};