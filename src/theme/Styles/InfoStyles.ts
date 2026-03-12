import { BaseStylesProps } from "../../types";

export const baseInfoStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};
  return {
    card: {
      backgroundColor: theme.colors.background.card,
      borderRadius: isMobile ? theme.radius.lg: theme.radius.sm,
      padding: theme.spacing.lg,
    },

    container: {
      flexDirection: 'row',
      alignItems: 'center'
    },

    left: {
      marginRight: theme.spacing.md,
      justifyContent: 'center' as const,
      flex: 1,
    },

    center: {
      flex: 1,
      marginRight: theme.spacing.md,
    },

    right: {
      alignItems: 'flex-end' as const,
      justifyContent: 'center' as const,
      minWidth: 140,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },

    name: {
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.weight.medium,
      color: theme.colors.text.primary,
    },

    value: {
      fontSize: theme.typography.size.lg,
      fontWeight: theme.typography.weight.medium,
      color: theme.colors.text.primary,
    },
    itemInner: {
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      paddingLeft: isMobile ? theme.spacing.xs : theme.spacing.xl,
      paddingRight: isMobile ? theme.spacing.xs : theme.spacing.xl,
    },
    itemSubtitle: {
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.weight.medium,
      color: theme.colors.text.secondary,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
  }
};

