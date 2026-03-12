// Configuración base de estilos (objetos reutilizables)
export const basePageStylesConfig = (theme: any) => ({
  pageContainer: {
    justifyContent: 'flex-start' as const,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    backgroundColor: theme.colors.background.app,
    flexGrow: 1,
  },  
  noItemsMessage: {
    marginVertical: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    textAlign: 'center' as any,
  },
});