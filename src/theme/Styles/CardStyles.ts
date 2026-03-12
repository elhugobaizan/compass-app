import { BaseStylesProps } from "../../types";

export const baseCardStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};
  return {
    container: {
      backgroundColor: theme.colors.background.card,
      borderRadius: isMobile ? theme.radius.lg: theme.radius.sm,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      boxShadow: '0 2px 6px ' + theme.colors.overlay.light,
      flexDirection: 'column' as const,
      gap: theme.spacing.xs,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'baseline' as const,
      justifyContent: 'flex-start' as const,
      gap: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.size.xl,
      fontWeight: theme.typography.weight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    icon: {
      color: theme.colors.goals.primary,
    },
    footer: {},
    label: {
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.weight.medium,
      color: theme.colors.text.secondary,
    },
    labelSmall: {
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.regular,
      color: theme.colors.text.muted,
    },
    value: {
      fontSize: theme.typography.size.xxl,
      fontWeight: theme.typography.weight.semibold,
      color: theme.colors.text.primary,
    },
  }
};