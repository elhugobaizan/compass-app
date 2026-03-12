import { BaseStylesProps } from "../../types";

// Para Add y Update
export const baseFormStylesConfig = (theme: any, props?: BaseStylesProps) => {
  const { isMobile = false } = props || {};
  return {
    buttonSection: {
      marginTop: theme.spacing.card,
      textAlign: "right" as const,
      marginBottom: theme.spacing.card,
    },
    button: {
      backgroundColor: theme.colors.primary.link,
      width: isMobile ? ('100%' as const) : ('auto' as const),
      textTransform: 'uppercase' as const,
      fontWeight: theme.typography.weight.semibold,
      color: theme.colors.text.inverse,
      height: (44 as const),
    },
    buttonContainer: {
      position: "fixed" as const,
      bottom: 64 as const,
      left: 0 as const,
      right: 0 as const,
      padding: 16 as const,
      background: theme.colors.background.card,
      borderTop: `1px solid ${theme.colors.neutral[200]}`,
    },
    fieldContainer: {
      flexDirection: 'row' as const,
      marginVertical: theme.spacing.md,
      alignItems: 'center' as const,
      gap: theme.spacing.sm,
      flexWrap: 'wrap' as const,
    },    
    input: {
      width: "100%",
    },
    select: {
      width: "100%",
    },
    label: {
      flex: 2 as const,
      minWidth: 110 as const,
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.semibold,
      color: theme.colors.text.primary,
    },    
    hint: {
      minWidth: 110 as const,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.weight.regular,
      color: theme.colors.text.muted,
      marginTop: -8,
    },      
    container: {
      maxWidth: '720px' as const,
      marginHorizontal: 0 as const,
      marginVertical: 'auto' as const,
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background.card,
      paddingBottom: isMobile? 96 as const : (0 as const),
      alignSelf: 'center' as const,
      width: '100%' as const,
      height: '100%' as const,
    },
    section: {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.card,
      boxShadow: '0 2px 8px ' + theme.colors.overlay.light,
    }, 
    sectionContent: { 
      display: "flex" as const, 
      flexDirection: "column" as const, 
      gap: theme.spacing.xxl,
    },
    title: {
      fontSize: theme.typography.size.xl,
      fontWeight: theme.typography.weight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.xl,
    },
    subtitle: {
      fontSize: theme.typography.size.md,
      color: theme.colors.text.muted,
      marginBottom: theme.spacing.card,
    }
  }
};