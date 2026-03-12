import { BaseStylesProps } from "../../types";

export const baseHeaderStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};

  return {
    button: {
      backgroundColor: isMobile ? theme.colors.primary[400] : theme.colors.primary.main,
      color: theme.colors.text.inverse,
      width: isMobile ? ('100%' as const) : ('auto' as const),
    },
    container: {
      paddingTop: isMobile ? theme.spacing.sm : theme.spacing.md,
      paddingBottom: isMobile ? theme.spacing.md : theme.spacing.lg,
      paddingLeft: isMobile ? theme.spacing.sm : theme.spacing.xl,
      paddingRight: isMobile ? theme.spacing.sm : theme.spacing.xl,
      justifyContent: 'space-between' as const,
      backgroundColor: theme.colors.background.app,
      flexDirection: isMobile ? 'column' as const : ('row' as const),
      alignItems: 'center' as const,
    },
    left: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.size.lg,
      color: theme.colors.text.primary,
      fontWeight: theme.typography.weight.bold,
      marginBottom: isMobile ? theme.spacing.sm : theme.spacing.md,
      marginTop: isMobile ? theme.spacing.sm : theme.spacing.md,
      marginLeft: isMobile ? 0 : theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.typography.size.md,
      color: theme.colors.text.secondary,
      marginBottom: isMobile ? theme.spacing.sm : theme.spacing.md,
      marginLeft: isMobile ? 0 : theme.spacing.md,
    },
    actions: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      width: isMobile ? ('100%' as const) : ('auto' as const),
    }
  }
};