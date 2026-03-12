import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from './ThemeProvider'
import type { AppTheme } from './theme'

type Styles = Record<string, any>

export function createStyles<T extends Styles>(
  factory: (theme: AppTheme) => T
) {
  return function useStyles(): T {
    const { theme } = useTheme()

    return useMemo(
      () => StyleSheet.create(factory(theme)),
      [theme]
    )
  }
}