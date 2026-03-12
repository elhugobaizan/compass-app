import { BaseStylesProps } from "../../types";

export const baseHeroStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};

  return {
    container: {
      padding: theme.spacing.md, 
      justifyContent: 'space-between', 
      maxWidth: '1440px', 
      backgroundColor: theme.colors.background.app
    },
    card: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      boxShadow: '0 2px 6px ' + theme.colors.overlay.light,
      height: '100%' as const,
    },
    label: {
      fontSize: isMobile ? theme.typography.size.md : theme.typography.size.sm,
      fontWeight: theme.typography.weight.medium,
      color: isMobile ? theme.colors.text.secondary : theme.colors.text.tertiary,
      marginBottom: isMobile ? 0 :theme.spacing.lg,
      marginTop: isMobile ? 0 : theme.spacing.sm,
    },
    title: {
      fontSize: isMobile ? theme.typography.size.xl : theme.typography.size.xxl,
      fontWeight: theme.typography.weight.bold,
      color: theme.colors.text.primary,
      letterSpacing: isMobile ? 0 : -0.5,
      paddingTop: isMobile ? 0 : theme.spacing.sm,
    },
    subtitle: {
      fontSize: isMobile ? theme.typography.size.lg : theme.typography.size.xl,
      fontWeight: theme.typography.weight.bold,
      color: theme.colors.text.primary,
      paddingTop: isMobile ? 0 : theme.spacing.sm,
    },
    meta: {
      fontSize: isMobile ? theme.typography.size.xs : theme.typography.size.sm,
      fontWeight: theme.typography.weight.regular,
      color: theme.colors.text.secondary,
    },
    metaSmall: {
      fontSize: isMobile ? theme.typography.size.xs : theme.typography.size.sm,
      fontWeight: theme.typography.weight.regular,
      color: theme.colors.text.muted,
    }
  }
};