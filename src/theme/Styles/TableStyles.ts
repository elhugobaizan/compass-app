import { BaseStylesProps } from "../../types";

export const baseTableStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};
  return {
    container: {
      justifyContent: 'flex-start' as const,
      paddingHorizontal: 0 as const,
      paddingVertical: 0 as const,
      margin: 0 as const,
      color: theme.colors.text.inverse,
      backgroundColor: theme.colors.background.app,
      minHeight: '100%' as const,
      height: '100%' as const,
    },
    wrapper: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    summaryCell: {
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.medium,
      color: theme.colors.text.primary,
    },
  }
};