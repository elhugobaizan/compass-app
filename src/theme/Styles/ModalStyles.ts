import { BaseStylesProps } from "../../types";

export const baseModalStylesConfig = (theme: any, props?: BaseStylesProps) => {
  return {
    backdrop: {
      height: '100%' as const,
      backgroundColor: theme.colors.overlay.light,
    },
    simpleView: {
      backgroundColor: theme.colors.background.card,
      height: '25%' as const,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      position: 'absolute' as const,
      bottom: 0,
      width: '100%' as const,
    },
    expandedView: {
      backgroundColor: theme.colors.background.card,
      maxHeight: '85%' as const,
      minHeight: 280 as const,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      position: 'absolute' as const,
      bottom: 0 as const,
      left: 0 as const,
      right: 0 as const,
      width: '100%' as const,
    },
    body: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      minHeight: 0,
    },
    sectionTitle: {
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.medium,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase' as const,
      letterSpacing: 1 as const,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.md,
    },
    footer: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'flex-end' as const,
      alignItems: 'center' as const,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1 as const,
      borderTopColor: theme.colors.border.light,
    },
    centerView: {
      backgroundColor: theme.colors.background.card,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 350,
      height: 300,
      marginLeft: -175,
      marginTop: -150,
    },
    leftSidebar: {
      height: '100%',
      backgroundColor: theme.colors.background.card,
      position: 'absolute',
      top: 0,
      width: '50%'
    },
    leftSidebarTitle: {
      height: 65,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: theme.colors.background.app,
      color: theme.colors.text.inverse,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      height: '20%' as const,
      paddingHorizontal: theme.spacing.xl,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      backgroundColor: theme.colors.background.header,
      color: theme.colors.text.inverse,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      minHeight: 56 as const
    },
    titleButtons: {
      color: theme.colors.text.inverse
    },
    actionButtons: {
      flexDirection: 'row',
      marginTop: theme.spacing.xl,
      gap: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    button: {
      backgroundColor: theme.colors.primary.main,
      color: theme.colors.text.inverse
    },
    titleText: {
      fontSize: theme.typography.size.lg,
      fontWeight: theme.typography.weight.semibold,
      color: theme.colors.text.inverse,
    },
    bodyText: {
      fontSize: theme.typography.size.md,
      color: theme.colors.text.secondary,
    },
  }
};