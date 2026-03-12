import { BaseStylesProps } from "../../types";

export const basePanelStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};
  return {
      overlay: {
        position: "absolute" as const,
        top: 0 as const,
        right: -theme.spacing.xxl,
        bottom: 0 as const,
        left: -theme.spacing.xxl,
        flexDirection: "row" as const,
      },
    
      backdrop: {
        flex: 1 as const,
        backgroundColor: "rgba(0,0,0,0.25)" as const,
      },
    
      panel: {
        width: 440 as const,
        backgroundColor: theme.colors.background.card,
        borderLeftWidth: 1 as const,
        borderLeftColor: theme.colors.border.light,
        padding: theme.spacing.xxl,
      },
    
      header: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        marginBottom: theme.spacing.xl,
      },
    
      walletName: {
        fontSize: theme.typography.size.lg,
        fontWeight: theme.typography.weight.semibold,
        color: theme.colors.text.primary,
      },
    
      walletTna: {
        fontSize: theme.typography.size.sm,
        color: theme.colors.text.muted,
        marginTop: theme.spacing.xs,
      },
    
      close: {
        fontSize: theme.typography.size.lg,
        color: theme.colors.text.muted,
      },
    
      balanceBlock: {
        marginBottom: theme.spacing.xxl,
      },
    
      balance: {
        fontSize: theme.typography.size.xxl,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.text.primary,
      },
    
      share: {
        fontSize: theme.typography.size.sm,
        color: theme.colors.text.muted,
        marginTop: theme.spacing.xs,
      },
    
      section: {
        marginBottom: theme.spacing.xxl,
      },
    
      sectionTitle: {
        fontSize: theme.typography.size.sm,
        textTransform: "uppercase" as const,
        color: theme.colors.text.muted,
        marginBottom: theme.spacing.sm,
        letterSpacing: 1 as const,
      },
    
      row: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        paddingVertical: theme.spacing.sm,
      },
    
      rowLabel: {
        fontSize: theme.typography.size.md,
        color: theme.colors.text.primary,
      },
    
      rowValue: {
        fontSize: theme.typography.size.md,
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weight.medium,
      },
    
      highlight: {
        color: theme.colors.financial.liquid,
        fontWeight: theme.typography.weight.semibold,
      },
    
      actions: {
        marginTop: "auto" as const,
      },
    
      primaryButton: {
        width: '100%' as const,
        backgroundColor: theme.colors.primary.main,
        color: theme.colors.text.inverse,
        marginBottom: theme.spacing.md,
      },
    
      primaryText: {
        color: theme.colors.text.inverse,
        fontWeight: theme.typography.weight.semibold,
      },
    
      secondaryRow: {
        flexDirection: "row" as const,
        gap: theme.spacing.sm,
        width: '100%' as const,
        paddingRight: theme.spacing.sm,
        paddingLeft: 0,
      },
    
      secondaryButton: {
        borderWidth: 1 as const,
        borderColor: theme.colors.border.light,
        width: '100%' as const,
      },
    
      dangerButton: {
        borderWidth: 1 as const,
        borderColor: theme.colors.financial.expense,
        color: theme.colors.financial.expense,
        width: '100%' as const,
      },    
  };
}; 